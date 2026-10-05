import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { GamePreviewSection } from '../components/GamePreviewSection';

interface Props {
  onNavigate: (route: string) => void;
}

export const SevenCardsLeastMainPage: React.FC<Props> = ({ onNavigate }) => {
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
        <TouchableOpacity onPress={() => onNavigate('/')} accessibilityRole="button" accessibilityLabel="Home">
          <Text style={styles.brandTitle}>🃏 7 Cards Least</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navLinks}>
          <TouchableOpacity onPress={() => onNavigate('/')} style={styles.navBtn}><Text style={styles.navText}>Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>7 Cards Least</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/rules')} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/how-to-play')} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/play-against-ai')} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumb Navigation */}
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity onPress={() => onNavigate('/')}><Text style={styles.breadcrumbLink}>Home</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>7 Cards Least</Text>
          </View>

          <Text style={styles.h1}>7 Cards Least Game Online</Text>
          <Text style={styles.subtitle}>
            7 Cards Least Game Online is a free lowest score card game where players try to finish with the least score. This least score card game is easy to learn and can be played online with friends and family.
          </Text>

          {/* ⚡ TOP HERO PLAY CTA CARD ⚡ */}
          <View style={styles.topHeroCard}>
            <Text style={styles.topHeroTitle}>🎴 Ready to Play 7 Cards Least?</Text>
            <Text style={styles.topHeroSubtitle}>Play online instantly in your browser. No download required!</Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.heroPlayCta} onPress={() => onNavigate('/')}>
                <Text style={styles.heroPlayCtaText}>⚡ Play Free Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroAiCta} onPress={() => onNavigate('/play-against-ai')}>
                <Text style={styles.heroAiCtaText}>🤖 Practice vs Computer AI</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Game Preview Screenshot Section */}
          <GamePreviewSection />



          <View style={styles.cardSection}>
            <Text style={styles.h2}>What Is 7 Cards Least?</Text>
            <Text style={styles.bodyText}>
              7 Cards Least (often known simply as 7 Card Game or Low Hand Rummy) is a fast-paced card shedding game played with a standard 52-card deck. Players are dealt 7 cards each and aim to shed high-value point cards, form matching sets and suited runs, and declare "Least!" when their total hand score drops below all opponents.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>How to Play 7 Cards Least</Text>
            <Text style={styles.bodyText}>
              Turns move in an anticlockwise direction. On your turn, you perform two primary actions:
              {'\n'}1. <Text style={styles.boldText}>Discard first:</Text> Select a single card, an equal rank set (e.g. 8♠ 8♥ 8♦), or a suited run (e.g. 4♣ 5♣ 6♣) to drop onto the central Discard Pile.
              {'\n'}2. <Text style={styles.boldText}>Draw next:</Text> Draw one replacement card from either the face-down Deck or face-up Discard Pile.
            </Text>
            <TouchableOpacity onPress={() => onNavigate('/7-cards-least/how-to-play')} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Read full beginner guide →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>7 Cards Least Rules</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>Card Values:</Text> Ace = 1 pt, Cards 2–10 = face value, Face cards (J, Q, K) = 10 pts.
              {'\n'}• <Text style={styles.boldText}>Joker Wildcards:</Text> The face-up card flipped during round setup establishes the zero-point Joker rank. Any matching rank card in your hand counts as 0 points.
              {'\n'}• <Text style={styles.boldText}>Match &amp; Skip:</Text> Discarding a card matching the rank of the current top discard ends your turn immediately without drawing.
              {'\n'}• <Text style={styles.boldText}>Penalty Rule:</Text> Calling Least when an opponent has an equal or lower hand score incurs an <Text style={styles.boldText}>80-point penalty</Text>.
            </Text>
            <TouchableOpacity onPress={() => onNavigate('/7-cards-least/rules')} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Explore full official rules →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>How the Game Works</Text>
            <Text style={styles.bodyText}>
              A match consists of 1 to 20 rounds (customizable when creating private tables). Round winners earn 0 points, while opponents accumulate points based on their remaining hand totals. Players reaching 200 cumulative points are eliminated until one final winner stands.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>7 Cards Least Scoring</Text>
            <Text style={styles.bodyText}>
              Keeping your hand score minimal is the core of 7 Cards Least. Holding un-matched face cards exposes you to high scores. Utilizing Joker ranks and multi-card discards keeps your point total safe before calling Least.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>7 Cards Least Strategy</Text>
            <Text style={styles.bodyText}>
              Prioritize shedding high cards early, hold Joker wildcards to clear multi-card runs, observe opponent discard picks, and only call Least when your hand score is safely under 7 points.
            </Text>
            <TouchableOpacity onPress={() => onNavigate('/7-cards-least/strategy')} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Discover winning strategy tips →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Play 7 Cards Least Online</Text>
            <Text style={styles.bodyText}>
              Enjoy 7 Cards Least in your web browser with zero download required. Play solo vs intelligent computer AI bots or join real-time multiplayer rooms with friends using 4-digit table codes.
            </Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Play 7 Cards Least Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/play-against-ai')}>
                <Text style={styles.secondaryCtaText}>🤖 Play vs Computer AI</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.cardSection, { backgroundColor: 'rgba(10, 22, 40, 0.95)', borderColor: 'rgba(56, 189, 248, 0.25)' }]}>
            <Text style={styles.h2}>Frequently Asked Questions (FAQ)</Text>
            <Text style={[styles.bodyText, { marginBottom: 14 }]}>
              Common questions about rules, wildcards, scoring, and playing online with friends.
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

            <TouchableOpacity onPress={() => onNavigate('/7-cards-least/faq')} style={styles.inlineCta}>
              <Text style={styles.inlineCtaText}>Explore full FAQ &amp; support page →</Text>
            </TouchableOpacity>
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
