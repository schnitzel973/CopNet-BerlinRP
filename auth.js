// auth.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Login-Formular einbinden
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dienstnummer = document.getElementById("dienstnummer").value;
    const errorMsg = document.getElementById("loginError");

    try {
      // Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Dienstnummer prüfen
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData && userData.dienstnummer === dienstnummer) {
        // Weiterleitung zum Dashboard
        window.location.href = "dashboard.html";
      } else {
        // Dienstnummer falsch → Logout
        await signOut(auth);
        errorMsg.textContent = "❌ Dienstnummer stimmt nicht mit dem Account überein.";
      }
    } catch (error) {
      errorMsg.textContent = "❌ Login fehlgeschlagen: " + error.message;
    }
  });
}
