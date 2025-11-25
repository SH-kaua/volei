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

// Lógica básica para pontuar e verificar set
function marcarPonto(time) {
    if (time === 'A') {
        pontosA++;
        pontosElementoA.textContent = pontosA;
        // Se Time A marcou, o saque é dele
        saque = 'A';
    } else {
        pontosB++;
        pontosElementoB.textContent = pontosB;
        // Se Time B marcou, o saque é dele
        saque = 'B';
    }

    // Atualiza visualmente quem está sacando
    atualizarSaque();

    // *** LÓGICA DE FIM DE SET (Simplificada) ***
    // Os sets vão até 25 pontos, exceto o 5º que vai a 15, com 2 pontos de diferença.
    // Esta é uma checagem básica. Para uma lógica completa, você precisará de mais checagens.
    
    let pontoDeSet = (setAtual < 5) ? 25 : 15;
    
    if (pontosA >= pontoDeSet && pontosA >= pontosB + 2) {
        setsA++;
        setsElementoA.textContent = setsA;
        alert(`FIM DO SET ${setAtual}! Time A venceu.`);
        iniciarNovoSet();
    } else if (pontosB >= pontoDeSet && pontosB >= pontosA + 2) {
        setsB++;
        setsElementoB.textContent = setsB;
        alert(`FIM DO SET ${setAtual}! Time B venceu.`);
        iniciarNovoSet();
    }
}

// Inicia o próximo set e verifica fim de jogo
function iniciarNovoSet() {
    // Verifica Fim de Jogo (Melhor de 5, 3 sets para ganhar)
    if (setsA === 3 || setsB === 3) {
        const vencedor = setsA === 3 ? 'Time A' : 'Time B';
        alert(`FIM DE JOGO! O ${vencedor} venceu a partida.`);
        resetarPlacar(true); // Reseta tudo se o jogo terminou
        return;
    }

    // Se o jogo continua, incrementa o set
    setAtual++;
    setAtualElemento.textContent = setAtual;
    
    // Zera os pontos para o novo set
    pontosA = 0;
    pontosB = 0;
    pontosElementoA.textContent = pontosA;
    pontosElementoB.textContent = pontosB;

    // Alterna o primeiro saque do set (regra básica)
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
    alert('Placar resetado.');
}

// Inicializa o indicador de saque ao carregar
document.addEventListener('DOMContentLoaded', atualizarSaque);