// public/pages/fahrten-suche.js

// Diese Funktion initialisiert die Logik für die Fahrten-Suchseite
export function initFahrtenSuche() {
    console.log('Fahrten-Suche Modul initialisiert.');

    // Elemente vom HTML-Dokument holen
    const fahrtenSuchForm = document.getElementById('fahrtensuch-form');
    const fahrtenListe = document.getElementById('fahrten-liste');
    const fahrtenErgebnisseSection = document.getElementById('fahrten-ergebnisse');
    const fahrtenErgebnisseHeader = fahrtenErgebnisseSection.querySelector('h2');
    const noResultsMessage = document.getElementById('no-results-message');

    // Event-Listener für das Absenden des Suchformulars
    if (fahrtenSuchForm) {
        fahrtenSuchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Standard-Formular-Absendeverhalten verhindern

            // Formulardaten sammeln
            const abfahrtsort = document.getElementById('abfahrtsort').value;
            const zielort = document.getElementById('zielort').value;
            const datum = document.getElementById('datum').value;

            // Optional: Einfache Validierung der Eingaben
            if (!abfahrtsort || !zielort || !datum) {
                // Ersetze alert mit einer besseren UI-Nachricht in einer echten Anwendung
                alert('Bitte fülle alle Felder aus!');
                return;
            }

            // Anfrage an die Express-API senden
            const apiUrl = `/api/fahrten-suche?abfahrtsort=${encodeURIComponent(abfahrtsort)}&zielort=${encodeURIComponent(zielort)}&datum=${encodeURIComponent(datum)}`;

            try {
                // Fetch-Anfrage an den Server
                const response = await fetch(apiUrl);

                // Prüfen, ob die Antwort erfolgreich war (Status 200 OK)
                if (!response.ok) {
                    throw new Error(`HTTP Fehler! Status: ${response.status}`);
                }

                // Antwort als JSON parsen
                const fahrten = await response.json();

                // Vorherige Ergebnisse löschen
                fahrtenListe.innerHTML = '';
                fahrtenErgebnisseHeader.classList.add('hidden');
                noResultsMessage.classList.add('hidden');

                if (fahrten.length > 0) {
                    // Header sichtbar machen, wenn Ergebnisse vorhanden sind
                    fahrtenErgebnisseHeader.classList.remove('hidden');
                    // Ergebnisse in die Liste einfügen
                    fahrten.forEach(fahrt => {
                        const listItem = document.createElement('li');
                        // Beispielhaftes Anzeigen der Fahrtinformationen
                        listItem.innerHTML = `
                            <p><strong>Fahrt:</strong> ${fahrt.Abfahrtsort} &rarr; ${fahrt.Zielort}</p>
                            <p><strong>Datum:</strong> ${new Date(fahrt.Datum).toLocaleDateString()}</p>
                            <p><strong>Uhrzeit:</strong> ${fahrt.Abfahrtszeit} - ${fahrt.Ankunftszeit}</p>
                            <p><strong>Preis:</strong> ${fahrt.Preis ? fahrt.Preis.toFixed(2) + ' €' : 'N/A'}</p>
                            <button class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200 mt-2">
                                Buchen
                            </button>
                        `;
                        fahrtenListe.appendChild(listItem);
                    });
                } else {
                    // Nachricht anzeigen, wenn keine Fahrten gefunden wurden
                    noResultsMessage.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Fahrten:', error);
                // Benutzerfreundliche Fehlermeldung anzeigen
                // Ersetze alert mit einer besseren UI-Nachricht in einer echten Anwendung
                alert('Ein Fehler ist aufgetreten beim Suchen der Fahrten. Bitte versuche es später noch einmal.');
            }
        });
    }
}
