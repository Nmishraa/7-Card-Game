import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameRoom, Player } from './src/engine/types';
import {
  startRound, playTurn, drawCard, callLeast, botPlayTurn, getSequenceValue
} from './src/engine/gameLogic';
import { saveCompletedGameToHistory } from './src/history/historyService';
import { trackUserEvent } from './src/history/analyticsService';
import { syncUserProfile } from './src/history/adminService';

type AppScreen = 'auth' | 'home' | 'lobby' | 'game';

export interface AppUser {
  uid: string;
  email?: string;
  displayName: string;
  isAnonymous?: boolean;
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('7card_game_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  const [screen, setScreen] = useState<AppScreen>(() => user ? 'home' : 'auth');
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tableTheme, setTableTheme] = useState<string>('#076324');

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Sync user session to localStorage ──────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        window.localStorage.setItem('7card_game_user', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('7card_game_user');
      }
    }
  }, [user]);

  // ── Bot Automation Loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'playing') return;

    const currentTurnId = currentRoom.turnOrder[currentRoom.turnIndex];
    const currentPlayer = currentRoom.players[currentTurnId];
    if (!currentPlayer || !currentPlayer.isBot) return;

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      try {
        if (!currentRoom || currentRoom.status !== 'playing') return;
        const turnId = currentRoom.turnOrder[currentRoom.turnIndex];
        if (!currentRoom.players[turnId]?.isBot) return;

        const updatedRoom = botPlayTurn(currentRoom, turnId);
        setCurrentRoom(updatedRoom);
      } catch (e) {
        console.error('Bot Error:', e);
      }
    }, 2000);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [currentRoom?.turnIndex, currentRoom?.turnPhase, currentRoom?.status]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const makePlayer = (id: string, name: string, isBot = false): Player => ({
    id, name, hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false,
    isBot, isOut: false, roundScores: [],
  });

  const generateRoomId = () => Math.random().toString(36).substr(2, 4).toUpperCase();

  const handleLoginSuccess = (loggedUser: AppUser) => {
    setUser(loggedUser);
    syncUserProfile(loggedUser.uid, loggedUser.email || '', loggedUser.displayName, loggedUser.isAnonymous);
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentRoom(null);
    setRoomId(null);
    setScreen('auth');
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreateRoom = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const player = makePlayer(user.uid, pName);

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
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System 📢', text: `Room ${newRoomId} created! Share the code to invite friends.`, timestamp: Date.now() }],
    };

    setCurrentRoom(room);
    setRoomId(newRoomId);
    setScreen('lobby');
    trackUserEvent(user.uid, pName, 'create_room', { roomId: newRoomId });
  };

  const handleQuickMatch = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const p1 = makePlayer(user.uid, pName);
    const p2 = makePlayer('bot_1', 'AlphaBot 🤖', true);
    const p3 = makePlayer('bot_2', 'BetaBot 🤖', true);
    const p4 = makePlayer('bot_3', 'OmegaBot 🤖', true);

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
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System ⚡', text: 'Quick Match started! Computer bots joined.', timestamp: Date.now() }],
    };

    const readyRoom = startRound(room);
    setCurrentRoom(readyRoom);
    setRoomId(newRoomId);
    setScreen('game');
    trackUserEvent(user.uid, pName, 'start_game', { roomId: newRoomId, mode: 'quick_match' });
  };

  const handlePlayWithComputer = async (playerName: string, rounds: number = 5) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const humanPlayer = makePlayer(user.uid, pName);
    const botId = 'bot-' + Date.now();
    const botPlayer = makePlayer(botId, 'Computer 🤖', true);

    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'playing',
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
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System 🤖', text: 'Solo Game against Computer started!', timestamp: Date.now() }],
    };

    const readyRoom = startRound(room);
    setCurrentRoom(readyRoom);
    setRoomId(newRoomId);
    setScreen('game');
    trackUserEvent(user.uid, pName, 'create_room', { roomId: newRoomId, isSolo: true });
  };

  const handleJoinRoom = async (playerName: string, rid: string) => {
    if (!user || !rid) return;
    const pName = playerName || user.displayName;
    const player = makePlayer(user.uid, pName);

    if (currentRoom && currentRoom.id === rid) {
      setScreen('lobby');
      return;
    }

    // Join room or create local room instance
    const room: GameRoom = {
      id: rid,
      hostId: 'host_player',
      status: 'lobby',
      deck: [],
      discardPile: [],
      players: { [user.uid]: player, 'host_player': makePlayer('host_player', 'Host Player') },
      turnIndex: 0,
      turnOrder: ['host_player', user.uid],
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: 5,
      jokerCard: null,
      pendingDiscard: [],
      messages: [{ id: 'msg_1', senderId: 'system', senderName: 'System 📢', text: `${pName} joined room ${rid}`, timestamp: Date.now() }],
    };

    setCurrentRoom(room);
    setRoomId(rid);
    setScreen('lobby');
    trackUserEvent(user.uid, pName, 'join_room', { roomId: rid });
  };

  const handleChangeRounds = async (newRounds: number) => {
    if (!currentRoom) return;
    setCurrentRoom({ ...currentRoom, maxRounds: newRounds });
  };

  const handleAddBot = async () => {
    if (!currentRoom) return;
    const botId = 'bot-' + Date.now();
    const botCount = Object.values(currentRoom.players).filter(p => p.isBot).length + 1;
    const botPlayer = makePlayer(botId, `Bot ${botCount} 🤖`, true);

    const updatedRoom: GameRoom = {
      ...currentRoom,
      players: { ...currentRoom.players, [botId]: botPlayer },
      turnOrder: [...currentRoom.turnOrder, botId],
    };

    setCurrentRoom(updatedRoom);
  };

  const handleStartGame = async () => {
    if (!currentRoom) return;
    let roomToStart = currentRoom;

    // If only 1 player is in the lobby, automatically add a computer bot so game starts seamlessly
    if (Object.keys(roomToStart.players).length < 2) {
      const botId = 'bot-' + Date.now();
      const botPlayer = makePlayer(botId, 'Computer 🤖', true);
      roomToStart = {
        ...roomToStart,
        players: { ...roomToStart.players, [botId]: botPlayer },
        turnOrder: [...roomToStart.turnOrder, botId],
      };
    }

    const startedRoom = startRound(roomToStart);
    setCurrentRoom(startedRoom);
    setScreen('game');
    if (user) {
      trackUserEvent(user.uid, user.displayName, 'start_game', { roomId });
    }
  };

  const handleDiscardAndDraw = async (cardIds: string[]) => {
    if (!currentRoom || !user) return;
    const updated = playTurn(currentRoom, user.uid, cardIds);
    setCurrentRoom(updated);
    trackUserEvent(user.uid, user.displayName, 'play_turn', { roomId, action: 'discard' });
  };

  const handleDrawCard = async (source: 'deck' | 'discard') => {
    if (!currentRoom || !user) return;
    const updated = drawCard(currentRoom, user.uid, source);
    setCurrentRoom(updated);
  };

  const handleCallLeast = async () => {
    if (!currentRoom || !user) return;
    const updated = callLeast(currentRoom, user.uid);
    setCurrentRoom(updated);
    if (updated.status === 'game-over') {
      saveCompletedGameToHistory(updated);
    }
    trackUserEvent(user.uid, user.displayName, 'call_least', { roomId });
  };

  const handleNextRound = async () => {
    if (!currentRoom) return;
    const nextRoom: GameRoom = {
      ...currentRoom,
      currentRound: currentRoom.currentRound + 1,
    };
    const startedRoom = startRound(nextRoom);
    setCurrentRoom(startedRoom);
  };

  const handleLeaveRoom = async () => {
    setCurrentRoom(null);
    setRoomId(null);
    setScreen('home');
  };

  const handleEditName = async (newName: string) => {
    if (!currentRoom || !user) return;
    const trimmed = newName.trim();
    if (!trimmed) return;

    const updatedPlayers = {
      ...currentRoom.players,
      [user.uid]: { ...currentRoom.players[user.uid], name: trimmed }
    };

    setCurrentRoom({ ...currentRoom, players: updatedPlayers });
    if (user) setUser({ ...user, displayName: trimmed });
  };

  const handleSendMessage = async (text: string) => {
    if (!currentRoom || !user) return;
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: user.uid,
      senderName: user.displayName,
      text,
      timestamp: Date.now(),
    };
    setCurrentRoom({
      ...currentRoom,
      messages: [...(currentRoom.messages || []), newMsg]
    });
  };

  const handleSortHand = async () => {
    if (!currentRoom || !user) return;
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

    const updatedPlayers = {
      ...currentRoom.players,
      [user.uid]: { ...me, hand: sortedHand }
    };

    setCurrentRoom({ ...currentRoom, players: updatedPlayers });
  };

  // ── Render Screens ─────────────────────────────────────────────────────────

  if (screen === 'auth' || !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        userName={user.displayName}
        userId={user.uid}
        onLogout={handleLogout}
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

  if (screen === 'game' && currentRoom) {
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
    backgroundColor: '#0b5e28',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
