import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "firebase/auth";

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error-message');

// Se já estiver logado, vai direto para o dashboard
onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
});

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Tenta fazer o login comum
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            // Lógica de "Primeiro Acesso": Se o usuário não existe, cria a conta
            if (error.code === 'auth/user-not-found') {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    alert("Primeiro acesso detectado! Conta criada com sucesso.");
                    window.location.href = "dashboard.html";
                } catch (createError) {
                    errorDiv.innerText = "Erro ao criar conta: " + createError.message;
                }
            } else {
                errorDiv.innerText = "Senha incorreta ou erro de conexão.";
            }
        }
    });
}
