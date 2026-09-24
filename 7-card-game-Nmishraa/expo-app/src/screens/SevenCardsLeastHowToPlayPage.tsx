import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const SevenCardsLeastHowToPlayPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('7-cards-least-how-to-play');
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

          <Text style={styles.h1}>How to Play 7 Cards Least</Text>
          <Text style={styles.subtitle}>Beginner-friendly step-by-step guide to dealing, hand organization, drawing, discarding, and winning 7 Cards Least.</Text>

          {/* ⚡ TOP HERO PLAY CTA CARD ⚡ */}
          <View style={styles.topHeroCard}>
            <Text style={styles.topHeroTitle}>🎴 Ready to Test Your Skills?</Text>
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

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Step 1: Start the Game</Text>
            <Text style={styles.bodyText}>
              Enter your player name, select the number of rounds (1 to 20), and launch an instant solo match vs AI or create a 4-digit code private room to invite friends.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Step 2: Understand Your Hand</Text>
            <Text style={styles.bodyText}>
              You are dealt 7 cards. Evaluate high-value face cards (10 pts) vs low cards and check which card rank matches the face-up wildcard Joker (0 pts).
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Step 3: Discard a Card or Combination</Text>
            <Text style={styles.bodyText}>
              Select a single card, an equal rank set (e.g. 7♠ 7♥), or a suited run (e.g. 3♦ 4♦ 5♦) and drop it onto the Discard Pile.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Step 4: Draw a Replacement Card</Text>
            <Text style={styles.bodyText}>
              Pick up one card from either the face-down Deck or the top of the face-up Discard Pile to keep your hand full until you call Least.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Step 5: Call Least to Win</Text>
            <Text style={styles.bodyText}>
              When your total hand score drops to its lowest possible value, tap <Text style={styles.boldText}>"Least!"</Text> during your turn to halt the round and score 0 points.
            </Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Play 7 Cards Least Online</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/7-cards-least/strategy')}>
                <Text style={styles.secondaryCtaText}>💡 View Strategy Tips</Text>
              </TouchableOpacity>
            </View>
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

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#334155', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },

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
