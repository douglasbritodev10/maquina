import { db, auth } from "./firebase-config.js";
import { doc, getDoc, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const gridMaquinas = document.getElementById('grid-maquinas');
const userNameDisplay = document.getElementById('userName');
const btnSair = document.getElementById('btnLogout');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // 1. Busca o documento do usuário na coleção 'usuarios' pelo UID
            const userDocRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                // 2. Se o documento existir, pega o campo 'nome' que salvamos no cadastro
                const dadosUsuario = userSnap.data();
                userNameDisplay.innerText = "Operador: " + dadosUsuario.nome.toUpperCase();
            } else {
                // Caso o documento não exista por algum motivo, usa o e-mail como backup
                userNameDisplay.innerText = "Operador: " + user.email.split('@')[0].toUpperCase();
            }
        } catch (error) {
            console.error("Erro ao buscar nome do usuário:", error);
            userNameDisplay.innerText = "Operador: " + user.email.split('@')[0].toUpperCase();
        }

        // 3. Inicia o monitoramento das 12 máquinas
        iniciarMonitoramento();
        
    } else {
        // Se não estiver logado, volta pro login
        window.location.href = "index.html";
    }
});

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
