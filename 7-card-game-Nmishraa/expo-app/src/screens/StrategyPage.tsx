import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const StrategyPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('strategy');
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {/* ─── SITE NAVBAR ─── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => onNavigate('/')} accessibilityRole="button" accessibilityLabel="Home">
          <Text style={styles.brandTitle}>🃏 7 Card Game</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navLinks}>
          <TouchableOpacity onPress={() => onNavigate('/')} style={styles.navBtn}><Text style={styles.navText}>Home</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/how-to-play')} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/rules')} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/strategy')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/variations')} style={styles.navBtn}><Text style={styles.navText}>Variations</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/solo')} style={styles.navBtn}><Text style={styles.navText}>Solo</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
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
            <Text style={styles.breadcrumbCurrent}>Strategy</Text>
          </View>

          <Text style={styles.h1}>7 Cards Least Strategy</Text>
          <Text style={styles.subtitle}>Master score reduction, Joker management, discard tactics, and risk-calculated Least calls in 7 Cards Least online.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>1. High-Value Card Prioritization</Text>
            <Text style={styles.bodyText}>
              In 7 Card Game, Face cards (Jacks, Queens, Kings = 10 pts) and Aces (1 pt or 11 pts) add heavy point weight to your hand. Always discard high-rank singles early in the round unless they match the active Joker rank. Holding high-rank cards late in a round exposes you to heavy score penalties if an opponent calls "Least!".
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>2. Harnessing the Wild Joker Card</Text>
            <Text style={styles.bodyText}>
              The face-up card flipped during round initialization sets the <Text style={styles.boldText}>Joker Rank (0 points)</Text>.
              {'\n'}• <Text style={styles.boldText}>Hold Jokers:</Text> Never discard a Joker card early unless you are clearing a multi-card set or run.
              {'\n'}• <Text style={styles.boldText}>Wildcards in Sets:</Text> Use Jokers strategically to complete 3+ card suited runs or equal rank sets to discard multiple cards in a single turn.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>3. Multi-Card Discard Combinations (Runs &amp; Sets)</Text>
            <Text style={styles.bodyText}>
              Dumping single cards slowly gives opponents time to lower their hands. Maximizing multi-card discards is essential:
              {'\n'}• <Text style={styles.boldText}>Equal Rank Sets:</Text> Pair 2, 3, or 4 of a kind (e.g., 8♠, 8♥, 8♦) to shed cards fast.
              {'\n'}• <Text style={styles.boldText}>Suited Sequences (Runs):</Text> Build 3+ consecutive cards in the same suit (e.g., 4♣, 5♣, 6♣) to drop up to 30+ points in one turn.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>4. Calculating the "Least!" Threshold</Text>
            <Text style={styles.bodyText}>
              Calling "Least!" stops the round immediately. To decide when to call:
              {'\n'}• <Text style={styles.boldText}>Safe Calling Window:</Text> A total hand score of <Text style={styles.boldText}>0 to 7 points</Text> has over 90% win probability in 4-player tables.
              {'\n'}• <Text style={styles.boldText}>Calculated Risk (8 to 12 pts):</Text> Only call if opponents have taken multiple face cards from the draw pile or haven't discarded runs.
              {'\n'}• <Text style={styles.boldText}>Avoid the 80-Point Penalty:</Text> If an opponent ties or beats your score when you call Least, you suffer an 80-point penalty!
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>5. Tracking Opponent Discard Habits</Text>
            <Text style={styles.bodyText}>
              Observe the face-up Discard Pile closely. If an opponent draws a card you discarded, take note of its suit and rank. Avoid discarding cards that allow opponents to complete high-value runs or equal rank sets.
            </Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Test Your Strategy Live</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/rules')}>
                <Text style={styles.secondaryCtaText}>📖 Review Scoring Rules</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ─── FOOTER ─── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>7 Card Game • cards.gnanamai.com</Text>
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

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
