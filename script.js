script.js
const pointSound = new Audio('sounds/point.mp3');
const penaltySound = new Audio('sounds/penalty.mp3');

let scoreA = 0, scoreB = 0, setsA = 0, setsB = 0;

function playSound(type) {
  const sound = type === 'add' ? pointSound : penaltySound;
  sound.currentTime = 0;
  sound.play().catch(() => {}); // ignora erro se usuário não interagiu ainda
}

function addPoint(team, value) {
  playSound(value > 0 ? 'add' : 'sub');

  if (team === 'A') {
    scoreA = Math.max(0, scoreA + value);
    document.getElementById('scoreA').textContent = scoreA;
  } else {
    scoreB = Math.max(0, scoreB + value);
    document.getElementById('scoreB').textContent = scoreB;
  }
}

function checkSetWinner() {
  const isTiebreak = setsA + setsB === 4;
  const min = isTiebreak ? 15 : 25;
  const diff = Math.abs(scoreA - scoreB);

  if ((scoreA >= min || scoreB >= min) && diff >= 2) {
    return scoreA > scoreB ? 'A' : 'B';
  }
  return null;
}

function declareSet(winner) {
  const actualWinner = checkSetWinner();

  if (!actualWinner) {
    alert(`Set ainda não acabou!\nPrecisa de ${setsA + setsB === 4 ? 15 : 25} pontos com 2+ de vantagem.`);
    return;
  }

  if (actualWinner !== winner) {
    if (!confirm(`O placar indica vitória do Time ${actualWinner}.\nMesmo assim dar o set ao Time ${winner}?`)) return;
  }

  if (winner === 'A') setsA++; else setsB++;
  document.getElementById('setsA').textContent = setsA;
  document.getElementById('setsB').textContent = setsB;

  alert(`TIME ${winner} VENCEU O SET!\nPlacar: ${setsA} × ${setsB}`);

  // Reset set
  scoreA = scoreB = 0;
  document.getElementById('scoreA').textContent = '0';
  document.getElementById('scoreB').textContent = '0';

  // Campeão
  if (setsA === 3 || setsB === 3) {
    setTimeout(() => {
      alert(`PARABÉNS! TIME ${setsA === 3 ? 'A' : 'B'} É O CAMPEÃO DA PARTIDA!`);
    }, 400);
  }
}

function resetSet() {
  if (confirm('Zerar apenas o set atual?')) {
    scoreA = scoreB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
  }
}

function resetAll() {
  if (confirm('Iniciar NOVO JOGO?\nTodo o placar será zerado.')) {
    scoreA = scoreB = setsA = setsB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
    document.getElementById('setsA').textContent = '0';
    document.getElementById('setsB').textContent = '0';
  }
}