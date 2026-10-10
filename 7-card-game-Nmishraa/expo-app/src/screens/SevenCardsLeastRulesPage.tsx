import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';

interface Props {
  onNavigate: (route: string) => void;
}

export const SevenCardsLeastRulesPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('7-cards-least-rules');
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
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Rules</Text></SeoLink>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></SeoLink>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></SeoLink>
          <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></SeoLink>
          <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Play Against AI</Text></SeoLink>
          <SeoLink href="/7-cards-least/faq" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></SeoLink>
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
            <Text style={styles.breadcrumbCurrent}>Rules</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>7 Cards Least Official Rules &amp; Scoring Guide</Text>
          <Text style={styles.subtitle}>Complete guide to card point values, discards, wildcards, turn rules, and penalties in 7 Cards Least.</Text>

          {/* ─── GOOGLE FEATURED SNIPPET DEFINITION & SCORING TABLE ─── */}
          <View style={styles.featuredSnippetCard}>
            <Text style={styles.featuredSnippetHeading} accessibilityRole="header" aria-level={2}>⚡ What is 7 Cards Least? (Quick Summary)</Text>
            <Text style={styles.featuredSnippetText}>
              <Text style={styles.boldText}>7 Cards Least</Text> (also known as 7 Cards Game, Low Hand Rummy, or Seven Cards Least) is a fast-paced card shedding game played with 7 cards dealt to each player from a standard 52-card deck. The objective is to finish each round with the <Text style={{ color: '#34d399', fontWeight: 'bold' }}>lowest cumulative hand point total</Text> by discarding high-value face cards (10 pts), building matched sets or runs, and calling <Text style={{ color: '#fbbf24', fontWeight: 'bold' }}>"LEAST!"</Text> when your hand total is 10 points or fewer.
            </Text>

            {/* Quick Scoring Table */}
            <View style={styles.tableBox}>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableCol, styles.tableColHeader, { flex: 1.2 }]}>Card Rank</Text>
                <Text style={[styles.tableCol, styles.tableColHeader, { flex: 1 }]}>Points</Text>
                <Text style={[styles.tableCol, styles.tableColHeader, { flex: 2 }]}>Shedding Strategy</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>Ace (A)</Text>
                <Text style={[styles.tableCol, { color: '#34d399', fontWeight: 'bold', flex: 1 }]}>1 Point</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Keep in hand (lowest value)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>2 to 10</Text>
                <Text style={[styles.tableCol, { color: '#fbbf24', fontWeight: 'bold', flex: 1 }]}>Face Value</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Shed 8–10 early; keep 2–3</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>J, Q, K</Text>
                <Text style={[styles.tableCol, { color: '#f87171', fontWeight: 'bold', flex: 1 }]}>10 Points</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>High risk – discard immediately</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>Table Joker</Text>
                <Text style={[styles.tableCol, { color: '#a78bfa', fontWeight: 'bold', flex: 1 }]}>0 Points</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Hold (best zero-point wildcard)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>Call Least</Text>
                <Text style={[styles.tableCol, { color: '#38bdf8', fontWeight: 'bold', flex: 1 }]}>≤ 10 Points</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Declare when hand score ≤ 10</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableCol, styles.tableBold, { flex: 1.2 }]}>Wrong Call</Text>
                <Text style={[styles.tableCol, { color: '#ef4444', fontWeight: 'bold', flex: 1 }]}>+80 Pts</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Penalty if opponent ties or wins</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>1. Card Point System</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>Ace:</Text> 1 point
              {'\n'}• <Text style={styles.boldText}>Cards 2 to 10:</Text> Face value (2 to 10 points)
              {'\n'}• <Text style={styles.boldText}>Jack, Queen, King:</Text> 10 points each
              {'\n'}• <Text style={styles.boldText}>Active Joker Rank:</Text> 0 points (all cards matching the flipped Joker rank count as 0 pts)
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>2. Turn Sequence &amp; Valid Discards</Text>
            <Text style={styles.bodyText}>
              Turns progress anticlockwise. On your turn, you must discard before drawing:
              {'\n'}• <Text style={styles.boldText}>Single Card:</Text> Any single card from your hand.
              {'\n'}• <Text style={styles.boldText}>Equal Rank Set:</Text> Two or more cards of identical rank (e.g. 9♠ 9♦ 9♣).
              {'\n'}• <Text style={styles.boldText}>Suited Sequence (Run):</Text> Three or more consecutive cards in the same suit (e.g. 5♥ 6♥ 7♥).
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>3. Special Game Actions</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>Match &amp; Skip:</Text> If your discard rank matches the current top discard rank, your turn ends immediately without drawing!
              {'\n'}• <Text style={styles.boldText}>Auto Drop:</Text> Drawing a card from the deck matching your immediate discard rank drops it automatically.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>4. Calling Least &amp; 80-Point Penalty</Text>
            <Text style={styles.bodyText}>
              Call "Least!" during your discard turn when you evaluate your hand total to be lower than all opponents. If an opponent ties or beats your score, you receive an <Text style={styles.boldText}>80-point penalty</Text>! Players reaching 200 cumulative points are eliminated.
            </Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/multiplayer" onNavigate={onNavigate} style={styles.primaryCta}>
                <Text style={styles.ctaText}>🎮 Play Multiplayer With Friends</Text>
              </SeoLink>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>⚡ Play Solo vs AI</Text>
              </SeoLink>
              <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>📖 Read How to Play</Text>
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

  featuredSnippetCard: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  featuredSnippetHeading: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuredSnippetText: {
    color: '#f1f5f9',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  tableBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  tableHeaderRow: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(56, 189, 248, 0.5)',
    paddingBottom: 10,
  },
  tableCol: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  tableColHeader: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tableBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

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

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
