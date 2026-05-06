document.addEventListener("DOMContentLoaded", function() {
    
    // Modais
    const modalServicos = document.getElementById("modalServicos");
    const modalForm = document.getElementById("modalFormulario");
    const modalHorarios = document.getElementById("modalHorarios"); // NOVO

    // Botões de abrir
    const btnServicos = document.getElementById("btnServicos");
    const btnAbrirForm = document.getElementById("btnAbrirForm");
    const btnHorarios = document.getElementById("btnHorarios"); // NOVO
    const btnVerHorariosForm = document.getElementById("btnVerHorariosForm"); // Botão dentro do formulário

    // Botões de fechar (Os "X")
    const closeServicos = document.getElementById("closeServicos");
    const closeForm = document.getElementById("closeForm");
    const closeHorarios = document.getElementById("closeHorarios"); // NOVO

    // Funções para Abrir
    btnServicos.onclick = () => { modalServicos.style.display = "block"; document.body.style.overflow = "hidden"; }
    btnAbrirForm.onclick = () => { modalForm.style.display = "block"; document.body.style.overflow = "hidden"; }
    btnHorarios.onclick = () => { modalHorarios.style.display = "block"; document.body.style.overflow = "hidden"; } // NOVO
    // Abre os horários a partir do botão dentro do formulário
    btnVerHorariosForm.onclick = () => { modalHorarios.style.display = "block"; }

    // Funções para Fechar
    closeServicos.onclick = () => { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
    closeForm.onclick = () => { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
    closeHorarios.onclick = () => { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } // NOVO

    // Fechar ao clicar na tela escura fora do pop-up
    window.onclick = (event) => {
        if (event.target == modalServicos) { modalServicos.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == modalForm) { modalForm.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == modalHorarios) { modalHorarios.style.display = "none"; document.body.style.overflow = "auto"; } // NOVO
    }

    // Enviar WhatsApp e Resetar Formulário
    const form = document.getElementById("formAgendamento");
    form.onsubmit = function(e) {
        e.preventDefault(); // Impede o site de recarregar
        
        // Pega os valores digitados
        const nome = document.getElementById("nome").value;
        const servico = document.getElementById("servicoInteresse").value;
        const data = document.getElementById("dataAgendamento").value;
        const hora = document.getElementById("horaAgendamento").value;
        const msg = document.getElementById("mensagem").value;
        
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
    }
});