script.js
let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;

function addPoint(team, value) {
  if (team === 'A') {
    scoreA = Math.max(0, scoreA + value);
    document.getElementById('scoreA').textContent = scoreA;
  } else {
    scoreB = Math.max(0, scoreB + value);
    document.getElementById('scoreB').textContent = scoreB;
  }
}

function checkSetWinner() {
  const totalSets = setsA + setsB;
  const isTiebreak = totalSets === 4;

  const minPoints = isTiebreak ? 15 : 25;
  const diff = Math.abs(scoreA - scoreB);

  if ((scoreA >= minPoints || scoreB >= minPoints) && diff >= 2) {
    if (scoreA > scoreB) return 'A';
    if (scoreB > scoreA) return 'B';
  }
  return null;
}

function winSet(winner) {
  const winnerByRule = checkSetWinner();

  if (!winnerByRule) {
    alert(`O set ainda não terminou!\nPrecisa de ${setsA + setsB === 4 ? 15 : 25} pontos com pelo menos 2 de vantagem.`);
    return;
  }

  if (winnerByRule !== winner) {
    alert(`Atenção: O placar indica que o Time ${winnerByRule} está ganhando o set!`);
    if (!confirm("Mesmo assim declarar vitória do outro time?")) return;
  }

  if (winner === 'A') setsA++;
  else setsB++;

  document.getElementById('setsA').textContent = setsA;
  document.getElementById('setsB').textContent = setsB;

  alert(`Time ${winner} venceu o set!\nPlacar de sets: ${setsA} × ${setsB}`);

  // Zera o set atual
  scoreA = scoreB = 0;
  document.getElementById('scoreA').textContent = '0';
  document.getElementById('scoreB').textContent = '0';

  // Verifica campeão
  if (setsA === 3) {
    setTimeout(() => alert("TIME A É O CAMPEÃO DA PARTIDA!"), 300);
  }
  if (setsB === 3) {
    setTimeout(() => alert("TIME B É O CAMPEÃO DA PARTIDA!"), 300);
  }
}

function resetSet() {
  if (confirm("Zerar apenas o set atual?")) {
    scoreA = scoreB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
  }
}

function resetAll() {
  if (confirm("Iniciar um NOVO JOGO?\nTodo o placar será zerado.")) {
    scoreA = scoreB = setsA = setsB = 0;
    document.getElementById('scoreA').textContent = '0';
    document.getElementById('scoreB').textContent = '0';
    document.getElementById('setsA').textContent = '0';
    document.getElementById('setsB').textContent = '0';
  }
}