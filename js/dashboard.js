import { db, auth } from "./firebase-config.js";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const gridMaquinas = document.getElementById('grid-maquinas');
const userNameDisplay = document.getElementById('userName');
const btnSair = document.getElementById('btnLogout');

// Proteção da Rota: Só entra se estiver logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Pega o nome antes do @ do e-mail para exibir
        userNameDisplay.innerText = "Operador: " + user.email.split('@')[0].toUpperCase();
        iniciarMonitoramento();
    } else {
        window.location.href = "index.html";
    }
});

// Função de Logoff
if (btnSair) {
    btnSair.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = "index.html"; });
    });
}

// Escuta o Firestore em tempo real
function iniciarMonitoramento() {
    // Busca na coleção 'transpaleteiras'
    const q = query(collection(db, "transpaleteiras"));

    onSnapshot(q, (snapshot) => {
        gridMaquinas.innerHTML = ''; // Limpa para atualizar sem duplicar

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Lógica de cores para o diagnóstico rápido
            let statusCor = "#4ade80"; // Verde (OK)
            if (data.bateria < 20) statusCor = "#ff4d4d"; // Vermelho (Crítico)
            else if (data.temp > 55) statusCor = "#fbbf24"; // Amarelo (Quente)

            // Gerar o card com estilo Glassmorphism
            const card = `
                <div class="glass-card">
                    <div style="display:flex; justify-content: space-between;">
                        <span style="font-size: 0.8rem; opacity: 0.7;">${doc.id}</span>
                        <span style="height: 10px; width: 10px; background:${statusCor}; border-radius:50%;"></span>
                    </div>
                    <h2 style="margin: 10px 0; font-size: 2.5rem;">${data.bateria}%</h2>
                    <p style="margin: 5px 0;">🌡️ ${data.temp}°C</p>
                    <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 15px;">
                        Carga: ${data.status || 'Em operação'}
                    </p>
                </div>
            `;
            gridMaquinas.innerHTML += card;
        });

        // Se não houver máquinas cadastradas ainda
        if (snapshot.empty) {
            gridMaquinas.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Nenhuma transpaleteira conectada via ESP32...</p>`;
        }
    });
}
