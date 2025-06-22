-- Logische INSERT-Statements für das Datenbankschema

-- -----------------------------------------------------------------------------
-- 1. Personen
-- -----------------------------------------------------------------------------
INSERT INTO Person (SVNR, Vorname, Nachname, Ort, PLZ, Hausnummer, Straße) VALUES
('1234567890', 'Max', 'Mustermann', 'Berlin', '10115', '1a', 'Musterstraße'),
('0987654321', 'Erika', 'Musterfrau', 'Hamburg', '20095', '5', 'Hauptweg'),
('1122334455', 'Tom', 'Schulz', 'München', '80331', '10', 'Sonnenallee'),
('2233445566', 'Anna', 'Meier', 'Köln', '50667', '22b', 'Rheinstraße'),
('3344556677', 'Hans', 'Schmidt', 'Stuttgart', '70173', '7', 'Königsweg'),
('4455667788', 'Lena', 'Huber', 'Dresden', '01067', '15', 'Elbufer'),
('5566778899', 'Peter', 'Klein', 'Frankfurt', '60311', '3', 'Zeil'),
('6677889900', 'Sabine', 'Groß', 'Leipzig', '04103', '8', 'Goethestraße'),
('7788990011', 'Moritz', 'Braun', 'Nürnberg', '90402', '12', 'Kaiserstraße'),
('8899001122', 'Julia', 'Weiß', 'Düsseldorf', '40213', '6', 'Königsallee');

-- -----------------------------------------------------------------------------
-- 2. Banken
-- -----------------------------------------------------------------------------
INSERT INTO Bank (Bankleitzahl, Bankname) VALUES
('10000000', 'Deutsche Bank'),
('20000000', 'Commerzbank'),
('30000000', 'Sparkasse Berlin'),
('40000000', 'Postbank');

-- -----------------------------------------------------------------------------
-- 3. Hersteller
-- -----------------------------------------------------------------------------
INSERT INTO Hersteller (Name) VALUES
('Mercedes-Benz'),
('MAN'),
('Setra'),
('Volvo');

-- -----------------------------------------------------------------------------
-- 4. Angestellte (hängt von Person und Bank ab)
-- Jeder Angestellte hat genau ein Bankkonto.
-- Beachte: Kontostand ist optional, hier als NULL gesetzt oder mit 0.00 initialisiert.
-- Kontonummer und Bankleitzahl bilden zusammen einen UNIQUE-Constraint.
-- Bankleitzahl muss in der Bank-Tabelle existieren.
-- SVNR muss in der Person-Tabelle existieren und UNIQUE sein.
-- -----------------------------------------------------------------------------
INSERT INTO Angestellte (AngestelltenNR, SVNR, Bankleitzahl, Kontonummer, Kontostand) VALUES
(101, '1234567890', '10000000', 'DE12345678901234567890', 1500.50), -- Max Mustermann
(102, '0987654321', '20000000', 'DE09876543210987654321', 2000.75), -- Erika Musterfrau
(103, '1122334455', '30000000', 'DE11223344551122334455', 1200.00), -- Tom Schulz
(104, '5566778899', '40000000', 'DE55667788995566778899', 1800.00); -- Peter Klein

-- -----------------------------------------------------------------------------
-- 5. Personen_Telefonnummer (hängt von Person ab)
-- -----------------------------------------------------------------------------
INSERT INTO Personen_Telefonnummer (Telefonnummer, SVNR) VALUES
('017612345678', '1234567890'),
('03098765432', '1234567890'),
('015112345678', '0987654321'),
('02219876543', '2233445566'),
('06911223344', '5566778899'),
('03415566778', '6677889900');

-- -----------------------------------------------------------------------------
-- 6. Reisegast (hängt von Person ab)
-- -----------------------------------------------------------------------------
INSERT INTO Reisegast (GästeNR, SVNR) VALUES
(201, '2233445566'), -- Anna Meier
(202, '3344556677'), -- Hans Schmidt
(203, '4455667788'), -- Lena Huber
(204, '6677889900'), -- Sabine Groß
(205, '7788990011'), -- Moritz Braun
(206, '8899001122'); -- Julia Weiß

-- -----------------------------------------------------------------------------
-- 7. Bustyp (hängt von Hersteller ab)
-- -----------------------------------------------------------------------------
INSERT INTO Bustyp (Typennummer, Typenbezeichnung, Gepäckraumvolumen, Sitzplatz, Name) VALUES
('MB001', 'Tourismo', 8000, 50, 'Mercedes-Benz'),
('MAN002', 'Lion''s Coach', 9000, 55, 'MAN'),
('SET003', 'S 516 HD', 7500, 45, 'Setra'),
('VOL004', '9700', 8500, 52, 'Volvo');

-- -----------------------------------------------------------------------------
-- 8. Fahrt
-- Beachte: Datum, Abfahrtsort, Zielort, Abfahrtszeit, Ankunftszeit sind NOT NULL.
-- FahrtNR ist AUTO_INCREMENT.
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 9. Chauffeur (hängt von Angestellte ab)
-- AngestelltenNR muss in Angestellte existieren.
-- -----------------------------------------------------------------------------
INSERT INTO Chauffeur (AngestelltenNR, FührerscheinNR, Kilometer) VALUES
(101, 'F123456', 500000), -- Max Mustermann ist Chauffeur
(102, 'F654321', 750000), -- Erika Musterfrau ist Chauffeur
(104, 'F987654', 300000); -- Peter Klein ist Chauffeur

-- -----------------------------------------------------------------------------
-- 10. Techniker (hängt von Angestellte und Bustyp ab)
-- AngestelltenNR muss in Angestellte existieren.
-- Typennummer muss in Bustyp existieren.
-- -----------------------------------------------------------------------------
INSERT INTO Techniker (LizenzNR, Ausbildungsgrad, AngestelltenNR, Typennummer) VALUES
('TL001', 'Meister', 103, 'MB001'), -- Tom Schulz kann MB001 warten
('TL002', 'Geselle', 103, 'MAN002'); -- Tom Schulz kann auch MAN002 warten (Angestellter 103 hat 2 Lizenzen)

-- -----------------------------------------------------------------------------
-- 11. Bus (hängt von Bustyp und Angestellte ab)
-- Typennummer muss in Bustyp existieren.
-- Aktueller_Entleiher_AngestelltenNR muss in Angestellte existieren (oder NULL sein).
-- FahrtenschreiberCode ist UNIQUE und kann NULL sein.
-- -----------------------------------------------------------------------------
INSERT INTO Bus (InventarNR, Fertigungsjahr, Kilometer, Typennummer, FahrtenschreiberCode, Aktueller_Entleiher_AngestelltenNR, Entleihungszeitpunkt) VALUES
('BUS001', 2020, 150000, 'MB001', 'FSMB001', 101, '2025-06-20 08:00:00'), -- Bus mit FS, entliehen von Max Mustermann
('BUS002', 2021, 120000, 'MAN002', 'FSMAN002', NULL, NULL),                 -- Bus mit FS, nicht entliehen
('BUS003', 2019, 200000, 'SET003', NULL, NULL, NULL),                     -- Bus ohne FS
('BUS004', 2022, 80000, 'MB001', 'FSMB002', 102, '2025-06-21 10:30:00'), -- Bus mit FS, entliehen von Erika Musterfrau
('BUS005', 2023, 50000, 'VOL004', 'FSVOL001', 101, '2025-06-22 14:00:00'); -- Neuer Bus mit FS, entliehen von Max Mustermann

-- -----------------------------------------------------------------------------
-- 12. Buchung (hängt von Reisegast und Fahrt ab)
-- GästeNR muss in Reisegast existieren.
-- FahrtNR muss in Fahrt existieren.
-- BuchungsNR ist AUTO_INCREMENT.
-- -----------------------------------------------------------------------------
INSERT INTO Buchung (GästeNR, FahrtNR, Buchungsdatum, Sitzplatznummer, AnzahlSitzplaetze, Klasse) VALUES
(201, 1, '2025-06-22 14:00:00', 'A1', 1, 'Economy'),   -- Anna Meier bucht Fahrt 1
(202, 1, '2025-06-22 14:05:00', 'A2', 1, 'Economy'),   -- Hans Schmidt bucht Fahrt 1
(203, 2, '2025-06-22 15:00:00', 'B1', 2, 'Business'),  -- Lena Huber bucht Fahrt 2 (2 Plätze)
(204, 5, '2025-06-23 09:00:00', 'C3', 1, 'Economy'),   -- Sabine Groß bucht Fahrt 5
(205, 6, '2025-06-23 10:30:00', 'D1', 1, 'Business');  -- Moritz Braun bucht Fahrt 6

-- -----------------------------------------------------------------------------
-- 13. fährt (hängt von Bustyp, Fahrt und Chauffeur ab)
-- Typennummer muss in Bustyp existieren.
-- FahrtNR muss in Fahrt existieren.
-- FührerscheinNR muss in Chauffeur existieren.
-- -----------------------------------------------------------------------------
INSERT INTO fährt (Typennummer, FahrtNR, FührerscheinNR) VALUES
('MB001', 1, 'F123456'), -- Bustyp MB001 wird auf Fahrt 1 von Chauffeur F123456 gefahren
('MAN002', 2, 'F654321'), -- Bustyp MAN002 wird auf Fahrt 2 von Chauffeur F654321 gefahren
('SET003', 3, 'F123456'), -- Bustyp SET003 wird auf Fahrt 3 von Chauffeur F123456 gefahren
('VOL004', 5, 'F987654'); -- Bustyp VOL004 wird auf Fahrt 5 von Chauffeur F987654 gefahren

-- -----------------------------------------------------------------------------
-- 14. schliesst_an (hängt von Fahrt ab)
-- FahrtNR_Vorher und FahrtNR_Nachher müssen in Fahrt existieren.
-- -----------------------------------------------------------------------------
INSERT INTO schliesst_an (FahrtNR_Vorher, FahrtNR_Nachher) VALUES
(1, 2), -- Fahrt 1 schließt an Fahrt 2 an
(3, 4), -- Fahrt 3 schließt an Fahrt 4 an
(6, 7), -- Fahrt 6 schließt an Fahrt 7 an
(9, 10); -- Fahrt 9 schließt an Fahrt 10 an
