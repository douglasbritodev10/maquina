import { db, auth } from "./firebase-config.js";
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const gridMaquinas = document.getElementById('grid-maquinas');
const userNameDisplay = document.getElementById('userName');
const btnSair = document.getElementById('btnLogout');

onAuthStateChanged(auth, (user) => {
    if (user) {
        userNameDisplay.innerText = "Operador: " + user.email.split('@')[0].toUpperCase();
        iniciarMonitoramento();
    } else {
        window.location.href = "index.html";
    }
});

if (btnSair) {
    btnSair.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = "index.html"; });
    });
}

function iniciarMonitoramento() {
    const q = query(collection(db, "transpaleteiras"));

    onSnapshot(q, (snapshot) => {
        gridMaquinas.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            let statusCor = data.bateria < 20 ? "#ff4d4d" : "#4ade80";

            const card = `
                <div class="glass-card">
                    <div style="display:flex; justify-content: space-between;">
                        <span style="font-size: 0.8rem; opacity: 0.7;">${doc.id}</span>
                        <span style="height: 10px; width: 10px; background:${statusCor}; border-radius:50%;"></span>
                    </div>
                    <h2 style="margin: 10px 0; font-size: 2.5rem;">${data.bateria}%</h2>
                    <p>🌡️ ${data.temp}°C</p>
                    <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 15px;">Carga: ${data.status || 'Em operação'}</p>
                </div>`;
            gridMaquinas.innerHTML += card;
        });

        if (snapshot.empty) {
            gridMaquinas.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Nenhuma transpaleteira conectada...</p>`;
        }
    });
}
