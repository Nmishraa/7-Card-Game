import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Image } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { GamePreviewSection } from '../components/GamePreviewSection';
import { SeoLink } from '../components/SeoLink';
import { UserHeaderBadge } from '../components/UserHeaderBadge';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const SevenCardsLeastMainPage: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqList = [
    {
      q: "What is 7 Cards Least?",
      a: "7 Cards Least is a strategic lowest score card game played with a 52-card deck. Players try to shed high-value cards, form matching sets and suited runs, and declare 'Least!' when their total hand score drops to 10 points or less."
    },
    {
      q: "How do Joker wildcards work?",
      a: "During round setup, one card is flipped face-up next to the draw pile to establish the zero-point Joker rank. Any card matching this rank in a player's hand counts as 0 points!"
    },
    {
      q: "What is the penalty for a false Least call?",
      a: "If you declare 'Least!' but an opponent holds an equal or lower total hand score, you incur an 80-point penalty added to your round score."
    },
    {
      q: "Can I play 7 Cards Least solo against computer AI?",
      a: "Yes! Singleplayer mode allows instant play against 1 to 7 smart computer AI bots with custom round lengths and turn timers."
    },
    {
      q: "Is 7 Cards Least free to play without download?",
      a: "Yes, 7 Cards Least is 100% free to play directly in your web browser with no download or signups required."
    }
  ];

  useEffect(() => {
    updatePageSeo('7-cards-least');
  }, []);

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
          <SeoLink href="/7-cards-least" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>7 Cards Least</Text></SeoLink>
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></SeoLink>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></SeoLink>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></SeoLink>
          <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></SeoLink>
          <SeoLink href="/daily-challenge" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>🔥 Daily Challenge</Text></SeoLink>
          <SeoLink href="/strategy-lab" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>💡 Strategy Lab</Text></SeoLink>
          <SeoLink href="/score-calculator" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>🧮 Calculator</Text></SeoLink>
          <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></SeoLink>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></SeoLink>
        </ScrollView>
        <UserHeaderBadge user={user} onLogout={onLogout} onNavigate={onNavigate} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumb Navigation */}
          <View style={styles.breadcrumbRow}>
            <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>Home</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>7 Cards Least</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>7 Cards Least Game Online – Official Guide &amp; Portal</Text>
          <Text style={styles.subtitle}>
            Welcome to the official portal for 7 Cards Least (also known as 7 Card Game or Low Hand Rummy). Discover complete deck mechanics, Joker wildcard rules, turn sequences, and lowest-score strategies.
          </Text>

          {/* ⚡ TOP HERO PLAY CTA CARD ⚡ */}
          <View style={styles.topHeroCard}>
            <Text style={styles.topHeroTitle}>🎴 Ready to Play 7 Cards Least?</Text>
            <Text style={styles.topHeroSubtitle}>Play online instantly in your browser with friends or smart computer AI. No download required!</Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.heroPlayCta}>
                <Text style={styles.heroPlayCtaText}>⚡ Play Free Now</Text>
              </SeoLink>
              <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.heroAiCta}>
                <Text style={styles.heroAiCtaText}>🤖 Practice vs Computer AI</Text>
              </SeoLink>
            </View>
          </View>

          {/* Game Preview Screenshot Section */}
          <GamePreviewSection />

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>What Is 7 Cards Least?</Text>
            <Text style={styles.bodyText}>
              7 Cards Least is a strategic lowest-score card shedding game played with a standard 52-card deck. Unlike classic card games where the goal is to accumulate high points, 7 Cards Least inverts traditional scoring: each player is dealt 7 cards, and the goal is to systematically minimize your hand total by discarding high cards, assembling matching rank sets, and building suited runs.
              {'\n\n'}
              When a player calculates that their total hand value has dropped to <Text style={styles.boldText}>10 points or less</Text>, they declare <Text style={styles.boldText}>"LEAST!"</Text> during their turn. The player holding the lowest score wins the round with zero penalty points!
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Deck Setup &amp; The Table Joker Wildcard</Text>
            <Text style={styles.bodyText}>
              A match is played with a standard 52-card deck (single deck for 2 to 5 players, two decks shuffled together for 6 to 8 players) without physical joker cards.
              {'\n\n'}
              • <Text style={styles.boldText}>Table Joker Selection:</Text> At the start of each round, 1 card is flipped face-up from the deck into the center table. The rank of this card establishes the <Text style={styles.boldText}>zero-point Joker rank</Text> for the entire round. Any card of matching rank held in any player's hand scores <Text style={styles.boldText}>0 points</Text>!
              {'\n'}• <Text style={styles.boldText}>Dealing:</Text> Every player is dealt exactly 7 cards.
              {'\n'}• <Text style={styles.boldText}>Discard Pile Open:</Text> A second card is flipped face-up adjacent to the draw deck to start the active Discard Pile.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Card Point Values &amp; Scoring System</Text>
            <Text style={styles.bodyText}>
              Every card remaining in your hand when a round concludes contributes directly to your penalty score:
              {'\n'}• <Text style={styles.boldText}>Ace (A):</Text> 1 Point (the lowest standard card).
              {'\n'}• <Text style={styles.boldText}>Numbered Cards (2 to 10):</Text> Face value (2–10 points corresponding to card rank).
              {'\n'}• <Text style={styles.boldText}>Face Cards (Jack, Queen, King):</Text> 10 Points each (high liability cards to discard early).
              {'\n'}• <Text style={styles.boldText}>Table Joker Rank:</Text> 0 Points (established by the table setup card).
            </Text>
            <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>View complete official rules &amp; scoring reference →</Text>
            </SeoLink>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Turn Progression &amp; Actions</Text>
            <Text style={styles.bodyText}>
              Turns advance in a clockwise direction around the table. Each turn consists of two distinct phases:
              {'\n\n'}
              1. <Text style={styles.boldText}>Phase 1 – Discarding:</Text> You must discard valid cards onto the Discard Pile. Valid combinations include:
              {'\n'}   - A single card (e.g. King of Spades).
              {'\n'}   - An equal-rank set of 2+ cards (e.g. 7♥ 7♦ or 9♠ 9♥ 9♣).
              {'\n'}   - A suited run of 3+ consecutive cards in the same suit (e.g. 4♣ 5♣ 6♣).
              {'\n\n'}
              2. <Text style={styles.boldText}>The Match &amp; Skip Rule:</Text> If your discarded card matches the rank of the current top card of the Discard Pile, your turn concludes immediately! You do not have to draw a replacement card, permanently decreasing your hand size.
              {'\n\n'}
              3. <Text style={styles.boldText}>Phase 2 – Drawing:</Text> If your discard does not match the pile rank, draw 1 card from either the face-down Draw Deck or the face-up Discard Pile.
            </Text>
            <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Step-by-step interactive beginner tutorial →</Text>
            </SeoLink>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Calling "LEAST!" &amp; The 80-Point Penalty</Text>
            <Text style={styles.bodyText}>
              When your total hand score is 10 points or less, you can declare <Text style={styles.boldText}>"LEAST!"</Text> on your turn to halt the round. All players reveal their hands:
              {'\n\n'}
              • <Text style={styles.boldText}>Successful Call:</Text> If your hand score is strictly lower than every opponent, you win the round and score <Text style={styles.boldText}>0 points</Text>. Opponents receive points equal to their hand score minus your winning score.
              {'\n'}• <Text style={styles.boldText}>False Call (The 80-Point Penalty):</Text> If ANY opponent holds an equal or lower hand score than your hand, your call fails! You incur a heavy <Text style={styles.boldText}>80-point penalty</Text> added to your match score, while the true lowest player wins the round.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Match Structure &amp; Elimination</Text>
            <Text style={styles.bodyText}>
              Matches consist of 1 to 20 rounds (customizable by the table host). Points accumulate from round to round. Any player whose cumulative score reaches or exceeds <Text style={styles.boldText}>200 points</Text> is eliminated from the game. When the designated rounds finish or only one player survives, the player with the lowest total score is crowned champion.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Winning Strategy Overview</Text>
            <Text style={styles.bodyText}>
              Top players prioritize discarding high-point face cards (J, Q, K) during the first 3 turns, hold zero-point Jokers to construct game-ending low hands, watch opponent pickup choices from the discard pile, and only declare Least when their hand is safely below 6 points to guard against the 80-point penalty.
            </Text>
            <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Explore in-depth tactical strategies &amp; hand examples →</Text>
            </SeoLink>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Game Modes: Solo AI &amp; Real-Time Multiplayer</Text>
            <Text style={styles.bodyText}>
              Play 7 Cards Least in whichever mode suits your schedule:
              {'\n\n'}
              • <Text style={styles.boldText}>Singleplayer vs Computer AI:</Text> Practice against 1 to 7 smart computer bots with zero wait time and adjustable turn limits.
              {'\n'}• <Text style={styles.boldText}>Real-Time Online Multiplayer:</Text> Create private room lobbies with 4-digit codes, share WhatsApp invite links, and play with friends and family across mobile or desktop browsers.
            </Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.primaryCta}>
                <Text style={styles.ctaText}>⚡ Play 7 Cards Least Now</Text>
              </SeoLink>
              <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>👥 Multiplayer Mode</Text>
              </SeoLink>
              <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>🤖 Play vs AI Bots</Text>
              </SeoLink>
            </View>
          </View>

          <View style={[styles.cardSection, { backgroundColor: 'rgba(10, 22, 40, 0.95)', borderColor: 'rgba(56, 189, 248, 0.25)' }]}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Frequently Asked Questions (FAQ)</Text>
            <Text style={[styles.bodyText, { marginBottom: 14 }]}>
              Quick answers about 7 Cards Least rules, wildcards, and game options.
            </Text>

            <View style={{ gap: 10 }}>
              {faqList.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <View 
                    key={index}
                    style={{
                      backgroundColor: isOpen ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: isOpen ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255,255,255,0.08)',
                      overflow: 'hidden'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setOpenFaqIndex(isOpen ? null : index)}
                      style={{
                        padding: 14,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={faq.q}
                    >
                      <Text style={{ color: isOpen ? '#38bdf8' : '#ffffff', fontSize: 15, fontWeight: 'bold', flex: 1, paddingRight: 10 }}>
                        {faq.q}
                      </Text>
                      <Text style={{ color: isOpen ? '#38bdf8' : '#64748b', fontSize: 16, fontWeight: 'bold' }}>
                        {isOpen ? '▲' : '▼'}
                      </Text>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={{ paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 }}>
                        <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 22 }}>
                          {faq.a}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Explore comprehensive FAQ &amp; support page →</Text>
            </SeoLink>
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
  brandLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 16 },
  navLogoBadge: { width: 32, height: 32 },
  brandTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  navScroll: { flex: 1, marginHorizontal: 8 },
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

  cardSection: {
    backgroundColor: 'rgba(10, 22, 40, 0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  h2: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  bodyText: { color: '#cbd5e1', fontSize: 15, lineHeight: 24 },
  boldText: { color: '#fbbf24', fontWeight: 'bold' },
  inlineCta: { marginTop: 12 },
  inlineCtaText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 14 },

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

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

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
