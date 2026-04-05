import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const cadastroForm = document.getElementById('cadastroForm');
const msgErro = document.getElementById('msg-erro');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailOriginal = sessionStorage.getItem('email_pre_cadastro');
        const nome = document.getElementById('nome').value;
        const senha = document.getElementById('senha').value;
        const confirma = document.getElementById('confirmarSenha').value;

        if (!emailOriginal) {
            msgErro.innerText = "Erro: E-mail não identificado. Volte ao login.";
            return;
        }

        if (senha !== confirma) {
            msgErro.innerText = "As senhas não coincidem!";
            return;
        }

        try {
            let user;
            try {
                // Tenta criar o novo usuário
                const userCredential = await createUserWithEmailAndPassword(auth, emailOriginal, senha);
                user = userCredential.user;
            } catch (authError) {
                // Se o e-mail já existir no Auth, mas você caiu nesta tela, 
                // usamos o usuário que já está logado no navegador para tentar gravar no Firestore
                if (authError.code === 'auth/email-already-in-use' && auth.currentUser) {
                    user = auth.currentUser;
                } else {
                    throw authError; // Re-lança se for outro erro
                }
            }

            // Grava os dados no Firestore (isso criará a coleção 'usuarios' automaticamente)
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nome: nome,
                email: emailOriginal,
                setor: "Logística/Assistência",
                nivel: "admin",
                criadoEm: new Date()
            });

            sessionStorage.removeItem('email_pre_cadastro');
            alert("Perfil configurado com sucesso!");
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error(error);
            msgErro.innerText = "Erro: " + error.message;
        }
    });
}
