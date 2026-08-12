import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text, Alert
} from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, set, onValue, off, push, update, get } from 'firebase/database';
import { auth, db } from './src/firebase';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameRoom, Player } from './src/engine/types';
import {
  startRound, playTurn, drawCard, callLeast, botPlayTurn, findFirstPlayerIndex, getSequenceValue, sanitizeForFirebase
} from './src/engine/gameLogic';
import { saveCompletedGameToHistory } from './src/history/historyService';
import { trackUserEvent } from './src/history/analyticsService';
import { syncUserProfile } from './src/history/adminService';

type AppScreen = 'loading' | 'auth' | 'home' | 'lobby' | 'game';

const getDisplayName = (u: User | null): string => {
  if (!u) return 'Player';
  if (u.displayName) return u.displayName;
  if (u.isAnonymous) return `Guest_${u.uid.slice(0, 6)}`;
  if (u.email) return u.email.split('@')[0];
  return `Player_${u.uid.slice(0, 4)}`;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tableTheme, setTableTheme] = useState<string>('#076324');

  const roomListenerRef = useRef<(() => void) | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Global Error Logging ───────────────────────────────────────────────────
  useEffect(() => {
    let webErrorHandler: ((event: ErrorEvent) => void) | null = null;
    let webRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

    if (typeof window !== 'undefined' && window.addEventListener) {
      webErrorHandler = (event: ErrorEvent) => {
        trackUserEvent(
          auth.currentUser?.uid || 'anonymous_user',
          auth.currentUser?.displayName || 'Guest Player',
          'system_error',
          {
            message: event.message || 'Unknown Web Error',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
          }
        ).catch(() => {});
      };

      webRejectionHandler = (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        trackUserEvent(
          auth.currentUser?.uid || 'anonymous_user',
          auth.currentUser?.displayName || 'Guest Player',
          'system_error',
          {
            message: reason?.message || String(reason) || 'Unhandled Promise Rejection',
            stack: reason?.stack,
          }
        ).catch(() => {});
      };

      window.addEventListener('error', webErrorHandler);
      window.addEventListener('unhandledrejection', webRejectionHandler);
    }

    let originalNativeHandler: any = null;
    const globalErrorUtils = (global as any).ErrorUtils;
    if (globalErrorUtils && globalErrorUtils.getGlobalHandler) {
      originalNativeHandler = globalErrorUtils.getGlobalHandler();
      globalErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        trackUserEvent(
          auth.currentUser?.uid || 'anonymous_user',
          auth.currentUser?.displayName || 'Guest Player',
          'system_error',
          {
            message: error?.message || String(error) || 'Unknown Native Error',
            stack: error?.stack,
            isFatal,
          }
        ).catch(() => {});

        if (originalNativeHandler) {
          originalNativeHandler(error, isFatal);
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        if (webErrorHandler) window.removeEventListener('error', webErrorHandler);
        if (webRejectionHandler) window.removeEventListener('unhandledrejection', webRejectionHandler);
      }
      if (globalErrorUtils && globalErrorUtils.setGlobalHandler && originalNativeHandler) {
        globalErrorUtils.setGlobalHandler(originalNativeHandler);
      }
    };
  }, []);

  // ── Auth & Ban listener ────────────────────────────────────────────────────
  useEffect(() => {
    let banUnsub: (() => void) | null = null;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        const isAnon = u.isAnonymous;
        const dispName = getDisplayName(u);
        const userEmail = u.email || (isAnon ? `guest_${u.uid.slice(0, 6)}@7card.game` : '');

        syncUserProfile(u.uid, userEmail, dispName, isAnon);
        trackUserEvent(u.uid, dispName, isAnon ? 'guest_login' : 'login');

        // Real-time ban check
        const userRef = ref(db, `users/${u.uid}`);
        const banListener = onValue(userRef, (snap) => {
          if (snap.exists() && snap.val().isBanned) {
            auth.signOut().catch(() => {});
            setUser(null);
            setScreen('auth');
            Alert.alert('Account Suspended', 'This account has been banned by game administration.');
          } else {
            setUser(u);
            setAuthLoading(false);
            if (screen === 'loading' || screen === 'auth') setScreen('home');
          }
        });
        banUnsub = () => off(userRef);
      } else {
        if (banUnsub) banUnsub();
        setUser(null);
        setAuthLoading(false);
        setScreen('auth');
      }
    }, () => {
      if (banUnsub) banUnsub();
      setAuthLoading(false);
      setScreen('auth');
    });
    return () => {
      unsub();
      if (banUnsub) banUnsub();
    };
  }, []);

  // ── Room listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);
    const listener = onValue(roomRef, (snap) => {
      const data = snap.val() as GameRoom | null;
      if (!data) {
        // Room was deleted
        setCurrentRoom(null);
        setRoomId(null);
        setScreen('home');
        Alert.alert('Room Closed', 'The host has left and closed the game room.');
        return;
      }
      setCurrentRoom(data);
      if (data.status === 'lobby') setScreen('lobby');
      else if (data.status === 'playing' || data.status === 'round-end' || data.status === 'game-over') setScreen('game');

      if (data.status === 'game-over' && user?.uid === data.hostId && !data.historySaved) {
        saveCompletedGameToHistory(data);
        update(ref(db, `rooms/${roomId}`), { historySaved: true });
        trackUserEvent(user.uid, getDisplayName(user), 'complete_game', { roomId, winnerId: data.winnerId });
      }
    });

    roomListenerRef.current = () => off(roomRef);
    return () => { off(roomRef); roomListenerRef.current = null; };
  }, [roomId, user?.uid]);

  // ── Bot automation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'playing' || !roomId) return;

    const currentTurnId = currentRoom.turnOrder[currentRoom.turnIndex];
    const currentPlayer = currentRoom.players[currentTurnId];
    if (!currentPlayer || !currentPlayer.isBot) return;

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(async () => {
      try {
        const snap = await get(ref(db, `rooms/${roomId}`));
        const freshRoom = snap.val() as GameRoom;
        if (!freshRoom || freshRoom.status !== 'playing') return;

        const freshTurnId = freshRoom.turnOrder[freshRoom.turnIndex];
        if (!freshRoom.players[freshTurnId]?.isBot) return;

        const updatedRoom = botPlayTurn(freshRoom, freshTurnId);
        await set(ref(db, `rooms/${roomId}`), sanitizeForFirebase(updatedRoom));
      } catch (e) {
        console.error('Bot error:', e);
      }
    }, 3500);

    return () => { if (botTimerRef.current) clearTimeout(botTimerRef.current); };
  }, [currentRoom?.turnIndex, currentRoom?.turnPhase, currentRoom?.status, roomId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const makePlayer = (id: string, name: string, isBot = false): Player => ({
    id, name, hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false,
    isBot, isOut: false, roundScores: [],
  });

  const generateRoomId = () => Math.random().toString(36).substr(2, 4).toUpperCase();

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreateRoom = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const player = makePlayer(user.uid, playerName || getDisplayName(user));
    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'lobby',
      deck: [],
      discardPile: [],
      players: { [user.uid]: player },
      turnIndex: 0,
      turnOrder: [user.uid],
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: rounds,
      jokerCard: null,
      pendingDiscard: [],
      messages: [],
    };
    await set(ref(db, `rooms/${newRoomId}`), room);
    setRoomId(newRoomId);
    trackUserEvent(user.uid, player.name, 'create_room', { roomId: newRoomId });
  };

  const handleQuickMatch = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const p1 = makePlayer(user.uid, playerName || getDisplayName(user));
    const p2 = makePlayer('bot_1', 'AlphaBot', true);
    const p3 = makePlayer('bot_2', 'BetaBot', true);
    const p4 = makePlayer('bot_3', 'OmegaBot', true);

    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'playing',
      deck: [],
      discardPile: [],
      players: { [user.uid]: p1, 'bot_1': p2, 'bot_2': p3, 'bot_3': p4 },
      turnIndex: 0,
      turnOrder: [user.uid, 'bot_1', 'bot_2', 'bot_3'],
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: rounds,
      jokerCard: null,
      pendingDiscard: [],
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System', text: '⚡ Quick Match started! Bots joined instantly.', timestamp: Date.now() }],
    };
    const readyRoom = startRound(room);
    await set(ref(db, `rooms/${newRoomId}`), readyRoom);
    setRoomId(newRoomId);
    trackUserEvent(user.uid, p1.name, 'start_game', { roomId: newRoomId, mode: 'quick_match' });
  };

  const handleJoinRoom = async (playerName: string, rid: string) => {
    if (!user || !rid) return;
    try {
      const snap = await get(ref(db, `rooms/${rid}`));
      const room = snap.val() as GameRoom | null;
      if (!room) { Alert.alert('Room not found', `No room with code ${rid}.`); return; }
      if (room.status !== 'lobby') { Alert.alert('Game in progress', 'That room has already started.'); return; }
      if (Object.keys(room.players).length >= 8) { Alert.alert('Room full', 'This room is full.'); return; }

      const player = makePlayer(user.uid, playerName || getDisplayName(user));
      const newMsgRef = push(ref(db, `rooms/${rid}/messages`));
      const newMsg = {
        id: newMsgRef.key || 'msg-' + Date.now(),
        senderId: 'system',
        senderName: 'System 📢',
        text: `${player.name} joined the game.`,
        timestamp: Date.now(),
      };
      await update(ref(db, `rooms/${rid}`), {
        [`players/${user.uid}`]: player,
        turnOrder: [...room.turnOrder, user.uid],
        [`messages/${newMsg.id}`]: newMsg,
      });
      setRoomId(rid);
      trackUserEvent(user.uid, player.name, 'join_room', { roomId: rid });
    } catch (e) {
      console.error('Join error:', e);
      Alert.alert('Error', 'Could not join room.');
    }
  };

  const handlePlayWithComputer = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const humanPlayer = makePlayer(user.uid, playerName || getDisplayName(user));
    const botId = 'bot-' + Date.now();
    const botPlayer = makePlayer(botId, 'Computer 🤖', true);

    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'lobby',
      deck: [],
      discardPile: [],
      players: { [user.uid]: humanPlayer, [botId]: botPlayer },
      turnIndex: 0,
      turnOrder: [user.uid, botId],
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: rounds,
      jokerCard: null,
      pendingDiscard: [],
      messages: [],
    };
    await set(ref(db, `rooms/${newRoomId}`), room);
    setRoomId(newRoomId);
    trackUserEvent(user.uid, humanPlayer.name, 'create_room', { roomId: newRoomId, isSolo: true });
  };

  const handleChangeRounds = async (newRounds: number) => {
    if (!currentRoom || !roomId || currentRoom.hostId !== user?.uid) return;
    await update(ref(db, `rooms/${roomId}`), {
      maxRounds: newRounds,
    });
  };

  const handleAddBot = async () => {
    if (!currentRoom || !roomId) return;
    const botId = 'bot-' + Date.now();
    const botPlayer = makePlayer(botId, `Bot ${Object.values(currentRoom.players).filter(p => p.isBot).length + 1} 🤖`, true);
    await update(ref(db, `rooms/${roomId}`), {
      [`players/${botId}`]: botPlayer,
      turnOrder: [...currentRoom.turnOrder, botId],
    });
  };

  const handleStartGame = async () => {
    if (!currentRoom || !roomId) return;
    if (Object.keys(currentRoom.players).length < 2) {
      Alert.alert('Need players', 'You need at least 2 players to start.');
      return;
    }
    const startedRoom = startRound(currentRoom);
    await set(ref(db, `rooms/${roomId}`), startedRoom);
    if (user) {
      trackUserEvent(user.uid, getDisplayName(user), 'start_game', { roomId });
    }
  };

  const handleDiscardAndDraw = async (cardIds: string[]) => {
    if (!currentRoom || !roomId || !user) return;
    const updated = playTurn(currentRoom, user.uid, cardIds);
    await set(ref(db, `rooms/${roomId}`), updated);
    trackUserEvent(user.uid, getDisplayName(user), 'play_turn', { roomId, action: 'discard' });
  };

  const handleDrawCard = async (source: 'deck' | 'discard') => {
    if (!currentRoom || !roomId || !user) return;
    const updated = drawCard(currentRoom, user.uid, source);
    await set(ref(db, `rooms/${roomId}`), updated);
  };

  const handleCallLeast = async () => {
    if (!currentRoom || !roomId || !user) return;
    const updated = callLeast(currentRoom, user.uid);
    await set(ref(db, `rooms/${roomId}`), updated);
    trackUserEvent(user.uid, getDisplayName(user), 'call_least', { roomId });
  };

  const handleNextRound = async () => {
    if (!currentRoom || !roomId) return;
    const nextRoom: GameRoom = {
      ...currentRoom,
      currentRound: currentRoom.currentRound + 1,
    };
    const startedRoom = startRound(nextRoom);
    await set(ref(db, `rooms/${roomId}`), startedRoom);
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom || !roomId || !user) {
      setScreen('home');
      setRoomId(null);
      setCurrentRoom(null);
      return;
    }

    try {
      trackUserEvent(user.uid, getDisplayName(user), 'leave_room', { roomId });
      if (currentRoom.hostId === user.uid) {
        // Save history before deleting the room if game is over and not already saved
        if (currentRoom.status === 'game-over' && !currentRoom.historySaved) {
          await saveCompletedGameToHistory(currentRoom);
        }
        await set(ref(db, `rooms/${roomId}`), null);
      } else {
        const newPlayers = { ...currentRoom.players };
        const leavingName = newPlayers[user.uid]?.name || 'A player';
        delete newPlayers[user.uid];
        const newTurnOrder = currentRoom.turnOrder.filter(id => id !== user.uid);
        
        const msgRef = push(ref(db, `rooms/${roomId}/messages`));
        await update(ref(db, `rooms/${roomId}`), {
          players: newPlayers,
          turnOrder: newTurnOrder,
          [`messages/${msgRef.key}`]: {
            id: msgRef.key,
            senderId: 'system',
            senderName: 'System 📢',
            text: `${leavingName} has left the game.`,
            timestamp: Date.now(),
          },
        });
      }
    } catch (e) {
      console.error('Leave error:', e);
    } finally {
      setRoomId(null);
      setCurrentRoom(null);
      setScreen('home');
    }
  };

  const handleEditName = async (newName: string) => {
    if (!currentRoom || !roomId || !user) return;
    const trimmed = newName.trim();
    if (!trimmed) return;
    const oldName = currentRoom.players[user.uid]?.name || getDisplayName(user);
    if (oldName === trimmed) return;

    const msgRef = push(ref(db, `rooms/${roomId}/messages`));
    await update(ref(db, `rooms/${roomId}`), {
      [`players/${user.uid}/name`]: trimmed,
      [`messages/${msgRef.key}`]: {
        id: msgRef.key,
        senderId: 'system',
        senderName: 'System 📢',
        text: `${oldName} changed their name to ${trimmed}.`,
        timestamp: Date.now(),
      },
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!currentRoom || !roomId || !user) return;
    const msgRef = push(ref(db, `rooms/${roomId}/messages`));
    await set(msgRef, {
      id: msgRef.key,
      senderId: user.uid,
      senderName: getDisplayName(user),
      text,
      timestamp: Date.now(),
    });
  };

  const handleSortHand = async () => {
    if (!currentRoom || !roomId || !user) return;
    const me = currentRoom.players[user.uid];
    if (!me || !me.hand) return;

    const jokerRank = currentRoom.jokerCard?.rank;
    const sortedHand = [...me.hand].sort((a, b) => {
      const isAJoker = jokerRank && a.rank === jokerRank;
      const isBJoker = jokerRank && b.rank === jokerRank;
      if (isAJoker && !isBJoker) return -1;
      if (!isAJoker && isBJoker) return 1;
      if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
      return getSequenceValue(a.rank) - getSequenceValue(b.rank);
    });

    await update(ref(db, `rooms/${roomId}/players/${user.uid}`), {
      hand: sortedHand
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (authLoading || screen === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0275d8" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (screen === 'auth' || !user) return <LoginScreen />;

  if (screen === 'home') {
    return (
      <HomeScreen
        userName={getDisplayName(user)}
        userId={user.uid}
        onLogout={() => auth.signOut()}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onPlayWithComputer={handlePlayWithComputer}
        currentFeltColor={tableTheme}
        onSelectTheme={setTableTheme}
        onQuickMatch={handleQuickMatch}
      />
    );
  }

  if (screen === 'lobby' && currentRoom) {
    return (
      <LobbyScreen
        room={currentRoom}
        userId={user.uid}
        onLeaveRoom={handleLeaveRoom}
        onStartGame={handleStartGame}
        onAddBot={handleAddBot}
        onEditName={handleEditName}
        onChangeRounds={handleChangeRounds}
      />
    );
  }

  if ((screen === 'game') && currentRoom) {
    return (
      <GameScreen
        room={currentRoom}
        currentPlayerId={user.uid}
        onStartGame={handleStartGame}
        onDiscardAndDraw={handleDiscardAndDraw}
        onDrawCard={handleDrawCard}
        onCallLeast={handleCallLeast}
        onNextRound={handleNextRound}
        onAddBot={handleAddBot}
        onSendMessage={handleSendMessage}
        onLeaveRoom={handleLeaveRoom}
        onEditName={handleEditName}
        onSortHand={handleSortHand}
        currentFeltColor={tableTheme}
      />
    );
  }

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0275d8" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});
