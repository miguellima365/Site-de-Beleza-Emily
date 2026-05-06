// 1. IMPORTAÇÕES DO FIREBASE (Agora com query, where e getDocs para a trava de horário)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// 3. INICIALIZA O BANCO DE DADOS
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. O SEU CÓDIGO DO SITE
document.addEventListener("DOMContentLoaded", function () {

    // Modais
    const modalServicos = document.getElementById("modalServicos");
    const modalForm = document.getElementById("modalFormulario");
    const modalHorarios = document.getElementById("modalHorarios");

    // Botões de abrir
    document.getElementById("btnServicos").onclick = () => { modalServicos.style.display = "block"; document.body.style.overflow = "hidden"; }
    document.getElementById("btnAbrirForm").onclick = () => { modalForm.style.display = "block"; document.body.style.overflow = "hidden"; }
    document.getElementById("btnHorarios").onclick = () => { modalHorarios.style.display = "block"; document.body.style.overflow = "hidden"; }
    document.getElementById("btnVerHorariosForm").onclick = () => { modalHorarios.style.display = "block"; }

    // Botões de fechar (Os "X")
    document.getElementById("closeServicos").onclick = () => { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
    document.getElementById("closeForm").onclick = () => { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
    document.getElementById("closeHorarios").onclick = () => { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; }

    // Fechar ao clicar na tela escura fora do pop-up
    window.onclick = (event) => {
        if (event.target == modalServicos) { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == modalForm) { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == modalHorarios) { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; }
    }

    // ==========================================
    // VALIDAÇÃO DE DATA E HORA DE FUNCIONAMENTO
    // ==========================================
    const inputData = document.getElementById("dataAgendamento");
    const inputHora = document.getElementById("horaAgendamento");

    const hoje = new Date().toISOString().split('T')[0];
    inputData.setAttribute("min", hoje);

    inputData.addEventListener("change", function () {
        const dataEscolhida = new Date(this.value + 'T12:00:00');
        const diaSemana = dataEscolhida.getDay(); 

        if (diaSemana === 0 || diaSemana === 1) {
            alert("⚠️ Não funcionamos aos domingos e segundas-feiras. Por favor, escolha outra data.");
            this.value = ""; 
            inputHora.value = ""; 
        }
    });

    inputHora.addEventListener("change", function () {
        if (!inputData.value) {
            alert("Por favor, escolha a data primeiro!");
            this.value = ""; return;
        }

        const dataEscolhida = new Date(inputData.value + 'T12:00:00');
        const diaSemana = dataEscolhida.getDay();
        const horaEscolhida = this.value; 

        let horaValida = false;

        if (diaSemana >= 2 && diaSemana <= 5) {
            if (horaEscolhida >= "14:00" && horaEscolhida <= "18:00") horaValida = true;
        } else if (diaSemana === 6) {
            if (horaEscolhida >= "09:00" && horaEscolhida <= "18:00") horaValida = true;
        }

        if (!horaValida) {
            alert(diaSemana === 6 ? "⚠️ Aos sábados, nosso horário é das 09:00 às 18:00." : "⚠️ De terça a sexta, nosso horário é das 14:00 às 18:00.");
            this.value = ""; 
        }
    });

    // ==========================================
    // LÓGICA DO SELECT PERSONALIZADO (Múltiplos Serviços)
    // ==========================================
    const selectPersonalizado = document.getElementById("selectPersonalizado");
    const listaServicos = document.getElementById("listaServicos");
    const textoSelect = document.getElementById("textoSelect");
    const checkboxesServico = document.querySelectorAll('input[name="servico"]');

    // Abre e fecha a caixinha
    selectPersonalizado.addEventListener("click", () => {
        listaServicos.style.display = listaServicos.style.display === "none" ? "block" : "none";
    });

    // Atualiza o texto dependendo de quantos serviços ela marcou
    checkboxesServico.forEach(cb => {
        cb.addEventListener("change", () => {
            const selecionados = Array.from(checkboxesServico).filter(i => i.checked).map(i => i.value);
            if (selecionados.length === 0) {
                textoSelect.innerText = "Serviço de interesse"; textoSelect.style.color = "#757575";
            } else if (selecionados.length === 1) {
                textoSelect.innerText = selecionados[0]; textoSelect.style.color = "#000";
            } else {
                textoSelect.innerText = selecionados.length + " serviços selecionados"; textoSelect.style.color = "#000";
            }
        });
    });

    // Fecha a lista se clicar fora
    document.addEventListener("click", (e) => {
        if (!selectPersonalizado.contains(e.target) && !listaServicos.contains(e.target)) {
            listaServicos.style.display = "none";
        }
    });

    // ==========================================
    // SALVAR NO FIREBASE
    // ==========================================
    const form = document.getElementById("formAgendamento");

    form.onsubmit = async function (e) {
        e.preventDefault();

        // 1. Pega os valores
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value; // Pegando o WhatsApp!
        const data = document.getElementById("dataAgendamento").value;
        const hora = document.getElementById("horaAgendamento").value;
        const msg = document.getElementById("mensagem").value;

        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerText;
        btnSubmit.innerText = "Enviando...";

        // 2. Coleta os serviços marcados
        const servicosSelecionados = Array.from(document.querySelectorAll('input[name="servico"]:checked')).map(cb => cb.value);

        if (servicosSelecionados.length === 0) {
            alert("Por favor, selecione pelo menos um serviço.");
            btnSubmit.innerText = textoOriginal; 
            return;
        }

        const servicosTexto = servicosSelecionados.join(", "); // Junta tudo: "Manicure, Pedicure"

        try {
            // 3. LÓGICA ANTI-REPETIÇÃO DE HORÁRIO
            const qDuplicado = query(
                collection(db, "agendamentos"), 
                where("data", "==", data), 
                where("hora", "==", hora)
            );
            const querySnapshotDuplicado = await getDocs(qDuplicado);

            if (!querySnapshotDuplicado.empty) {
                alert("⚠️ Este horário já foi reservado por outra pessoa. Por favor, escolha outro horário ou data.");
                btnSubmit.innerText = textoOriginal; 
                return; 
            }

            // 4. SALVA NO FIREBASE
            const dataAgendada = new Date(data + 'T' + hora);
            const dataExpiracao = new Date(dataAgendada.getTime() + (1 * 60 * 60 * 1000)); // Expira em 1 hora

            await addDoc(collection(db, "agendamentos"), {
                nome: nome,
                telefone: telefone, 
                servico: servicosTexto, 
                data: data,
                hora: hora,
                mensagem: msg,
                dataCriacao: new Date(), // Usado para piscar o botão de NOVO
                expiraEm: dataExpiracao
            });

            // 5. FINALIZA
            alert(`Tudo certo, ${nome}! Seu pedido de agendamento foi enviado com sucesso para a Emilly.`);

            form.reset();
            textoSelect.innerText = "Serviço de interesse"; // Reseta a caixinha de serviços
            textoSelect.style.color = "#757575";
            modalForm.style.display = "none";
            document.body.style.overflow = "auto";

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Houve um erro ao registrar seu agendamento. Por favor, tente novamente.");
        } finally {
            btnSubmit.innerText = textoOriginal;
        }
    };
});