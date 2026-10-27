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
            An indie tactical card game where the lowest hand score wins. Learn deck setup, zero-point table Jokers, Match &amp; Skip mechanics, and tournament survival.
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
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>What Makes 7 Cards Least Different?</Text>
            <Text style={styles.bodyText}>
              Welcome to the official 7 Cards Least knowledge portal. Unlike traditional card games that reward point hoarding or meld construction, 7 Cards Least is built on <Text style={styles.boldText}>pure hand reduction</Text>.
              {'\n\n'}
              Each player starts with 7 dealt cards, working to discard point liabilities and maneuver their hand sum down to 10 points or lower to declare <Text style={styles.boldText}>"LEAST!"</Text>.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>🌟 The 4 Core Mechanics of 7 Cards Least</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>1. Point Liability Shedding:</Text> High cards (J, Q, K = 10 pts) are dangerous liabilities. Players rapidly shed points by discarding equal-rank pairs/triples or suited consecutive runs.
              {'\n\n'}• <Text style={styles.boldText}>2. Dynamic Table Jokers:</Text> At the start of every round, one setup card is flipped in the center. All four cards of that matching rank become <Text style={styles.boldText}>0-point wildcards</Text> for the entire round.
              {'\n\n'}• <Text style={styles.boldText}>3. Match &amp; Skip Acceleration:</Text> Matching the exact rank of the discard pile top skips your draw phase, permanently decreasing your hand size and speeding up your path to victory.
              {'\n\n'}• <Text style={styles.boldText}>4. The High-Stakes Showdown:</Text> When your hand totals ≤ 10 points, call "LEAST!". If you hold the lowest score, you earn 0 penalty points; but if an opponent ties or beats you, you suffer a devastating <Text style={styles.boldText}>80-point penalty</Text>.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>📚 Complete 7 Cards Least Guide Network</Text>
            <Text style={styles.bodyText}>
              Explore our dedicated in-depth resources tailored for every stage of your gameplay:
            </Text>

            <View style={{ gap: 12, marginTop: 14 }}>
              <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <Text style={{ color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>📖 Official Rules &amp; Scoring</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                  Complete point breakdown (Ace=1, Numbers=2-10, Face=10, Joker=0), relative difference scoring, and the 80-point wrong call penalty.
                </Text>
                <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.inlineCta}>
                  <Text style={styles.inlineCtaText}>Read Official Rules →</Text>
                </SeoLink>
              </View>

              <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <Text style={{ color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>🎓 Step-by-Step How to Play</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                  Beginner tutorial covering dealing, multi-card discards, drawing, and a complete turn-by-turn worked sample round.
                </Text>
                <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.inlineCta}>
                  <Text style={styles.inlineCtaText}>Start How to Play Tutorial →</Text>
                </SeoLink>
              </View>

              <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <Text style={{ color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>🧠 Winning Strategy &amp; Tactics</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                  Advanced discard order, opponent pickup tracking, the 0–10 point call risk matrix, and multi-round 200-point tournament survival.
                </Text>
                <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.inlineCta}>
                  <Text style={styles.inlineCtaText}>Explore Strategy Guide →</Text>
                </SeoLink>
              </View>

              <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <Text style={{ color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>❓ Frequently Asked Questions (FAQ)</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                  Detailed answers to edge-case questions: ties, reshuffling, zero-card hand calls, and room host controls.
                </Text>
                <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.inlineCta}>
                  <Text style={styles.inlineCtaText}>View All FAQs →</Text>
                </SeoLink>
              </View>
            </View>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>🎮 Interactive Practice &amp; Game Modes</Text>
            <Text style={styles.bodyText}>
              Play 7 Cards Least in whichever mode suits your schedule:
              {'\n\n'}
              • <Text style={styles.boldText}>Singleplayer vs Computer AI:</Text> Practice against intelligent computer bots with zero wait time in{' '}
              <SeoLink href="/play-against-ai" onNavigate={onNavigate}><Text style={styles.inlineCtaText}>Solo vs AI Mode</Text></SeoLink>.
              {'\n\n'}• <Text style={styles.boldText}>Real-Time Online Multiplayer:</Text> Create private room lobbies with 4-digit codes, share WhatsApp invite links, and play with friends in{' '}
              <SeoLink href="/multiplayer" onNavigate={onNavigate}><Text style={styles.inlineCtaText}>Multiplayer Mode</Text></SeoLink>.
              {'\n\n'}• <Text style={styles.boldText}>Interactive Tactical Simulators:</Text> Test hand scenarios in the{' '}
              <SeoLink href="/strategy-lab" onNavigate={onNavigate}><Text style={styles.inlineCtaText}>Strategy Lab</Text></SeoLink> or compute points in the{' '}
              <SeoLink href="/score-calculator" onNavigate={onNavigate}><Text style={styles.inlineCtaText}>Score Calculator</Text></SeoLink>.
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
