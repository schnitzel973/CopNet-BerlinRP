// --- Datenstruktur ---
let copnetData = {
  akten: [],
  fahndung: [],
  straftaten: []
};

// --- Laden / Speichern ---
function saveData() {
  localStorage.setItem('copnetData', JSON.stringify(copnetData));
}
function loadData() {
  const data = localStorage.getItem('copnetData');
  if(data) copnetData = JSON.parse(data);
}

// --- HTML Elemente ---
const aktenList = document.getElementById('akten-list');
const filterNameInput = document.getElementById('akten-filter-name');
const filterCrimeSelect = document.getElementById('akten-filter-crime');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const crimeTypeSelect = document.getElementById('crimeTypeSelect');
const aktenForm = document.getElementById('akten-form');
const saveBtn = document.getElementById('modal-save-btn');
const cancelBtn = document.getElementById('modal-cancel-btn');

const addAkteBtn = document.querySelector('button.btn-add[data-list="akten"]');

let editIndex = null; // Für Bearbeitung (noch nicht implementiert)

// --- Felder für Akten nach Kategorie ---
const formFields = {
  Vermerk: [
    { label: 'Name', id: 'name', type: 'text' },
    { label: 'Bemerkung', id: 'bemerkung', type: 'textarea' }
  ],
  'Leichte Kriminalität': [
    { label: 'Name', id: 'name', type: 'text' },
    { label: 'Alter', id: 'alter', type: 'number' },
    { label: 'Geschlecht', id: 'geschlecht', type: 'text' },
    { label: 'Haarfarbe', id: 'haarfarbe', type: 'text' },
    { label: 'Job', id: 'job', type: 'text' },
    { label: 'Wohnort', id: 'wohnort', type: 'text' },
    { label: 'Auto-Kennzeichen', id: 'auto', type: 'text' },
    { label: 'Geldstrafe', id: 'geldstrafe', type: 'text' },
    { label: 'Hafteinheiten', id: 'hafteinheiten', type: 'text' },
    { label: 'Gesetze gegen die verstoßen wurden', id: 'gesetze', type: 'textarea' },
    { label: 'Unterschrift', id: 'unterschrift', type: 'text' },
    { label: 'Datum', id: 'datum', type: 'date' }
  ],
  'Mittlere Kriminalität': [
    // Gleiche Felder wie bei "Leichte Kriminalität"
    { label: 'Name', id: 'name', type: 'text' },
    { label: 'Alter', id: 'alter', type: 'number' },
    { label: 'Geschlecht', id: 'geschlecht', type: 'text' },
    { label: 'Haarfarbe', id: 'haarfarbe', type: 'text' },
    { label: 'Job', id: 'job', type: 'text' },
    { label: 'Wohnort', id: 'wohnort', type: 'text' },
    { label: 'Auto-Kennzeichen', id: 'auto', type: 'text' },
    { label: 'Geldstrafe', id: 'geldstrafe', type: 'text' },
    { label: 'Hafteinheiten', id: 'hafteinheiten', type: 'text' },
    { label: 'Gesetze gegen die verstoßen wurden', id: 'gesetze', type: 'textarea' },
    { label: 'Unterschrift', id: 'unterschrift', type: 'text' },
    { label: 'Datum', id: 'datum', type: 'date' }
  ],
  'Schwere Kriminalität': [
    // Gleiche Felder wie bei "Leichte Kriminalität"
    { label: 'Name', id: 'name', type: 'text' },
    { label: 'Alter', id: 'alter', type: 'number' },
    { label: 'Geschlecht', id: 'geschlecht', type: 'text' },
    { label: 'Haarfarbe', id: 'haarfarbe', type: 'text' },
    { label: 'Job', id: 'job', type: 'text' },
    { label: 'Wohnort', id: 'wohnort', type: 'text' },
    { label: 'Auto-Kennzeichen', id: 'auto', type: 'text' },
    { label: 'Geldstrafe', id: 'geldstrafe', type: 'text' },
    { label: 'Hafteinheiten', id: 'hafteinheiten', type: 'text' },
    { label: 'Gesetze gegen die verstoßen wurden', id: 'gesetze', type: 'textarea' },
    { label: 'Unterschrift', id: 'unterschrift', type: 'text' },
    { label: 'Datum', id: 'datum', type: 'date' }
  ]
};

// --- Funktion: Modal-Formular aufbauen ---
function buildForm(category, data = {}) {
  aktenForm.innerHTML = ''; // Reset form

  const fields = formFields[category] || [];
  fields.forEach(field => {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '12px';

    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = field.id;
    label.style.display = 'block';
    label.style.fontWeight = '600';
    label.style.marginBottom = '6px';

    let input;
    if(field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.id = field.id;
    input.name = field.id;
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.border = '1.5px solid #cdd4e0';
    input.style.borderRadius = '10px';
    input.value = data[field.id] || '';

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    aktenForm.appendChild(wrapper);
  });
}

// --- Funktion: Akten anzeigen ---
function renderAkten() {
  const filterName = filterNameInput.value.toLowerCase();
  const filterCrime = filterCrimeSelect.value;

  aktenList.innerHTML = '';

  copnetData.akten.forEach((akte, idx) => {
    const name = akte.name ? akte.name.toLowerCase() : '';
    const crime = akte.category || '';

    if(filterName && !name.includes(filterName)) return;
    if(filterCrime && crime !== filterCrime) return;

    const li = document.createElement('li');

    if(crime === 'Vermerk') {
      // Nur Name + Bemerkung anzeigen
      li.textContent = `Name: ${akte.name}\nBemerkung: ${akte.bemerkung || ''}`;
    } else {
      // Große Vorlage
      let text = '';
      text += `Name: ${akte.name}\n`;
      text += `Alter: ${akte.alter}\n`;
      text += `Geschlecht: ${akte.geschlecht}\n`;
      text += `Haarfarbe: ${akte.haarfarbe}\n`;
      text += `Job: ${akte.job}\n`;
      text += `Wohnort: ${akte.wohnort}\n`;
      text += `Auto-Kennzeichen: ${akte.auto}\n`;
      text += `Geldstrafe: ${akte.geldstrafe}\n`;
      text += `Hafteinheiten: ${akte.hafteinheiten}\n`;
      text += `Gesetze gegen die verstoßen wurden:\n${akte.gesetze}\n`;
      text += `Unterschrift: ${akte.unterschrift}\n`;
      text += `Datum: ${akte.datum}\n`;
      li.textContent = text;
    }

    aktenList.appendChild(li);
  });
}

// --- Modal Öffnen ---
function openModal() {
  modal.classList.remove('hidden');
  crimeTypeSelect.value = 'Vermerk';
  buildForm('Vermerk');
  modalTitle.textContent = 'Neue Akte erstellen';
  editIndex = null;
}

// --- Modal Schließen ---
function closeModal() {
  modal.classList.add('hidden');
  aktenForm.reset();
}

// --- Wenn Kategorie geändert wird, Form neu bauen ---
crimeTypeSelect.addEventListener('change', () => {
  buildForm(crimeTypeSelect.value);
});

// --- Speichern ---
saveBtn.addEventListener('click', () => {
  // Werte aus Formular auslesen
  const category = crimeTypeSelect.value;
  const fields = formFields[category];

  let newEntry = { category };

  // Prüfe alle Felder aus
  let valid = true;
  fields.forEach(field => {
    const val = aktenForm[field.id].value.trim();
    if(field.id === 'name' && !val) valid = false; // Name Pflichtfeld
    newEntry[field.id] = val;
  });

  if(!valid) {
    alert('Bitte mindestens den Namen ausfüllen.');
    return;
  }

  // Eintrag speichern
  copnetData.akten.push(newEntry);
  saveData();
  renderAkten();
  closeModal();
});

// --- Abbrechen ---
cancelBtn.addEventListener('click', closeModal);

// --- Filter Events ---
filterNameInput.addEventListener('input', renderAkten);
filterCrimeSelect.addEventListener('change', renderAkten);

// --- Add Button ---
addAkteBtn.addEventListener('click', openModal);

// --- Init ---
loadData();
renderAkten();


// --- Navigation (einfach für deine Seite) ---
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const target = link.getAttribute('href').substring(1);
    document.querySelectorAll('main > section').forEach(section => {
      section.style.display = section.id === target ? 'block' : 'none';
    });
  });
});
