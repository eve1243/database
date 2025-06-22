// routes/fahrten.js

const express = require('express');
const router = express.Router();
// const DbQueries = require('../db/queries'); // Wenn du die Datenbankabfragen in db/queries.js auslagerst

// Route für die Fahrten-Suche
// Diese Route empfängt GET-Anfragen an /api/fahrten-suche mit Query-Parametern
// für Abfahrtsort, Zielort und Datum.
router.get('/api/fahrten-suche', (req, res) => {
    // Parameter aus der Anfrage extrahieren
    const { abfahrtsort, zielort, datum } = req.query;
    // Die Datenbankverbindung, die in app.js an das Request-Objekt angehängt wurde.
    const db = req.db;

    // Optional: Einfache Serverseitige Validierung der Eingaben
    if (!abfahrtsort || !zielort || !datum) {
        return res.status(400).json({ message: 'Alle Suchfelder (Abfahrtsort, Zielort, Datum) sind erforderlich.' });
    }

    // SQL-Abfrage zum Suchen von Fahrten in der Datenbank
    // Verwende Platzhalter (?) um SQL-Injections zu vermeiden.
    const sql = `
        SELECT *
        FROM Fahrten
        WHERE Abfahrtsort = ?
          AND Zielort = ?
          AND Datum = ?`;

    // Führe die Datenbankabfrage aus
    db.query(sql, [abfahrtsort, zielort, datum], (err, results) => {
        if (err) {
            // Bei einem Datenbankfehler, diesen auf der Konsole loggen
            console.error('Fehler bei der Fahrten-Suche in der Datenbank:', err);
            // Eine Status-500-Fehlermeldung an den Client senden
            return res.status(500).json({ message: 'Ein Serverfehler ist aufgetreten beim Suchen der Fahrten.' });
        }
        // Wenn die Abfrage erfolgreich war, die gefundenen Fahrten als JSON zurücksenden.
        res.json(results);
    });
});

// Exportiere den Router, damit er in app.js verwendet werden kann
module.exports = router;
