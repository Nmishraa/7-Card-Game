import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, TextInput, Linking } from 'react-native';
import { updatePageSeo } from '../services/seoService';

interface Props {
  onNavigate: (route: string) => void;
}

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

  /* Family & Friends Carousel Styles */
  familyCarouselSection: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  familyHeaderRow: { marginBottom: 14 },
  familyTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900', marginBottom: 6 },
  familySubtitle: { color: '#cbd5e1', fontSize: 13, lineHeight: 19 },
  carouselContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  slideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 80,
  },
  slideVisualBox: {
    width: 95,
    height: 70,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 4,
  },
  whatsAppMockBubble: {
    backgroundColor: '#15803d',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignItems: 'center',
  },
  linkMockBox: {
    backgroundColor: '#0284c7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 2,
  },
  codeDigitBox: {
    backgroundColor: '#4c1d95',
    width: 18,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  codeDigitText: { color: '#f3e8ff', fontWeight: '900', fontSize: 12 },
  slideContent: { flex: 1 },
  slideBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  slideBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  slideTitle: { color: '#f8fafc', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  slideText: { color: '#94a3b8', fontSize: 12, lineHeight: 16 },
  carouselDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: -2 },
  dotsGroup: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#38bdf8',
  },

  shareWidgetBox: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#25d366',
  },
  shareWidgetTitle: { color: '#25d366', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  shareWidgetSub: { color: '#cbd5e1', fontSize: 14, marginBottom: 14 },
  shareInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  shareCodePrefix: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold' },
  shareCodeInput: { backgroundColor: '#1e293b', color: '#fbbf24', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, minWidth: 100, textAlign: 'center', borderWidth: 1, borderColor: '#334155' },
  shareBtnGroup: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  whatsappBtn: { backgroundColor: '#25d366', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, flex: 1, minWidth: 160, alignItems: 'center' },
  whatsappBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  copyLinkBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, flex: 1, minWidth: 160, alignItems: 'center' },
  copyLinkBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  toastText: { color: '#a7f3d0', fontSize: 14, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },

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

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  primaryCta: { backgroundColor: '#0ea5e9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  secondaryCta: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, minHeight: 44, justifyContent: 'center' },
  secondaryCtaText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

  footer: { marginTop: 30, paddingVertical: 16, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 13 },
});

const CAROUSEL_SLIDES = [
  {
    id: 'whatsapp',
    title: 'Share on WhatsApp',
    text: 'Send the game invite directly to your family or friends.',
    icon: '💬',
    badgeBg: '#16a34a',
    badgeText: 'WhatsApp',
    renderVisual: () => (
      <View style={styles.slideVisualBox}>
        <Text style={{ fontSize: 28 }}>💬</Text>
        <View style={styles.whatsAppMockBubble}>
          <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}>🃏 7 Cards Invite</Text>
          <Text style={{ color: '#dcfce7', fontSize: 10 }}>Join my private table!</Text>
        </View>
      </View>
    ),
  },
  {
    id: 'link',
    title: 'Share the Game Link',
    text: 'Send your private game link to the people you want to play with.',
    icon: '🔗',
    badgeBg: '#0284c7',
    badgeText: 'Direct Link',
    renderVisual: () => (
      <View style={styles.slideVisualBox}>
        <Text style={{ fontSize: 26 }}>🔗</Text>
        <View style={styles.linkMockBox}>
          <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' }}>cards.gnanamai.com/?room=...</Text>
        </View>
      </View>
    ),
  },
  {
    id: 'code',
    title: 'Tell Them the Code',
    text: 'Give your friends or family the game code so they can join your game.',
    icon: '🔢',
    badgeBg: '#7c3aed',
    badgeText: '4-Digit Code',
    renderVisual: () => (
      <View style={styles.slideVisualBox}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {['4', '8', '2', '9'].map((digit, idx) => (
            <View key={idx} style={styles.codeDigitBox}>
              <Text style={styles.codeDigitText}>{digit}</Text>
            </View>
          ))}
        </View>
      </View>
    ),
  },
];

export const MultiplayerPage: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  const [customRoomCode, setCustomRoomCode] = useState<string>('PLAY7');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    updatePageSeo('multiplayer');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const getShareUrl = () => `https://cards.gnanamai.com/?room=${customRoomCode.toUpperCase()}`;

  const handleShareWhatsApp = () => {
    const text = `Hey! Join my 7 Cards Least game table online right now: ${getShareUrl()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToast('📋 Link copied to clipboard!');
      setTimeout(() => setCopiedToast(null), 3000);
    }
  };

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
          <TouchableOpacity onPress={() => onNavigate('/variations')} style={styles.navBtn}><Text style={styles.navText}>Variations</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('/multiplayer')} style={[styles.navBtn, styles.activeNavBtn]}><Text style={styles.activeNavText}>Multiplayer</Text></TouchableOpacity>
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
            <Text style={styles.breadcrumbCurrent}>Multiplayer</Text>
          </View>

          <Text style={styles.h1}>7 Cards Least Multiplayer Online</Text>
          <Text style={styles.subtitle}>Play 7 Cards Least multiplayer online with friends or instant online player matchfilling.</Text>

          {/* ─── PLAY WITH FAMILY & FRIENDS CAROUSEL ─── */}
          <View style={styles.familyCarouselSection}>
            <View style={styles.familyHeaderRow}>
              <Text style={styles.familyTitle}>Play With Family &amp; Friends 🃏</Text>
              <Text style={styles.familySubtitle}>
                Invite your family or friends to your private game. Share the game on WhatsApp, send the link, or simply tell them the game code.
              </Text>
            </View>

            {/* Carousel Card */}
            <View style={styles.carouselContainer}>
              <View style={styles.slideCard}>
                {CAROUSEL_SLIDES[activeSlide].renderVisual()}
                <View style={styles.slideContent}>
                  <View style={[styles.slideBadge, { backgroundColor: CAROUSEL_SLIDES[activeSlide].badgeBg }]}>
                    <Text style={styles.slideBadgeText}>{CAROUSEL_SLIDES[activeSlide].badgeText}</Text>
                  </View>
                  <Text style={styles.slideTitle}>{CAROUSEL_SLIDES[activeSlide].title}</Text>
                  <Text style={styles.slideText}>{CAROUSEL_SLIDES[activeSlide].text}</Text>
                </View>
              </View>

              {/* Dots & Controls */}
              <View style={styles.carouselDotsRow}>
                <TouchableOpacity 
                  onPress={() => setActiveSlide(prev => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)} 
                  style={styles.arrowBtn}
                  accessibilityLabel="Previous slide"
                >
                  <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>

                <View style={styles.dotsGroup}>
                  {CAROUSEL_SLIDES.map((_, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setActiveSlide(idx)}
                      style={[styles.dot, activeSlide === idx && styles.activeDot]}
                      accessibilityLabel={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={() => setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length)} 
                  style={styles.arrowBtn}
                  accessibilityLabel="Next slide"
                >
                  <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ⚡ VIRAL ROOM SHARE WIDGET ⚡ */}
          <View style={styles.shareWidgetBox}>
            <Text style={styles.shareWidgetTitle}>📲 Invite Friends to Play via WhatsApp</Text>
            <Text style={styles.shareWidgetSub}>Generate an instant room link and share it on WhatsApp or social media:</Text>
            
            <View style={styles.shareInputRow}>
              <Text style={styles.shareCodePrefix}>Room Code:</Text>
              <TextInput
                style={styles.shareCodeInput}
                value={customRoomCode}
                onChangeText={setCustomRoomCode}
                maxLength={6}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.shareBtnGroup}>
              <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp}>
                <Text style={styles.whatsappBtnText}>💬 Share on WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.copyLinkBtn} onPress={handleCopyLink}>
                <Text style={styles.copyLinkBtnText}>📋 Copy Room Link</Text>
              </TouchableOpacity>
            </View>

            {copiedToast && <Text style={styles.toastText}>{copiedToast}</Text>}
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>⚡ Quick Match (Online)</Text>
            <Text style={styles.bodyText}>
              Jump straight into a fast online game! Quick Match instantly pairs you with available players and computer AI bots (AlphaBot, BetaBot, OmegaBot) so you never have to wait in long queues to start playing.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>🔒 Private Tables &amp; 4-Digit Room Codes</Text>
            <Text style={styles.bodyText}>
              Want to host a card session with friends? Create a Private Table, set your custom round count (from 1 to 20 rounds), and share the unique 4-digit room code with your friends so they can join from any browser or mobile device.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>💬 Real-time Sync &amp; Live Chat</Text>
            <Text style={styles.bodyText}>
              Every discard, card draw, and score update is synchronized in real time via our high-performance backend database connection. Use the integrated live chat to send quick system messages and banter during matches.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>🏆 Master the Least Score Card Game online</Text>
            <Text style={styles.bodyText}>
              In 7 Cards Least, every player aims for the <Text style={{fontWeight: 'bold', color: '#fbbf24'}}>least score</Text> at the table. By discarding high-value face cards and building matching sets, you minimize your points to declare "Least". Learn more about official <TouchableOpacity onPress={() => onNavigate('/rules')}><Text style={{color: '#38bdf8', textDecorationLine: 'underline'}}>7 Cards Game Rules</Text></TouchableOpacity> or explore our main guide on <TouchableOpacity onPress={() => onNavigate('/7-cards-least')}><Text style={{color: '#38bdf8', textDecorationLine: 'underline'}}>7 Cards Least online card game strategies</Text></TouchableOpacity>.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.h2}>Ready to Battle Online?</Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.primaryCta} onPress={() => onNavigate('/')}>
                <Text style={styles.ctaText}>⚡ Start Quick Match</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCta} onPress={() => onNavigate('/solo')}>
                <Text style={styles.secondaryCtaText}>🤖 Play Solo vs Computer</Text>
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

