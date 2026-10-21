import { state, DEFAULT_COLORS, DEFAULT_NAMES_ES, DEFAULT_NAMES_EN } from './state.js';
import { getSavedApiKey, saveApiKeyLocally } from './storage.js';
import { handleEngineChange, isSpanishEngine } from './i18n.js';
import { playClickSound } from './audio.js';
import { fetchSpanishGeminiApi } from './api/gemini.js';
import { fetchEnglishTriviaApi } from './api/trivia-api.js';
import { renderPlayerInputs, toggleAllCategories, startLoadingAnimation, stopLoadingAnimation } from './ui/setupUI.js';
import { buildDynamicBoardAndControls, updateCardUI, flipCard } from './ui/gameUI.js';
import { showResults, returnToSetup } from './ui/modalUI.js';

// Global Bounce & Audio Click listener for buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, .color-opt, .category-item');
  if (btn) {
    playClickSound('btn');
    btn.classList.add('btn-clicked');
    setTimeout(() => btn.classList.remove('btn-clicked'), 120);
  }
});

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = getSavedApiKey();
  if (savedKey) {
    document.getElementById('gemini-key-input').value = savedKey;
  }

  // Event Listeners
  document.getElementById('engine-selector').addEventListener('change', handleEngineChange);
  document.getElementById('gemini-key-input').addEventListener('change', saveApiKeyLocally);
  document.getElementById('player-count-select').addEventListener('change', renderPlayerInputs);
  document.getElementById('btn-toggle-all').addEventListener('click', toggleAllCategories);
  document.getElementById('start-btn').addEventListener('click', startGame);

  // Game UI Listeners
  document.getElementById('flashcard-wrapper').addEventListener('click', flipCard);
  document.getElementById('btn-prev').addEventListener('click', prevCard);
  document.getElementById('btn-next').addEventListener('click', nextCard);
  document.getElementById('btn-menu').addEventListener('click', confirmReturnToMenu);
  document.getElementById('btn-finish').addEventListener('click', showResults);
  document.getElementById('btn-modal-restart').addEventListener('click', returnToSetup);

  handleEngineChange();
});

async function startGame() {
  const errorBox = document.getElementById('error-box');
  errorBox.style.display = 'none';

  const isSpanish = isSpanishEngine();
  const difficulty = document.getElementById('api-difficulty').value;
  const limit = document.getElementById('api-limit').value;
  const checkedCats = Array.from(document.querySelectorAll('#categories-container input[type="checkbox"]:checked')).map(cb => cb.value);

  if (checkedCats.length === 0) {
    errorBox.innerText = isSpanish ? "Por favor selecciona al menos una categoría." : "Please select at least one category.";
    errorBox.style.display = 'block';
    return;
  }

  const count = parseInt(document.getElementById('player-count-select').value, 10);
  const defaultNames = isSpanish ? DEFAULT_NAMES_ES : DEFAULT_NAMES_EN;
  state.players = [];
  const nameInputs = document.querySelectorAll('.p-name-input');

  for (let i = 0; i < count; i++) {
    const nameVal = nameInputs[i] ? nameInputs[i].value.trim() : defaultNames[i];
    const selectedColorOpt = document.querySelector(`#color-picker-p${i} .color-opt.selected`);
    const colorVal = selectedColorOpt ? selectedColorOpt.getAttribute('data-color') : DEFAULT_COLORS[i];

    state.players.push({
      id: i,
      name: nameVal || defaultNames[i],
      color: colorVal,
      totalScore: 0
    });
  }

  document.getElementById('start-btn').disabled = true;
  startLoadingAnimation(isSpanish);

  try {
    if (isSpanish) {
      const apiKey = document.getElementById('gemini-key-input').value.trim();
      if (!apiKey) {
        throw new Error("Ingresa tu clave de API de Gemini para jugar en Español.");
      }
      saveApiKeyLocally();
      state.currentDeck = await fetchSpanishGeminiApi(apiKey, limit, difficulty, checkedCats);
    } else {
      state.currentDeck = await fetchEnglishTriviaApi(limit, difficulty, checkedCats);
    }
  } catch (err) {
    console.error("Error al generar trivia:", err);
    stopLoadingAnimation();
    document.getElementById('start-btn').disabled = false;
    errorBox.innerText = err.message || "Error de conexión al servidor.";
    errorBox.style.display = 'block';
    return;
  }

  state.currentIndex = 0;
  state.cardScores = Array(state.currentDeck.length).fill(null).map((_, cardIdx) => {
    const pScores = {};
    state.players.forEach(p => pScores[p.id] = 0);
    return {
      category: state.currentDeck[cardIdx].category,
      scores: pScores
    };
  });

  buildDynamicBoardAndControls();

  stopLoadingAnimation();
  document.getElementById('start-btn').disabled = false;
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('game-interface').style.display = 'flex';

  updateCardUI();
}

function nextCard() {
  if (state.currentIndex < state.currentDeck.length - 1) {
    state.currentIndex++;
    updateCardUI();
  }
}

function prevCard() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    updateCardUI();
  }
}

function confirmReturnToMenu() {
  const isSpanish = isSpanishEngine();
  const msg = isSpanish 
    ? "¿Seguro que quieres salir al menú principal? La partida actual se reiniciará." 
    : "Are you sure you want to exit to the main menu? The current game will be reset.";

  if (confirm(msg)) {
    returnToSetup();
  }
}