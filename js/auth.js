import { auth } from "./firebase-config.js";
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
            // Tenta logar
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";

        } catch (error) {
            // LÓGICA DE PRIMEIRO ACESSO:
            // Se o e-mail não existir no Firebase Auth
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                
                // Salvamos o e-mail temporariamente para o cadastro não precisar pedir de novo
                sessionStorage.setItem('email_pre_cadastro', email);
                
                alert("Primeiro acesso detectado! Vamos configurar seu perfil.");
                window.location.href = "cadastro.html";
            } else {
                errorDiv.innerText = "Senha incorreta ou erro de conexão.";
            }
        }
    });
}
