import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';

interface Props {
  onNavigate: (route: string) => void;
  user?: any;
  onLogout?: () => void;
}

export const AboutPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'About Us – 7 Cards Least Online';
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
          <TouchableOpacity onPress={() => onNavigate('/about')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>About</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/contact')} style={styles.navBtn}><Text style={styles.navText}>Contact</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity onPress={() => onNavigate('/')}><Text style={styles.breadcrumbLink}>Home</Text></TouchableOpacity>
            <Text style={styles.breadcrumbSep}>→</Text>
            <Text style={styles.breadcrumbCurrent}>About</Text>
          </View>

          <Text style={styles.h1}>About 7 Cards Least</Text>
          <Text style={styles.subtitle}>Who we are, why we built this game, and our commitment to players.</Text>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>👋 Who Runs the Site</Text>
            <Text style={styles.paragraph}>
              7 Cards Least (<Text style={styles.bold}>cards.gnanamai.com</Text>) is developed and operated by <Text style={styles.bold}>Gnanam AI</Text>, an independent studio dedicated to crafting accessible, ultra-responsive digital card games and web software.
            </Text>
            <Text style={styles.paragraph}>
              We are a team of passionate card game players, software engineers, and game designers who love traditional card games and wanted to bring an authentic shedding rummy experience directly to modern web browsers.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>🎯 Why This Site Exists</Text>
            <Text style={styles.paragraph}>
              For decades, families and friends across the world have played the low-hand card game known as <Text style={styles.italic}>7 Cards Least</Text> (or Seven Cards Least / Low Hand Rummy). However, finding an ad-free, high-quality, instant-play digital version online was virtually impossible.
            </Text>
            <Text style={styles.paragraph}>
              We built this platform with three key principles:
            </Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Zero Installation Friction:</Text> Play immediately in your browser on phone, tablet, or desktop with no downloads, app stores, or account requirements.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Authentic Rules &amp; Fair Play:</Text> Deterministic shuffling, transparent scoring mechanics, and true turn-by-turn phase progression.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Play with Friends or Practice Solo:</Text> Real-time private multiplayer rooms for game nights alongside adaptive AI bots for tactical practice anytime.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.h2}>🛡️ Transparency &amp; Contact</Text>
            <Text style={styles.paragraph}>
              We believe in honest web design, user privacy, and responsive support. If you ever have questions, bug reports, or feature ideas, our development team is always reachable at <Text style={styles.linkText}>support@gnanamai.com</Text>.
            </Text>
          </View>

          {/* Quick Nav Footer */}
          <View style={styles.footerNav}>
            <TouchableOpacity onPress={() => onNavigate('/')} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>🎮 Play Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('/contact')} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>✉️ Get in Touch</Text>
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
  italic: { fontStyle: 'italic' },
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
