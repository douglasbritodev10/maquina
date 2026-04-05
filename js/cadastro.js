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

            // LÓGICA DE CONTROLE:
            // Se o usuário já estiver logado no Firebase (auth.currentUser), 
            // não tentamos criar a conta de novo para evitar o erro de "email-already-in-use".
            if (auth.currentUser && auth.currentUser.email === emailOriginal) {
                user = auth.currentUser;
            } else {
                try {
                    // Se não estiver logado, tenta criar a conta normalmente
                    const userCredential = await createUserWithEmailAndPassword(auth, emailOriginal, senha);
                    user = userCredential.user;
                } catch (authError) {
                    // Se der erro de "email em uso", mas o usuário não estiver logado no navegador,
                    // significa que a conta foi criada mas a sessão expirou ou deu erro antes.
                    if (authError.code === 'auth/email-already-in-use') {
                        msgErro.innerText = "Este e-mail já possui conta. Tente fazer login normalmente.";
                        return;
                    }
                    throw authError;
                }
            }

            // Agora gravamos (ou sobrescrevemos) os dados no Firestore
            // Isso garante que o documento na coleção 'usuarios' seja criado.
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nome: nome,
                email: emailOriginal,
                setor: "Logística/Assistência",
                nivel: "admin",
                criadoEm: new Date()
            });

            sessionStorage.removeItem('email_pre_cadastro');
            alert("Perfil configurado com sucesso! Bem-vindo, " + nome);
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error(error);
            msgErro.innerText = "Erro ao finalizar cadastro: " + error.message;
        }
    });
}
