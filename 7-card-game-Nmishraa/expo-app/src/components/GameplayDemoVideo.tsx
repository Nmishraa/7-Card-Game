import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import {
  playCardSelect,
  playDiscard,
  playDraw,
  playYourTurn,
  playCallLeast,
  playRoundEnd,
  unlockMobileAudio
} from '../engine/soundService';

interface Props {
  style?: any;
}

export const GameplayDemoVideo: React.FC<Props> = ({ style }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<any>(null);
  const pendingAudioTimersRef = useRef<NodeJS.Timeout[]>([]);
  const lastPlayedStepKeyRef = useRef<string | null>(null);

  const isMutedRef = useRef<boolean>(isMuted);
  isMutedRef.current = isMuted;

  const STEPS = [
    {
      title: "Step 1: Select Cards & Discard",
      desc: "Select valid sets (same rank) or runs (same suit sequence). Click Discard.",
      voiceText: "Step 1: Select cards to discard. Drop heavy points like 5, 6, and 7 of hearts to cut your hand score fast.",
      activePlayer: "You (Turn)",
      banner: "⚡ YOUR TURN: Select cards to Discard",
      hand: [
        { rank: '5', suit: '♥', isRed: true, selected: true },
        { rank: '6', suit: '♥', isRed: true, selected: true },
        { rank: '7', suit: '♥', isRed: true, selected: true },
        { rank: '9', suit: '♣', isRed: false, selected: false },
        { rank: 'J', suit: '♠', isRed: false, selected: false },
      ],
      discardTop: { rank: 'K', suit: '♠', isRed: false },
      actionText: "Discarding 5♥ 6♥ 7♥ (Sequence)...",
      scores: { you: 12, bot: 29 }
    },
    {
      title: "Step 2: Draw a Card",
      desc: "After discarding, draw 1 card from the face-down Deck or top Discard card.",
      voiceText: "Step 2: Draw a card. Pick 1 replacement card from the secret deck or face-up discard pile.",
      activePlayer: "You (Turn)",
      banner: "🎴 DRAW PHASE: Pick from Secret Deck or Open Discard",
      hand: [
        { rank: '9', suit: '♣', isRed: false, selected: false },
        { rank: 'J', suit: '♠', isRed: false, selected: false },
      ],
      discardTop: { rank: '7', suit: '♥', isRed: true },
      actionText: "Drawing 1 card from Secret Deck...",
      scores: { you: 12, bot: 29 }
    },
    {
      title: "Step 3: Turn Switches to Opponent",
      desc: "Turn changes automatically in real time. Opponent plays their turn.",
      voiceText: "Step 3: Turn switches to opponent. AlphaBot discards a card and draws.",
      activePlayer: "AlphaBot 🤖 (Turn)",
      banner: "⏳ AlphaBot 🤖 is thinking & taking turn...",
      hand: [
        { rank: '2', suit: '♦', isRed: true, selected: false },
        { rank: '9', suit: '♣', isRed: false, selected: false },
        { rank: 'J', suit: '♠', isRed: false, selected: false },
      ],
      discardTop: { rank: 'Q', suit: '♦', isRed: true },
      actionText: "AlphaBot discarded Q♦ and drew 1 card",
      scores: { you: 12, bot: 29 }
    },
    {
      title: "Step 4: Call LEAST! when your points are low",
      desc: "When your card total is 10 points or less, click LEAST! to claim victory.",
      voiceText: "Step 4: Call LEAST when your points are 10 or less to win the round!",
      activePlayer: "You (Turn)",
      banner: "🏆 YOUR TURN: Hand total is 2 pts! Click LEAST!",
      hand: [
        { rank: 'A', suit: '♠', isRed: false, selected: false },
        { rank: 'A', suit: '♥', isRed: true, selected: false },
      ],
      discardTop: { rank: '4', suit: '♣', isRed: false },
      actionText: "CALLING LEAST! (Total Hand Score: 2 pts)",
      scores: { you: 2, bot: 29 }
    },
    {
      title: "Step 5: Round Over & Final Scores",
      desc: "Lowest score wins 0 points. Caller with lowest score wins round!",
      voiceText: "Step 5: Round over! Lowest score wins 0 points and takes the round!",
      activePlayer: "Round Complete",
      banner: "🎉 YOU WON THE ROUND! (0 pts awarded to Winner)",
      hand: [
        { rank: 'A', suit: '♠', isRed: false, selected: false },
        { rank: 'A', suit: '♥', isRed: true, selected: false },
      ],
      discardTop: { rank: '4', suit: '♣', isRed: false },
      actionText: "🏆 ROUND WINNER: You (0 pts) | AlphaBot: 29 pts",
      scores: { you: 0, bot: 29 }
    }
  ];

  const stopStepAudio = () => {
    pendingAudioTimersRef.current.forEach(t => clearTimeout(t));
    pendingAudioTimersRef.current = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe fallback
      }
    }
  };

  useEffect(() => {
    return () => {
      stopStepAudio();
    };
  }, []);

  const triggerStepAudio = (stepIndex: number) => {
    stopStepAudio();
    if (isMutedRef.current) return;

    unlockMobileAudio();

    try {
      if (stepIndex === 0) {
        playYourTurn();
        const t = setTimeout(() => playDiscard(), 350);
        pendingAudioTimersRef.current.push(t);
      } else if (stepIndex === 1) {
        playDraw();
      } else if (stepIndex === 2) {
        playCardSelect();
        const t = setTimeout(() => playDiscard(), 350);
        pendingAudioTimersRef.current.push(t);
      } else if (stepIndex === 3) {
        playCallLeast();
      } else if (stepIndex === 4) {
        playRoundEnd();
      }
    } catch {
      // Audio safe fallback
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(STEPS[stepIndex].voiceText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const engVoice = voices.find(v => v.lang.startsWith('en'));
          if (engVoice) utterance.voice = engVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech safe fallback
      }
    }
  };

  useEffect(() => {
    const playKey = `${currentStep}_${isPlaying}_${isMuted}`;
    if (isPlaying && !isMuted) {
      if (lastPlayedStepKeyRef.current !== playKey) {
        lastPlayedStepKeyRef.current = playKey;
        triggerStepAudio(currentStep);
      }
    } else {
      stopStepAudio();
      lastPlayedStepKeyRef.current = null;
    }
  }, [currentStep, isPlaying, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(s => {
              if (s >= STEPS.length - 1) {
                stopStepAudio();
                setIsPlaying(false);
                return 0;
              }
              return s + 1;
            });
            return 0;
          }
          return prev + 4;
        });
      }, 350);
    } else {
      stopStepAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handlePlayDemo = () => {
    unlockMobileAudio();
    setIsPlaying(true);
    setProgress(0);
    setCurrentStep(0);
    lastPlayedStepKeyRef.current = null;
    if (!isMutedRef.current) {
      triggerStepAudio(0);
    }
  };

  const handlePause = () => {
    stopStepAudio();
    setIsPlaying(false);
  };

  const handleStepSelect = (idx: number) => {
    unlockMobileAudio();
    stopStepAudio();
    lastPlayedStepKeyRef.current = null;
    setCurrentStep(idx);
    setProgress(0);
    if (isPlaying && !isMutedRef.current) {
      triggerStepAudio(idx);
    }
  };

  const toggleSound = () => {
    unlockMobileAudio();
    const next = !isMuted;
    setIsMuted(next);
    isMutedRef.current = next;
    if (next) {
      stopStepAudio();
      lastPlayedStepKeyRef.current = null;
    } else {
      lastPlayedStepKeyRef.current = null;
      if (isPlaying) {
        triggerStepAudio(currentStep);
      }
    }
  };

  const activeStepData = STEPS[currentStep];

  return (
    <View style={[styles.container, style]}>
      {/* Heading & Subtitle */}
      <View style={styles.headingBox}>
        <Text style={styles.headingTitle}>See How 7 Cards Least Works</Text>
        <Text style={styles.headingSubtitle}>Watch a quick gameplay demo before you start playing.</Text>
      </View>

      {/* Main Video Frame */}
      <View style={styles.videoFrame}>
        {!isPlaying && currentStep === 0 && progress === 0 ? (
          /* Thumbnail Poster Mode with Play Button */
          <View style={styles.thumbnailContainer}>
            {/* Background Simulated Table */}
            <View style={styles.tableRailOuter}>
              <View style={styles.tableRailInner}>
                <View style={styles.feltTable}>
                  <View style={styles.feltSeam} />
                  {/* Piles */}
                  <View style={styles.pilesRow}>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>JOKER</Text>
                      <View style={[styles.miniCard, styles.jokerGlow]}>
                        <Text style={styles.jokerBadge}>★ JOKER</Text>
                        <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                        <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                      </View>
                    </View>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DECK</Text>
                      <View style={styles.deckCardBack} />
                    </View>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DISCARD</Text>
                      <View style={styles.miniCard}>
                        <Text style={[styles.cardRank, { color: '#0f172a' }]}>10</Text>
                        <Text style={[styles.cardSuit, { color: '#0f172a' }]}>♠</Text>
                      </View>
                    </View>
                  </View>

                  {/* Fanned Cards */}
                  <View style={styles.handRow}>
                    {STEPS[0].hand.map((c, i) => (
                      <View key={i} style={[styles.miniCard, { marginLeft: i === 0 ? 0 : -8 }]}>
                        <Text style={[styles.cardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                        <Text style={[styles.cardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Play Button Overlay */}
            <View style={styles.playOverlay}>
              <TouchableOpacity style={styles.playBtn} onPress={handlePlayDemo} activeOpacity={0.85}>
                <Text style={styles.playBtnIcon}>▶</Text>
                <Text style={styles.playBtnText}>Play Demo</Text>
              </TouchableOpacity>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>⏱️ 45-Sec Gameplay Demo</Text>
                <TouchableOpacity onPress={toggleSound} activeOpacity={0.8} style={styles.audioBadgeBtn}>
                  <Text style={styles.badgeText}>{isMuted ? '🔇 Sound Off' : '🔊 Sound On'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* Active Playing Demo View */
          <View style={styles.activeDemoContainer}>
            {/* Top Step Header */}
            <View style={styles.demoTopBar}>
              <View style={styles.headerTitleRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{activeStepData.title}</Text>
                </View>
                <TouchableOpacity onPress={toggleSound} activeOpacity={0.8} style={[styles.topAudioBtn, !isMuted && styles.topAudioBtnActive]}>
                  <Text style={styles.topAudioBtnText}>{isMuted ? '🔇 Sound: Off' : '🔊 Sound: ON'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.stepDescText}>{activeStepData.desc}</Text>
            </View>

            {/* Active Table Screen */}
            <View style={styles.tableRailOuter}>
              <View style={styles.tableRailInner}>
                <View style={styles.feltTable}>
                  <View style={styles.feltSeam} />

                  {/* Opponent Header */}
                  <View style={styles.opponentRow}>
                    <View style={[styles.avatarBox, activeStepData.activePlayer.includes('AlphaBot') && styles.activeAvatar]}>
                      <Text style={styles.avatarText}>🤖</Text>
                    </View>
                    <View>
                      <Text style={styles.opponentNameText}>AlphaBot 🤖</Text>
                      <Text style={styles.opponentScoreText}>Score: {activeStepData.scores.bot} pts</Text>
                    </View>
                  </View>

                  {/* Center Piles */}
                  <View style={styles.pilesRow}>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>JOKER (0 pts)</Text>
                      <View style={[styles.miniCard, styles.jokerGlow]}>
                        <Text style={styles.jokerBadge}>★ JOKER</Text>
                        <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                        <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                      </View>
                    </View>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DECK</Text>
                      <View style={styles.deckCardBack} />
                    </View>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DISCARD</Text>
                      <View style={styles.miniCard}>
                        <Text style={[styles.cardRank, { color: activeStepData.discardTop.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardTop.rank}</Text>
                        <Text style={[styles.cardSuit, { color: activeStepData.discardTop.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardTop.suit}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Banner */}
                  <View style={styles.actionBanner}>
                    <Text style={styles.actionBannerText}>⚡ {activeStepData.actionText}</Text>
                  </View>

                  {/* Player Hand */}
                  <View style={styles.playerDock}>
                    <Text style={styles.handTitle}>Your Hand (Score: {activeStepData.scores.you} pts):</Text>
                    <View style={styles.handRow}>
                      {activeStepData.hand.map((c, i) => (
                        <View key={i} style={[styles.miniCard, c.selected && styles.cardSelected, { marginLeft: i === 0 ? 0 : -8 }]}>
                          <Text style={[styles.cardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                          <Text style={[styles.cardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Controls & Timeline Bar */}
            <View style={styles.controlsBar}>
              <View style={styles.leftControlsGroup}>
                <TouchableOpacity style={styles.controlBtn} onPress={isPlaying ? handlePause : handlePlayDemo}>
                  <Text style={styles.controlBtnText}>{isPlaying ? '⏸ Pause' : '▶ Play'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.soundControlBtn, !isMuted && styles.soundControlBtnActive]} onPress={toggleSound}>
                  <Text style={styles.soundControlBtnText}>{isMuted ? '🔇 Sound: Off' : '🔊 Sound: ON'}</Text>
                </TouchableOpacity>
              </View>

              {/* Step Navigation Pills */}
              <View style={styles.stepsNavRow}>
                {STEPS.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.stepPill, currentStep === idx && styles.stepPillActive]}
                    onPress={() => handleStepSelect(idx)}
                  >
                    <Text style={[styles.stepPillText, currentStep === idx && styles.stepPillTextActive]}>Step {idx + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headingBox: {
    alignItems: 'center',
    marginBottom: 14,
  },
  headingTitle: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headingSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },

  videoFrame: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    backgroundColor: '#0f172a',
    elevation: 12,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  thumbnailContainer: {
    position: 'relative',
    width: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  playBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#60a5fa',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  playBtnIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  /* Active Demo Layout */
  activeDemoContainer: {
    padding: 12,
    backgroundColor: '#0f172a',
  },
  demoTopBar: {
    marginBottom: 10,
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  stepBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  stepDescText: {
    color: '#cbd5e1',
    fontSize: 12,
    textAlign: 'center',
  },

  tableRailOuter: {
    backgroundColor: '#351203',
    padding: 8,
    borderRadius: 16,
  },
  tableRailInner: {
    backgroundColor: '#4d1904',
    padding: 4,
    borderRadius: 12,
  },
  feltTable: {
    backgroundColor: '#065f28',
    borderRadius: 10,
    padding: 12,
    position: 'relative',
    minHeight: 220,
    justifyContent: 'space-between',
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
  },

  opponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  activeAvatar: {
    borderColor: '#4ade80',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 14,
  },
  opponentNameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  opponentScoreText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: 'bold',
  },

  pilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 10,
  },
  pileCol: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 3,
  },
  miniCard: {
    width: 44,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    transform: [{ translateY: -8 }],
  },
  jokerGlow: {
    borderColor: '#fbbf24',
    borderWidth: 2,
  },
  jokerBadge: {
    fontSize: 6,
    color: '#d97706',
    fontWeight: '900',
  },
  cardRank: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardSuit: {
    fontSize: 14,
  },
  deckCardBack: {
    width: 44,
    height: 60,
    backgroundColor: '#1e3a8a',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  actionBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#facc15',
    alignSelf: 'center',
    marginVertical: 6,
  },
  actionBannerText: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  playerDock: {
    alignItems: 'center',
    marginTop: 4,
  },
  handTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  handRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  controlBtn: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controlBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepsNavRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  stepPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepPillActive: {
    backgroundColor: '#facc15',
    borderColor: '#facc15',
  },
  stepPillText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepPillTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },

  /* Sound speaker toggle styles */
  audioBadgeBtn: {
    marginLeft: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  topAudioBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topAudioBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#22c55e',
  },
  topAudioBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leftControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soundControlBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  soundControlBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#22c55e',
  },
  soundControlBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
