// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
