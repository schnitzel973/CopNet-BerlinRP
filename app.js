// --- Firebase config ---
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "DEIN_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elemente referenzieren
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authMessage = document.getElementById('auth-message');

const loadoutSection = document.getElementById('loadout-section');
const loadoutList = document.getElementById('loadout-list');
const loadoutNameInput = document.getElementById('loadout-name');
const loadoutWeaponsSelect = document.getElementById('loadout-weapons');
const saveLoadoutBtn = document.getElementById('save-loadout-btn');
const loadoutMessage = document.getElementById('loadout-message');

// Auth Funktion: Registrierung
registerBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      authMessage.textContent = "Registrierung erfolgreich! Bitte einloggen.";
      authMessage.className = "success";
    })
    .catch(e => {
      authMessage.textContent = e.message;
      authMessage.className = "error";
    });
});

// Auth Funktion: Login
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(e => {
      authMessage.textContent = e.message;
      authMessage.className = "error";
    });
});

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    // Eingeloggt
    authMessage.textContent = `Eingeloggt als ${user.email}`;
    authMessage.className = "success";
    document.getElementById('auth-section').style.display = 'none';
    loadoutSection.style.display = 'block';
    loadLoadouts(user.uid);
  } else {
    // Nicht eingeloggt
    authMessage.textContent = '';
    document.getElementById('auth-section').style.display = 'block';
    loadoutSection.style.display = 'none';
    loadoutList.innerHTML = '';
  }
});

// Loadouts laden aus Firestore
function loadLoadouts(uid) {
  loadoutList.innerHTML = 'Lade Loadouts...';
  db.collection('loadouts').where('userId', '==', uid).get()
    .then(snapshot => {
      if (snapshot.empty) {
        loadoutList.innerHTML = '<p>Keine Loadouts gefunden.</p>';
        return;
      }
      loadoutList.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'loadout-item';
        div.innerHTML = `<h3>${data.name}</h3><p>Waffen: ${data.weapons.join(', ')}</p>`;
        loadoutList.appendChild(div);
      });
    });
}

// Loadout speichern
saveLoadoutBtn.addEventListener('click', () => {
  const name = loadoutNameInput.value.trim();
  const weapons = Array.from(loadoutWeaponsSelect.selectedOptions).map(opt => opt.value);

  if (!name) {
    loadoutMessage.textContent = 'Bitte Loadout Name eingeben!';
    loadoutMessage.className = 'error';
    return;
  }
  if (weapons.length === 0) {
    loadoutMessage.textContent = 'Bitte mindestens eine Waffe auswählen!';
    loadoutMessage.className = 'error';
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  db.collection('loadouts').add({
    userId: user.uid,
    name: name,
    weapons: weapons,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    loadoutMessage.textContent = 'Loadout gespeichert!';
    loadoutMessage.className = 'success';
    loadoutNameInput.value = '';
    loadoutWeaponsSelect.selectedIndex = -1;
    loadLoadouts(user.uid);
  }).catch(e => {
    loadoutMessage.textContent = 'Fehler beim Speichern: ' + e.message;
    loadoutMessage.className = 'error';
  });
});
