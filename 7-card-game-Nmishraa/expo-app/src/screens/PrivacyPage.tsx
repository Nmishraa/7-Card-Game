import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const PrivacyPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Privacy Policy – 7 Cards Least Online';
    }
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
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least')} style={styles.navBtn}><Text style={styles.navText}>7 Cards Least</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/rules')} style={styles.navBtn}><Text style={styles.navText}>Rules</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/how-to-play')} style={styles.navBtn}><Text style={styles.navText}>How to Play</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/7-cards-least/strategy')} style={styles.navBtn}><Text style={styles.navText}>Strategy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/about')} style={styles.navBtn}><Text style={styles.navText}>About</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/contact')} style={styles.navBtn}><Text style={styles.navText}>Contact</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity onPress={() => onNavigate('/')}><Text style={styles.breadcrumbLink}>Home</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>Privacy Policy</Text>
          </View>

          <Text style={styles.h1}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 22, 2026</Text>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>1. Introduction &amp; Data Controller</Text>
            <Text style={styles.paragraph}>
              Welcome to 7 Cards Least (<Text style={styles.bold}>cards.gnanamai.com</Text>), operated by Gnanam AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your privacy and are committed to protecting personal data in compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and global privacy standards.
            </Text>
            <Text style={styles.paragraph}>
              If you have any questions or data requests, you can contact our privacy team directly at <Text style={styles.linkText}>support@gnanamai.com</Text>.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>2. What Data We Collect</Text>
            <Text style={styles.paragraph}>
              We practice data minimization and only collect information essential for gameplay and platform stability:
            </Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Guest Identifiers:</Text> When playing as a guest, a randomly generated anonymous identifier (e.g. guest_xyz) and your chosen display name are saved locally in your browser storage.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Authentication Data (Optional):</Text> If you sign in via Google Firebase Auth, we receive your basic public profile (email, display name, photo URL) solely to maintain your profile and game history.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Gameplay Diagnostics:</Text> Temporary room event logs (card picks, discards, round scores) stored transiently to synchronize multiplayer matches.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Anonymous Analytics:</Text> If accepted via our consent banner, Google Analytics measures site load speed and error diagnostics. No personal identifiers are sold or shared.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>3. Cookies &amp; Consent Mode v2</Text>
            <Text style={styles.paragraph}>
              We use <Text style={styles.bold}>Google Consent Mode v2</Text>. By default, all analytical storage is set to &apos;denied&apos; until you explicitly click &quot;Accept All&quot; on our consent banner. Strictly necessary local storage items (such as sound toggle, table theme, and guest name) are used only to operate the game interface.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>4. Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to access, rectify, or delete any personal data associated with your account. You can clear your guest data at any time by clearing your browser cache and local storage, or email <Text style={styles.linkText}>support@gnanamai.com</Text> for account data deletion.
            </Text>
          </View>

          {/* Quick Nav Footer */}
          <View style={styles.footerNav}>
            <TouchableOpacity onPress={() => onNavigate('/')} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>🎮 Play 7 Cards Least</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('/contact')} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>✉️ Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f172a' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff', marginRight: 16 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  navText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingBottom: 40 },
  container: { padding: 16, maxWidth: 860, width: '100%', alignSelf: 'center' },
  containerWide: { padding: 24 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  breadcrumbLink: { color: '#38bdf8', fontSize: 13, fontWeight: '600' },
  breadcrumbSep: { color: '#64748b', fontSize: 13 },
  breadcrumbCurrent: { color: '#94a3b8', fontSize: 13 },
  h1: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  lastUpdated: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  sectionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 20,
    marginBottom: 16,
  },
  h2: { fontSize: 18, fontWeight: '700', color: '#38bdf8', marginBottom: 10 },
  paragraph: { fontSize: 14, lineHeight: 22, color: '#cbd5e1', marginBottom: 10 },
  bulletItem: { fontSize: 14, lineHeight: 22, color: '#cbd5e1', marginBottom: 8, paddingLeft: 4 },
  bold: { fontWeight: '700', color: '#ffffff' },
  linkText: { color: '#38bdf8', textDecorationLine: 'underline' },
  footerNav: { flexDirection: 'row', gap: 12, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  secondaryBtnText: { color: '#38bdf8', fontSize: 15, fontWeight: '700' },
});
