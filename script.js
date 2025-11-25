script.js

let pontosA = 0;
let pontosB = 0;
let setsA = 0;
let setsB = 0;
let setAtual = 1;
let saque = 'A'; // Começa com o Time A sacando

const pontosElementoA = document.getElementById('pontosA');
const pontosElementoB = document.getElementById('pontosB');
const setsElementoA = document.getElementById('setsA');
const setsElementoB = document.getElementById('setsB');
const setAtualElemento = document.getElementById('setAtual');
const saqueElementoA = document.getElementById('saqueA');
const saqueElementoB = document.getElementById('saqueB');
const detalhePenalidadeElemento = document.getElementById('detalhe-penalidade');

// Dicionário de regras de penalidades
const regrasPenalidades = {
    rede: {
        titulo: "Toque na Rede (Durante o ataque)",
        regra: "O jogador toca em qualquer parte da rede, antenas ou cabos de fixação durante a ação de jogar a bola, ou se isso interferir no jogo. É falta."
    },
    saque: {
        titulo: "Falta de Saque",
        regra: "O jogador pisa na linha de fundo ou dentro da quadra no momento do contato com a bola (durante o saque) ou excede o tempo limite de 8 segundos para a execução do saque."
    },
    conducao: {
        titulo: "Condução (Carregar)",
        regra: "A bola é 'segurada' ou 'conduzida' pelo jogador, ao invés de ser golpeada. O contato deve ser rápido e limpo, exceto no primeiro toque (defesa)."
    },
    rotacao: {
        titulo: "Falta de Rotação",
        regra: "O time não segue a ordem correta de rotação no momento em que a bola é sacada. Se o erro for descoberto, o ponto é revertido, o time perde o saque e o adversário ganha um ponto."
    },
    cartao: {
        titulo: "Cartões (Amarelo e Vermelho)",
        regra: "São usados para má conduta. Amarelo: advertência. Vermelho: penalidade (perda do rally/ponto e saque para o adversário). A combinação de cartões pode resultar em expulsão do set ou da partida."
    }
};

// Função para atualizar o indicador visual de saque
function atualizarSaque() {
    saqueElementoA.classList.remove('saque');
    saqueElementoB.classList.remove('saque');
    if (saque === 'A') {
        saqueElementoA.classList.add('saque');
    } else {
        saqueElementoB.classList.add('saque');
    }
}

// *** LÓGICA PRINCIPAL DE PONTUAÇÃO DE VÔLEI ***
function marcarPonto(time) {
    // 1. Marca o ponto
    if (time === 'A') {
        pontosA++;
        pontosElementoA.textContent = pontosA;
    } else {
        pontosB++;
        pontosElementoB.textContent = pontosB;
    }
    
    // 2. O time que marcou o ponto ganha o saque (Regra Rally Point)
    saque = time;
    atualizarSaque();

    // 3. Verifica Fim de Set
    verificarFimDeSet();
}

function verificarFimDeSet() {
    // Define o limite de pontos (25 para sets 1-4; 15 para o 5º set)
    let limitePonto = (setAtual < 5) ? 25 : 15;
    
    let setFinalizado = false;

    // Condição para Time A ganhar: atingir o limite E ter 2 pontos de diferença
    if (pontosA >= limitePonto && (pontosA - pontosB) >= 2) {
        setsA++;
        setsElementoA.textContent = setsA;
        alert(`FIM DO SET ${setAtual}! Time A venceu (${pontosA}-${pontosB}).`);
        setFinalizado = true;
    
    // Condição para Time B ganhar: atingir o limite E ter 2 pontos de diferença
    } else if (pontosB >= limitePonto && (pontosB - pontosA) >= 2) {
        setsB++;
        setsElementoB.textContent = setsB;
        alert(`FIM DO SET ${setAtual}! Time B venceu (${pontosB}-${pontosA}).`);
        setFinalizado = true;
    }

    if (setFinalizado) {
        iniciarNovoSet();
    }
}

function iniciarNovoSet() {
    // 1. Verifica Fim de Jogo (Melhor de 5, 3 sets para ganhar)
    if (setsA === 3 || setsB === 3) {
        const vencedor = setsA === 3 ? 'Time A' : 'Time B';
        alert(`FIM DE JOGO! O ${vencedor} venceu a partida.`);
        resetarPlacar(true); // Reseta tudo se o jogo terminou
        return;
    }

    // 2. Inicia o próximo set
    setAtual++;
    setAtualElemento.textContent = setAtual;
    
    // 3. Zera os pontos
    pontosA = 0;
    pontosB = 0;
    pontosElementoA.textContent = pontosA;
    pontosElementoB.textContent = pontosB;

    // 4. Alterna o primeiro saque do novo set (regra simples)
    // O time que perdeu o último set geralmente começa sacando no próximo (regra não estrita, mas comum)
    saque = (saque === 'A') ? 'B' : 'A'; 
    atualizarSaque();
}


// Função para resetar todo o placar
function resetarPlacar(jogoTerminado = false) {
    if (!jogoTerminado && !confirm('Tem certeza que deseja resetar todo o placar e sets?')) {
        return;
    }
    pontosA = 0;
    pontosB = 0;
    setsA = 0;
    setsB = 0;
    setAtual = 1;
    saque = 'A'; // Reinicia o saque

    pontosElementoA.textContent = pontosA;
    pontosElementoB.textContent = pontosB;
    setsElementoA.textContent = setsA;
    setsElementoB.textContent = setsB;
    setAtualElemento.textContent = setAtual;
    
    atualizarSaque();
    if (!jogoTerminado) {
        alert('Placar resetado.');
    }
}

// NOVIDADE: Função para exibir os detalhes da penalidade
function mostrarDetalhePenalidade() {
    const chave = document.getElementById('select-penalidade').value;
    
    if (chave in regrasPenalidades) {
        const detalhe = regrasPenalidades[chave];
        detalhePenalidadeElemento.innerHTML = `
            <h4>${detalhe.titulo}</h4>
            <p>${detalhe.regra}</p>
        `;
    } else {
        detalhePenalidadeElemento.innerHTML = `
            <p>Selecione um tópico acima para ver os detalhes da regra/penalidade.</p>
        `;
    }
}

// Inicializa o indicador de saque ao carregar
document.addEventListener('DOMContentLoaded', () => {
    atualizarSaque();
    mostrarDetalhePenalidade(); // Inicializa a área de detalhe com a mensagem padrão
});