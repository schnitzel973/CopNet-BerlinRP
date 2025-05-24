// === Variablen und DOM Referenzen ===
const sidebarItems = document.querySelectorAll('.sidebar-item');
const sections = document.querySelectorAll('.content-section');
const aktenList = document.getElementById('akten-list');
const aktenFilterName = document.getElementById('akten-filter-name');
const aktenFilterKrim = document.getElementById('akten-filter-kriminalitaet');
const aktenFilterReset = document.getElementById('akten-filter-reset');
const aktenNeuBtn = document.getElementById('akten-neu-btn');
const aktenModal = document.getElementById('akten-modal');
const aktenForm = document.getElementById('akten-form');
const aktenCancelBtn = document.getElementById('akten-cancel-btn');

const vermerkFields = document.getElementById('vermerk-fields');
const krimFields = document.getElementById('kriminalitaet-fields');

// === Daten ===
// Beispielhafte Dummy-Daten
let akten = [
  {
    id: 1,
    art: 'leicht',
    name: 'Max Mustermann',
    alter: 29,
    geschlecht: 'm',
    haarfarbe: 'Braun',
    job: 'Lieferfahrer',
    wohnort: 'Berlin-Mitte',
    auto: 'B-MA 1234',
    geldstrafe: 150,
    hafteinheiten: 2,
    paragraefe: '§123, §45a',
    unterschrift: 'LKA Berlin',
    datum: '2025-05-20',
  },
  {
    id: 2,
    art: 'vermerk',
    name: 'Lena Müller',
    bemerkung: 'Verhaltensauffälligkeit im Streifendienst.',
  },
  {
    id: 3,
    art: 'schwer',
    name: 'Peter Schwarz',
    alter: 43,
    geschlecht: 'm',
    haarfarbe: 'Schwarz',
    job: 'Mechaniker',
    wohnort: 'Berlin-Neukölln',
    auto: 'B-PS 9876',
    geldstrafe: 800,
    hafteinheiten: 15,
    paragraefe: '§211, §212',
    unterschrift: 'LKA Berlin',
    datum: '2025-04-15',
  }
];

// === Funktionen ===

// Navigation umschalten
function setActiveSection(sectionName) {
  sections.forEach(s => {
    s.classList.toggle('active', s.id === sectionName);
  });

  sidebarItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionName);
    if(item.dataset.section === sectionName) {
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('tabindex', '-1');
    }
  });
}

// Akten Liste rendern mit Filter
function renderAktenList() {
  let filterName = aktenFilterName.value.toLowerCase().trim();
  let filterArt = aktenFilterKrim.value;

  let filtered = akten.filter(akte => {
    let matchName = akte.name.toLowerCase().includes(filterName);
    let matchArt = (filterArt === 'alle') || (akte.art === filterArt);
    if(filterArt === 'vermerk') {
      // Bei Vermerk nur vermerk akten
      return matchName && akte.art === 'vermerk';
    }
    return matchName && matchArt;
  });

  if(filtered.length === 0) {
    aktenList.innerHTML = `<p class="no-results">Keine Akten gefunden.</p>`;
    return;
  }

  aktenList.innerHTML = filtered.map(akte => {
    let artLabel = '';
    switch(akte.art) {
      case 'leicht': artLabel = 'Leichte Kriminalität'; break;
      case 'mittel': artLabel = 'Mittlere Kriminalität'; break;
      case 'schwer': artLabel = 'Schwere Kriminalität'; break;
      case 'vermerk': artLabel = 'Vermerk'; break;
    }

    return `
      <div class="akte-item" data-id="${akte.id}" tabindex="0" role="button" aria-pressed="false" aria-label="Akteneintrag ${akte.name}, ${artLabel}">
        <div class="akte-name">${akte.name}</div>
        <div class="akte-art">${artLabel}</div>
      </div>
    `;
  }).join('');
}

// Modal anzeigen/ausblenden
function toggleModal(show) {
  if(show) {
    aktenModal.classList.remove('hidden');
    // Fokus setzen auf erstes Eingabefeld
    setTimeout(() => {
      aktenForm.querySelector('input[type="radio"]').focus();
    }, 100);
  } else {
    aktenModal.classList.add('hidden');
    aktenForm.reset();
    showVermerkFields();
  }
}

// Formular Felder wechseln je nach Aktenart
function showVermerkFields() {
  vermerkFields.classList.remove('hidden');
  krimFields.classList.add('hidden');
}

function showKrimFields() {
  vermerkFields.classList.add('hidden');
  krimFields.classList.remove('hidden');
}

// Modal Felder umschalten anhand Radiobuttons
aktenForm.querySelectorAll('input[name="aktenart"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if(e.target.value === 'vermerk') {
      showVermerkFields();
    } else {
      showKrimFields();
    }
  });
});

// Neue Akte speichern (Einfach in Array pushen + neu rendern)
aktenForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const art = aktenForm.querySelector('input[name="aktenart"]:checked').value;

  if(art === 'vermerk') {
    const name = aktenForm['vermerk-name'].value.trim();
    const bemerkung = aktenForm['vermerk-bemerkung'].value.trim();

    if(!name || !bemerkung) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    akten.push({
      id: Date.now(),
      art,
      name,
      bemerkung,
    });
  } else {
    // Kriminalität Akte
    const name = aktenForm['krim-name'].value.trim();
    const alter = parseInt(aktenForm['krim-alter'].value, 10);
    const geschlecht = aktenForm['krim-geschlecht'].value;
    const haarfarbe = aktenForm['krim-haarfarbe'].value.trim();
    const job = aktenForm['krim-job'].value.trim();
    const wohnort = aktenForm['krim-wohnort'].value.trim();
    const auto = aktenForm['krim-auto'].value.trim();
    const geldstrafe = parseInt(aktenForm['krim-geldstrafe'].value, 10) || 0;
    const hafteinheiten = parseInt(aktenForm['krim-hafteinheiten'].value, 10) || 0;
    const paragraefe = aktenForm['krim-paragraefe'].value.trim();
    const unterschrift = aktenForm['krim-unterschrift'].value.trim();
    const datum = aktenForm['krim-datum'].value;

    if(!name || !alter || !geschlecht || !haarfarbe || !job || !wohnort || !unterschrift || !datum) {
      alert('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    akten.push({
      id: Date.now(),
      art,
      name,
      alter,
      geschlecht,
      haarfarbe,
      job,
      wohnort,
      auto,
      geldstrafe,
      hafteinheiten,
      paragraefe,
      unterschrift,
      datum,
    });
  }

  renderAktenList();
  toggleModal(false);
});

// Akten Liste Klick -> Modal mit Details
aktenList.addEventListener('click', (e) => {
  const akteItem = e.target.closest('.akte-item');
  if(!akteItem) return;

  const id = Number(akteItem.dataset.id);
  const akte = akten.find(a => a.id === id);
  if(!akte) return;

  showDetailsModal(akte);
});

aktenList.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const akteItem = e.target.closest('.akte-item');
    if(!akteItem) return;

    const id = Number(akteItem.dataset.id);
    const akte = akten.find(a => a.id === id);
    if(!akte) return;

    showDetailsModal(akte);
  }
});

function showDetailsModal(akte) {
  // Modal Content anpassen je nach Akte
  const modalContent = aktenModal.querySelector('.modal-content');

  if(akte.art === 'vermerk') {
    modalContent.innerHTML = `
      <h3>Vermerk: ${akte.name}</h3>
      <p>${akte.bemerkung}</p>
      <button id="details-close-btn" class="btn-primary">Schließen</button>
    `;
  } else {
    modalContent.innerHTML = `
      <h3>Akten-Eintrag: ${akte.name}</h3>
      <ul>
        <li><strong>Alter:</strong> ${akte.alter}</li>
        <li><strong>Geschlecht:</strong> ${akte.geschlecht === 'm' ? 'Männlich' : 'Weiblich'}</li>
        <li><strong>Haarfarbe:</strong> ${akte.haarfarbe}</li>
        <li><strong>Beruf:</strong> ${akte.job}</li>
        <li><strong>Wohnort:</strong> ${akte.wohnort}</li>
        <li><strong>Auto:</strong> ${akte.auto || '-'}</li>
        <li><strong>Geldstrafe:</strong> ${akte.geldstrafe} €</li>
        <li><strong>Hafteinheiten:</strong> ${akte.hafteinheiten}</li>
        <li><strong>Paragrafen:</strong> ${akte.paragraefe}</li>
        <li><strong>Unterschrift:</strong> ${akte.unterschrift}</li>
        <li><strong>Datum:</strong> ${akte.datum}</li>
      </ul>
      <button id="details-close-btn" class="btn-primary">Schließen</button>
    `;
  }

  aktenModal.classList.remove('hidden');
  const closeBtn = document.getElementById('details-close-btn');
  closeBtn.focus();

  closeBtn.addEventListener('click', () => {
    toggleModal(false);
    // Modal Inhalt zurücksetzen
    aktenForm.reset();
    showVermerkFields();
  });
}

// Filter Reset
aktenFilterReset.addEventListener('click', () => {
  aktenFilterName.value = '';
  aktenFilterKrim.value = 'alle';
  renderAktenList();
});

// Filter Change
aktenFilterName.addEventListener('input', () => {
  renderAktenList();
});
aktenFilterKrim.addEventListener('change', () => {
  renderAktenList();
});

// Neue Akte Button
aktenNeuBtn.addEventListener('click', () => {
  toggleModal(true);
});

// Modal Cancel Button
aktenCancelBtn.addEventListener('click', () => {
  toggleModal(false);
});

// Navigation Klicks
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    setActiveSection(item.dataset.section);
  });
});

// Initial Setup
setActiveSection('dashboard');
renderAktenList();
