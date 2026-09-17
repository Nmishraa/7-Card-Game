import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  useEffect(() => {
    updatePageSeo('notFound');
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
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={styles.navBtn}><Text style={styles.navText}>Multiplayer</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/solo')} style={styles.navBtn}><Text style={styles.navText}>Solo</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/faq')} style={styles.navBtn}><Text style={styles.navText}>FAQ</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.centerContainer}>
        <View style={[styles.cardSection, isWide && styles.cardSectionWide]}>
          <Text style={styles.code404}>404</Text>
          <Text style={styles.h1}>Page Not Found</Text>
          <Text style={styles.bodyText}>
            The card room or page you are looking for does not exist or has been moved.
          </Text>


          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
              <Text style={styles.ctaText}>🏠 Return to Homepage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/how-to-play')}>
              <Text style={styles.secondaryCtaText}>📖 Read How to Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/rules')}>
              <Text style={styles.secondaryCtaText}>📜 7 Card Game Rules</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  navText: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  cardSection: {
    backgroundColor: 'rgba(10, 22, 40, 0.85)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  cardSectionWide: { maxWidth: 540 },
  code404: { color: '#ef4444', fontSize: 56, fontWeight: 'bold' },
  h1: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

  bodyText: { color: '#cbd5e1', fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 24 },

  ctaRow: { width: '100%', gap: 12 },
  primaryCta: { backgroundColor: '#0275d8', paddingVertical: 14, borderRadius: 10, alignItems: 'center', width: '100%', minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  secondaryCta: { backgroundColor: '#334155', paddingVertical: 12, borderRadius: 10, alignItems: 'center', width: '100%', minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },
});
