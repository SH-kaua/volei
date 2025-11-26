script.js
// VARIÁVEIS DE ESTADO
let pontosA = 0;
let pontosB = 0;
let setsA = 0;
let setsB = 0;
let setAtual = 1;
let saque = 'A'; // 'A' ou 'B'
let cronometroId = null; // Para controlar o intervalo do cronômetro

// ELEMENTOS DO DOM (DECLARAÇÃO CONSOLIDADA)
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
    botoesPonto: document.querySelectorAll('.botao-ponto'),
    detalhePenalidade: document.getElementById('detalhe-penalidade'),
    selectPenalidade: document.getElementById('select-penalidade')
};

// Dicionário de regras de penalidades
const regrasPenalidades = {
    rede: {
        titulo: "Toque na Rede (Durante o ataque)",
        regra: "O jogador toca em qualquer parte da rede, antenas ou cabos de fixação durante a ação de jogar a bola, ou se isso interferir no jogo. É falta. O ponto é dado ao adversário."
    },
    saque: {
        titulo: "Falta de Saque",
        regra: "O jogador pisa na linha de fundo ou dentro da quadra no momento do contato com a bola (durante o saque) ou excede o tempo limite de 8 segundos. O ponto é dado ao adversário."
    },
    conducao: {
        titulo: "Condução (Carregar)",
        regra: "A bola é 'segurada' ou 'conduzida' pelo jogador. O contato deve ser rápido e limpo, exceto no primeiro toque (defesa). Falta resulta em ponto para o adversário."
    },
    rotacao: {
        titulo: "Falta de Rotação",
        regra: "O time não segue a ordem correta de rotação no momento do saque. O ponto do rally é revertido (ou dado) ao adversário, e a ordem correta deve ser restabelecida."
    },
    cartao: {
        titulo: "Cartões (Amarelo e Vermelho)",
        regra: "Amarelo: advertência (sem perda de ponto). Vermelho: penalidade (perda do rally/ponto e saque para o adversário). Cartões subsequentes resultam em expulsão do set ou da partida."
    }
};

// ------------------------------------
// FUNÇÕES DE CONTROLE DE INTERFACE (UI)
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

// ------------------------------------
// LÓGICA DE JOGO
// ------------------------------------

// Chamada pelo botão no HTML
function marcarPonto(time) {
    // 1. Marca o ponto e atualiza o DOM
    if (time === 'A') {
        pontosA++;
        DOM.pontosA.textContent = pontosA;
    } else {
        pontosB++;
        DOM.pontosB.textContent = pontosB;
    }
    
    // 2. O time que marcou o ponto ganha o saque (Regra Rally Point)
    saque = time;
    atualizarSaque();

    // 3. Verifica Fim de Set
    verificarFimDeSet();
}

function verificarFimDeSet() {
    const limitePonto = (setAtual < 5) ? 25 : 15;
    let timeVencedor = null;

    // Condição para ganhar: atingir o limite E ter 2 pontos de diferença
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

function iniciarPausaOuFimDeJogo(vencedor) {
    DOM.timeVencedor.textContent = vencedor;
    
    // Verifica Fim de Jogo
    if (setsA === 3 || setsB === 3) {
        const vencedorPartida = setsA === 3 ? 'Time A' : 'Time B';
        DOM.timeVencedor.textContent = `PARABÉNS! ${vencedorPartida} Venceu o JOGO!`;
        DOM.contadorTempo.textContent = 'FIM DE PARTIDA. Clique em "Resetar Tudo" para um novo jogo.';
        
        DOM.overlay.classList.add('ativo');
        setBotoesHabilitados(false);

    } else {
        alert(`FIM DO SET ${setAtual}! ${vencedor} venceu.`);
        iniciarCronometroPausa();
    }
}

// Lógica de cronômetro e pausa de 2 minutos
function iniciarCronometroPausa() {
    const TEMPO_PAUSA_MS = 120 * 1000; // 2 minutos
    let tempoRestante = TEMPO_PAUSA_MS;

    setBotoesHabilitados(false);
    DOM.overlay.classList.add('ativo');

    // Função auxiliar para formatar 00:00
    const formatarTempo = (ms) => {
        const minutos = Math.floor(ms / 60000);
        const segundos = Math.floor((ms % 60000) / 1000);
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    DOM.contadorTempo.textContent = `Reiniciando em ${formatarTempo(tempoRestante)}...`;

    // Limpa qualquer cronômetro anterior
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
    setBotoesHabilitados(true);
    iniciarNovoSet(); 
}

function iniciarNovoSet() {
    // 1. Inicia o próximo set
    setAtual++;
    DOM.setAtual.textContent = setAtual;
    
    // 2. Zera os pontos
    pontosA = 0;
    pontosB = 0;
    DOM.pontosA.textContent = pontosA;
    DOM.pontosB.textContent = pontosB;

    // 3. Alterna o primeiro saque do novo set
    saque = (saque === 'A') ? 'B' : 'A'; 
    atualizarSaque();
}

// Chamada pelo botão no HTML
function resetarPlacar(jogoTerminado = false) {
    if (!jogoTerminado && !confirm('Tem certeza que deseja resetar todo o placar e sets?')) {
        return;
    }
    
    // Para o cronômetro, se estiver ativo
    if (cronometroId) {
        clearInterval(cronometroId);
        cronometroId = null;
    }

    // Reseta o estado
    pontosA = 0;
    pontosB = 0;
    setsA = 0;
    setsB = 0;
    setAtual = 1;
    saque = 'A'; 

    // Atualiza a interface
    DOM.pontosA.textContent = pontosA;
    DOM.pontosB.textContent = pontosB;
    DOM.setsA.textContent = setsA;
    DOM.setsB.textContent = setsB;
    DOM.setAtual.textContent = setAtual;
    
    // Garante que o overlay seja fechado e botões habilitados
    DOM.overlay.classList.remove('ativo');
    setBotoesHabilitados(true);

    atualizarSaque();
    if (!jogoTerminado) {
        alert('Placar resetado.');
    }
}

// ------------------------------------
// LÓGICA DE DÚVIDAS E PENALIDADES
// ------------------------------------

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarSaque();
    mostrarDetalhePenalidade(); 
    // Adiciona o listener de mudança ao select
    DOM.selectPenalidade.addEventListener('change', mostrarDetalhePenalidade);
});