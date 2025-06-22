const express = require('express');
const mysql = require('mysql2/promise'); // Wichtig: /promise für Promise-basierte Abfragen
const path = require('path');
const fs = require('fs').promises; // Importiere fs.promises zum Lesen von Dateien
const app = express();
const port = 3000;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Datenbankkonfiguration für die Verbindung
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    // Die 'database'-Option wird hier nicht gesetzt, da wir uns initial ohne spezifische DB verbinden
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true // Erlaubt das Ausführen mehrerer SQL-Statements in einem Query
};

// Funktion zur Initialisierung der Datenbank
async function initializeDatabase() {
    let connection;
    try {
        // Verbinde dich mit MySQL ohne eine spezifische Datenbank
        // um CREATE-Befehle ausführen zu können
        connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            multipleStatements: true // Wichtig für das Ausführen des gesamten Schema-Skripts
        });

        console.log('Datenbank wird initialisiert...');

        // Prüfe, ob die Datenbank bereits existiert
        const [rows] = await connection.query("SHOW DATABASES LIKE 'Busgesellschaft'");
        const dbExists = rows.length > 0;

        if (!dbExists) {
            // Datenbank nur erstellen, wenn sie noch nicht existiert
            await connection.query('CREATE DATABASE Busgesellschaft');
            console.log('Datenbank "Busgesellschaft" neu erstellt.');
            await connection.query('USE Busgesellschaft');
            console.log('Datenbank "Busgesellschaft" ausgewählt.');

            // Schema-Datei lesen (enthält CREATE TABLE IF NOT EXISTS und INSERTs)
            const schemaSql = await fs.readFile(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
            
            // Schema und Testdaten ausführen, da die DB gerade neu erstellt wurde
            await connection.query(schemaSql);
            console.log('Schema und Testdaten erfolgreich in die Datenbank geladen.');
        } else {
            console.log('Datenbank "Busgesellschaft" existiert bereits. Überspringe die Initialisierung des Schemas und der Testdaten.');
            // Die Verbindung auf die bereits existierende Datenbank umstellen
            await connection.query('USE Busgesellschaft');
            console.log('Datenbank "Busgesellschaft" ausgewählt.');
        }

    } catch (error) {
        console.error('FEHLER bei der Datenbankinitialisierung:', error);
        // Beende den Prozess, wenn die Datenbankinitialisierung fehlschlägt
        process.exit(1); 
    } finally {
        if (connection) {
            await connection.end(); // Verbindung schließen
        }
    }
}

// Hauptfunktion zum Starten der Anwendung
async function startApplication() {
    await initializeDatabase(); // Datenbank initialisieren

    // Erstelle den Pool für die Anwendung, nachdem die Datenbank initialisiert wurde
    // Nun mit der spezifischen Datenbank 'Busgesellschaft'
    const pool = mysql.createPool({ ...dbConfig, database: 'Busgesellschaft' });

    app.use((req, res, next) => {
        req.db = pool; // Der Pool bietet promise()-basierte Abfragen
        next();
    });

    // Routen einbinden
    const fahrtenRoutes = require('./routes/fahrten');
    app.use('/', fahrtenRoutes);

    const loginRoutes = require('./routes/login');
    app.use('/', loginRoutes);

    // Server starten
    app.listen(port, () => {
        console.log(`Server läuft auf http://localhost:${port}`);
    });
}

// Anwendung starten
startApplication();
