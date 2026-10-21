import { state } from '../state.js';
import { isSpanishEngine } from '../i18n.js';

export function showResults() {
  const modal = document.getElementById('results-modal');
  const winnerText = document.getElementById('winner-announcement');
  const analysisText = document.getElementById('analysis-text');
  const isSpanish = isSpanishEngine();

  document.getElementById('modal-title-text').innerText = isSpanish ? "RESULTADOS FINALES" : "FINAL RESULTS";
  document.getElementById('analysis-section-title').innerText = isSpanish ? "ANÁLISIS DE CONOCIMIENTO" : "KNOWLEDGE ANALYSIS";
  document.getElementById('btn-modal-restart').innerText = isSpanish ? "Nuevo Juego / Configuración" : "New Game / Setup";

  state.players.forEach(p => {
    p.totalScore = state.cardScores.reduce((acc, card) => acc + (card.scores[p.id] || 0), 0);
  });

  const ranked = [...state.players].sort((a, b) => b.totalScore - a.totalScore);
  const topScore = ranked[0].totalScore;
  const winners = ranked.filter(p => p.totalScore === topScore);

  if (winners.length === 1) {
    winnerText.innerHTML = `
      <span style="color:${winners[0].color};">${winners[0].name.toUpperCase()} ${isSpanish ? 'GANA EL JUEGO!' : 'WINS THE GAME!'}</span><br>
      <small style="font-size:0.95rem; color:#fff;">Score: ${winners[0].totalScore} pts</small>
    `;
  } else {
    const winnerNames = winners.map(w => `<span style="color:${w.color};">${w.name}</span>`).join(' & ');
    winnerText.innerHTML = `
      <span>${isSpanish ? '¡EMPATE!' : 'TIE GAME!'}</span><br>
      <small style="font-size:0.95rem; color:#fff;">${winnerNames} ${isSpanish ? 'con' : 'with'} ${topScore} pts</small>
    `;
  }

  let rankingHTML = '<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:15px;">';
  ranked.forEach((p, idx) => {
    rankingHTML += `
      <div style="display:flex; justify-content:space-between; font-size:0.9rem; padding:4px 0; border-bottom:1px solid #252938;">
        <span><strong>#${idx + 1}</strong> <span style="color:${p.color};">${p.name}</span></span>
        <strong>${p.totalScore} pts</strong>
      </div>
    `;
  });
  rankingHTML += '</div>';

  const catStats = {};
  state.cardScores.forEach(card => {
    if (!catStats[card.category]) catStats[card.category] = {};
    state.players.forEach(p => {
      if (!catStats[card.category][p.id]) catStats[card.category][p.id] = 0;
      catStats[card.category][p.id] += card.scores[p.id];
    });
  });

  let categoryHTML = "";
  for (const [cat, pScores] of Object.entries(catStats)) {
    let maxCatScore = -999;
    let catWinners = [];
    state.players.forEach(p => {
      const score = pScores[p.id] || 0;
      if (score > maxCatScore) {
        maxCatScore = score;
        catWinners = [p];
      } else if (score === maxCatScore && score > 0) {
        catWinners.push(p);
      }
    });

    let domainStr = isSpanish ? "Empate" : "Tie";
    if (maxCatScore > 0) {
      domainStr = catWinners.map(w => `<span style="color:${w.color}">${w.name}</span>`).join(' & ');
    }

    categoryHTML += `
      <div style="margin-bottom: 8px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <strong>${cat}:</strong>
        <span>${isSpanish ? 'Líder' : 'Leader'}: ${domainStr}</span>
      </div>
    `;
  }

  analysisText.innerHTML = `
    <p style="margin-bottom:8px;"><strong>${isSpanish ? 'Tabla General:' : 'Overall Rankings:'}</strong></p>
    ${rankingHTML}
    <p style="margin-bottom:8px;"><strong>${isSpanish ? 'Dominio por Categoría:' : 'Category Dominance:'}</strong></p>
    ${categoryHTML}
  `;

  modal.classList.add('active');
}

export function returnToSetup() {
  document.getElementById('results-modal').classList.remove('active');
  document.getElementById('game-interface').style.display = 'none';
  document.getElementById('setup-screen').style.display = 'block';
}