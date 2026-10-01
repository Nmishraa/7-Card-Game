import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useWindowDimensions,
  Platform, ScrollView, Animated, Easing, SafeAreaView
} from 'react-native';
import {
  playCardSelect,
  playDiscard,
  playDraw,
  playYourTurn,
  playCallLeast,
  playRoundEnd,
  playGameOver,
  speakVoice,
  stopVoice,
  unlockMobileAudio
} from '../engine/soundService';

interface Props {
  onNavigate?: (route: string) => void;
}

export const DemoScreen: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 520;
  const isWide = width >= 900;

  // ── Player Roster (4 Players around table) ──
  const players = [
    { id: 'p1', name: 'Alex (You)', seat: 'bottom', isUser: true, initialScore: 28 },
    { id: 'p2', name: 'AlphaBot 🤖', seat: 'right', isUser: false, initialScore: 28 },
    { id: 'p3', name: 'BetaBot 🤖', seat: 'top', isUser: false, initialScore: 19 },
    { id: 'p4', name: 'OmegaBot 🤖', seat: 'left', isUser: false, initialScore: 32 },
  ];

  // ── High-Precision 45-Second Timeline State ──
  const TOTAL_DURATION = 45.0;
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const currentTimeRef = useRef<number>(0);
  currentTimeRef.current = currentTime;

  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const isMutedRef = useRef<boolean>(isMuted);
  isMutedRef.current = isMuted;

  const lastSoundTriggeredRef = useRef<Record<string, boolean>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Unlock Web Audio API on mount
  useEffect(() => {
    unlockMobileAudio();
    return () => {
      stopVoice();
    };
  }, []);

  // ── Main Animation Frame Loop ──
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimestampRef.current = null;
      stopVoice();
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime(prev => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          stopVoice();
          return TOTAL_DURATION;
        }
        return next;
      });

      if (isPlayingRef.current) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimestampRef.current = null;
    };
  }, [isPlaying]);

  // ── Synchronized Sound Effects ──
  useEffect(() => {
    if (isMutedRef.current) return;
    const t = currentTime;

    const checkSound = (key: string, targetTime: number, soundFn: () => void) => {
      if (t >= targetTime && !lastSoundTriggeredRef.current[key]) {
        lastSoundTriggeredRef.current[key] = true;
        try {
          soundFn();
        } catch {
          // safe audio fallback
        }
      }
    };

    // Dealing Audio Clicks (4s - 11s)
    checkSound('deal_1', 4.2, playDraw);
    checkSound('deal_2', 5.5, playDraw);
    checkSound('deal_3', 7.0, playDraw);
    checkSound('deal_4', 8.5, playDraw);
    checkSound('deal_5', 10.0, playDraw);

    // Turns 1-3 (11s - 20s)
    checkSound('turn_1_alert', 11.2, playYourTurn);
    checkSound('turn_1_select', 12.2, playCardSelect);
    checkSound('turn_1_discard', 12.8, playDiscard);
    checkSound('turn_1_draw', 13.5, playDraw);

    checkSound('turn_2_discard', 15.2, playDiscard);
    checkSound('turn_2_draw', 16.0, playDraw);

    checkSound('turn_3_discard', 18.2, playDiscard);
    checkSound('turn_3_draw', 19.0, playDraw);

    // Turns 4-5 (20s - 27s)
    checkSound('turn_4_discard', 21.2, playDiscard);
    checkSound('turn_4_draw', 22.0, playDraw);

    checkSound('turn_5_alert', 24.0, playYourTurn);
    checkSound('turn_5_select', 25.0, playCardSelect);

    // Call LEAST (27s - 33s)
    checkSound('call_least', 27.2, playCallLeast);

    // Card Reveal (33s - 41s)
    checkSound('reveal_start', 33.2, playRoundEnd);

    // Victory Result (41s - 45s)
    checkSound('result_game_over', 41.2, playGameOver);
  }, [currentTime]);

  const seekTo = (timeSec: number) => {
    unlockMobileAudio();
    stopVoice();
    lastSoundTriggeredRef.current = {};
    setCurrentTime(timeSec);
    lastTimestampRef.current = null;
  };

  const handlePlayPause = () => {
    unlockMobileAudio();
    if (currentTime >= TOTAL_DURATION) {
      seekTo(0);
      setIsPlaying(true);
    } else {
      if (isPlaying) stopVoice();
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    seekTo(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    unlockMobileAudio();
    const next = !isMuted;
    setIsMuted(next);
    if (next) stopVoice();
  };

  // ── Timeline Sequence Flags ──
  const isIntro = currentTime < 4.0;
  const isDealing = currentTime >= 4.0 && currentTime < 11.0;
  const isTurns1to3 = currentTime >= 11.0 && currentTime < 20.0;
  const isTurns4to5 = currentTime >= 20.0 && currentTime < 27.0;
  const isCallLeast = currentTime >= 27.0 && currentTime < 33.0;
  const isCardsRevealed = currentTime >= 33.0 && currentTime < 41.0;
  const isResultScreen = currentTime >= 41.0;

  // Calculate dealing card counts
  const dealProgress = Math.min(1, Math.max(0, (currentTime - 4.0) / 6.5));
  const dealtCardsCount = Math.floor(dealProgress * 7);

  // Active player turn highlight
  let activePlayerId = '';
  if (currentTime >= 11.0 && currentTime < 14.0) activePlayerId = 'p1'; // Alex
  else if (currentTime >= 14.0 && currentTime < 17.0) activePlayerId = 'p2'; // AlphaBot
  else if (currentTime >= 17.0 && currentTime < 20.0) activePlayerId = 'p3'; // BetaBot
  else if (currentTime >= 20.0 && currentTime < 23.5) activePlayerId = 'p4'; // OmegaBot
  else if (currentTime >= 23.5 && currentTime < 33.0) activePlayerId = 'p1'; // Alex

  // Action text overlay banner
  let actionBannerText = '🎴 Welcome to 7 Cards — 45s Game Preview';
  if (isDealing) actionBannerText = `🎴 Dealing 7 cards to each player (${dealtCardsCount * 4}/28 dealt)...`;
  else if (currentTime >= 11.0 && currentTime < 14.0) actionBannerText = '⚡ Alex (You): Discarding Suited Run 5♥ 6♥ 7♥ & Drawing 1 card';
  else if (currentTime >= 14.0 && currentTime < 17.0) actionBannerText = '⏳ AlphaBot 🤖: Discarding K♠ & Drawing 1 card';
  else if (currentTime >= 17.0 && currentTime < 20.0) actionBannerText = '⏳ BetaBot 🤖: Discarding Run Q♦ J♦ 10♦ & Drawing 1 card';
  else if (currentTime >= 20.0 && currentTime < 23.5) actionBannerText = '⏳ OmegaBot 🤖: Discarding Pair 8♣ 8♠ & Drawing from Discard';
  else if (currentTime >= 23.5 && currentTime < 27.0) actionBannerText = '🔥 Alex (You): Discarding Pair 6♠ 6♦ — Hand Score is 4 PTS!';
  else if (isCallLeast) actionBannerText = '⚡ LEAST CALLED BY ALEX! Hand Score: 4 Points';
  else if (isCardsRevealed) actionBannerText = '🃏 CARDS REVEALED ON TABLE FELT — Alex wins with 4 pts!';
  else if (isResultScreen) actionBannerText = '🎉 ROUND OVER — Alex Wins 0 Pts! Play 7 Cards Online!';


  const isMobile = width < 600;
  const isVerySmall = width < 400;
  const frameAspectRatio = isMobile ? (isVerySmall ? 4 / 3.4 : 4 / 3.1) : 16 / 9;

  // ── Flying Animated Card State (Alex Turn Deck Pickups Only) ──
  let flyingCard: {
    visible: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    progress: number;
    rank: string;
    suit: string;
    isRed: boolean;
    isFaceUp: boolean;
  } | null = null;

  if (currentTime >= 12.8 && currentTime < 14.0) {
    // Alex Turn 1: Picking up card A♣ from Deck
    const p = Math.min(1, (currentTime - 12.8) / 1.1);
    flyingCard = {
      visible: p < 0.95,
      startX: 0,
      startY: 0,
      targetX: 0,
      targetY: isMobile ? 95 : 85,
      progress: p,
      rank: 'A',
      suit: '♣',
      isRed: false,
      isFaceUp: p > 0.4,
    };
  } else if (currentTime >= 25.0 && currentTime < 26.3) {
    // Alex Turn 2: Picking up card A♥ from Deck
    const p = Math.min(1, (currentTime - 25.0) / 1.1);
    flyingCard = {
      visible: p < 0.95,
      startX: 0,
      startY: 0,
      targetX: 0,
      targetY: isMobile ? 95 : 85,
      progress: p,
      rank: 'A',
      suit: '♥',
      isRed: true,
      isFaceUp: p > 0.4,
    };
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* ── Top Header Navbar ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('/')}>
            <Text style={styles.backBtnText}>← Back to Game</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎬 45-Second Game Demo</Text>
          <TouchableOpacity style={styles.soundBtnHeader} onPress={toggleMute}>
            <Text style={styles.soundBtnText}>{isMuted ? '🔇 Sound Off' : '🔊 Sound ON'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Main Responsive Video Demo Container */}
          <View style={styles.videoPlayerWrapper}>
            <View style={[styles.videoFrame169, { aspectRatio: frameAspectRatio }]}>
              
              {/* Top Timeline Scrubber Track */}
              <View style={styles.topProgressTrack}>
                <View style={[styles.topProgressFill, { width: `${(currentTime / TOTAL_DURATION) * 100}%` }]} />
              </View>

              {/* ── REAL GAME TABLE FELT ── */}
              <View style={styles.feltTable}>
                <View style={styles.feltSeam} />

                {/* Table Top Status Bar */}
                <View style={styles.tableTopHeader}>
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>ROUND 1/5</Text>
                  </View>
                  <View style={styles.actionBannerBox}>
                    <Text style={styles.actionBannerText} numberOfLines={1}>{actionBannerText}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>⏱️ {formatTime(currentTime)} / 0:45</Text>
                  </View>
                </View>

                {/* Center Table Piles (Joker, Deck Stack, Discard Stack) */}
                <View style={styles.centerPilesArea}>
                  
                  {/* Joker Wildcard */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>JOKER (0 pts)</Text>
                    <View style={styles.jokerCard}>
                      <Text style={styles.jokerStarText}>★ JOKER</Text>
                      <Text style={[styles.cardRankText, { color: '#e11d48' }]}>7</Text>
                      <Text style={[styles.cardSuitText, { color: '#e11d48' }]}>♥</Text>
                    </View>
                  </View>

                  {/* Deck Stack */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>DECK</Text>
                    <View style={styles.deckStack}>
                      <View style={[styles.deckLayer, { top: -4, left: -4 }]} />
                      <View style={[styles.deckLayer, { top: -2, left: -2 }]} />
                      <View style={styles.deckCardTop}>
                        <View style={styles.cardPattern} />
                      </View>
                    </View>
                  </View>

                  {/* Discard Pile */}
                  <View style={styles.pileCol}>
                    <Text style={styles.pileLabel}>DISCARD</Text>
                    <View style={styles.discardStack}>
                      {currentTime >= 12.8 && (
                        <View style={styles.cardTopDiscard}>
                          <Text style={[styles.cardRankText, { color: currentTime >= 17.0 && currentTime < 20.0 ? '#e11d48' : '#0f172a' }]}>
                            {currentTime >= 23.5 ? '6' : currentTime >= 20.0 ? '8' : currentTime >= 17.0 ? 'Q' : currentTime >= 14.0 ? 'K' : '7'}
                          </Text>
                          <Text style={[styles.cardSuitText, { color: currentTime >= 17.0 && currentTime < 20.0 ? '#e11d48' : '#0f172a' }]}>
                            {currentTime >= 23.5 ? '♠' : currentTime >= 20.0 ? '♣' : currentTime >= 17.0 ? '♦' : currentTime >= 14.0 ? '♠' : '♥'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* ── ANIMATED FLYING CARD (ALEX PICKING UP FROM DECK) ── */}
                {flyingCard && flyingCard.visible && (
                  <View
                    style={[
                      styles.flyingCard,
                      {
                        transform: [
                          { translateX: flyingCard.startX + (flyingCard.targetX - flyingCard.startX) * flyingCard.progress },
                          { translateY: flyingCard.startY + (flyingCard.targetY - flyingCard.startY) * flyingCard.progress },
                          { scale: 1.0 + Math.sin(flyingCard.progress * Math.PI) * 0.25 },
                        ],
                        opacity: flyingCard.progress < 0.1 ? flyingCard.progress * 10 : flyingCard.progress > 0.9 ? (1 - flyingCard.progress) * 20 : 1,
                      },
                    ]}
                  >
                    {flyingCard.isFaceUp ? (
                      <View style={styles.flyingCardFace}>
                        <Text style={[styles.cardRankText, { color: flyingCard.isRed ? '#e11d48' : '#0f172a' }]}>{flyingCard.rank}</Text>
                        <Text style={[styles.cardSuitText, { color: flyingCard.isRed ? '#e11d48' : '#0f172a' }]}>{flyingCard.suit}</Text>
                      </View>
                    ) : (
                      <View style={styles.flyingCardBack}>
                        <View style={styles.cardPattern} />
                      </View>
                    )}
                  </View>
                )}


                {/* ── 4 PLAYER SEATS AROUND TABLE ── */}
                
                {/* 1. TOP SEAT: BetaBot 🤖 */}
                <View style={[styles.seatBox, styles.seatTop, activePlayerId === 'p3' && styles.seatActiveGlow]}>
                  <Text style={styles.avatarText}>🤖</Text>
                  <View>
                    <Text style={styles.playerNameText}>BetaBot 🤖</Text>
                    <Text style={styles.playerScoreText}>Score: 19 pts</Text>
                  </View>
                </View>

                {/* 2. RIGHT SEAT: AlphaBot 🤖 */}
                <View style={[styles.seatBox, styles.seatRight, activePlayerId === 'p2' && styles.seatActiveGlow]}>
                  <Text style={styles.avatarText}>🤖</Text>
                  <View>
                    <Text style={styles.playerNameText}>AlphaBot 🤖</Text>
                    <Text style={styles.playerScoreText}>Score: 28 pts</Text>
                  </View>
                </View>

                {/* 3. LEFT SEAT: OmegaBot 🤖 */}
                <View style={[styles.seatBox, styles.seatLeft, activePlayerId === 'p4' && styles.seatActiveGlow]}>
                  <Text style={styles.avatarText}>🤖</Text>
                  <View>
                    <Text style={styles.playerNameText}>OmegaBot 🤖</Text>
                    <Text style={styles.playerScoreText}>Score: 32 pts</Text>
                  </View>
                </View>

                {/* 4. BOTTOM SEAT: Alex (You) */}
                <View style={[styles.seatBox, styles.seatBottom, activePlayerId === 'p1' && styles.seatActiveGlow]}>
                  <Text style={styles.avatarText}>👤</Text>
                  <View>
                    <Text style={styles.playerNameText}>Alex (You)</Text>
                    <Text style={styles.playerScoreText}>
                      Hand Total: {currentTime >= 23.5 ? '4 pts' : currentTime >= 12.8 ? '16 pts' : '33 pts'}
                    </Text>
                  </View>

                  {/* LEAST CALL BUTTON (Appears glowing at 23.5s -> 33s) */}
                  {currentTime >= 23.5 && currentTime < 33.0 && (
                    <TouchableOpacity
                      style={[styles.leastBtnActive, currentTime >= 27.0 && styles.leastBtnClicked]}
                      onPress={() => seekTo(27.0)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.leastBtnText}>
                        {currentTime >= 27.0 ? '🏆 LEAST CALLED!' : '🔥 CALL LEAST!'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* ── PLAYER CARDS HAND (BOTTOM SEAT) ── */}
                {!isCardsRevealed && !isResultScreen && (
                  <View style={styles.handRowBottom}>
                    {isDealing ? (
                      /* Dealing Animation Preview */
                      Array.from({ length: dealtCardsCount }).map((_, i) => (
                        <View key={i} style={[styles.handCardMini, { marginLeft: i === 0 ? 0 : -14 }]}>
                          <Text style={styles.handCardRank}>?</Text>
                        </View>
                      ))
                    ) : currentTime >= 23.5 ? (
                      /* Alex's Final Low Hand: A♠ A♣ 2♦ (4 pts total) */
                      [
                        { rank: 'A', suit: '♠', isRed: false, sel: currentTime >= 25.0 && currentTime < 27.0 },
                        { rank: 'A', suit: '♣', isRed: false, sel: currentTime >= 25.0 && currentTime < 27.0 },
                        { rank: '2', suit: '♦', isRed: true, sel: currentTime >= 25.0 && currentTime < 27.0 },
                      ].map((c, i) => (
                        <View key={i} style={[styles.handCard, c.sel && styles.handCardSelected, { marginLeft: i === 0 ? 0 : -10 }]}>
                          <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                          <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                        </View>
                      ))
                    ) : currentTime >= 12.8 ? (
                      /* Mid Game Hand after Discarding Suited Run 5♥ 6♥ 7♥ & Drawing A♣ (5 cards, 16 pts) */
                      [
                        { rank: '6', suit: '♠', isRed: false, sel: currentTime >= 22.0 && currentTime < 23.5 },
                        { rank: '6', suit: '♦', isRed: true, sel: currentTime >= 22.0 && currentTime < 23.5 },
                        { rank: 'A', suit: '♠', isRed: false },
                        { rank: '2', suit: '♦', isRed: true },
                        { rank: 'A', suit: '♣', isRed: false },
                      ].map((c, i) => (
                        <View key={i} style={[styles.handCard, c.sel && styles.handCardSelected, { marginLeft: i === 0 ? 0 : -10 }]}>
                          <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                          <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                        </View>
                      ))
                    ) : (
                      /* Initial Hand (0 - 12.8s): 7 Cards Dealt (33 pts total) */
                      [
                        { rank: '5', suit: '♥', isRed: true, sel: currentTime >= 11.5 && currentTime < 12.8 },
                        { rank: '6', suit: '♥', isRed: true, sel: currentTime >= 11.5 && currentTime < 12.8 },
                        { rank: '7', suit: '♥', isRed: true, sel: currentTime >= 11.5 && currentTime < 12.8 },
                        { rank: '6', suit: '♠', isRed: false },
                        { rank: '6', suit: '♦', isRed: true },
                        { rank: 'A', suit: '♠', isRed: false },
                        { rank: '2', suit: '♦', isRed: true },
                      ].map((c, i) => (
                        <View key={i} style={[styles.handCard, c.sel && styles.handCardSelected, { marginLeft: i === 0 ? 0 : -12 }]}>
                          <Text style={[styles.handCardRank, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.rank}</Text>
                          <Text style={[styles.handCardSuit, { color: c.isRed ? '#e11d48' : '#0f172a' }]}>{c.suit}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* ── SCENE OVERLAY: LEAST ANNOUNCEMENT (27 - 33s) ── */}
                {isCallLeast && (
                  <View style={styles.leastCallOverlay}>
                    <View style={styles.leastCallCard}>
                      <Text style={styles.leastCallTitle}>⚡ LEAST CALLED BY ALEX! ⚡</Text>
                      <Text style={styles.leastCallSubtitle}>Total Hand Score: 4 Points</Text>
                      <Text style={styles.leastCallDesc}>All player hands will now be revealed on the table felt!</Text>
                    </View>
                  </View>
                )}

                {/* ── SCENE OVERLAY: ALL CARDS REVEALED ON TABLE (33 - 41s, 8 FULL SECONDS VISIBILITY) ── */}
                {isCardsRevealed && (
                  <View style={styles.revealedTableContainer}>
                    {/* Header Banner */}
                    <View style={styles.revealHeaderBanner}>
                      <Text style={styles.revealHeaderTitle}>🃏 REVEALED HANDS ON TABLE FELT</Text>
                      <Text style={styles.revealHeaderSubtitle}>Alex wins the round with the LEAST score (4 pts)!</Text>
                    </View>

                    {/* Revealed Hands Ring Layout */}
                    <View style={styles.revealedGrid}>
                      
                      {/* Alex (Bottom Winner) */}
                      <View style={[styles.revealedSeatCard, styles.revealedWinnerCard]}>
                        <View style={styles.revealedTagRow}>
                          <Text style={styles.revealedPlayerName}>Alex (You)</Text>
                          <Text style={styles.winnerBadgeText}>🏆 WINNER: 4 PTS</Text>
                        </View>
                        <View style={styles.revealedCardsRow}>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>A♥</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>A♠</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>2♦</Text></View>
                        </View>
                      </View>

                      {/* BetaBot (Top) */}
                      <View style={styles.revealedSeatCard}>
                        <View style={styles.revealedTagRow}>
                          <Text style={styles.revealedPlayerName}>BetaBot 🤖</Text>
                          <Text style={styles.scoreBadgeText}>19 PTS</Text>
                        </View>
                        <View style={styles.revealedCardsRow}>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>9♠</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>7♣</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>3♥</Text></View>
                        </View>
                      </View>

                      {/* AlphaBot (Right) */}
                      <View style={styles.revealedSeatCard}>
                        <View style={styles.revealedTagRow}>
                          <Text style={styles.revealedPlayerName}>AlphaBot 🤖</Text>
                          <Text style={styles.scoreBadgeText}>28 PTS</Text>
                        </View>
                        <View style={styles.revealedCardsRow}>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>K♣</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>Q♥</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>8♦</Text></View>
                        </View>
                      </View>

                      {/* OmegaBot (Left) */}
                      <View style={styles.revealedSeatCard}>
                        <View style={styles.revealedTagRow}>
                          <Text style={styles.revealedPlayerName}>OmegaBot 🤖</Text>
                          <Text style={styles.scoreBadgeText}>32 PTS</Text>
                        </View>
                        <View style={styles.revealedCardsRow}>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>J♠</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>10♥</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#e11d48' }]}>7♦</Text></View>
                          <View style={styles.miniRevealCard}><Text style={[styles.miniRank, { color: '#0f172a' }]}>5♣</Text></View>
                        </View>
                      </View>

                    </View>
                  </View>
                )}

                {/* ── SCENE OVERLAY: FINAL RESULT & CTA (41 - 45s) ── */}
                {isResultScreen && (
                  <View style={styles.resultOverlay}>
                    <View style={styles.resultModalCard}>
                      
                      <Text style={styles.resultTitle}>🎉 ROUND VICTORY!</Text>
                      <Text style={styles.resultWinnerName}>Winner: Alex (0 Pts awarded)</Text>

                      {/* Scoreboard Table */}
                      <View style={styles.resultScoreTable}>
                        <View style={styles.resultScoreRow}>
                          <Text style={styles.resultPosText}>🥇 1st Place</Text>
                          <Text style={styles.resultPlayerText}>Alex (Caller)</Text>
                          <Text style={styles.resultPtsText}>0 pts</Text>
                        </View>
                        <View style={styles.resultScoreRow}>
                          <Text style={styles.resultPosText}>🥈 2nd Place</Text>
                          <Text style={styles.resultPlayerText}>BetaBot 🤖</Text>
                          <Text style={styles.resultPtsText}>+15 pts</Text>
                        </View>
                        <View style={styles.resultScoreRow}>
                          <Text style={styles.resultPosText}>🥉 3rd Place</Text>
                          <Text style={styles.resultPlayerText}>AlphaBot 🤖</Text>
                          <Text style={styles.resultPtsText}>+24 pts</Text>
                        </View>
                        <View style={styles.resultScoreRow}>
                          <Text style={styles.resultPosText}>4th Place</Text>
                          <Text style={styles.resultPlayerText}>OmegaBot 🤖</Text>
                          <Text style={styles.resultPtsText}>+28 pts</Text>
                        </View>
                      </View>

                      {/* CALL TO ACTION */}
                      <View style={styles.ctaBox}>
                        <Text style={styles.ctaTitle}>Play 7 Cards Online</Text>
                        <Text style={styles.ctaSubtitle}>Challenge Friends in Real-Time or Practice vs AI</Text>
                        
                        <View style={styles.ctaBtnRow}>
                          <TouchableOpacity style={styles.ctaReplayBtn} onPress={handleReplay} activeOpacity={0.8}>
                            <Text style={styles.ctaReplayText}>🔄 Replay Demo</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.ctaPlayBtn}
                            onPress={() => onNavigate && onNavigate('/')}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.ctaPlayText}>🎮 PLAY GAME NOW</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  </View>
                )}

              </View>

              {/* ── SCRUBBER CONTROLS BAR ── */}
              <View style={styles.controlsBar}>
                <View style={styles.leftControls}>
                  <TouchableOpacity style={styles.playPauseBtn} onPress={handlePlayPause}>
                    <Text style={styles.playPauseText}>{isPlaying ? '⏸ Pause' : '▶ Play'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replayBtn} onPress={handleReplay}>
                    <Text style={styles.replayText}>🔄 Replay</Text>
                  </TouchableOpacity>
                </View>

                {/* Timeline Scene Jump Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scenePillsScroll}>
                  <TouchableOpacity style={[styles.scenePill, isIntro && styles.scenePillActive]} onPress={() => seekTo(0)}>
                    <Text style={styles.scenePillText}>0s Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isDealing && styles.scenePillActive]} onPress={() => seekTo(4.0)}>
                    <Text style={styles.scenePillText}>4s Deal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isTurns1to3 && styles.scenePillActive]} onPress={() => seekTo(11.0)}>
                    <Text style={styles.scenePillText}>11s Turns 1-3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isTurns4to5 && styles.scenePillActive]} onPress={() => seekTo(20.0)}>
                    <Text style={styles.scenePillText}>20s Turns 4-5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isCallLeast && styles.scenePillActive]} onPress={() => seekTo(27.0)}>
                    <Text style={styles.scenePillText}>27s Call LEAST</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isCardsRevealed && styles.scenePillActive]} onPress={() => seekTo(33.0)}>
                    <Text style={styles.scenePillText}>33s Reveal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.scenePill, isResultScreen && styles.scenePillActive]} onPress={() => seekTo(41.0)}>
                    <Text style={styles.scenePillText}>41s Result</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

            </View>
          </View>

          {/* ── Sequence Summary Card ── */}
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownHeading}>📋 45-Second Demo Sequence Overview</Text>
            
            <View style={styles.breakdownGrid}>
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:00 – 00:04</Text>
                <Text style={styles.breakdownTitle}>1. Game & Table Start</Text>
                <Text style={styles.breakdownText}>Natural start displaying the 7 Cards game table with 4 seated players around the board.</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:04 – 00:11</Text>
                <Text style={styles.breakdownTitle}>2. Deal Cards</Text>
                <Text style={styles.breakdownText}>Cards deal outward from center deck stack to each player's hand with realistic motion.</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:11 – 00:20</Text>
                <Text style={styles.breakdownTitle}>3. Gameplay Turns 1-3</Text>
                <Text style={styles.breakdownText}>Alex discards suited run 5♥ 6♥ 7♥. AlphaBot and BetaBot take automated turns.</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:20 – 00:27</Text>
                <Text style={styles.breakdownTitle}>4. Gameplay Turns 4-5</Text>
                <Text style={styles.breakdownText}>OmegaBot plays. Alex discards pair 6♠ 6♦, reducing hand total down to 4 points!</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:27 – 00:33</Text>
                <Text style={styles.breakdownTitle}>5. Call LEAST!</Text>
                <Text style={styles.breakdownText}>Alex triggers LEAST button with celebratory fanfare sound & transition banner.</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:33 – 00:41</Text>
                <Text style={styles.breakdownTitle}>6. Cards Revealed (8s Table Visibility)</Text>
                <Text style={styles.breakdownText}>All players' cards fly onto table felt and remain clearly visible for 8 full seconds.</Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTime}>00:41 – 00:45</Text>
                <Text style={styles.breakdownTitle}>7. Final Result & CTA</Text>
                <Text style={styles.breakdownText}>Smooth victory scoreboard modal transition with 'Play 7 Cards Online' Call to Action.</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071626',
    ...(Platform.OS === 'web' ? { backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #071626 100%)' } : {}),
  } as any,
  safeArea: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backBtnText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 13 },
  headerTitle: { color: '#ffffff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
  soundBtnHeader: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  soundBtnText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 12 },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 12,
  },

  videoPlayerWrapper: {
    width: '100%',
    maxWidth: 960,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    backgroundColor: '#062d12',
  },
  videoFrame169: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    justifyContent: 'space-between',
  },

  topProgressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    zIndex: 100,
  },
  topProgressFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },

  feltTable: {
    flex: 1,
    backgroundColor: '#065f28',
    margin: 8,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: '#351203',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 12,
  },
  feltSeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.25)',
  },

  tableTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 30,
  },
  roundBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#facc15',
  },
  roundBadgeText: { color: '#facc15', fontWeight: 'bold', fontSize: 11 },
  actionBannerBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
    maxWidth: '60%',
  },
  actionBannerText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  timeBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  timeBadgeText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 11 },

  centerPilesArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginVertical: 'auto',
    zIndex: 10,
  },
  pileCol: { alignItems: 'center' },
  pileLabel: { color: '#cbd5e1', fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  
  jokerCard: {
    width: 38,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e11d48',
  },
  jokerStarText: { fontSize: 7, fontWeight: 'bold', color: '#e11d48' },
  cardRankText: { fontSize: 14, fontWeight: 'bold' },
  cardSuitText: { fontSize: 12 },

  deckStack: { width: 38, height: 52, position: 'relative' },
  deckLayer: {
    position: 'absolute',
    width: 38,
    height: 52,
    backgroundColor: '#1e293b',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  deckCardTop: {
    width: 38,
    height: 52,
    backgroundColor: '#0f172a',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    padding: 3,
  },
  cardPattern: {
    flex: 1,
    backgroundColor: '#0284c7',
    borderRadius: 3,
  },

  discardStack: {
    width: 38,
    height: 52,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTopDiscard: {
    width: 38,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Seat Positions */
  seatBox: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 20,
  },
  seatActiveGlow: {
    borderColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: { fontSize: 16 },
  playerNameText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
  playerScoreText: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },

  seatTop: { top: 40, alignSelf: 'center' },
  seatBottom: { bottom: 44, alignSelf: 'center' },
  seatLeft: { left: 16, top: '45%' },
  seatRight: { right: 16, top: '45%' },

  leastBtnActive: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#4ade80',
  },
  leastBtnClicked: { backgroundColor: '#dc2626', borderColor: '#f87171' },
  leastBtnText: { color: '#fff', fontWeight: '900', fontSize: 10 },

  handRowBottom: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 25,
  },
  handCard: {
    width: 34,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  handCardSelected: {
    transform: [{ translateY: -10 }],
    borderColor: '#38bdf8',
    borderWidth: 2,
  },
  handCardMini: {
    width: 24,
    height: 36,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  handCardRank: { fontSize: 12, fontWeight: '900' },
  handCardSuit: { fontSize: 10 },

  /* Least Call Overlay */
  leastCallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  leastCallCard: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  leastCallTitle: { color: '#fbbf24', fontSize: 20, fontWeight: '900' },
  leastCallSubtitle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  leastCallDesc: { color: '#cbd5e1', fontSize: 12, marginTop: 6 },

  /* Revealed Table Overlay (8s visibility) */
  revealedTableContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 95, 40, 0.95)',
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 60,
  },
  revealHeaderBanner: { alignItems: 'center' },
  revealHeaderTitle: { color: '#fbbf24', fontSize: 16, fontWeight: '900' },
  revealHeaderSubtitle: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginTop: 2 },

  flyingCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -26,
    marginLeft: -19,
    width: 38,
    height: 52,
    zIndex: 100,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  flyingCardFace: {
    width: 38,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyingCardBack: {
    width: 38,
    height: 52,
    backgroundColor: '#0f172a',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    padding: 3,
  },
  
  revealedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
    marginVertical: 'auto',
  },
  revealedSeatCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: 8,
    borderRadius: 10,
    width: '46%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  revealedWinnerCard: { borderColor: '#fbbf24', borderWidth: 2, backgroundColor: 'rgba(15, 23, 42, 0.98)' },
  revealedTagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  revealedPlayerName: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  winnerBadgeText: { color: '#fbbf24', fontWeight: '900', fontSize: 11 },
  scoreBadgeText: { color: '#cbd5e1', fontSize: 10, fontWeight: 'bold' },
  revealedCardsRow: { flexDirection: 'row', gap: 6 },
  miniRevealCard: {
    width: 26,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRank: { fontSize: 10, fontWeight: 'bold' },

  /* Result & CTA Overlay */
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 70,
    padding: 16,
  },
  resultModalCard: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
    maxWidth: 480,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  resultTitle: { color: '#fbbf24', fontSize: 22, fontWeight: '900' },
  resultWinnerName: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginTop: 4, marginBottom: 12 },
  
  resultScoreTable: { width: '100%', gap: 6, marginBottom: 16 },
  resultScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultPosText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 12 },
  resultPlayerText: { color: '#fff', fontSize: 12 },
  resultPtsText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 12 },

  ctaBox: { width: '100%', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12 },
  ctaTitle: { color: '#38bdf8', fontSize: 18, fontWeight: '900' },
  ctaSubtitle: { color: '#cbd5e1', fontSize: 11, marginTop: 2, marginBottom: 12 },
  ctaBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  ctaReplayBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaReplayText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  ctaPlayBtn: {
    flex: 1.5,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4ade80',
  },
  ctaPlayText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },

  /* Scrubber Bar */
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftControls: { flexDirection: 'row', gap: 8 },
  playPauseBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  playPauseText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  replayBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replayText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 12 },
  scenePillsScroll: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  scenePill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scenePillActive: { backgroundColor: '#0284c7' },
  scenePillText: { color: '#cbd5e1', fontSize: 10, fontWeight: 'bold' },

  /* Breakdown Doc */
  breakdownContainer: { width: '100%', maxWidth: 960, marginTop: 24 },
  breakdownHeading: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  breakdownGrid: { gap: 10 },
  breakdownCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  breakdownTime: { color: '#fbbf24', fontWeight: 'bold', fontSize: 12 },
  breakdownTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 14, marginTop: 2 },
  breakdownText: { color: '#cbd5e1', fontSize: 12, marginTop: 4, lineHeight: 18 },
});
