// Referenzen zu UI Elementen
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const modalTextarea = document.getElementById('modal-textarea');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const clearStorageBtn = document.getElementById('clear-storage');

let currentList = ''; // Aktuelle Kategorie für Modal

// Daten speichern und laden (LocalStorage)
const STORAGE_KEY = 'copnet_berlinrp_data';

let copnetData = {
  fahndung: [],
  akten: [],
  straftaten: [],
  personen: [],
  berichte: [],
};

// --- Funktionen ---

// Daten laden
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      copnetData = JSON.parse(saved);
    } catch (e) {
      console.error('Fehler beim Laden der Daten:', e);
    }
  }
}

// Daten speichern
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copnetData));
}

// Anzeige aktualisieren
function renderList(category) {
  const listEl = document.getElementById(`${category}-list`);
  listEl.innerHTML = '';
  copnetData[category].forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.title;
    li.title = item.details || '';
    li.addEventListener('click', () => {
      alert(`Details:\n${item.details || 'Keine weiteren Details.'}`);
    });
    listEl.appendChild(li);
  });
}

// Alle Listen rendern
function renderAll() {
  for (const category in copnetData) {
    renderList(category);
  }
}

// Navigation umschalten
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Aktive Buttons und Sektionen setzen
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const sectionId = btn.dataset.section;
    sections.forEach(s => {
      s.classList.toggle('active', s.id === sectionId);
    });
  });
});

// Modal öffnen
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    currentList = btn.dataset.list;
    modalTitle.textContent = `Neuer Eintrag in ${capitalize(currentList)}`;
    modalInput.value = '';
    modalTextarea.value = '';
    openModal();
  });
});

// Modal speichern
modalSaveBtn.addEventListener('click', () => {
  const title = modalInput.value.trim();
  const details = modalTextarea.value.trim();

  if (!title) {
    alert('Bitte einen Titel eingeben!');
    return;
  }

  copnetData[currentList].push({ title, details });
  saveData();
  renderList(currentList);
  closeModal();
});

// Modal abbrechen
modalCancelBtn.addEventListener('click', closeModal);

// Modal Funktionen
function openModal() {
  modal.classList.remove('hidden');
  modalInput.focus();
}
function closeModal() {
  modal.classList.add('hidden');
}

// Hilfsfunktion
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Clear all data
clearStorageBtn.addEventListener('click', () => {
  if (confirm('Alle Daten löschen? Dies kann nicht rückgängig gemacht werden.')) {
    copnetData = {
      fahndung: [],
      akten: [],
      straftaten: [],
      personen: [],
      berichte: [],
    };
    saveData();
    renderAll();
    alert('Alle Daten wurden gelöscht.');
  }
});

// Initialisieren
loadData();
renderAll();
