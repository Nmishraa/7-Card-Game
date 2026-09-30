import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
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
        { rank: '5', suit: '♥', isRed: true, selected: true, rot: '-6deg' },
        { rank: '6', suit: '♥', isRed: true, selected: true, rot: '-3deg' },
        { rank: '7', suit: '♥', isRed: true, selected: true, rot: '0deg' },
        { rank: '9', suit: '♣', isRed: false, selected: false, rot: '3deg' },
        { rank: 'J', suit: '♠', isRed: false, selected: false, rot: '6deg' },
      ],
      discardTop: { rank: 'K', suit: '♠', isRed: false },
      discardUnder: { rank: '9', suit: '♦', isRed: true },
      actionText: "Discarding 5♥ 6♥ 7♥ (Suited Run)...",
      scores: { you: 12, bot: 29, beta: 24 }
    },
    {
      title: "Step 2: Draw a Card",
      desc: "After discarding, draw 1 card from the face-down Deck or top Discard card.",
      voiceText: "Step 2: Draw a card. Pick 1 replacement card from the secret deck or face-up discard pile.",
      activePlayer: "You (Turn)",
      banner: "🎴 DRAW PHASE: Pick from Secret Deck or Open Discard",
      hand: [
        { rank: '9', suit: '♣', isRed: false, selected: false, rot: '-3deg' },
        { rank: 'J', suit: '♠', isRed: false, selected: false, rot: '3deg' },
      ],
      discardTop: { rank: '7', suit: '♥', isRed: true },
      discardUnder: { rank: '6', suit: '♥', isRed: true },
      actionText: "Drawing 1 card from Secret Deck...",
      scores: { you: 12, bot: 29, beta: 24 }
    },
    {
      title: "Step 3: Turn Switches to Opponent",
      desc: "Turn changes automatically in real time. Opponent plays their turn.",
      voiceText: "Step 3: Turn switches to opponent. AlphaBot discards a card and draws.",
      activePlayer: "AlphaBot 🤖 (Turn)",
      banner: "⏳ AlphaBot 🤖 is thinking & taking turn...",
      hand: [
        { rank: '2', suit: '♦', isRed: true, selected: false, rot: '-4deg' },
        { rank: '9', suit: '♣', isRed: false, selected: false, rot: '0deg' },
        { rank: 'J', suit: '♠', isRed: false, selected: false, rot: '4deg' },
      ],
      discardTop: { rank: 'Q', suit: '♦', isRed: true },
      discardUnder: { rank: '7', suit: '♥', isRed: true },
      actionText: "AlphaBot discarded Q♦ and drew 1 card",
      scores: { you: 12, bot: 29, beta: 24 }
    },
    {
      title: "Step 4: Call LEAST! when points ≤ 10",
      desc: "When your card total is 10 points or less, click LEAST! to claim victory.",
      voiceText: "Step 4: Call LEAST when your points are 10 or less to win the round!",
      activePlayer: "You (Turn)",
      banner: "🏆 YOUR TURN: Hand total is 2 pts! Click LEAST!",
      hand: [
        { rank: 'A', suit: '♠', isRed: false, selected: false, rot: '-3deg' },
        { rank: 'A', suit: '♥', isRed: true, selected: false, rot: '3deg' },
      ],
      discardTop: { rank: '4', suit: '♣', isRed: false },
      discardUnder: { rank: 'Q', suit: '♦', isRed: true },
      actionText: "CALLING LEAST! (Total Hand Score: 2 pts)",
      scores: { you: 2, bot: 29, beta: 24 }
    },
    {
      title: "Step 5: Round Over & Victory",
      desc: "Lowest score wins 0 points. Caller with lowest score wins round!",
      voiceText: "Step 5: Round over! Lowest score wins 0 points and takes the round!",
      activePlayer: "Round Complete",
      banner: "🎉 YOU WON THE ROUND! (0 pts awarded to Winner)",
      hand: [
        { rank: 'A', suit: '♠', isRed: false, selected: false, rot: '-3deg' },
        { rank: 'A', suit: '♥', isRed: true, selected: false, rot: '3deg' },
      ],
      discardTop: { rank: '4', suit: '♣', isRed: false },
      discardUnder: { rank: 'Q', suit: '♦', isRed: true },
      actionText: "🏆 ROUND WINNER: You (0 pts) | AlphaBot: 29 pts",
      scores: { you: 0, bot: 29, beta: 24 }
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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.previewTitle}>🎬 Gameplay Demo</Text>
          <Text style={styles.previewSubtitle}>Watch How 7 Cards Least Works</Text>
        </View>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>⏱️ 45-Sec Interactive Demo</Text>
        </View>
      </View>

      {/* Main Video Frame */}
      <View style={styles.videoFrame}>

        {/* Step Progress Bar Header */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${isPlaying ? progress : ((currentStep + 1) / STEPS.length) * 100}%` }]} />
        </View>

        {!isPlaying && currentStep === 0 && progress === 0 ? (
          /* Thumbnail Poster Mode with Play Button */
          <View style={styles.thumbnailContainer}>
            {/* Background Simulated Table */}
            <View style={styles.tableRailOuter}>
              <View style={styles.tableRailInner}>
                <View style={styles.feltTable}>
                  <View style={styles.feltSeam} />

                  {/* Header Bar */}
                  <View style={styles.gameHeaderBar}>
                    <View style={styles.gameRoundBadge}>
                      <Text style={styles.gameRoundBadgeText}>ROUND 1/5</Text>
                    </View>
                    <View style={styles.gameTimerBadge}>
                      <Text style={styles.gameTimerText}>⏱️ 0:59</Text>
                    </View>
                  </View>

                  {/* Piles Row */}
                  <View style={styles.pilesRow}>
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>JOKER</Text>
                      <View style={[styles.miniCard, styles.jokerGlow]}>
                        <Text style={styles.jokerBadge}>★ JOKER</Text>
                        <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                        <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                        <View style={styles.cardCornerBottom}>
                          <Text style={[styles.cardRankSmall, { color: '#e11d48' }]}>7♥</Text>
                        </View>
                      </View>
                    </View>

                    {/* Stacked 3D Deck */}
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DECK</Text>
                      <View style={styles.deckStackWrapper}>
                        <View style={[styles.deckCardBack, styles.deckLayer2]} />
                        <View style={[styles.deckCardBack, styles.deckLayer1]} />
                        <View style={styles.deckCardBack}>
                          <View style={styles.cardPattern} />
                        </View>
                      </View>
                    </View>

                    {/* Discard Pile with Under Layer */}
                    <View style={styles.pileCol}>
                      <Text style={styles.pileLabel}>DISCARD</Text>
                      <View style={styles.discardStackWrapper}>
                        <View style={[styles.miniCard, styles.discardUnderCard]}>
                          <Text style={[styles.cardRank, { color: '#e11d48' }]}>9</Text>
                          <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♦</Text>
                        </View>
                        <View style={styles.miniCard}>
                          <Text style={[styles.cardRank, { color: '#0f172a' }]}>10</Text>
                          <Text style={[styles.cardSuit, { color: '#0f172a' }]}>♠</Text>
                          <View style={styles.cardCornerBottom}>
                            <Text style={[styles.cardRankSmall, { color: '#0f172a' }]}>10♠</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Fanned Cards */}
                  <View style={styles.handRow}>
                    {STEPS[0].hand.map((c, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.handCard, 
                          c.selected && styles.handCardSelected,
                          { marginLeft: i === 0 ? 0 : -10, transform: [{ rotate: c.rot }, { translateY: c.selected ? -12 : 0 }] }
                        ]}
                      >
                        <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                        <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                        <View style={styles.cardCornerBottom}>
                          <Text style={[styles.handCardRankSmall, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}{c.suit}</Text>
                        </View>
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
                <Text style={styles.playBtnText}>Play Interactive Demo</Text>
              </TouchableOpacity>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>⏱️ Step-by-Step Simulator</Text>
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

                  {/* Header Bar inside Table */}
                  <View style={styles.gameHeaderBar}>
                    <View style={styles.gameRoundBadge}>
                      <Text style={styles.gameRoundBadgeText}>ROUND 1/5</Text>
                    </View>
                    <View style={styles.opponentRow}>
                      <View style={[styles.avatarBox, activeStepData.activePlayer.includes('AlphaBot') && styles.activeAvatar]}>
                        <Text style={styles.avatarText}>🤖</Text>
                      </View>
                      <View>
                        <Text style={styles.opponentNameText}>{activeStepData.activePlayer}</Text>
                        <Text style={styles.opponentScoreText}>Score: {activeStepData.scores.bot} pts</Text>
                      </View>
                    </View>
                    <View style={styles.gameTimerBadge}>
                      <Text style={styles.gameTimerText}>⏱️ 0:59</Text>
                    </View>
                  </View>

                  {/* Table Middle Area with Scoreboard Card */}
                  <View style={styles.tableMiddleRow}>
                    {/* Center Piles */}
                    <View style={styles.centerSection}>
                      <View style={styles.pilesRow}>
                        <View style={styles.pileCol}>
                          <Text style={styles.pileLabel}>JOKER (0 pts)</Text>
                          <View style={[styles.miniCard, styles.jokerGlow]}>
                            <Text style={styles.jokerBadge}>★ JOKER</Text>
                            <Text style={[styles.cardRank, { color: '#e11d48' }]}>7</Text>
                            <Text style={[styles.cardSuit, { color: '#e11d48' }]}>♥</Text>
                            <View style={styles.cardCornerBottom}>
                              <Text style={[styles.cardRankSmall, { color: '#e11d48' }]}>7♥</Text>
                            </View>
                          </View>
                        </View>

                        {/* Stacked 3D Deck */}
                        <View style={styles.pileCol}>
                          <Text style={styles.pileLabel}>DECK</Text>
                          <View style={styles.deckStackWrapper}>
                            <View style={[styles.deckCardBack, styles.deckLayer2]} />
                            <View style={[styles.deckCardBack, styles.deckLayer1]} />
                            <View style={styles.deckCardBack}>
                              <View style={styles.cardPattern} />
                            </View>
                          </View>
                        </View>

                        {/* Discard Pile */}
                        <View style={styles.pileCol}>
                          <Text style={styles.pileLabel}>DISCARD</Text>
                          <View style={styles.discardStackWrapper}>
                            {activeStepData.discardUnder && (
                              <View style={[styles.miniCard, styles.discardUnderCard]}>
                                <Text style={[styles.cardRank, { color: activeStepData.discardUnder.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardUnder.rank}</Text>
                                <Text style={[styles.cardSuit, { color: activeStepData.discardUnder.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardUnder.suit}</Text>
                              </View>
                            )}
                            <View style={styles.miniCard}>
                              <Text style={[styles.cardRank, { color: activeStepData.discardTop.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardTop.rank}</Text>
                              <Text style={[styles.cardSuit, { color: activeStepData.discardTop.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardTop.suit}</Text>
                              <View style={styles.cardCornerBottom}>
                                <Text style={[styles.cardRankSmall, { color: activeStepData.discardTop.isRed ? '#e11d48' : '#0f172a' }]}>{activeStepData.discardTop.rank}{activeStepData.discardTop.suit}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Action Banner */}
                      <View style={styles.actionBanner}>
                        <Text style={styles.actionBannerText}>⚡ {activeStepData.actionText}</Text>
                      </View>
                    </View>

                    {/* Live Scoreboard Side Card */}
                    {!isSmall && (
                      <View style={styles.scoreCardMini}>
                        <View style={styles.scoreHeader}>
                          <Text style={styles.scoreColPlayer}>PLAYER</Text>
                          <Text style={styles.scoreColVal}>PTS</Text>
                        </View>
                        <View style={[styles.scoreRow, activeStepData.activePlayer.includes('You') && styles.scoreRowActive]}>
                          <Text style={activeStepData.activePlayer.includes('You') ? styles.scoreNameActive : styles.scoreName} numberOfLines={1}>You</Text>
                          <Text style={activeStepData.activePlayer.includes('You') ? styles.scoreValActive : styles.scoreVal}>{activeStepData.scores.you}</Text>
                        </View>
                        <View style={[styles.scoreRow, activeStepData.activePlayer.includes('AlphaBot') && styles.scoreRowActive]}>
                          <Text style={activeStepData.activePlayer.includes('AlphaBot') ? styles.scoreNameActive : styles.scoreName} numberOfLines={1}>AlphaBot</Text>
                          <Text style={activeStepData.activePlayer.includes('AlphaBot') ? styles.scoreValActive : styles.scoreVal}>{activeStepData.scores.bot}</Text>
                        </View>
                        <View style={styles.scoreRow}>
                          <Text style={styles.scoreName} numberOfLines={1}>BetaBot</Text>
                          <Text style={styles.scoreVal}>{activeStepData.scores.beta}</Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Player Hand */}
                  <View style={styles.playerDock}>
                    <Text style={styles.handTitle}>Your Hand (Score: {activeStepData.scores.you} pts):</Text>
                    <View style={styles.handRow}>
                      {activeStepData.hand.map((c: any, i: number) => (
                        <View 
                          key={i} 
                          style={[
                            styles.handCard, 
                            c.selected && styles.handCardSelected, 
                            { marginLeft: i === 0 ? 0 : -10, transform: [{ rotate: c.rot || '0deg' }, { translateY: c.selected ? -14 : 0 }] }
                          ]}
                        >
                          <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                          <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                          <View style={styles.cardCornerBottom}>
                            <Text style={[styles.handCardRankSmall, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}{c.suit}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Controls & Step Navigation Bar */}
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

      {/* Caption under demo */}
      <Text style={styles.captionText}>
        Watch step-by-step game rules, card discards, and victory calls.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginVertical: 24,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  previewTitle: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  previewSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  demoBadgeText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },

  /* Video Outer Frame */
  videoFrame: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    backgroundColor: '#0a1628',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
    position: 'relative',
  },

  /* Top Progress Bar Track */
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },

  thumbnailContainer: {
    position: 'relative',
    width: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  playBtn: {
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 10,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
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
    paddingHorizontal: 12,
    paddingVertical: 5,
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
    marginTop: 4,
  },

  /* Felt Table & Wood Rails */
  tableRailOuter: {
    backgroundColor: '#351203',
    padding: 10,
  },
  tableRailInner: {
    backgroundColor: '#4d1904',
    padding: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  feltTable: {
    backgroundColor: '#065f28',
    borderRadius: 16,
    padding: 14,
    position: 'relative',
    minHeight: 420,
    justifyContent: 'space-between',
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.22)',
  },

  /* Table Header Bar inside Felt Table */
  gameHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 8,
  },
  gameRoundBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#facc15',
  },
  gameRoundBadgeText: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  gameTimerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  gameTimerText: {
    color: '#38bdf8',
    fontWeight: '900',
    fontSize: 12,
  },

  opponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  activeAvatar: {
    borderColor: '#4ade80',
    borderWidth: 2,
    backgroundColor: '#16a34a',
  },
  avatarText: {
    fontSize: 13,
  },
  opponentNameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  opponentScoreText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: 'bold',
  },

  /* Table Middle Layout */
  tableMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    paddingVertical: 6,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Center Piles */
  pilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8,
  },
  pileCol: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#facc15',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  miniCard: {
    width: 48,
    height: 66,
    backgroundColor: '#ffffff',
    borderRadius: 7,
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
  jokerGlow: {
    borderColor: '#fbbf24',
    borderWidth: 2,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  jokerBadge: {
    fontSize: 6,
    color: '#d97706',
    fontWeight: '900',
    marginBottom: 1,
  },
  cardRank: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 19,
  },
  cardSuit: {
    fontSize: 15,
    lineHeight: 17,
  },
  cardCornerBottom: {
    position: 'absolute',
    right: 3,
    bottom: 2,
  },
  cardRankSmall: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  /* Stacked 3D Deck */
  deckStackWrapper: {
    position: 'relative',
    width: 48,
    height: 66,
  },
  deckCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 66,
    backgroundColor: '#1e3a8a',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  deckLayer1: {
    top: -2.5,
    left: -2.5,
  },
  deckLayer2: {
    top: -5,
    left: -5,
  },
  cardPattern: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  /* Discard Stack */
  discardStackWrapper: {
    position: 'relative',
    width: 48,
    height: 66,
  },
  discardUnderCard: {
    position: 'absolute',
    top: 3,
    left: -10,
    transform: [{ rotate: '-12deg' }],
  },

  actionBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#facc15',
    alignSelf: 'center',
    marginVertical: 6,
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  actionBannerText: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },

  /* Scoreboard mini card */
  scoreCardMini: {
    width: 110,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 3,
    marginBottom: 3,
  },
  scoreColPlayer: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    flex: 1,
  },
  scoreColVal: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'right',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
  scoreRowActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    borderLeftWidth: 2,
    borderLeftColor: '#facc15',
  },
  scoreName: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
  scoreNameActive: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 10,
  },
  scoreVal: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreValActive: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 10,
  },

  /* Player Dock & Hand */
  playerDock: {
    alignItems: 'center',
    marginTop: 6,
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
    paddingHorizontal: 8,
  },
  handCard: {
    width: 48,
    height: 66,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
  },
  handCardSelected: {
    borderColor: '#facc15',
    borderWidth: 2.5,
    shadowColor: '#facc15',
    shadowOpacity: 0.85,
    shadowRadius: 10,
  },
  handCardRank: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  handCardSuit: {
    fontSize: 14,
    lineHeight: 16,
  },
  handCardRankSmall: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  /* Controls Bar */
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
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
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
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
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
    marginBottom: 4,
  },
  topAudioBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
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
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
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
