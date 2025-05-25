// Firebase Konfiguration
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

  // Automatisch weiterleiten, falls bereits eingeloggt
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = "main.html";
    }
  });
}

// --- Hauptseite ---
if (document.body.classList.contains("main-page") || document.getElementById("logout-btn")) {
  // Check Auth & show user email
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById("user-email").textContent = user.email;
      loadDashboardStats();
      setupNavigation();
      setupLogout();
      setupAkten();
      setupFahndungen();
      setupPersonalakten();
    } else {
      window.location.href = "index.html";
    }
  });

  // Logout
  function setupLogout() {
    const btn = document.getElementById("logout-btn");
    btn.addEventListener("click", () => auth.signOut());
  }

  // Navigation
  function setupNavigation() {
    const items = document.querySelectorAll(".sidebar li");
    const sections = document.querySelectorAll("main .section");

    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const target = item.getAttribute("data-section");
        sections.forEach(sec => {
          sec.classList.toggle("active", sec.id === target);
        });
      });
    });
  }

  // Dashboard Stats laden
  async function loadDashboardStats() {
    try {
      const aktenSnap = await db.collection("akten").get();
      const fahndungenSnap = await db.collection("fahndungen").get();
      const personalSnap = await db.collection("personalakten").get();

      document.getElementById("total-akten").textContent = aktenSnap.size;
      document.getElementById("total-fahndungen").textContent = fahndungenSnap.size;
      document.getElementById("total-personal").textContent = personalSnap.size;
      document.getElementById("system-status").textContent = "Verbunden";
    } catch (error) {
      document.getElementById("system-status").textContent = "Fehler";
      console.error("Fehler beim Laden der Statistiken:", error);
    }
  }

  // Akten Funktionen
  function setupAkten() {
    const listEl = document.getElementById("akten-list");
    const addBtn = document.getElementById("add-akte-btn");
    const searchInput = document.getElementById("search-akten");

    // Laden & anzeigen
    async function renderAkten(filter = "") {
      listEl.innerHTML = "Lade...";
      let query = db.collection("akten").orderBy("erstelltAm", "desc");
      if (filter) {
        query = query.where("titel", ">=", filter).where("titel", "<=", filter + "\uf8ff");
      }
      try {
        const snapshot = await query.get();
        if (snapshot.empty) {
          listEl.innerHTML = "<p>Keine Akten gefunden.</p>";
          return;
        }
        listEl.innerHTML = "";
        snapshot.forEach(doc => {
          const data = doc.data();
          const div = document.createElement("div");
          div.className = "akte-item";
          div.innerHTML = `
            <h3>${data.titel}</h3>
            <p>${data.beschreibung || "Keine Beschreibung"}</p>
            <small>Erstellt: ${new Date(data.erstelltAm?.toDate()).toLocaleString()}</small>
          `;
          listEl.appendChild(div);
        });
      } catch (err) {
        listEl.innerHTML = "<p>Fehler beim Laden der Akten.</p>";
        console.error(err);
      }
    }

    renderAkten();

    searchInput.addEventListener("input", (e) => {
      renderAkten(e.target.value.trim());
    });

    addBtn.addEventListener("click", () => {
      const titel = prompt("Titel der neuen Akte:");
      if (!titel) return alert("Titel darf nicht leer sein.");
      const beschreibung = prompt("Beschreibung (optional):");

      db.collection("akten").add({
        titel,
        beschreibung: beschreibung || "",
        erstelltAm: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        alert("Akte erstellt!");
        renderAkten();
        loadDashboardStats();
      }).catch(err => {
        alert("Fehler beim Erstellen: " + err.message);
      });
    });
  }

  // Fahndungen Funktionen (ähnlich Akten)
  function setupFahndungen() {
    const listEl = document.getElementById("fahndungen-list");
    const addBtn = document.getElementById("add-fahndung-btn");
    const searchInput = document.getElementById("search-fahndungen");

    async function renderFahndungen(filter = "") {
      listEl.innerHTML = "Lade...";
      let query = db.collection("fahndungen").orderBy("erstelltAm", "desc");
      if (filter) {
        query = query.where("titel", ">=", filter).where("titel", "<=", filter + "\uf8ff");
      }
      try {
        const snapshot = await query.get();
        if (snapshot.empty) {
          listEl.innerHTML = "<p>Keine Fahndungen gefunden.</p>";
          return;
        }
        listEl.innerHTML = "";
        snapshot.forEach(doc => {
          const data = doc.data();
          const div = document.createElement("div");
          div.className = "fahndung-item";
          div.innerHTML = `
            <h3>${data.titel}</h3>
            <p>${data.beschreibung || "Keine Beschreibung"}</p>
            <small>Erstellt: ${new Date(data.erstelltAm?.toDate()).toLocaleString()}</small>
          `;
          listEl.appendChild(div);
        });
      } catch (err) {
        listEl.innerHTML = "<p>Fehler beim Laden der Fahndungen.</p>";
        console.error(err);
      }
    }

    renderFahndungen();

    searchInput.addEventListener("input", (e) => {
      renderFahndungen(e.target.value.trim());
    });

    addBtn.addEventListener("click", () => {
      const titel = prompt("Titel der neuen Fahndung:");
      if (!titel) return alert("Titel darf nicht leer sein.");
      const beschreibung = prompt("Beschreibung (optional):");

      db.collection("fahndungen").add({
        titel,
        beschreibung: beschreibung || "",
        erstelltAm: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        alert("Fahndung erstellt!");
        renderFahndungen();
        loadDashboardStats();
      }).catch(err => {
        alert("Fehler beim Erstellen: " + err.message);
      });
    });
  }

  // Personalakten Funktionen (ähnlich)
  function setupPersonalakten() {
    const listEl = document.getElementById("personalakten-list");
    const addBtn = document.getElementById("add-personalakte-btn");
    const searchInput = document.getElementById("search-personal");

    async function renderPersonalakten(filter = "") {
      listEl.innerHTML = "Lade...";
      let query = db.collection("personalakten").orderBy("rang", "asc");
      if (filter) {
        query = query.where("name", ">=", filter).where("name", "<=", filter + "\uf8ff");
      }
      try {
        const snapshot = await query.get();
        if (snapshot.empty) {
          listEl.innerHTML = "<p>Keine Personalakten gefunden.</p>";
          return;
        }
        listEl.innerHTML = "";
        snapshot.forEach(doc => {
          const data = doc.data();
          const div = document.createElement("div");
          div.className = "personalakte-item";
          div.innerHTML = `
            <h3>${data.name} (${data.rang})</h3>
            <p>Dienstzeit: ${data.dienstzeit || "Unbekannt"}</p>
            <p>Bemerkungen: ${data.bemerkungen || "Keine"}</p>
          `;
          listEl.appendChild(div);
        });
      } catch (err) {
        listEl.innerHTML = "<p>Fehler beim Laden der Personalakten.</p>";
        console.error(err);
      }
    }

    renderPersonalakten();

    searchInput.addEventListener("input", (e) => {
      renderPersonalakten(e.target.value.trim());
    });

    addBtn.addEventListener("click", () => {
      const name = prompt("Name des Polizisten:");
      if (!name) return alert("Name darf nicht leer sein.");
      const rang = prompt("Rang:");
      const dienstzeit = prompt("Dienstzeit (z.B. 3 Jahre):");
      const bemerkungen = prompt("Bemerkungen (optional):");

      db.collection("personalakten").add({
        name,
        rang: rang || "",
        dienstzeit: dienstzeit || "",
        bemerkungen: bemerkungen || "",
        erstelltAm: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        alert("Personalakte erstellt!");
        renderPersonalakten();
        loadDashboardStats();
      }).catch(err => {
        alert("Fehler beim Erstellen: " + err.message);
      });
    });
  }
}
