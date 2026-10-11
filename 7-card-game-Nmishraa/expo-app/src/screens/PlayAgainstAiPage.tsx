import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';

interface Props {
  onNavigate: (route: string) => void;
}

export const PlayAgainstAiPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('play-against-ai');
  }, []);

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
          <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Play Against AI</Text></SeoLink>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></SeoLink>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>Home</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>Play Against AI</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>7 Cards Least Against Computer AI</Text>
          <Text style={styles.subtitle}>Practice your card shedding tactics and Joker plays solo against smart computer bots with zero wait time.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>🤖 How AI Decision-Making Works</Text>
            <Text style={styles.bodyText}>
              In AI mode, you compete against intelligent computer bot opponents (AlphaBot, BetaBot, and OmegaBot). The computer AI evaluates your face-up discards, calculates optimal hand combinations, builds matching rank sets and suited runs, and strategically determines when to call "Least!" based on its hand total (≤ 10 points).
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>⚡ Instant Start &amp; Zero Matchmaking Delays</Text>
            <Text style={styles.bodyText}>
              Solo AI matches launch instantly from your browser with no player matchmaking delays. Computer turns execute smoothly with natural 1-second intervals, letting you practice Table Joker evaluations, multi-card discards, and Least call timing at your own pace.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>🎯 Customizable Bot Counts &amp; Match Lengths</Text>
            <Text style={styles.bodyText}>
              On the homepage setup card, you can configure your singleplayer game against anywhere from 1 to 7 computer bots, adjust rounds from 1 to 20, and set turn timers to 60 seconds or unlimited practice mode.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>Ready to Challenge the Computer?</Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.primaryCta}>
                <Text style={styles.ctaText}>⚡ Start AI Match Now</Text>
              </SeoLink>
              <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>📖 Read Rules</Text>
              </SeoLink>
              <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>💡 Strategy Guide</Text>
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
  h2: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  bodyText: { color: '#cbd5e1', fontSize: 15, lineHeight: 24 },

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#334155', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
