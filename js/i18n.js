import { renderPlayerInputs } from './ui/setupUI.js';

export function isSpanishEngine() {
  const select = document.getElementById('engine-selector');
  return select ? select.value === 'gemini_es' : true;
}

export function handleEngineChange() {
  const isSpanish = isSpanishEngine();
  const keyBox = document.getElementById('api-key-container');

  if (isSpanish) {
    keyBox.classList.add('active');
    document.getElementById('lbl-setup-subtitle').innerText = "Sistema de Trivia Multijugador y Doble Motor";
    document.getElementById('lbl-engine').innerText = "Servidor e Idioma";
    document.getElementById('lbl-api-key').innerText = "Gemini API Key (Para Español)";
    document.getElementById('lbl-api-hint').innerHTML = 'Se guarda automáticamente en tu navegador. Consigue tu clave gratis en <a href="https://aistudio.google.com" target="_blank" style="color:#70d6ff;">aistudio.google.com</a>.';
    document.getElementById('lbl-player-count').innerText = "Cantidad de Jugadores";
    
    document.getElementById('opt-p1').innerText = "1 Jugador";
    document.getElementById('opt-p2').innerText = "2 Jugadores";
    document.getElementById('opt-p3').innerText = "3 Jugadores";
    document.getElementById('opt-p4').innerText = "4 Jugadores";
    document.getElementById('opt-p5').innerText = "5 Jugadores";

    document.getElementById('lbl-players-section').innerText = "Configuración de Jugadores";
    document.getElementById('lbl-game-section').innerText = "Parámetros de Juego";
    document.getElementById('lbl-difficulty').innerText = "Dificultad";

    document.getElementById('opt-diff-all').innerText = "Todas / Mixto";
    document.getElementById('opt-diff-easy').innerText = "Fácil";
    document.getElementById('opt-diff-medium').innerText = "Medio";
    document.getElementById('opt-diff-hard').innerText = "Difícil";

    document.getElementById('lbl-cards-count').innerText = "Cantidad de Tarjetas";
    document.getElementById('lbl-categories-section').innerText = "Seleccionar Categorías";
    document.getElementById('lbl-cat-hint').innerText = "Elige una, varias o todas";
    document.getElementById('btn-toggle-all').innerText = "Marcar/Desmarcar Todas";
    document.getElementById('start-btn').innerText = "¡Iniciar Nuevo Juego!";

    updateCatLabel('music', 'Música');
    updateCatLabel('film', 'Cine y Series');
    updateCatLabel('geography', 'Geografía');
    updateCatLabel('history', 'Historia');
    updateCatLabel('science', 'Ciencia');
    updateCatLabel('general', 'Cultura General');
    updateCatLabel('food', 'Gastronomía');
    updateCatLabel('sports', 'Deportes');
    updateCatLabel('pop', 'Cultura Pop');
    updateCatLabel('art', 'Arte y Lit.');
  } else {
    keyBox.classList.remove('active');
    document.getElementById('lbl-setup-subtitle').innerText = "Multi-Player & Dual Engine Trivia System";
    document.getElementById('lbl-engine').innerText = "Language & Engine Server";
    document.getElementById('lbl-player-count').innerText = "Number of Players";

    document.getElementById('opt-p1').innerText = "1 Player";
    document.getElementById('opt-p2').innerText = "2 Players";
    document.getElementById('opt-p3').innerText = "3 Players";
    document.getElementById('opt-p4').innerText = "4 Players";
    document.getElementById('opt-p5').innerText = "5 Players";

    document.getElementById('lbl-players-section').innerText = "Players Setup";
    document.getElementById('lbl-game-section').innerText = "Game Parameters";
    document.getElementById('lbl-difficulty').innerText = "Difficulty";

    document.getElementById('opt-diff-all').innerText = "All / Mixed";
    document.getElementById('opt-diff-easy').innerText = "Easy";
    document.getElementById('opt-diff-medium').innerText = "Medium";
    document.getElementById('opt-diff-hard').innerText = "Hard";

    document.getElementById('lbl-cards-count').innerText = "Cards Count";
    document.getElementById('lbl-categories-section').innerText = "Select Categories";
    document.getElementById('lbl-cat-hint').innerText = "Choose one, multiple, or all";
    document.getElementById('btn-toggle-all').innerText = "Toggle All";
    document.getElementById('start-btn').innerText = "Start New Game!";

    updateCatLabel('music', 'Music');
    updateCatLabel('film', 'Film & TV');
    updateCatLabel('geography', 'Geography');
    updateCatLabel('history', 'History');
    updateCatLabel('science', 'Science');
    updateCatLabel('general', 'General Knowledge');
    updateCatLabel('food', 'Food & Drink');
    updateCatLabel('sports', 'Sports');
    updateCatLabel('pop', 'Pop Culture');
    updateCatLabel('art', 'Arts & Lit');
  }
  renderPlayerInputs();
}

function updateCatLabel(key, text) {
  const elem = document.querySelector(`.cat-label[data-cat="${key}"]`);
  if (elem) elem.innerText = text;
}