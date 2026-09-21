import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const VariationsPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('variations');
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
          <TouchableOpacity onPress={() => onNavigate('/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/variations')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Variations</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/solo')} style={styles.navBtn}><Text style={styles.navText}>Solo</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          <Text style={styles.h1}>7 Card Game Regional Names &amp; Rules Variations</Text>
          <Text style={styles.subtitle}>Explore different names and house rule variations of 7 Card Game around the world.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>1. 7-Cards Least (Indian Card Game Classic)</Text>
            <Text style={styles.bodyText}>
              In South Asia and worldwide, 7 Card Game is widely known as <Text style={styles.boldText}>7-Cards Least</Text> or <Text style={styles.boldText}>Lowest Hand Rummy</Text>. The core objective remains shedding heavy point cards and calling "Least!" when your total score drops below opponents.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>2. Seven Card Knock / Low Hand Rummy</Text>
            <Text style={styles.bodyText}>
              In Western card parlance, the game shares structural mechanics with <Text style={styles.boldText}>Knock Rummy</Text> and <Text style={styles.boldText}>Lowball Card Games</Text>. Players "knock" or call "Least" instead of declaring a full melding hand.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>3. Cutthroat vs Team Match Variations</Text>
            <Text style={styles.bodyText}>
              While standard online matches at <Text style={styles.boldText}>cards.gnanamai.com</Text> feature 2 to 4 player individual cutthroat competition, traditional offline variants include:
              {'\n'}• <Text style={styles.boldText}>2v2 Partner Play:</Text> Teammates sit opposite each other and combine scores.
              {'\n'}• <Text style={styles.boldText}>Custom Penalty Thresholds:</Text> Some house rules set wrong call penalties to 50 or 100 points, whereas our standard competitive online format uses the balanced <Text style={styles.boldText}>80-point penalty</Text>.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>4. Dynamic Joker Rules vs Fixed Jokers</Text>
            <Text style={styles.bodyText}>
              Unlike standard Rummy games that rely solely on printed physical Joker cards, our digital version uses the face-up flipped card at round start to dynamically assign zero-point value to matching suitless ranks, making every round unique and strategic.
            </Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Play Official 7 Card Game</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/how-to-play')}>
                <Text style={styles.secondaryCtaText}>📖 Read How to Play</Text>
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
  h1: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
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
