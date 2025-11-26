script.js
// VARIÁVEIS DE ESTADO
let pontosA = 0;
let pontosB = 0;
let setsA = 0;
let setsB = 0;
let setAtual = 1;
let saque = 'A'; // 'A' ou 'B'
let cronometroId = null; 
// Armazena o último time que marcou o ponto (útil para correção manual do saque)
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
    // Seleciona botões de AUMENTAR e DIMINUIR
    botoesPonto: document.querySelectorAll('.botao-aumentar, .botao-diminuir'), 
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
// FUNÇÕES DE CONTROLE DE PONTUAÇÃO
// ------------------------------------

/**
 * Adiciona um ponto ao time especificado e ajusta o saque (Rally Point).
 * @param {string} time - 'A' ou 'B'.
 */
function marcarPonto(time) {
    if (time === 'A') {
        pontosA++;
        DOM.pontosA.textContent = pontosA;
    } else {
        pontosB++;
        DOM.pontosB.textContent = pontosB;
    }
    
    // O time que marcou o ponto ganha/mantém o saque
    saque = time;
    ultimoPontoMarcado = time;
    atualizarSaque();

    verificarFimDeSet();
}

/**
 * Remove um ponto do time especificado.
 * O saque não muda, pois presume-se que é uma correção manual.
 * @param {string} time - 'A' ou 'B'.
 */
function diminuirPonto(time) {
    // Garante que o ponto não seja negativo
    if (time === 'A' && pontosA > 0) {
        pontosA--;
        DOM.pontosA.textContent = pontosA;
    } else if (time === 'B' && pontosB > 0) {
        pontosB--;
        DOM.pontosB.textContent = pontosB;
    }
    
    // O saque permanece com o último time que marcou o ponto (ou seja, não altera o saque)
    atualizarSaque();
    
    // Verifica se a correção afetou o fim do set
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
    
    // Verifica se é Fim de Jogo (Melhor de 5 sets)
    if (setsA === 3 || setsB === 3) {
        const vencedorPartida = setsA === 3 ? 'Time A' : 'Time B';
        DOM.timeVencedor.textContent = `PARABÉNS! ${vencedorPartida} Venceu o JOGO!`;
        DOM.contadorTempo.textContent = 'FIM DE PARTIDA. Clique em "Resetar Tudo" para um novo jogo.';
        
        DOM.overlay.classList.add('ativo');
        setBotoesHabilitados(false);

    } else {
        // Pausa de 2 minutos entre sets
        alert(`FIM DO SET ${setAtual}! ${vencedor} venceu.`);
        iniciarCronometroPausa();
    }
}

function iniciarCronometroPausa() {
    const TEMPO_PAUSA_MS = 120 * 1000; // 2 minutos
    let tempoRestante = TEMPO_PAUSA_MS;

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

    // Alterna o saque inicial do novo set
    saque = (saque === 'A') ? 'B' : 'A'; 
    ultimoPontoMarcado = saque; // O primeiro saque define o último ponto marcado
    atualizarSaque();
}

/**
 * Reseta todos os placares e estados do jogo.
 */
function resetarPlacar(jogoTerminado = false) {
    if (!jogoTerminado && !confirm('Tem certeza que deseja resetar todo o placar e sets?')) {
        return;
    }
    
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
    ultimoPontoMarcado = 'A'; 

    // Atualiza a interface
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

// Inicialização e Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    atualizarSaque();
    mostrarDetalhePenalidade(); 
    DOM.selectPenalidade.addEventListener('change', mostrarDetalhePenalidade);
});