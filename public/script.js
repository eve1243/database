// public/script.js

// Importiere die Initialisierungsfunktion für die Fahrten-Suchseite
// Diese Datei dient als zentraler Einstiegspunkt für das Frontend-JavaScript.
import { initFahrtenSuche } from './pages/fahrten-suche.js';

document.addEventListener('DOMContentLoaded', () => {
    // Diese Funktion wird ausgeführt, sobald der DOM vollständig geladen ist.
    console.log('Frontend Haupt-JavaScript geladen und bereit.');

    // Rufe die Initialisierungsfunktion für die Fahrten-Suchseite auf.
    // Dies stellt sicher, dass die Logik für das Suchformular und die Anzeige der Ergebnisse aktiviert wird.
    initFahrtenSuche();

    // Hier könnten zukünftig weitere Initialisierungen für andere Seiten oder globale Komponenten folgen.
    // Zum Beispiel, wenn du eine Buchungsseite oder einen Login-Bereich hast:
    // import { initBuchungsPage } from './pages/buchung.js';
    // initBuchungsPage();
    //
    // import { initLoginForm } from './components/login-form.js';
    // initLoginForm();
});
