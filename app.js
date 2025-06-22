// app.js

// Erforderliche Module importieren
const express = require('express'); // Express-Framework für den Webserver
const mysql = require('mysql2');    // MySQL-Treiber für die Datenbankverbindung
const dotenv = require('dotenv');   // dotenv zum Laden von Umgebungsvariablen aus .env

// Umgebungsvariablen aus der .env-Datei laden
dotenv.config();

// Express-Anwendung initialisieren
const app = express();

// Middleware zum Parsen von JSON-Anfragen im Request Body (falls benötigt)
app.use(express.json());
// Middleware zum Parsen von URL-codierten Daten (z.B. von HTML-Formularen)
app.use(express.urlencoded({ extended: true }));

// Datenbankverbindung konfigurieren
// Die Zugangsdaten werden aus den Umgebungsvariablen geladen
const db = mysql.createConnection({
    host: process.env.DB_HOST,     // Host der Datenbank (z.B. localhost)
    user: process.env.DB_USER,     // Benutzername für die Datenbank
    password: process.env.DB_PASS, // Passwort für den Datenbankbenutzer
    database: process.env.DB_NAME  // Name der zu verbindenden Datenbank (Busgesellschaft)
});

// Verbindung zur Datenbank herstellen
db.connect(err => {
    if (err) {
        // Bei einem Fehler die Fehlermeldung auf der Konsole ausgeben
        console.error('Fehler bei der Datenbankverbindung:', err);
        // Die Anwendung beenden, da eine Datenbankverbindung essenziell ist
        process.exit(1);
    }
    // Erfolgsmeldung auf der Konsole ausgeben
    console.log('Verbindung zur Datenbank erfolgreich hergestellt.');
});

// Eine einfache Route für die Startseite ("/") erstellen
app.get('/', (req, res) => {
    // Wenn diese Route aufgerufen wird, sende eine Bestätigung zurück
    res.send('Server läuft und Datenbankverbindung ist aktiv.');
});


// Port, auf dem der Server lauschen soll (aus .env oder Standard 3000)
const port = process.env.PORT || 3000;

// Den Express-Server starten
app.listen(port, () => {
    // Erfolgsmeldung auf der Konsole ausgeben
    console.log(`Server läuft auf http://localhost:${port}`);
    console.log(`Test-API-Route: http://localhost:${port}/api/fahrten`);
});