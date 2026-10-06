import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { apiService } from './src/apiService';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { GameScreen } from './src/screens/GameScreen';
import { HowToPlayPage } from './src/screens/HowToPlayPage';
import { RulesPage } from './src/screens/RulesPage';
import { StrategyPage } from './src/screens/StrategyPage';
import { VariationsPage } from './src/screens/VariationsPage';
import { MultiplayerPage } from './src/screens/MultiplayerPage';
import { PlayAgainstAiPage } from './src/screens/PlayAgainstAiPage';
import { SoloPage } from './src/screens/SoloPage';
import { FaqPage } from './src/screens/FaqPage';
import { SevenCardsLeastMainPage } from './src/screens/SevenCardsLeastMainPage';
import { SevenCardsLeastRulesPage } from './src/screens/SevenCardsLeastRulesPage';
import { SevenCardsLeastHowToPlayPage } from './src/screens/SevenCardsLeastHowToPlayPage';
import { SevenCardsLeastStrategyPage } from './src/screens/SevenCardsLeastStrategyPage';
import { SevenCardsLeastFaqPage } from './src/screens/SevenCardsLeastFaqPage';
import { NotFoundPage } from './src/screens/NotFoundPage';
import { DemoScreen } from './src/screens/DemoScreen';
import { GameRoom, Player } from './src/engine/types';
import {
  startRound, playTurn, drawCard, callLeast, botPlayTurn, getSequenceValue, sortHand, handleTurnTimeout, checkRoomExpiration
} from './src/engine/gameLogic';
import { saveCompletedGameToHistory } from './src/history/historyService';
import { trackUserEvent } from './src/history/analyticsService';
import { syncUserProfile } from './src/history/adminService';
import { initGA, trackGAPageView } from './src/services/googleAnalytics';
import { PwaInstallBanner } from './src/components/PwaInstallBanner';
import { auth, logoutFirebase } from './src/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type AppScreen = 'auth' | 'home' | 'lobby' | 'game';

export interface AppUser {
  uid: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  isAnonymous?: boolean;
}

export default function App() {
  const getCleanPath = (pathStr?: string): string => {
    if (!pathStr) return '/';
    let p = pathStr.trim().toLowerCase();
    if (p.startsWith('/preview') || p.startsWith('/crazygames')) {
      return '/';
    }
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    return p || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location) {
      return getCleanPath(window.location.pathname);
    }
    return '/';
  });

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

  // ── SPA History & Route Navigation Listener ───────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setCurrentPath(getCleanPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (newPath: string) => {
    const clean = getCleanPath(newPath);
    setCurrentPath(clean);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', clean);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  // ── Initialize Google Analytics 4 ──────────────────────────────────────────
  useEffect(() => {
    initGA();
  }, []);

  // ── Track GA4 Screen Views ────────────────────────────────────────────────
  useEffect(() => {
    trackGAPageView(screen);
  }, [screen]);

  // ── Sync user session to localStorage & Firebase Auth state ────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const loggedUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google User',
          photoURL: firebaseUser.photoURL || undefined,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(loggedUser);
        syncUserProfile(loggedUser.uid, loggedUser.email || '', loggedUser.displayName, loggedUser.isAnonymous);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        window.localStorage.setItem('7card_game_user', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('7card_game_user');
      }
    }
  }, [user]);

  // ── Auto-join room from URL query param (e.g. ?room=ABCD) ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location) return;
    const params = new URLSearchParams(window.location.search);
    const targetRoom = params.get('room') || params.get('join');
    if (targetRoom && targetRoom.length === 4) {
      const cleanCode = targetRoom.toUpperCase();
      let activeUser = user;
      const pName = activeUser ? activeUser.displayName : 'Guest ' + Math.floor(Math.random() * 900 + 100);
      
      // If user is guest/null, auto login guest
      if (!activeUser) {
        activeUser = {
          uid: 'guest_' + Math.random().toString(36).substring(2, 9),
          displayName: pName,
          isAnonymous: true,
        };
        setUser(activeUser);
      }
      
      handleJoinRoom(pName, cleanCode, activeUser);
    }
  }, []);

  const currentRoomRef = useRef<GameRoom | null>(currentRoom);
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  const [isExpiredRoom, setIsExpiredRoom] = useState<boolean>(false);

  // ── PostgreSQL (Neha_data) Room State Polling Sync ────────────────────────
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;
    const fetchRoom = async () => {
      try {
        const data = await apiService.getRoom(roomId);
        if (data && data.success && data.room && isMounted) {
          const roomObj = data.room;
          if (checkRoomExpiration(roomObj).isExpired) {
            setIsExpiredRoom(true);
            return;
          }
          const formattedRoom: GameRoom = {
            ...roomObj,
            turnOrder: roomObj.turnOrder || [],
            discardPile: roomObj.discardPile || [],
            deck: roomObj.deck || [],
            pendingDiscard: roomObj.pendingDiscard || [],
            turnStartTime: roomObj.turnStartTime || Date.now(),
            messages: roomObj.messages
              ? (Array.isArray(roomObj.messages) ? roomObj.messages : Object.values(roomObj.messages))
              : [],
          };

          // Protect active gameplay screen from stale DB poll downgrades
          if (currentRoomRef.current?.status === 'playing' && formattedRoom.status === 'lobby') {
            return;
          }

          // Protect optimistic local actions from being overwritten by stale DB poll responses
          if (currentRoomRef.current) {
            const currentVer = currentRoomRef.current.version || 0;
            const serverVer = formattedRoom.version || 0;
            const localUpdatedAt = currentRoomRef.current.updatedAt || 0;
            const serverUpdatedAt = formattedRoom.updatedAt || 0;

            if (serverVer > 0 && currentVer > 0) {
              if (serverVer < currentVer) {
                return;
              }
            } else if (serverUpdatedAt > 0 && localUpdatedAt > 0) {
              if (serverUpdatedAt < localUpdatedAt) {
                return;
              }
            }
          }

          setCurrentRoom(formattedRoom);

          if (formattedRoom.status === 'playing' || formattedRoom.status === 'round-end' || formattedRoom.status === 'game-over') {
            setScreen('game');
          } else if (formattedRoom.status === 'lobby') {
            setScreen('lobby');
          }
        }
      } catch (e) {
        console.warn('[PostgreSQL Sync Error]', e);
      }
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomId]);

  const updateDbRoom = async (room: GameRoom) => {
    try {
      const roomToSync: GameRoom = {
        ...room,
        version: (room.version || 0) + 1,
        updatedAt: Date.now(),
      };
      if (currentRoomRef.current && currentRoomRef.current.id === roomToSync.id) {
        currentRoomRef.current = roomToSync;
        setCurrentRoom(roomToSync);
      }
      await apiService.syncRoom(roomToSync);
    } catch (e) {
      console.error('[PostgreSQL Room Sync Error]', e);
    }
  };

  // ── Room Lifecycle Expiration Loop ─────────────────────────────────────────
  useEffect(() => {
    if (!currentRoom) return;
    const interval = setInterval(() => {
      const roomToTest = currentRoomRef.current || currentRoom;
      if (!roomToTest || roomToTest.status === 'expired') return;
      const expRes = checkRoomExpiration(roomToTest);
      if (expRes.isExpired) {
        const expiredRoom: GameRoom = {
          ...roomToTest,
          status: 'expired',
          isExpired: true,
        };
        currentRoomRef.current = expiredRoom;
        setCurrentRoom(expiredRoom);
        updateDbRoom(expiredRoom);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoom?.id]);

  // ── Bot Automation Loop (Only executed by Room Host) ─────────────────────
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'playing') return;

    // Only host triggers bot turns to prevent multiple clients executing bot logic concurrently
    if (user && currentRoom.hostId !== user.uid) return;

    const currentTurnId = currentRoom.turnOrder[currentRoom.turnIndex];
    const currentPlayer = currentRoom.players[currentTurnId];
    if (!currentPlayer || !currentPlayer.isBot) return;

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(async () => {
      try {
        const latestRoom = currentRoomRef.current;
        if (!latestRoom || latestRoom.status !== 'playing') return;
        const turnId = latestRoom.turnOrder[latestRoom.turnIndex];
        if (!latestRoom.players[turnId]?.isBot) return;

        const updatedRoom = botPlayTurn(latestRoom, turnId);
        updatedRoom.updatedAt = Date.now();
        setCurrentRoom(updatedRoom);
        await updateDbRoom(updatedRoom);
      } catch (e) {
        console.error('Bot Error:', e);
      }
    }, 1200);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [currentRoom?.turnIndex, currentRoom?.turnPhase, currentRoom?.status, user?.uid]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const makePlayer = (id: string, name: string, isBot = false, photoURL?: string): Player => ({
    id, name, photoURL, hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false,
    isBot, isOut: false, roundScores: [],
  });

  const generateRoomId = () => Math.random().toString(36).substr(2, 4).toUpperCase();

  const handleLoginSuccess = (loggedUser: AppUser) => {
    setUser(loggedUser);
    syncUserProfile(loggedUser.uid, loggedUser.email || '', loggedUser.displayName, loggedUser.isAnonymous);
    setScreen('home');
  };

  const handleLogout = async () => {
    await logoutFirebase();
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('7card_game_user');
    }
    setCurrentRoom(null);
    setRoomId(null);
    setScreen('auth');
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreateRoom = async (playerName: string, rounds: number = 5, turnTimeLimit: number = 60) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const player = makePlayer(user.uid, pName, false, user.photoURL);

    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'lobby',
      createdAt: Date.now(),
      deck: [],
      discardPile: [],
      players: { [user.uid]: player },
      turnIndex: 0,
      turnOrder: [user.uid],
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: rounds,
      turnTimeLimit: turnTimeLimit,
      jokerCard: null,
      pendingDiscard: [],
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System 📢', text: `Room ${newRoomId} created! Share the code to invite friends.`, timestamp: Date.now() }],
    };

    setIsExpiredRoom(false);
    setRoomId(newRoomId);
    setCurrentRoom(room);
    setScreen('lobby');
    await updateDbRoom(room);
    trackUserEvent(user.uid, pName, 'create_room', { roomId: newRoomId });
  };

  const handleQuickMatch = async (playerName: string, rounds: number = 5, turnTimeLimit: number = 60) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const p1 = makePlayer(user.uid, pName, false, user.photoURL);
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
      turnTimeLimit: turnTimeLimit,
      jokerCard: null,
      pendingDiscard: [],
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System ⚡', text: 'Quick Match started! Computer bots joined.', timestamp: Date.now() }],
    };

    const readyRoom = startRound(room);
    setIsExpiredRoom(false);
    setRoomId(newRoomId);
    setCurrentRoom(readyRoom);
    setScreen('game');
    await updateDbRoom(readyRoom);
    trackUserEvent(user.uid, pName, 'start_game', { roomId: newRoomId, mode: 'quick_match' });
  };

  const handlePlayWithComputer = async (playerName: string, rounds: number = 5, turnTimeLimit: number = 60, numBots: number = 1) => {
    if (!user) return;
    const newRoomId = generateRoomId();
    const pName = playerName || user.displayName;
    const humanPlayer = makePlayer(user.uid, pName, false, user.photoURL);

    const players: Record<string, Player> = { [user.uid]: humanPlayer };
    const turnOrder: string[] = [user.uid];

    const count = Math.min(7, Math.max(1, numBots));
    for (let i = 1; i <= count; i++) {
      const bId = i === 1 ? `bot-${Date.now()}` : `bot-${i}-${Date.now()}`;
      const bName = i === 1 ? 'Computer 🤖' : `Bot ${i} 🤖`;
      players[bId] = makePlayer(bId, bName, true);
      turnOrder.push(bId);
    }

    const room: GameRoom = {
      id: newRoomId,
      hostId: user.uid,
      status: 'playing',
      deck: [],
      discardPile: [],
      players,
      turnIndex: 0,
      turnOrder,
      turnPhase: 'discarding',
      lastDiscardedCount: 1,
      currentRound: 1,
      maxRounds: rounds,
      turnTimeLimit: turnTimeLimit,
      jokerCard: null,
      pendingDiscard: [],
      messages: [{ id: 'sys_1', senderId: 'system', senderName: 'System 🤖', text: `Solo Game against ${count} Computer ${count === 1 ? 'Bot' : 'Bots'} started!`, timestamp: Date.now() }],
    };

    const readyRoom = startRound(room);
    setIsExpiredRoom(false);
    setRoomId(newRoomId);
    setCurrentRoom(readyRoom);
    setScreen('game');
    await updateDbRoom(readyRoom);
    trackUserEvent(user.uid, pName, 'create_room', { roomId: newRoomId, isSolo: true, numBots: count });
  };

  const handleJoinRoom = async (playerName: string, rid: string, userOverride?: AppUser) => {
    const activeUser = userOverride || user;
    if (!activeUser || !rid) return;
    const cleanRid = rid.trim().toUpperCase();
    const pName = playerName || activeUser.displayName;
    const player = makePlayer(activeUser.uid, pName, false, activeUser.photoURL);

    try {
      const res = await apiService.getRoom(cleanRid);
      if (!res || !res.success || !res.room) {
        Alert.alert('Room Not Found', 'Room not found or expired. Please check the code and try again.');
        return;
      }

      const existingRoom: GameRoom = res.room;
      const expRes = checkRoomExpiration(existingRoom);
      if (expRes.isExpired) {
        Alert.alert('Room Expired', expRes.expiredReason || 'Room not found or expired. Please check the code and try again.');
        return;
      }
      const existingPlayers = existingRoom.players || {};
      const updatedPlayers = { ...existingPlayers, [activeUser.uid]: player };

      const turnOrder = existingRoom.turnOrder || [];
      const updatedTurnOrder = turnOrder.includes(activeUser.uid)
        ? turnOrder
        : [...turnOrder, activeUser.uid];

      const newMsg = { id: 'msg_' + Date.now(), senderId: 'system', senderName: 'System 📢', text: `${pName} joined room ${cleanRid}`, timestamp: Date.now() };
      const rawMsgs = existingRoom.messages
        ? (Array.isArray(existingRoom.messages) ? existingRoom.messages : Object.values(existingRoom.messages))
        : [];
      const updatedMessages = [...(rawMsgs as any[]), newMsg];

      const updatedRoom: GameRoom = {
        ...existingRoom,
        players: updatedPlayers,
        turnOrder: updatedTurnOrder,
        messages: updatedMessages,
      };

      setIsExpiredRoom(false);
      setRoomId(cleanRid);
      setCurrentRoom(updatedRoom);
      setScreen(updatedRoom.status === 'playing' || updatedRoom.status === 'round-end' || updatedRoom.status === 'game-over' ? 'game' : 'lobby');
      await updateDbRoom(updatedRoom);
      trackUserEvent(activeUser.uid, pName, 'join_room', { roomId: cleanRid });
    } catch (e: any) {
      Alert.alert('Join Error', e.message || 'Could not join room.');
    }
  };

  const handleChangeRounds = async (newRounds: number) => {
    if (!currentRoom) return;
    const updatedRoom = { ...currentRoom, maxRounds: newRounds };
    setCurrentRoom(updatedRoom);
    await updateDbRoom(updatedRoom);
  };

  const handleChangeTurnTimeLimit = async (newTimeLimit: number) => {
    if (!currentRoom) return;
    const updatedRoom = { ...currentRoom, turnTimeLimit: newTimeLimit };
    setCurrentRoom(updatedRoom);
    await updateDbRoom(updatedRoom);
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
    await updateDbRoom(updatedRoom);
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
    await updateDbRoom(startedRoom);
    if (user) {
      trackUserEvent(user.uid, user.displayName, 'start_game', { roomId });
    }
  };

  const handleRequestRematch = async () => {
    if (!currentRoom || !user) return;

    const humanPlayers = Object.values(currentRoom.players).filter(p => !p.isBot);

    // If solo game against computer bots, immediately start new game
    if (humanPlayers.length <= 1) {
      handleStartGame();
      return;
    }

    // Prevent duplicate requests while one is already pending
    if (currentRoom.rematchRequest && currentRoom.rematchRequest.status === 'pending') {
      return;
    }

    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: 'system',
      senderName: 'System 📢',
      text: `🎮 ${user.displayName} sent a rematch request!`,
      timestamp: Date.now(),
    };

    const updated: GameRoom = {
      ...currentRoom,
      rematchRequest: {
        fromPlayerId: user.uid,
        fromPlayerName: user.displayName,
        status: 'pending',
        timestamp: Date.now(),
      },
      messages: [...(currentRoom.messages || []), newMsg],
    };

    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  const handleAcceptRematch = async () => {
    if (!currentRoom || !user) return;

    const startedRoom = startRound(currentRoom);
    startedRoom.rematchRequest = null;
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: 'system',
      senderName: 'System ⚡',
      text: `✅ ${user.displayName} accepted the rematch! Starting new game...`,
      timestamp: Date.now(),
    };
    startedRoom.messages = [...(startedRoom.messages || []), newMsg];

    setCurrentRoom(startedRoom);
    setScreen('game');
    await updateDbRoom(startedRoom);
  };

  const handleDeclineRematch = async () => {
    if (!currentRoom || !user) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: 'system',
      senderName: 'System 📢',
      text: `❌ ${user.displayName} declined the rematch request.`,
      timestamp: Date.now(),
    };

    const updated: GameRoom = {
      ...currentRoom,
      rematchRequest: {
        fromPlayerId: currentRoom.rematchRequest?.fromPlayerId || '',
        fromPlayerName: currentRoom.rematchRequest?.fromPlayerName || 'Player',
        status: 'declined',
        timestamp: Date.now(),
      },
      messages: [...(currentRoom.messages || []), newMsg],
    };

    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  const handleDiscardAndDraw = async (cardIds: string[]) => {
    if (!currentRoom || !user) return;
    console.log(`[DEBUG TURN ENGINE] 🃏 Player ${user.displayName} (${user.uid}) discarding cards:`, cardIds);
    const updated = playTurn(currentRoom, user.uid, cardIds);
    updated.updatedAt = Date.now();
    setCurrentRoom(updated);
    await updateDbRoom(updated);
    trackUserEvent(user.uid, user.displayName, 'play_turn', { roomId, action: 'discard' });
  };

  const handleDrawCard = async (source: 'deck' | 'discard') => {
    if (!currentRoom || !user) return;
    console.log(`[DEBUG TURN ENGINE] 📥 Player ${user.displayName} (${user.uid}) picking up card from source: ${source}`);
    const updated = drawCard(currentRoom, user.uid, source);
    updated.updatedAt = Date.now();
    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  const handleCallLeast = async () => {
    if (!currentRoom || !user) return;
    const updated = callLeast(currentRoom, user.uid);
    updated.updatedAt = Date.now();
    setCurrentRoom(updated);
    await updateDbRoom(updated);
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
    startedRoom.updatedAt = Date.now();
    setCurrentRoom(startedRoom);
    await updateDbRoom(startedRoom);
  };

  const handleLeaveRoom = async () => {
    setIsExpiredRoom(false);
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

    const updated = { ...currentRoom, players: updatedPlayers, updatedAt: Date.now() };
    setCurrentRoom(updated);
    if (user) setUser({ ...user, displayName: trimmed });
    await updateDbRoom(updated);
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
    const updated = {
      ...currentRoom,
      messages: [...(currentRoom.messages || []), newMsg],
      updatedAt: Date.now(),
    };
    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  const handleSortHand = async () => {
    if (!currentRoom || !user) return;
    const me = currentRoom.players[user.uid];
    if (!me || !me.hand) return;

    const sortedHand = sortHand(me.hand);

    const updatedPlayers = {
      ...currentRoom.players,
      [user.uid]: { ...me, hand: sortedHand }
    };

    const updated = { ...currentRoom, players: updatedPlayers, updatedAt: Date.now() };
    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  const handleTimeoutTurn = async (playerId: string) => {
    if (!currentRoom) return;
    const currentTurnId = currentRoom.turnOrder[currentRoom.turnIndex];
    if (currentTurnId !== playerId) return;

    console.log(`[DEBUG TURN ENGINE] ⚠️ Handling turn timeout for player: ${playerId}, currentPhase: ${currentRoom.turnPhase}`);
    const updated = handleTurnTimeout(currentRoom, playerId);
    updated.updatedAt = Date.now();
    setCurrentRoom(updated);
    await updateDbRoom(updated);
  };

  // ── Render Dedicated Pages & Screens ─────────────────────────────────────────

  const renderContent = () => {
    if (currentPath === '/7-cards-least') {
      return <SevenCardsLeastMainPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/7-cards-least/rules' || currentPath === '/rules') {
      return <SevenCardsLeastRulesPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/7-cards-least/how-to-play' || currentPath === '/how-to-play') {
      return <SevenCardsLeastHowToPlayPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/7-cards-least/strategy' || currentPath === '/strategy') {
      return <SevenCardsLeastStrategyPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/7-cards-least/faq' || currentPath === '/faq') {
      return <SevenCardsLeastFaqPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/variations') {
      return <VariationsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/multiplayer') {
      return <MultiplayerPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/play-against-ai' || currentPath === '/solo') {
      return <PlayAgainstAiPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/demo' || currentPath === '/preview') {
      return <DemoScreen onNavigate={handleNavigate} />;
    }

    const validPaths = [
      '/',
      '/7-cards-least',
      '/7-cards-least/rules',
      '/7-cards-least/how-to-play',
      '/7-cards-least/strategy',
      '/7-cards-least/faq',
      '/rules',
      '/how-to-play',
      '/strategy',
      '/variations',
      '/multiplayer',
      '/play-against-ai',
      '/solo',
      '/faq',
      '/demo',
      '/preview'
    ];
    if (isExpiredRoom) {
      return (
        <SafeAreaView style={styles.expiredContainer}>
          <View style={styles.expiredBox}>
            <Text style={styles.expiredIcon}>⌛</Text>
            <Text style={styles.expiredTitle}>This game has ended. Start a new game to play!</Text>
            <TouchableOpacity
              style={styles.createNewGameBtn}
              onPress={() => {
                setIsExpiredRoom(false);
                setRoomId(null);
                setCurrentRoom(null);
                if (user) {
                  handleCreateRoom(user.displayName);
                } else {
                  setScreen('auth');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.createNewGameBtnText}>🎮 Create New Game</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    if (!validPaths.includes(currentPath)) {
      return <NotFoundPage onNavigate={handleNavigate} />;
    }

    if (screen === 'auth' || !user) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    if (screen === 'home') {
      return (
        <HomeScreen
          userName={user.displayName}
          userId={user.uid}
          userEmail={user.email}
          userPhoto={user.photoURL}
          onLogout={handleLogout}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onPlayWithComputer={handlePlayWithComputer}
          currentFeltColor={tableTheme}
          onSelectTheme={setTableTheme}
          onQuickMatch={handleQuickMatch}
          onNavigate={handleNavigate}
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
          onChangeTurnTimeLimit={handleChangeTurnTimeLimit}
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
          onTimeoutTurn={handleTimeoutTurn}
          currentFeltColor={tableTheme}
          onRequestRematch={handleRequestRematch}
          onAcceptRematch={handleAcceptRematch}
          onDeclineRematch={handleDeclineRematch}
        />
      );
    }

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0275d8" style={{ marginBottom: 16 }} />
        <Text style={{ color: '#cbd5e1', fontSize: 16, marginBottom: 20 }}>Loading game...</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#0275d8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
          onPress={() => setScreen('home')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Return to Main Menu</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        {renderContent()}
        <PwaInstallBanner />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#0b5e28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiredContainer: {
    flex: 1,
    backgroundColor: '#07160c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  expiredBox: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 28,
    maxWidth: 440,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eab308',
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  expiredIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  expiredTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  createNewGameBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  createNewGameBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});

