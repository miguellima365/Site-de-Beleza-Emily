// Importando Firestore E Authentication (Apenas UMA vez cada!)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// COLOQUE AS SUAS CREDENCIAIS DO FIREBASE AQUI
const firebaseConfig = {
  apiKey: "AIzaSyBqEDLoz20b9nxUPb0S18OFmM3VlAP5DQY",
  authDomain: "glowbyalmeida.firebaseapp.com",
  projectId: "glowbyalmeida",
  storageBucket: "glowbyalmeida.firebasestorage.app",
  messagingSenderId: "626875239816",
  appId: "1:626875239816:web:6c454b270dc83dbb177e3d",
  measurementId: "G-5JLV5P1KXJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa a Autenticação

// Elementos da Tela
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const formLogin = document.getElementById("formLogin");
const msgErro = document.getElementById("msgErro");
const btnSair = document.getElementById("btnSair");
// Função do Olhinho da Senha
const toggleSenha = document.getElementById("toggleSenha");
const inputSenha = document.getElementById("senhaLogin");

//Ver senha
toggleSenha.addEventListener("click", function () {
    // Verifica se o campo está como password (escondido) ou text (visível)
    const tipo = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", tipo);
    
    // Opcional: Muda a opacidade do olho para indicar que está ativado
    this.style.opacity = tipo === "text" ? "1" : "0.5";
});

// 1. Verifica se alguém já está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Logado! Esconde o login e mostra o painel
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        carregarAgendamentos(); // Só carrega os dados se estiver logado
    } else {
        // Não logado! Mostra o login e esconde o painel
        loginSection.style.display = "flex";
        dashboardSection.style.display = "none";
    }
});

// 2. Fazer Login
formLogin.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            msgErro.style.display = "none"; // Deu certo, apaga mensagem de erro
            formLogin.reset();
        })
        .catch((error) => {
            msgErro.style.display = "block"; // Deu erro, avisa o usuário
            console.error("Erro no login:", error);
        });
};

// 3. Fazer Logout (Sair)
btnSair.onclick = () => {
    signOut(auth).then(() => {
        // Ele vai avisar o onAuthStateChanged lá em cima que deslogou
    });
};

// 4. Função de buscar os dados (Igual ao que já tínhamos)
async function carregarAgendamentos() {
    const tbody = document.getElementById("listaAgendamentos");

    // Pega a data e hora exata de "agora"
        const agora = new Date();

    try {
        // Busca apenas agendamentos que expiram DEPOIS de agora, e já ordena por eles
        const q = query(
            collection(db, "agendamentos"), 
            where("expiraEm", ">=", agora),  // O FILTRO DE 1 HORA AQUI
            orderBy("expiraEm", "asc")       // Ordena cronologicamente
        );
        const querySnapshot = await getDocs(q);
        tbody.innerHTML = ""; 

        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Nenhum agendamento encontrado.</td></tr>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const agendamento = docSnap.data();
            const id = docSnap.id; 
            const dataFormatada = agendamento.data.split('-').reverse().join('/');
            const statusClass = agendamento.status === "Concluído" ? "status-concluido" : "status-pendente";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Data"><strong>${dataFormatada}</strong></td>
                <td data-label="Hora"><strong>${agendamento.hora}</strong></td>
                <td data-label="Cliente">${agendamento.nome}</td>
                <td data-label="Serviço">${agendamento.servico}</td>
                <td data-label="Observação">${agendamento.mensagem || '-'}</td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        tbody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Erro ao carregar sistema. Verifique a conexão.</td></tr>";
    }
}