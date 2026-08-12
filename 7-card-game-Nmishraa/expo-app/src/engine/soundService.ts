/**
 * SoundService — Procedural Web Audio API sound effects for the 7 Card Game.
 * No external audio files required; all sounds are synthesized in real-time.
 */

let audioCtx: AudioContext | null = null;
let _muted = false;

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
};

export const setMuted = (muted: boolean) => { _muted = muted; };
export const isMuted = () => _muted;

// ── Card Select / Toggle ─────────────────────────────────────────────────────
export const playCardSelect = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(1320, t + 0.06);
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
};

// ── Card Deselect ────────────────────────────────────────────────────────────
export const playCardDeselect = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1100, t);
  osc.frequency.exponentialRampToValueAtTime(660, t + 0.08);
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.08);
};

// ── Card Discard (swoosh) ────────────────────────────────────────────────────
export const playDiscard = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  // White noise swoosh
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(3000, t);
  bandpass.frequency.exponentialRampToValueAtTime(800, t + 0.15);
  bandpass.Q.value = 1.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  source.connect(bandpass).connect(gain).connect(ctx.destination);
  source.start(t);
};

// ── Draw Card (pick from deck) ───────────────────────────────────────────────
export const playDraw = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.18);
};

// ── Your Turn Notification ───────────────────────────────────────────────────
export const playYourTurn = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + i * 0.1);
    gain.gain.setValueAtTime(0, t + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, t + i * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.1);
    osc.stop(t + i * 0.1 + 0.25);
  });
};

// ── Call Least ───────────────────────────────────────────────────────────────
export const playCallLeast = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const notes = [440, 554.37, 659.25, 880]; // A4-C#5-E5-A5 rising arpeggio
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t + i * 0.08);
    gain.gain.setValueAtTime(0, t + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.07, t + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.2);
  });
};

// ── Round End ────────────────────────────────────────────────────────────────
export const playRoundEnd = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5-E5-G5-C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + i * 0.12);
    gain.gain.setValueAtTime(0, t + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.15, t + i * 0.12 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.12);
    osc.stop(t + i * 0.12 + 0.5);
  });
};

// ── Game Over Fanfare ────────────────────────────────────────────────────────
export const playGameOver = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  // Triumphant fanfare: C-E-G-C octave with harmonics
  const chords = [
    { freq: 261.63, delay: 0 },
    { freq: 329.63, delay: 0.15 },
    { freq: 392.00, delay: 0.30 },
    { freq: 523.25, delay: 0.45 },
    { freq: 659.25, delay: 0.60 },
    { freq: 783.99, delay: 0.75 },
  ];
  chords.forEach(({ freq, delay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + delay);
    gain.gain.setValueAtTime(0, t + delay);
    gain.gain.linearRampToValueAtTime(0.12, t + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.8);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + delay);
    osc.stop(t + delay + 0.8);
  });
};

// ── Button Press (generic) ──────────────────────────────────────────────────
export const playButtonPress = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.06);
};

// ── Error / Invalid ─────────────────────────────────────────────────────────
export const playError = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.setValueAtTime(150, t + 0.1);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
};

// ── Chat Message ────────────────────────────────────────────────────────────
export const playChatMessage = () => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.08);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
};
