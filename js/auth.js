import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error-message');

// Observador: Se o usuário já estiver autenticado, redireciona para o Painel
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário já logado:", user.email);
        window.location.href = "dashboard.html";
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        errorDiv.innerText = "";
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Tenta realizar o login
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login realizado com sucesso!");
            window.location.href = "dashboard.html";
            
        } catch (error) {
            console.error("Erro de Autenticação:", error.code);
            
            // Lógica amigável para o usuário
            switch (error.code) {
                case 'auth/user-not-found':
                    errorDiv.innerText = "E-mail não encontrado. Clique em 'Cadastre sua senha'.";
                    break;
                case 'auth/wrong-password':
                    errorDiv.innerText = "Senha incorreta. Tente novamente.";
                    break;
                case 'auth/invalid-credential':
                    errorDiv.innerText = "Credenciais inválidas. Verifique os dados.";
                    break;
                case 'auth/too-many-requests':
                    errorDiv.innerText = "Muitas tentativas. Tente novamente mais tarde.";
                    break;
                default:
                    errorDiv.innerText = "Erro ao acessar. Verifique sua conexão.";
            }
        }
    });
}
