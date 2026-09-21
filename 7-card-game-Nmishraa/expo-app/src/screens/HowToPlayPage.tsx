import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const HowToPlayPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('how-to-play');
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
          <TouchableOpacity onPress={() => onNavigate('/how-to-play')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>How to Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/rules')} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/variations')} style={styles.navBtn}><Text style={styles.navText}>Variations</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/solo')} style={styles.navBtn}><Text style={styles.navText}>Solo</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          <Text style={styles.h1}>How to Play 7 Card Game</Text>
          <Text style={styles.subtitle}>A beginner's guide to card setup, turn flow, scoring, and strategies for 7 Cards Least.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>1. Game Setup &amp; Dealing</Text>
            <Text style={styles.bodyText}>
              In 7 Card Game, each player is dealt a hand of 7 cards from a standard 52-card deck. One remaining card is flipped face-up in the center to serve as the starting Joker, and another card starts the central Discard Pile.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>2. Understanding Turn Flow</Text>
            <Text style={styles.bodyText}>
              Turns move in an anticlockwise direction. On your turn, you must perform two main steps:
              {'\n'}• <Text style={styles.boldText}>Discard first:</Text> Select one or more valid cards from your hand (a single card, a set of equal ranks, or a run of 3+ consecutive suited cards) and place them on the discard pile.
              {'\n'}• <Text style={styles.boldText}>Draw next:</Text> Pick up one card from either the face-down Deck or the face-up Discard Pile to refill your hand.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>3. The Special Joker Mechanic</Text>
            <Text style={styles.bodyText}>
              The face-up Joker card selected at the beginning of the round dictates the special zero-point rank. Any card in your hand matching the rank of the face-up Joker counts as <Text style={styles.boldText}>0 points</Text>, helping you dramatically reduce your hand total.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>4. Calling "Least!" to End a Round</Text>
            <Text style={styles.bodyText}>
              If you evaluate your hand and believe your total point count is lower than all opponents, tap the <Text style={styles.boldText}>"Least!"</Text> button during your discard phase. This immediately stops the round for scoring. Be careful: calling Least when an opponent has an equal or lower score results in an <Text style={styles.boldText}>80-point penalty</Text>!
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>5. Next Steps</Text>
            <Text style={styles.bodyText}>
              Ready to test your skills? Jump straight into a live table or read the complete rules.
            </Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Play 7 Card Game Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/rules')}>
                <Text style={styles.secondaryCtaText}>📖 Read Full Rules</Text>
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
