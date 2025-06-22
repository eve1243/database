// public/pages/loginPage.js

import { setCurrentUser } from '../utils/uiController.js';

/**
 * Initialisiert die Logik für die Login-Sektion.
 * @param {HTMLElement} loginSection - Das HTML-Element der Login-Sektion.
 * @param {HTMLElement} loginMessageElement - Das HTML-Element für Login/Registrierungs-Nachrichten.
 * @param {Function} showSectionCallbackFromMain - Die Funktion zum Umschalten der Sektionen (aus script.js).
 */
export function initLoginPage(loginSection, loginMessageElement, showSectionCallbackFromMain) {
    const loginForm = loginSection.querySelector('#login-form');
    const usernameInput = loginSection.querySelector('#username');
    const passwordInput = loginSection.querySelector('#password');
    const userTypeSelect = loginSection.querySelector('#user-type');

    let toggleModeButton = loginSection.querySelector('.secondary-button');
    let registrationFieldsDiv = loginSection.querySelector('.registration-fields');
    let submitButton = loginForm.querySelector('button[type="submit"]');

    // Dynamische Elemente erstellen, falls nicht vorhanden
    // Problemfix: Einfügen des Toggle-Buttons direkt in das Formular, aber nach dem Submit-Button.
    // Das ist sicherer als mit nextSibling auf Parent-Ebene zu operieren.
    if (!toggleModeButton) {
        toggleModeButton = document.createElement('button');
        toggleModeButton.textContent = 'Jetzt registrieren';
        toggleModeButton.classList.add('button', 'secondary-button');
        // Sicherste Methode: Füge es nach dem submitButton innerhalb des loginForm hinzu
        if (submitButton && submitButton.parentNode) {
            submitButton.parentNode.insertBefore(toggleModeButton, submitButton.nextSibling);
        } else {
            loginForm.appendChild(toggleModeButton); // Fallback
        }
    }

    if (!registrationFieldsDiv) {
        registrationFieldsDiv = document.createElement('div');
        registrationFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="vorname">Vorname:</label>
                <input type="text" id="vorname" name="vorname">
            </div>
            <div class="form-group">
                <label for="nachname">Nachname:</label>
                <input type="text" id="nachname" name="nachname">
            </div>
            <div class="form-group">
                <label for="ort">Ort (optional):</label>
                <input type="text" id="ort" name="ort">
            </div>
            <div class="form-group">
                <label for="plz">PLZ (optional):</label>
                <input type="text" id="plz" name="plz">
            </div>
            <div class="form-group">
                <label for="hausnummer">Hausnummer (optional):</label>
                <input type="text" id="hausnummer" name="hausnummer">
            </div>
            <div class="form-group">
                <label for="strasse">Straße (optional):</label>
                <input type="text" id="strasse" name="strasse">
            </div>
        `;
        registrationFieldsDiv.classList.add('registration-fields', 'hidden');
        // Sicherste Methode: Füge es einfach vor dem submitButton innerhalb des loginForm hinzu
        loginForm.insertBefore(registrationFieldsDiv, submitButton);
    }

    let isRegisterMode = false;

    function toggleMode() {
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            submitButton.textContent = 'Registrieren';
            toggleModeButton.textContent = 'Doch lieber Anmelden';
            registrationFieldsDiv.classList.remove('hidden');
            registrationFieldsDiv.querySelector('#vorname').setAttribute('required', 'required');
            registrationFieldsDiv.querySelector('#nachname').setAttribute('required', 'required');
            loginSection.querySelector('h2').textContent = 'Registrieren';
        } else {
            submitButton.textContent = 'Anmelden';
            toggleModeButton.textContent = 'Jetzt registrieren';
            registrationFieldsDiv.classList.add('hidden');
            registrationFieldsDiv.querySelector('#vorname').removeAttribute('required');
            registrationFieldsDiv.querySelector('#nachname').removeAttribute('required');
            loginSection.querySelector('h2').textContent = 'Anmelden';
        }
        loginMessageElement.textContent = '';
        loginMessageElement.classList.remove('error', 'success');
        // Eingabefelder zurücksetzen
        usernameInput.value = '';
        passwordInput.value = '';
        registrationFieldsDiv.querySelectorAll('input').forEach(input => input.value = '');
    }

    toggleModeButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginMessageElement.textContent = '';
        loginMessageElement.classList.remove('error', 'success');

        const svnr = usernameInput.value;
        const password = passwordInput.value;
        const userType = userTypeSelect.value;

        let apiUrl = '';
        let bodyData = {};

        if (isRegisterMode) {
            const vorname = registrationFieldsDiv.querySelector('#vorname').value;
            const nachname = registrationFieldsDiv.querySelector('#nachname').value;
            const ort = registrationFieldsDiv.querySelector('#ort').value;
            const plz = registrationFieldsDiv.querySelector('#plz').value;
            const hausnummer = registrationFieldsDiv.querySelector('#hausnummer').value;
            const strasse = registrationFieldsDiv.querySelector('#strasse').value;

            if (!svnr || !password || !vorname || !nachname) {
                loginMessageElement.textContent = 'Bitte füllen Sie alle erforderlichen Felder aus.';
                loginMessageElement.classList.add('error');
                return;
            }

            apiUrl = '/api/register';
            bodyData = { svnr, password, vorname, nachname, ort, plz, hausnummer, strasse, userType };
        } else {
            apiUrl = '/api/login';
            bodyData = { username: svnr, password, userType };
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (response.ok) { // response.ok ist true für 2xx Status Codes
                if (isRegisterMode) {
                    loginMessageElement.textContent = data.message;
                    loginMessageElement.classList.add('success');
                    toggleMode(); // Nach erfolgreicher Registrierung zum Login-Modus wechseln
                } else {
                    // Login erfolgreich: setCurrentUser im uiController aufrufen
                    setCurrentUser(data.user);
                    loginMessageElement.textContent = 'Anmeldung erfolgreich!';
                    loginMessageElement.classList.add('success');
                    // Der uiController kümmert sich um die Weiterleitung
                }
            } else { // response.ok ist false für 4xx oder 5xx Status Codes
                loginMessageElement.textContent = data.message || (isRegisterMode ? 'Registrierung fehlgeschlagen.' : 'Anmeldung fehlgeschlagen.');
                loginMessageElement.classList.add('error');

                // Spezielle Behandlung für "Benutzer nicht gefunden" (HTTP 404)
                if (!isRegisterMode && response.status === 404 && data.userNotFound) {
                    const confirmRegister = confirm('Diese Sozialversicherungsnummer (SVNR) ist nicht registriert. Möchten Sie sich jetzt registrieren?');
                    if (confirmRegister) {
                        toggleMode();
                        usernameInput.value = svnr;
                    }
                }
            }
        } catch (error) {
            console.error(`Fehler bei ${isRegisterMode ? 'Registrierung' : 'Anmeldung'}:`, error);
            loginMessageElement.textContent = 'Netzwerkfehler oder Server nicht erreichbar.';
            loginMessageElement.classList.add('error');
        }
    });
}
