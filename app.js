// app.js

// Erforderliche Module importieren
const express = require('express');    // Express-Framework für den Webserver
const mysql = require('mysql2');       // MySQL-Treiber für die Datenbankverbindung
const dotenv = require('dotenv');      // dotenv zum Laden von Umgebungsvariablen aus .env
const path = require('path');          // Pfad-Modul zum Arbeiten mit Dateipfaden

// Routen importieren
// Diese Datei enthält die Definitionen für API-Endpunkte, wie z.B. die Fahrten-Suche.
const fahrtenRoutes = require('./routes/fahrten');

// Umgebungsvariablen aus der .env-Datei laden
// Dies muss am Anfang geschehen, damit process.env die Variablen enthält.
dotenv.config();

// Express-Anwendung initialisieren
const app = express();

// Middleware zum Ausliefern statischer Dateien
// Alle Dateien im 'public'-Ordner (z.B. index.html, style.css, script.js)
// werden direkt vom Browser abrufbar gemacht.
app.use(express.static(path.join(__dirname, 'public')));

// Middleware zum Parsen von Anfragetypen
// - express.json(): Parsed JSON-formatierte Anfragen (z.B. von Fetch-Requests im Frontend).
app.use(express.json());
// - express.urlencoded(): Parsed URL-codierte Daten (z.B. von HTML-Formularen).
app.use(express.urlencoded({ extended: true }));

// Datenbankverbindung konfigurieren
// Die Zugangsdaten werden sicher aus den Umgebungsvariablen geladen.
const db = mysql.createConnection({
    host: process.env.DB_HOST,     // Host der Datenbank (z.B. 'localhost' oder eine IP)
    user: process.env.DB_USER,     // Benutzername für den Datenbankzugriff
    password: process.env.DB_PASS, // Passwort für den Datenbankbenutzer
    database: process.env.DB_NAME  // Name der Datenbank, mit der verbunden werden soll
});

// Verbindung zur Datenbank herstellen
db.connect(err => {
    if (err) {
        // Bei einem Fehler: Fehlermeldung loggen und die Anwendung beenden,
        // da die Datenbankverbindung essentiell für den Betrieb ist.
        console.error('Fehler bei der Datenbankverbindung:', err);
        process.exit(1); // Beendet den Node.js-Prozess mit einem Fehlercode
    }
    // Erfolgsmeldung, wenn die Verbindung hergestellt wurde.
    console.log('Verbindung zur Datenbank erfolgreich hergestellt.');
});

// Middleware zum Anhängen der Datenbankverbindung an das Request-Objekt (req)
// Dies macht die 'db'-Instanz in allen nachfolgenden Routen und Middlewares verfügbar.
app.use((req, res, next) => {
    req.db = db; // Fügt das 'db'-Objekt zum 'req'-Objekt hinzu
    next();      // Wichtig: Ruft die nächste Middleware oder Route in der Kette auf
});

// Definition der Hauptroute ("/")
// Wenn der Server auf der Basis-URL aufgerufen wird, wird die 'index.html' aus dem 'public'-Ordner gesendet.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Routen aus der 'fahrtenRoutes'-Datei verwenden
// Alle in 'routes/fahrten.js' definierten Routen werden nun unter dem Root-Pfad '/' eingebunden.
// Dies bedeutet, dass z.B. '/api/fahrten-suche' aus 'fahrtenRoutes' direkt unter dieser URL erreichbar ist.
app.use('/', fahrtenRoutes);

// Port, auf dem der Server lauschen soll
// Der Port wird aus den Umgebungsvariablen (.env) geladen, Standard ist 3000.
const port = process.env.PORT || 3000;

// Den Express-Server starten
app.listen(port, () => {
    // Konsolenausgabe beim Start des Servers.
    console.log(`Server läuft auf http://localhost:${port}`);
    console.log(`Besuche deine Anwendung unter: http://localhost:${port}`);
});
