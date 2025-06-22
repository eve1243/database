# PRJ4: Projektabgabe Teil 4 – DB-Programmierung

## Projektübersicht

Im Rahmen der Lehrveranstaltung wurde eine relationale Datenbankanwendung für eine fiktive Busliniengesellschaft im Fernverkehr entwickelt. Ziel des Projekts ist es, durch die Kombination von Datenbankmodellierung, SQL-Implementierung und dynamischer Webentwicklung die Grundprinzipien der Datenbankprogrammierung praktisch zu erlernen.

## Datenbankschema

Die Anwendung basiert auf einem modellierten relationalen Schema, das folgende Hauptkomponenten abbildet:

- Personen mit Adresse, Sozialversicherungsnummer und optionalen Telefonnummern
- Reisegäste und Angestellte als spezialisierte Rollen
- Gehaltskonten für Angestellte
- Fahrten mit Abfahrts-/Zielort, Zeitangaben und möglichen Anschlüssen
- Bustypen mit Hersteller, Sitzplatzanzahl und Gepäckraumvolumen
- Busse mit Typ, Baujahr, Kilometerstand und zugeordnetem Fahrtenschreiber
- Chauffeure und Techniker mit Lizenznummern
- Buchungen (inkl. Datum, Klasse, Sitzplatznummer, Buchungsnummer)
- Fahrtenschreiber, die Chauffeure oder Techniker entlehnen können

Die Implementierung erfolgt vollständig in MySQL (lokal) unter Berücksichtigung von:

- Primär- und Fremdschlüsseln
- Normalisierung
- Referenzieller Integrität
- Einschränkungen und Gültigkeitsregeln
- Sinnvollen Testdaten und absichtlichen Negativtests

## Lese- und Schreibzugriffe

Die Webanwendung unterstützt sowohl Lese- als auch Schreibzugriffe:

**Lesezugriffe**:
- Abruf verfügbarer Fahrten
- Anzeige von Buchungsübersichten
- Mitarbeiterdaten und Busstatus

**Schreibzugriffe**:
- Fahrtenbuchung
- Entlehnung und Rückgabe von Fahrtenschreibern
- Login- und Sitzplatzinteraktionen

## Technologie-Stack

| Komponente        | Beschreibung                                      |
|-------------------|---------------------------------------------------|
| Backend           | Node.js                                           |
| Webframework      | Express.js                                        |
| Datenbank         | MySQL (lokal)                                     |
| Frontend          | HTML5, CSS3, JavaScript (optional)                |
| Template Engine   | EJS (optional)                                    |
| Datenformat       | JSON (für RESTful API-Kommunikation)             |
| Zustandserhaltung | Sessions, Hidden Fields, URL-Encoding             |
| Datenbankzugriff  | `mysql2`-Modul für SQL-basierte Datenbankabfragen |
| Deployment        | Lokaler Server über Node.js und MySQL             |

## Funktionalität der Web-Applikation

Die Anwendung besteht aus dynamischen Web-Seiten mit funktionaler Datenbankintegration. Die Kommunikation zwischen Frontend und Backend erfolgt über JSON-APIs.

### Hauptfunktionen

1. **Fahrten-Suche**
   - Eingabe von Abfahrts- und Zielort sowie Datum
   - Anzeige verfügbarer Fahrten in strukturierter Listenform

2. **Fahrten-Buchung**
   - Auswahl einer Fahrt
   - Eingabe von Gastdaten
   - Eintrag der Buchung in der Datenbank

3. **Login-Bereich**
   - Authentifizierung von Gästen und Personal
   - Ansicht persönlicher Buchungen oder Dienstzuweisungen

4. **Fahrtenschreiber-Verwaltung**
   - Mitarbeiter können Fahrtenschreiber ausleihen, zurückgeben und einsehen

## Interaktionsszenario mit Zustandserhaltung

Zur Demonstration von zustandserhaltender Webprogrammierung wurde ein mehrstufiges Interaktionsszenario implementiert:

1. Auswahl einer Fahrt auf der ersten Seite
2. Eingabe der Gastdaten oder Anmeldung auf der zweiten Seite
3. Abschließende Buchung basierend auf zuvor gespeicherten Daten

Die Zustandserhaltung erfolgt ohne Datenbank, z. B. über Sessions oder Hidden Fields.

## Projektstruktur

projekt-root/
├── db/
│ └── schema.sql
├── public/
│ ├── index.html
│ ├── style.css
├── routes/
│ ├── fahrten.js
│ ├── buchung.js
├── views/
│ └── confirm.ejs
├── .env
├── app.js
├── package.json
└── README.md

## Autoren

- Projektteam: Patrick Stockinger, Gloria Young, Everlyn Njeri, Ljilja Savic
- Semester: SS25