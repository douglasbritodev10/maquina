// js/dashboard.js
import { db, auth } from "./firebase-config.js";
import { doc, getDoc, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const gridMaquinas = document.getElementById('grid-maquinas');
const userNameDisplay = document.getElementById('userName');
const btnSair = document.getElementById('btnLogout');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Busca o nome real no Firestore
        const userSnap = await getDoc(doc(db, "usuarios", user.uid));
        if (userSnap.exists()) {
            userNameDisplay.innerText = "Operador: " + userSnap.data().nome.toUpperCase();
        }
        iniciarMonitoramento();
    } else {
        window.location.href = "index.html";
    }
});

// Correção do Botão Sair
if (btnSair) {
    btnSair.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });
}

function iniciarMonitoramento() {
    const q = query(collection(db, "transpaleteiras"));
    onSnapshot(q, (snapshot) => {
        gridMaquinas.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = `<div class="glass-card"><h3>${doc.id}</h3><p>${data.bateria}%</p></div>`; // Simplificado para teste
            gridMaquinas.innerHTML += card;
        });
    });
}
