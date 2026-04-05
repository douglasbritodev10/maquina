// js/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBy08g66OxlnG7r_g8H9v6WEs8opcXUFO0",
  authDomain: "maquina-53226.firebaseapp.com",
  projectId: "maquina-53226",
  storageBucket: "maquina-53226.firebasestorage.app",
  messagingSenderId: "1042646407951",
  appId: "1:1042646407951:web:6e2434d551941c63097c7a"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias para usar nos outros arquivos
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
