import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const ContactPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Contact Us – 7 Cards Least Online';
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
          <TouchableOpacity onPress={() => onNavigate('/contact')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Contact</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity onPress={() => onNavigate('/')}><Text style={styles.breadcrumbLink}>Home</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>Contact</Text>
          </View>

          <Text style={styles.h1}>Contact Us</Text>
          <Text style={styles.subtitle}>Have a question, feedback, or need technical assistance? We are here to help.</Text>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>📬 Official Email Support</Text>
            <Text style={styles.paragraph}>
              For customer support, technical bug reports, feedback, and business inquiries, please reach out to our team at:
            </Text>
            <View style={styles.emailBox}>
              <Text style={styles.emailText}>support@gnanamai.com</Text>
            </View>
            <Text style={styles.paragraph}>
              We aim to respond to all player inquiries within <Text style={styles.bold}>24 to 48 business hours</Text>.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>🐞 Reporting Gameplay Bugs</Text>
            <Text style={styles.paragraph}>
              If you experienced an unexpected card state, animation glitch, or room synchronization issue, including the following details helps us resolve it swiftly:
            </Text>
            <Text style={styles.bulletItem}>• Your device &amp; browser (e.g. Chrome on Android, Safari on iOS, Desktop Chrome).</Text>
            <Text style={styles.bulletItem}>• Game mode (Solo vs Bots or Multiplayer with Friends).</Text>
            <Text style={styles.bulletItem}>• Room code (if playing in a private multiplayer room).</Text>
            <Text style={styles.bulletItem}>• A brief description of what card action was occurring when the issue took place.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>🏢 Publisher &amp; Developer Information</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Developer &amp; Publisher:</Text> Gnanam AI
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Website:</Text> https://cards.gnanamai.com
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Primary Contact:</Text> support@gnanamai.com
            </Text>
          </View>

          {/* Quick Nav Footer */}
          <View style={styles.footerNav}>
            <TouchableOpacity onPress={() => onNavigate('/')} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>🎮 Return to Game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('/about')} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>ℹ️ About Gnanam AI</Text>
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
  activeNavBtn: { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  navText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  activeNavText: { color: '#38bdf8', fontSize: 14, fontWeight: '700' },
  scrollContent: { paddingBottom: 40 },
  container: { padding: 16, maxWidth: 860, width: '100%', alignSelf: 'center' },
  containerWide: { padding: 24 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  breadcrumbLink: { color: '#38bdf8', fontSize: 13, fontWeight: '600' },
  breadcrumbSep: { color: '#64748b', fontSize: 13 },
  breadcrumbCurrent: { color: '#94a3b8', fontSize: 13 },
  h1: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#94a3b8', marginBottom: 20 },
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
  emailBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  emailText: { color: '#38bdf8', fontSize: 16, fontWeight: '700' },
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
