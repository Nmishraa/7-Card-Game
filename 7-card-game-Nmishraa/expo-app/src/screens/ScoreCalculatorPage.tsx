import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Image
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

const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const ScoreCalculatorPage: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  // State
  const [selectedJokerRank, setSelectedJokerRank] = useState<Rank>('8');
  const [hand, setHand] = useState<Card[]>([
    { id: 'c-1', suit: 'Spades', rank: 'K', value: 10 },
    { id: 'c-2', suit: 'Hearts', rank: '8', value: 8 },
    { id: 'c-3', suit: 'Diamonds', rank: '8', value: 8 },
    { id: 'c-4', suit: 'Clubs', rank: '5', value: 5 },
    { id: 'c-5', suit: 'Hearts', rank: '3', value: 3 },
    { id: 'c-6', suit: 'Spades', rank: '2', value: 2 },
    { id: 'c-7', suit: 'Diamonds', rank: 'A', value: 1 },
  ]);

  const [activeSuit, setActiveSuit] = useState<Suit>('Spades');
  const [selectedHandCardIds, setSelectedHandCardIds] = useState<string[]>([]);

  useEffect(() => {
    updatePageSeo('score-calculator');
  }, []);

  // Hand card point calculation
  const getCardPoints = (card: Card) => {
    if (card.rank === selectedJokerRank) return 0;
    return card.value;
  };

  const totalHandScore = hand.reduce((sum, c) => sum + getCardPoints(c), 0);

  // What-if simulator score
  const simulatedDiscardCards = hand.filter(c => selectedHandCardIds.includes(c.id));
  const isValidDiscardCombination = simulatedDiscardCards.length > 0 && isValidSetOrRun(simulatedDiscardCards);
  const whatIfHandScore = hand
    .filter(c => !selectedHandCardIds.includes(c.id))
    .reduce((sum, c) => sum + getCardPoints(c), 0);

  // Add card to hand (max 7)
  const handleAddCard = (rank: Rank) => {
    if (hand.length >= 7) return;
    const newCard: Card = {
      id: `custom-${activeSuit}-${rank}-${Date.now()}-${Math.random()}`,
      suit: activeSuit,
      rank,
      value: getCardValue(rank)
    };
    setHand(sortHand([...hand, newCard]));
  };

  // Remove card from hand
  const handleRemoveCard = (cardId: string) => {
    setHand(hand.filter(c => c.id !== cardId));
    setSelectedHandCardIds(selectedHandCardIds.filter(id => id !== cardId));
  };

  // Toggle card for what-if discard simulation
  const toggleSelectForDiscard = (cardId: string) => {
    if (selectedHandCardIds.includes(cardId)) {
      setSelectedHandCardIds(selectedHandCardIds.filter(id => id !== cardId));
    } else {
      setSelectedHandCardIds([...selectedHandCardIds, cardId]);
    }
  };

  // Clear hand
  const handleClearHand = () => {
    setHand([]);
    setSelectedHandCardIds([]);
  };

  // Preset example hands
  const handleLoadPreset = (type: 'least' | 'high' | 'joker') => {
    setSelectedHandCardIds([]);
    if (type === 'least') {
      setSelectedJokerRank('K');
      setHand(sortHand([
        { id: 'p1', suit: 'Spades', rank: 'A', value: 1 },
        { id: 'p2', suit: 'Hearts', rank: '2', value: 2 },
        { id: 'p3', suit: 'Clubs', rank: '3', value: 3 },
        { id: 'p4', suit: 'Diamonds', rank: 'K', value: 10 }, // Joker = 0
      ]));
    } else if (type === 'high') {
      setSelectedJokerRank('2');
      setHand(sortHand([
        { id: 'p1', suit: 'Spades', rank: 'K', value: 10 },
        { id: 'p2', suit: 'Hearts', rank: 'Q', value: 10 },
        { id: 'p3', suit: 'Diamonds', rank: 'J', value: 10 },
        { id: 'p4', suit: 'Clubs', rank: '10', value: 10 },
        { id: 'p5', suit: 'Hearts', rank: '9', value: 9 },
        { id: 'p6', suit: 'Spades', rank: '8', value: 8 },
        { id: 'p7', suit: 'Diamonds', rank: '7', value: 7 },
      ]));
    } else {
      setSelectedJokerRank('7');
      setHand(sortHand([
        { id: 'p1', suit: 'Spades', rank: '7', value: 7 }, // Joker = 0
        { id: 'p2', suit: 'Hearts', rank: '7', value: 7 }, // Joker = 0
        { id: 'p3', suit: 'Clubs', rank: '4', value: 4 },
        { id: 'p4', suit: 'Diamonds', rank: '3', value: 3 },
        { id: 'p5', suit: 'Hearts', rank: 'A', value: 1 },
      ]));
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
          <SeoLink href="/daily-challenge" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>🔥 Daily Challenge</Text></SeoLink>
          <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>💡 Strategy Lab</Text></SeoLink>
          <SeoLink href="/score-calculator" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>🧮 Calculator</Text></SeoLink>
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
            <Text style={styles.breadcrumbCurrent}>Score Calculator</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>
            7 Cards Least Score Calculator
          </Text>
          <Text style={styles.subtitle}>
            Select your cards and Table Joker wildcard to calculate your exact hand points, verify LEAST! declaration eligibility, and simulate discard drops.
          </Text>

          {/* Preset Buttons */}
          <View style={styles.presetRow}>
            <Text style={styles.presetLabel}>Load Example Hand:</Text>
            <TouchableOpacity style={styles.presetBtn} onPress={() => handleLoadPreset('least')}>
              <Text style={styles.presetBtnText}>Winning Hand (6 pts)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetBtn} onPress={() => handleLoadPreset('joker')}>
              <Text style={styles.presetBtnText}>Double Joker Hand (8 pts)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetBtn} onPress={() => handleLoadPreset('high')}>
              <Text style={styles.presetBtnText}>High Liability (64 pts)</Text>
            </TouchableOpacity>
          </View>

          {/* ─── CALCULATOR BOARD ─── */}
          <View style={styles.calculatorBoard}>
            {/* Table Joker Selector */}
            <View style={styles.jokerSelectorBox}>
              <Text style={styles.boxTitle}>1. Set Table Joker Wildcard (Counts as 0 Points):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jokerRanksRow}>
                {RANKS.map((r) => (
                  <TouchableOpacity
                    key={`joker-${r}`}
                    onPress={() => setSelectedJokerRank(r)}
                    style={[styles.jokerRankBtn, selectedJokerRank === r && styles.jokerRankBtnActive]}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.jokerRankText, selectedJokerRank === r && styles.jokerRankTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.jokerActiveDesc}>
                Any <Text style={{ color: '#34d399', fontWeight: 'bold' }}>{selectedJokerRank}</Text> card in your hand contributes <Text style={{ color: '#34d399', fontWeight: 'bold' }}>0 points</Text> to your total!
              </Text>
            </View>

            {/* Score Summary Banner */}
            <View style={styles.scoreBanner}>
              <View>
                <Text style={styles.bannerLabel}>Total Hand Score:</Text>
                <Text style={[styles.bannerScore, totalHandScore <= 10 ? styles.scoreGreen : styles.scoreRed]}>
                  {totalHandScore} <Text style={{ fontSize: 18 }}>Points</Text>
                </Text>
              </View>

              <View style={[styles.eligibilityBadge, totalHandScore <= 10 ? styles.badgeEligible : styles.badgeNotEligible]}>
                <Text style={styles.eligibilityTitle}>
                  {totalHandScore <= 10 ? '✅ LEAST! ELIGIBLE' : '❌ NOT ELIGIBLE'}
                </Text>
                <Text style={styles.eligibilityDesc}>
                  {totalHandScore <= 10 
                    ? 'Total is ≤ 10 pts. You can call Least on your turn!' 
                    : `Shed ${totalHandScore - 10} more points to reach the 10-point threshold.`}
                </Text>
              </View>
            </View>

            {/* Current Hand Display */}
            <View style={styles.handDisplaySection}>
              <View style={styles.handHeaderRow}>
                <Text style={styles.boxTitle}>
                  2. Current Hand ({hand.length}/7 Cards) — Tap cards to test What-If Discards:
                </Text>
                {hand.length > 0 && (
                  <TouchableOpacity onPress={handleClearHand}>
                    <Text style={styles.clearBtnText}>Clear Hand</Text>
                  </TouchableOpacity>
                )}
              </View>

              {hand.length === 0 ? (
                <View style={styles.emptyHandBox}>
                  <Text style={styles.emptyHandText}>Hand is empty. Use the card picker below to add up to 7 cards.</Text>
                </View>
              ) : (
                <View style={styles.cardsGrid}>
                  {hand.map((c) => {
                    const isJoker = c.rank === selectedJokerRank;
                    const isSelectedForDiscard = selectedHandCardIds.includes(c.id);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => toggleSelectForDiscard(c.id)}
                        style={[
                          styles.handCard,
                          isJoker && styles.handCardJoker,
                          isSelectedForDiscard && styles.handCardDiscarding
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        <TouchableOpacity
                          style={styles.cardRemoveBtn}
                          onPress={() => handleRemoveCard(c.id)}
                          accessibilityLabel="Remove card"
                        >
                          <Text style={styles.removeBtnText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.cardRankLg}>{c.rank}</Text>
                        <Text style={styles.cardSuitLg}>{renderSuitIcon(c.suit)}</Text>
                        <Text style={[styles.cardPtsBadge, isJoker ? styles.ptsGreen : styles.ptsDefault]}>
                          {isJoker ? '0 pts (Joker)' : `${c.value} pts`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* What-If Discard Simulation Banner */}
            {selectedHandCardIds.length > 0 && (
              <View style={styles.whatIfBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.whatIfTitle}>💡 What-If Discard Simulator:</Text>
                  <Text style={styles.whatIfText}>
                    If you discard {simulatedDiscardCards.length} selected card(s), your hand score will drop from{' '}
                    <Text style={styles.boldWhite}>{totalHandScore} pts</Text> to{' '}
                    <Text style={{ color: '#34d399', fontWeight: 'bold' }}>{whatIfHandScore} pts</Text>!
                  </Text>
                  <Text style={styles.whatIfValidation}>
                    {isValidDiscardCombination 
                      ? '✅ Valid Discard Combination (Single, Matching Set, or Suited Run)' 
                      : '⚠️ Note: Multi-card discards must be equal rank sets or suited runs.'}
                  </Text>
                </View>
              </View>
            )}

            {/* 3. Card Picker Controls */}
            {hand.length < 7 && (
              <View style={styles.pickerSection}>
                <Text style={styles.boxTitle}>3. Add Cards to Hand ({7 - hand.length} remaining):</Text>

                {/* Suit Selector */}
                <View style={styles.suitTabsRow}>
                  {SUITS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setActiveSuit(s)}
                      style={[styles.suitTab, activeSuit === s && styles.suitTabActive]}
                    >
                      <Text style={styles.suitTabIcon}>{renderSuitIcon(s)}</Text>
                      <Text style={[styles.suitTabText, activeSuit === s && styles.suitTabTextActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Rank Selector Grid */}
                <View style={styles.rankPickerGrid}>
                  {RANKS.map((r) => {
                    const isJoker = r === selectedJokerRank;
                    return (
                      <TouchableOpacity
                        key={`picker-${r}`}
                        onPress={() => handleAddCard(r)}
                        style={[styles.rankPickBtn, isJoker && styles.rankPickBtnJoker]}
                        accessibilityRole="button"
                      >
                        <Text style={styles.rankPickRank}>{r}</Text>
                        <Text style={styles.rankPickVal}>{isJoker ? '0 pts' : `${getCardValue(r)}p`}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* ─── SCORING RULES REFERENCE ─── */}
          <View style={styles.articleCard}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>
              Official 7 Cards Least Point Valuation Guide
            </Text>

            <View style={styles.scoringTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 1.2 }]}>Card</Text>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Points</Text>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Scoring Rule</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.boldCell, { flex: 1.2 }]}>Ace (A)</Text>
                <Text style={[styles.tableCell, { color: '#34d399', fontWeight: 'bold', flex: 1 }]}>1 Point</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Always counts as 1 (lowest standard card)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.boldCell, { flex: 1.2 }]}>2 to 10</Text>
                <Text style={[styles.tableCell, { color: '#fbbf24', fontWeight: 'bold', flex: 1 }]}>Face Value</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Counts as numerical number (e.g. 7 = 7 pts)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.boldCell, { flex: 1.2 }]}>J, Q, K</Text>
                <Text style={[styles.tableCell, { color: '#f87171', fontWeight: 'bold', flex: 1 }]}>10 Points</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>All picture cards count as 10 points each</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.boldCell, { flex: 1.2 }]}>Table Joker</Text>
                <Text style={[styles.tableCell, { color: '#34d399', fontWeight: 'bold', flex: 1 }]}>0 Points</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Any card matching the face-up Joker rank is 0 pts</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.boldCell, { flex: 1.2 }]}>False Call</Text>
                <Text style={[styles.tableCell, { color: '#ef4444', fontWeight: 'bold', flex: 1 }]}>+80 Points</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Assessed if an opponent ties or beats your call</Text>
              </View>
            </View>

            <View style={styles.quickNavRow}>
              <SeoLink href="/daily-challenge" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🔥 Play Daily Challenge</Text>
              </SeoLink>
              <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>💡 Practice in Strategy Lab</Text>
              </SeoLink>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🎮 Play Online Now</Text>
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
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navScroll: {
    flex: 1,
    marginHorizontal: 8,
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
    marginBottom: 16,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  presetBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  presetBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
  calculatorBoard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 22,
    marginBottom: 24,
  },
  boxTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jokerSelectorBox: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 16,
  },
  jokerRanksRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  jokerRankBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  jokerRankBtnActive: {
    backgroundColor: '#10b981',
    borderColor: '#34d399',
  },
  jokerRankText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jokerRankTextActive: {
    color: '#ffffff',
  },
  jokerActiveDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
  },
  scoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexWrap: 'wrap',
    gap: 12,
  },
  bannerLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bannerScore: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreGreen: {
    color: '#34d399',
  },
  scoreRed: {
    color: '#f87171',
  },
  eligibilityBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    maxWidth: 320,
  },
  badgeEligible: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  badgeNotEligible: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  eligibilityTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  eligibilityDesc: {
    color: '#cbd5e1',
    fontSize: 11.5,
    lineHeight: 16,
  },
  handDisplaySection: {
    marginBottom: 16,
  },
  handHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHandBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emptyHandText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  handCard: {
    width: 68,
    height: 102,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  handCardJoker: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  handCardDiscarding: {
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
    transform: [{ translateY: -6 }],
  },
  cardRemoveBtn: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  cardRankLg: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  cardSuitLg: {
    fontSize: 22,
  },
  cardPtsBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ptsGreen: {
    color: '#15803d',
  },
  ptsDefault: {
    color: '#64748b',
  },
  whatIfBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  whatIfTitle: {
    color: '#fbbf24',
    fontSize: 13.5,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  whatIfText: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  whatIfValidation: {
    color: '#cbd5e1',
    fontSize: 11.5,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pickerSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 16,
  },
  suitTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  suitTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  suitTabActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  suitTabIcon: {
    fontSize: 16,
  },
  suitTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  suitTabTextActive: {
    color: '#ffffff',
  },
  rankPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rankPickBtn: {
    width: 44,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rankPickBtnJoker: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  rankPickRank: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankPickVal: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 1,
  },
  articleCard: {
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
    marginBottom: 14,
  },
  scoringTable: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeader: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tableCell: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  boldCell: {
    color: '#ffffff',
    fontWeight: '600',
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
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
