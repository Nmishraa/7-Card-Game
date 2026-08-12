import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView,
  ActivityIndicator, Platform
} from 'react-native';
import { GameHistoryEntry } from './types';
import { fetchAllGameHistories } from './historyService';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<Props> = ({ visible, onClose }) => {
  const [histories, setHistories] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<GameHistoryEntry | null>(null);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setSelectedEntry(null);
      fetchAllGameHistories().then((data) => {
        setHistories(data);
        setLoading(false);
      });
    }
  }, [visible]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>📖 Match History</Text>
          
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Loading game logs...</Text>
            </View>
          ) : selectedEntry ? (
            /* ─── DETAIL VIEW ─── */
            <View style={styles.detailContainer}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedEntry(null)}>
                <Text style={styles.backBtnText}>← Back to Match List</Text>
              </TouchableOpacity>
              
              <Text style={styles.detailTitle}>Room Code: {selectedEntry.roomId}</Text>
              <Text style={styles.detailMeta}>Played on {formatDate(selectedEntry.date)}</Text>
              <Text style={styles.winnerBadge}>🏆 Winner: {selectedEntry.winnerName}</Text>
              
              <Text style={styles.tableHeader}>Player Score Breakdown</Text>
              <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
                {selectedEntry.players.map((p, idx) => (
                  <View key={p.id || idx} style={[styles.playerRow, idx === 0 && styles.winnerRow]}>
                    <View style={styles.playerRowTop}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.rankNum}>#{idx + 1}</Text>
                        <Text style={styles.playerName}>{p.name}</Text>
                      </View>
                      <Text style={styles.playerScore}>{p.totalScore} pts</Text>
                    </View>
                    {p.roundScores && p.roundScores.length > 0 && (
                      <View style={styles.historyRoundPills}>
                        {p.roundScores.map((sc, sidx) => (
                          <View key={sidx} style={styles.historyRoundPill}>
                            <Text style={styles.historyRoundPillText}>R{sidx + 1}: {sc}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : histories.length === 0 ? (
            /* ─── EMPTY STATE ─── */
            <View style={styles.center}>
              <Text style={styles.emptyText}>No completed games found.</Text>
              <Text style={styles.emptySubtext}>Play a game to the finish (5 rounds or elimination) to record history!</Text>
            </View>
          ) : (
            /* ─── LIST VIEW ─── */
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
              {histories.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.historyCard}
                  onPress={() => setSelectedEntry(entry)}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.roomCode}>Room {entry.roomId}</Text>
                    <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                  </View>
                  <View style={styles.cardBottom}>
                    <Text style={styles.winnerName}>🏆 Winner: {entry.winnerName}</Text>
                    <Text style={styles.playerCount}>{entry.players.length} Players</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
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
    maxWidth: 600,
    height: '85%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#cbd5e1', marginTop: 12, fontSize: 16 },
  emptyText: { color: '#f87171', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubtext: { color: '#94a3b8', fontSize: 14, textAlign: 'center', maxWidth: 300 },

  /* List View */
  listContainer: { flex: 1 },
  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomCode: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold' },
  dateText: { color: '#94a3b8', fontSize: 13 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerName: { color: '#fbcfe8', fontSize: 15, fontWeight: '600' },
  playerCount: { color: '#cbd5e1', fontSize: 14 },

  /* Detail View */
  detailContainer: { flex: 1 },
  backBtn: { marginBottom: 16 },
  backBtnText: { color: '#38bdf8', fontSize: 16, fontWeight: '600' },
  detailTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  detailMeta: { color: '#94a3b8', fontSize: 14, marginBottom: 12 },
  winnerBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  tableHeader: { color: '#cbd5e1', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  playerList: { flex: 1 },
  playerRow: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  playerRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerRow: { borderColor: '#f59e0b', borderWidth: 1 },
  rankNum: { color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginRight: 12, width: 30 },
  playerName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  playerScore: { color: '#f87171', fontSize: 16, fontWeight: 'bold' },
  historyRoundPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  historyRoundPill: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  historyRoundPillText: { color: '#cbd5e1', fontSize: 13, fontWeight: 'bold' },

  closeBtn: {
    marginTop: 20,
    backgroundColor: '#0275d8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
