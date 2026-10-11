import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';

interface Props {
  onNavigate: (route: string) => void;
}

export const SevenCardsLeastFaqPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('7-cards-least-faq');
  }, []);

  const faqs = [
    {
      q: 'Can Ace be used at both high and low ends in suited runs (e.g. A-2-3 vs Q-K-A)?',
      a: 'In 7 Cards Least, Ace is strictly a low card worth 1 point. Suited runs can begin with Ace (A-2-3-4), but King-Ace wrapping (e.g. Q-K-A) is not permitted. This makes Aces uniquely valuable for anchoring low-scoring suited sequences.'
    },
    {
      q: 'What happens if the Draw Deck runs out of cards during an active round?',
      a: 'If the face-down Draw Deck is completely depleted during gameplay, the game automatically preserves the current top face-up card on the discard pile, reshuffles all other discarded cards into a brand new face-down draw deck, and displays a system alert. Play continues seamlessly.'
    },
    {
      q: 'Can I discard cards matching the Table Joker rank as a set or sequence?',
      a: 'Yes! Cards matching the round\'s Table Joker rank score 0 points, but they retain their original rank and suit identities for set and run combinations. You can discard a set of Jokers or include a Joker in a suited sequence.'
    },
    {
      q: 'What happens if two or more opponents tie for the lowest score when Least is declared?',
      a: 'If the caller holds more points than the opponents, the caller fails and incurs the full 80-point penalty. If two or more opponents tie for the lowest hand score (e.g. both hold 3 points), both tied opponents share round victory and receive 0 penalty points, while all other players score their point difference.'
    },
    {
      q: 'Can I call "Least!" on my very first turn of a round?',
      a: 'Yes! If your dealt hand already totals 10 points or less—for example, if you were dealt multiple Jokers (0 pts) and low Aces—you are legally permitted to declare "LEAST!" on your very first turn.'
    },
    {
      q: 'Do I always have to draw a card after discarding on every turn?',
      a: 'Standard turns require discarding valid cards followed by drawing 1 card. However, if your discard rank matches the rank of the current top card on the Discard Pile, the "Match & Skip" rule activates: your turn ends immediately without drawing, permanently shrinking your hand size.'
    },
    {
      q: 'How does the 200-point elimination rule work across tournament rounds?',
      a: '7 Cards Least is played across a series of rounds (customizable from 1 to 20 rounds). Points accumulate round over round. Any player whose cumulative penalty score reaches or surpasses 200 points is eliminated from the table. The player with the lowest score at the end wins.'
    },
    {
      q: 'Can I play 7 Cards Least on mobile without downloading an app or signing up?',
      a: 'Yes! 7 Cards Least runs completely in mobile browsers (Safari, Chrome, Firefox) on iOS and Android. Touch gestures, tap-to-select cards, and table animations work smoothly with no app store download or signup required.'
    },
    {
      q: 'Can I create private rooms to play with family and friends across different devices?',
      a: 'Yes. Table hosts can create private rooms with customizable rounds (1 to 20) and turn timers (60-sec or unlimited). A unique 4-digit code and direct WhatsApp link are generated, allowing friends to join across any device.'
    }
  ];

  return (
    <SafeAreaView style={styles.root}>
      {/* ─── SITE NAVBAR ─── */}
      <View style={styles.navbar}>
        <SeoLink href="/" onNavigate={onNavigate} accessibilityLabel="Home">
          <Text style={styles.brandTitle}>🃏 7 Cards Least</Text>
        </SeoLink>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navLinks}>
          <SeoLink href="/" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play</Text></SeoLink>
          <SeoLink href="/7-cards-least" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>7 Cards Least</Text></SeoLink>
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></SeoLink>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></SeoLink>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></SeoLink>
          <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></SeoLink>
          <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></SeoLink>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>FAQ</Text></SeoLink>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>Home</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <SeoLink href="/7-cards-least" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>7 Cards Least</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>FAQ</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>7 Cards Least Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>Specific answers to detailed player questions about edge-case rules, reshuffling, Joker runs, ties, turn limits, and online multiplayer rooms.</Text>

          {faqs.map((faq, idx) => (
            <View key={idx} style={styles.cardSection}>
              <Text style={styles.h2} accessibilityRole="header" aria-level={2}>❓ {faq.q}</Text>
              <Text style={styles.bodyText}>{faq.a}</Text>
            </View>
          ))}

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Ready to Start Playing?</Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.primaryCta}>
                <Text style={styles.ctaText}>⚡ Play 7 Cards Least Now</Text>
              </SeoLink>
              <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>📜 Read Game Rules</Text>
              </SeoLink>
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
  h2: { color: '#38bdf8', fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  bodyText: { color: '#cbd5e1', fontSize: 15, lineHeight: 24 },

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#334155', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
