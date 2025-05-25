// Referenzen
const sidebarItems = document.querySelectorAll('.sidebar-item');
const sections = document.querySelectorAll('.content-section');

const aktenModal = document.getElementById('akten-modal');
const aktenForm = document.getElementById('akten-form');
const aktenList = document.getElementById('akten-list');
const aktenFilterName = document.getElementById('akten-filter-name');
const aktenFilterKrim = document.getElementById('akten-filter-kriminalitaet');
const aktenFilterReset = document.getElementById('akten-filter-reset');
const aktenNeuBtn = document.getElementById('akten-neu-btn');
const aktenCancelBtn = document.getElementById('akten-cancel-btn');

let akten = [];

// Navigation wechseln
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    setActiveSection(item.dataset.section);
  });
  item.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSection(item.dataset.section);
    }
  });
});

function setActiveSection(sectionId) {
  sections.forEach(sec => {
    sec.classList.toggle('active', sec.id === sectionId);
  });

  sidebarItems.forEach(item => {
    const isActive = item.dataset.section === sectionId;
    item.classList.toggle('active', isActive);
    item.tabIndex = isActive ? 0 : -1;
    if (isActive) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

// Modal Ein/Aus
function toggleModal(show) {
  if(show) {
    aktenModal.classList.remove('hidden');
    // Fokus auf erstes Feld
    setTimeout(() => {
      aktenForm.querySelector('input,textarea,select').focus();
    }, 100);
  } else {
    aktenModal.classList.add('hidden');
    aktenForm.reset();
    showVermerkFields();
  }
}

// Modal Art-Felder wechseln
aktenForm.aktenart.forEach(radio => {
  radio.addEventListener('change', () => {
    if(radio.value === 'vermerk') {
      showVermerkFields();
    } else {
      showKriminalitaetFields();
    }
  });
});

function showVermerkFields() {
  document.getElementById('vermerk-fields').classList.remove('hidden');
  document.getElementById('kriminalitaet-fields').classList.add('hidden');

  // Pflichtfelder anpassen
  document.getElementById('vermerk-name').required = true;
  document.getElementById('vermerk-bemerkung').required = true;

  const krimFields = ['krim-name','krim-alter','krim-geschlecht','krim-haarfarbe','krim-job','krim-wohnort','krim-auto','krim-geldstrafe','krim-hafteinheiten','krim-paragraefe','krim-unterschrift','krim-datum'];
  krimFields.forEach(id => {
    document.getElementById(id).required = false;
  });
}

function showKriminalitaetFields() {
  document.getElementById('vermerk-fields').classList.add('hidden');
  document.getElementById('kriminalitaet-fields').classList.remove('hidden');

  // Pflichtfelder anpassen
  document.getElementById('vermerk-name').required = false;
  document.getElementById('vermerk-bemerkung').required = false;

  const krimFields = ['krim-name','krim-alter','krim-geschlecht','krim-haarfarbe','krim-job','krim-wohnort','krim-auto','krim-geldstrafe','krim-hafteinheiten','krim-paragraefe','krim-unterschrift','krim-datum'];
  krimFields.forEach(id => {
    document.getElementById(id).required = true;
  });
}

// Akte speichern
aktenForm.addEventListener('submit', e => {
  e.preventDefault();

  const art = aktenForm.aktenart.value;

  let neueAkte = { art, id: Date.now() };

  if(art === 'vermerk') {
    neueAkte.name = aktenForm['vermerk-name'].value.trim();
    neueAkte.bemerkung = aktenForm['vermerk-bemerkung'].value.trim();
  } else {
    neueAkte.name = aktenForm['krim-name'].value.trim();
    neueAkte.alter = aktenForm['krim-alter'].value.trim();
    neueAkte.geschlecht = aktenForm['krim-geschlecht'].value;
    neueAkte.haarfarbe = aktenForm['krim-haarfarbe'].value.trim();
    neueAkte.job = aktenForm['krim-job'].value.trim();
    neueAkte.wohnort = aktenForm['krim-wohnort'].value.trim();
    neueAkte.auto = aktenForm['krim-auto'].value.trim();
    neueAkte.geldstrafe = aktenForm['krim-geldstrafe'].value.trim();
    neueAkte.hafteinheiten = aktenForm['krim-hafteinheiten'].value.trim();
    neueAkte.paragraefe = aktenForm['krim-paragraefe'].value.trim();
    neueAkte.unterschrift = aktenForm['krim-unterschrift'].value.trim();
    neueAkte.datum = aktenForm['krim-datum'].value;
  }

  akten.push(neueAkte);
  renderAkten();
  toggleModal(false);
});

// Akte abbrechen
aktenCancelBtn.addEventListener('click', () => {
  toggleModal(false);
});

aktenNeuBtn.addEventListener('click', () => {
  toggleModal(true);
});

// Akten rendern
function renderAkten() {
  let filterName = aktenFilterName.value.toLowerCase();
  let filterKrim = aktenFilterKrim.value;

  aktenList.innerHTML = '';

  let gefilterteAkten = akten.filter(akte => {
    // Filter nach Name
    if(filterName && !akte.name.toLowerCase().includes(filterName)) return false;

    // Filter nach Kriminalität
    if(filterKrim === 'alle') return true;

    if(filterKrim === 'vermerk' && akte.art === 'vermerk') return true;

    if(['leicht','mittel','schwer'].includes(filterKrim) && akte.art === filterKrim) return true;

    return false;
  });

  if(gefilterteAkten.length === 0) {
    aktenList.innerHTML = '<p style="padding:15px; color:#bbb;">Keine Akten gefunden.</p>';
    return;
  }

  gefilterteAkten.forEach(akte => {
    const div = document.createElement('div');
    div.classList.add('akte-item');
    div.tabIndex = 0;

    if(akte.art === 'vermerk') {
      div.innerHTML = `<strong>${akte.name}</strong><br><em>Bemerkung:</em> ${akte.bemerkung}`;
    } else {
      div.innerHTML = `
        <strong>${akte.name} (${akte.art.charAt(0).toUpperCase() + akte.art.slice(1)} Kriminalität)</strong><br>
        Alter: ${akte.alter} | Geschlecht: ${akte.geschlecht.toUpperCase()} | Haarfarbe: ${akte.haarfarbe}<br>
        Job: ${akte.job} | Wohnort: ${akte.wohnort} | Auto-Kennzeichen: ${akte.auto}<br>
        Geldstrafe: ${akte.geldstrafe}€ | Hafteinheiten: ${akte.hafteinheiten}<br>
        Gesetze: ${akte.paragraefe.replace(/\n/g, '<br>')}<br>
        Unterschrift: ${akte.unterschrift} | Datum: ${akte.datum}
      `;
    }
    aktenList.appendChild(div);
  });
}

// Filter Eingaben
aktenFilterName.addEventListener('input', renderAkten);
aktenFilterKrim.addEventListener('change', renderAkten);
aktenFilterReset.addEventListener('click', () => {
  aktenFilterName.value = '';
  aktenFilterKrim.value = 'alle';
  renderAkten();
});

// Initial Render
renderAkten();
showVermerkFields();
