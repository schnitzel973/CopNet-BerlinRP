
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Registrierung mit Dienstnummer
export async function register(email, password, dienstnummer, name, rolle) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    email, dienstnummer, name, rolle
  });
  return user;
}

// Login mit Dienstnummerprüfung
export async function login(email, password, dienstnummer) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("Benutzerdaten nicht gefunden.");
  if (userDoc.data().dienstnummer !== dienstnummer) {
    await signOut(auth);
    throw new Error("Dienstnummer stimmt nicht überein.");
  }
  return user;
}

export async function logout() {
  await signOut(auth);
}
