import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Platform, Modal, ScrollView, useWindowDimensions,
  Image, SafeAreaView
} from 'react-native';
import { HistoryModal } from '../history/HistoryModal';
import { AnalyticsModal } from '../history/AnalyticsModal';
import { ModernFeaturesModal } from './ModernFeaturesModal';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminDashboardModal } from './AdminDashboardModal';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';
import { GamePreviewSection } from '../components/GamePreviewSection';
import { GameplayDemoVideo } from '../components/GameplayDemoVideo';
import { GameInActionSection } from '../components/GameInActionSection';



interface Props {
  onJoinRoom: (playerName: string, roomId: string) => void;
  onCreateRoom: (playerName: string, rounds: number, turnTimeLimit?: number) => void;
  onPlayWithComputer?: (playerName: string, rounds: number, turnTimeLimit?: number, numBots?: number) => void;
  userName: string;
  userId: string;
  userEmail?: string;
  userPhoto?: string;
  onLogout: () => void;
  currentFeltColor: string;
  onSelectTheme: (color: string) => void;
  onQuickMatch: (playerName: string, rounds: number, turnTimeLimit?: number) => void;
  onNavigate?: (route: string) => void;
}

export const HomeScreen: React.FC<Props> = ({
  onJoinRoom, onCreateRoom, onPlayWithComputer, userName, userId, userEmail, userPhoto, onLogout, currentFeltColor, onSelectTheme, onQuickMatch, onNavigate
}) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const [name, setName] = useState(userName);
  const [selectedRounds, setSelectedRounds] = useState(5);
  const [selectedBots, setSelectedBots] = useState(1);
  const [selectedTurnTime, setSelectedTurnTime] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('7card_game_turntime');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 60; // Default: 1 Minute (60 seconds)
  });

  const handleSelectTurnTime = (time: number) => {
    setSelectedTurnTime(time);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('7card_game_turntime', time.toString());
    }
  };

  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') || params.get('join') || params.get('code');
      if (roomParam) return roomParam.toUpperCase().trim().slice(0, 4);
    }
    return '';
  });
  const [inviteNotice, setInviteNotice] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') || params.get('join') || params.get('code');
      if (roomParam) return `💬 You were invited to join room ${roomParam.toUpperCase()}! Enter your name below and tap "Join Table".`;
    }
    return null;
  });

  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showClub, setShowClub] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqList = [
    {
      q: "What is 7 Cards Least?",
      a: "7 Cards Least (often called Low Hand Rummy or 7 Cards) is a fast-paced shedding card game played with a standard 52-card deck. Each player is dealt 7 cards. The objective is to achieve the lowest cumulative hand point total by discarding high cards, forming equal-rank sets or suited runs, and declaring 'Least!' when your hand score drops to 10 points or less."
    },
    {
      q: "How do card point values and Joker wildcards work?",
      a: "Aces count as 1 point. Cards 2 through 10 carry their face value. Jack, Queen, and King are worth 10 points each. During table setup, one card is dealt face-up next to the draw pile to establish the zero-point Joker rank—any matching rank card in your hand counts as 0 points!"
    },
    {
      q: "What is the 80-point penalty for a false Least call?",
      a: "If a player calls 'Least!' but an opponent holds an equal or lower hand point score when hands are revealed, the caller incurs an 80-point penalty added to their round score. The opponent with the lowest hand score earns 0 points."
    },
    {
      q: "Can I play 7 Cards Least against computer AI bots?",
      a: "Yes! You can play singleplayer matches immediately against 1 to 7 intelligent computer AI bots. Customize the number of rounds (1–20) and turn timer (1 minute or no timer) to suit your pace."
    },
    {
      q: "How do I create a private table and play with friends?",
      a: "Tap 'Create Private Table' or 'Play with Friends & Family' on the game setup card. Share the 4-digit room code or invite link via WhatsApp, text, or social media. Friends join instantly without needing an account or app download."
    },
    {
      q: "Is 7 Cards Least free to play online?",
      a: "Yes, 7 Cards Least is 100% free to play directly in your web browser. There are no mandatory signups, paid downloads, or microtransactions required to enjoy full singleplayer and multiplayer access."
    }
  ];

  const isWide = width >= 900;
  const isDesktop = width >= 900;

  const scrollViewRef = useRef<ScrollView>(null);
  const gameCardRef = useRef<View>(null);

  const handleHeroPlayPress = () => {
    const playerName = (name && name.trim().length > 0) ? name.trim() : (userName || 'Player');
    if (onPlayWithComputer) {
      onPlayWithComputer(playerName, selectedRounds, selectedTurnTime, 1);
    }
  };

  const handleNav = (route: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(route);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {/* ─── TOP HEADER & SITE NAVIGATION BAR ─── */}
        <View style={styles.header}>
          {!isWide ? (
            /* 📱 MOBILE HEADER BAR 📱 */
            <View style={styles.mobileHeaderBar}>
              <TouchableOpacity
                style={styles.mobileMenuToggleBtn}
                onPress={() => setMobileMenuOpen(prev => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Toggle Mobile Menu"
                activeOpacity={0.7}
              >
                <Text style={styles.mobileMenuToggleIcon}>{mobileMenuOpen ? '✕' : '☰'}</Text>
                <Text style={styles.mobileMenuToggleText}>Menu</Text>
              </TouchableOpacity>

              {/* User Profile Badge */}
              <View style={styles.userHeaderBadge}>
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={styles.userHeaderAvatar} />
                ) : (
                  <View style={styles.userHeaderAvatarFallback}>
                    <Text style={styles.userHeaderAvatarText}>{(userName || 'U').charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.userHeaderDetails}>
                  <Text style={styles.userHeaderName} numberOfLines={1}>{userName}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} accessibilityRole="button" accessibilityLabel="Sign Out">
                  <Text style={styles.logoutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* 🖥️ DESKTOP UNTOUCHED HORIZONTAL NAVBAR 🖥️ */
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.headerNavScroll} contentContainerStyle={styles.headerNav}>
                <TouchableOpacity style={styles.siteNavBtnActive} onPress={() => handleNav('/')} accessibilityRole="button">
                  <Text style={styles.siteNavTextActive}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/rules')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>Rules</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/how-to-play')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>How to Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/strategy')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>Strategy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/multiplayer')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>Multiplayer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/play-against-ai')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>Play Against AI</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/faq')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.siteNavBtn} onPress={() => handleNav('/demo')} accessibilityRole="button">
                  <Text style={styles.siteNavText}>🎬 Demo</Text>
                </TouchableOpacity>

                <View style={styles.navDivider} />

                <TouchableOpacity style={styles.clubBtn} onPress={() => setShowClub(true)}>
                  <Text style={styles.clubBtnText}>✨ Game Club</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adminBtn} onPress={() => {
                  if (isAdminLoggedIn) setShowAdminDashboard(true);
                  else setShowAdminLogin(true);
                }}>
                  <Text style={styles.adminBtnText}>🛡️ Master</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* User Profile Badge */}
              <View style={styles.userHeaderBadge}>
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={styles.userHeaderAvatar} />
                ) : (
                  <View style={styles.userHeaderAvatarFallback}>
                    <Text style={styles.userHeaderAvatarText}>{(userName || 'U').charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.userHeaderDetails}>
                  <Text style={styles.userHeaderName} numberOfLines={1}>{userName}</Text>
                  {userEmail && <Text style={styles.userHeaderEmail} numberOfLines={1}>{userEmail}</Text>}
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} accessibilityRole="button" accessibilityLabel="Sign Out">
                  <Text style={styles.logoutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* 📱 MOBILE HAMBURGER MENU DROPDOWN 📱 */}
          {!isWide && mobileMenuOpen && (
            <View style={styles.mobileMenuDropdown}>
              <TouchableOpacity style={styles.mobileNavItemActive} onPress={() => handleNav('/')}>
                <Text style={styles.mobileNavTextActive}>🎮 Play Game</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/rules')}>
                <Text style={styles.mobileNavText}>📜 Rules &amp; Scoring</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/how-to-play')}>
                <Text style={styles.mobileNavText}>❓ How to Play Guide</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/strategy')}>
                <Text style={styles.mobileNavText}>💡 Winning Strategy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/multiplayer')}>
                <Text style={styles.mobileNavText}>👥 Multiplayer Mode</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/play-against-ai')}>
                <Text style={styles.mobileNavText}>🤖 Play vs Computer AI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/faq')}>
                <Text style={styles.mobileNavText}>❓ FAQ &amp; Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNav('/demo')}>
                <Text style={styles.mobileNavText}>🎬 45s Gameplay Demo</Text>
              </TouchableOpacity>

              <View style={styles.mobileNavDivider} />

              <TouchableOpacity style={styles.mobileClubItem} onPress={() => { setMobileMenuOpen(false); setShowClub(true); }}>
                <Text style={styles.mobileClubText}>✨ Game Club VIP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAdminItem} onPress={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) setShowAdminDashboard(true);
                else setShowAdminLogin(true);
              }}>
                <Text style={styles.mobileAdminText}>🛡️ Master Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ─── SCROLLABLE CONTENT ─── */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            isWide && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Logo & H1 Title at top */}
          <View style={styles.brandContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoLarge}
              resizeMode="contain"
              accessibilityLabel="7 Card Game Logo"
            />
            {/* H1 for Search Engine Discoverability */}
            <Text style={styles.h1Title}>7 Cards Least Game Online</Text>
            <Text style={styles.introParagraph}>
              Play 7 Cards Least online for free. Enjoy real-time multiplayer card games with friends or practice solo against computer AI. No download required.
            </Text>
          </View>

          {/* ─── TOP SHOWCASE: DEMO VIDEO TOP, GAME PREVIEW UNDERNEATH ─── */}
          <View style={styles.topShowcaseContainer}>
            <GameplayDemoVideo style={{ width: '100%', maxWidth: '100%', marginVertical: 0 }} />
            <GamePreviewSection style={{ width: '100%', maxWidth: '100%', marginVertical: 0 }} />

            {/* 🤖 HERO PRIMARY ACTION BUTTONS (PLAY VS BOT + PLAY WITH FRIENDS) 🎮 */}
            <View style={styles.heroCtaRow}>
              <TouchableOpacity
                style={styles.heroPrimaryPlayBtn}
                onPress={handleHeroPlayPress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Play 7 Cards vs 1 Bot"
              >
                <Text style={styles.heroPrimaryPlayBtnIcon}>🤖</Text>
                <Text style={styles.heroPrimaryPlayBtnText}>PLAY VS 1 BOT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heroFriendsPlayBtn}
                onPress={() => {
                  const playerName = (name && name.trim().length > 0) ? name.trim() : (userName || 'Player');
                  onCreateRoom(playerName, selectedRounds, selectedTurnTime);
                }}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Play with Friends & Family"
              >
                <Text style={styles.heroFriendsPlayBtnIcon}>🎮</Text>
                <Text style={styles.heroFriendsPlayBtnText}>Play with Friends &amp; Family</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Game Setup Card */}
          <View ref={gameCardRef} style={[styles.card, isWide && styles.cardWide]}>
            {inviteNotice && (
              <View style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', borderWidth: 1, borderColor: '#38bdf8', padding: 12, borderRadius: 10, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 14, flex: 1 }}>{inviteNotice}</Text>
                <TouchableOpacity onPress={() => setInviteNotice(null)} style={{ paddingLeft: 8 }}>
                  <Text style={{ color: '#cbd5e1', fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Header Row */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} accessibilityRole="header">7 Card Game Online</Text>
              <TouchableOpacity style={styles.rulesBtn} onPress={() => setShowRules(true)} accessibilityRole="button" accessibilityLabel="View How to Play Rules">
                <Text style={styles.rulesBtnText}>How to Play</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.desc}>
              Play 7 Card Game online with friends or AI. Enter your name below to start playing!
            </Text>

            {/* Name Input */}
            <Text style={styles.fieldLabel}>Your Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Bill"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            {/* Rounds Selector */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Number of Rounds per Game</Text>
            <View style={styles.roundsBox}>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() => setSelectedRounds((r) => Math.max(1, r - 1))}
              >
                <Text style={styles.roundBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.roundsText}>
                {selectedRounds} {selectedRounds === 1 ? 'Round' : 'Rounds'}
              </Text>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() => setSelectedRounds((r) => Math.min(20, r + 1))}
              >
                <Text style={styles.roundBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Computer Bots Selector */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Number of Computer Bots (Singleplayer)</Text>
            <View style={styles.roundsBox}>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() => setSelectedBots((b) => Math.max(1, b - 1))}
              >
                <Text style={styles.roundBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.roundsText}>
                🤖 {selectedBots} {selectedBots === 1 ? 'Bot' : 'Bots'} ({selectedBots + 1} Total Players)
              </Text>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() => setSelectedBots((b) => Math.min(7, b + 1))}
              >
                <Text style={styles.roundBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Turn Time Selector */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Turn Time</Text>
            <View style={styles.timeSelectRow}>
              <TouchableOpacity
                style={[styles.timeSelectBtn, selectedTurnTime === 60 && styles.timeSelectActive]}
                onPress={() => handleSelectTurnTime(60)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeSelectText, selectedTurnTime === 60 && styles.timeSelectActiveText]}>
                  ⏱️ 1 Minute
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timeSelectBtn, selectedTurnTime === 0 && styles.timeSelectActive]}
                onPress={() => handleSelectTurnTime(0)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeSelectText, selectedTurnTime === 0 && styles.timeSelectActiveText]}>
                  ∞ No Timer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Table Felt Wallpaper Customizer (World of Card Games style) */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>🎨 Table Wallpaper / Felt Theme</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { name: 'Classic Green', color: '#076324', icon: '🌿' },
                { name: 'Ocean Blue', color: '#0a192f', icon: '🌊' },
                { name: 'Royal Charcoal', color: '#18181b', icon: '🖤' },
                { name: 'Crimson Red', color: '#450a0a', icon: '🍷' }
              ].map((themeItem) => {
                const isSelected = currentFeltColor === themeItem.color;
                return (
                  <TouchableOpacity
                    key={themeItem.color}
                    onPress={() => onSelectTheme(themeItem.color)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: themeItem.color,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Set theme to ${themeItem.name}`}
                  >
                    <Text style={{ fontSize: 14 }}>{themeItem.icon}</Text>
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: isSelected ? 'bold' : '600' }}>{themeItem.name}</Text>
                    {isSelected && <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Actions */}
            {isWide ? (
              /* Desktop: 2 columns */
              <View style={styles.actionRow}>
                <View style={styles.actionCol}>
                  <Text style={styles.colLabel}>Multiplayer</Text>
                  <ActionButton label="⚡ Quick Match (Online)" onPress={() => onQuickMatch(name, selectedRounds, selectedTurnTime)} disabled={!name} styles={styles} extraStyle={styles.quickMatchBtn} />
                  <ActionButton label="Create Private Table" onPress={() => onCreateRoom(name, selectedRounds, selectedTurnTime)} disabled={!name} styles={styles} />
                  <Text style={[styles.colLabel, { marginTop: 14 }]}>Singleplayer</Text>
                  <ActionButton label={`Play vs ${selectedBots} ${selectedBots === 1 ? 'Bot' : 'Bots'}`} onPress={() => { if (onPlayWithComputer) onPlayWithComputer(name, selectedRounds, selectedTurnTime, selectedBots); }} disabled={!name} styles={styles} extraStyle={styles.singlePlayerBtn} />
                </View>

                <View style={styles.colDivider} />

                <View style={styles.actionCol}>
                  <Text style={styles.colLabel}>Join a Game</Text>
                  <TextInput
                    style={[styles.textInput, styles.codeInput]}
                    placeholder="Room Code"
                    placeholderTextColor="#888"
                    value={roomId}
                    onChangeText={setRoomId}
                    autoCapitalize="characters"
                    maxLength={4}
                  />
                  <Text style={[styles.colLabel, { marginTop: 14 }]}>Ready to Join?</Text>
                  <ActionButton
                    label="Join Table"
                    onPress={() => onJoinRoom(name, roomId.toUpperCase())}
                    disabled={!name || !roomId}
                    styles={styles}
                  />
                </View>
              </View>
            ) : (
              /* Mobile: stacked buttons */
              <View style={styles.mobileActions}>
                <Text style={styles.colLabel}>Multiplayer</Text>
                <ActionButton label="⚡ Quick Match (Online)" onPress={() => onQuickMatch(name, selectedRounds, selectedTurnTime)} disabled={!name} styles={styles} extraStyle={styles.quickMatchBtn} />
                <ActionButton label="Create Private Table" onPress={() => onCreateRoom(name, selectedRounds, selectedTurnTime)} disabled={!name} styles={styles} />

                <Text style={[styles.colLabel, { marginTop: 14 }]}>Singleplayer</Text>
                <ActionButton label={`Play vs ${selectedBots} ${selectedBots === 1 ? 'Bot' : 'Bots'}`} onPress={() => { if (onPlayWithComputer) onPlayWithComputer(name, selectedRounds, selectedTurnTime, selectedBots); }} disabled={!name} styles={styles} extraStyle={styles.singlePlayerBtn} />

                <View style={styles.divider} />

                <Text style={styles.colLabel}>Join a Game</Text>
                <TextInput
                  style={[styles.textInput, styles.codeInput]}
                  placeholder="Enter 4-digit Room Code"
                  placeholderTextColor="#888"
                  value={roomId}
                  onChangeText={setRoomId}
                  autoCapitalize="characters"
                  maxLength={4}
                  keyboardType="default"
                />
                <ActionButton
                  label="Join Table"
                  onPress={() => onJoinRoom(name, roomId.toUpperCase())}
                  disabled={!name || !roomId}
                  styles={styles}
                />
              </View>
            )}
          </View>

          {/* ─── SEO SUPPORTING SECTION: LEAST SCORE CARD GAME ─── */}
          <View style={styles.seoContentContainer}>
            <View style={styles.seoSectionCard}>
              <Text style={styles.h2Title}>7 Cards Least – A Lowest Score Card Game</Text>
              <Text style={styles.seoSectionText}>
                7 Cards Least is an engaging online card game where the core objective is to finish with the <Text style={styles.boldFeature}>least score</Text> (lowest point total). Unlike traditional games where higher points win, in this lowest score card game players strategically discard high-point cards, form sets or suited runs, and utilize Wild 7 Jokers (0 points) to minimize their hand value.
              </Text>
              <Text style={[styles.seoSectionText, { marginTop: 10 }]}>
                When your total hand score drops to 10 points or less, declare <Text style={styles.boldFeature}>LEAST!</Text> to end the round. The player with the least score earns 0 points for the round, while opponents collect penalty points. Practice against AI bots or challenge friends in online multiplayer matches.
              </Text>
              
              {/* Internal Linking Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <TouchableOpacity style={styles.inlineLinkBtn} onPress={() => handleNav('/7-cards-least')} accessibilityRole="button">
                  <Text style={styles.inlineLinkText}>📖 Learn 7 Cards Least Guide ➔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inlineLinkBtn} onPress={() => handleNav('/multiplayer')} accessibilityRole="button">
                  <Text style={styles.inlineLinkText}>🎮 Play Multiplayer Online ➔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inlineLinkBtn} onPress={() => handleNav('/rules')} accessibilityRole="button">
                  <Text style={styles.inlineLinkText}>📜 Read Game Rules &amp; Scoring ➔</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 🎴 CARD POINT SYSTEM REFERENCE GRID (World of Card Games style) */}
            <View style={[styles.seoSectionCard, { marginTop: 16, backgroundColor: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
              <Text style={[styles.h2Title, { color: '#38bdf8' }]}>🎴 Official Card Point Values &amp; Scoring</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                {[
                  { title: 'Ace (A)', pts: '1 Point', desc: 'Lowest face card value', color: '#38bdf8' },
                  { title: 'Number Cards (2–10)', pts: 'Face Value (2–10 pts)', desc: 'Carries exact rank points', color: '#94a3b8' },
                  { title: 'Face Cards (J, Q, K)', pts: '10 Points', desc: 'High penalty risk', color: '#f43f5e' },
                  { title: 'Joker Rank (Wild)', pts: '0 Points', desc: 'Established by table setup flip', color: '#34d399' },
                  { title: 'Least Threshold', pts: '≤ 10 Points', desc: 'Required to declare Least', color: '#fbbf24' },
                  { title: 'False Least Penalty', pts: '+80 Points', desc: 'Penalty if opponent is lower', color: '#ef4444' }
                ].map((item, idx) => (
                  <View key={idx} style={{ flex: 1, minWidth: 160, backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Text style={{ color: item.color, fontWeight: 'bold', fontSize: 14 }}>{item.title}</Text>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, marginVertical: 4 }}>{item.pts}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ❓ INTERACTIVE COLLAPSIBLE FAQ ACCORDION (World of Card Games style) */}
            <View style={[styles.seoSectionCard, { marginTop: 16, backgroundColor: 'rgba(10, 22, 40, 0.9)', borderColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={styles.h2Title}>❓ Frequently Asked Questions (FAQ)</Text>
              <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>
                Everything you need to know about playing 7 Cards Least online, rules, wildcards, and game options.
              </Text>

              <View style={{ gap: 10 }}>
                {faqList.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <View 
                      key={index}
                      style={{
                        backgroundColor: isOpen ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: isOpen ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255,255,255,0.08)',
                        overflow: 'hidden'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setOpenFaqIndex(isOpen ? null : index)}
                        style={{
                          padding: 14,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={faq.q}
                      >
                        <Text style={{ color: isOpen ? '#38bdf8' : '#ffffff', fontSize: 15, fontWeight: 'bold', flex: 1, paddingRight: 10 }}>
                          {faq.q}
                        </Text>
                        <Text style={{ color: isOpen ? '#38bdf8' : '#64748b', fontSize: 16, fontWeight: 'bold' }}>
                          {isOpen ? '▲' : '▼'}
                        </Text>
                      </TouchableOpacity>

                      {isOpen && (
                        <View style={{ paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 }}>
                          <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 22 }}>
                            {faq.a}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* ─── LOWER PLAY WITH FRIENDS CTA & PRIVATE ROOM INFO SECTION ─── */}
          <View style={styles.playWithFriendsSection}>
            <TouchableOpacity 
              style={styles.prominentPlayWithFriendsBtn}
              onPress={() => {
                const playerName = (name && name.trim().length > 0) ? name.trim() : (userName || 'Player');
                onCreateRoom(playerName, selectedRounds, selectedTurnTime);
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Play with Friends & Family"
            >
              <Text style={styles.prominentPlayWithFriendsIcon}>🎮</Text>
              <Text style={styles.prominentPlayWithFriendsText}>Play with Friends &amp; Family</Text>
            </TouchableOpacity>

            <View style={styles.privateRoomInfoCard}>
              <Text style={styles.privateRoomHeading}>Play With Friends &amp; Family</Text>
              <Text style={styles.privateRoomSubheading}>
                Create a private room, share the link or 4-digit code, and play 7 Cards Least together.
              </Text>

              {/* 3 Simple Steps */}
              <View style={styles.stepsContainer}>
                <View style={styles.stepItemCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepItemTitle}>Create a Room</Text>
                    <Text style={styles.stepItemText}>
                      Click <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>Play with Friends</Text> to create your private game room.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItemCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>2</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepItemTitle}>Invite Friends</Text>
                    <Text style={styles.stepItemText}>
                      Share the <Text style={{ color: '#fbbf24', fontWeight: 'bold' }}>4-digit room code</Text> or copy the <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>game link</Text> and send it through WhatsApp, text, or any other messaging app.
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItemCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>3</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepItemTitle}>Play Together</Text>
                    <Text style={styles.stepItemText}>
                      Your friends join the room, the host starts the game, and everyone plays together.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Private Room Details Area */}
              <View style={styles.roomRulesBox}>
                <Text style={styles.roomRulesHeading}>ℹ️ How private rooms work</Text>
                <View style={styles.roomRulesList}>
                  <Text style={styles.roomRuleBullet}>• Private rooms are for <Text style={{ color: '#fff', fontWeight: 'bold' }}>family and friends</Text>.</Text>
                  <Text style={styles.roomRuleBullet}>• Friends can join using the <Text style={{ color: '#fbbf24', fontWeight: 'bold' }}>room code or shared link</Text>.</Text>
                  <Text style={styles.roomRuleBullet}>• The waiting room stays active for <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>15 minutes</Text>.</Text>
                  <Text style={styles.roomRuleBullet}>• Once the game starts, it remains active until the game finishes.</Text>
                  <Text style={styles.roomRuleBullet}>• After the game ends, players have <Text style={{ color: '#34d399', fontWeight: 'bold' }}>5 minutes to play again</Text>.</Text>
                  <Text style={styles.roomRuleBullet}>• Empty or inactive rooms are automatically closed.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── GAME IN ACTION SCREENSHOTS GALLERY ─── */}
          <GameInActionSection />




          {/* ─── FOOTER & COMPLIANCE LINKS ─── */}
          <View style={styles.footerContainer}>
            <View style={styles.footerNav}>
              <TouchableOpacity onPress={() => handleNav('/')} accessibilityRole="button"><Text style={styles.footerLink}>Play</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/rules')} accessibilityRole="button"><Text style={styles.footerLink}>Rules</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/how-to-play')} accessibilityRole="button"><Text style={styles.footerLink}>How to Play</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/strategy')} accessibilityRole="button"><Text style={styles.footerLink}>Strategy</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/multiplayer')} accessibilityRole="button"><Text style={styles.footerLink}>Multiplayer</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/play-against-ai')} accessibilityRole="button"><Text style={styles.footerLink}>Play Against AI</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => handleNav('/faq')} accessibilityRole="button"><Text style={styles.footerLink}>FAQ</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => setShowPrivacy(true)} accessibilityRole="button"><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => setShowTerms(true)} accessibilityRole="button"><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
            </View>
            <Text style={styles.footerCredits}>
              7 Card Game • cards.gnanamai.com
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Rules Modal */}
      <Modal visible={showRules} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How to Play: 7-cards Least</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {[
                ['1. Objective', 'The goal is to have the lowest total score. The game ends after 5 rounds or when only one player remains.'],
                ['2. Dealing', 'Each player is dealt 7 cards. One card is flipped as the Joker, and another starts the Discard Pile.'],
                ['3. Turn Flow', 'Turns move ANTICLOCKWISE. On your turn, you must DISCARD first, then PICK one card from the Deck or Discard Pile.'],
                ['4. Valid Discards', 'You can discard a single card, a SET (same rank), or a RUN (3+ consecutive cards of the same suit).'],
                ['5. The Joker Rule', 'The face-up Joker card makes all cards of that rank in your hand count as 0 points!'],
                ['6. Card Values', 'Ace = 1 pt  •  2–10 = face value  •  J, Q, K = 10 pts.'],
                ['7. Match & Skip', 'If your discard matches the rank of the current top discard, your turn ends immediately without picking!'],
                ['8. Immediate Drop', 'If you draw a card from the deck that matches the rank you just discarded, it is dropped automatically.'],
                ['9. Calling Least', 'If you believe you have the lowest total hand score, tap "Least!" during your discard phase to end the round.'],
                ['10. Penalty', 'If you call "Least" but someone else has an equal or lower score, you are penalized with 80 points!'],
                ['11. Scoring', 'The round winner gets 0 pts. All other players receive their hand score minus the winner\'s score.'],
                ['12. Elimination', 'If your total score reaches 200 points, you are eliminated. The last player standing wins!'],
              ].map(([h, b]) => (
                <View key={h} style={{ marginBottom: 14 }}>
                  <Text style={styles.ruleHead}>{h}</Text>
                  <Text style={styles.ruleBody}>{b}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowRules(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <HistoryModal visible={showHistory} onClose={() => setShowHistory(false)} />

      {/* Analytics Modal */}
      <AnalyticsModal visible={showAnalytics} onClose={() => setShowAnalytics(false)} />

      {/* Modern Features Modal */}
      <ModernFeaturesModal
        visible={showClub}
        onClose={() => setShowClub(false)}
        userName={name}
        userId={userId}
        currentFeltColor={currentFeltColor}
        onSelectTheme={onSelectTheme}
        onQuickMatch={() => onQuickMatch(name, selectedRounds)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        visible={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          setShowAdminLogin(false);
          setIsAdminLoggedIn(true);
          setShowAdminDashboard(true);
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        visible={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        onLogoutAdmin={() => {
          setIsAdminLoggedIn(false);
          setShowAdminDashboard(false);
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Terms of Service Modal */}
      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>

  );
};

/* ── Small reusable button ── */
function ActionButton({ label, onPress, disabled, styles, extraStyle }: {
  label: string; onPress: () => void; disabled?: boolean; styles: any; extraStyle?: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, extraStyle, disabled && styles.actionBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.actionBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (width: number, height: number) => {
  const isSmall = width < 400;
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#062d12',
      ...(Platform.OS === 'web' ? { backgroundImage: 'linear-gradient(135deg, #0b5e28 0%, #062d12 55%, #0a1628 100%)' } : {}),
    } as any,
    safeArea: { flex: 1 },

    /* Header */
    header: {
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
      zIndex: 100,
    },
    mobileHeaderBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      width: '100%',
    },
    mobileMenuToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#38bdf8',
    },
    mobileMenuToggleIcon: {
      color: '#38bdf8',
      fontSize: 18,
      fontWeight: 'bold',
    },
    mobileMenuToggleText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    mobileMenuDropdown: {
      width: '100%',
      backgroundColor: '#0f172a',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 4,
    },
    mobileNavItem: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.03)',
    },
    mobileNavItemActive: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: '#0284c7',
    },
    mobileNavText: {
      color: '#cbd5e1',
      fontSize: 14,
      fontWeight: '600',
    },
    mobileNavTextActive: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    mobileNavDivider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginVertical: 6,
    },
    mobileClubItem: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: 'rgba(168, 85, 247, 0.15)',
      borderWidth: 1,
      borderColor: '#a855f7',
    },
    mobileClubText: {
      color: '#c084fc',
      fontSize: 14,
      fontWeight: 'bold',
    },
    mobileAdminItem: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderWidth: 1,
      borderColor: '#ef4444',
      marginTop: 4,
    },
    mobileAdminText: {
      color: '#f87171',
      fontSize: 14,
      fontWeight: 'bold',
    },
    headerNavScroll: {
      flex: 1,
      marginRight: 12,
    },
    headerNav: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    /* Site Navbar Links */
    siteNavBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    siteNavBtnActive: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: '#0275d8',
    },
    siteNavText: {
      color: '#cbd5e1',
      fontSize: 13,
      fontWeight: '600',
    },
    siteNavTextActive: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: 'bold',
    },
    navDivider: {
      width: 1,
      height: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginHorizontal: 4,
    },

    logoSmall: { 
      width: isSmall ? 130 : 160, 
      height: isSmall ? 50 : 60 
    },
    brandContainer: {
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 24,
      maxWidth: 720,
    },
    logoLarge: {
      width: isSmall ? 180 : 240,
      height: isSmall ? 80 : 108,
      marginBottom: 8,
    },
    h1Title: {
      color: '#ffffff',
      fontSize: isSmall ? 24 : 32,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 10,
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 6,
    },
    introParagraph: {
      color: '#cbd5e1',
      fontSize: isSmall ? 15 : 16,
      lineHeight: 25,
      textAlign: 'center',
      paddingHorizontal: 16,
      maxWidth: 640,
    },
    /* Hero CTA Row & Buttons */
    heroCtaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      width: '100%',
      maxWidth: 780,
      marginTop: 20,
      marginBottom: 8,
      flexWrap: 'wrap',
    },
    heroPrimaryPlayBtn: {
      backgroundColor: '#16a34a',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: isSmall ? 20 : 32,
      paddingVertical: isSmall ? 14 : 18,
      borderRadius: 16,
      flex: 1,
      minWidth: isSmall ? 260 : 280,
      borderWidth: 2,
      borderColor: '#4ade80',
      shadowColor: '#22c55e',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
      } : {}),
    },
    heroPrimaryPlayBtnIcon: {
      fontSize: 22,
    },
    heroPrimaryPlayBtnText: {
      color: '#ffffff',
      fontSize: isSmall ? 16 : 18,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    heroFriendsPlayBtn: {
      backgroundColor: '#2563eb',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: isSmall ? 20 : 32,
      paddingVertical: isSmall ? 14 : 18,
      borderRadius: 16,
      flex: 1,
      minWidth: isSmall ? 260 : 280,
      borderWidth: 2,
      borderColor: '#60a5fa',
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
      } : {}),
    },
    heroFriendsPlayBtnIcon: {
      fontSize: 22,
    },
    heroFriendsPlayBtnText: {
      color: '#ffffff',
      fontSize: isSmall ? 16 : 18,
      fontWeight: '900',
      letterSpacing: 0.5,
    },

    /* Lower Play With Friends Section Styles */
    playWithFriendsSection: {
      width: '100%',
      maxWidth: 780,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 24,
      paddingHorizontal: isSmall ? 8 : 16,
    },
    prominentPlayWithFriendsBtn: {
      backgroundColor: '#2563eb',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 16,
      gap: 12,
      width: '100%',
      maxWidth: 380,
      marginBottom: 20,
      elevation: 6,
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      borderWidth: 1.5,
      borderColor: '#60a5fa',
    },
    prominentPlayWithFriendsIcon: { fontSize: 22 },
    prominentPlayWithFriendsText: {
      color: '#ffffff',
      fontSize: isSmall ? 16 : 18,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    privateRoomInfoCard: {
      width: '100%',
      backgroundColor: '#1e293b',
      borderRadius: 20,
      padding: isSmall ? 18 : 24,
      borderWidth: 1,
      borderColor: '#334155',
      elevation: 6,
    },
    privateRoomHeading: {
      color: '#ffffff',
      fontSize: isSmall ? 20 : 24,
      fontWeight: '900',
      marginBottom: 6,
      textAlign: 'center',
    },
    privateRoomSubheading: {
      color: '#cbd5e1',
      fontSize: isSmall ? 13 : 15,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 20,
    },
    stepsContainer: {
      gap: 12,
      marginBottom: 20,
    },
    stepItemCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#0f172a',
      borderRadius: 12,
      padding: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: '#334155',
    },
    stepBadge: {
      backgroundColor: '#0284c7',
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepBadgeText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    stepItemTitle: {
      color: '#f8fafc',
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    stepItemText: {
      color: '#cbd5e1',
      fontSize: 13,
      lineHeight: 19,
    },
    roomRulesBox: {
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    roomRulesHeading: {
      color: '#38bdf8',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    roomRulesList: {
      gap: 6,
    },
    roomRuleBullet: {
      color: '#cbd5e1',
      fontSize: 13,
      lineHeight: 19,
    },

    /* Top Showcase Container: Preview top, Demo video underneath */
    topShowcaseContainer: {
      width: '100%',
      maxWidth: 780,
      marginVertical: width < 640 ? 12 : 24,
      gap: width < 640 ? 16 : 28,
      alignItems: 'center',
    },
    welcomeTagline: {
      color: '#cbd5e1',
      fontSize: isSmall ? 14 : 16,
      fontStyle: 'italic',
      fontWeight: '300',
      textAlign: 'center',
    },

    /* SEO Content Sections */
    seoContentContainer: {
      width: '100%',
      maxWidth: 780,
      marginTop: 32,
      gap: 16,
    },
    seoSectionCard: {
      backgroundColor: 'rgba(10, 22, 40, 0.85)',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    h2Title: {
      color: '#38bdf8',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    seoSectionText: {
      color: '#cbd5e1',
      fontSize: 14,
      lineHeight: 22,
    },
    inlineLinkBtn: {
      marginTop: 10,
      alignSelf: 'flex-start',
    },
    inlineLinkText: {
      color: '#fbbf24',
      fontSize: 14,
      fontWeight: 'bold',
    },
    featureGrid: {
      marginTop: 6,
      gap: 8,
    },
    featureItem: {
      color: '#cbd5e1',
      fontSize: 14,
      lineHeight: 20,
    },
    boldFeature: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    primaryPlayCta: {
      marginTop: 14,
      backgroundColor: '#0275d8',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
    },
    primaryPlayCtaText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 15,
    },
    userHeaderBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      alignSelf: width >= 640 ? 'auto' : 'flex-end',
      marginTop: width >= 640 ? 0 : 4,
    },
    userHeaderAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#38bdf8',
    },
    userHeaderAvatarFallback: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#0284c7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userHeaderAvatarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    userHeaderDetails: {
      justifyContent: 'center',
      maxWidth: 120,
    },
    userHeaderName: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 13,
    },
    userHeaderEmail: {
      color: '#94a3b8',
      fontSize: 10,
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
    historyBtn: {
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#38bdf8',
    },
    historyBtnText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
    analyticsBtn: {
      backgroundColor: 'rgba(250, 204, 21, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#facc15',
    },
    analyticsBtnText: { color: '#facc15', fontWeight: 'bold', fontSize: 14 },
    clubBtn: {
      backgroundColor: 'rgba(168, 85, 247, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#a855f7',
    },
    clubBtnText: { color: '#a855f7', fontWeight: 'bold', fontSize: 14 },
    adminBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ef4444',
    },
    adminBtnText: { color: '#f87171', fontWeight: 'bold', fontSize: 14 },

    /* Scroll */
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: width < 640 ? 6 : 16,
      paddingBottom: 30,
      paddingTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContentWide: {
      alignItems: 'center',
    },

    /* Card */
    card: {
      backgroundColor: 'rgba(10, 22, 40, 0.85)',
      borderRadius: 20,
      padding: isSmall ? 20 : 28,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 10,
    },
    cardWide: { maxWidth: 780 },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
      gap: 10,
    },
    cardTitle: {
      color: '#fff',
      fontSize: isSmall ? 18 : 22,
      fontWeight: 'bold',
      flexShrink: 1,
    },
    rulesBtn: {
      backgroundColor: '#0275d8',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
    },
    rulesBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

    desc: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 20 },

    fieldLabel: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    textInput: {
      backgroundColor: '#1e293b',
      color: '#fff',
      borderWidth: 1,
      borderColor: '#334155',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      width: '100%',
      marginBottom: 8,
    },
    codeInput: {
      textAlign: 'center',
      fontSize: 20,
      letterSpacing: 6,
      fontWeight: 'bold',
      marginBottom: 12,
    },

    roundsBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#1e293b',
      borderWidth: 1,
      borderColor: '#475569',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      width: '100%',
    },
    roundBtn: {
      backgroundColor: '#334155',
      width: 44,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#64748b',
    },
    roundBtnText: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
    },
    roundsText: {
      color: '#fbbf24',
      fontSize: 18,
      fontWeight: 'bold',
    },

    timeSelectRow: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    timeSelectBtn: {
      flex: 1,
      backgroundColor: '#1e293b',
      borderWidth: 1,
      borderColor: '#475569',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeSelectActive: {
      backgroundColor: '#0284c7',
      borderColor: '#38bdf8',
    },
    timeSelectText: {
      color: '#cbd5e1',
      fontSize: 15,
      fontWeight: 'bold',
    },
    timeSelectActiveText: {
      color: '#ffffff',
      fontWeight: '900',
    },

    divider: { height: 1, backgroundColor: '#334155', marginVertical: 20 },

    /* Desktop 2-col */
    actionRow: { flexDirection: 'row', gap: 24 },
    actionCol: { flex: 1 },
    colDivider: { width: 1, backgroundColor: '#334155' },

    /* Mobile single-col */
    mobileActions: { width: '100%' },

    colLabel: {
      color: '#94a3b8',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    actionBtn: {
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
      backgroundColor: '#0275d8',
      minHeight: 50,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    singlePlayerBtn: {
      backgroundColor: '#7c3aed',
    },
    quickMatchBtn: {
      backgroundColor: '#0ea5e9',
      borderWidth: 1,
      borderColor: '#7dd3fc',
    },
    actionBtnDisabled: { opacity: 0.5 },
    actionBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },

    /* Modal */
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalCard: {
      width: '100%',
      maxWidth: 520,
      maxHeight: '85%',
      backgroundColor: '#0f172a',
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: '#334155',
    },
    modalTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    ruleHead: { color: '#38bdf8', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
    ruleBody: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
    closeBtn: { marginTop: 16, backgroundColor: '#0275d8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    /* Hero Visual Showcase (Screenshot 60% + Video 40%) */
    heroSideBySideContainer: {
      width: '100%',
      maxWidth: 1240,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      marginVertical: 24,
      paddingHorizontal: 12,
    },
    heroScreenshotCol: {
      flex: 0.58,
      width: '58%',
    },
    heroVideoCol: {
      flex: 0.42,
      width: '40%',
    },
    heroStackedContainer: {
      width: '100%',
      flexDirection: 'column',
      gap: 20,
      marginVertical: 18,
      paddingHorizontal: 8,
    },
    mobileVideoWrapper: {
      width: '100%',
      alignSelf: 'center',
    },
    mobileScreenshotWrapper: {
      width: '100%',
      alignSelf: 'center',
    },
    previewCompactMargin: {
      marginVertical: 0,
      maxWidth: '100%',
    },
    videoCompactMargin: {
      marginVertical: 0,
      maxWidth: '100%',
    },

    /* Footer */

    footerContainer: {
      marginTop: 40,
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
      width: '100%',
    },
    footerNav: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: 18,
      rowGap: 12,
      marginBottom: 16,
    },
    footerLink: {
      color: '#38bdf8',
      fontSize: 14,
      fontWeight: '600',
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    footerDot: {
      color: '#64748b',
      fontSize: 14,
      marginHorizontal: 4,
    },
    footerCredits: {
      color: '#64748b',
      fontSize: 13,
      fontStyle: 'italic',
      letterSpacing: 0.5,
      marginTop: 6,
    },
  });
};


