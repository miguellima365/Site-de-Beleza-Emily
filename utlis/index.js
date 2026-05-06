<<<<<<< HEAD
// 1. IMPORTAÇÕES DO FIREBASE (Tem que ficar no topo do arquivo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// 4. O SEU CÓDIGO DO SITE (Modais e Formulário)
document.addEventListener("DOMContentLoaded", function () {

    // Modais
    const modalServicos = document.getElementById("modalServicos");
    const modalForm = document.getElementById("modalFormulario");
    const modalHorarios = document.getElementById("modalHorarios");
=======
document.addEventListener("DOMContentLoaded", function() {
    
    // Modais
    const modalServicos = document.getElementById("modalServicos");
    const modalForm = document.getElementById("modalFormulario");
    const modalHorarios = document.getElementById("modalHorarios"); // NOVO
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80

    // Botões de abrir
    const btnServicos = document.getElementById("btnServicos");
    const btnAbrirForm = document.getElementById("btnAbrirForm");
<<<<<<< HEAD
    const btnHorarios = document.getElementById("btnHorarios"); 
    const btnVerHorariosForm = document.getElementById("btnVerHorariosForm"); 
=======
    const btnHorarios = document.getElementById("btnHorarios"); // NOVO
    const btnVerHorariosForm = document.getElementById("btnVerHorariosForm"); // Botão dentro do formulário
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80

    // Botões de fechar (Os "X")
    const closeServicos = document.getElementById("closeServicos");
    const closeForm = document.getElementById("closeForm");
<<<<<<< HEAD
    const closeHorarios = document.getElementById("closeHorarios"); 
=======
    const closeHorarios = document.getElementById("closeHorarios"); // NOVO
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80

    // Funções para Abrir
    btnServicos.onclick = () => { modalServicos.style.display = "block"; document.body.style.overflow = "hidden"; }
    btnAbrirForm.onclick = () => { modalForm.style.display = "block"; document.body.style.overflow = "hidden"; }
<<<<<<< HEAD
    btnHorarios.onclick = () => { modalHorarios.style.display = "block"; document.body.style.overflow = "hidden"; } 
=======
    btnHorarios.onclick = () => { modalHorarios.style.display = "block"; document.body.style.overflow = "hidden"; } // NOVO
    // Abre os horários a partir do botão dentro do formulário
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80
    btnVerHorariosForm.onclick = () => { modalHorarios.style.display = "block"; }

    // Funções para Fechar
    closeServicos.onclick = () => { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
    closeForm.onclick = () => { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
<<<<<<< HEAD
    closeHorarios.onclick = () => { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } 
=======
    closeHorarios.onclick = () => { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } // NOVO
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80

    // Fechar ao clicar na tela escura fora do pop-up
    window.onclick = (event) => {
        if (event.target == modalServicos) { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == modalForm) { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
<<<<<<< HEAD
        if (event.target == modalHorarios) { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } 
    }

    // ==========================================
    // VALIDAÇÃO DE DATA E HORA DE FUNCIONAMENTO
    // ==========================================
    const inputData = document.getElementById("dataAgendamento");
    const inputHora = document.getElementById("horaAgendamento");

    // 1. Bloquear dias que já passaram (define o dia mínimo como "hoje")
    const hoje = new Date().toISOString().split('T')[0];
    inputData.setAttribute("min", hoje);

    // 2. Trava para o dia da semana (Bloqueia Domingo e Segunda)
    inputData.addEventListener("change", function() {
        // T12:00:00 garante que o fuso horário não vai errar o dia
        const dataEscolhida = new Date(this.value + 'T12:00:00'); 
        const diaSemana = dataEscolhida.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

        if (diaSemana === 0 || diaSemana === 1) {
            alert("⚠️ Não funcionamos aos domingos e segundas-feiras. Por favor, escolha outra data.");
            this.value = ""; // Apaga a data errada
            inputHora.value = ""; // Apaga a hora por precaução
        }
    });

    // 3. Trava para os horários dependendo do dia (Terça a Sexta x Sábado)
    inputHora.addEventListener("change", function() {
        if (!inputData.value) {
            alert("Por favor, escolha a data primeiro!");
            this.value = "";
            return;
        }

        const dataEscolhida = new Date(inputData.value + 'T12:00:00');
        const diaSemana = dataEscolhida.getDay();
        const horaEscolhida = this.value; // Formato "HH:MM"

        let horaValida = false;

        if (diaSemana >= 2 && diaSemana <= 5) { 
            // Terça a Sexta: Entre 14:00 e 18:00
            if (horaEscolhida >= "14:00" && horaEscolhida <= "18:00") {
                horaValida = true;
            }
        } else if (diaSemana === 6) { 
            // Sábado: Entre 09:00 e 18:00
            if (horaEscolhida >= "09:00" && horaEscolhida <= "18:00") {
                horaValida = true;
            }
        }

        // Se a hora estiver fora do padrão, avisa e apaga
        if (!horaValida) {
            if (diaSemana === 6) {
                alert("⚠️ Aos sábados, nosso horário de atendimento é das 09:00 às 18:00. Por favor, escolha um horário válido.");
            } else {
                alert("⚠️ De terça a sexta-feira, nosso horário de atendimento é das 14:00 às 18:00. Por favor, escolha um horário válido.");
            }
            this.value = ""; // Apaga a hora errada
        }
    });
    // Salvar no Firebase e Resetar Formulário (Sem WhatsApp)
    const form = document.getElementById("formAgendamento");
    
    form.onsubmit = async function (e) {
        e.preventDefault(); 

=======
        if (event.target == modalHorarios) { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } // NOVO
    }

    // Enviar WhatsApp e Resetar Formulário
    const form = document.getElementById("formAgendamento");
    form.onsubmit = function(e) {
        e.preventDefault(); // Impede o site de recarregar
        
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80
        // Pega os valores digitados
        const nome = document.getElementById("nome").value;
        const servico = document.getElementById("servicoInteresse").value;
        const data = document.getElementById("dataAgendamento").value;
        const hora = document.getElementById("horaAgendamento").value;
        const msg = document.getElementById("mensagem").value;
<<<<<<< HEAD

        // Muda o texto do botão para mostrar que está carregando (Boa prática)
        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerText;
        btnSubmit.innerText = "Enviando...";

        try {
            // Calcula a data de expiração (Ex: o dia escolhido + 24 horas)
            const dataAgendada = new Date(data + 'T' + hora);
            const dataExpiracao = new Date(dataAgendada.getTime() + (1 * 60 * 60 * 1000)); // 1 hora

            // SALVA NO FIREBASE
            await addDoc(collection(db, "agendamentos"), {
                nome: nome,
                servico: servico,
                data: data,
                hora: hora,
                mensagem: msg,
                dataRegistro: new Date(), // Salva a data e hora em que a cliente preencheu
                expiraEm: dataExpiracao
            });

            // Avisa a cliente que deu tudo certo
            alert(`Tudo certo, ${nome}! Seu pedido de agendamento foi enviado com sucesso para a Emilly.`);

            // RESETA O FORMULÁRIO (Limpa os campos)
            form.reset();

            // Fecha o pop-up
            modalForm.style.display = "none";
            document.body.style.overflow = "auto";

        } catch (error) {
            console.error("Erro ao salvar no banco de dados:", error);
            alert("Houve um erro ao registrar seu agendamento. Por favor, tente novamente.");
        } finally {
            // Restaura o texto do botão
            btnSubmit.innerText = textoOriginal;
        }
=======
        
        // Formata a data de AAAA-MM-DD (padrão do sistema) para DD/MM/AAAA (padrão Brasil)
        const dataFormatada = data.split('-').reverse().join('/');

        // Número de telefone do salão
        const fone = "5511944682978"; // COLOQUE O SEU NÚMERO AQUI
        
        // Monta o texto incluindo data e hora
        const texto = `Olá! Meu nome é ${nome}. Tenho interesse no serviço: ${servico}. %0AGostaria de agendar para o dia ${dataFormatada} às ${hora}. %0AObs: ${msg}`;
        
        // Abre o WhatsApp
        window.open(`https://wa.me/${fone}?text=${texto}`, '_blank');

        // RESETA O FORMULÁRIO (Limpa os campos)
        form.reset();

        // OPCIONAL: Se quiser que o pop-up feche sozinho depois de enviar, descomente as duas linhas abaixo:
        modalForm.style.display = "none";
        document.body.style.overflow = "auto";
>>>>>>> d49e7f49a0ccba4a5968b148b942f470df40ba80
    }
});