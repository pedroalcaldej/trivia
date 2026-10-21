import { state } from '../state.js';
import { isSpanishEngine } from '../i18n.js';
import { playClickSound, playWindSound } from '../audio.js';

export function buildDynamicBoardAndControls() {
  const sbContainer = document.getElementById('scoreboard-container');
  sbContainer.innerHTML = '';
  state.players.forEach(p => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.style.borderTop = `4px solid ${p.color}`;
    card.innerHTML = `
      <div class="player-name" style="color:${p.color};">${p.name}</div>
      <div class="secret-score">??? PTS</div>
    `;
    sbContainer.appendChild(card);
  });

  const isSpanish = isSpanishEngine();
  const controlsContainer = document.getElementById('scoring-controls-container');
  controlsContainer.innerHTML = '';
  state.players.forEach(p => {
    const group = document.createElement('div');
    group.className = 'scoring-group';
    group.innerHTML = `
      <div class="scoring-label" style="color:${p.color};">${p.name}</div>
      <div class="btn-row">
        <button class="score-btn btn-sub" id="btn-sub-${p.id}">-1</button>
        <button class="score-btn" id="btn-add-${p.id}" style="background:${p.color}; color:#0d0e12;">+1</button>
      </div>
      <div class="card-history" id="status-p${p.id}">${isSpanish ? 'Pts tarjeta:' : 'Card pts:'} 0</div>
    `;
    controlsContainer.appendChild(group);

    // Scoring Listeners
    group.querySelector(`#btn-sub-${p.id}`).addEventListener('click', (e) => addPoint(p.id, -1, e));
    group.querySelector(`#btn-add-${p.id}`).addEventListener('click', (e) => addPoint(p.id, 1, e));
  });
}

export function updateCardUI() {
  const q = state.currentDeck[state.currentIndex];
  const isSpanish = isSpanishEngine();

  document.getElementById('card-tracker').innerText = isSpanish 
    ? `TARJETA ${state.currentIndex + 1} DE ${state.currentDeck.length}` 
    : `CARD ${state.currentIndex + 1} OF ${state.currentDeck.length}`;

  document.getElementById('btn-menu').innerText = isSpanish ? "Menú Principal" : "Main Menu";
  document.getElementById('btn-prev').innerText = isSpanish ? "Anterior" : "Previous";
  document.getElementById('btn-next').innerText = isSpanish ? "Siguiente" : "Next";
  document.getElementById('btn-finish').innerText = isSpanish ? "Ver Ganador" : "See Winner";

  document.getElementById('card-category').innerText = q.category;
  document.getElementById('card-question-text').innerText = q.question;
  document.getElementById('card-answer').innerText = q.answer;

  document.getElementById('card-footer-front').innerText = isSpanish ? "Toca la tarjeta para voltear y ver la respuesta" : "Tap card to flip & reveal answer";
  document.getElementById('card-back-badge').innerText = isSpanish ? "RESPUESTA CORRECTA" : "ANSWER REVEAL";
  document.getElementById('card-answer-label').innerText = isSpanish ? "Respuesta Correcta" : "Correct Answer";
  document.getElementById('card-footer-back').innerText = isSpanish ? "Toca para volver al frente" : "Tap card to flip back";

  const optionsContainer = document.getElementById('card-options');
  optionsContainer.innerHTML = '';
  if (q.options && q.options.length > 0) {
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option-item';
      optDiv.innerHTML = `<span class="option-letter">${letters[idx] || ''}:</span> <span>${opt}</span>`;
      optionsContainer.appendChild(optDiv);
    });
  }

  document.getElementById('flashcard').classList.remove('flipped');

  state.players.forEach(p => {
    const score = state.cardScores[state.currentIndex].scores[p.id] || 0;
    const statusElem = document.getElementById(`status-p${p.id}`);
    if (statusElem) {
      statusElem.innerText = isSpanish 
        ? `Pts tarjeta: ${score}` 
        : `Card pts: ${score}`;
    }

    const btnAdd = document.getElementById(`btn-add-${p.id}`);
    const btnSub = document.getElementById(`btn-sub-${p.id}`);
    if (btnAdd && btnSub) {
      btnAdd.disabled = (score >= 1);
      btnSub.disabled = (score <= -1);
    }
  });

  document.getElementById('btn-prev').disabled = state.currentIndex === 0;
  document.getElementById('btn-next').disabled = state.currentIndex === state.currentDeck.length - 1;
}

export function flipCard() {
  playWindSound();
  document.getElementById('flashcard').classList.toggle('flipped');
}

export function addPoint(playerId, amount, event) {
  if (event) event.stopPropagation();

  const currentScore = state.cardScores[state.currentIndex].scores[playerId] || 0;
  const newScore = currentScore + amount;

  if (newScore < -1 || newScore > 1) return;

  state.cardScores[state.currentIndex].scores[playerId] = newScore;
  playClickSound(amount > 0 ? 'add' : 'sub');
  updateCardUI();
}