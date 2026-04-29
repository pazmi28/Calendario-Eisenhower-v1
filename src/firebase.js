// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ← NUEVO

const firebaseConfig = {
  apiKey: "AIzaSyAD9-ed-5BnmE7Fj0x7l-CkDnBHB-ZcjIs",
  authDomain: "app-calendario-eisenhower.firebaseapp.com",
  projectId: "app-calendario-eisenhower",
  storageBucket: "app-calendario-eisenhower.firebasestorage.app",
  messagingSenderId: "521404313789",
  appId: "1:521404313789:web:dac8d1848e2201655087d4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ← NUEVO

export { db, auth }; // ← NUEVO: exportar auth también
