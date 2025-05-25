const app = document.getElementById("app");

// Hardcoded Nutzer mit Rolle
const users = [
  { username: "admin", email: "admin@berlinrp.de", role: "admin" },
  { username: "user1", email: "user1@berlinrp.de", role: "user" }
];

// State
let currentUser = null;
let currentPage = "dashboard"; // default

// === Utils ===
function saveUserToStorage(user) {
  localStorage.setItem("pn_berlinrp_user", JSON.stringify(user));
}

function loadUserFromStorage() {
  const u = localStorage.getItem("pn_berlinrp_user");
  return u ? JSON.parse(u) : null;
}

function clearUserStorage() {
  localStorage.removeItem("pn_berlinrp_user");
}

// === Theme (Light/Dark) ===
function applyTheme(theme) {
  if (theme === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  localStorage.setItem("pn_berlinrp_theme", theme);
}

function loadTheme() {
  const theme = localStorage.getItem("pn_berlinrp_theme") || "light";
  applyTheme(theme);
}

function toggleTheme() {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  renderSidebar(); // update toggle button text
}

// === Login ===
function renderLogin() {
  app.innerHTML = `
    <div class="login-container">
      <h1>Polizei Netzewerk BerlinRP</h1>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Nutzername" required />
        <input type="email" id="email" placeholder="Email" required />
        <button type="submit">Login</button>
      </form>
    </div>
  `;
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim().toLowerCase();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.email === email
    );
    if (user) {
      currentUser = user;
      saveUserToStorage(user);
      currentPage = "dashboard";
      renderApp();
    } else {
      alert("Ungültige Login-Daten!");
    }
  });
}

// === Logout ===
function logout() {
  currentUser = null;
  clearUserStorage();
  currentPage = "login";
  renderApp();
}

// === Sidebar Menu Items ===
const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "akten", label: "Akten System" },
  { id: "fahndungen", label: "Fahndungen" },
  { id: "fahrzeuge", label: "Fahrzeuge" },
  { id: "status", label: "Status" }
];

// Admin-only
const adminMenuItems = [{ id: "einstellungen", label: "Einstellungen" }];

// === Render Sidebar ===
function renderSidebar() {
  if (!currentUser) return;
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  // Header
  const header = document.createElement("div");
  header.className = "sidebar-header";
  header.textContent = "Polizei Netzewerk BerlinRP";
  sidebar.appendChild(header);

  // Menu List
  const ul = document.createElement("ul");

  // Normal Items
  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.label;
    li.className = item.id === currentPage ? "active" : "";
    li.onclick = () => {
      currentPage = item.id;
      renderApp();
    };
    ul.appendChild(li);
  });

  // Admin Items
  if (currentUser.role === "admin") {
    adminMenuItems.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.label;
      li.className = item.id === currentPage ? "active" : "";
      li.onclick = () => {
        currentPage = item.id;
        renderApp();
      };
      ul.appendChild(li);
    });
  }

  sidebar.appendChild(ul);

  // Light/Dark Toggle
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
  toggleBtn.onclick = () => {
    toggleTheme();
  };
  sidebar.appendChild(toggleBtn);

  // Logout Button
  const logoutBtn = document.createElement("button");
  logoutBtn.className = "theme-toggle";
  logoutBtn.style.marginTop = "auto";
  logoutBtn.textContent = "Logout";
  logoutBtn.onclick = logout;
  sidebar.appendChild(logoutBtn);

  return sidebar;
}

// === Dashboard ===
function renderDashboard() {
  return `
    <h2>Dashboard</h2>
    <p>Willkommen, <b>${currentUser.username}</b>!</p>
    <div id="stats">
      <p>Lade Live-Statistiken...</p>
    </div>
  `;
}

// === Akten System (CRUD) ===
async function renderAkten() {
  let html = `
    <h2>Akten System</h2>
    <form id="aktenForm">
      <input type="text" id="aktenTitel" placeholder="Titel" required />
      <textarea id="aktenBeschreibung" placeholder="Beschreibung" rows="3" required></textarea>
      <button type="submit">Akten Eintragen</button>
    </form>
    <hr />
    <div id="aktenListe">
      <p>Lade Akten...</p>
    </div>
  `;
  // Insert form and list
  return html;
}

async function loadAkten() {
  const container = document.getElementById("aktenListe");
  container.innerHTML = "Lade Akten...";
  try {
    const snapshot = await db.collection("akten").get();
    if (snapshot.empty) {
      container.innerHTML = "<p>Keine Akten vorhanden.</p>";
      return;
    }
    let html = "<ul class='akten-list'>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li><b>${data.titel}</b> - ${data.beschreibung}
      <button data-id="${doc.id}" class="akten-edit">✏️</button>
      <button data-id="${doc.id}" class="akten-delete">🗑️</button>
      </li>`;
    });
    html += "</ul>";
    container.innerHTML = html;

    // Attach Events
    document.querySelectorAll(".akten-delete").forEach(btn => {
      btn.onclick = async e => {
        const id = e.target.dataset.id;
        if (confirm("Akteneintrag wirklich löschen?")) {
          await db.collection("akten").doc(id).delete();
          loadAkten();
        }
      };
    });

    document.querySelectorAll(".akten-edit").forEach(btn => {
      btn.onclick = async e => {
        const id = e.target.dataset.id;
        const doc = await db.collection("akten").doc(id).get();
        const data = doc.data();
        document.getElementById("aktenTitel").value = data.titel;
        document.getElementById("aktenBeschreibung").value = data.beschreibung;
        document.getElementById("aktenForm").dataset.editId = id;
      };
    });
  } catch (err) {
    container.innerHTML = `<p>Fehler: ${err.message}</p>`;
  }
}

async function handleAktenFormSubmit(e) {
  e.preventDefault();
  const titel = document.getElementById("aktenTitel").value.trim();
  const beschreibung = document.getElementById("aktenBeschreibung").value.trim();
  const editId = e.target.dataset.editId;

  if (!titel || !beschreibung) return alert("Bitte alle Felder ausfüllen!");

  try {
    if (editId) {
      await db.collection("akten").doc(editId).update({ titel, beschreibung });
      delete e.target.dataset.editId;
    } else {
      await db.collection("akten").add({ titel, beschreibung, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    }
    e.target.reset();
    loadAkten();
  } catch (err) {
    alert("Fehler: " + err.message);
  }
}

// === Fahndungen (CRUD ähnlich) ===
async function renderFahndungen() {
  let html = `
    <h2>Fahndungen</h2>
    <form id="fahndungenForm">
      <input type="text" id="fahndungName" placeholder="Name" required />
      <textarea id="fahndungBeschreibung" placeholder="Beschreibung" rows="3" required></textarea>
      <button type="submit">Fahndung anlegen</button>
    </form>
    <hr />
    <div id="fahndungenListe">
      <p>Lade Fahndungen...</p>
    </div>
  `;
  return html;
}

async function loadFahndungen() {
  const container = document.getElementById("fahndungenListe");
  container.innerHTML = "Lade Fahndungen...";
  try {
    const snapshot = await db.collection("fahndungen").get();
    if (snapshot.empty) {
      container.innerHTML = "<p>Keine Fahndungen vorhanden.</p>";
      return;
    }
    let html = "<ul class='fahndungen-list'>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li><b>${data.name}</b> - ${data.beschreibung}
      <button data-id="${doc.id}" class="fahndungen-edit">✏️</button>
      <button data-id="${doc.id}" class="fahndungen-delete">🗑️</button>
      </li>`;
    });
    html += "</ul>";
    container.innerHTML = html;

    // Events
    document.querySelectorAll(".fahndungen-delete").forEach(btn => {
      btn.onclick = async e => {
        const id = e.target.dataset.id;
        if (confirm("Fahndung wirklich löschen?")) {
          await db.collection("fahndungen").doc(id).delete();
          loadFahndungen();
        }
      };
    });

    document.querySelectorAll(".fahndungen-edit").forEach(btn => {
      btn.onclick = async e => {
        const id = e.target.dataset.id;
        const doc = await db.collection("fahndungen").doc(id).get();
        const data = doc.data();
        document.getElementById("fahndungName").value = data.name;
        document.getElementById("fahndungBeschreibung").value = data.beschreibung;
        document.getElementById("fahndungenForm").dataset.editId = id;
      };
    });
  } catch (err) {
    container.innerHTML = `<p>Fehler: ${err.message}</p>`;
  }
}

async function handleFahndungenFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("fahndungName").value.trim();
  const beschreibung = document.getElementById("fahndungBeschreibung").value.trim();
  const editId = e.target.dataset.editId;

  if (!name || !beschreibung) return alert("Bitte alle Felder ausfüllen!");

  try {
    if (editId) {
      await db.collection("fahndungen").doc(editId).update({ name, beschreibung });
      delete e.target.dataset.editId;
    } else {
      await db.collection("fahndungen").add({ name, beschreibung, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    }
    e.target.reset();
    loadFahndungen();
  } catch (err) {
    alert("Fehler: " + err.message);
  }
}

// === Fahrzeuge Anzeige ===
async function renderFahrzeuge() {
  let html = `
    <h2>Fahrzeuge</h2>
    <div id="fahrzeugeListe">
      <p>Lade Fahrzeuge...</p>
    </div>
  `;
  return html;
}

async function loadFahrzeuge() {
  const container = document.getElementById("fahrzeugeListe");
  container.innerHTML = "Lade Fahrzeuge...";
  try {
    const snapshot = await db.collection("fahrzeuge").get();
    if (snapshot.empty) {
      container.innerHTML = "<p>Keine Fahrzeuge vorhanden.</p>";
      return;
    }
    let html = "<ul class='fahrzeuge-list'>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<li><b>${data.fahrzeug}</b> - Besetzt von: ${data.besetztVon || "Niemand"}</li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<p>Fehler: ${err.message}</p>`;
  }
}

// === Status Seite (Balkendiagramm) ===
async function renderStatus() {
  let html = `
    <h2>Status</h2>
    <div id="statusChart">
      <p>Lade Statusdaten...</p>
    </div>
  `;
  return html;
}

async function loadStatus() {
  const container = document.getElementById("statusChart");
  container.innerHTML = "";
  try {
    // Beispiel: Anzahl Akten, Fahndungen, Fahrzeuge
    const aktenSnap = await db.collection("akten").get();
    const fahndungenSnap = await db.collection("fahndungen").get();
    const fahrzeugeSnap = await db.collection("fahrzeuge").get();

    const aktenCount = aktenSnap.size;
    const fahndungenCount = fahndungenSnap.size;
    const fahrzeugeCount = fahrzeugeSnap.size;

    // Einfaches ASCII Balkendiagramm (Text)
    function bar(count) {
      return "█".repeat(Math.min(count, 30));
    }

    container.innerHTML = `
      <pre>
Akten:       ${bar(aktenCount)} (${aktenCount})
Fahndungen:  ${bar(fahndungenCount)} (${fahndungenCount})
Fahrzeuge:   ${bar(fahrzeugeCount)} (${fahrzeugeCount})
      </pre>
    `;
  } catch (err) {
    container.innerHTML = `<p>Fehler: ${err.message}</p>`;
  }
}

// === Einstellungen (nur Admin) ===
function renderEinstellungen() {
  return `
    <h2>Einstellungen</h2>
    <p>Nur für Admins.</p>
    <p>Hier könnten weitere Admin-Einstellungen implementiert werden.</p>
  `;
}

// === Render Main Content ===
async function renderMainContent() {
  switch (currentPage) {
    case "dashboard":
      return renderDashboard();
    case "akten":
      return renderAkten();
    case "fahndungen":
      return renderFahndungen();
    case "fahrzeuge":
      return renderFahrzeuge();
    case "status":
      return renderStatus();
    case "einstellungen":
      if (currentUser.role === "admin") return renderEinstellungen();
      else return `<p>Zugriff verweigert.</p>`;
    default:
      return `<p>Seite nicht gefunden.</p>`;
  }
}

// === Render App ===
async function renderApp() {
  if (!currentUser) {
    currentUser = loadUserFromStorage();
    if (!currentUser) {
      currentPage = "login";
      renderLogin();
      return;
    }
  }

  const sidebar = renderSidebar();
  const mainContent = document.createElement("div");
  mainContent.className = "main-content";

  mainContent.innerHTML = await renderMainContent();

  app.innerHTML = "";
  app.appendChild(sidebar);
  app.appendChild(mainContent);

  // Attach form listeners for CRUD
  if (currentPage === "akten") {
    document.getElementById("aktenForm").addEventListener("submit", handleAktenFormSubmit);
    loadAkten();
  }
  if (currentPage === "fahndungen") {
    document.getElementById("fahndungenForm").addEventListener("submit", handleFahndungenFormSubmit);
    loadFahndungen();
  }
  if (currentPage === "fahrzeuge") {
    loadFahrzeuge();
  }
  if (currentPage === "status") {
    loadStatus();
  }
}

// === Init ===
loadTheme();
renderApp();
