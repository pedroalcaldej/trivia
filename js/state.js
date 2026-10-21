export const DEFAULT_COLORS = ["#ff70a6", "#70d6ff", "#a06cd5", "#ff9f1c", "#2ec4b6"];
export const DEFAULT_NAMES_ES = ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4", "Jugador 5"];
export const DEFAULT_NAMES_EN = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"];

export const state = {
  players: [],
  currentDeck: [],
  currentIndex: 0,
  cardScores: [],
  progressTimer: null
};

export function resetGameData() {
  state.currentDeck = [];
  state.currentIndex = 0;
  state.cardScores = [];
}