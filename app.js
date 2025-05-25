// Navigation Sidebar -> Content Switching
const sidebarItems = document.querySelectorAll('.sidebar-item');
const contentSections = document.querySelectorAll('.content-section');

sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    sidebarItems.forEach(i => i.classList.remove('active'));
    contentSections.forEach(s => s.classList.remove('active'));

    item.classList.add('active');

    const targetSection = document.getElementById(item.dataset.section);
    if(targetSection) {
      targetSection.classList.add('active');
    }

    // Falls Straftaten-Sektion wird aktiv:
    if(item.dataset.section === 'straftaten') {
      loadStraftaten();
    }
  });
});



// --- Straftaten-Module ---

const modal = document.getElementById('modal');
const btnAddStraftat = document.getElementById('add-straftat-btn');
const modalCancelBtn = document.getElementById('modal-cancel');
const straftatForm = document.getElementById('straftat-form');
const straftatenList = document.getElementById('straftaten-list');
const filterArt = document.getElementById('filter-art');

let straftatenData = [];

btnAddStraftat.addEventListener('click', () => {
  openModal();
});

modalCancelBtn.addEventListener('click', () => {
  closeModal();
});

function openModal() {
  modal.classList.remove('hidden');
  straftatForm.reset();
}

function closeModal() {
  modal.classList.add('hidden');
}

straftatForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const art = document.getElementById('art').value;
  const beschreibung = document.getElementById('beschreibung').value.trim();

  if(!name || !art || !beschreibung) return;

  const neueStraftat = { id: Date.now(), name, art, beschreibung };
  straftatenData.push(neueStraftat);

  closeModal();
  renderStraftaten();
});

function renderStraftaten() {
  let filterValue = filterArt.value;

  let filtered = straftatenData;
  if(filterValue) {
    filtered = straftatenData.filter(st => st.art === filterValue);
  }

  straftatenList.innerHTML = '';

  if(filtered.length === 0) {
    straftatenList.innerHTML = `<li>Keine Straftaten gefunden.</li>`;
    return;
  }

  filtered.forEach(st => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${st.name}</strong> — <em>${st.art} Kriminalität</em>
      <p>${st.beschreibung}</p>
    `;
    straftatenList.appendChild(li);
  });
}

filterArt.addEventListener('change', () => {
  renderStraftaten();
});

function loadStraftaten() {
  renderStraftaten();
}
