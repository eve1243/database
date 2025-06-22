// routes/fahrten.js

const express = require('express');
const router = express.Router();

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
    // Korrigiert: Der Tabellenname 'Fahrten' wurde zu 'Fahrt' geändert,
    // um dem Datenbankschema zu entsprechen.
    const sql = `
        SELECT *
        FROM Fahrt
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
