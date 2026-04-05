import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error-message');

onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
});

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            errorDiv.innerText = "E-mail ou senha incorretos.";
            console.error(error);
        }
    });
}
