// === CopNet BerlinRP - Akten System & Navigation ===

// --- Datenstruktur für Akten ---
let copnetData = {
  akten: [],
  fahndung: [],
  straftaten: []
};

const aktenList = document.getElementById('akten-list');
const filterNameInput = document.getElementById('akten-filter-name');
const filterCrimeSelect = document.getElementById('akten-filter-crime');
const addAkteBtn = document.querySelector('.btn-add[data-list="akten"]');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const crimeTypeSelect = document.getElementById('crimeTypeSelect');
const aktenForm = document.getElementById('akten-form');
const saveBtn = document.getElementById('modal-save-btn');
const cancelBtn = document.getElementById('modal-cancel-btn');

let editIndex = null;

// --- Formularfelder je Kategorie ---
const formFields = {
  Vermerk: [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'bemerkung', label: 'Bemerkung', type: 'textarea' }
  ],
  'Leichte Kriminalität': [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'alter', label: 'Alter', type: 'number' },
    { id: 'geschlecht', label: 'Geschlecht', type: 'text' },
    { id: 'haarfarbe', label: 'Haarfarbe', type: 'text' },
    { id: 'job', label: 'Job', type: 'text' },
    { id: 'wohnort', label: 'Wohnort', type: 'text' },
    { id: 'auto', label: 'Auto-Kennzeichen', type: 'text' },
    { id: 'geldstrafe', label: 'Geldstrafe', type: 'text' },
    { id: 'hafteinheiten', label: 'Hafteinheiten', type: 'text' },
    { id: 'gesetze', label: 'Gesetze gegen die verstoßen wurden', type: 'textarea' },
    { id: 'unterschrift', label: 'Unterschrift', type: 'text' },
    { id: 'datum', label: 'Datum', type: 'date' }
  ],
  'Mittlere Kriminalität': [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'alter', label: 'Alter', type: 'number' },
    { id: 'geschlecht', label: 'Geschlecht', type: 'text' },
    { id: 'haarfarbe', label: 'Haarfarbe', type: 'text' },
    { id: 'job', label: 'Job', type: 'text' },
    { id: 'wohnort', label: 'Wohnort', type: 'text' },
    { id: 'auto', label: 'Auto-Kennzeichen', type: 'text' },
    { id: 'geldstrafe', label: 'Geldstrafe', type: 'text' },
    { id: 'hafteinheiten', label: 'Hafteinheiten', type: 'text' },
    { id: 'gesetze', label: 'Gesetze gegen die verstoßen wurden', type: 'textarea' },
    { id: 'unterschrift', label: 'Unterschrift', type: 'text' },
    { id: 'datum', label: 'Datum', type: 'date' }
  ],
  'Schwere Kriminalität': [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'alter', label: 'Alter', type: 'number' },
    { id: 'geschlecht', label: 'Geschlecht', type: 'text' },
    { id: 'haarfarbe', label: 'Haarfarbe', type: 'text' },
    { id: 'job', label: 'Job', type: 'text' },
    { id: 'wohnort', label: 'Wohnort', type: 'text' },
    { id: 'auto', label: 'Auto-Kennzeichen', type: 'text' },
    { id: 'geldstrafe', label: 'Geldstrafe', type: 'text' },
    { id: 'hafteinheiten', label: 'Hafteinheiten', type: 'text' },
    { id: 'gesetze', label: 'Gesetze gegen die verstoßen wurden', type: 'textarea' },
    { id: 'unterschrift', label: 'Unterschrift', type: 'text' },
    { id: 'datum', label: 'Datum', type: 'date' }
  ]
};

// --- Daten laden ---
function loadData() {
  const saved = localStorage.getItem('copnetData');
  if (saved) {
    copnetData = JSON.parse(saved);
  }
}

// --- Daten speichern ---
function saveData() {
  localStorage.setItem('copnetData', JSON.stringify(copnetData));
}

// --- Formular bauen ---
function buildForm(category) {
  aktenForm.innerHTML = '';
  const fields = formFields[category];
  fields.forEach(field => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.textContent = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.id = field.id;
    input.name = field.id;
    input.value = '';
    input.required = (field.id === 'name');
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    aktenForm.appendChild(wrapper);
  });
}

// --- Akten rendern ---
function renderAkten() {
  aktenList.innerHTML = '';
  const filterName = filterNameInput.value.toLowerCase();
  const filterCrime = filterCrimeSelect.value;

  copnetData.akten.forEach((akte, idx) => {
    const name = akte.name ? akte.name.toLowerCase() : '';
    const crime = akte.category;

    if (filterName && !name.includes(filterName)) return;
    if (filterCrime && crime !== filterCrime) return;

    const li = document.createElement('li');

    if (crime === 'Vermerk') {
      li.textContent = `Name: ${akte.name}\nBemerkung: ${akte.bemerkung || ''}`;
    } else {
      li.textContent =
        `Name: ${akte.name}\n` +
        `Alter: ${akte.alter}\n` +
        `Geschlecht: ${akte.geschlecht}\n` +
        `Haarfarbe: ${akte.haarfarbe}\n` +
        `Job: ${akte.job}\n` +
        `Wohnort: ${akte.wohnort}\n` +
        `Auto-Kennzeichen: ${akte.auto}\n` +
        `Geldstrafe: ${akte.geldstrafe}\n` +
        `Hafteinheiten: ${akte.hafteinheiten}\n` +
        `Gesetze gegen die verstoßen wurden:\n${akte.gesetze}\n` +
        `Unterschrift: ${akte.unterschrift}\n` +
        `Datum: ${akte.datum}`;
    }

    aktenList.appendChild(li);
  });
}

// --- Modal öffnen ---
function openModal() {
  modal.classList.remove('hidden');
  crimeTypeSelect.value = 'Vermerk';
  buildForm('Vermerk');
  modalTitle.textContent = 'Neue Akte erstellen';
  editIndex = null;
}

// --- Modal schließen ---
function closeModal() {
  modal.classList.add('hidden');
  aktenForm.reset();
}

// --- Kategorie ändert Formular ---
crimeTypeSelect.addEventListener('change', () => {
  buildForm(crimeTypeSelect.value);
});

// --- Speichern ---
saveBtn.addEventListener('click', () => {
  const category = crimeTypeSelect.value;
  const fields = formFields[category];
  let newEntry = { category };
  let valid = true;

  fields.forEach(field => {
    const val = aktenForm[field.id].value.trim();
    if (field.id === 'name' && !val) valid = false;
    newEntry[field.id] = val;
  });

  if (!valid) {
    alert('Bitte den Namen ausfüllen!');
    return;
  }

  if (editIndex !== null) {
    copnetData.akten[editIndex] = newEntry;
  } else {
    copnetData.akten.push(newEntry);
  }

  saveData();
  renderAkten();
  closeModal();
});

// --- Abbrechen ---
cancelBtn.addEventListener('click', () => {
  closeModal();
});

// --- Filter Events ---
filterNameInput.addEventListener('input', renderAkten);
filterCrimeSelect.addEventListener('change', renderAkten);

// --- Add Akte Button ---
addAkteBtn.addEventListener('click', () => {
  openModal();
});

// --- Navigation ---
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.content-section').forEach(section => {
      section.style.display = 'none';
    });

    const target = link.getAttribute('href').substring(1);
    document.getElementById(target).style.display = 'block';
  });
});

// --- Initialisierung ---
loadData();
renderAkten();
