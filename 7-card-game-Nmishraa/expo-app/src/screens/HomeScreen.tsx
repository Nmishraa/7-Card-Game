import React, { useState } from 'react';
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

interface Props {
  onJoinRoom: (playerName: string, roomId: string) => void;
  onCreateRoom: (playerName: string, rounds: number) => void;
  onPlayWithComputer?: (playerName: string, rounds: number) => void;
  userName: string;
  userId: string;
  onLogout: () => void;
  currentFeltColor: string;
  onSelectTheme: (color: string) => void;
  onQuickMatch: (playerName: string, rounds: number) => void;
}

export const HomeScreen: React.FC<Props> = ({
  onJoinRoom, onCreateRoom, onPlayWithComputer, userName, userId, onLogout, currentFeltColor, onSelectTheme, onQuickMatch
}) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const [name, setName] = useState(userName);
  const [selectedRounds, setSelectedRounds] = useState(5);
  const [roomId, setRoomId] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showClub, setShowClub] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const isWide = width >= 640;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {/* ─── TOP HEADER ─── */}
        <View style={styles.header}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.headerNavScroll} contentContainerStyle={styles.headerNav}>
            <TouchableOpacity style={styles.adminBtn} onPress={() => {
              if (isAdminLoggedIn) setShowAdminDashboard(true);
              else setShowAdminLogin(true);
            }}>
              <Text style={styles.adminBtnText}>🛡️ Game Master</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clubBtn} onPress={() => setShowClub(true)}>
              <Text style={styles.clubBtnText}>✨ Game Club</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)}>
              <Text style={styles.historyBtnText}>📖 History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyticsBtn} onPress={() => setShowAnalytics(true)}>
              <Text style={styles.analyticsBtnText}>📊 Analytics</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutBtnText}>🚪 Exit</Text>
          </TouchableOpacity>
        </View>

        {/* ─── SCROLLABLE CONTENT ─── */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isWide && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Logo at the top */}
          <View style={styles.brandContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoLarge}
              resizeMode="contain"
            />
            <Text style={styles.welcomeTagline}>The Ultimate 7-cards Experience</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, isWide && styles.cardWide]}>
            {/* Header Row */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Welcome to 7-cards Least</Text>
              <TouchableOpacity style={styles.rulesBtn} onPress={() => setShowRules(true)}>
                <Text style={styles.rulesBtnText}>How to Play</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.desc}>
              Enter your name below to start playing. Create a multiplayer table or join one with a 4-digit code.
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

            <View style={styles.divider} />

            {/* Actions */}
            {isWide ? (
              /* Desktop: 2 columns */
              <View style={styles.actionRow}>
                <View style={styles.actionCol}>
                  <Text style={styles.colLabel}>Multiplayer</Text>
                  <ActionButton label="⚡ Quick Match (Online)" onPress={() => onQuickMatch(name, selectedRounds)} disabled={!name} styles={styles} extraStyle={styles.quickMatchBtn} />
                  <ActionButton label="Create Private Table" onPress={() => onCreateRoom(name, selectedRounds)} disabled={!name} styles={styles} />
                  <Text style={[styles.colLabel, { marginTop: 14 }]}>Singleplayer</Text>
                  <ActionButton label="Play vs Computer" onPress={() => { if (onPlayWithComputer) onPlayWithComputer(name, selectedRounds); }} disabled={!name} styles={styles} extraStyle={styles.singlePlayerBtn} />
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
                <ActionButton label="⚡ Quick Match (Online)" onPress={() => onQuickMatch(name, selectedRounds)} disabled={!name} styles={styles} extraStyle={styles.quickMatchBtn} />
                <ActionButton label="Create Private Table" onPress={() => onCreateRoom(name, selectedRounds)} disabled={!name} styles={styles} />

                <Text style={[styles.colLabel, { marginTop: 14 }]}>Singleplayer</Text>
                <ActionButton label="Play vs Computer" onPress={() => { if (onPlayWithComputer) onPlayWithComputer(name, selectedRounds); }} disabled={!name} styles={styles} extraStyle={styles.singlePlayerBtn} />

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
        onQuickMatch={() => onQuickMatch(name)}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
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
    logoSmall: { 
      width: isSmall ? 130 : 160, 
      height: isSmall ? 50 : 60 
    },
    brandContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logoLarge: {
      width: isSmall ? 180 : 220,
      height: isSmall ? 80 : 100,
      marginBottom: 5,
    },
    welcomeTagline: {
      color: '#cbd5e1',
      fontSize: isSmall ? 14 : 16,
      fontStyle: 'italic',
      fontWeight: '300',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fca5a5',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
    },
    logoutBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
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
      paddingHorizontal: 16,
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
    cardWide: { maxWidth: 700 },

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
    ruleBody: { color: '#cbd5e1', fontSize: 14, lineHeight: 22 },
    closeBtn: {
      marginTop: 20,
      backgroundColor: '#0275d8',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });
};

