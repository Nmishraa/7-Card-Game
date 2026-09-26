import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosInstructions, setShowIosInstructions] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if already running in standalone PWA app mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;

    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // Default to showing banner on web browsers
    setShowBanner(true);

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowIosInstructions(true);
    }
  };

  if (!showBanner) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerIcon}>📱</Text>
        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>Install 7 Cards Mobile App</Text>
          <Text style={styles.bannerSubtitle}>Play fullscreen with zero download required!</Text>
        </View>
        <TouchableOpacity style={styles.installBtn} onPress={handleInstallClick}>
          <Text style={styles.installBtnText}>📲 Install</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowBanner(false)}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {showIosInstructions && (
        <View style={styles.iosInstructionBox}>
          <Text style={styles.iosTitle}>{isIos ? 'How to install on iPhone/iPad 🍏:' : 'How to install on Mobile & Desktop 📲:'}</Text>
          {isIos ? (
            <>
              <Text style={styles.iosStep}>1. Tap the <Text style={styles.boldText}>Share</Text> icon ⎋ at the bottom of Safari.</Text>
              <Text style={styles.iosStep}>2. Scroll down and tap <Text style={styles.boldText}>"Add to Home Screen"</Text> ➕.</Text>
            </>
          ) : (
            <>
              <Text style={styles.iosStep}>1. Open your browser menu (3 dots ⋮ at the top right).</Text>
              <Text style={styles.iosStep}>2. Tap <Text style={styles.boldText}>"Add to Home screen"</Text> or <Text style={styles.boldText}>"Install App"</Text> 📲.</Text>
            </>
          )}
          <TouchableOpacity style={styles.dismissIosBtn} onPress={() => setShowIosInstructions(false)}>
            <Text style={styles.dismissIosText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#38bdf8',
    zIndex: 99999,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  installBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  installBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iosInstructionBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  iosTitle: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  iosStep: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  boldText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dismissIosBtn: {
    backgroundColor: '#3b82f6',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  dismissIosText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
