import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

interface DemoCard {
  id: string;
  rank: string;
  suit: string;
  suitColor: string;
  points: number;
  isJoker?: boolean;
}

const DEMO_HAND: DemoCard[] = [
  { id: 'c1', rank: '7', suit: '♠', suitColor: '#000000', points: 0, isJoker: true },
  { id: 'c2', rank: '3', suit: '♥', suitColor: '#dc2626', points: 3 },
  { id: 'c3', rank: '3', suit: '♦', suitColor: '#dc2626', points: 3 },
  { id: 'c4', rank: '3', suit: '♣', suitColor: '#000000', points: 3 },
  { id: 'c5', rank: 'K', suit: '♦', suitColor: '#dc2626', points: 10 },
  { id: 'c6', rank: 'A', suit: '♠', suitColor: '#000000', points: 1 },
  { id: 'c7', rank: '5', suit: '♣', suitColor: '#000000', points: 5 },
];

export const SevenCardsLeastHowToPlayPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [discardPile, setDiscardPile] = useState<DemoCard[]>([
    { id: 'd1', rank: '10', suit: '♠', suitColor: '#000000', points: 10 }
  ]);
  const [discardFeedback, setDiscardFeedback] = useState<string>('Select cards from the hand below to test discarding!');
  const [drawnCard, setDrawnCard] = useState<string | null>(null);
  const [leastCalled, setLeastCalled] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo('7-cards-least-how-to-play');
  }, []);

  // Hand total calculation
  const totalHandScore = DEMO_HAND.reduce((sum, c) => sum + c.points, 0);
  const selectedCardsScore = DEMO_HAND.filter(c => selectedCardIds.includes(c.id)).reduce((sum, c) => sum + c.points, 0);

  const toggleSelectCard = (id: string) => {
    if (selectedCardIds.includes(id)) {
      setSelectedCardIds(selectedCardIds.filter(i => i !== id));
    } else {
      setSelectedCardIds([...selectedCardIds, id]);
    }
  };

  const handleTestDiscard = (type: 'set' | 'single') => {
    if (type === 'set') {
      const setCards = DEMO_HAND.filter(c => c.rank === '3');
      setDiscardPile(setCards);
      setDiscardFeedback('✅ Valid Set! You discarded three 3s (3♥ 3♦ 3♣) at once to drop 9 points in one turn!');
    } else {
      const singleCard = DEMO_HAND.find(c => c.rank === 'K');
      if (singleCard) {
        setDiscardPile([singleCard]);
        setDiscardFeedback('✅ High Card Discard! You dropped King of Diamonds (10 pts) to drastically cut your hand total.');
      }
    }
  };

  const handleSimulateDraw = (source: 'deck' | 'pile') => {
    if (source === 'deck') {
      setDrawnCard('Drew 2♣ (2 pts) from secret Deck 🎴');
    } else {
      setDrawnCard('Drew 3♦ (3 pts) from face-up Discard Pile 🃏');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ─── SITE NAVBAR ─── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => onNavigate('/')} accessibilityRole="button" accessibilityLabel="Home">
          <Text style={styles.brandTitle}>🃏 7 Cards Least</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navLinks}>
          <TouchableOpacity onPress={() => onNavigate('/')} style={styles.navBtn}><Text style={styles.navText}>Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least')} style={styles.navBtn}><Text style={styles.navText}>7 Cards Least</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/rules')} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/how-to-play')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>How to Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/play-against-ai')} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity onPress={() => onNavigate('/')}><Text style={styles.breadcrumbLink}>Home</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <TouchableOpacity onPress={() => onNavigate('/7-cards-least')}><Text style={styles.breadcrumbLink}>7 Cards Least</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>How to Play</Text>
          </View>

          <Text style={styles.h1}>Interactive How to Play 7 Cards Least</Text>
          <Text style={styles.subtitle}>Try out cards, test discards, and learn how to win 7 Cards Least step-by-step!</Text>

          {/* ⚡ TOP HERO PLAY CTA CARD ⚡ */}
          <View style={styles.topHeroCard}>
            <Text style={styles.topHeroTitle}>🎴 Ready to Play?</Text>
            <Text style={styles.topHeroSubtitle}>Jump straight into a 7 Cards Least table online!</Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.heroPlayCta} onPress={() => onNavigate('/')}>
                <Text style={styles.heroPlayCtaText}>⚡ Play Free Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroAiCta} onPress={() => onNavigate('/play-against-ai')}>
                <Text style={styles.heroAiCtaText}>🤖 Play vs Computer AI</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── INTERACTIVE TUTORIAL STEP SWITCHER ─── */}
          <View style={styles.tutorialContainer}>
            <Text style={styles.tutorialHeaderTitle}>🎮 Interactive Game Tutorial</Text>

            {/* Step Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepTabsRow}>
              {[
                { step: 1, title: '1. Setup' },
                { step: 2, title: '2. Hand & Scores' },
                { step: 3, title: '3. Discarding' },
                { step: 4, title: '4. Drawing' },
                { step: 5, title: '5. Call Least!' },
              ].map(s => (
                <TouchableOpacity
                  key={s.step}
                  style={[styles.stepTab, activeStep === s.step && styles.activeStepTab]}
                  onPress={() => setActiveStep(s.step)}
                >
                  <Text style={[styles.stepTabText, activeStep === s.step && styles.activeStepTabText]}>{s.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── STEP 1 CONTENT ── */}
            {activeStep === 1 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepBoxTitle}>Step 1: Choose Game Mode & Launch</Text>
                <Text style={styles.stepBoxDesc}>
                  Select your nickname and choose whether to practice solo against smart AI bots or create a multiplayer table for friends.
                </Text>

                <View style={styles.demoSetupBox}>
                  <Text style={styles.demoSetupLabel}>Interactive Mode Selector Preview:</Text>
                  <View style={styles.demoBtnGroup}>
                    <TouchableOpacity style={styles.demoOptionActive} onPress={() => onNavigate('/')}>
                      <Text style={styles.demoOptionActiveText}>👥 Quick Match (Multiplayer)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.demoOption} onPress={() => onNavigate('/play-against-ai')}>
                      <Text style={styles.demoOptionText}>🤖 Play vs AI (Solo)</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.nextStepBtn} onPress={() => setActiveStep(2)}>
                  <Text style={styles.nextStepText}>Next: Understand Your Hand →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 2 CONTENT ── */}
            {activeStep === 2 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepBoxTitle}>Step 2: Understand Your 7 Cards & Score</Text>
                <Text style={styles.stepBoxDesc}>
                  Tap any card below to see its value. Notice how the <Text style={styles.boldText}>7 of Spades ♠</Text> acts as a Wildcard Joker worth <Text style={styles.boldText}>0 points</Text>!
                </Text>

                {/* Score summary badge */}
                <View style={styles.scoreBadgeRow}>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeLabel}>Total Hand Score:</Text>
                    <Text style={styles.scoreBadgeValue}>{totalHandScore} Points</Text>
                  </View>
                  {selectedCardIds.length > 0 && (
                    <View style={[styles.scoreBadge, { backgroundColor: '#1e293b' }]}>
                      <Text style={styles.scoreBadgeLabel}>Selected Cards:</Text>
                      <Text style={styles.scoreBadgeValue}>{selectedCardsScore} pts ({selectedCardIds.length} cards)</Text>
                    </View>
                  )}
                </View>

                {/* Interactive Card Hand */}
                <Text style={styles.handInstructionText}>Tap cards to select/inspect them:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardHandRow}>
                  {DEMO_HAND.map(c => {
                    const isSelected = selectedCardIds.includes(c.id);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.playingCard,
                          isSelected && styles.playingCardSelected,
                          c.isJoker && styles.jokerCard
                        ]}
                        onPress={() => toggleSelectCard(c.id)}
                      >
                        <Text style={[styles.cardRank, { color: c.suitColor }]}>{c.rank}</Text>
                        <Text style={[styles.cardSuit, { color: c.suitColor }]}>{c.suit}</Text>
                        <View style={styles.cardPointBadge}>
                          <Text style={styles.cardPointText}>{c.points} pt{c.points === 1 ? '' : 's'}</Text>
                        </View>
                        {c.isJoker && <Text style={styles.jokerLabel}>JOKER ⭐</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity style={styles.nextStepBtn} onPress={() => setActiveStep(3)}>
                  <Text style={styles.nextStepText}>Next: Practice Discarding →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 3 CONTENT ── */}
            {activeStep === 3 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepBoxTitle}>Step 3: Discard a Card or Combination</Text>
                <Text style={styles.stepBoxDesc}>
                  You can discard a single high card or drop equal rank sets (e.g. 3♥ 3♦ 3♣) and suited runs to quickly drain your hand points!
                </Text>

                {/* Action buttons */}
                <View style={styles.discardActionsRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleTestDiscard('set')}>
                    <Text style={styles.actionBtnText}>🔥 Test Discard Set (3♥ 3♦ 3♣)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => handleTestDiscard('single')}>
                    <Text style={styles.actionBtnText}>👑 Test High Card Discard (K♦)</Text>
                  </TouchableOpacity>
                </View>

                {/* Feedback note */}
                <Text style={styles.feedbackBox}>{discardFeedback}</Text>

                {/* Discard Pile visual preview */}
                <View style={styles.discardPileBox}>
                  <Text style={styles.discardPileTitle}>Current Discard Pile:</Text>
                  <View style={styles.discardPileCards}>
                    {discardPile.map((c, i) => (
                      <View key={i} style={styles.miniCard}>
                        <Text style={[styles.miniCardText, { color: c.suitColor }]}>{c.rank}{c.suit}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.nextStepBtn} onPress={() => setActiveStep(4)}>
                  <Text style={styles.nextStepText}>Next: Practice Drawing →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 4 CONTENT ── */}
            {activeStep === 4 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepBoxTitle}>Step 4: Draw a Replacement Card</Text>
                <Text style={styles.stepBoxDesc}>
                  After discarding, pick up a new card. You can draw blindly from the face-down Deck or take the visible top card from the Discard Pile.
                </Text>

                <View style={styles.drawPilesRow}>
                  <TouchableOpacity style={styles.pileContainer} onPress={() => handleSimulateDraw('deck')}>
                    <View style={styles.faceDownDeck}>
                      <Text style={styles.deckSymbol}>🎴</Text>
                      <Text style={styles.deckLabel}>Secret Deck</Text>
                    </View>
                    <Text style={styles.drawPileActionText}>Tap to Draw from Deck</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pileContainer} onPress={() => handleSimulateDraw('pile')}>
                    <View style={styles.faceUpPile}>
                      <Text style={styles.pileCardText}>3♦</Text>
                      <Text style={styles.deckLabel}>Discard Top</Text>
                    </View>
                    <Text style={styles.drawPileActionText}>Tap to Draw 3♦</Text>
                  </TouchableOpacity>
                </View>

                {drawnCard && (
                  <Text style={styles.drawnFeedbackBox}>✨ {drawnCard}</Text>
                )}

                <TouchableOpacity style={styles.nextStepBtn} onPress={() => setActiveStep(5)}>
                  <Text style={styles.nextStepText}>Next: Learn How to Call Least →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 5 CONTENT ── */}
            {activeStep === 5 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepBoxTitle}>Step 5: Call "Least!" to Win the Round</Text>
                <Text style={styles.stepBoxDesc}>
                  When your hand score is low enough (typically under 10-15 pts), tap <Text style={styles.boldText}>LEAST!</Text> on your turn to end the round. If you have the lowest score, you get <Text style={styles.boldText}>0 points</Text>!
                </Text>

                <View style={styles.callLeastDemoBox}>
                  <TouchableOpacity
                    style={[styles.callLeastBtn, leastCalled && styles.callLeastBtnActive]}
                    onPress={() => setLeastCalled(true)}
                  >
                    <Text style={styles.callLeastBtnText}>{leastCalled ? '🎉 LEAST CALLED!' : '⚡ TAP TO CALL "LEAST!"'}</Text>
                  </TouchableOpacity>
                </View>

                {leastCalled && (
                  <View style={styles.victoryCard}>
                    <Text style={styles.victoryTitle}>🏆 Round Complete!</Text>
                    <Text style={styles.victorySub}>You had the lowest score and won the round!</Text>

                    <View style={styles.scoreTable}>
                      <View style={styles.scoreTableRow}><Text style={styles.scoreTablePlayer}>You (Caller)</Text><Text style={styles.scoreTablePoints}>0 pts (Winner!)</Text></View>
                      <View style={styles.scoreTableRow}><Text style={styles.scoreTablePlayer}>Bot Alex</Text><Text style={styles.scoreTablePoints}>14 pts</Text></View>
                      <View style={styles.scoreTableRow}><Text style={styles.scoreTablePlayer}>Bot Sam</Text><Text style={styles.scoreTablePoints}>22 pts</Text></View>
                    </View>
                  </View>
                )}

                <View style={styles.ctaRow}>
                  <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                    <Text style={styles.ctaText}>⚡ Play 7 Cards Least Online Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/7-cards-least/rules')}>
                    <Text style={styles.secondaryCtaText}>📖 Read Full Rules</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ─── FOOTER ─── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>7 Cards Least • cards.gnanamai.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#062d12' },
  navbar: {
    backgroundColor: '#0a1628',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginRight: 16 },
  navLinks: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  activeNavBtn: { backgroundColor: '#0275d8' },
  navText: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },
  activeNavText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },

  scrollContent: { flexGrow: 1, padding: 16, alignItems: 'center' },
  container: { width: '100%' },
  containerWide: { maxWidth: 800 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 12 },
  breadcrumbLink: { color: '#38bdf8', fontSize: 14, fontWeight: '600' },
  breadcrumbSep: { color: '#64748b', fontSize: 14 },
  breadcrumbCurrent: { color: '#94a3b8', fontSize: 14 },

  h1: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#94a3b8', fontSize: 16, lineHeight: 24, marginBottom: 20 },

  topHeroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  topHeroTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  topHeroSubtitle: { color: '#cbd5e1', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  heroPlayCta: { backgroundColor: '#22c55e', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10, minHeight: 48, justifyContent: 'center', shadowColor: '#22c55e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6 },
  heroPlayCtaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  heroAiCta: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10, minHeight: 48, justifyContent: 'center' },
  heroAiCtaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

  // ── TUTORIAL STYLES ──
  tutorialContainer: {
    backgroundColor: '#0a1628',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 24,
  },
  tutorialHeaderTitle: { color: '#fbbf24', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  stepTabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, paddingBottom: 4 },
  stepTab: { backgroundColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  activeStepTab: { backgroundColor: '#0275d8', borderColor: '#38bdf8' },
  stepTabText: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold' },
  activeStepTabText: { color: '#ffffff' },

  stepBox: { backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  stepBoxTitle: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  stepBoxDesc: { color: '#cbd5e1', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  boldText: { color: '#fbbf24', fontWeight: 'bold' },

  demoSetupBox: { backgroundColor: '#1e293b', padding: 16, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
  demoSetupLabel: { color: '#94a3b8', fontSize: 13, marginBottom: 10 },
  demoBtnGroup: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  demoOptionActive: { backgroundColor: '#0275d8', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  demoOptionActiveText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  demoOption: { backgroundColor: '#334155', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  demoOptionText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 14 },

  nextStepBtn: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  nextStepText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

  scoreBadgeRow: { flexDirection: 'row', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
  scoreBadge: { backgroundColor: '#065f46', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, flex: 1, minWidth: 140, alignItems: 'center' },
  scoreBadgeLabel: { color: '#a7f3d0', fontSize: 12 },
  scoreBadgeValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 2 },

  handInstructionText: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  cardHandRow: { flexDirection: 'row', gap: 8, paddingVertical: 10 },
  playingCard: { width: 64, height: 92, backgroundColor: '#ffffff', borderRadius: 8, padding: 6, justifyContent: 'space-between', borderWidth: 2, borderColor: '#cbd5e1' },
  playingCardSelected: { borderColor: '#eab308', transform: [{ translateY: -10 }], shadowColor: '#eab308', shadowOpacity: 0.8, shadowRadius: 6 },
  jokerCard: { backgroundColor: '#fef08a', borderColor: '#eab308' },
  cardRank: { fontSize: 16, fontWeight: 'bold' },
  cardSuit: { fontSize: 20, alignSelf: 'center' },
  cardPointBadge: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4, paddingVertical: 2, alignItems: 'center' },
  cardPointText: { color: '#334155', fontSize: 10, fontWeight: 'bold' },
  jokerLabel: { color: '#b45309', fontSize: 8, fontWeight: 'bold', textAlign: 'center', marginTop: 1 },

  discardActionsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 12 },
  actionBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, flex: 1, minWidth: 150, alignItems: 'center' },
  actionBtnSecondary: { backgroundColor: '#7c3aed', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, flex: 1, minWidth: 150, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  feedbackBox: { backgroundColor: '#1e293b', color: '#38bdf8', padding: 12, borderRadius: 8, fontSize: 14, lineHeight: 20, marginBottom: 14 },
  discardPileBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 8, marginBottom: 12 },
  discardPileTitle: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  discardPileCards: { flexDirection: 'row', gap: 8 },
  miniCard: { width: 42, height: 58, backgroundColor: '#ffffff', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  miniCardText: { fontSize: 14, fontWeight: 'bold' },

  drawPilesRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginVertical: 12, flexWrap: 'wrap' },
  pileContainer: { alignItems: 'center' },
  faceDownDeck: { width: 70, height: 96, backgroundColor: '#1e3a8a', borderRadius: 8, borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  deckSymbol: { fontSize: 28 },
  deckLabel: { color: '#93c5fd', fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  faceUpPile: { width: 70, height: 96, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 2, borderColor: '#dc2626', justifyContent: 'center', alignItems: 'center' },
  pileCardText: { color: '#dc2626', fontSize: 22, fontWeight: 'bold' },
  drawPileActionText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold', marginTop: 6 },
  drawnFeedbackBox: { backgroundColor: '#065f46', color: '#a7f3d0', padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },

  callLeastDemoBox: { alignItems: 'center', marginVertical: 16 },
  callLeastBtn: { backgroundColor: '#dc2626', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12, shadowColor: '#dc2626', shadowOpacity: 0.5, shadowRadius: 8 },
  callLeastBtnActive: { backgroundColor: '#16a34a' },
  callLeastBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  victoryCard: { backgroundColor: '#064e3b', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#34d399', marginBottom: 16 },
  victoryTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  victorySub: { color: '#a7f3d0', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  scoreTable: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10 },
  scoreTableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  scoreTablePlayer: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  scoreTablePoints: { color: '#fbbf24', fontSize: 13, fontWeight: 'bold' },

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#334155', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});

