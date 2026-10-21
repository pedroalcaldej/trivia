const KEY_GEMINI = 'gemini_api_key';

export function getSavedApiKey() {
  return localStorage.getItem(KEY_GEMINI) || '';
}

export function saveApiKeyLocally() {
  const input = document.getElementById('gemini-key-input');
  if (input) {
    const key = input.value.trim();
    if (key) {
      localStorage.setItem(KEY_GEMINI, key);
    }
  }
}