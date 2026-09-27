import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { 
  playCardSelect, 
  playDiscard, 
  playDraw, 
  playYourTurn, 
  playCallLeast, 
  playRoundEnd 
} from '../engine/soundService';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  voiceText: string;
  highlightCard: string;
  actionText: string;
  botScore: number;
  yourScore: number;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: '1. The Deal & Goal',
    subtitle: '7 Cards per Player • Lowest Score Wins',
    badge: 'DEAL',
    description: 'Each player receives 7 cards. Number cards equal face value. J, Q, K are worth 10 points. 7 of Hearts and Spades are Wild JOKERS (0 pts)!',
    voiceText: 'Step 1: The Deal. Each player receives 7 cards. The goal is to get your score to 7 points or less to call LEAST!',
    highlightCard: 'ALL',
    actionText: 'Goal: Get your total score to 7 points or less to call LEAST!',
    botScore: 42,
    yourScore: 28,
  },
  {
    id: 2,
    title: '2. Discarding High Cards',
    subtitle: 'Drop heavy points to lower your hand score',
    badge: 'DISCARD',
    description: 'On your turn, discard heavy high-point cards (like King of Diamonds for 10 pts) into the face-up Discard Pile to cut your hand total fast.',
    voiceText: 'Step 2: Discarding High Cards. Drop heavy cards like Kings and 10s to lower your hand score quickly.',
    highlightCard: 'K♦',
    actionText: 'Action: Discard K♦ (10 pts) -> Hand drops from 28 to 18 pts!',
    botScore: 35,
    yourScore: 18,
  },
  {
    id: 3,
    title: '3. Drawing a New Card',
    subtitle: 'Pick from Secret Deck OR Face-up Discard Pile',
    badge: 'DRAW',
    description: 'After discarding, draw 1 card. You can draw blindly from the face-down Deck, or grab the top face-up Discard card if it improves your hand!',
    voiceText: 'Step 3: Drawing. After discarding, draw 1 card from the secret Deck or face-up Discard Pile.',
    highlightCard: '2♣',
    actionText: 'Action: Draw Ace of Spades (1 pt) from Deck -> Total drops to 12 pts!',
    botScore: 29,
    yourScore: 12,
  },
  {
    id: 4,
    title: '4. Discarding Multi-Card Sets & Jokers',
    subtitle: 'Drop multiple matching rank cards in 1 turn',
    badge: 'SET DISCARD',
    description: 'If you have matching rank cards (e.g. two 4s or three 3s), discard them together! Use Wild 7 Jokers (0 pts) to complete any matching set.',
    voiceText: 'Step 4: Discarding Sets. Drop matching rank cards like three 3s at once. Use Wild 7 Jokers worth 0 points!',
    highlightCard: '3♥ 3♦ 3♣',
    actionText: 'Action: Discard set of three 3s (9 pts) -> Total drops down to 3 pts!',
    botScore: 22,
    yourScore: 3,
  },
  {
    id: 5,
    title: '5. Declaring LEAST & Winning!',
    subtitle: 'Call LEAST when hand is 7 pts or less',
    badge: 'VICTORY',
    description: 'When your hand total is 7 points or lower at the start of your turn, click LEAST! All hands are revealed, and the lowest score wins the round!',
    voiceText: 'Step 5: Declaring LEAST. When your score is 7 or less, call LEAST! The lowest hand score wins!',
    highlightCard: 'LEAST!',
    actionText: '🏆 You call LEAST with 3 pts vs AlphaBot 22 pts! YOU WIN!',
    botScore: 22,
    yourScore: 3,
  },
];

interface HowToPlayVideoDemoProps {
  style?: any;
}

export const HowToPlayVideoDemo: React.FC<HowToPlayVideoDemoProps> = ({ style }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 500;

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const currentStep = STEPS[currentStepIdx];
  const audioEnabledRef = useRef<boolean>(audioEnabled);
  audioEnabledRef.current = audioEnabled;


  // Speak step voiceover & trigger audio SFX
  const triggerStepAudio = (stepIndex: number) => {
    if (!audioEnabledRef.current) return;

    // 1. Play synthesized Web Audio SFX
    try {
      if (stepIndex === 0) {
        playYourTurn();
      } else if (stepIndex === 1) {
        playCardSelect();
        setTimeout(() => playDiscard(), 200);
      } else if (stepIndex === 2) {
        playDraw();
      } else if (stepIndex === 3) {
        playCardSelect();
        setTimeout(() => playDiscard(), 200);
      } else if (stepIndex === 4) {
        playCallLeast();
        setTimeout(() => playRoundEnd(), 500);
      }
    } catch {
      // Audio safe fallback
    }

    // 2. Play Web Speech API Voiceover Narration if supported in web browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // cancel previous speech
        const utterance = new SpeechSynthesisUtterance(STEPS[stepIndex].voiceText);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech safe fallback
      }
    }
  };

  // Trigger audio on step change
  useEffect(() => {
    if (isPlaying && audioEnabled) {
      triggerStepAudio(currentStepIdx);
    }
  }, [currentStepIdx]);

  // Auto-advance loop when isPlaying is true
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const interval = 80;
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStepIdx((sIdx) => (sIdx + 1) % STEPS.length);
            return 0;
          }
          return prev + 2.5; // 4 seconds per step
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSelectStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setProgress(0);
    if (audioEnabled) {
      triggerStepAudio(idx);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audioEnabledRef.current = next;
    if (next) {
      triggerStepAudio(currentStepIdx);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <View style={[styles.wrapper, style]}>

      {/* Top Title & Header */}
      <View style={styles.videoHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.videoBadge}>📹 ANIMATED VIDEO TUTORIAL</Text>
          
          <View style={styles.headerRightControls}>
            <TouchableOpacity onPress={toggleAudio} style={[styles.audioToggleBtn, audioEnabled && styles.audioToggleActive]}>
              <Text style={styles.audioToggleText}>{audioEnabled ? '🔊 Sound: ON' : '🔇 Sound: MUTED'}</Text>
            </TouchableOpacity>

            <View style={styles.statusLive}>
              <View style={[styles.liveDot, isPlaying ? styles.dotActive : styles.dotPaused]} />
              <Text style={styles.liveText}>{isPlaying ? 'PLAYING DEMO' : 'PAUSED'}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.videoTitle}>How to Play 7 Cards Game with Audio</Text>
      </View>

      {/* Main Simulated Video Screen Box */}
      <View style={styles.videoScreen}>
        {/* Step Progress Top Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${((currentStepIdx + progress / 100) / STEPS.length) * 100}%` }]} />
        </View>

        {/* Outer Felt Poker Table Canvas */}
        <View style={styles.feltTable}>
          {/* Top Bar inside Video Screen */}
          <View style={styles.tableHeader}>
            <View style={styles.stepBadgeBox}>
              <Text style={styles.stepBadgeText}>{currentStep.badge}</Text>
            </View>
            <Text style={styles.stepTitleText}>{currentStep.title}</Text>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>Your Score: <Text style={styles.yourScoreText}>{currentStep.yourScore} pts</Text></Text>
            </View>
          </View>

          {/* Subtitle / Narrative Overhead Banner */}
          <View style={styles.narrativeBanner}>
            <View style={styles.narrativeTitleRow}>
              <Text style={styles.narrativeSub}>{currentStep.subtitle}</Text>
              {audioEnabled && <Text style={styles.audioIconBadge}>🔊 Narration Playing</Text>}
            </View>
            <Text style={styles.narrativeDesc}>{currentStep.description}</Text>
          </View>

          {/* Animated Center Game Action View */}
          <View style={styles.tableCenterAction}>
            {/* Opponent Bot Hand */}
            <View style={styles.botRow}>
              <View style={styles.botAvatar}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
              <View style={styles.botInfo}>
                <Text style={styles.botName}>AlphaBot (Opponent)</Text>
                <Text style={styles.botScoreText}>Score: {currentStep.botScore} pts</Text>
              </View>
              <View style={styles.botCardsRow}>
                {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                  <View key={i} style={[styles.botCardBack, { marginLeft: i === 0 ? 0 : -8 }]} />
                ))}
              </View>
            </View>

            {/* Piles & Action Callout */}
            <View style={styles.pilesRow}>
              {/* Joker */}
              <View style={styles.pileCardSlot}>
                <Text style={styles.pileSlotTag}>JOKER (0 pts)</Text>
                <View style={[styles.demoCard, styles.jokerCard]}>
                  <Text style={styles.jokerBadgeText}>★ JOKER</Text>
                  <Text style={[styles.demoRank, { color: '#e11d48' }]}>7</Text>
                  <Text style={[styles.demoSuit, { color: '#e11d48' }]}>♥</Text>
                </View>
              </View>

              {/* Deck */}
              <View style={styles.pileCardSlot}>
                <Text style={styles.pileSlotTag}>DECK</Text>
                <View style={styles.deckStack}>
                  <View style={[styles.deckBackLayer, { top: -4, left: -4 }]} />
                  <View style={[styles.deckBackLayer, { top: -2, left: -2 }]} />
                  <View style={styles.deckBackLayer}>
                    <View style={styles.deckInnerPattern} />
                  </View>
                </View>
              </View>

              {/* Discard */}
              <View style={styles.pileCardSlot}>
                <Text style={styles.pileSlotTag}>DISCARD</Text>
                <View style={[styles.demoCard, currentStepIdx >= 1 && styles.discardGlow]}>
                  <Text style={[styles.demoRank, { color: currentStepIdx === 1 ? '#dc2626' : '#0f172a' }]}>
                    {currentStepIdx === 1 ? 'K' : currentStepIdx === 3 ? '3' : '10'}
                  </Text>
                  <Text style={[styles.demoSuit, { color: currentStepIdx === 1 ? '#dc2626' : '#0f172a' }]}>
                    {currentStepIdx === 1 ? '♦' : currentStepIdx === 3 ? '♥' : '♠'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Step Action Alert Highlight */}
            <View style={styles.actionCalloutBox}>
              <Text style={styles.actionCalloutText}>{currentStep.actionText}</Text>
            </View>

            {/* Player Hand Cards */}
            <View style={styles.playerHandSection}>
              <Text style={styles.handSectionTitle}>Your 7 Cards Hand (Target: Under 7 pts):</Text>
              <View style={styles.playerHandRow}>
                {[
                  { rank: '7', suit: '♥', color: '#dc2626', pts: '0', isJoker: true },
                  { rank: 'A', suit: '♠', color: '#0f172a', pts: '1' },
                  { rank: '2', suit: '♣', color: '#0f172a', pts: '2' },
                  { rank: '3', suit: '♥', color: '#dc2626', pts: '3' },
                  { rank: '3', suit: '♦', color: '#dc2626', pts: '3' },
                  { rank: '3', suit: '♣', color: '#0f172a', pts: '3' },
                  { rank: currentStepIdx >= 2 ? 'Ace' : 'K', suit: currentStepIdx >= 2 ? '♠' : '♦', color: '#dc2626', pts: currentStepIdx >= 2 ? '1' : '10' },
                ].map((c, idx) => {
                  const isHighlighted =
                    (currentStepIdx === 1 && c.rank === 'K') ||
                    (currentStepIdx === 3 && c.rank === '3') ||
                    (currentStepIdx === 4 && (c.rank === '7' || c.rank === 'A' || c.rank === '2'));

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.handCardBox,
                        isHighlighted && styles.handCardHighlighted,
                        c.isJoker && styles.jokerHandCard,
                        { marginLeft: idx === 0 ? 0 : isSmall ? -8 : -12 }
                      ]}
                    >
                      {c.isJoker && <Text style={styles.jokerTag}>JOKER</Text>}
                      <Text style={[styles.handCardRank, { color: c.color }]}>{c.rank}</Text>
                      <Text style={[styles.handCardSuit, { color: c.color }]}>{c.suit}</Text>
                      <View style={styles.ptsBadge}>
                        <Text style={styles.ptsBadgeText}>{c.pts}pt</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Call LEAST Button Highlight */}
              {currentStepIdx >= 4 && (
                <View style={styles.leastCallOverlay}>
                  <TouchableOpacity style={styles.leastCallBtn} activeOpacity={0.8}>
                    <Text style={styles.leastCallBtnText}>✨ CALL LEAST! (Score: 3 pts) ✨</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Video Player Control Bar */}
        <View style={styles.controlsBar}>
          <View style={styles.leftControlsGroup}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
              <Text style={styles.playPauseIcon}>{isPlaying ? '⏸️ Pause' : '▶️ Play Video'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleAudio} style={[styles.audioIconBtn, audioEnabled && styles.audioIconBtnActive]}>
              <Text style={styles.audioIconBtnText}>{audioEnabled ? '🔊 Voice & SFX' : '🔇 Muted'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepTabsRow}>
            {STEPS.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => handleSelectStep(idx)}
                style={[styles.stepTab, currentStepIdx === idx && styles.stepTabActive]}
              >
                <Text style={[styles.stepTabText, currentStepIdx === idx && styles.stepTabTextActive]}>
                  Step {s.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  videoHeader: {
    width: '100%',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 8,
  },
  videoBadge: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioToggleBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioToggleActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e',
  },
  audioToggleText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#22c55e',
  },
  dotPaused: {
    backgroundColor: '#eab308',
  },
  liveText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  
  /* Video Frame Screen */
  videoScreen: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0a1628',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },
  feltTable: {
    backgroundColor: '#075926',
    padding: 16,
    minHeight: 460,
    justifyContent: 'space-between',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  stepBadgeBox: {
    backgroundColor: '#facc15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepBadgeText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 11,
  },
  stepTitleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },
  scorePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  scorePillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yourScoreText: {
    color: '#4ade80',
    fontWeight: '900',
  },

  narrativeBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 14,
  },
  narrativeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  narrativeSub: {
    color: '#facc15',
    fontSize: 14,
    fontWeight: '800',
  },
  audioIconBadge: {
    color: '#4ade80',
    fontSize: 11,
    fontWeight: 'bold',
  },
  narrativeDesc: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
  },

  tableCenterAction: {
    alignItems: 'center',
    gap: 12,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 10,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  botInfo: {
    flexDirection: 'column',
  },
  botName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botScoreText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  botCardsRow: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  botCardBack: {
    width: 20,
    height: 28,
    backgroundColor: '#1e3a8a',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ffffff',
  },

  pilesRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginVertical: 4,
  },
  pileCardSlot: {
    alignItems: 'center',
  },
  pileSlotTag: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
  },
  demoCard: {
    width: 46,
    height: 62,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
  },
  jokerCard: {
    borderColor: '#fbbf24',
    borderWidth: 2,
    shadowColor: '#fbbf24',
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  discardGlow: {
    borderColor: '#22c55e',
    borderWidth: 2,
    shadowColor: '#22c55e',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  jokerBadgeText: {
    fontSize: 6,
    color: '#d97706',
    fontWeight: '900',
    marginBottom: 1,
  },
  demoRank: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  demoSuit: {
    fontSize: 14,
    lineHeight: 16,
  },

  deckStack: {
    position: 'relative',
    width: 46,
    height: 62,
  },
  deckBackLayer: {
    position: 'absolute',
    width: 46,
    height: 62,
    backgroundColor: '#1e3a8a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 3,
  },
  deckInnerPattern: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },

  actionCalloutBox: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#facc15',
  },
  actionCalloutText: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 12,
    textAlign: 'center',
  },

  playerHandSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  handSectionTitle: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  playerHandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  handCardBox: {
    width: 48,
    height: 66,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  handCardHighlighted: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    transform: [{ translateY: -10 }],
    shadowColor: '#facc15',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  jokerHandCard: {
    borderColor: '#fbbf24',
    borderWidth: 2,
  },
  jokerTag: {
    fontSize: 6,
    color: '#d97706',
    fontWeight: '900',
    position: 'absolute',
    top: 2,
  },
  handCardRank: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  handCardSuit: {
    fontSize: 14,
    lineHeight: 15,
  },
  ptsBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  ptsBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#475569',
  },

  leastCallOverlay: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  leastCallBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ade80',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  leastCallBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* Controls Footer */
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    gap: 8,
  },
  leftControlsGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  playPauseBtn: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  playPauseIcon: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 12,
  },
  audioIconBtn: {
    backgroundColor: 'rgba(51, 65, 85, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  audioIconBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#4ade80',
  },
  audioIconBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stepTabActive: {
    backgroundColor: '#facc15',
  },
  stepTabText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  stepTabTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
});
