-- Datenbankschema für die Busgesellschaft
-- HINWEIS: Passwörter in INSERT-Statements sind Klartext NUR FÜR DIESE TESTDATEN.
-- Eine reale Anwendung würde Passwörter hashen, bevor sie eingefügt werden.

-- Tabelle: Person
CREATE TABLE Person (
    SVNR VARCHAR(20) PRIMARY KEY,       -- Sozialversicherungsnummer als Primärschlüssel
    Vorname VARCHAR(50) NOT NULL,       -- Vorname (darf nicht leer sein)
    Nachname VARCHAR(50) NOT NULL,      -- Nachname (darf nicht leer sein)
    Passwort VARCHAR(255) NOT NULL,     -- Gehashtes Passwort (wichtig: VARCHAR(255) für bcrypt)
    Ort VARCHAR(50),                    -- Wohnort
    PLZ VARCHAR(10),                    -- Postleitzahl
    Hausnummer VARCHAR(10),             -- Hausnummer
    Straße VARCHAR(50)                  -- Straße
);

-- Tabelle: Personen_Telefonnummer
-- Speichert Telefonnummern für Personen (eine Person kann mehrere Nummern haben).
CREATE TABLE Personen_Telefonnummer (
    Telefonnummer VARCHAR(20) NOT NULL, -- Die Telefonnummer
    SVNR VARCHAR(20) NOT NULL,          -- Fremdschlüssel zur Person (SVNR)
    PRIMARY KEY (Telefonnummer, SVNR),  -- Zusammengesetzter Primärschlüssel
    FOREIGN KEY (SVNR) REFERENCES Person(SVNR) -- Referenziert die Personentabelle
);

-- Tabelle: Bank
-- Speichert Informationen über Banken.
CREATE TABLE Bank (
    Bankleitzahl VARCHAR(20) PRIMARY KEY,           -- Bankleitzahl
    Bankname VARCHAR(100) NOT NULL UNIQUE              -- Name der Bank
);

-- Tabelle: Angestellte
-- Spezialisierung von Person für Angestellte.
-- Bankleitzahl und Kontonummer sind jetzt NULLABLE.
CREATE TABLE Angestellte (
    AngestelltenNR INT PRIMARY KEY,     -- Eindeutige Angestelltennummer
    SVNR VARCHAR(20) NOT NULL UNIQUE,   -- Fremdschlüssel zur Person (SVNR), UNIQUE
    Bankleitzahl VARCHAR(20) NULL,      -- Ehemals NOT NULL, jetzt NULLABLE
    Kontonummer VARCHAR(22) NULL,       -- Ehemals NOT NULL, jetzt NULLABLE
    Kontostand DECIMAL(10,2),
    FOREIGN KEY (SVNR) REFERENCES Person(SVNR),
    FOREIGN KEY (Bankleitzahl) REFERENCES Bank(Bankleitzahl) -- FK bleibt, kann aber NULL sein
);

-- Tabelle: Reisegast
-- Spezialisierung von Person für Reisegäste.
CREATE TABLE Reisegast (
    GästeNR INT PRIMARY KEY,            -- Eindeutige Gästenummer
    SVNR VARCHAR(20) NOT NULL UNIQUE,   -- Fremdschlüssel zur Person (SVNR), UNIQUE
    FOREIGN KEY (SVNR) REFERENCES Person(SVNR)
);

-- Tabelle: Hersteller
-- Speichert Hersteller von Bussen.
CREATE TABLE Hersteller (
    Name VARCHAR(100) PRIMARY KEY      -- Name des Herstellers
);

-- Tabelle: Bustyp
-- Speichert verschiedene Bustypen und deren Eigenschaften.
CREATE TABLE Bustyp (
    Typennummer VARCHAR(20) PRIMARY KEY,    -- Eindeutige Typennummer des Busses
    Typenbezeichnung VARCHAR(100) NOT NULL, -- Bezeichnung des Bustyps
    Gepäckraumvolumen INT NOT NULL,         -- Volumen des Gepäckraums in Litern
    Sitzplatz INT NOT NULL,                 -- Anzahl der Sitzplätze
    Name VARCHAR(100) NOT NULL,             -- Fremdschlüssel zum Hersteller (Name)
    FOREIGN KEY (Name) REFERENCES Hersteller(Name)
);

-- Tabelle: Techniker
-- Spezialisierung von Angestellte für Techniker.
CREATE TABLE Techniker (
    LizenzNR VARCHAR(20) PRIMARY KEY,               -- Lizenznummer des Technikers
    Ausbildungsgrad VARCHAR(50),                    -- Ausbildungsgrad (z.B. Junior, Senior)
    AngestelltenNR INT NOT NULL,                    -- Fremdschlüssel zum Angestellten
    Typennummer VARCHAR(20) NOT NULL,               -- Fremdschlüssel zum Bustyp (was der Techniker warten kann)
    FOREIGN KEY (AngestelltenNR) REFERENCES Angestellte(AngestelltenNR),
    FOREIGN KEY (Typennummer) REFERENCES Bustyp(Typennummer)
);

-- Tabelle: Chauffeur
-- Spezialisierung von Angestellte für Chauffeure.
CREATE TABLE Chauffeur (
    AngestelltenNR INT PRIMARY KEY,             -- Angestelltennummer als PK und FK zu Angestellte
    FührerscheinNR VARCHAR(20) UNIQUE NOT NULL, -- Führerscheinnummer (eindeutig und nicht leer)
    Kilometer INT,                              -- Gesamtkilometer des Chauffeurs
    FOREIGN KEY (AngestelltenNR) REFERENCES Angestellte(AngestelltenNR)
);

-- Tabelle: Fahrt
-- Speichert Details zu einzelnen Busfahrten.
CREATE TABLE Fahrt (
    FahrtNR INT PRIMARY KEY AUTO_INCREMENT,     -- Eindeutige Fahrtnummer, automatisch hochzählbar
    Datum DATE NOT NULL,                        -- Datum der Fahrt
    Abfahrtsort VARCHAR(100) NOT NULL,          -- Abfahrtsort
    Zielort VARCHAR(100) NOT NULL,              -- Zielort
    Abfahrtszeit TIME NOT NULL,                 -- Geplante Abfahrtszeit
    Ankunftszeit TIME NOT NULL                  -- Geplante Ankunftszeit
);

-- Tabelle: Bus
-- Speichert Informationen zu einzelnen Bussen.
CREATE TABLE Bus (
    InventarNR VARCHAR(20) PRIMARY KEY,     -- Eindeutige Inventarnummer des Busses
    Fertigungsjahr INT,                     -- Baujahr des Busses
    Kilometer INT,                          -- Aktueller Kilometerstand
    Typennummer VARCHAR(20) NOT NULL,       -- Fremdschlüssel zum Bustyp
    FahrtenschreiberCode VARCHAR(20) UNIQUE, -- Fahrtenschreiber Code (UNIQUE)
    Aktueller_Entleiher_AngestelltenNR INT NULL, -- Wer den Bus gerade entliehen hat (NULLABLE)
    Entleihungszeitpunkt DATETIME NULL,          -- Wann der Bus entliehen wurde (NULLABLE)
    FOREIGN KEY (Typennummer) REFERENCES Bustyp(Typennummer),
    FOREIGN KEY (Aktueller_Entleiher_AngestelltenNR) REFERENCES Angestellte(AngestelltenNR)
);

-- Tabelle: Buchung
-- Speichert Details zu Passagierbuchungen.
CREATE TABLE Buchung (
    BuchungsNR INT PRIMARY KEY AUTO_INCREMENT,        -- Eindeutige Buchungsnummer
    Buchungsdatum DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Zeitpunkt der Buchung
    Sitzplatznummer VARCHAR(10) NULL,                 -- Optional: Spezifische Sitzplatznummer
    AnzahlSitzplaetze INT NOT NULL DEFAULT 1,         -- Anzahl der gebuchten Plätze
    Klasse VARCHAR(50),                               -- Buchungsklasse
    GästeNR INT NOT NULL,                             -- Fremdschlüssel zum Reisegast
    FahrtNR INT NOT NULL,                             -- Fremdschlüssel zur Fahrt
    FOREIGN KEY (GästeNR) REFERENCES Reisegast(GästeNR),
    FOREIGN KEY (FahrtNR) REFERENCES Fahrt(FahrtNR)
);

-- Tabelle: fährt (Zuweisung Bustyp/Chauffeur zu Fahrt)
CREATE TABLE fährt (
    Typennummer VARCHAR(20),                -- Fremdschlüssel zum Bustyp
    FahrtNR INT,                            -- Fremdschlüssel zur Fahrt
    FührerscheinNR VARCHAR(20),             -- Fremdschlüssel zum Chauffeur
    PRIMARY KEY (Typennummer, FahrtNR, FührerscheinNR),
    FOREIGN KEY (Typennummer) REFERENCES Bustyp(Typennummer),
    FOREIGN KEY (FahrtNR) REFERENCES Fahrt(FahrtNR),
    FOREIGN KEY (FührerscheinNR) REFERENCES Chauffeur(FührerscheinNR)
);

-- Tabelle: schliesst_an (Anschlussfahrten)
CREATE TABLE schliesst_an (
    FahrtNR_Vorher INT NOT NULL,        -- Die Fahrt, von der angeschlossen wird
    FahrtNR_Nachher INT NOT NULL,       -- Die Fahrt, an die angeschlossen wird
    PRIMARY KEY (FahrtNR_Vorher, FahrtNR_Nachher),
    FOREIGN KEY (FahrtNR_Vorher) REFERENCES Fahrt(FahrtNR),
    FOREIGN KEY (FahrtNR_Nachher) REFERENCES Fahrt(FahrtNR)
);


-- Logische INSERT-Statements für das Datenbankschema
-- WICHTIG: Die hier gezeigten Passwörter sind nur Beispiele für bcrypt-Hashes!
-- In einer echten Anwendung müssten die Passwörter gehasht werden, BEVOR sie eingefügt werden.
-- Für die Testzwecke kannst du ein Online-Bcrypt-Hash-Tool verwenden, um Hashes für z.B. "password123" zu generieren,
-- oder du registrierst dich einfach über die App, um gehashte Passwörter zu erzeugen.

INSERT INTO Person (SVNR, Vorname, Nachname, Passwort, Ort, PLZ, Hausnummer, Straße) VALUES
-- Beispiel-Hashes für ein einfaches Passwort wie "password123"
('1234567890', 'Max', 'Mustermann', '$2b$10$B5/C.S.C.y.Q.E.G.U.I.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C', 'Berlin', '10115', '1a', 'Musterstraße'),
('0987654321', 'Erika', 'Musterfrau', '$2b$10$I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I', 'Hamburg', '20095', '5', 'Hauptweg'),
('1122334455', 'Tom', 'Schulz', '$2b$10$o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.P', 'München', '80331', '10', 'Sonnenallee'),
('2233445566', 'Anna', 'Meier', '$2b$10$K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L', 'Köln', '50667', '22b', 'Rheinstraße'),
('3344556677', 'Hans', 'Schmidt', '$2b$10$e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.F', 'Stuttgart', '70173', '7', 'Königsweg'),
('4455667788', 'Lena', 'Huber', '$2b$10$T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U', 'Dresden', '01067', '15', 'Elbufer'),
('5566778899', 'Peter', 'Klein', '$2b$10$H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I', 'Frankfurt', '60311', '3', 'Zeil'),
('6677889900', 'Sabine', 'Groß', '$2b$10$U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V', 'Leipzig', '04103', '8', 'Goethestraße'),
('7788990011', 'Moritz', 'Braun', '$2b$10$Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z', 'Nürnberg', '90402', '12', 'Kaiserstraße'),
('8899001122', 'Julia', 'Weiß', '$2b$10$P.Q.R.S.T.U.V.W.X.Y.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q', 'Düsseldorf', '40213', '6', 'Königsallee');

INSERT INTO Bank (Bankleitzahl, Bankname) VALUES
('10000000', 'Deutsche Bank'),
('20000000', 'Commerzbank'),
('30000000', 'Sparkasse Berlin'),
('40000000', 'Postbank');

-- Die Dummy Bankleitzahl '99999999' ist nicht mehr zwingend erforderlich
-- für die Registrierung von Angestellten, da die Felder NULL sein können.
-- Wenn du sie für andere Testdaten beibehalten möchtest, kannst du sie hier lassen.
-- INSERT INTO Bank (Bankleitzahl, Bankname) VALUES ('99999999', 'Dummy Bank');

INSERT INTO Angestellte (AngestelltenNR, SVNR, Bankleitzahl, Kontonummer, Kontostand) VALUES
(101, '1234567890', '10000000', 'DE12345678901234567890', 1500.50),
(102, '0987654321', '20000000', 'DE09876543210987654321', 2000.75),
(103, '1122334455', '30000000', 'DE11223344551122334455', 1200.00),
(104, '5566778899', '40000000', 'DE55667788995566778899', 1800.00);

INSERT INTO Personen_Telefonnummer (Telefonnummer, SVNR) VALUES
('017612345678', '1234567890'),
('03098765432', '1234567890'),
('015112345678', '0987654321'),
('02219876543', '2233445566'),
('06911223344', '5566778899'),
('03415566778', '6677889900');

INSERT INTO Reisegast (GästeNR, SVNR) VALUES
(201, '2233445566'),
(202, '3344556677'),
(203, '4455667788'),
(204, '6677889900'),
(205, '7788990011'),
(206, '8899001122');

-- WICHTIG: Hersteller müssen VOR Bustypen eingefügt werden!
INSERT INTO Hersteller (Name) VALUES
('Mercedes-Benz'),
('MAN'),
('Setra'),
('Volvo');

INSERT INTO Bustyp (Typennummer, Typenbezeichnung, Gepäckraumvolumen, Sitzplatz, Name) VALUES
('MB001', 'Tourismo', 8000, 50, 'Mercedes-Benz'),
('MAN002', 'Lion''s Coach', 9000, 55, 'MAN'),
('SET003', 'S 516 HD', 7500, 45, 'Setra'),
('VOL004', '9700', 8500, 52, 'Volvo');

INSERT INTO Fahrt (Datum, Abfahrtsort, Zielort, Abfahrtszeit, Ankunftszeit) VALUES
('2025-07-01', 'Berlin', 'München', '08:00:00', '16:00:00'),
('2025-07-01', 'München', 'Hamburg', '10:00:00', '18:30:00'),
('2025-07-02', 'Hamburg', 'Berlin', '09:30:00', '17:00:00'),
('2025-07-03', 'Köln', 'Stuttgart', '11:00:00', '15:00:00'),
('2025-07-04', 'Stuttgart', 'Dresden', '07:00:00', '14:00:00'),
('2025-07-05', 'Berlin', 'Frankfurt', '09:00:00', '15:30:00'),
('2025-07-05', 'Frankfurt', 'Nürnberg', '16:00:00', '19:00:00'),
('2025-07-06', 'Düsseldorf', 'Köln', '07:30:00', '08:30:00'),
('2025-07-06', 'München', 'Leipzig', '12:00:00', '20:00:00'),
('2025-07-07', 'Dresden', 'Hamburg', '08:45:00', '16:15:00'),
('2025-07-08', 'Stuttgart', 'Berlin', '10:15:00', '18:45:00'),
('2025-07-09', 'Hamburg', 'Düsseldorf', '13:00:00', '19:00:00'),
('2025-07-10', 'Leipzig', 'München', '06:00:00', '14:30:00'),
('2025-07-11', 'Nürnberg', 'Stuttgart', '09:45:00', '12:45:00'),
('2025-07-12', 'Frankfurt', 'Berlin', '11:30:00', '18:00:00');

INSERT INTO Chauffeur (AngestelltenNR, FührerscheinNR, Kilometer) VALUES
(101, 'F123456', 500000),
(102, 'F654321', 750000),
(104, 'F987654', 300000);

INSERT INTO Techniker (LizenzNR, Ausbildungsgrad, AngestelltenNR, Typennummer) VALUES
('TL001', 'Meister', 103, 'MB001'),
('TL002', 'Geselle', 103, 'MAN002');

INSERT INTO Bus (InventarNR, Fertigungsjahr, Kilometer, Typennummer, FahrtenschreiberCode, Aktueller_Entleiher_AngestelltenNR, Entleihungszeitpunkt) VALUES
('BUS001', 2020, 150000, 'MB001', 'FSMB001', 101, '2025-06-20 08:00:00'),
('BUS002', 2021, 120000, 'MAN002', 'FSMAN002', NULL, NULL),
('BUS003', 2019, 200000, 'SET003', NULL, NULL, NULL),
('BUS004', 2022, 80000, 'MB001', 'FSMB002', 102, '2025-06-21 10:30:00'),
('BUS005', 2023, 50000, 'VOL004', 'FSVOL001', 101, '2025-06-22 14:00:00');

INSERT INTO Buchung (GästeNR, FahrtNR, Buchungsdatum, Sitzplatznummer, AnzahlSitzplaetze, Klasse) VALUES
(201, 1, '2025-06-22 14:00:00', 'A1', 1, 'Economy'),
(202, 1, '2025-06-22 14:05:00', 'A2', 1, 'Economy'),
(203, 2, '2025-06-22 15:00:00', 'B1', 2, 'Business'),
(204, 5, '2025-06-23 09:00:00', 'C3', 1, 'Economy'),
(205, 6, '2025-06-23 10:30:00', 'D1', 1, 'Business');

INSERT INTO fährt (Typennummer, FahrtNR, FührerscheinNR) VALUES
('MB001', 1, 'F123456'),
('MAN002', 2, 'F654321'),
('SET003', 3, 'F123456'),
('VOL004', 5, 'F987654');

INSERT INTO schliesst_an (FahrtNR_Vorher, FahrtNR_Nachher) VALUES
(1, 2),
(3, 4),
(6, 7),
(9, 10);
