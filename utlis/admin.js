import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const auth = getAuth(app); 

// Elementos da Tela
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const formLogin = document.getElementById("formLogin");
const msgErro = document.getElementById("msgErro");
const btnSair = document.getElementById("btnSair");
const toggleSenha = document.getElementById("toggleSenha");
const inputSenha = document.getElementById("senhaLogin");

// Mostrar/Ocultar senha
toggleSenha.addEventListener("click", function () {
    const tipo = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", tipo);
    this.style.opacity = tipo === "text" ? "1" : "0.5";
});

// 1. Verifica se alguém já está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        carregarAgendamentos(); 
    } else {
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
            msgErro.style.display = "none"; 
            formLogin.reset();
        })
        .catch((error) => {
            msgErro.style.display = "block"; 
            console.error("Erro no login:", error);
        });
};

// 3. Fazer Logout (Sair)
btnSair.onclick = () => {
    signOut(auth).then(() => {
        // O onAuthStateChanged detecta sozinho que deslogou
    });
};

// 4. Função de buscar os dados (Limpa, segura e com 5 colunas)
async function carregarAgendamentos() {
    const tbody = document.getElementById("listaAgendamentos");
    const agora = new Date();

    try {
        const q = query(
            collection(db, "agendamentos"),
            where("expiraEm", ">=", agora),  // O FILTRO DE 1 HORA AQUI
            orderBy("expiraEm", "asc")       // Ordena cronologicamente
        );
        const querySnapshot = await getDocs(q);
        
        tbody.innerHTML = ""; 

        // Alterado para colspan 5
        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='5' style='text-align: center;'>Nenhum agendamento encontrado.</td></tr>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const agendamento = docSnap.data();
            const dataFormatada = agendamento.data.split('-').reverse().join('/');
            
            // Lógica do Selo "Novo" (Exibe se foi criado há menos de 30 minutos)
            const dataCriacao = agendamento.dataCriacao?.toDate(); 
            const diffMinutos = dataCriacao ? (agora - dataCriacao) / (1000 * 60) : 100;
            const seloNovo = diffMinutos < 30 ? '<span class="badge-novo">NOVO</span>' : '';

            // Lógica segura do WhatsApp
            let linkZap = "Não informado"; 
            if (agendamento.telefone) {
                const numeroLimpo = agendamento.telefone.replace(/\D/g, ''); 
                linkZap = `<a href="https://wa.me/55${numeroLimpo}" target="_blank" style="color: #25D366; font-weight: bold; text-decoration: none;">${agendamento.telefone}</a>`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Data"><strong>${dataFormatada}</strong> ${seloNovo}</td>
                <td data-label="Hora"><strong>${agendamento.hora}</strong></td>
                <td data-label="Cliente">${agendamento.nome}</td>
                <td data-label="WhatsApp">${linkZap}</td>
                <td data-label="Serviço">${agendamento.servico}</td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        tbody.innerHTML = "<tr><td colspan='5' style='text-align: center; color: red;'>Erro ao carregar sistema. Verifique a conexão.</td></tr>";
    }
}