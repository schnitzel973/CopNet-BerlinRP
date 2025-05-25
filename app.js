// Seitenwechsel: Zeige die ausgewählte Seite, verstecke alle anderen
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Umschalten der Felder im Aktenformular
function toggleAktenFields() {
  const typ = document.getElementById("aktenTyp").value;
  document.getElementById("vermerkFields").style.display = (typ === "vermerk") ? "block" : "none";
  document.getElementById("akteFields").style.display = (typ !== "vermerk") ? "block" : "none";
}

// Neue Akte hinzufügen
function addAkte() {
  const list = document.getElementById("aktenList");
  const typ = document.getElementById("aktenTyp").value;
  let content = '';

  if (typ === "vermerk") {
    const name = document.getElementById("vermerkName").value.trim();
    const text = document.getElementById("vermerkText").value.trim();

    if (!name || !text) {
      alert("Bitte Name und Bemerkung ausfüllen!");
      return;
    }

    content = `<div class="akte-card"><h4>${escapeHtml(name)}</h4><p>${escapeHtml(text)}</p></div>`;

    // Formular reset
    document.getElementById("vermerkName").value = '';
    document.getElementById("vermerkText").value = '';

  } else {
    // Werte holen
    const fields = [
      "akteName","akteAlter","akteGeschlecht","akteHaarfarbe",
      "akteJob","akteWohnort","akteKennzeichen","akteStrafe",
      "akteHaft","akteGesetze","akteUnterschrift","akteDatum"
    ];
    let missing = false;
    fields.forEach(f => {
      if (!document.getElementById(f).value.trim()) missing = true;
    });
    if (missing) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    content = `
    <div class="akte-card">
      <h4>${escapeHtml(document.getElementById("akteName").value)}</h4>
      <p>Alter: ${escapeHtml(document.getElementById("akteAlter").value)}</p>
      <p>Geschlecht: ${escapeHtml(document.getElementById("akteGeschlecht").value)}</p>
      <p>Haarfarbe: ${escapeHtml(document.getElementById("akteHaarfarbe").value)}</p>
      <p>Job: ${escapeHtml(document.getElementById("akteJob").value)}</p>
      <p>Wohnort: ${escapeHtml(document.getElementById("akteWohnort").value)}</p>
      <p>Auto-Kennzeichen: ${escapeHtml(document.getElementById("akteKennzeichen").value)}</p>
      <p>Geldstrafe: ${escapeHtml(document.getElementById("akteStrafe").value)} €</p>
      <p>Hafteinheiten: ${escapeHtml(document.getElementById("akteHaft").value)}</p>
      <p>Gesetze: ${escapeHtml(document.getElementById("akteGesetze").value)}</p>
      <p>Unterschrift: ${escapeHtml(document.getElementById("akteUnterschrift").value)}</p>
      <p>Datum: ${escapeHtml(document.getElementById("akteDatum").value)}</p>
    </div>`;

    // Formular reset
    fields.forEach(f => {
      document.getElementById(f).value = '';
    });
  }

  list.insertAdjacentHTML('beforeend', content);
  updateStats();
}

// Statistik aktualisieren
function updateStats() {
  const count = document.querySelectorAll(".akte-card").length;
  document.getElementById("aktenCount").innerText = `📂 Akten: ${count}`;
}

// HTML escapen (Security)
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  toggleAktenFields(); // initiales Umschalten
  updateStats();       // initiale Statistik
});
