import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const cadastroForm = document.getElementById('cadastroForm');
const msgErro = document.getElementById('msg-erro');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Pega o e-mail que veio da tela de login
        const emailOriginal = sessionStorage.getItem('email_pre_cadastro');
        
        const nome = document.getElementById('nome').value;
        const senha = document.getElementById('senha').value;
        const confirma = document.getElementById('confirmarSenha').value;

        // 1. Validação básica de segurança
        if (!emailOriginal) {
            msgErro.innerText = "Erro: E-mail não identificado. Volte ao login.";
            return;
        }

        if (senha !== confirma) {
            msgErro.innerText = "As senhas não coincidem!";
            return;
        }

        if (senha.length < 6) {
            msgErro.innerText = "A senha deve ter no mínimo 6 caracteres.";
            return;
        }

        try {
            // 2. Cria o usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, emailOriginal, senha);
            const user = userCredential.user;

            // 3. Cria o documento na coleção 'usuarios' no Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nome: nome,
                email: emailOriginal,
                setor: "Logística/Assistência",
                nivel: "admin",
                criadoEm: new Date()
            });

            // Limpa o e-mail temporário
            sessionStorage.removeItem('email_pre_cadastro');

            alert("Perfil criado com sucesso! Bem-vindo, " + nome);
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error(error);
            msgErro.innerText = "Erro ao cadastrar: " + error.message;
        }
    });
}
