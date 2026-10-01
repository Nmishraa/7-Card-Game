import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView, Image, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { GameRoom } from '../engine/types';

interface Props {
  room: GameRoom;
  userId: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onAddBot: () => void;
  onEditName?: (newName: string) => void;
  onChangeRounds?: (newRounds: number) => void;
  onChangeTurnTimeLimit?: (newTimeLimit: number) => void;
}

export const LobbyScreen: React.FC<Props> = ({ room, userId, onLeaveRoom, onStartGame, onAddBot, onEditName, onChangeRounds, onChangeTurnTimeLimit }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const isHost = room.hostId === userId;
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState(room.players[userId]?.name || '');
  const [shareToast, setShareToast] = useState<string | null>(null);

  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard && window.navigator.clipboard.writeText) {
        await window.navigator.clipboard.writeText(textToCopy);
        return true;
      }
    } catch (e) {}
    try {
      if (typeof document !== 'undefined') {
        const el = document.createElement('textarea');
        el.value = textToCopy;
        el.setAttribute('readonly', '');
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        const success = document.execCommand('copy');
        document.body.removeChild(el);
        if (success) return true;
      }
    } catch (e) {}
    return false;
  };

  const showShareToastMsg = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 3500);
  };
  
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const createdAt = room.createdAt || now;
  const WAITING_TTL_MS = 15 * 60 * 1000;
  const remainingLobbyMs = Math.max(0, WAITING_TTL_MS - (now - createdAt));
  const isExpired = room.status === 'expired' || room.isExpired || remainingLobbyMs === 0;

  const formatCountdown = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const players = Object.values(room.players || {});

  if (isExpired) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 16 }]}>
          <View style={[styles.contentBox, { borderColor: '#ef4444', borderWidth: 2 }]}>
            <Text style={{ fontSize: 44, marginBottom: 8, textAlign: 'center' }}>⏳</Text>
            <Text style={[styles.title, { color: '#f87171' }]}>This private room has expired.</Text>
            <Text style={{ color: '#cbd5e1', fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 20 }}>
              Waiting rooms automatically close after 15 minutes if the game is not started. Click below to create a fresh private room!
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.startButton, { backgroundColor: '#2563eb' }]}
              onPress={onLeaveRoom}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>🎮 Create New Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentWrapper} showsVerticalScrollIndicator={false}>
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

            {/* Expiration Countdown Badge */}
            <View style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', borderWidth: 1, borderColor: '#38bdf8', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 13 }}>
                ⏳ Room expires in {formatCountdown(remainingLobbyMs)}
              </Text>
            </View>

            {/* ─── SHARE ROOM CODE WITH YOUR FRIENDS WIDGET ─── */}
            <View style={styles.shareSectionBox}>
              <Text style={styles.shareSectionTitle}>📲 Share room code with your friends</Text>
              
              {/* Room Code Badge with Copy Action */}
              <TouchableOpacity 
                style={styles.roomCodeBadge}
                activeOpacity={0.8}
                onPress={async () => {
                  const copied = await copyToClipboard(room.id);
                  showShareToastMsg(copied ? `🔑 Room Code ${room.id} copied!` : `Room Code: ${room.id}`);
                }}
              >
                <Text style={styles.roomCodeBadgeLabel}>Room Code:</Text>
                <Text style={styles.roomCodeBadgeValue}>{room.id}</Text>
                <View style={styles.copyBadgePill}>
                  <Text style={styles.copyBadgePillText}>Copy</Text>
                </View>
              </TouchableOpacity>

              {shareToast && (
                <View style={styles.shareToastBox}>
                  <Text style={styles.shareToastText}>{shareToast}</Text>
                </View>
              )}

              <View style={styles.shareRow}>
                <TouchableOpacity 
                  style={styles.whatsappBtn} 
                  onPress={async () => {
                    const inviteUrl = `https://cards.gnanamai.com/?room=${room.id}`;
                    const shareText = `Join my 7 Card Game table! 🎴 Room Code: ${room.id}\nClick to play: ${inviteUrl}`;
                    await copyToClipboard(shareText);
                    if (typeof window !== 'undefined') {
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                    }
                    showShareToastMsg('💬 Invite link copied! Opening WhatsApp...');
                  }}
                >
                  <Text style={styles.whatsappBtnText}>💬 WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.copyLinkBtn} 
                  onPress={async () => {
                    const inviteUrl = `https://cards.gnanamai.com/?room=${room.id}`;
                    const shareText = `Join my 7 Card Game table! 🎴 Room Code: ${room.id}\nClick to play: ${inviteUrl}`;
                    const copied = await copyToClipboard(shareText);
                    showShareToastMsg(copied ? '📋 Room link copied to clipboard!' : `Room Link: ${inviteUrl}`);
                    Alert.alert('Room Link Copied', `Copied to clipboard!\n\n${inviteUrl}`);
                  }}
                >
                  <Text style={styles.copyLinkBtnText}>📋 Copy Link</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.playerListContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {players.map((p, index) => (
                  <View key={p.id} style={styles.playerItem}>
                    <View style={styles.playerAvatarBox}>
                      {p.photoURL ? (
                        <Image source={{ uri: p.photoURL }} style={styles.playerAvatarImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.playerAvatarFallback}>
                          <Text style={styles.playerAvatarText}>{(p.name || '?').charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
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

            {/* Turn Time Selector in Lobby */}
            <View style={styles.lobbyRoundsBox}>
              <Text style={styles.lobbyRoundsTitle}>
                ⏱️ Turn Time: {room.turnTimeLimit === 0 ? 'No Timer' : '1 Minute'}
              </Text>
              {isHost && (
                <View style={styles.lobbyRoundsControls}>
                  <TouchableOpacity
                    style={[
                      styles.lobbyTimeToggleBtn,
                      (room.turnTimeLimit === undefined || room.turnTimeLimit === 60) && styles.lobbyTimeToggleActive
                    ]}
                    onPress={() => onChangeTurnTimeLimit && onChangeTurnTimeLimit(60)}
                  >
                    <Text style={styles.lobbyTimeToggleText}>⏱️ 1 Min</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.lobbyTimeToggleBtn,
                      room.turnTimeLimit === 0 && styles.lobbyTimeToggleActive
                    ]}
                    onPress={() => onChangeTurnTimeLimit && onChangeTurnTimeLimit(0)}
                  >
                    <Text style={styles.lobbyTimeToggleText}>∞ No Timer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.actionSection}>
              {isHost ? (
                <>
                  {players.length === 1 && (
                    <Text style={styles.soloNoticeText}>
                      💡 Single Player: Clicking "Start Game" auto-adds a Computer Bot 🤖
                    </Text>
                  )}
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
        </ScrollView>

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
    scrollView: {
      flex: 1,
      width: '100%',
    },
    scrollContentWrapper: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    brandContainer: {
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 4,
    },
    logoLarge: {
      width: isSmall ? 150 : 180,
      height: isSmall ? 60 : 75,
      marginBottom: 4,
    },
    welcomeTagline: {
      color: '#cbd5e1',
      fontSize: isSmall ? 13 : 15,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    playerAvatarBox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      overflow: 'hidden',
    },
    playerAvatarImage: {
      width: 28,
      height: 28,
      borderRadius: 14,
    },
    playerAvatarFallback: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#0284c7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerAvatarText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
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
    lobbyTimeToggleBtn: { backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#64748b' },
    lobbyTimeToggleActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
    lobbyTimeToggleText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    lobbyHostTag: { color: '#cbd5e1', fontSize: 14, fontWeight: '600', fontStyle: 'italic' },
    soloNoticeText: { color: '#38bdf8', fontSize: 13, textAlign: 'center', marginBottom: 6, fontStyle: 'italic', fontWeight: '500' },
    shareSectionBox: {
      width: '100%',
      backgroundColor: '#0f172a',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.3)',
      marginBottom: 16,
      alignItems: 'center',
    },
    shareSectionTitle: {
      color: '#38bdf8',
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    roomCodeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1e293b',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fbbf24',
      marginBottom: 12,
      gap: 8,
    },
    roomCodeBadgeLabel: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
    roomCodeBadgeValue: { color: '#fbbf24', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
    copyBadgePill: { backgroundColor: '#38bdf8', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    copyBadgePillText: { color: '#0f172a', fontSize: 11, fontWeight: 'bold' },
    shareToastBox: {
      backgroundColor: '#064e3b',
      borderWidth: 1,
      borderColor: '#34d399',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 10,
      width: '100%',
      alignItems: 'center',
    },
    shareToastText: { color: '#a7f3d0', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
    shareRow: { flexDirection: 'row', gap: 8, width: '100%', flexWrap: 'wrap', justifyContent: 'center' },
    whatsappBtn: { backgroundColor: '#25D366', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flex: 1, minWidth: 120, alignItems: 'center' },
    whatsappBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
    copyLinkBtn: { backgroundColor: '#0ea5e9', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flex: 1, minWidth: 120, alignItems: 'center' },
    copyLinkBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
    copyCodeBtn: { backgroundColor: '#7c3aed', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flex: 1, minWidth: 120, alignItems: 'center' },
    copyCodeBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  });
};
