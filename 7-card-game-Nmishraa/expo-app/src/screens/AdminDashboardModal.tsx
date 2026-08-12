import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Alert, useWindowDimensions, Platform
} from 'react-native';
import {
  UserProfile, LikeEntry, AdminStatsSummary,
  subscribeToAdminUpdates, toggleBanUser, deleteUserRecord, removeLikeEntry
} from '../history/adminService';
import { AnalyticsEvent } from '../history/analyticsService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboardModal: React.FC<Props> = ({ visible, onClose, onLogoutAdmin }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = createStyles(width);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [likes, setLikes] = useState<LikeEntry[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<AdminStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Tabs: 'kpis' | 'users' | 'likes' | 'logs'
  const [activeTab, setActiveTab] = useState<'kpis' | 'users' | 'likes' | 'logs'>('kpis');

  // Search & Filter for Users
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'vip' | 'banned'>('all');

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    const unsubscribe = subscribeToAdminUpdates((uList, lList, summary, evList) => {
      setUsers(uList);
      setLikes(lList);
      setStats(summary);
      if (evList) setEvents(evList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [visible]);

  const formatDate = (ts: number) => {
    if (!ts) return 'N/A';
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleToggleBan = (u: UserProfile) => {
    Alert.alert(
      u.isBanned ? 'Unban User' : 'Ban User',
      `Are you sure you want to ${u.isBanned ? 'unban' : 'ban'} ${u.displayName} (${u.email})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: u.isBanned ? 'Unban' : 'Ban',
          style: u.isBanned ? 'default' : 'destructive',
          onPress: () => toggleBanUser(u.uid, u.isBanned),
        },
      ]
    );
  };

  const handleDeleteUser = (u: UserProfile) => {
    Alert.alert(
      'Delete User Record',
      `⚠️ PERMANENT ACTION: Are you absolutely sure you want to delete all data for ${u.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => deleteUserRecord(u.uid),
        },
      ]
    );
  };

  const handleRevokeLike = (l: LikeEntry) => {
    Alert.alert(
      'Revoke Like',
      `Remove like from ${l.fromUserName} to ${l.toUserName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => removeLikeEntry(l.id, l.toUserId),
        },
      ]
    );
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchQ =
      u.displayName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q);

    if (!matchQ) return false;
    if (userFilter === 'banned') return u.isBanned;
    if (userFilter === 'vip') return !!u.isVip;
    if (userFilter === 'active') return Date.now() - u.lastLoginAt < 24 * 3600 * 1000;
    return true;
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header - Stacked neatly for mobile */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <Text style={styles.title} numberOfLines={1}>👑 Game Master Panel</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerSubRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>REALTIME SYNC</Text>
              </View>
              <TouchableOpacity onPress={onLogoutAdmin} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>🔒 Lock Session</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nav Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'kpis' && styles.activeTab]}
              onPress={() => setActiveTab('kpis')}
            >
              <Text style={[styles.tabText, activeTab === 'kpis' && styles.activeTabText]}>
                {isMobile ? '📈 KPI' : '📈 KPI Analytics'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'users' && styles.activeTab]}
              onPress={() => setActiveTab('users')}
            >
              <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
                {isMobile ? `👥 Users (${users.length})` : `👥 User Management (${users.length})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'likes' && styles.activeTab]}
              onPress={() => setActiveTab('likes')}
            >
              <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
                {isMobile ? `❤️ Likes (${likes.length})` : `❤️ Likes Log (${likes.length})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'logs' && styles.activeTab]}
              onPress={() => setActiveTab('logs')}
            >
              <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>
                {isMobile ? `⚡ Logs (${events.length})` : `⚡ System Logs (${events.length})`}
              </Text>
            </TouchableOpacity>
          </View>

          {loading || !stats ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Fetching real-time Firebase game statistics...</Text>
            </View>
          ) : activeTab === 'kpis' ? (
            /* ── TAB 1: KPI Analytics & Charts ── */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              {/* Metric Cards Row */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>🎮 Games Played Today</Text>
                  <Text style={[styles.kpiVal, { color: '#38bdf8' }]}>{stats.dailyGamesPlayed}</Text>
                  <Text style={styles.kpiSub}>Started or completed (24h)</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>👥 Daily Active Users</Text>
                  <Text style={[styles.kpiVal, { color: '#22c55e' }]}>{stats.dailyActiveUsers}</Text>
                  <Text style={styles.kpiSub}>Active in last 24h</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>⚠️ Failed Login Attempts</Text>
                  <Text style={[styles.kpiVal, { color: '#ef4444' }]}>{stats.failedLoginAttempts}</Text>
                  <Text style={styles.kpiSub}>Auth errors & blocks</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>🎭 Guest Users Count</Text>
                  <Text style={[styles.kpiVal, { color: '#facc15' }]}>{stats.guestUsersCount}</Text>
                  <Text style={styles.kpiSub}>Playing without Google login</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>Total Registered Users</Text>
                  <Text style={[styles.kpiVal, { color: '#ec4899' }]}>{stats.totalUsers}</Text>
                  <Text style={styles.kpiSub}>+{stats.dailyNewUsers} new today</Text>
                </View>
              </View>

              {/* Graphical Charts Section */}
              <View style={styles.chartsContainer}>
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>📊 User Registrations (7D Trend)</Text>
                  <View style={styles.barGraph}>
                    {stats.growthSeries.map((item, idx) => {
                      const maxVal = Math.max(...stats.growthSeries.map((s) => s.count), 1);
                      const barHeightPct = Math.max(15, Math.round((item.count / maxVal) * 100));
                      return (
                        <View key={idx} style={styles.barColumn}>
                          <Text style={styles.barCountText}>{item.count}</Text>
                          <View style={[styles.barFill, { height: `${barHeightPct}%`, backgroundColor: '#38bdf8' }]} />
                          <Text style={styles.barLabelText}>{item.label}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>❤️ Like Activity Volume (7D Trend)</Text>
                  <View style={styles.barGraph}>
                    {stats.likesSeries.map((item, idx) => {
                      const maxVal = Math.max(...stats.likesSeries.map((s) => s.count), 1);
                      const barHeightPct = Math.max(15, Math.round((item.count / maxVal) * 100));
                      return (
                        <View key={idx} style={styles.barColumn}>
                          <Text style={styles.barCountText}>{item.count}</Text>
                          <View style={[styles.barFill, { height: `${barHeightPct}%`, backgroundColor: '#ec4899' }]} />
                          <Text style={styles.barLabelText}>{item.label}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Leaderboard: Most Liked Players */}
              <Text style={styles.sectionHeading}>🌟 Top Influential & Most Liked Players</Text>
              <View style={styles.tableCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: '100%' }}>
                  <View style={{ minWidth: isMobile ? 600 : '100%' }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 2 }]}>Display Name</Text>
                      <Text style={styles.th}>Email</Text>
                      <Text style={styles.th}>Total Likes</Text>
                      <Text style={styles.th}>Status</Text>
                    </View>
                    {stats.mostLikedPlayers.length === 0 ? (
                      <Text style={styles.emptyText}>No likes recorded yet.</Text>
                    ) : (
                      stats.mostLikedPlayers.map((p, i) => (
                        <View key={p.uid} style={styles.tableRow}>
                          <Text style={[styles.td, { flex: 2, fontWeight: 'bold', color: '#fff' }]}>
                            {i + 1}. {p.displayName} {p.isVip ? '👑 VIP' : ''}
                          </Text>
                          <Text style={styles.td}>{p.email}</Text>
                          <Text style={[styles.td, { color: '#ec4899', fontWeight: 'bold', fontSize: 16 }]}>
                            ❤️ {p.likesCount || 0}
                          </Text>
                          <Text style={[styles.td, { color: p.isBanned ? '#ef4444' : '#22c55e' }]}>
                            {p.isBanned ? 'Banned' : 'Active'}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          ) : activeTab === 'users' ? (
            /* ── TAB 2: User Management & Filter Table ── */
            <View style={{ flex: 1 }}>
              {/* Filter Bar */}
              <View style={styles.filterBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="🔍 Search users by name or email..."
                  placeholderTextColor="#64748b"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <View style={styles.pillGroup}>
                  {(['all', 'active', 'vip', 'banned'] as const).map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[styles.pillBtn, userFilter === filter && styles.pillActive]}
                      onPress={() => setUserFilter(filter)}
                    >
                      <Text style={[styles.pillText, userFilter === filter && styles.pillTextActive]}>
                        {filter.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Users Table */}
              <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.tableCard}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: '100%' }}>
                    <View style={{ minWidth: isMobile ? 750 : '100%' }}>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 2.5 }]}>User Profile</Text>
                        <Text style={[styles.th, { flex: 1.5 }]}>Join Date</Text>
                        <Text style={[styles.th, { flex: 1.5 }]}>Last Login</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Likes</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Status</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Actions</Text>
                      </View>

                      {filteredUsers.length === 0 ? (
                        <Text style={styles.emptyText}>No users match the search criteria.</Text>
                      ) : (
                        filteredUsers.map((u) => (
                          <View key={u.uid} style={styles.tableRow}>
                            {/* Profile Info */}
                            <View style={[styles.tdCol, { flex: 2.5 }]}>
                              <Text style={styles.userNameText}>
                                {u.displayName} {u.isVip ? '👑' : ''}
                              </Text>
                              <Text style={styles.userEmailText}>{u.email}</Text>
                              <Text style={styles.userIdText}>ID: {u.uid.slice(0, 8)}...</Text>
                            </View>

                            {/* Join Date */}
                            <Text style={[styles.td, { flex: 1.5, fontSize: 13 }]}>{formatDate(u.joinDate)}</Text>

                            {/* Last Login */}
                            <Text style={[styles.td, { flex: 1.5, fontSize: 13 }]}>{formatDate(u.lastLoginAt)}</Text>

                            {/* Likes */}
                            <Text style={[styles.td, { flex: 1, color: '#ec4899', fontWeight: 'bold' }]}>❤️ {u.likesCount || 0}</Text>

                            {/* Status Badge */}
                            <View style={[styles.tdCol, { flex: 1 }]}>
                              <View style={[styles.statusBadge, u.isBanned ? styles.badgeBanned : styles.badgeActive]}>
                                <Text style={[styles.statusBadgeText, u.isBanned ? { color: '#f87171' } : { color: '#4ade80' }]}>
                                  {u.isBanned ? 'BANNED' : 'ACTIVE'}
                                </Text>
                              </View>
                            </View>

                            {/* Actions */}
                            <View style={[styles.actionsCol, { flex: 1.5, justifyContent: 'flex-end' }]}>
                              <TouchableOpacity
                                style={[styles.actionBtn, u.isBanned ? styles.btnUnban : styles.btnBan]}
                                onPress={() => handleToggleBan(u)}
                              >
                                <Text style={styles.actionBtnText}>{u.isBanned ? 'Unban' : 'Ban'}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionBtn, styles.btnDelete]}
                                onPress={() => handleDeleteUser(u)}
                              >
                                <Text style={styles.actionBtnText}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))
                      )}
                    </View>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          ) : activeTab === 'likes' ? (
            /* ── TAB 3: Likes History & Activity Log ── */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionHeading}>❤️ System-Wide Peer Likes History</Text>
              <View style={styles.tableCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: '100%' }}>
                  <View style={{ minWidth: isMobile ? 650 : '100%' }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 2 }]}>From Player</Text>
                      <Text style={[styles.th, { flex: 2 }]}>To Recipient</Text>
                      <Text style={[styles.th, { flex: 1.5 }]}>Timestamp</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Manage</Text>
                    </View>

                    {likes.length === 0 ? (
                      <Text style={styles.emptyText}>No peer likes recorded yet.</Text>
                    ) : (
                      likes.map((l) => (
                        <View key={l.id} style={styles.tableRow}>
                          <Text style={[styles.td, { flex: 2, fontWeight: 'bold', color: '#38bdf8' }]}>
                            👤 {l.fromUserName}
                          </Text>
                          <Text style={[styles.td, { flex: 2, fontWeight: 'bold', color: '#ec4899' }]}>
                            ❤️ {l.toUserName}
                          </Text>
                          <Text style={[styles.td, { flex: 1.5, fontSize: 13 }]}>{formatDate(l.timestamp)}</Text>
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.revokeBtn} onPress={() => handleRevokeLike(l)}>
                              <Text style={styles.revokeBtnText}>Revoke Like</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          ) : activeTab === 'logs' ? (
            /* ── TAB 4: Activity & System Error Log ── */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionHeading}>⚡ Real-Time System & Authentication Logs</Text>
              <View style={styles.tableCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: '100%' }}>
                  <View style={{ minWidth: isMobile ? 650 : '100%' }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 1.5 }]}>Timestamp</Text>
                      <Text style={[styles.th, { flex: 2 }]}>Event Type</Text>
                      <Text style={[styles.th, { flex: 2 }]}>User / ID</Text>
                      <Text style={[styles.th, { flex: 2.5 }]}>Metadata & Errors</Text>
                    </View>

                    {events.length === 0 ? (
                      <Text style={styles.emptyText}>No system events logged yet.</Text>
                    ) : (
                      events.map((ev) => (
                        <View key={ev.id} style={styles.tableRow}>
                          <Text style={[styles.td, { flex: 1.5, fontSize: 13 }]}>{formatDate(ev.timestamp)}</Text>
                          <Text style={[styles.td, { flex: 2, fontWeight: 'bold', color: ev.eventType === 'system_error' || ev.eventType === 'auth_failure' ? '#ef4444' : '#38bdf8' }]}>
                            {ev.eventType === 'system_error' ? '❌ SYSTEM ERROR' : ev.eventType === 'auth_failure' ? '⚠️ AUTH FAILURE' : ev.eventType.toUpperCase().replace('_', ' ')}
                          </Text>
                          <Text style={[styles.td, { flex: 2 }]}>
                            {ev.userName} ({ev.userId.slice(0, 8)})
                          </Text>
                          <Text style={[styles.td, { flex: 2.5, color: '#cbd5e1', fontSize: 13 }]}>
                            {ev.metadata ? JSON.stringify(ev.metadata) : 'None'}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (width: number) => {
  const isMobile = width < 768;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: isMobile ? 10 : 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '100%',
      maxWidth: 1200,
      height: isMobile ? '96%' : '92%',
      backgroundColor: '#0f172a',
      borderRadius: isMobile ? 18 : 24,
      padding: isMobile ? 16 : 24,
      borderWidth: 1,
      borderColor: '#334155',
      shadowColor: '#0284c7',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 25,
      elevation: 15,
    },
    header: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#334155',
      paddingBottom: 14,
      gap: 12,
    },
    headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerSubRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#fff',
      fontSize: isMobile ? 20 : 24,
      fontWeight: '900',
      letterSpacing: 0.5,
      flex: 1,
    },
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#22c55e',
      gap: 6,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#22c55e',
    },
    liveText: {
      color: '#22c55e',
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
    },
    logoutBtn: {
      backgroundColor: '#1e293b',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#475569',
    },
    logoutBtnText: {
      color: '#f87171',
      fontWeight: 'bold',
      fontSize: 13,
    },
    closeBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    closeBtnText: {
      color: '#94a3b8',
      fontSize: 24,
      fontWeight: 'bold',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#1e293b',
      borderRadius: 14,
      padding: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#334155',
    },
    tabBtn: {
      flex: 1,
      paddingVertical: isMobile ? 10 : 14,
      paddingHorizontal: 4,
      alignItems: 'center',
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: '#0284c7',
    },
    tabText: {
      color: '#94a3b8',
      fontWeight: 'bold',
      fontSize: isMobile ? 13 : 15,
      textAlign: 'center',
    },
    activeTabText: {
      color: '#fff',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#cbd5e1',
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600',
    },
    contentScroll: {
      flex: 1,
    },
    kpiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    kpiBox: {
      flex: 1,
      minWidth: isMobile ? 140 : 190,
      backgroundColor: '#1e293b',
      padding: isMobile ? 15 : 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#334155',
      alignItems: 'flex-start',
    },
    kpiLabel: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 },
    kpiVal: { fontSize: isMobile ? 26 : 32, fontWeight: '900', marginBottom: 4 },
    kpiSub: { color: '#64748b', fontSize: 11, fontWeight: '600' },

    chartsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 24,
    },
    chartCard: {
      flex: 1,
      minWidth: isMobile ? 260 : 320,
      backgroundColor: '#1e293b',
      padding: isMobile ? 16 : 20,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#334155',
    },
    chartTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
    barGraph: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: 160,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#334155',
    },
    barColumn: {
      alignItems: 'center',
      width: isMobile ? 28 : 35,
      height: '100%',
      justifyContent: 'flex-end',
    },
    barCountText: { color: '#cbd5e1', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
    barFill: { width: isMobile ? 16 : 22, borderRadius: 6 },
    barLabelText: { color: '#94a3b8', fontSize: 10, marginTop: 6 },

    sectionHeading: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 14, marginTop: 10 },

    filterBar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      minWidth: isMobile ? '100%' : 260,
      backgroundColor: '#1e293b',
      color: '#fff',
      borderWidth: 1,
      borderColor: '#475569',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
    },
    pillGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: '#1e293b',
      padding: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#334155',
      gap: 6,
    },
    pillBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    pillActive: { backgroundColor: '#0284c7' },
    pillText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
    pillTextActive: { color: '#fff' },

    tableCard: {
      backgroundColor: '#1e293b',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#334155',
      overflow: 'hidden',
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#334155',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#475569',
    },
    th: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
    },
    td: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
    tdCol: { justifyContent: 'center' },
    userNameText: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
    userEmailText: { color: '#94a3b8', fontSize: 12, marginBottom: 2 },
    userIdText: { color: '#64748b', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
      borderWidth: 1,
    },
    badgeActive: { backgroundColor: 'rgba(74, 222, 128, 0.15)', borderColor: '#4ade80' },
    badgeBanned: { backgroundColor: 'rgba(248, 113, 113, 0.15)', borderColor: '#f87171' },
    statusBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

    actionsCol: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    btnBan: { backgroundColor: '#ef4444' },
    btnUnban: { backgroundColor: '#10b981' },
    btnDelete: { backgroundColor: '#475569' },
    actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    revokeBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    revokeBtnText: { color: '#f87171', fontWeight: 'bold', fontSize: 12 },

    emptyText: { color: '#64748b', fontSize: 15, textAlign: 'center', paddingVertical: 40, fontStyle: 'italic' },
  });
};
