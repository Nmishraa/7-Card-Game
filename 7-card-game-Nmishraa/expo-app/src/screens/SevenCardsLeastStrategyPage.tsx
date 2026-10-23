import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Image } from 'react-native';
import { updatePageSeo } from '../services/seoService';
import { SeoLink } from '../components/SeoLink';
import { UserHeaderBadge } from '../components/UserHeaderBadge';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const SevenCardsLeastStrategyPage: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('7-cards-least-strategy');
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
          <SeoLink href="/7-cards-least" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>7 Cards Least</Text></SeoLink>
          <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></SeoLink>
          <SeoLink href="/7-cards-least/how-to-play" onNavigate={onNavigate} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></SeoLink>
          <SeoLink href="/7-cards-least/strategy" onNavigate={onNavigate} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Strategy</Text></SeoLink>
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
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <SeoLink href="/" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>Home</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <SeoLink href="/7-cards-least" onNavigate={onNavigate}><Text style={styles.breadcrumbLink}>7 Cards Least</Text></SeoLink>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>Strategy</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header" aria-level={1}>7 Cards Least Winning Strategy &amp; Tactics</Text>
          <Text style={styles.subtitle}>Mastering 7 Cards Least requires calculated risk management, card tracking, and precise timing. Study these concrete tactical scenarios to consistently outplay opponents.</Text>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>1. Opening Turns: The High-Point Liability Dump</Text>
            <Text style={styles.bodyText}>
              In the opening 1 to 3 turns, unmatched face cards (Jacks, Queens, Kings) are your biggest vulnerability. Each face card inflicts a 10-point penalty if an opponent makes an early Least declaration.
              {'\n\n'}
              <Text style={styles.boldText}>Concrete Scenario:</Text>
              {'\n'}Suppose your opening dealt hand is K♠ (10), Q♦ (10), J♣ (10), 7♥ (7), 4♠ (4), 2♦ (2), and A♣ (1). Your starting hand sum is <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>44 points</Text>.
              {'\n'}• Turn 1: Discard K♠ (hand drops to 34 pts + drawn card).
              {'\n'}• Turn 2: Discard Q♦ (hand drops further).
              {'\n'}• Turn 3: Discard J♣.
              {'\n'}By aggressively shedding 10-point cards first, your penalty risk plummets by 30 points before mid-game play begins.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>2. Building Multi-Card Runs &amp; Sets</Text>
            <Text style={styles.bodyText}>
              Discarding cards one by one requires 7 full turns. The fastest way to rapidly slash your hand points is forming matching rank sets (pairs or triples) and suited numerical runs (3+ consecutive cards in the same suit).
              {'\n\n'}
              <Text style={styles.boldText}>Concrete Scenario:</Text>
              {'\n'}You hold 9♠, 9♥, 9♦ along with small cards. Discarding all three 9s at once sheds <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>27 points</Text> in a single turn! Similarly, discarding a suited run like 6♣-7♣-8♣ sheds 21 points in one move, putting you within calling range several turns ahead of opponents who only discard single cards.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>3. Strategic Joker Wildcard Retention</Text>
            <Text style={styles.bodyText}>
              Every card matching the table setup Joker rank counts as <Text style={styles.boldText}>0 points</Text>. Holding Jokers provides an impenetrable defensive shield for your hand score.
              {'\n\n'}
              <Text style={styles.boldText}>Concrete Scenario:</Text>
              {'\n'}The table Joker rank is <Text style={{ color: '#a78bfa', fontWeight: 'bold' }}>5</Text>. You hold 5♠ (0 pts), 5♦ (0 pts), A♥ (1 pt), and 3♣ (3 pts).
              {'\n'}Your hand total is only <Text style={{ color: '#34d399', fontWeight: 'bold' }}>4 points</Text> across 4 cards! Even though you hold multiple cards, your score is already low enough to declare Least with near-guaranteed victory. Never discard a Joker card as a single unless you are closing out a game-winning combo.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>4. Exploiting the "Match &amp; Skip" Tactic</Text>
            <Text style={styles.bodyText}>
              When you discard a card matching the rank of the current top card on the Discard Pile, the game executes a <Text style={styles.boldText}>Match &amp; Skip</Text>: your turn ends immediately without drawing from the deck!
              {'\n\n'}
              <Text style={styles.boldText}>Concrete Scenario:</Text>
              {'\n'}The previous player discards an 8♥ onto the open pile. You hold an 8♦ in hand. By selecting and discarding your 8♦, you match the top rank. You do not pick up a replacement card! Your hand size permanently shrinks from 7 cards to 6 cards, reducing both your point liability and future turns needed to reach victory.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>5. Safe "LEAST!" Score Thresholds &amp; Decision Matrix</Text>
            <Text style={styles.bodyText}>
              While the game permits declaring Least at 10 points or less, declaring at 8, 9 or 10 points carries significant risk of incurring the <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>80-point penalty</Text>. Use this tested probability matrix:
            </Text>

            <View style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: 10, padding: 10, marginTop: 12, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: 'rgba(56, 189, 248, 0.5)', paddingBottom: 8 }}>
                <Text style={{ flex: 1.2, color: '#38bdf8', fontWeight: 'bold', fontSize: 13 }}>Hand Score</Text>
                <Text style={{ flex: 1, color: '#38bdf8', fontWeight: 'bold', fontSize: 13 }}>Win Rate</Text>
                <Text style={{ flex: 2, color: '#38bdf8', fontWeight: 'bold', fontSize: 13 }}>Action Recommendation</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
                <Text style={{ flex: 1.2, color: '#34d399', fontWeight: 'bold', fontSize: 13 }}>0 to 3 Pts</Text>
                <Text style={{ flex: 1, color: '#34d399', fontWeight: 'bold', fontSize: 13 }}>98% Win</Text>
                <Text style={{ flex: 2, color: '#cbd5e1', fontSize: 12 }}>Call LEAST immediately. Virtually impossible to lose.</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
                <Text style={{ flex: 1.2, color: '#fbbf24', fontWeight: 'bold', fontSize: 13 }}>4 to 6 Pts</Text>
                <Text style={{ flex: 1, color: '#fbbf24', fontWeight: 'bold', fontSize: 13 }}>75% Win</Text>
                <Text style={{ flex: 2, color: '#cbd5e1', fontSize: 12 }}>Call if opponents are drawing blind; hold if an opponent took a 2 or Ace.</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                <Text style={{ flex: 1.2, color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>7 to 10 Pts</Text>
                <Text style={{ flex: 1, color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>35% Win</Text>
                <Text style={{ flex: 2, color: '#cbd5e1', fontSize: 12 }}>High Danger. Discard 1 more turn before calling to avoid +80 penalty.</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2} accessibilityRole="header" aria-level={2}>6. Tournament &amp; 200-Point Survival Play</Text>
            <Text style={styles.bodyText}>
              In multi-round matches, players reaching 200 cumulative points are eliminated. If your cumulative total is 140+ points, an 80-point penalty will instantly eliminate you (140 + 80 = 220 pts). In this danger zone, play purely defensively: prioritize safe shedding and only call Least when your hand is 3 points or lower.
            </Text>
            <View style={styles.ctaRow}>
              <SeoLink href="/" onNavigate={onNavigate} style={styles.primaryCta}>
                <Text style={styles.ctaText}>⚡ Test Strategy in Live Match</Text>
              </SeoLink>
              <SeoLink href="/7-cards-least/rules" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>📜 Official Rules</Text>
              </SeoLink>
              <SeoLink href="/play-against-ai" onNavigate={onNavigate} style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>🤖 Practice vs AI</Text>
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

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#334155', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});
