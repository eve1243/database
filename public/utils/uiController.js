// public/utils/uiController.js

let currentUser = null;
let showSectionCallback;

let navSearchBtn, navLoginBtn, navBookingBtn, navAdminBtn, navLogoutBtn;
let loginSection, searchSection, bookingSection, adminSection;

/**
 * Initialisiert den UI Controller mit den notwendigen DOM-Elementen und Callbacks.
 * @param {Object} elements - Ein Objekt mit allen relevanten DOM-Elementen.
 * @param {Function} initialShowSectionCallback - Die Funktion aus script.js zum Umschalten der Sektionen.
 */
export function initUIController(elements, initialShowSectionCallback) {
    ({
        navSearchBtn, navLoginBtn, navBookingBtn, navAdminBtn, navLogoutBtn,
        loginSection, searchSection, bookingSection, adminSection
    } = elements);

    showSectionCallback = initialShowSectionCallback;

    currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    navSearchBtn.addEventListener('click', () => showSectionCallback('search-section'));
    navLoginBtn.addEventListener('click', () => showSectionCallback('login-section'));

    navBookingBtn.addEventListener('click', () => {
        if (currentUser && currentUser.userType === 'guest') {
            showSectionCallback('booking-section');
        } else {
            alert('Bitte als Gast anmelden, um diese Funktion zu nutzen.');
            showSectionCallback('login-section');
        }
    });
    navAdminBtn.addEventListener('click', () => {
        if (currentUser && currentUser.userType === 'employee') {
            showSectionCallback('admin-section');
        } else {
            alert('Bitte als Angestellter anmelden, um diese Funktion zu nutzen.');
            showSectionCallback('login-section');
        }
    });

    navLogoutBtn.addEventListener('click', handleLogout);

    updateNavigation();
}

/**
 * Aktualisiert die Sichtbarkeit der Navigationsbuttons basierend auf dem Anmeldestatus.
 */
export function updateNavigation() {
    if (currentUser) {
        navLoginBtn.classList.add('hidden');
        navLogoutBtn.classList.remove('hidden');
        if (currentUser.userType === 'guest') {
            navBookingBtn.classList.remove('hidden');
            navAdminBtn.classList.add('hidden');
        } else if (currentUser.userType === 'employee') {
            navBookingBtn.classList.add('hidden');
            navAdminBtn.classList.remove('hidden');
        }
    } else {
        navLoginBtn.classList.remove('hidden');
        navLogoutBtn.classList.add('hidden');
        navBookingBtn.classList.add('hidden');
        navAdminBtn.classList.add('hidden');
    }
}

/**
 * Behandelt den Logout-Prozess.
 */
function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    clearPendingAction();
    updateNavigation();
    alert('Sie wurden abgemeldet.');
    showSectionCallback('login-section');
}

/**
 * Setzt den aktuellen Benutzer nach einem erfolgreichen Login.
 * @param {Object} user - Die Benutzerdaten des angemeldeten Benutzers.
 */
export function setCurrentUser(user) {
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateNavigation();

    // Nach dem Login prüfen, ob eine ausstehende Aktion vorhanden ist
    const pendingAction = getPendingAction();
    if (pendingAction && pendingAction.type === 'bookTrip' && currentUser.userType === 'guest') {
        showSectionCallback('booking-section', pendingAction.tripDetails); // Reiseinformationen an Buchungsseite übergeben
        clearPendingAction(); // Ausstehende Aktion nach Ausführung löschen
    } else if (currentUser.userType === 'employee') {
        showSectionCallback('admin-section');
    } else {
        showSectionCallback('search-section'); // Gäste oder keine ausstehende Aktion, zurück zur Suchseite
    }
}

/**
 * Gibt den aktuell angemeldeten Benutzer zurück.
 * @returns {Object|null} Der aktuelle Benutzer oder null, wenn nicht angemeldet.
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * Speichert eine ausstehende Aktion (z.B. Buchungsversuch) im Session Storage.
 * @param {Object} action - Ein Objekt, das den Typ der Aktion und alle relevanten Daten enthält.
 */
export function setPendingAction(action) {
    sessionStorage.setItem('pendingAction', JSON.stringify(action));
}

/**
 * Ruft eine ausstehende Aktion aus dem Session Storage ab.
 * @returns {Object|null} Die ausstehende Aktion oder null.
 */
export function getPendingAction() {
    return JSON.parse(sessionStorage.getItem('pendingAction'));
}

/**
 * Löscht eine ausstehende Aktion aus dem Session Storage.
 */
export function clearPendingAction() {
    sessionStorage.removeItem('pendingAction');
}

/**
 * Initialisiert den Startzustand der UI.
 * Standardmäßig wird die Suchseite angezeigt.
 */
export function initialUISetup() {
    // Beim Start immer die Suchseite anzeigen, unabhängig vom Login-Status
    showSectionCallback('search-section');
}
