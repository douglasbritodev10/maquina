import { db, auth } from "./firebase-config.js";
import { 
    doc, 
    getDoc, 
    collection, 
    onSnapshot, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const gridMaquinas = document.getElementById('grid-maquinas');
const userNameDisplay = document.getElementById('userName');
const btnSair = document.getElementById('btnLogout');

// 1. Verificação de Autenticação e Perfil
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userSnap = await getDoc(doc(db, "usuarios", user.uid));
            if (userSnap.exists()) {
                const dados = userSnap.data();
                userNameDisplay.innerText = `Operador: ${dados.nome.toUpperCase()}`;
            } else {
                userNameDisplay.innerText = `Operador: ${user.email.split('@')[0].toUpperCase()}`;
            }
            iniciarMonitoramento();
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            userNameDisplay.innerText = "Erro ao carregar nome";
        }
    } else {
        window.location.href = "index.html";
    }
});

// 2. Lógica de Logoff
if (btnSair) {
    btnSair.addEventListener('click', async () => {
        if(confirm("Deseja realmente sair do sistema?")) {
            try {
                await signOut(auth);
                window.location.href = "index.html";
            } catch (error) {
                alert("Erro ao encerrar sessão.");
            }
        }
    });
}

// 3. Monitoramento em Tempo Real Otimizado
function iniciarMonitoramento() {
    // Ordenamos por ID para as máquinas não pularem de lugar na tela
    const q = query(collection(db, "transpaleteiras"), orderBy("__name__"));
    
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            gridMaquinas.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma máquina detectada no sistema.</p>';
            return;
        }

        let novoConteudo = '';
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            const bateria = data.bateria || 0;
            const status = data.status || 'Indisponível';
            
            // Lógica de cores para a bateria
            let corBateria = '#2ecc71'; // Verde
            if (bateria <= 20) corBateria = '#e74c3c'; // Vermelho
            else if (bateria <= 50) corBateria = '#f1c40f'; // Amarelo

            novoConteudo += `
                <div class="glass-card machine-card">
                    <div class="card-header">
                        <span class="machine-id">${id}</span>
                        <span class="status-badge ${status.toLowerCase() === 'ativo' ? 'online' : 'offline'}"></span>
                    </div>
                    <div class="battery-section">
                        <div class="battery-level" style="width: ${bateria}%; background: ${corBateria}"></div>
                        <span class="battery-text">${bateria}%</span>
                    </div>
                    <div class="card-footer">
                        <small>Última atualização: ${formatarData(data.ultimaAtualizacao)}</small>
                    </div>
                </div>
            `;
        });

        // Atualiza o DOM de uma vez só para evitar "flicker" (piscar)
        gridMaquinas.innerHTML = novoConteudo;
    });
}

// Função auxiliar para formatar a hora da última atualização
function formatarData(timestamp) {
    if (!timestamp) return "--:--";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
