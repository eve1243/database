// public/pages/fahrtenSuchePage.js

import { getCurrentUser, setPendingAction } from '../utils/uiController.js';

/**
 * Initialisiert die Logik für die Fahrten-Suche-Sektion.
 * @param {HTMLElement} searchSection - Das HTML-Element der Fahrten-Suche-Sektion.
 * @param {HTMLElement} fahrtenSucheMessageElement - Das HTML-Element für Such-Nachrichten.
 * @param {HTMLElement} fahrtenResultsDiv - Das HTML-Element für Suchergebnisse.
 * @param {Function} showSectionCallbackFromMain - Die Funktion zum Umschalten der Sektionen (aus script.js).
 */
export function initFahrtenSuchePage(searchSection, fahrtenSucheMessageElement, fahrtenResultsDiv, showSectionCallbackFromMain) {
    const fahrtenSucheForm = searchSection.querySelector('#fahrten-suche-form');
    const abfahrtsortInput = searchSection.querySelector('#abfahrtsort');
    const zielortInput = searchSection.querySelector('#zielort');
    const datumInput = searchSection.querySelector('#datum');

    if (!fahrtenSucheForm || !abfahrtsortInput || !zielortInput || !datumInput || !fahrtenResultsDiv) {
        console.error("Fehler: Fahrten-Suche-Formular-Elemente oder Ergebnisse-Div nicht gefunden in fahrtenSuchePage.js.");
        return;
    }

    fahrtenSucheForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        fahrtenSucheMessageElement.textContent = '';
        fahrtenSucheMessageElement.classList.remove('error', 'success', 'info-message');
        fahrtenResultsDiv.innerHTML = ''; // Vorherige Ergebnisse leeren

        const abfahrtsort = abfahrtsortInput.value;
        const zielort = zielortInput.value;
        const datum = datumInput.value;

        if (!abfahrtsort || !zielort || !datum) {
            fahrtenSucheMessageElement.textContent = 'Bitte füllen Sie alle Suchfelder aus.';
            fahrtenSucheMessageElement.classList.add('error');
            return;
        }

        try {
            const response = await fetch(`/api/fahrten-suche?abfahrtsort=${encodeURIComponent(abfahrtsort)}&zielort=${encodeURIComponent(zielort)}&datum=${encodeURIComponent(datum)}`);
            const data = await response.json();

            if (response.ok) {
                if (data.length > 0) {
                    data.forEach(fahrt => {
                        const fahrtDiv = document.createElement('div');
                        fahrtDiv.classList.add('fahrt-item');
                        fahrtDiv.innerHTML = `
                            <p><strong>Fahrt-Nr:</strong> ${fahrt.FahrtNR}</p>
                            <p><strong>Datum:</strong> ${new Date(fahrt.Datum).toLocaleDateString('de-DE')}</p>
                            <p><strong>Abfahrtsort:</strong> ${fahrt.Abfahrtsort}</p>
                            <p><strong>Zielort:</strong> ${fahrt.Zielort}</p>
                            <p><strong>Abfahrtszeit:</strong> ${fahrt.Abfahrtszeit}</p>
                            <p><strong>Ankunftszeit:</strong> ${fahrt.Ankunftszeit}</p>
                            <button class="button book-trip-btn"
                                data-fahrt-nr="${fahrt.FahrtNR}"
                                data-abfahrtsort="${fahrt.Abfahrtsort}"
                                data-zielort="${fahrt.Zielort}"
                                data-datum="${fahrt.Datum}"
                                data-abfahrtszeit="${fahrt.Abfahrtszeit}"
                                data-ankunftszeit="${fahrt.Ankunftszeit}">
                                Fahrt buchen
                            </button>
                        `;
                        fahrtenResultsDiv.appendChild(fahrtDiv);
                    });
                    fahrtenSucheMessageElement.textContent = 'Fahrten gefunden.';
                    fahrtenSucheMessageElement.classList.add('success');
                    addBookingButtonListeners(showSectionCallbackFromMain); // showSectionCallback übergeben
                } else {
                    fahrtenSucheMessageElement.textContent = 'Keine Fahrten für die ausgewählte Route gefunden.';
                    fahrtenSucheMessageElement.classList.add('info-message');
                }
            } else {
                fahrtenSucheMessageElement.textContent = data.message || 'Ein Fehler ist aufgetreten beim Suchen der Fahrten.';
                fahrtenSucheMessageElement.classList.add('error');
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Fahrten:', error);
            fahrtenSucheMessageElement.textContent = 'Netzwerkfehler oder Server nicht erreichbar.';
            fahrtenSucheMessageElement.classList.add('error');
        }
    });

    /**
     * Fügt Event-Listener zu allen 'Fahrt buchen'-Buttons hinzu.
     * @param {Function} showSectionCallback - Die Funktion zum Umschalten der Sektionen.
     */
    function addBookingButtonListeners(showSectionCallback) {
        document.querySelectorAll('.book-trip-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const fahrtDetails = {
                    FahrtNR: e.target.dataset.fahrtNr,
                    Abfahrtsort: e.target.dataset.abfahrtsort,
                    Zielort: e.target.dataset.zielort,
                    Datum: e.target.dataset.datum,
                    Abfahrtszeit: e.target.dataset.abfahrtszeit,
                    Ankunftszeit: e.target.dataset.ankunftszeit
                };

                const user = getCurrentUser();

                if (!user) {
                    setPendingAction({ type: 'bookTrip', tripDetails: fahrtDetails });
                    showSectionCallback('login-section'); // showSectionCallback direkt aufrufen
                    alert('Bitte melden Sie sich an, um diese Fahrt zu buchen.');
                } else if (user.userType === 'guest') {
                    setPendingAction({ type: 'bookTrip', tripDetails: fahrtDetails }); // Speichere Details für Buchungsseite
                    showSectionCallback('booking-section', fahrtDetails); // Übergabe direkt an showSection
                } else if (user.userType === 'employee') {
                    alert('Als Angestellter können Sie keine Fahrten buchen. Sie können den Verwaltungsbereich nutzen.');
                }
            });
        });
    }
}
