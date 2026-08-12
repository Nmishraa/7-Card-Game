import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert
} from 'react-native';
import { addLike } from '../history/adminService';

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  currentFeltColor: string;
  onSelectTheme: (color: string) => void;
  onQuickMatch: () => void;
}

type TabType = 'profile' | 'ranked' | 'achievements' | 'friends' | 'themes';

export const ModernFeaturesModal: React.FC<Props> = ({
  visible, onClose, userName, userId, currentFeltColor, onSelectTheme, onQuickMatch
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [claimedReward, setClaimedReward] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');

  const handleClaim = () => {
    if (claimedReward) return;
    setClaimedReward(true);
    Alert.alert('Daily Reward Claimed!', '🎁 +500 Chips have been added to your balance.');
  };

  const handleAddFriend = () => {
    if (!friendEmail.trim()) return;
    Alert.alert('Friend Request Sent!', `An invite has been dispatched to ${friendEmail}.`);
    setFriendEmail('');
  };

  const leaderboards = [
    { rank: 1, name: 'AlexTheAce', elo: 4520, winRate: '78%' },
    { rank: 2, name: 'Sarah_Cardsharp', elo: 4210, winRate: '74%' },
    { rank: 3, name: 'LeastLegend99', elo: 3980, winRate: '69%' },
    { rank: 4, name: 'KingOfDiamonds', elo: 3850, winRate: '65%' },
    { rank: 5, name: userName, elo: 3650, winRate: '62%' },
    { rank: 6, name: 'VegasBill', elo: 3420, winRate: '58%' },
    { rank: 7, name: 'QueenOfHearts', elo: 3150, winRate: '54%' },
  ];

  const friendsList = [
    { name: 'ElenaG', status: '🟢 Online - In Lobby', rank: 'Diamond II' },
    { name: 'MarcusA', status: '🔴 In Game - RND 3/5', rank: 'Platinum IV' },
    { name: 'Chloe_99', status: '⚪ Offline', rank: 'Gold I' },
    { name: 'DavidSmith', status: '🟢 Online - Ready', rank: 'Master' },
  ];

  const achievements = [
    { title: 'Least Legend', desc: 'Call Least and win 10 rounds', progress: '8/10', icon: '👑' },
    { title: 'Flawless Victory', desc: 'Finish a round with 0 penalty points', progress: 'Completed', icon: '🏆' },
    { title: 'Social Cardsharp', desc: 'Play multiplayer games with 5 unique friends', progress: '5/5', icon: '👥' },
    { title: 'High Roller', desc: 'Accumulate over 5,000 total chips', progress: '3,650/5,000', icon: '💎' },
  ];

  const themes = [
    { name: 'Classic Rummy Green', color: '#076324', isVip: false },
    { name: 'Royal Navy Rummy', color: '#1e3a8a', isVip: false },
    { name: 'Obsidian Black Table', color: '#18181b', isVip: false },
    { name: 'Crimson Velvet Rummy', color: '#991b1b', isVip: false },
    { name: 'Golden VIP Mahogany', color: '#854d0e', isVip: true },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>✨ Modern Card Club</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarScroll} contentContainerStyle={styles.tabBar}>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'profile' && styles.activeTabBtn]} onPress={() => setActiveTab('profile')}>
                <Text style={[styles.tabBtnText, activeTab === 'profile' && styles.activeTabBtnText]}>👤 Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'ranked' && styles.activeTabBtn]} onPress={() => setActiveTab('ranked')}>
                <Text style={[styles.tabBtnText, activeTab === 'ranked' && styles.activeTabBtnText]}>🏆 Ranked</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'achievements' && styles.activeTabBtn]} onPress={() => setActiveTab('achievements')}>
                <Text style={[styles.tabBtnText, activeTab === 'achievements' && styles.activeTabBtnText]}>🎁 Rewards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'friends' && styles.activeTabBtn]} onPress={() => setActiveTab('friends')}>
                <Text style={[styles.tabBtnText, activeTab === 'friends' && styles.activeTabBtnText]}>👥 Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'themes' && styles.activeTabBtn]} onPress={() => setActiveTab('themes')}>
                <Text style={[styles.tabBtnText, activeTab === 'themes' && styles.activeTabBtnText]}>🎨 Themes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {activeTab === 'profile' && (
              <View style={styles.profileSection}>
                <View style={styles.avatarCard}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>{userName ? userName.charAt(0).toUpperCase() : 'P'}</Text>
                  </View>
                  <View style={styles.avatarInfo}>
                    <Text style={styles.profileName}>{userName}</Text>
                    <Text style={styles.badgeText}>⭐ Level 24 (Master Cardsharp)</Text>
                  </View>
                </View>

                <View style={styles.xpCard}>
                  <View style={styles.xpHeader}>
                    <Text style={styles.xpLabel}>XP to Level 25</Text>
                    <Text style={styles.xpValue}>3,400 / 5,000 XP</Text>
                  </View>
                  <View style={styles.xpTrack}>
                    <View style={styles.xpFill} />
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>68%</Text>
                    <Text style={styles.statTitle}>Win Rate</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>5 🔥</Text>
                    <Text style={styles.statTitle}>Win Streak</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>3,650</Text>
                    <Text style={styles.statTitle}>Chips Balance</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>7 ♥</Text>
                    <Text style={styles.statTitle}>Favorite Card</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.quickMatchBtn} onPress={() => { onClose(); onQuickMatch(); }}>
                  <Text style={styles.quickMatchBtnText}>⚡ Instant Quick Match</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'ranked' && (
              <View style={styles.rankedSection}>
                <View style={styles.leagueCard}>
                  <Text style={styles.leagueTitle}>💎 Diamond League III</Text>
                  <Text style={styles.leagueDesc}>Top 5% of global 7-cards players. Next season reset in 6 days.</Text>
                </View>

                <View style={styles.leaderboardBox}>
                  <Text style={styles.sectionHeader}>Global Top Players</Text>
                  <View style={styles.thRow}>
                    <Text style={styles.thColRank}>Rank</Text>
                    <Text style={styles.thColName}>Player</Text>
                    <Text style={styles.thColElo}>Rating</Text>
                    <Text style={styles.thColWin}>Win %</Text>
                  </View>
                  {leaderboards.map(l => (
                    <View key={l.rank} style={[styles.lRow, l.name === userName && styles.myRow]}>
                      <Text style={styles.colRank}>#{l.rank}</Text>
                      <Text style={[styles.colName, l.name === userName && styles.myColText]}>{l.name} {l.name === userName && '(You)'}</Text>
                      <Text style={styles.colElo}>{l.elo}</Text>
                      <Text style={styles.colWin}>{l.winRate}</Text>
                      {l.name !== userName && (
                        <TouchableOpacity style={{ marginLeft: 12, padding: 4 }} onPress={() => {
                          addLike(userId, userName, `user-${l.name.toLowerCase()}`, l.name);
                          Alert.alert('Appreciation Sent!', `You sent a ❤️ like to ${l.name}!`);
                        }}>
                          <Text style={{ fontSize: 16 }}>❤️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'achievements' && (
              <View style={styles.achievementsSection}>
                <View style={styles.dailyRewardCard}>
                  <Text style={styles.dailyRewardTitle}>🎁 Daily Streak Reward</Text>
                  <Text style={styles.dailyRewardDesc}>Login every day to unlock increasing chips and VIP card backs.</Text>
                  <TouchableOpacity style={[styles.claimBtn, claimedReward && styles.claimedBtn]} onPress={handleClaim}>
                    <Text style={styles.claimBtnText}>{claimedReward ? '✓ Claimed (Come back tomorrow)' : 'Claim 500 Chips'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeader}>Unlocked & In-Progress Badges</Text>
                {achievements.map((a, idx) => (
                  <View key={idx} style={styles.achieveCard}>
                    <Text style={styles.achieveIcon}>{a.icon}</Text>
                    <View style={styles.achieveInfo}>
                      <Text style={styles.achieveTitle}>{a.title}</Text>
                      <Text style={styles.achieveDesc}>{a.desc}</Text>
                    </View>
                    <View style={styles.achieveBadge}>
                      <Text style={styles.achieveProgress}>{a.progress}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'friends' && (
              <View style={styles.friendsSection}>
                <View style={styles.inviteBox}>
                  <Text style={styles.inviteBoxTitle}>Add a Friend</Text>
                  <View style={styles.inviteRow}>
                    <TextInput style={styles.inviteInput} placeholder="Friend's User ID or Email" placeholderTextColor="#888" value={friendEmail} onChangeText={setFriendEmail} />
                    <TouchableOpacity style={styles.inviteBtn} onPress={handleAddFriend}>
                      <Text style={styles.inviteBtnText}>Send Request</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.sectionHeader}>Online Friends ({friendsList.length})</Text>
                {friendsList.map((f, idx) => (
                  <View key={idx} style={styles.friendCard}>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{f.name}</Text>
                      <Text style={styles.friendStatus}>{f.status}</Text>
                    </View>
                    <TouchableOpacity style={styles.inviteGameBtn} onPress={() => Alert.alert('Invite Dispatched', `Invited ${f.name} to play.`)}>
                      <Text style={styles.inviteGameBtnText}>Invite to Game</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'themes' && (
              <View style={styles.themesSection}>
                <Text style={styles.themeSub}>Select Custom Playing Table Style</Text>
                {themes.map((t, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.themeCard, currentFeltColor === t.color && styles.selectedThemeCard]}
                    onPress={() => onSelectTheme(t.color)}
                  >
                    <View style={[styles.themeColorSample, { backgroundColor: t.color }]} />
                    <View style={styles.themeInfo}>
                      <Text style={styles.themeName}>{t.name}</Text>
                      <Text style={styles.themeDesc}>{t.isVip ? '⭐ VIP Exclusive Surface' : 'Classic Premium Felt'}</Text>
                    </View>
                    {currentFeltColor === t.color && <Text style={styles.activeCheck}>✓ ACTIVE</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContainer: { width: '100%', maxWidth: 650, height: '88%', backgroundColor: '#0f172a', borderRadius: 24, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  closeBtn: { padding: 6 },
  closeBtnText: { color: '#94a3b8', fontSize: 20, fontWeight: 'bold' },
  tabBarScroll: { backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1e293b' },
  tabBtn: { paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTabBtn: { borderBottomColor: '#38bdf8' },
  tabBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold' },
  activeTabBtnText: { color: '#38bdf8' },
  contentScroll: { padding: 24 },
  sectionHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 14, marginTop: 10 },
  
  profileSection: { gap: 20 },
  avatarCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#1e293b', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  avatarPlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#0284c7', justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  avatarInfo: { flex: 1 },
  profileName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  badgeText: { color: '#fbbf24', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  xpCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpLabel: { color: '#cbd5e1', fontSize: 15, fontWeight: 'bold' },
  xpValue: { color: '#38bdf8', fontSize: 15, fontWeight: 'bold' },
  xpTrack: { height: 12, backgroundColor: '#0f172a', borderRadius: 6, overflow: 'hidden' },
  xpFill: { width: '68%', height: '100%', backgroundColor: '#38bdf8', borderRadius: 6 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: '#1e293b', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statNum: { color: '#facc15', fontSize: 24, fontWeight: '900' },
  statTitle: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  quickMatchBtn: { backgroundColor: '#22c55e', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#22c55e', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
  quickMatchBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  rankedSection: { gap: 20 },
  leagueCard: { backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#38bdf8' },
  leagueTitle: { color: '#38bdf8', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  leagueDesc: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  leaderboardBox: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  thRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  thColRank: { width: 60, color: '#94a3b8', fontWeight: 'bold' },
  thColName: { flex: 1, color: '#94a3b8', fontWeight: 'bold' },
  thColElo: { width: 80, color: '#94a3b8', fontWeight: 'bold', textAlign: 'right' },
  thColWin: { width: 80, color: '#94a3b8', fontWeight: 'bold', textAlign: 'right' },
  lRow: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  myRow: { backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: 10, paddingHorizontal: 8 },
  colRank: { width: 60, color: '#fff', fontWeight: 'bold' },
  colName: { flex: 1, color: '#fff', fontWeight: 'bold' },
  myColText: { color: '#fbbf24' },
  colElo: { width: 80, color: '#38bdf8', fontWeight: 'bold', textAlign: 'right' },
  colWin: { width: 80, color: '#22c55e', fontWeight: 'bold', textAlign: 'right' },

  achievementsSection: { gap: 16 },
  dailyRewardCard: { backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f59e0b' },
  dailyRewardTitle: { color: '#fbbf24', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  dailyRewardDesc: { color: '#cbd5e1', fontSize: 14, marginBottom: 16 },
  claimBtn: { backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  claimedBtn: { backgroundColor: '#10b981' },
  claimBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  achieveCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#334155', gap: 16 },
  achieveIcon: { fontSize: 32 },
  achieveInfo: { flex: 1 },
  achieveTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  achieveDesc: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  achieveBadge: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  achieveProgress: { color: '#38bdf8', fontWeight: 'bold', fontSize: 13 },

  friendsSection: { gap: 16 },
  inviteBox: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  inviteBoxTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  inviteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inviteInput: { flex: 1, minWidth: 200, backgroundColor: '#0f172a', color: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155', fontSize: 16 },
  inviteBtn: { backgroundColor: '#0284c7', paddingHorizontal: 24, paddingVertical: 14, flexGrow: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  inviteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  friendCard: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  friendInfo: { gap: 4 },
  friendName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  friendStatus: { color: '#94a3b8', fontSize: 13 },
  inviteGameBtn: { backgroundColor: 'rgba(34, 197, 94, 0.2)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#22c55e' },
  inviteGameBtnText: { color: '#22c55e', fontWeight: 'bold' },

  themesSection: { gap: 16 },
  themeSub: { color: '#cbd5e1', fontSize: 16, marginBottom: 8 },
  themeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#334155', gap: 16 },
  selectedThemeCard: { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  themeColorSample: { width: 50, height: 50, borderRadius: 12, borderWidth: 2, borderColor: '#fff' },
  themeInfo: { flex: 1 },
  themeName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  themeDesc: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  activeCheck: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
});
