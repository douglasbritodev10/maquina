import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBy08g66OxlnG7r_g8H9v6WEs8opcXUFO0",
  authDomain: "maquina-53226.firebaseapp.com",
  projectId: "maquina-53226",
  storageBucket: "maquina-53226.firebasestorage.app",
  messagingSenderId: "1042646407951",
  appId: "1:1042646407951:web:6e2434d551941c63097c7a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
