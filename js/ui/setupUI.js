import { DEFAULT_COLORS, DEFAULT_NAMES_ES, DEFAULT_NAMES_EN, state } from '../state.js';
import { isSpanishEngine } from '../i18n.js';

export function renderPlayerInputs() {
  const count = parseInt(document.getElementById('player-count-select').value, 10);
  const isSpanish = isSpanishEngine();
  const defaultNames = isSpanish ? DEFAULT_NAMES_ES : DEFAULT_NAMES_EN;
  const container = document.getElementById('players-inputs-container');
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const pName = defaultNames[i];
    const pColor = DEFAULT_COLORS[i];

    const pBox = document.createElement('div');
    pBox.className = 'player-setup-box';
    pBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <label style="font-size:0.75rem; font-weight:700; color:#a0a5b5;">${isSpanish ? 'JUGADOR' : 'PLAYER'} ${i + 1}</label>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <input type="text" class="input-text p-name-input" data-index="${i}" value="${pName}">
        <div class="color-picker-row" id="color-picker-p${i}">
          ${DEFAULT_COLORS.map(c => `
            <div class="color-opt ${c === pColor ? 'selected' : ''}" 
                 style="background:${c};" 
                 data-color="${c}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.appendChild(pBox);
  }

  // Color picker events
  container.querySelectorAll('.color-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      const parent = e.target.parentElement;
      parent.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });
}

export function toggleAllCategories() {
  const checkboxes = document.querySelectorAll('#categories-container input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => cb.checked = !allChecked);
}

export function startLoadingAnimation(isSpanish) {
  const box = document.getElementById('loading-status-box');
  const textElem = document.getElementById('loading-status-text');
  const fillElem = document.getElementById('progress-bar-fill');

  box.style.display = 'block';
  fillElem.style.width = '10%';

  const stages = isSpanish ? [
    { progress: 25, text: "Conectando con Google Gemini..." },
    { progress: 55, text: "Redactando preguntas y opciones en español..." },
    { progress: 85, text: "Mezclando alternativas y preparando tarjetas..." }
  ] : [
    { progress: 30, text: "Connecting to The Trivia API..." },
    { progress: 65, text: "Fetching questions and options..." },
    { progress: 90, text: "Preparing flashcard deck..." }
  ];

  let currentStage = 0;
  textElem.innerText = stages[0].text;
  fillElem.style.width = stages[0].progress + '%';

  if (state.progressTimer) clearInterval(state.progressTimer);
  state.progressTimer = setInterval(() => {
    currentStage++;
    if (currentStage < stages.length) {
      textElem.innerText = stages[currentStage].text;
      fillElem.style.width = stages[currentStage].progress + '%';
    }
  }, 1400);
}

export function stopLoadingAnimation() {
  if (state.progressTimer) clearInterval(state.progressTimer);
  const fillElem = document.getElementById('progress-bar-fill');
  fillElem.style.width = '100%';
  setTimeout(() => {
    document.getElementById('loading-status-box').style.display = 'none';
    fillElem.style.width = '0%';
  }, 300);
}