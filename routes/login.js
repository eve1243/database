// routes/login.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Anzahl der Runden für die Passwort-Hash-Generierung

// POST-Route für den Login
router.post('/api/login', async (req, res) => {
    const { username, password, userType } = req.body; // username ist hier die SVNR

    const db = req.db; // Pool für Promise-basierte Abfragen

    const findPersonSql = `SELECT SVNR, Passwort, Vorname, Nachname FROM Person WHERE SVNR = ?`;

    try {
        const [results] = await db.query(findPersonSql, [username]);

        if (results.length === 0) {
            // Benutzer (SVNR) nicht gefunden -> Registrierung anbieten
            return res.status(404).json({ message: 'Benutzer nicht gefunden. Möchten Sie sich registrieren?', userNotFound: true });
        }

        const person = results[0];
        // Überprüfe, ob das Passwort-Feld in der Datenbank NULL ist oder einen leeren String enthält
        if (!person.Passwort || person.Passwort.trim() === '') {
            return res.status(401).json({ message: 'Passwort nicht gesetzt oder ungültig für diesen Benutzer.' });
        }
        const hashedPassword = person.Passwort;


        // Passwort vergleichen
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Ungültiges Passwort.' });
        }

        // Passwort stimmt überein, jetzt prüfen, ob der Benutzer der angegebene Typ ist
        let userSpecificData = null;
        let roleCheckSql = '';
        let roleIdField = '';

        if (userType === 'guest') {
            roleCheckSql = `SELECT GästeNR FROM Reisegast WHERE SVNR = ?`;
            roleIdField = 'GästeNR';
        } else if (userType === 'employee') {
            roleCheckSql = `SELECT AngestelltenNR FROM Angestellte WHERE SVNR = ?`;
            roleIdField = 'AngestelltenNR';
        } else {
            return res.status(400).json({ message: 'Ungültiger Benutzertyp angegeben.' });
        }

        const [roleResults] = await db.query(roleCheckSql, [username]);

        if (roleResults.length === 0) {
            // Benutzer existiert, aber nicht als der angegebener Typ
            return res.status(403).json({ message: `Benutzer ist nicht als ${userType} registriert.` });
        }

        // Erfolgreicher Login
        userSpecificData = {
            svnr: person.SVNR,
            vorname: person.Vorname,
            nachname: person.Nachname,
            userType: userType,
            roleId: roleResults[0][roleIdField] // GästeNR oder AngestelltenNR
        };
        res.json({ message: 'Login erfolgreich', user: userSpecificData });

    } catch (err) {
        console.error('Fehler bei der Login-Verarbeitung:', err);
        // Generischer 500er Fehler für unerwartete Datenbankfehler
        res.status(500).json({ message: 'Serverfehler beim Login.' });
    }
});

// POST-Route für die Registrierung
router.post('/api/register', async (req, res) => {
    const { svnr, password, vorname, nachname, ort, plz, hausnummer, strasse, userType } = req.body;

    const db = req.db;

    // Grundlegende Validierung
    if (!svnr || !password || !vorname || !nachname || !userType) {
        return res.status(400).json({ message: 'Bitte füllen Sie alle erforderlichen Felder aus.' });
    }

    try {
        // Prüfen, ob SVNR bereits existiert
        const checkSvnrSql = `SELECT SVNR FROM Person WHERE SVNR = ?`;
        const [existingUsers] = await db.query(checkSvnrSql, [svnr]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Diese Sozialversicherungsnummer (SVNR) ist bereits registriert.' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Person in die Datenbank einfügen
        const insertPersonSql = `
            INSERT INTO Person (SVNR, Vorname, Nachname, Passwort, Ort, PLZ, Hausnummer, Straße)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(insertPersonSql, [svnr, vorname, nachname, hashedPassword, ort || null, plz || null, hausnummer || null, strasse || null]);

        let roleId = null;

        if (userType === 'guest') {
            const [maxGuestIdResult] = await db.query(`SELECT MAX(GästeNR) AS maxId FROM Reisegast`);
            roleId = (maxGuestIdResult[0].maxId || 0) + 1;
            const insertGuestSql = `INSERT INTO Reisegast (GästeNR, SVNR) VALUES (?, ?)`;
            await db.query(insertGuestSql, [roleId, svnr]); // Füge Gastrolle hinzu
        } else if (userType === 'employee') {
            const [maxEmployeeIdResult] = await db.query(`SELECT MAX(AngestelltenNR) AS maxId FROM Angestellte`);
            roleId = (maxEmployeeIdResult[0].maxId || 0) + 1;
            // Angestellte brauchen Bankleitzahl und Kontonummer, aber jetzt NULLABLE.
            // Füge diese als NULL ein. Ein Admin müsste sie später hinzufügen.
            const insertEmployeeSql = `INSERT INTO Angestellte (AngestelltenNR, SVNR, Bankleitzahl, Kontonummer, Kontostand) VALUES (?, ?, NULL, NULL, 0.00)`;
            await db.query(insertEmployeeSql, [roleId, svnr]); // Füge Angestelltenrolle hinzu
        } else {
            // Wenn der userType ungültig ist, lösche die gerade erstellte Person, um Inkonsistenzen zu vermeiden.
            await db.query(`DELETE FROM Person WHERE SVNR = ?`, [svnr]);
            return res.status(400).json({ message: 'Ungültiger Benutzertyp für die Registrierung.' });
        }

        const newUser = {
            svnr: svnr,
            vorname: vorname,
            nachname: nachname,
            userType: userType,
            roleId: roleId
        };
        res.status(201).json({ message: 'Registrierung erfolgreich! Sie können sich jetzt anmelden.', user: newUser });

    } catch (err) {
        console.error('Fehler bei der Registrierung:', err);
        // Spezifischere Fehlerbehandlung für MySQL-Fehler
        if (err.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ message: 'Diese Sozialversicherungsnummer (SVNR) ist bereits registriert.' });
        }
        // Ein ER_NO_REFERENCED_ROW_2 Fehler sollte jetzt nicht mehr auftreten für Angestellte,
        // da Bankleitzahl NULL sein kann. Wenn doch, liegt ein anderes Problem vor.
        res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
    }
});

module.exports = router;
