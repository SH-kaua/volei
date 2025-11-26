script.js
// Variáveis para armazenar a pontuação e estado do jogo
let score1 = 0;
let score2 = 0;
let sets1 = 0;
let sets2 = 0;
let currentSet = 1;
let matchHistory = JSON.parse(localStorage.getItem('volleyballMatchHistory')) || [];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de abas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe active de todas as abas e conteúdos
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Adiciona a classe active à aba clicada e ao conteúdo correspondente
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            
            // Se for a aba de histórico, carrega o histórico
            if (tab.dataset.tab === 'history') {
                loadMatchHistory();
            }
        });
    });
    
    // Atualiza os nomes dos times quando os inputs mudam
    document.getElementById('team1-name').addEventListener('input', updateTeamNames);
    document.getElementById('team2-name').addEventListener('input', updateTeamNames);
    
    // Carrega o histórico se estiver na aba de histórico
    if (document.getElementById('history').classList.contains('active')) {
        loadMatchHistory();
    }
    
    // Inicializa os nomes dos times
    updateTeamNames();
});

// Atualiza os nomes dos times nos placares
function updateTeamNames() {
    const team1Name = document.getElementById('team1-name').value || 'Time A';
    const team2Name = document.getElementById('team2-name').value || 'Time B';
    
    document.getElementById('team1-title').textContent = team1Name;
    document.getElementById('team2-title').textContent = team2Name;
}

// Funções para adicionar e remover pontos
function addPoint(team) {
    if (team === 1) {
        score1++;
        document.getElementById('score1').textContent = score1;
        document.getElementById('score1').classList.add('pulse');
        setTimeout(() => {
            document.getElementById('score1').classList.remove('pulse');
        }, 500);
    } else {
        score2++;
        document.getElementById('score2').textContent = score2;
        document.getElementById('score2').classList.add('pulse');
        setTimeout(() => {
            document.getElementById('score2').classList.remove('pulse');
        }, 500);
    }
    
    checkSetWinner();
}

function removePoint(team) {
    if (team === 1 && score1 > 0) {
        score1--;
        document.getElementById('score1').textContent = score1;
    } else if (team === 2 && score2 > 0) {
        score2--;
        document.getElementById('score2').textContent = score2;
    }
}

// Verificar se há vencedor do set
function checkSetWinner() {
    const team1Name = document.getElementById('team1-name').value || 'Time A';
    const team2Name = document.getElementById('team2-name').value || 'Time B';
    
    // Define o limite de pontos baseado no set atual
    const pointLimit = currentSet === 5 ? 15 : 25;
    
    // Verifica se algum time atingiu o limite de pontos com diferença de 2
    if ((score1 >= pointLimit || score2 >= pointLimit) && Math.abs(score1 - score2) >= 2) {
        let winner;
        
        if (score1 > score2) {
            sets1++;
            document.querySelectorAll('#sets1 .set')[currentSet - 1].classList.add('won');
            winner = team1Name;
        } else {
            sets2++;
            document.querySelectorAll('#sets2 .set')[currentSet - 1].classList.add('won');
            winner = team2Name;
        }
        
        // Verifica se há vencedor do jogo
        if (sets1 >= 3 || sets2 >= 3) {
            const winnerName = sets1 >= 3 ? team1Name : team2Name;
            const finalScore = `${sets1} x ${sets2}`;
            
            // Adiciona ao histórico
            addToHistory(team1Name, team2Name, finalScore, winnerName);
            
            setTimeout(() => {
                alert(`${winnerName} venceu o jogo por ${finalScore}!`);
            }, 500);
        } else {
            // Avança para o próximo set
            setTimeout(() => {
                currentSet++;
                document.getElementById('current-set').textContent = currentSet;
                resetSet();
            }, 1500);
        }
    }
}

// Reiniciar o set atual
function resetSet() {
    score1 = 0;
    score2 = 0;
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
}

// Reiniciar o jogo completo
function resetGame() {
    if (confirm("Tem certeza que deseja reiniciar o jogo? Todos os pontos serão perdidos.")) {
        score1 = 0;
        score2 = 0;
        sets1 = 0;
        sets2 = 0;
        currentSet = 1;
        
        document.getElementById('score1').textContent = score1;
        document.getElementById('score2').textContent = score2;
        document.getElementById('current-set').textContent = currentSet;
        
        // Remove as marcações de sets vencidos
        document.querySelectorAll('.set').forEach(set => {
            set.classList.remove('won');
        });
    }
}

// Iniciar um novo jogo
function newGame() {
    if (confirm("Iniciar um novo jogo? O jogo atual será salvo no histórico.")) {
        const team1Name = document.getElementById('team1-name').value || 'Time A';
        const team2Name = document.getElementById('team2-name').value || 'Time B';
        
        // Salva o jogo atual no histórico se houver pontos
        if (score1 > 0 || score2 > 0 || sets1 > 0 || sets2 > 0) {
            const finalScore = `${sets1} x ${sets2}`;
            const winner = sets1 > sets2 ? team1Name : (sets2 > sets1 ? team2Name : 'Empate');
            addToHistory(team1Name, team2Name, finalScore, winner);
        }
        
        // Reseta para um novo jogo
        score1 = 0;
        score2 = 0;
        sets1 = 0;
        sets2 = 0;
        currentSet = 1;
        
        document.getElementById('score1').textContent = score1;
        document.getElementById('score2').textContent = score2;
        document.getElementById('current-set').textContent = currentSet;
        
        // Remove as marcações de sets vencidos
        document.querySelectorAll('.set').forEach(set => {
            set.classList.remove('won');
        });
        
        // Reseta os nomes dos times
        document.getElementById('team1-name').value = 'Time A';
        document.getElementById('team2-name').value = 'Time B';
        updateTeamNames();
    }
}

// Adicionar partida ao histórico
function addToHistory(team1, team2, score, winner) {
    const match = {
        id: Date.now(),
        team1: team1,
        team2: team2,
        score: score,
        winner: winner,
        date: new Date().toLocaleString('pt-BR')
    };
    
    matchHistory.unshift(match);
    
    // Mantém apenas os últimos 10 jogos no histórico
    if (matchHistory.length > 10) {
        matchHistory = matchHistory.slice(0, 10);
    }
    
    // Salva no localStorage
    localStorage.setItem('volleyballMatchHistory', JSON.stringify(matchHistory));
    
    // Atualiza a exibição se estiver na aba de histórico
    if (document.getElementById('history').classList.contains('active')) {
        loadMatchHistory();
    }
}

// Carregar histórico de partidas
function loadMatchHistory() {
    const historyContainer = document.getElementById('match-history');
    
    if (matchHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">Nenhuma partida registrada ainda.</p>';
        return;
    }
    
    historyContainer.innerHTML = matchHistory.map(match => `
        <div class="history-item">
            <div class="history-match">
                <div class="history-teams">
                    <strong>${match.team1}</strong> vs <strong>${match.team2}</strong>
                </div>
                <div class="history-score">
                    Placar: <strong>${match.score}</strong>
                </div>
                <div class="history-winner">
                    Vencedor: <strong>${match.winner}</strong>
                </div>
                <div class="history-date">
                    ${match.date}
                </div>
            </div>
        </div>
    `).join('');
}

// Limpar histórico
function clearHistory() {
    if (confirm("Tem certeza que deseja limpar todo o histórico de partidas?")) {
        matchHistory = [];
        localStorage.removeItem('volleyballMatchHistory');
        loadMatchHistory();
    }
}