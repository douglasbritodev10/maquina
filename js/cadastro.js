import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        try {
            // 1. Cria o usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // 2. Cria o documento do usuário no Firestore
            // Isso cria a coleção 'usuarios' automaticamente se não existir
            await setDoc(doc(db, "usuarios", user.uid), {
                nome: nome,
                email: email,
                role: "admin",
                criadoEm: new Date()
            });

            alert("Sucesso! Sua conta foi configurada.");
            window.location.href = "dashboard.html";
            
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                alert("Este e-mail já está cadastrado. Tente fazer login.");
            } else {
                alert("Erro ao criar conta: " + error.message);
            }
        }
    });
}
