script.js
// Sons
const somPonto = new Audio('sounds/ponto.mp3');
const somPenalidade = new Audio('sounds/penalidade.mp3');

let pontosA = 0, pontosB = 0, setsA = 0, setsB = 0;

function tocarSom(tipo) {
  const som = tipo === 'ponto' ? somPonto : somPenalidade;
  som.currentTime = 0;
  som.play().catch(() => {}); // evita erro se ainda não houve interação
}

function addPoint(time, valor) {
  tocarSom(valor > 0 ? 'ponto' : 'penalidade');

  if (time === 'A') {
    pontosA = Math.max(0, pontosA + valor);
    document.getElementById('scoreA').textContent = pontosA;
  } else {
    pontosB = Math.max(0, pontosB + valor);
    document.getElementById('scoreB').textContent = pontosB;
  }
}

function verificarVencedorSet() {
  const tiebreak = setsA + setsB === 4;
  const minimo = tiebreak ? 15 : 25;
  const diferenca = Math.abs(pontosA - pontosB);

  if ((pontosA >= minimo || pontosB >= minimo) && diferenca >= 2) {
    return pontosA > pontosB ? 'A' : 'B';
  }
  return null;
}

function declararSet(vencedor) {
  const realVencedor = verificarVencedorSet();

  if (!realVencedor) {
    alert(`O set ainda não terminou!\nÉ preciso ${setsA + setsB === 4 ? '15' : '25'} pontos com no mínimo 2 de vantagem.`);
    return;
  }

  if (realVencedor !== vencedor) {
    if (!confirm(`O placar mostra que o Time ${realVencedor} está ganhando.\nMesmo assim dar o set para o Time ${vencedor}?`)) {
      return;
    }
  }

  if (vencedor === 'A') setsA++; else setsB++;
  document.getElementById('setsA').textContent = setsA;
  document.getElementById('setsB').textContent = setsB;

  alert(`TIME ${vencedor} VENCEU O SET!\nPlacar de sets: ${setsA} × ${setsB}`);

  // Zera o set atual
  pontosA = pontosB = 0;
  document.getElementById('scoreA').textContent = '0';
  document.getElementById('scoreB').textContent = '0';

  // Verifica campeão da partida
  if (setsA === 3) {
    setTimeout(() => alert("PARABÉNS! TIME A É O CAMPEÃO DA PARTIDA!"), 500);
  }
  if (setsB === 3) {
    setTimeout(() => alert("PARABÉNS! TIME B É O CAMPEÃO DA PARTIDA!"), 500);
  }
}

function zerarSet() {
  if (confirm('Zerar apenas o set atual?')) {
    pontosA = pontosB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
  }
}

function novoJogo() {
  if (confirm('Começar um NOVO JOGO?\nTodo o placar será zerado.')) {
    pontosA = pontosB = setsA = setsB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
    document.getElementById('setsA').textContent = '0';
    document.getElementById('setsB').textContent = '0';
  }
}