let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playClickSound(type = 'add') {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const startFreq = type === 'add' ? 600 : (type === 'sub' ? 350 : 500);
    const endFreq = type === 'add' ? 900 : (type === 'sub' ? 200 : 700);

    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
}

export function playWindSound() {
  try {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 0.3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    filter.frequency.setValueAtTime(200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.3);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.12);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    whiteNoise.start();
    whiteNoise.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
}