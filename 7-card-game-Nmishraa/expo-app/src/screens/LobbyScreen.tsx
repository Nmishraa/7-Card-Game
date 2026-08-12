import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView, Image, SafeAreaView, Modal, TextInput } from 'react-native';
import { GameRoom } from '../engine/types';

interface Props {
  room: GameRoom;
  userId: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onAddBot: () => void;
  onEditName?: (newName: string) => void;
  onChangeRounds?: (newRounds: number) => void;
}

export const LobbyScreen: React.FC<Props> = ({ room, userId, onLeaveRoom, onStartGame, onAddBot, onEditName, onChangeRounds }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const isHost = room.hostId === userId;
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState(room.players[userId]?.name || '');
  
  const players = Object.values(room.players || {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── TOP HEADER ── */}
        <View style={styles.header}>
          <View />
          <View style={styles.headerRightRow}>
            <TouchableOpacity style={styles.headerEditBtn} onPress={() => { setNewName(room.players[userId]?.name || ''); setShowEdit(true); }}>
              <Text style={styles.headerEditBtnText}>Edit Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerLeaveBtn} onPress={onLeaveRoom}>
              <Text style={styles.leaveBtnText}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.brandContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoLarge} 
              resizeMode="contain" 
            />
            <Text style={styles.welcomeTagline}>The Ultimate 7-cards Experience</Text>
          </View>

          <View style={styles.contentBox}>
            <Text style={styles.title}>Multiplayer Lobby</Text>
            
            <Text style={styles.roomCodeText}>Room Code: {room.id}</Text>
            <Text style={styles.playerCountText}>Players: {players.length} / 8</Text>

            <View style={styles.playerListContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {players.map((p, index) => (
                  <View key={p.id} style={styles.playerItem}>
                    <Text style={styles.playerText}>
                      {index + 1}. {p.name} {p.id === room.hostId ? '(Host)' : ''} {p.isBot ? '(Bot)' : ''}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Rounds Selector in Lobby */}
            <View style={styles.lobbyRoundsBox}>
              <Text style={styles.lobbyRoundsTitle}>🏆 Target Rounds: {room.maxRounds || 5}</Text>
              {isHost && (
                <View style={styles.lobbyRoundsControls}>
                  <TouchableOpacity
                    style={styles.lobbyRoundBtn}
                    onPress={() => onChangeRounds && onChangeRounds(Math.max(1, (room.maxRounds || 5) - 1))}
                  >
                    <Text style={styles.lobbyRoundBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.lobbyHostTag}>Host Setting</Text>
                  <TouchableOpacity
                    style={styles.lobbyRoundBtn}
                    onPress={() => onChangeRounds && onChangeRounds(Math.min(20, (room.maxRounds || 5) + 1))}
                  >
                    <Text style={styles.lobbyRoundBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.actionSection}>
              {isHost ? (
                <>
                  <TouchableOpacity 
                    style={[styles.button, styles.addBotButton, players.length >= 8 && styles.disabledButton]} 
                    onPress={onAddBot}
                    disabled={players.length >= 8}
                  >
                    <Text style={styles.buttonText}>{players.length >= 8 ? 'Room Full' : 'Add Computer Player'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.button, styles.startButton]} 
                    onPress={onStartGame}
                  >
                    <Text style={styles.buttonText}>Start Game</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.waitingBox}>
                  <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Edit Name Modal */}
        <Modal visible={showEdit} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Change Your Name</Text>
              <TextInput style={styles.modalInput} placeholder="Enter new name" placeholderTextColor="#888" value={newName} onChangeText={setNewName} autoFocus />
              <View style={styles.modalBtnRow}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowEdit(false)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { if (onEditName && newName.trim()) { onEditName(newName.trim()); } setShowEdit(false); }}>
                  <Text style={styles.modalSaveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (width: number, height: number) => {
  const isSmall = width < 400;
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#0b5e28',
    },
    container: {
      flex: 1,
      backgroundColor: '#0b5e28',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
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
    headerLeaveBtn: { 
      backgroundColor: '#ef4444', 
      paddingHorizontal: 14, 
      paddingVertical: 8, 
      borderRadius: 8 
    },
    leaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    contentWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    contentBox: {
      width: '100%',
      maxWidth: 450,
      backgroundColor: '#1e293b',
      padding: isSmall ? 20 : 28,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#334155',
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
    },
    title: {
      fontSize: isSmall ? 20 : 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      textAlign: 'center',
    },
    roomCodeText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#cbd5e1',
      marginBottom: 4,
    },
    playerCountText: {
      fontSize: 14,
      color: '#fbbf24',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    playerListContainer: {
      backgroundColor: '#334155',
      width: '100%',
      minHeight: 120,
      maxHeight: 250,
      borderWidth: 1,
      borderColor: '#475569',
      padding: 15,
      marginBottom: 25,
      borderRadius: 12,
    },
    playerItem: {
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    playerText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#fff',
    },
    actionSection: {
      width: '100%',
      gap: 10,
    },
    button: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    addBotButton: {
      backgroundColor: '#0275d8',
    },
    startButton: {
      backgroundColor: '#22c55e',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    waitingBox: {
      padding: 16,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
    },
    waitingText: {
      color: '#94a3b8',
      fontStyle: 'italic',
      fontSize: 15,
      textAlign: 'center',
    },
    disabledButton: {
      backgroundColor: '#64748b',
      opacity: 0.6,
    },
    headerRightRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    headerEditBtn: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#38bdf8' },
    headerEditBtnText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
    modalBox: { width: '100%', maxWidth: 400, backgroundColor: '#0f172a', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#334155' },
    modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    modalInput: { backgroundColor: '#1e293b', color: '#fff', borderWidth: 1, borderColor: '#475569', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 20 },
    modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#334155' },
    modalCancelBtnText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },
    modalSaveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#0275d8' },
    modalSaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    lobbyRoundsBox: {
      backgroundColor: '#334155',
      width: '100%',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#475569',
      marginBottom: 20,
      alignItems: 'center',
    },
    lobbyRoundsTitle: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    lobbyRoundsControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    lobbyRoundBtn: { backgroundColor: '#1e293b', width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#64748b' },
    lobbyRoundBtnText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    lobbyHostTag: { color: '#cbd5e1', fontSize: 14, fontWeight: '600', fontStyle: 'italic' },
  });
};
