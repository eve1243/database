// routes/fahrten.js

const express = require('express');
const router = express.Router();

router.get('/api/fahrten-suche', async (req, res) => {
    const { abfahrtsort, zielort, datum } = req.query;
    const db = req.db;

    if (!abfahrtsort || !zielort || !datum) {
        return res.status(400).json({ message: 'Alle Suchfelder (Abfahrtsort, Zielort, Datum) sind erforderlich.' });
    }

    const sql = `
        SELECT FahrtNR, Datum, Abfahrtsort, Zielort, Abfahrtszeit, Ankunftszeit
        FROM Fahrt
        WHERE Abfahrtsort = ?
          AND Zielort = ?
          AND Datum = ?`;

    try {
        const [results] = await db.query(sql, [abfahrtsort, zielort, datum]);
        res.json(results);
    } catch (err) {
        console.error('Fehler bei der Fahrten-Suche in der Datenbank:', err);
        res.status(500).json({ message: 'Ein Serverfehler ist aufgetreten beim Suchen der Fahrten.' });
    }
});

module.exports = router;
