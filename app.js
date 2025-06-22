const express = require('express');
const mysql = require('mysql2/promise'); // Wichtig: /promise für Promise-basierte Abfragen
const path = require('path');
const app = express();
const port = 3000;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'Busgesellschaft',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Verwende createPool aus 'mysql2/promise' für Promise-basierte Verbindungen
const pool = mysql.createPool(dbConfig);

app.use((req, res, next) => {
    req.db = pool; // Der Pool bietet promise()-basierte Abfragen
    next();
});

const fahrtenRoutes = require('./routes/fahrten');
app.use('/', fahrtenRoutes);

const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);


app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
