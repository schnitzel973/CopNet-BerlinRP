document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".sidebar nav ul li");
  const pages = document.querySelectorAll(".page");
  const aktenForm = document.getElementById("aktenForm");
  const aktenKategorie = document.getElementById("aktenKategorie");
  const aktenDetails = document.getElementById("aktenDetails");
  const aktenList = document.getElementById("aktenList");
  const aktenCount = document.getElementById("aktenCount");
  const fahndungCount = document.getElementById("fahndungCount");

  let akten = [];
  let fahndungen = [];

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      pages.forEach(page => page.classList.remove("active"));
      document.getElementById(link.dataset.page).classList.add("active");
    });
  });

  function updateAktenForm(kategorie) {
    if (kategorie === "vermerk") {
      aktenDetails.innerHTML = `
        <label>
          Name:<br />
          <input type="text" name="name" required />
        </label>
        <label>
          Bemerkung:<br />
          <textarea name="bemerkung" required></textarea>
        </label>
      `;
    } else {
      aktenDetails.innerHTML = `
        <label>Name:<br /><input type="text" name="name" required /></label>
        <label>Alter:<br /><input type="number" name="alter" /></label>
        <label>Geschlecht:<br /><input type="text" name="geschlecht" /></label>
        <label>Haarfarbe:<br /><input type="text" name="haarfarbe" /></label>
        <label>Job:<br /><input type="text" name="job" /></label>
        <label>Wohnort:<br /><input type="text" name="wohnort" /></label>
        <label>Auto-Kennzeichen:<br /><input type="text" name="kennzeichen" /></label>
        <label>Geldstrafe:<br /><input type="text" name="geldstrafe" /></label>
        <label>Hafteinheiten:<br /><input type="text" name="haft" /></label>
        <label>Gesetze gegen die verstoßen wurden:<br /><textarea name="gesetze" required></textarea></label>
        <label>Unterschrift:<br /><input type="text" name="unterschrift" /></label>
        <label>Datum:<br /><input type="date" name="datum" /></label>
      `;
    }
  }

  aktenKategorie.addEventListener("change", (e) => {
    updateAktenForm(e.target.value);
  });

  aktenForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(aktenForm);
    const eintrag = {};
    for (let [key, value] of formData.entries()) {
      eintrag[key] = value;
    }
    eintrag.kategorie = aktenKategorie.value;
    akten.push(eintrag);
    updateAktenList();
    aktenForm.reset();
    updateAktenForm(aktenKategorie.value);
  });

  function updateAktenList() {
    aktenList.innerHTML = "";
    akten.forEach((eintrag, index) => {
      const div = document.createElement("div");
      div.classList.add("akten-eintrag");
      div.innerHTML = `<strong>${eintrag.name}</strong> (${eintrag.kategorie})<br />
        ${eintrag.bemerkung || eintrag.gesetze || "-"}`;
      aktenList.appendChild(div);
    });
    aktenCount.textContent = akten.length;
  }

  // Optional Dummy-Fahndungen (für Statistik)
  fahndungen = [
    { name: "Unbekannt", delikt: "Bankraub" },
    { name: "Max Muster", delikt: "Fahrerflucht" }
  ];

  fahndungCount.textContent = fahndungen.length;

  // Initiale Form laden
  updateAktenForm(aktenKategorie.value);
});
