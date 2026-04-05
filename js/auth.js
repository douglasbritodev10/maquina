import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        } catch (error) {
            // Se o usuário não existir no Auth, vamos criar e salvar no Firestore
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Criando o perfil no Firestore automaticamente
                    await setDoc(doc(db, "usuarios", user.uid), {
                        email: email,
                        nome: email.split('@')[0], // Nome provisório vindo do e-mail
                        nivel: "admin",
                        criadoEm: new Date()
                    });

                    alert("Primeiro acesso! Perfil criado no banco de dados.");
                    window.location.href = "dashboard.html";
                } catch (createError) {
                    errorDiv.innerText = "Erro ao criar: " + createError.message;
                }
            } else {
                errorDiv.innerText = "Erro ao acessar o sistema.";
            }
        }
    });
}
