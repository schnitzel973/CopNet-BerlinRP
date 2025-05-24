// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyAE4nCkJkdR8P9EKyEILHF8CN4pbRUTrHM",
  authDomain: "copnet-berlinrp.firebaseapp.com",
  projectId: "copnet-berlinrp",
  storageBucket: "copnet-berlinrp.firebasestorage.app",
  messagingSenderId: "325379817013",
  appId: "1:325379817013:web:0367b33ce7373f1185bb7c",
  measurementId: "G-N7Z1C6XNJ0"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elemente holen
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authMessage = document.getElementById("auth-message");

const authSection = document.getElementById("auth-section");
const loadoutSection = document.getElementById("loadout-section");

const loadoutNameInput = document.getElementById("loadout-name");
const loadoutWeaponsSelect = document.getElementById("loadout-weapons");
const saveLoadoutBtn = document.getElementById("save-loadout-btn");
const loadoutMessage = document.getElementById("loadout-message");
const loadoutList = document.getElementById("loadout-list");

// Benutzerstatus überwachen
auth.onAuthStateChanged(user => {
  if (user) {
    authSection.style.display = "none";
    loadoutSection.style.display = "block";
    loadLoadouts(user.uid);
  } else {
    authSection.style.display = "block";
    loadoutSection.style.display = "none";
    loadoutList.innerHTML = "";
  }
});

// Registrierung
registerBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => authMessage.textContent = "Registrierung erfolgreich! Du kannst dich jetzt einloggen.")
    .catch(error => authMessage.textContent = "Fehler: " + error.message);
});

// Login
loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => authMessage.textContent = "Fehler: " + error.message);
});

// Loadout speichern
saveLoadoutBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return;
  const name = loadoutNameInput.value.trim();
  const weapons = Array.from(loadoutWeaponsSelect.selectedOptions).map(o => o.value);

  if (!name) {
    loadoutMessage.textContent = "Bitte Loadout-Namen eingeben.";
    return;
  }
  if (weapons.length === 0) {
    loadoutMessage.textContent = "Bitte mindestens eine Waffe auswählen.";
    return;
  }

  db.collection("loadouts").add({
    uid: user.uid,
    name: name,
    weapons: weapons,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    loadoutMessage.textContent = "Loadout gespeichert!";
    loadoutNameInput.value = "";
    loadoutWeaponsSelect.selectedIndex = -1;
    loadLoadouts(user.uid);
  })
  .catch(err => loadoutMessage.textContent = "Fehler beim Speichern: " + err.message);
});

// Loadouts laden
function loadLoadouts(uid) {
  loadoutList.innerHTML = "Lade Loadouts...";
  db.collection("loadouts")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      loadoutList.innerHTML = "";
      if (snapshot.empty) {
        loadoutList.textContent = "Keine Loadouts vorhanden.";
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          const div = document.createElement("div");
          div.classList.add("loadout-item");
          div.textContent = `${data.name} — Waffen: ${data.weapons.join(", ")}`;
          loadoutList.appendChild(div);
        });
      }
    })
    .catch(err => {
      loadoutList.textContent = "Fehler beim Laden: " + err.message;
    });
}
