// Firebase Config & Init
const firebaseConfig = {
  apiKey: "AIzaSyAE4nCkJkdR8P9EKyEILHF8CN4pbRUTrHM",
  authDomain: "copnet-berlinrp.firebaseapp.com",
  projectId: "copnet-berlinrp",
  storageBucket: "copnet-berlinrp.firebasestorage.app",
  messagingSenderId: "325379817013",
  appId: "1:325379817013:web:0367b33ce7373f1185bb7c",
  measurementId: "G-N7Z1C6XNJ0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
