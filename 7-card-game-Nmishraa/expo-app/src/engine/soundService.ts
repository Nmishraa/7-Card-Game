/**
 * SoundService — Procedural Web Audio API sound effects for the 7 Card Game.
 * No external audio files required; all sounds are synthesized in real-time.
 */

let audioCtx: AudioContext | null = null;
let _muted = false;

export const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch {
      return null;
    }
  }
  return audioCtx;
};

export const unlockMobileAudio = () => {
  if (typeof window === 'undefined') return;
  const ctx = getCtx();
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // safe fallback
    }
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch {}
  }
};

export const stopVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
};

export const speakVoice = (text: string) => {
  // Voice narration no-op fallback
};

const withAudioContext = (callback: (ctx: AudioContext) => void) => {
  if (typeof window === 'undefined' || _muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      try {
        if (!_muted) {
          callback(ctx);
        }
      } catch {
        // Safe audio fallback
      }
    }).catch(() => {});
  } else {
    try {
      callback(ctx);
    } catch {
      // Safe audio fallback
    }
  }
};

// Global click/touchstart listener to unlock audio on first interaction
if (typeof window !== 'undefined') {
  const handleGlobalUnlock = () => {
    unlockMobileAudio();
    if (audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('touchstart', handleGlobalUnlock);
      window.removeEventListener('touchend', handleGlobalUnlock);
      window.removeEventListener('click', handleGlobalUnlock);
    }
  };

  window.addEventListener('touchstart', handleGlobalUnlock, { passive: true });
  window.addEventListener('touchend', handleGlobalUnlock, { passive: true });
  window.addEventListener('click', handleGlobalUnlock, { passive: true });
}

export const setMuted = (muted: boolean) => { _muted = muted; };
export const isMuted = () => _muted;

// ── Card Select / Toggle ─────────────────────────────────────────────────────
export const playCardSelect = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.06);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    osc.start(t);
    osc.stop(t + 0.1);
  });
};

// ── Card Deselect ────────────────────────────────────────────────────────────
export const playCardDeselect = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.08);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    osc.start(t);
    osc.stop(t + 0.08);
  });
};

// ── Card Discard (crisp tactile slide & pop) ──────────────────────────────
export const playDiscard = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    
    // Crisp tone glide (card slap on felt)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.09);

    // Subtle crisp snap/click transient
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, t);
    clickOsc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    clickGain.gain.setValueAtTime(0.12, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    clickOsc.connect(clickGain).connect(ctx.destination);
    clickOsc.onended = () => {
      try { clickOsc.disconnect(); clickGain.disconnect(); } catch {}
    };

    clickOsc.start(t);
    clickOsc.stop(t + 0.03);
  });
};

// ── Draw Card (pick from deck) ───────────────────────────────────────────────
export const playDraw = () => {
  withAudioContext((ctx) => {
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
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    osc.start(t);
    osc.stop(t + 0.18);
  });
};

// ── Turn End Notification (0.35s pleasant notification sound) ──────────────
export const playTurnEnd = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Soft pleasant chime (E5 659Hz -> A5 880Hz)
    osc1.frequency.setValueAtTime(659.25, t);
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.12);

    osc2.frequency.setValueAtTime(1318.5, t + 0.12);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    let endedCount = 0;
    const cleanup = () => {
      endedCount++;
      if (endedCount >= 2) {
        try {
          osc1.disconnect();
          osc2.disconnect();
          gain.disconnect();
        } catch {}
      }
    };
    osc1.onended = cleanup;
    osc2.onended = cleanup;

    osc1.start(t);
    osc1.stop(t + 0.18);
    osc2.start(t + 0.12);
    osc2.stop(t + 0.35);
  });
};

// ── Your Turn Notification ───────────────────────────────────────────────────
export const playYourTurn = () => {
  withAudioContext((ctx) => {
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
      osc.onended = () => {
        try { osc.disconnect(); gain.disconnect(); } catch {}
      };
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.25);
    });
  });
};

// ── Call Least ───────────────────────────────────────────────────────────────
export const playCallLeast = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;

    // 6-note rising triumphant fanfare: C5 -> E5 -> G5 -> B5 -> C6 -> E6
    const notes = [
      { freq: 523.25, time: 0 },      // C5
      { freq: 659.25, time: 0.08 },   // E5
      { freq: 783.99, time: 0.16 },   // G5
      { freq: 987.77, time: 0.24 },   // B5
      { freq: 1046.50, time: 0.32 },  // C6
      { freq: 1318.51, time: 0.38 },  // E6 (sparkling climax)
    ];

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + time);

      gain.gain.setValueAtTime(0, t + time);
      gain.gain.linearRampToValueAtTime(0.1, t + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.38);

      osc.connect(gain).connect(ctx.destination);
      osc.onended = () => {
        try { osc.disconnect(); gain.disconnect(); } catch {}
      };

      osc.start(t + time);
      osc.stop(t + time + 0.38);
    });
  });
};

let lastTimerWarningMs = 0;
// ── Timer 5s Warning Sound ────────────────────────────────────────────────
export const playTimerWarning = () => {
  const now = Date.now();
  if (now - lastTimerWarningMs < 600) return;
  lastTimerWarningMs = now;

  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.08);
  });
};

// ── Round End ────────────────────────────────────────────────────────────────
export const playRoundEnd = () => {
  withAudioContext((ctx) => {
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
      osc.onended = () => {
        try { osc.disconnect(); gain.disconnect(); } catch {}
      };
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.5);
    });
  });
};

// ── Game Over Fanfare ────────────────────────────────────────────────────────
export const playGameOver = () => {
  withAudioContext((ctx) => {
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
      osc.onended = () => {
        try { osc.disconnect(); gain.disconnect(); } catch {}
      };
      osc.start(t + delay);
      osc.stop(t + delay + 0.8);
    });
  });
};

// ── Button Press (generic) ──────────────────────────────────────────────────
export const playButtonPress = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    osc.start(t);
    osc.stop(t + 0.06);
  });
};

// ── Error / Invalid ─────────────────────────────────────────────────────────
export const playError = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.setValueAtTime(150, t + 0.1);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    osc.start(t);
    osc.stop(t + 0.2);
  });
};

// ── Chat Message ────────────────────────────────────────────────────────────
export const playChatMessage = () => {
  withAudioContext((ctx) => {
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Soft dual-tone notification chime (G5 784Hz -> C6 1046Hz)
    osc1.frequency.setValueAtTime(783.99, t);
    osc2.frequency.setValueAtTime(1046.50, t + 0.07);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    let endedCount = 0;
    const cleanup = () => {
      endedCount++;
      if (endedCount >= 2) {
        try {
          osc1.disconnect();
          osc2.disconnect();
          gain.disconnect();
        } catch {}
      }
    };
    osc1.onended = cleanup;
    osc2.onended = cleanup;

    osc1.start(t);
    osc1.stop(t + 0.1);
    osc2.start(t + 0.07);
    osc2.stop(t + 0.22);
  });
};


