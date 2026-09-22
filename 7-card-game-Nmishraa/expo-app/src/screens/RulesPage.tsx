import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const RulesPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('rules');
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
          <TouchableOpacity onPress={() => onNavigate('/rules')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
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
            <Text style={styles.breadcrumbCurrent}>Rules</Text>
          </View>

          <Text style={styles.h1}>7 Cards Least Rules</Text>
          <Text style={styles.subtitle}>Complete documentation of official game rules, card point values, discards, jokers, and penalties.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>1. Card Point Values</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>Ace:</Text> 1 point
              {'\n'}• <Text style={styles.boldText}>Cards 2 through 10:</Text> Face value (2 to 10 points)
              {'\n'}• <Text style={styles.boldText}>Jack, Queen, King:</Text> 10 points each
              {'\n'}• <Text style={styles.boldText}>Joker Card:</Text> 0 points (all cards matching the rank of the face-up Joker count as 0 pts)
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>2. Valid Discard Combinations</Text>
            <Text style={styles.bodyText}>
              On your turn, you can discard any of the following valid combinations:
              {'\n'}• <Text style={styles.boldText}>Single Card:</Text> Any single card from your hand.
              {'\n'}• <Text style={styles.boldText}>Set:</Text> Two or more cards of the exact same rank (e.g., 7♠ 7♥ 7♣).
              {'\n'}• <Text style={styles.boldText}>Run (Sequence):</Text> Three or more consecutive cards of the exact same suit (e.g., 4♦ 5♦ 6♦).
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>3. Special Action Rules</Text>
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>Match &amp; Skip:</Text> If your discard rank matches the rank of the top card on the discard pile, your turn ends immediately without needing to pick a card!
              {'\n'}• <Text style={styles.boldText}>Immediate Drop:</Text> If you draw a card from the deck that matches the rank of the card you just discarded, it is dropped automatically.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>4. Calling Least &amp; Penalties</Text>
            <Text style={styles.bodyText}>
              • When you believe your total hand score is the lowest at the table, call <Text style={styles.boldText}>"Least!"</Text> during your discard turn.
              {'\n'}• <Text style={styles.boldText}>Successful Call:</Text> The round winner gets 0 points. All other players add their hand score minus the winner's score to their total.
              {'\n'}• <Text style={styles.boldText}>Wrong Call Penalty:</Text> If an opponent has an equal or lower hand score than you when you call Least, you are penalized with <Text style={styles.boldText}>80 points</Text>!
              {'\n'}• <Text style={styles.boldText}>Elimination Threshold:</Text> Players reaching <Text style={styles.boldText}>200 cumulative points</Text> are eliminated. The last remaining player wins the match!
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Next Steps</Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Play 7 Card Game Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/faq')}>
                <Text style={styles.secondaryCtaText}>❓ View FAQ</Text>
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
