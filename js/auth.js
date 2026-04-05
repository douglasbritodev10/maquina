import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error-message');

// Lógica inteligente de redirecionamento
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
            window.location.href = "dashboard.html";
        } else {
            // Se logou mas não tem documento no Firestore, é primeiro acesso
            sessionStorage.setItem('email_pre_cadastro', user.email);
            window.location.href = "cadastro.html";
        }
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            // Se o usuário não existe no Auth, salva o email e manda para o cadastro
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                sessionStorage.setItem('email_pre_cadastro', email);
                window.location.href = "cadastro.html";
            } else {
                errorDiv.innerText = "Senha incorreta ou erro de conexão.";
            }
        }
    });
}
