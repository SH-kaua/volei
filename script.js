script.js
// VARIÁVEIS DE ESTADO
let pontosA = 0;
let pontosB = 0;
let setsA = 0;
let setsB = 0;
let setAtual = 1;
let saque = 'A'; // 'A' ou 'B'
let cronometroId = null; 
let ultimoPontoMarcado = 'A'; 

// ELEMENTOS DO DOM
const DOM = {
    pontosA: document.getElementById('pontosA'),
    pontosB: document.getElementById('pontosB'),
    setsA: document.getElementById('setsA'),
    setsB: document.getElementById('setsB'),
    setAtual: document.getElementById('setAtual'),
    saqueA: document.getElementById('saqueA'),
    saqueB: document.getElementById('saqueB'),
    overlay: document.getElementById('overlay-vencedor'),
    timeVencedor: document.getElementById('time-vencedor'),
    contadorTempo: document.getElementById('contador-tempo'),
    botoesPonto: document.querySelectorAll('.botao-aumentar, .botao-diminuir'), 
    detalhePenalidade: document.getElementById('detalhe-penalidade'),
    selectPenalidade: document.getElementById('select-penalidade')
};

// Dicionário de regras de penalidades (omito o conteúdo por brevidade, mas permanece o mesmo)
const regrasPenalidades = {
    rede: {titulo: "Toque na Rede (Durante o ataque)", regra: "..." },
    saque: {titulo: "Falta de Saque", regra: "..." },
    conducao: {titulo: "Condução (Carregar)", regra: "..." },
    rotacao: {titulo: "Falta de Rotação", regra: "..." },
    cartao: {titulo: "Cartões (Amarelo e Vermelho)", regra: "..." }
};

// ------------------------------------
// FUNÇÕES DE CONTROLE DE PONTUAÇÃO
// ------------------------------------

function marcarPonto(time) {
    if (time === 'A') {
        pontosA++;
        DOM.pontosA.textContent = pontosA;
    } else {
        pontosB++;
        DOM.pontosB.textContent = pontosB;
    }
    
    saque = time;
    ultimoPontoMarcado = time;
    atualizarSaque();

    verificarFimDeSet();
}

function diminuirPonto(time) {
    if (time === 'A' && pontosA > 0) {
        pontosA--;
        DOM.pontosA.textContent = pontosA;
    } else if (time === 'B' && pontosB > 0) {
        pontosB--;
        DOM.pontosB.textContent = pontosB;
    }
    
    atualizarSaque();
    verificarFimDeSet();
}

function verificarFimDeSet() {
    const limitePonto = (setAtual < 5) ? 25 : 15;
    let timeVencedor = null;

    if (pontosA >= limitePonto && (pontosA - pontosB) >= 2) {
        timeVencedor = 'Time A';
        setsA++;
        DOM.setsA.textContent = setsA;
    } else if (pontosB >= limitePonto && (pontosB - pontosA) >= 2) {
        timeVencedor = 'Time B';
        setsB++;
        DOM.setsB.textContent = setsB;
    }

    if (timeVencedor) {
        iniciarPausaOuFimDeJogo(timeVencedor);
    }
}

// ------------------------------------
// FUNÇÕES DE PAUSA E CONTROLE DE ESTADO
// ------------------------------------

function atualizarSaque() {
    DOM.saqueA.classList.remove('saque');
    DOM.saqueB.classList.remove('saque');
    if (saque === 'A') {
        DOM.saqueA.classList.add('saque');
    } else {
        DOM.saqueB.classList.add('saque');
    }
}

function setBotoesHabilitados(habilitado) {
    const acao = habilitado ? 'remove' : 'add';
    DOM.botoesPonto.forEach(botao => {
        botao.classList[acao]('desabilitado');
    });
}

function iniciarPausaOuFimDeJogo(vencedor) {
    DOM.timeVencedor.textContent = vencedor;
    
    if (setsA === 3 || setsB === 3) {
        // FIM DE JOGO
        const vencedorPartida = setsA === 3 ? 'Time A' : 'Time B';
        DOM.timeVencedor.textContent = `PARABÉNS! ${vencedorPartida} Venceu o JOGO!`;
        DOM.contadorTempo.textContent = 'FIM DE PARTIDA. Use os botões abaixo para corrigir ou clique em "Resetar Tudo".';
        
        DOM.overlay.classList.add('ativo');
        
        // **NÃO DESABILITA OS BOTÕES AQUI** - Permite a correção manual do placar final.
        setBotoesHabilitados(true); 

    } else {
        // Pausa de 2 minutos entre sets
        alert(`FIM DO SET ${setAtual}! ${vencedor} venceu.`);
        iniciarCronometroPausa();
    }
}

function iniciarCronometroPausa() {
    const TEMPO_PAUSA_MS = 120 * 1000; // 2 minutos
    let tempoRestante = TEMPO_PAUSA_MS;

    // DESABILITA botões DURANTE a pausa (para evitar contagem automática durante o cronômetro)
    setBotoesHabilitados(false); 
    DOM.overlay.classList.add('ativo');

    const formatarTempo = (ms) => {
        const minutos = Math.floor(ms / 60000);
        const segundos = Math.floor((ms % 60000) / 1000);
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    DOM.contadorTempo.textContent = `Reiniciando em ${formatarTempo(tempoRestante)}...`;

    if (cronometroId) {
        clearInterval(cronometroId);
    }

    cronometroId = setInterval(() => {
        tempoRestante -= 1000;
        
        DOM.contadorTempo.textContent = `Reiniciando em ${formatarTempo(tempoRestante)}...`;

        if (tempoRestante <= 0) {
            clearInterval(cronometroId);
            finalizarPausa();
        }
    }, 1000);
}

function finalizarPausa() {
    DOM.overlay.classList.remove('ativo');
    // HABILITA botões após a pausa
    setBotoesHabilitados(true); 
    iniciarNovoSet(); 
}

function iniciarNovoSet() {
    setAtual++;
    DOM.setAtual.textContent = setAtual;
    
    pontosA = 0;
    pontosB = 0;
    DOM.pontosA.textContent = pontosA;
    DOM.pontosB.textContent = pontosB;

    saque = (saque === 'A') ? 'B' : 'A'; 
    ultimoPontoMarcado = saque; 
    atualizarSaque();
}

function resetarPlacar(jogoTerminado = false) {
    if (!jogoTerminado && !confirm('Tem certeza que deseja resetar todo o placar e sets?')) {
        return;
    }
    
    if (cronometroId) {
        clearInterval(cronometroId);
        cronometroId = null;
    }

    pontosA = 0;
    pontosB = 0;
    setsA = 0;
    setsB = 0;
    setAtual = 1;
    saque = 'A'; 
    ultimoPontoMarcado = 'A'; 

    DOM.pontosA.textContent = pontosA;
    DOM.pontosB.textContent = pontosB;
    DOM.setsA.textContent = setsA;
    DOM.setsB.textContent = setsB;
    DOM.setAtual.textContent = setAtual;
    
    DOM.overlay.classList.remove('ativo');
    setBotoesHabilitados(true);

    atualizarSaque();
    if (!jogoTerminado) {
        alert('Placar resetado.');
    }
}

// LÓGICA DE DÚVIDAS E PENALIDADES (Permanece igual)
function mostrarDetalhePenalidade() {
    const chave = DOM.selectPenalidade.value;
    
    if (chave in regrasPenalidades) {
        const detalhe = regrasPenalidades[chave];
        DOM.detalhePenalidade.innerHTML = `
            <h4>${detalhe.titulo}</h4>
            <p>${detalhe.regra}</p>
        `;
    } else {
        DOM.detalhePenalidade.innerHTML = `
            <p>Selecione um tópico acima para ver os detalhes da regra/penalidade.</p>
        `;
    }
}

// Inicialização e Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    atualizarSaque();
    mostrarDetalhePenalidade(); 
    DOM.selectPenalidade.addEventListener('change', mostrarDetalhePenalidade);
});