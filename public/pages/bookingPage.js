// public/pages/bookingPage.js

import { getPendingAction, clearPendingAction } from '../utils/uiController.js';

let bookingSectionElement = null;

/**
 * Initialisiert die Logik für die Buchungs-Sektion.
 * @param {HTMLElement} bookingSection - Das HTML-Element der Buchungs-Sektion.
 * @param {Object} [tripDetails=null] - Optional: Details der Fahrt, die gebucht werden soll.
 */
export function initBookingPage(bookingSection, tripDetails = null) {
    bookingSectionElement = bookingSection;

    // Inhalt der Buchungs-Sektion dynamisch aufbauen
    // Sicherstellen, dass das Formular nur einmal hinzugefügt wird oder beim Initialisieren neu aufgebaut wird.
    // Wir leeren den Inhalt immer, um sicherzustellen, dass die Details aktualisiert werden
    // und fügen das Standard-Markup wieder ein.
    bookingSectionElement.innerHTML = `
        <h2>Fahrt Buchen</h2>
        <p>Willkommen im Buchungsbereich. Hier können Sie Fahrten buchen.</p>
        <div id="booking-form-content">
            <div id="selected-trip-details">
                <h3 class="text-xl font-bold mb-4">Details der ausgewählten Fahrt:</h3>
                <div id="trip-info" class="bg-gray-100 p-4 rounded-md shadow-sm border border-gray-200">
                    <p><strong>Fahrt-Nr:</strong> <span id="booked-fahrt-nr"></span></p>
                    <p><strong>Datum:</strong> <span id="booked-datum"></span></p>
                    <p><strong>Abfahrtsort:</strong> <span id="booked-abfahrtsort"></span></p>
                    <p><strong>Zielort:</strong> <span id="booked-zielort"></span></p>
                    <p><strong>Abfahrtszeit:</strong> <span id="booked-abfahrtszeit"></span></p>
                    <p><strong>Ankunftszeit:</strong> <span id="booked-ankunftszeit"></span></p>
                </div>
                <p class="info-message mt-4">Hier würde das tatsächliche Buchungsformular erscheinen.</p>
                <button class="button mt-6">Buchung abschließen (Platzhalter)</button>
            </div>
        </div>
    `;


    // Versuche, Fahrtdetails aus `tripDetails` Parameter oder `pendingAction` zu laden
    let currentTripDetails = tripDetails;
    if (!currentTripDetails) {
        const pendingAction = getPendingAction();
        if (pendingAction && pendingAction.type === 'bookTrip' && pendingAction.tripDetails) {
            currentTripDetails = pendingAction.tripDetails;
        }
    }

    // Elemente für Fahrtdetails abrufen
    const bookedFahrtNrSpan = document.getElementById('booked-fahrt-nr');
    const bookedDatumSpan = document.getElementById('booked-datum');
    const bookedAbfahrtsortSpan = document.getElementById('booked-abfahrtsort');
    const bookedZielortSpan = document.getElementById('booked-zielort');
    const bookedAbfahrtszeitSpan = document.getElementById('booked-abfahrtszeit');
    const bookedAnkunftszeitSpan = document.getElementById('booked-ankunftszeit');
    const tripInfoDiv = document.getElementById('trip-info');
    const bookingSectionH3 = bookingSectionElement.querySelector('#selected-trip-details h3');
    const bookingSectionButton = bookingSectionElement.querySelector('#selected-trip-details .button');


    if (currentTripDetails && bookedFahrtNrSpan && tripInfoDiv) {
        bookedFahrtNrSpan.textContent = currentTripDetails.FahrtNR;
        bookedDatumSpan.textContent = new Date(currentTripDetails.Datum).toLocaleDateString('de-DE');
        bookedAbfahrtsortSpan.textContent = currentTripDetails.Abfahrtsort;
        bookedZielortSpan.textContent = currentTripDetails.Zielort;
        bookedAbfahrtszeitSpan.textContent = currentTripDetails.Abfahrtszeit;
        bookedAnkunftszeitSpan.textContent = currentTripDetails.Ankunftszeit;

        if (bookingSectionH3) bookingSectionH3.style.display = 'block';
        if (bookingSectionButton) bookingSectionButton.style.display = 'block';
        tripInfoDiv.style.display = 'block'; // Sicherstellen, dass der Detail-Container sichtbar ist
    } else {
        if (tripInfoDiv) {
            tripInfoDiv.innerHTML = '<p class="text-red-500">Keine Fahrtdetails zum Buchen gefunden.</p>';
            tripInfoDiv.style.display = 'block'; // Meldung anzeigen
        }
        if (bookingSectionH3) bookingSectionH3.style.display = 'none';
        if (bookingSectionButton) bookingSectionButton.style.display = 'none';
    }

    console.log("Buchungsseite initialisiert mit Fahrtdetails:", currentTripDetails);
}
