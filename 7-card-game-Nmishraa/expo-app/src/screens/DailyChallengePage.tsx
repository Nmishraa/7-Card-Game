import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Platform, Image
} from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';
import { UserHeaderBadge } from '../components/UserHeaderBadge';
import { Card, Rank, Suit } from '../engine/types';
import { getCardValue, isValidSetOrRun, sortHand } from '../engine/gameLogic';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

// ── Seeded PRNG for Daily Deterministic Challenges ──────────────────────────
function getDailySeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function generateDailyPuzzle(dateKey: string) {
  const seed = getDailySeed(dateKey);
  const rand = seededRandom(seed);

  // Challenge number: days since epoch anchor (e.g. Oct 1, 2026)
  const anchor = new Date('2026-10-01').getTime();
  const today = new Date(dateKey).getTime();
  const dayNumber = Math.max(1, Math.floor((today - anchor) / (1000 * 60 * 60 * 24)) + 1);

  // Table Joker
  const jokerRank = RANKS[Math.floor(rand() * RANKS.length)];
  const jokerSuit = SUITS[Math.floor(rand() * SUITS.length)];
  const jokerCard: Card = {
    id: `joker-${jokerRank}`,
    rank: jokerRank,
    suit: jokerSuit,
    value: getCardValue(jokerRank)
  };

  // Build deck & shuffle
  const fullDeck: Card[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      fullDeck.push({
        id: `${s}-${r}`,
        suit: s,
        rank: r,
        value: getCardValue(r)
      });
    }
  }

  for (let i = fullDeck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }

  // Draw 7 cards for initial hand
  const startingHand = sortHand(fullDeck.splice(0, 7));
  const topDiscard = fullDeck.splice(0, 1)[0];
  const upcomingDraws = fullDeck.splice(0, 4);

  return {
    dayNumber,
    jokerCard,
    startingHand,
    topDiscard,
    upcomingDraws
  };
}

export const DailyChallengePage: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  // Local date key: YYYY-MM-DD
  const todayDate = new Date();
  const dateKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  const [puzzle] = useState(() => generateDailyPuzzle(dateKey));
  const [currentHand, setCurrentHand] = useState<Card[]>(puzzle.startingHand);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [currentDiscard, setCurrentDiscard] = useState<Card>(puzzle.topDiscard);
  const [turn, setTurn] = useState(1);
  const maxTurns = 3;
  const [drawQueue, setDrawQueue] = useState<Card[]>(puzzle.upcomingDraws);
  const [phase, setPhase] = useState<'discard' | 'draw' | 'completed'>('discard');
  const [feedback, setFeedback] = useState<string>('Select high-value card(s) or matched sets/runs to discard.');
  const [shareCopied, setShareCopied] = useState(false);

  // Check saved score from localStorage
  const storageKey = `7cards_daily_${dateKey}`;
  const [savedResult, setSavedResult] = useState<{
    score: number;
    initialScore: number;
    turnsUsed: number;
    completedAt: string;
  } | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(storageKey);
      if (data) {
        try { return JSON.parse(data); } catch (e) {}
      }
    }
    return null;
  });

  useEffect(() => {
    updatePageSeo('daily-challenge');
  }, []);

  const calculateHandPoints = (hand: Card[]) => {
    return hand.reduce((sum, c) => {
      if (c.rank === puzzle.jokerCard.rank) return sum;
      return sum + c.value;
    }, 0);
  };

  const initialScore = calculateHandPoints(puzzle.startingHand);
  const currentScore = calculateHandPoints(currentHand);

  // Card selection
  const toggleCardSelect = (cardId: string) => {
    if (phase !== 'discard') return;
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  // Perform discard
  const handleDiscard = () => {
    if (selectedCards.length === 0) {
      setFeedback('⚠️ Please select at least one card to discard.');
      return;
    }

    const cardsToDiscard = currentHand.filter(c => selectedCards.includes(c.id));
    if (!isValidSetOrRun(cardsToDiscard)) {
      setFeedback('⚠️ Invalid discard: Cards must be a single card, a pair/set of equal ranks, or a suited run of 3+ consecutive ranks.');
      return;
    }

    const newHand = currentHand.filter(c => !selectedCards.includes(c.id));
    setCurrentHand(newHand);
    setCurrentDiscard(cardsToDiscard[cardsToDiscard.length - 1]);
    setSelectedCards([]);

    // Check if discarded card matched the top discard rank (match & skip)
    const isMatch = cardsToDiscard.some(c => c.rank === currentDiscard.rank);
    if (isMatch) {
      setFeedback(`⚡ Match & Skip Triggered! Your discard matched the top pile rank (${currentDiscard.rank}). Pickup skipped!`);
      advanceTurnOrComplete(newHand, true);
    } else {
      setPhase('draw');
      setFeedback('✅ Discard accepted. Now choose whether to draw from the Face-Down Deck or the Discard Pile.');
    }
  };

  // Draw card
  const handleDraw = (source: 'deck' | 'discard') => {
    let drawnCard: Card | null = null;
    let nextQueue = [...drawQueue];

    if (source === 'deck') {
      if (nextQueue.length > 0) {
        drawnCard = nextQueue.shift()!;
        setDrawQueue(nextQueue);
      } else {
        drawnCard = { id: `bonus-ace`, suit: 'Hearts', rank: 'A', value: 1 };
      }
    } else {
      drawnCard = currentDiscard;
    }

    if (drawnCard) {
      const updatedHand = sortHand([...currentHand, drawnCard]);
      setCurrentHand(updatedHand);
      advanceTurnOrComplete(updatedHand, false);
    }
  };

  const advanceTurnOrComplete = (hand: Card[], wasSkipped: boolean) => {
    if (turn >= maxTurns) {
      completeChallenge(hand);
    } else {
      setTurn(turn + 1);
      setPhase('discard');
      setFeedback(`Turn ${turn + 1} of ${maxTurns}: Select card(s) to shed.`);
    }
  };

  const completeChallenge = (finalHand: Card[]) => {
    const finalScore = calculateHandPoints(finalHand);
    const resultObj = {
      score: finalScore,
      initialScore,
      turnsUsed: turn,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSavedResult(resultObj);
    setPhase('completed');
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(resultObj));
      } catch (e) {}
    }
  };

  const handleShare = () => {
    const finalScore = savedResult ? savedResult.score : currentScore;
    const shareText = `🃏 7 Cards Least Daily Challenge #${puzzle.dayNumber} (${dateKey})
🎯 Final Score: ${finalScore} pts (Started: ${initialScore} pts)
${finalScore <= 7 ? '⭐️⭐️⭐️ Master Shedder' : finalScore <= 15 ? '⭐️⭐️ Skilled Player' : '⭐️ Casual'}
Can you beat my score? Play today: https://cards.gnanamai.com/daily-challenge`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    }
  };

  const renderSuitIcon = (suit: Suit) => {
    const isRed = suit === 'Hearts' || suit === 'Diamonds';
    const symbol = suit === 'Hearts' ? '♥' : suit === 'Diamonds' ? '♦' : suit === 'Clubs' ? '♣' : '♠';
    return <Text style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{symbol}</Text>;
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ─── SITE NAVBAR ─── */}
      <View style={styles.navbar}>
        <SeoLink href="/" onNavigate={onNavigate} style={styles.brandLink} accessibilityLabel="Home">
          <Image source={require('../../assets/logo-badge.png')} style={styles.navLogoBadge} resizeMode="contain" />
          <Text style={styles.brandTitle}>7 Cards Least</Text>
        </SeoLink>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navScroll} contentContainerStyle={styles.navLinks}>
          <SeoLink href="/" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play</Text></SeoLink>
          <SeoLink href="/7-cards-least" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>7 Cards Least</Text></SeoLink>
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></SeoLink>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></SeoLink>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></SeoLink>
          <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></SeoLink>
          <SeoLink href="/daily-challenge" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>🔥 Daily Challenge</Text></SeoLink>
          <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>💡 Strategy Lab</Text></SeoLink>
          <SeoLink href="/score-calculator" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>🧮 Calculator</Text></SeoLink>
          <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></SeoLink>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></SeoLink>
        </ScrollView>
        <UserHeaderBadge user={user} onLogout={onLogout} onNavigate={onNavigate} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>Home</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>Daily Challenge</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>
            7 Cards Least Daily Challenge #{puzzle.dayNumber}
          </Text>
          <Text style={styles.subtitle}>
            Date: {dateKey} • Everyone receives the exact same starting hand and joker wildcard. Complete in 3 turns to reach the lowest possible score!
          </Text>

          {/* ─── CHALLENGE GAME BOARD ─── */}
          <View style={styles.gameBoard}>
            {/* Table Header: Joker & Discard Pile */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.jokerBox}>
                <Text style={styles.boardLabel}>🃏 Table Joker (0 Pts)</Text>
                <View style={styles.miniCard}>
                  <Text style={styles.cardRank}>{puzzle.jokerCard.rank}</Text>
                  {renderSuitIcon(puzzle.jokerCard.suit)}
                </View>
                <Text style={styles.jokerHint}>All {puzzle.jokerCard.rank}s in hand = 0 pts</Text>
              </View>

              <View style={styles.scoreBadgeBox}>
                <Text style={styles.boardLabel}>Turn {Math.min(turn, maxTurns)} of {maxTurns}</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Hand Points:</Text>
                  <Text style={[styles.scoreValue, currentScore <= 10 ? styles.scoreGreen : styles.scoreYellow]}>
                    {currentScore} pts
                  </Text>
                </View>
                <Text style={styles.initialScoreHint}>Started at: {initialScore} pts</Text>
              </View>

              <View style={styles.discardBox}>
                <Text style={styles.boardLabel}>🗑️ Top Discard</Text>
                <View style={styles.miniCard}>
                  <Text style={styles.cardRank}>{currentDiscard.rank}</Text>
                  {renderSuitIcon(currentDiscard.suit)}
                </View>
                <Text style={styles.jokerHint}>Value: {currentDiscard.value} pts</Text>
              </View>
            </View>

            {/* Turn Instructions & Feedback Banner */}
            <View style={styles.feedbackBanner}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>

            {/* Player's Current Hand */}
            {phase !== 'completed' && (
              <View style={styles.handSection}>
                <Text style={styles.sectionHeading}>Your Hand ({currentHand.length} Cards):</Text>
                <View style={styles.cardsRow}>
                  {currentHand.map((card) => {
                    const isSelected = selectedCards.includes(card.id);
                    const isJoker = card.rank === puzzle.jokerCard.rank;
                    return (
                      <TouchableOpacity
                        key={card.id}
                        onPress={() => toggleCardSelect(card.id)}
                        style={[
                          styles.cardItem,
                          isSelected && styles.cardSelected,
                          isJoker && styles.cardJoker
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`${card.rank} of ${card.suit}`}
                      >
                        <Text style={styles.cardRankText}>{card.rank}</Text>
                        <Text style={styles.cardSuitText}>{renderSuitIcon(card.suit)}</Text>
                        <Text style={styles.cardValText}>{isJoker ? '0 pts' : `${card.value} pts`}</Text>
                        {isJoker && <Text style={styles.jokerBadge}>JOKER</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Action Controls */}
                {phase === 'discard' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.primaryBtn, selectedCards.length === 0 && styles.btnDisabled]}
                      onPress={handleDiscard}
                      disabled={selectedCards.length === 0}
                      accessibilityRole="button"
                    >
                      <Text style={styles.primaryBtnText}>
                        Discard Selected ({selectedCards.length})
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {phase === 'draw' && (
                  <View style={styles.drawRow}>
                    <TouchableOpacity
                      style={styles.drawBtn}
                      onPress={() => handleDraw('deck')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.drawBtnIcon}>🎴</Text>
                      <Text style={styles.drawBtnTitle}>Draw from Closed Deck</Text>
                      <Text style={styles.drawBtnSubtitle}>Mystery card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.drawBtn, styles.drawDiscardBtn]}
                      onPress={() => handleDraw('discard')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.drawBtnIcon}>🗑️</Text>
                      <Text style={styles.drawBtnTitle}>Draw Top Discard</Text>
                      <Text style={styles.drawBtnSubtitle}>{currentDiscard.rank} of {currentDiscard.suit} ({currentDiscard.value} pts)</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Completed Summary View */}
            {(phase === 'completed' || savedResult) && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>🎉 Daily Challenge Completed!</Text>
                <Text style={styles.resultSubtitle}>
                  You started with <Text style={styles.boldWhite}>{savedResult?.initialScore ?? initialScore} pts</Text> and finished with <Text style={styles.resultHighlight}>{(savedResult?.score ?? currentScore)} pts</Text>!
                </Text>

                <View style={styles.starRatingRow}>
                  <Text style={styles.starText}>
                    {(savedResult?.score ?? currentScore) <= 7 ? '⭐️⭐️⭐️ Master Shedder' : (savedResult?.score ?? currentScore) <= 15 ? '⭐️⭐️ Skilled Player' : '⭐️ Casual'}
                  </Text>
                </View>

                <View style={styles.resultDetailsBox}>
                  <Text style={styles.resultDetailText}>• Date: {dateKey}</Text>
                  <Text style={styles.resultDetailText}>• Turns Used: {savedResult?.turnsUsed ?? turn} / {maxTurns}</Text>
                  <Text style={styles.resultDetailText}>• Calling Least Eligible: {(savedResult?.score ?? currentScore) <= 10 ? '✅ YES (≤ 10 pts)' : '❌ NO (> 10 pts)'}</Text>
                </View>

                <View style={styles.shareActionRow}>
                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={handleShare}
                    accessibilityRole="button"
                  >
                    <Text style={styles.shareBtnText}>
                      {shareCopied ? '✅ Score Copied to Clipboard!' : '📤 Share Your Score'}
                    </Text>
                  </TouchableOpacity>

                  <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={styles.learnMoreBtn}>
                    <Text style={styles.learnMoreText}>💡 Test Moves in Strategy Lab</Text>
                  </SeoLink>
                </View>
              </View>
            )}
          </View>

          {/* ─── EDUCATIONAL / SEO CONTEXT ─── */}
          <View style={styles.infoArticle}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>
              How the 7 Cards Least Daily Challenge Works
            </Text>
            <p style={styles.webParagraph}>
              The <strong>7 Cards Least Daily Challenge</strong> is a daily card puzzle refreshed every midnight. Unlike random games, every player across the globe receives the <em>exact same 7-card hand</em>, the same Table Joker wildcard, and the same draw sequence. 
            </p>

            <h3 style={styles.h3}>Scoring Rules &amp; Strategy Tips:</h3>
            <ul style={styles.webList}>
              <li><strong>Zero-Point Jokers:</strong> Any card sharing the rank of the daily Table Joker counts as 0 points. Always hold Jokers!</li>
              <li><strong>Match &amp; Skip:</strong> If your discard matches the rank of the card currently on top of the discard pile, your pickup turn is skipped, permanently reducing your hand size.</li>
              <li><strong>Set &amp; Run Discards:</strong> Discard 3 or 4 cards of the same rank (e.g., 9-9-9) or 3+ suited consecutive cards (e.g., 6♠-7♠-8♠) in a single turn to drastically lower hand liability.</li>
              <li><strong>The Least Threshold:</strong> In official 7 Cards Least, a player can declare <strong>"LEAST!"</strong> only when their hand total drops to 10 points or fewer.</li>
            </ul>

            <View style={styles.quickNavRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🎮 Play Full Online Match</Text>
              </SeoLink>
              <SeoLink href="/score-calculator" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🧮 Use Score Calculator</Text>
              </SeoLink>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#062d12',
  },
  navbar: {
    backgroundColor: '#07160c',
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a24',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  brandLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 14,
  },
  navLogoBadge: {
    width: 32,
    height: 32,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  navScroll: {
    flex: 1,
    marginHorizontal: 8,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeNavBtn: {
    backgroundColor: '#059669',
  },
  navText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  activeNavText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 860,
  },
  containerWide: {
    maxWidth: 960,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  breadcrumbLink: {
    color: '#38bdf8',
    fontSize: 13,
  },
  breadcrumbSep: {
    color: '#64748b',
    fontSize: 12,
  },
  breadcrumbCurrent: {
    color: '#94a3b8',
    fontSize: 13,
  },
  h1: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 20,
  },
  gameBoard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 20,
    marginBottom: 24,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 16,
    marginBottom: 16,
  },
  jokerBox: {
    alignItems: 'center',
  },
  discardBox: {
    alignItems: 'center',
  },
  scoreBadgeBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  boardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  miniCard: {
    width: 50,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  jokerHint: {
    fontSize: 11,
    color: '#34d399',
    marginTop: 4,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreGreen: {
    color: '#34d399',
  },
  scoreYellow: {
    color: '#fbbf24',
  },
  initialScoreHint: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  feedbackBanner: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  feedbackText: {
    color: '#e2e8f0',
    fontSize: 13.5,
    lineHeight: 19,
  },
  handSection: {
    marginTop: 8,
  },
  sectionHeading: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardItem: {
    width: 66,
    height: 96,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#eff6ff',
    transform: [{ translateY: -8 }],
    shadowColor: '#38bdf8',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  cardJoker: {
    borderColor: '#10b981',
  },
  cardRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardSuitText: {
    fontSize: 22,
  },
  cardValText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  jokerBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  actionRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  drawRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  drawBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minWidth: 180,
  },
  drawDiscardBtn: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  drawBtnIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  drawBtnTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  drawBtnSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  resultBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    color: '#34d399',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultSubtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultHighlight: {
    color: '#34d399',
    fontWeight: 'bold',
    fontSize: 18,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  starRatingRow: {
    marginVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  starText: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resultDetailsBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  resultDetailText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginVertical: 2,
  },
  shareActionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  shareBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  shareBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  learnMoreBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  learnMoreText: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoArticle: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginTop: 16,
    marginBottom: 8,
  },
  webParagraph: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  webList: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 20,
    marginBottom: 16,
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 16,
  },
  quickNavBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickNavText: {
    color: '#38bdf8',
    fontWeight: '600',
    fontSize: 13,
  },
});
