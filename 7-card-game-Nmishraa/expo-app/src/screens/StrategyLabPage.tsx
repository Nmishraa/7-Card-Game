import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Image
} from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';
import { UserHeaderBadge } from '../components/UserHeaderBadge';
import { Card, Suit } from '../engine/types';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

interface Scenario {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  context: string;
  hand: Card[];
  jokerRank: string;
  topDiscard: Card;
  choices: {
    id: string;
    actionLabel: string;
    isOptimal: boolean;
    explanation: string;
    scoreChange: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    title: 'Lab 1: The Face-Card Liability Dilemma',
    difficulty: 'Beginner',
    context: 'It is Turn 1. You hold a King of Spades (10 pts), Queen of Diamonds (10 pts), a pair of 5s, and low cards. The discard pile top card is 5 of Clubs.',
    jokerRank: '8',
    topDiscard: { id: 'd-5c', rank: '5', suit: 'Clubs', value: 5 },
    hand: [
      { id: 'k-s', rank: 'K', suit: 'Spades', value: 10 },
      { id: 'q-d', rank: 'Q', suit: 'Diamonds', value: 10 },
      { id: '9-h', rank: '9', suit: 'Hearts', value: 9 },
      { id: '5-h', rank: '5', suit: 'Hearts', value: 5 },
      { id: '5-d', rank: '5', suit: 'Diamonds', value: 5 },
      { id: '3-c', rank: '3', suit: 'Clubs', value: 3 },
      { id: 'A-s', rank: 'A', suit: 'Spades', value: 1 }
    ],
    choices: [
      {
        id: 'c1',
        actionLabel: 'Discard K♠ (10 pts) and draw from closed deck',
        isOptimal: true,
        scoreChange: '-10 pts immediately',
        explanation: '👑 Correct & Optimal! High face cards (K, Q, J) carry 10 points of penalty risk each. In the opening turns, dumping unlinked face cards is highest priority unless you hold matching ranks.'
      },
      {
        id: 'c2',
        actionLabel: 'Discard 5♥ and pick up the 5♣ from the discard pile',
        isOptimal: false,
        scoreChange: '0 pts (Lateral swap)',
        explanation: '⚠️ Sub-optimal move. Discarding a 5 to draw another 5 accomplishes zero point reduction while leaving you with two 10-point liabilities (K♠ and Q♦).'
      },
      {
        id: 'c3',
        actionLabel: 'Discard A♠ (1 pt) to confuse opponents',
        isOptimal: false,
        scoreChange: '-1 pt only',
        explanation: '❌ Blunder! Aces count as only 1 point—they are your safest cards to hold for a low hand total. Never discard an Ace early.'
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Lab 2: Multi-Card Discard: Set vs. Suited Run',
    difficulty: 'Intermediate',
    context: 'You hold three 8s and also have an 8♦, 9♦, 10♦ suited run. You can legally discard either combination in a single turn!',
    jokerRank: '2',
    topDiscard: { id: 'd-j', rank: 'J', suit: 'Clubs', value: 10 },
    hand: [
      { id: '8-s', rank: '8', suit: 'Spades', value: 8 },
      { id: '8-h', rank: '8', suit: 'Hearts', value: 8 },
      { id: '8-d', rank: '8', suit: 'Diamonds', value: 8 },
      { id: '9-d', rank: '9', suit: 'Diamonds', value: 9 },
      { id: '10-d', rank: '10', suit: 'Diamonds', value: 10 },
      { id: '3-c', rank: '3', suit: 'Clubs', value: 3 },
      { id: 'A-h', rank: 'A', suit: 'Hearts', value: 1 }
    ],
    choices: [
      {
        id: 'c1',
        actionLabel: 'Discard Suited Run 8♦ - 9♦ - 10♦ (27 points)',
        isOptimal: true,
        scoreChange: '-27 pts dumped in 1 turn',
        explanation: '🎯 Brilliant move! Discarding the suited run drops 27 total points (8+9+10) in one single turn, leaving you with 8♠, 8♥, 3♣, A♥ (20 pts). If you discarded the triple 8s, you would still be holding the high 10♦ and 9♦ (19 pts alone!).'
      },
      {
        id: 'c2',
        actionLabel: 'Discard Triple 8s (Set: 8♠ - 8♥ - 8♦ = 24 points)',
        isOptimal: false,
        scoreChange: '-24 pts dumped',
        explanation: '⚠️ Good, but second-best. Dumping 24 points is respectable, but holding onto 10♦ and 9♦ leaves dangerous high-point liabilities in your hand.'
      },
      {
        id: 'c3',
        actionLabel: 'Discard only single 10♦',
        isOptimal: false,
        scoreChange: '-10 pts only',
        explanation: '❌ Missed Opportunity! In 7 Cards Least, shedding multi-card sets or runs lets you dump 20–30 points in a single turn. Never waste a 3-card combo on a single discard.'
      }
    ]
  },
  {
    id: 'scenario-3',
    title: 'Lab 3: The 80-Point Penalty Risk on "LEAST!"',
    difficulty: 'Advanced',
    context: 'Your hand total is 9 points (4♠, 3♥, 2♦). Opponent A has only 3 cards in hand and just drew from the discard pile. Should you call "LEAST!" now?',
    jokerRank: 'K',
    topDiscard: { id: 'd-2', rank: '2', suit: 'Clubs', value: 2 },
    hand: [
      { id: '4-s', rank: '4', suit: 'Spades', value: 4 },
      { id: '3-h', rank: '3', suit: 'Hearts', value: 3 },
      { id: '2-d', rank: '2', suit: 'Diamonds', value: 2 }
    ],
    choices: [
      {
        id: 'c1',
        actionLabel: 'Wait 1 more turn: Discard 4♠, try to draw an Ace or Joker',
        isOptimal: true,
        scoreChange: 'Reduces score to ≤ 6 pts safely',
        explanation: '🛡️ Correct & Smart! Calling LEAST at 9 points when an opponent has only 3 cards is extremely risky. If Opponent A holds 8 points or fewer (e.g. 2+2+3=7), YOU receive the devastating 80-point False Call Penalty!'
      },
      {
        id: 'c2',
        actionLabel: 'Call "LEAST!" immediately at 9 points',
        isOptimal: false,
        scoreChange: 'High risk of +80 pt Penalty',
        explanation: '⚠️ High Risk Gamble. While 9 points is legally eligible (threshold is ≤ 10 pts), late in the round when opponents have 3 cards, typical winning hand totals are 3 to 7 points.'
      }
    ]
  },
  {
    id: 'scenario-4',
    title: 'Lab 4: Zero-Point Joker Wildcard Exploitation',
    difficulty: 'Beginner',
    context: 'The Table Joker is 7. You hold 7♠ and 7♥ in your hand alongside a 10♣ and Q♠.',
    jokerRank: '7',
    topDiscard: { id: 'd-9', rank: '9', suit: 'Spades', value: 9 },
    hand: [
      { id: '7-s', rank: '7', suit: 'Spades', value: 7 },
      { id: '7-h', rank: '7', suit: 'Hearts', value: 7 },
      { id: 'q-s', rank: 'Q', suit: 'Spades', value: 10 },
      { id: '10-c', rank: '10', suit: 'Clubs', value: 10 },
      { id: '3-d', rank: '3', suit: 'Diamonds', value: 3 },
      { id: 'A-c', rank: 'A', suit: 'Clubs', value: 1 }
    ],
    choices: [
      {
        id: 'c1',
        actionLabel: 'Discard Q♠ (10 pts) and keep both 7s in hand',
        isOptimal: true,
        scoreChange: 'Keep 0-pt Jokers for end score',
        explanation: '✨ Master Move! Because the Table Joker rank is 7, BOTH your 7♠ and 7♥ count as ZERO POINTS (0 pts) in your final hand. Dumping Q♠ eliminates a real 10-point liability while preserving your free zero-point cards!'
      },
      {
        id: 'c2',
        actionLabel: 'Discard pair 7♠ - 7♥ as a set',
        isOptimal: false,
        scoreChange: 'Throws away two 0-pt cards',
        explanation: '❌ Blunder! Why discard two cards that already count as 0 points? Keep your zero-point Jokers in hand until the end to win the round!'
      }
    ]
  },
  {
    id: 'scenario-5',
    title: 'Lab 5: The "Match & Skip" Tactical Strike',
    difficulty: 'Advanced',
    context: 'The discard pile top card is 9♥. You hold 9♠, 9♦, J♣, 8♣, 4♠, 2♥. What is the most devastating move?',
    jokerRank: '4',
    topDiscard: { id: 'd-9h', rank: '9', suit: 'Hearts', value: 9 },
    hand: [
      { id: '9-s', rank: '9', suit: 'Spades', value: 9 },
      { id: '9-d', rank: '9', suit: 'Diamonds', value: 9 },
      { id: 'j-c', rank: 'J', suit: 'Clubs', value: 10 },
      { id: '8-c', rank: '8', suit: 'Clubs', value: 8 },
      { id: '4-s', rank: '4', suit: 'Spades', value: 4 },
      { id: '2-h', rank: '2', suit: 'Hearts', value: 2 }
    ],
    choices: [
      {
        id: 'c1',
        actionLabel: 'Discard pair [9♠, 9♦] matching the top discard 9♥',
        isOptimal: true,
        scoreChange: 'Dumps 18 pts AND permanently shrinks hand size by 2!',
        explanation: '⚡ Masterstroke: Match & Skip Rule! In 7 Cards Least, when your discard matches the rank of the top card of the discard pile, your mandatory card pickup is SKIPPED. You shed 2 cards, draw 0 cards, and your hand drops from 6 to 4 cards!'
      },
      {
        id: 'c2',
        actionLabel: 'Discard single J♣ (10 pts) and draw 1 card',
        isOptimal: false,
        scoreChange: 'Standard 1-card exchange',
        explanation: '⚠️ Ordinary move. You shed 10 pts but must pick up 1 card, leaving your hand size at 6 cards.'
      }
    ]
  }
];

export const StrategyLabPage: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const scenario = SCENARIOS[currentScenarioIndex];

  useEffect(() => {
    updatePageSeo('strategy-lab');
  }, []);

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
  };

  const handleNextScenario = () => {
    setSelectedChoiceId(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  const renderSuitIcon = (suit: Suit) => {
    const isRed = suit === 'Hearts' || suit === 'Diamonds';
    const symbol = suit === 'Hearts' ? '♥' : suit === 'Diamonds' ? '♦' : suit === 'Clubs' ? '♣' : '♠';
    return <Text style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{symbol}</Text>;
  };

  const selectedChoice = scenario.choices.find(c => c.id === selectedChoiceId);

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
          <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>💡 Strategy Lab</Text></SeoLink>
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
            <Text style={styles.breadcrumbCurrent}>Strategy Lab</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>
            Interactive 7 Cards Least Strategy Lab
          </Text>
          <Text style={styles.subtitle}>
            Practice realistic tactical situations based on official 7 Cards Least rules. Test your decision-making and get instant expert feedback!
          </Text>

          {/* Scenario Selector Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {SCENARIOS.map((sc, idx) => (
              <TouchableOpacity
                key={sc.id}
                onPress={() => {
                  setCurrentScenarioIndex(idx);
                  setSelectedChoiceId(null);
                }}
                style={[styles.tabBtn, idx === currentScenarioIndex && styles.tabBtnActive]}
                accessibilityRole="button"
              >
                <Text style={[styles.tabText, idx === currentScenarioIndex && styles.tabTextActive]}>
                  {idx + 1}. {sc.difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ─── ACTIVE SCENARIO CARD ─── */}
          <View style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <View>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                <Text style={styles.difficultyBadge}>{scenario.difficulty} Level</Text>
              </View>
              <View style={styles.tableRefBox}>
                <Text style={styles.tableRefText}>Table Joker: <Text style={{ color: '#34d399', fontWeight: 'bold' }}>{scenario.jokerRank}</Text></Text>
                <Text style={styles.tableRefText}>Top Discard: <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>{scenario.topDiscard.rank} of {scenario.topDiscard.suit}</Text></Text>
              </View>
            </View>

            <Text style={styles.scenarioContext}>{scenario.context}</Text>

            {/* Hand Display */}
            <Text style={styles.handLabel}>Current Hand Cards:</Text>
            <View style={styles.handRow}>
              {scenario.hand.map((c) => {
                const isJoker = c.rank === scenario.jokerRank;
                return (
                  <View key={c.id} style={[styles.cardView, isJoker && styles.cardJoker]}>
                    <Text style={styles.cardRank}>{c.rank}</Text>
                    <Text style={styles.cardSuit}>{renderSuitIcon(c.suit)}</Text>
                    <Text style={styles.cardPts}>{isJoker ? '0 pts' : `${c.value} pts`}</Text>
                  </View>
                );
              })}
            </View>

            {/* Move Options */}
            <Text style={styles.choicesHeader}>Select Your Tactical Move:</Text>
            <View style={styles.choicesList}>
              {scenario.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                return (
                  <TouchableOpacity
                    key={choice.id}
                    onPress={() => handleSelectChoice(choice.id)}
                    style={[
                      styles.choiceBtn,
                      isSelected && (choice.isOptimal ? styles.choiceBtnOptimal : styles.choiceBtnSuboptimal)
                    ]}
                    accessibilityRole="button"
                  >
                    <View style={styles.choiceHeader}>
                      <Text style={[styles.choiceLabel, isSelected && styles.choiceLabelSelected]}>
                        {choice.actionLabel}
                      </Text>
                      <Text style={styles.choiceDelta}>{choice.scoreChange}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Immediate Tactical Breakdown Feedback */}
            {selectedChoice && (
              <View style={[styles.feedbackBox, selectedChoice.isOptimal ? styles.feedbackOptimal : styles.feedbackSuboptimal]}>
                <Text style={styles.feedbackTitle}>
                  {selectedChoice.isOptimal ? '🎉 OPTIMAL DECISION!' : '⚠️ SUB-OPTIMAL MOVE'}
                </Text>
                <Text style={styles.feedbackExplanation}>
                  {selectedChoice.explanation}
                </Text>

                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={handleNextScenario}
                  accessibilityRole="button"
                >
                  <Text style={styles.nextBtnText}>Next Tactical Scenario →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ─── IN-DEPTH STRATEGY GUIDE ARTICLE ─── */}
          <View style={styles.articleCard}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>
              Key Tactical Concepts in 7 Cards Least
            </Text>

            <Text style={styles.articleP}>
              Mastering 7 Cards Least requires shifting away from traditional rummy instincts. In traditional rummy, holding high pairs is standard practice. In 7 Cards Least, high unlinked cards (Kings, Queens, Jacks) represent an immediate 10-point liability each.
            </Text>

            <View style={styles.conceptBox}>
              <Text style={styles.conceptTitle}>1. The Match &amp; Skip Rule</Text>
              <Text style={styles.conceptText}>
                When you discard a card (or set) whose rank matches the top card of the discard pile, the rules state that your turn ends immediately without drawing. This drops your hand size from 7 to 6 (or from 7 to 5 if discarding a pair). Shrinking your hand is the fastest way to drop below 10 points.
              </Text>
            </View>

            <View style={styles.conceptBox}>
              <Text style={styles.conceptTitle}>2. Managing the 80-Point Penalty</Text>
              <Text style={styles.conceptText}>
                Just because you reach 9 or 10 points does not mean you should immediately yell "LEAST!". Always observe opponent card counts. If an opponent has only 2 or 3 cards left, their hand total could easily be under 5 points. Calling prematurely triggers an 80-point penalty that often costs the entire match.
              </Text>
            </View>

            <View style={styles.quickNavRow}>
              <SeoLink href="/daily-challenge" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🔥 Play Daily Challenge</Text>
              </SeoLink>
              <SeoLink href="/score-calculator" onNavigate={onNavigate} style={styles.quickNavBtn}>
                <Text style={styles.quickNavText}>🧮 Open Score Calculator</Text>
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
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  tabText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scenarioCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 22,
    marginBottom: 24,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  scenarioTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  difficultyBadge: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
    marginTop: 2,
  },
  tableRefBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tableRefText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginVertical: 1,
  },
  scenarioContext: {
    color: '#e2e8f0',
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38bdf8',
  },
  handLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  handRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  cardView: {
    width: 60,
    height: 86,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cardJoker: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  cardRank: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardSuit: {
    fontSize: 20,
  },
  cardPts: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  choicesHeader: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  choicesList: {
    gap: 10,
    marginBottom: 16,
  },
  choiceBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 14,
  },
  choiceBtnOptimal: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  choiceBtnSuboptimal: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  choiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choiceLabel: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  choiceLabelSelected: {
    color: '#ffffff',
  },
  choiceDelta: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  feedbackBox: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
  },
  feedbackOptimal: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10b981',
  },
  feedbackSuboptimal: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#f59e0b',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  feedbackExplanation: {
    color: '#cbd5e1',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 14,
  },
  nextBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  nextBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
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
    marginBottom: 12,
  },
  articleP: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  conceptBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  conceptTitle: {
    color: '#38bdf8',
    fontSize: 14.5,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  conceptText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
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
