// Navigation und Sektionen
const navLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Aktives Menü
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Inhalt anzeigen
    const target = link.dataset.section;
    sections.forEach(sec => {
      if (sec.id === target) {
        sec.classList.add('active');
        pageTitle.textContent = link.textContent.trim();
      } else {
        sec.classList.remove('active');
      }
    });
  });
});

// Dashboard Buttons auf Sektionen verlinken
document.getElementById('open-fahndung-section').addEventListener('click', () => activateSection('fahndung'));
document.getElementById('open-akten-section').addEventListener('click', () => activateSection('akten'));
document.getElementById('open-straftaten-section').addEventListener('click', () => activateSection('straftaten'));
document.getElementById('open-loadouts-section').addEventListener('click', () => activateSection('loadouts'));

function activateSection(id) {
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === id);
  });
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  const activeLink = [...navLinks].find(l => l.dataset.section === id);
  pageTitle.textContent = activeLink.textContent.trim();
}

// --- Fahndung Form & Liste ---
const fahndungForm = document.getElementById('fahndung-form');
const fahndungList = document.getElementById('fahndung-list');

let fahndungen = JSON.parse(localStorage.getItem('fahndungen')) || [];

function renderFahndungen() {
  fahndungList.innerHTML = '';
  if(fahndungen.length === 0) {
    fahndungList.innerHTML = '<div>Keine Fahndungen vorhanden.</div>';
    return;
  }
  fahndungen.forEach((f, i) => {
    const div = document.createElement('div');
    div.textContent = `${f.name} - ${f.beschreibung}`;
    div.title = 'Zum Löschen klicken';
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      if(confirm(`Fahndung "${f.name}" löschen?`)) {
        fahndungen.splice(i,1);
        saveFahndungen();
        renderFahndungen();
      }
    });
    fahndungList.appendChild(div);
  });
}

function saveFahndungen() {
  localStorage.setItem('fahndungen', JSON.stringify(fahndungen));
}

fahndungForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fahndung-name').value.trim();
  const beschreibung = document.getElementById('fahndung-beschreibung').value.trim();
  if(name) {
    fahndungen.push({name, beschreibung});
    saveFahndungen();
    renderFahndungen();
    fahndungForm.reset();
  }
});

renderFahndungen();

// --- Akten Form & Liste ---
const aktenForm = document.getElementById('akten-form');
const aktenList = document.getElementById('akten-list');

let akten = JSON.parse(localStorage.getItem('akten')) || [];

function renderAkten() {
  aktenList.innerHTML = '';
  if(akten.length === 0) {
    aktenList.innerHTML = '<div>Keine Akten vorhanden.</div>';
    return;
  }
  akten.forEach((a, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${a.titel}</strong>: ${a.inhalt}`;
    div.title = 'Zum Löschen klicken';
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      if(confirm(`Akte "${a.titel}" löschen?`)) {
        akten.splice(i,1);
        saveAkten();
        renderAkten();
      }
    });
    aktenList.appendChild(div);
  });
}

function saveAkten() {
  localStorage.setItem('akten', JSON.stringify(akten));
}

aktenForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titel = document.getElementById('akten-titel').value.trim();
  const inhalt = document.getElementById('akten-inhalt').value.trim();
  if(titel) {
    akten.push({titel, inhalt});
    saveAkten();
    renderAkten();
    aktenForm.reset();
  }
});

renderAkten();

// --- Loadouts Form & Liste ---
const loadoutForm = document.getElementById('loadout-form');
const loadoutList = document.getElementById('loadout-list');

let loadouts = JSON.parse(localStorage.getItem('loadouts')) || [];

function renderLoadouts() {
  loadoutList.innerHTML = '';
  if(loadouts.length === 0) {
    loadoutList.innerHTML = '<div>Keine Loadouts gespeichert.</div>';
    return;
  }
  loadouts.forEach((l, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${l.name}</strong>: ${l.weapons.join(', ')}`;
    div.title = 'Zum Löschen klicken';
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      if(confirm(`Loadout "${l.name}" löschen?`)) {
        loadouts.splice(i,1);
        saveLoadouts();
        renderLoadouts();
      }
    });
    loadoutList.appendChild(div);
  });
}

function saveLoadouts() {
  localStorage.setItem('loadouts', JSON.stringify(loadouts));
}

loadoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('loadout-name').value.trim();
  const selectedOptions = [...document.getElementById('loadout-weapons').selectedOptions];
  const weapons = selectedOptions.map(opt => opt.value);
  if(name && weapons.length > 0) {
    loadouts.push({name, weapons});
    saveLoadouts();
    renderLoadouts();
    loadoutForm.reset();
  } else {
    alert('Bitte Name und mindestens eine Waffe auswählen!');
  }
});

renderLoadouts();
