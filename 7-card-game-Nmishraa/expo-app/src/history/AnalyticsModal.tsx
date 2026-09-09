import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { fetchAllUserEvents, AnalyticsSummary } from './analyticsService';
import { getGAMeasurementId, setGAMeasurementId, sendTestGAEvent, isGAInitialized } from '../services/googleAnalytics';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'metrics' | 'cohorts' | 'feed' | 'ga4'>('metrics');
  const [gaIdInput, setGaIdInput] = useState(getGAMeasurementId());
  const [gaStatusMessage, setGaStatusMessage] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setGaIdInput(getGAMeasurementId());
      fetchAllUserEvents().then(data => {
        setSummary(data);
        setLoading(false);
      });
    }
  }, [visible]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleUpdateGaId = () => {
    const trimmed = gaIdInput.trim().toUpperCase();
    if (!trimmed.startsWith('G-')) {
      Alert.alert('Invalid GA ID', 'Google Analytics 4 Measurement ID must start with "G-" (e.g. G-7CARDGAME26)');
      return;
    }
    setGAMeasurementId(trimmed);
    setGaStatusMessage(`Updated Measurement ID to ${trimmed}`);
    setTimeout(() => setGaStatusMessage(''), 4000);
  };

  const handleSendTestPing = () => {
    const res = sendTestGAEvent();
    if (res.success) {
      setGaStatusMessage(`✅ Sent test event "${res.eventName}" to GA4 (${getGAMeasurementId()})`);
      setTimeout(() => setGaStatusMessage(''), 5000);
    }
  };

  const totalEvents = summary ? Object.values(summary.eventCounts).reduce((acc, val) => acc + val, 0) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>📊 Analytics & GA4 Dashboard</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={() => { setLoading(true); fetchAllUserEvents().then(data => { setSummary(data); setLoading(false); }); }}>
              <Text style={styles.refreshText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'metrics' && styles.activeTab]} onPress={() => setTab('metrics')}>
              <Text style={[styles.tabText, tab === 'metrics' && styles.activeTabText]}>📈 KPIs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'cohorts' && styles.activeTab]} onPress={() => setTab('cohorts')}>
              <Text style={[styles.tabText, tab === 'cohorts' && styles.activeTabText]}>🗓️ Retention</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'feed' && styles.activeTab]} onPress={() => setTab('feed')}>
              <Text style={[styles.tabText, tab === 'feed' && styles.activeTabText]}>⚡ Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'ga4' && styles.activeTab]} onPress={() => setTab('ga4')}>
              <Text style={[styles.tabText, tab === 'ga4' && styles.activeTabText]}>🔥 GA4</Text>
            </TouchableOpacity>
          </View>

          {loading || !summary ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Analyzing user events & retention data...</Text>
            </View>
          ) : tab === 'metrics' ? (
            /* KPI Metric Cards & Event Grid */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.kpiContainer}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Total Unique Users</Text>
                  <Text style={styles.kpiVal}>{summary.totalUniqueUsers}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Daily Active Users (24h)</Text>
                  <Text style={[styles.kpiVal, { color: '#38bdf8' }]}>{summary.dailyActiveUsers}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Total Recorded Events</Text>
                  <Text style={[styles.kpiVal, { color: '#facc15' }]}>{totalEvents}</Text>
                </View>
              </View>

              <Text style={styles.sectionHeader}>Event Category Breakdown</Text>
              <View style={styles.eventGrid}>
                {Object.entries(summary.eventCounts).map(([evType, count]) => (
                  <View key={evType} style={styles.eventItem}>
                    <Text style={styles.eventItemTitle}>{evType.toUpperCase().replace('_', ' ')}</Text>
                    <Text style={styles.eventItemCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : tab === 'cohorts' ? (
            /* Cohort Retention Table */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.cohortHelp}>
                Retention rates show the percentage of users returning to play or engage after their initial sign-up cohort date.
              </Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.thCell, { flex: 2 }]}>Cohort Date</Text>
                <Text style={styles.thCell}>Users</Text>
                <Text style={styles.thCell}>Day 1</Text>
                <Text style={styles.thCell}>Day 3</Text>
                <Text style={styles.thCell}>Day 7</Text>
              </View>
              {summary.cohorts.length === 0 ? (
                <Text style={styles.emptyText}>No cohort data available yet.</Text>
              ) : (
                summary.cohorts.map((c, i) => (
                  <View key={c.cohortDate || i} style={styles.tableRow}>
                    <Text style={[styles.tdCell, { flex: 2, fontWeight: 'bold', color: '#fff' }]}>{c.cohortDate}</Text>
                    <Text style={styles.tdCell}>{c.totalUsers}</Text>
                    <Text style={[styles.tdCell, { color: c.d1Rate > 50 ? '#22c55e' : '#facc15' }]}>{c.d1Rate}%</Text>
                    <Text style={[styles.tdCell, { color: c.d3Rate > 30 ? '#22c55e' : '#facc15' }]}>{c.d3Rate}%</Text>
                    <Text style={[styles.tdCell, { color: c.d7Rate > 20 ? '#22c55e' : '#facc15' }]}>{c.d7Rate}%</Text>
                  </View>
                ))
              )}
            </ScrollView>
          ) : tab === 'feed' ? (
            /* Live Activity Feed */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              {summary.recentEvents.length === 0 ? (
                <Text style={styles.emptyText}>No activity events recorded yet.</Text>
              ) : (
                summary.recentEvents.map(ev => (
                  <View key={ev.id} style={styles.feedItem}>
                    <View style={styles.feedTop}>
                      <Text style={styles.feedUser}>{ev.userName} ({ev.userId.slice(0, 6)})</Text>
                      <Text style={styles.feedTime}>{formatDate(ev.timestamp)}</Text>
                    </View>
                    <View style={styles.feedBottom}>
                      <Text style={styles.feedAction}>{ev.eventType.toUpperCase().replace('_', ' ')}</Text>
                      {ev.metadata?.roomId && <Text style={styles.feedMeta}>Room: {ev.metadata.roomId}</Text>}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          ) : (
            /* Google Analytics 4 Dashboard */
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.gaCard}>
                <View style={styles.gaHeaderRow}>
                  <Text style={styles.gaTitle}>🔥 Google Analytics 4 (GA4)</Text>
                  <View style={[styles.badge, isGAInitialized() ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={styles.badgeText}>{isGAInitialized() ? '● ACTIVE' : '○ INACTIVE'}</Text>
                  </View>
                </View>

                <Text style={styles.gaDescription}>
                  GA4 tracks user engagement, pageviews, room creations, card actions, and game completions in real-time.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Measurement ID (GA4 Property)</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.gaInput}
                      value={gaIdInput}
                      onChangeText={setGaIdInput}
                      placeholder="G-XXXXXXXXXX"
                      placeholderTextColor="#64748b"
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateGaId}>
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {gaStatusMessage !== '' && (
                  <Text style={styles.statusBanner}>{gaStatusMessage}</Text>
                )}

                <TouchableOpacity style={styles.testBtn} onPress={handleSendTestPing}>
                  <Text style={styles.testBtnText}>🚀 Dispatch Test GA4 Event</Text>
                </TouchableOpacity>

                <View style={styles.gaEventsList}>
                  <Text style={styles.subHeader}>Tracked GA4 Event Signals:</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>page_view</Text> - Screen transitions (Auth, Home, Lobby, Game)</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>create_room</Text> - Multiplayer / Solo game room creation</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>join_room</Text> - Player room joining</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>start_game</Text> - Round startup and bot matches</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>play_turn</Text> - Card discards and deck draws</Text>
                  <Text style={styles.bulletItem}>• <Text style={styles.boldText}>call_least</Text> - Round conclusion and least calling</Text>
                </View>
              </View>
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 750,
    height: '90%',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  refreshBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
  },
  refreshText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#cbd5e1', marginTop: 12, fontSize: 16, fontWeight: '600' },
  emptyText: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginTop: 40, fontStyle: 'italic' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: { backgroundColor: '#0275d8' },
  tabText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 15 },
  activeTabText: { color: '#fff' },

  contentScroll: { flex: 1 },

  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  kpiLabel: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  kpiVal: { color: '#22c55e', fontSize: 32, fontWeight: '900' },

  sectionHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  eventGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  eventItem: {
    width: '48%',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  eventItemTitle: { color: '#cbd5e1', fontSize: 14, fontWeight: 'bold' },
  eventItemCount: { color: '#38bdf8', fontSize: 18, fontWeight: '900' },

  cohortHelp: { color: '#94a3b8', fontSize: 14, marginBottom: 16, fontStyle: 'italic', lineHeight: 20 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  thCell: { color: '#cbd5e1', flex: 1, fontWeight: 'bold', fontSize: 14 },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  tdCell: { color: '#94a3b8', flex: 1, fontSize: 15, fontWeight: '600' },

  feedItem: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
  },
  feedTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  feedUser: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  feedTime: { color: '#94a3b8', fontSize: 13 },
  feedBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feedAction: { color: '#38bdf8', fontWeight: '900', fontSize: 14 },
  feedMeta: { color: '#facc15', fontSize: 13, fontWeight: 'bold' },

  closeBtn: {
    marginTop: 20,
    backgroundColor: '#0275d8',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },

  // ── GA4 Styles ─────────────────────────────────────────────────────────────
  gaCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gaTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#15803d' },
  badgeInactive: { backgroundColor: '#854d0e' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  gaDescription: { color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: '#cbd5e1', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  inputRow: { flexDirection: 'row', gap: 10 },
  gaInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#475569',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#0275d8',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  statusBanner: {
    backgroundColor: '#065f46',
    color: '#34d399',
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  testBtn: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  testBtnText: { color: '#000', fontWeight: '900', fontSize: 15 },
  gaEventsList: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subHeader: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  bulletItem: { color: '#cbd5e1', fontSize: 13, lineHeight: 22 },
  boldText: { color: '#38bdf8', fontWeight: 'bold' },
});
