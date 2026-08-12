import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { fetchAllUserEvents, AnalyticsSummary } from './analyticsService';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'metrics' | 'cohorts' | 'feed'>('metrics');

  useEffect(() => {
    if (visible) {
      setLoading(true);
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

  const totalEvents = summary ? Object.values(summary.eventCounts).reduce((acc, val) => acc + val, 0) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>📊 Analytics & Retention Dashboard</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={() => { setLoading(true); fetchAllUserEvents().then(data => { setSummary(data); setLoading(false); }); }}>
              <Text style={styles.refreshText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'metrics' && styles.activeTab]} onPress={() => setTab('metrics')}>
              <Text style={[styles.tabText, tab === 'metrics' && styles.activeTabText]}>📈 Overview & KPIs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'cohorts' && styles.activeTab]} onPress={() => setTab('cohorts')}>
              <Text style={[styles.tabText, tab === 'cohorts' && styles.activeTabText]}>🗓️ Cohort Retention</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'feed' && styles.activeTab]} onPress={() => setTab('feed')}>
              <Text style={[styles.tabText, tab === 'feed' && styles.activeTabText]}>⚡ Activity Log</Text>
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
          ) : (
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
});
