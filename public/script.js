// public/script.js

import { initLoginPage } from './pages/loginPage.js';
import { initFahrtenSuchePage } from './pages/fahrtenSuchePage.js';
import { initBookingPage } from './pages/bookingPage.js';
import { initAdminPage } from './pages/adminPage.js';

import { initUIController, initialUISetup } from './utils/uiController.js';


document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const searchSection = document.getElementById('search-section');
    const bookingSection = document.getElementById('booking-section');
    const adminSection = document.getElementById('admin-section');

    const navSearchBtn = document.getElementById('nav-search-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navBookingBtn = document.getElementById('nav-booking-btn');
    const navAdminBtn = document.getElementById('nav-admin-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');

    const loginMessage = document.getElementById('login-message');
    const fahrtenSucheMessage = document.getElementById('fahrten-suche-message');
    const fahrtenResultsDiv = document.getElementById('fahrten-results');

    /**
     * Zentrale Funktion zum Anzeigen der Sektionen. Wird an den UI Controller und Seiten übergeben.
     * @param {string} sectionId Die ID der Sektion, die angezeigt werden soll.
     * @param {Object} [data=null] - Optionale Daten, die an die Sektion übergeben werden sollen (z.B. Fahrtdetails).
     */
    function showSection(sectionId, data = null) {
        // Alle Sektionen ausblenden
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
            // Hier können wir auch Sektionen "leeren" oder ihren Zustand zurücksetzen, falls nötig
        });
        // Gewünschte Sektion anzeigen
        document.getElementById(sectionId).classList.add('active');

        // Navigationsbuttons aktualisieren
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });

        if (sectionId === 'search-section') navSearchBtn.classList.add('active');
        else if (sectionId === 'login-section') navLoginBtn.classList.add('active');
        else if (sectionId === 'booking-section') navBookingBtn.classList.add('active');
        else if (sectionId === 'admin-section') navAdminBtn.classList.add('active');

        // Zusätzliche Initialisierung für die Sektion, falls Daten übergeben werden
        if (sectionId === 'booking-section') {
            initBookingPage(bookingSection, data); // Initialisiere Buchungsseite mit Daten
        } else if (sectionId === 'admin-section') {
            initAdminPage(adminSection); // Initialisiere Adminseite
        } else if (sectionId === 'login-section') {
            // LoginPage wird hier nicht direkt initialisiert, sondern erhält den Callback
            // Siehe initLoginPage unten, wo showSection als Parameter übergeben wird
        }
        // FahrtenSuchePage wird separat initialisiert, da sie beim Laden aktiv ist
    }

    // Objekt mit allen DOM-Elementen für den UI-Controller
    const uiElements = {
        navSearchBtn, navLoginBtn, navBookingBtn, navAdminBtn, navLogoutBtn,
        loginSection, searchSection, bookingSection, adminSection
    };

    // UI Controller initialisieren und ihm die Elemente und die showSection-Funktion übergeben
    // uiController kümmert sich um die Navigation und den Benutzerstatus
    initUIController(uiElements, showSection);

    // Initialisierung der Seitenmodule
    // loginPage benötigt showSection, um bei Bedarf umzuschalten (z.B. nach erfolgreicher Registrierung/Login)
    initLoginPage(loginSection, loginMessage, showSection);
    // fahrtenSuchePage benötigt showSection, um zum Login/Buchung umzuleiten
    initFahrtenSuchePage(searchSection, fahrtenSucheMessage, fahrtenResultsDiv, showSection);
    // bookingPage und adminPage erhalten ihre Sektions-Referenz, wenn showSection aufgerufen wird
    // Trotzdem initialisiere sie hier mit der Referenz, um sicherzustellen, dass ihre Basis-Logik geladen wird
    initBookingPage(bookingSection); // Initiale Referenz übergeben
    initAdminPage(adminSection); // Initiale Referenz übergeben


    // Initialen UI-Zustand setzen (immer die Suchseite anzeigen)
    initialUISetup();
});
