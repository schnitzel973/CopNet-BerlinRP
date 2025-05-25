
// Firebase config + Init
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE4nCkJkdR8P9EKyEILHF8CN4pbRUTrHM",
  authDomain: "copnet-berlinrp.firebaseapp.com",
  projectId: "copnet-berlinrp",
  storageBucket: "copnet-berlinrp.firebasestorage.app",
  messagingSenderId: "325379817013",
  appId: "1:325379817013:web:0367b33ce7373f1185bb7c",
  measurementId: "G-N7Z1C6XNJ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
