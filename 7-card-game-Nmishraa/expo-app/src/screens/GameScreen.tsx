import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Animated,
  Easing,
  Image,
  SafeAreaView
} from 'react-native';
import { GameRoom, Card as CardType, ChatMessage } from '../engine/types';
import { isValidSetOrRun, getSequenceValue } from '../engine/gameLogic';
import { 
  playTurnEnd, 
  playYourTurn,
  isMuted, 
  setMuted, 
  playCardSelect, 
  playCardDeselect, 
  playDiscard, 
  playDraw, 
  playCallLeast,
  playChatMessage,
  playTimerWarning
} from '../engine/soundService';

interface Props {
  room: GameRoom;
  currentPlayerId: string;
  onStartGame: () => void;
  onDiscardAndDraw: (cardIds: string[]) => void;
  onDrawCard: (source: 'deck' | 'discard') => void;
  onCallLeast: () => void;
  onNextRound: () => void;
  onAddBot: () => void;
  onSendMessage: (text: string) => void;
  onLeaveRoom: () => void;
  onEditName?: (newName: string) => void;
  onSortHand?: () => void;
  onTimeoutTurn?: (playerId: string) => void;
  currentFeltColor?: string;
}

const ActivePlayerGlow: React.FC<{ size: number }> = ({ size }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    loopAnim.start();

    return () => {
      loopAnim.stop();
      animValue.stopAnimation();
    };
  }, [animValue]);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1.35],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.8],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: '#4ade80',
          transform: [{ scale }],
          opacity,
        },
      ]}
      pointerEvents="none"
    />
  );
};

const getPerimeterCoords = (index: number, n: number) => {
  if (n === 8) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 82, y: 100 }, // 1: Bottom Right
      { x: 100, y: 50 }, // 2: Far Right
      { x: 82, y: 0 },   // 3: Top Right
      { x: 50, y: 0 },   // 4: Top Center
      { x: 18, y: 0 },   // 5: Top Left
      { x: 0, y: 50 },   // 6: Far Left
      { x: 18, y: 100 }, // 7: Bottom Left
    ];
    return coords[index % 8];
  }
  if (n === 7) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 82, y: 100 }, // 1: Bottom Right
      { x: 100, y: 50 }, // 2: Far Right
      { x: 80, y: 0 },   // 3: Top Right
      { x: 50, y: 0 },   // 4: Top Center
      { x: 20, y: 0 },   // 5: Top Left
      { x: 0, y: 50 },   // 6: Far Left
    ];
    return coords[index % 7];
  }
  if (n === 6) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 85, y: 100 }, // 1: Bottom Right
      { x: 85, y: 0 },   // 2: Top Right
      { x: 50, y: 0 },   // 3: Top Center
      { x: 15, y: 0 },   // 4: Top Left
      { x: 15, y: 100 }, // 5: Bottom Left
    ];
    return coords[index % 6];
  }
  if (n === 5) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 85, y: 100 }, // 1: Bottom Right
      { x: 100, y: 50 }, // 2: Far Right
      { x: 50, y: 0 },   // 3: Top Center
      { x: 0, y: 50 },   // 4: Far Left
    ];
    return coords[index % 5];
  }
  if (n === 4) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 100, y: 50 }, // 1: Far Right
      { x: 50, y: 0 },   // 2: Top Center
      { x: 0, y: 50 },   // 3: Far Left
    ];
    return coords[index % 4];
  }
  if (n === 3) {
    const coords = [
      { x: 50, y: 100 }, // 0: Bottom Center
      { x: 85, y: 0 },   // 1: Top Right
      { x: 15, y: 0 },   // 2: Top Left
    ];
    return coords[index % 3];
  }
  return index === 0 ? { x: 50, y: 100 } : { x: 50, y: 0 };
};

export const GameScreen: React.FC<Props> = ({ 
  room, currentPlayerId, onStartGame, onDiscardAndDraw, onDrawCard, onCallLeast, onNextRound, onSendMessage, onLeaveRoom, onEditName, onSortHand, onTimeoutTurn, currentFeltColor 
}) => {
  const { width, height } = useWindowDimensions();
  const allPlayersEarly = room?.turnOrder || [];
  const n = allPlayersEarly.length || 2;
  const isMobile = width < 768;
  const isSmallScreen = width < 450;
  const avatarSize = isMobile ? Math.max(28, 48 - n * 2.5) : Math.max(40, 64 - n * 2.5);
  const styles = createStyles(width, height, n, avatarSize, currentFeltColor || '#076324');
  
  const [selected, setSelected] = useState<string[]>([]);
  console.log('[GameScreen Render] selected state is:', selected);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatToast, setChatToast] = useState<{ senderName: string; text: string } | null>(null);
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState(room?.players?.[currentPlayerId]?.name || '');
  const [systemToast, setSystemToast] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const seenMsgIdsRef = useRef<Set<string>>(new Set());
  const isInitialMsgLoadRef = useRef<boolean>(true);

  const [soundMuted, setSoundMuted] = useState<boolean>(isMuted());
  const prevTurnKeyRef = useRef<string | null>(null);

  const [now, setNow] = useState<number>(Date.now());
  const warningSoundPlayedRef = useRef<string | null>(null);
  const timeoutTriggeredRef = useRef<string | null>(null);

  // Card movement animation refs & state
  const deckRef = useRef<any>(null);
  const discardRef = useRef<any>(null);
  const handRef = useRef<any>(null);

  const [isAnimatingCard, setIsAnimatingCard] = useState(false);
  const [flyingCard, setFlyingCard] = useState<{
    card?: CardType;
    isBack?: boolean;
  } | null>(null);

  const flyAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flyRotate = useRef(new Animated.Value(0)).current;
  const flyScale = useRef(new Animated.Value(1)).current;

  const getRefCoords = (ref: React.RefObject<any>, fallbackX: number, fallbackY: number) => {
    if (Platform.OS === 'web' && ref.current) {
      const el = ref.current;
      if (el && typeof el.getBoundingClientRect === 'function') {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
      }
    }
    return { x: fallbackX, y: fallbackY };
  };

  const animateDrawCard = (source: 'deck' | 'discard') => {
    if (isAnimatingCard) return;

    const deckCoords = getRefCoords(deckRef, width * 0.42, height * 0.45);
    const discardCoords = getRefCoords(discardRef, width * 0.58, height * 0.45);
    const handCoords = getRefCoords(handRef, width * 0.50, height * 0.88);

    const startX = source === 'deck' ? deckCoords.x : discardCoords.x;
    const startY = source === 'deck' ? deckCoords.y : discardCoords.y;
    const endX = handCoords.x;
    const endY = handCoords.y;

    const topDiscard = room.discardPile && room.discardPile.length > 0 ? room.discardPile[room.discardPile.length - 1] : undefined;

    setIsAnimatingCard(true);
    setFlyingCard({
      card: source === 'discard' ? topDiscard : undefined,
      isBack: source === 'deck',
    });

    flyAnim.setValue({ x: startX, y: startY });
    flyRotate.setValue(-8);
    flyScale.setValue(1.1);

    playDraw();

    Animated.parallel([
      Animated.timing(flyAnim, {
        toValue: { x: endX, y: endY },
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(flyRotate, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(flyScale, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      onDrawCard(source);
      setFlyingCard(null);
      setIsAnimatingCard(false);
    });
  };

  const animateDiscardCard = () => {
    if (isAnimatingCard || selected.length === 0) return;

    const cardsToDiscard = (me && me.hand ? me.hand : []).filter(c => selected.includes(c.id));
    if (!isValidSetOrRun(cardsToDiscard)) {
      Alert.alert("Invalid Discard", "2 different values cannot be discarded at a time.");
      return;
    }

    const discardCoords = getRefCoords(discardRef, width * 0.58, height * 0.45);
    const handCoords = getRefCoords(handRef, width * 0.50, height * 0.88);

    const startX = handCoords.x;
    const startY = handCoords.y;
    const endX = discardCoords.x;
    const endY = discardCoords.y;

    const cardToAnimate = cardsToDiscard[0];

    setIsAnimatingCard(true);
    setFlyingCard({
      card: cardToAnimate,
      isBack: false,
    });

    flyAnim.setValue({ x: startX, y: startY });
    flyRotate.setValue(0);
    flyScale.setValue(1.05);

    playDiscard();

    Animated.parallel([
      Animated.timing(flyAnim, {
        toValue: { x: endX, y: endY },
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(flyRotate, {
        toValue: 12,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(flyScale, {
        toValue: 0.9,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      onDiscardAndDraw(selected);
      setSelected([]);
      setFlyingCard(null);
      setIsAnimatingCard(false);
    });
  };

  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => clearInterval(interval);
  }, [room?.status]);

  const turnTimeLimit = room?.turnTimeLimit !== undefined ? room.turnTimeLimit : 60;
  const isTimedMode = turnTimeLimit > 0;
  const turnStartTime = room?.turnStartTime || Date.now();
  const elapsedMs = Math.max(0, now - turnStartTime);
  const remainingSec = (room?.status === 'playing' && isTimedMode)
    ? Math.max(0, Math.ceil((turnTimeLimit * 1000 - elapsedMs) / 1000))
    : turnTimeLimit;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentTurnIdEarly = room?.turnOrder ? room.turnOrder[room.turnIndex] : undefined;

  // 5s Warning Sound (played once per turn in timed mode)
  useEffect(() => {
    if (!room || room.status !== 'playing' || !currentTurnIdEarly || !isTimedMode) return;
    const warningKey = `${room.id}_R${room.currentRound}_T${room.turnIndex}_P${currentTurnIdEarly}_5s`;
    if (remainingSec <= 5 && remainingSec > 0 && warningSoundPlayedRef.current !== warningKey) {
      warningSoundPlayedRef.current = warningKey;
      playTimerWarning();
    }
  }, [remainingSec, room?.id, room?.currentRound, room?.turnIndex, currentTurnIdEarly, room?.status, isTimedMode]);

  // Timeout Auto Action (triggered once per turn in timed mode by active player or host)
  useEffect(() => {
    if (!room || room.status !== 'playing' || !currentTurnIdEarly || !onTimeoutTurn || !isTimedMode) return;
    const timeoutKey = `${room.id}_R${room.currentRound}_T${room.turnIndex}_P${currentTurnIdEarly}_timeout`;
    
    if (elapsedMs >= turnTimeLimit * 1000 && timeoutTriggeredRef.current !== timeoutKey) {
      const isTurnPlayer = currentTurnIdEarly === currentPlayerId;
      const isHost = room.hostId === currentPlayerId;
      if (isTurnPlayer || isHost) {
        timeoutTriggeredRef.current = timeoutKey;
        onTimeoutTurn(currentTurnIdEarly);
      }
    }
  }, [elapsedMs, room?.id, room?.currentRound, room?.turnIndex, currentTurnIdEarly, room?.status, currentPlayerId, room?.hostId, onTimeoutTurn, isTimedMode, turnTimeLimit]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setMuted(next);
  };

  const handleOpenChat = () => {
    setShowChat(true);
    setUnreadCount(0);
    setChatToast(null);
  };

  const isInitialTurnMountRef = useRef<boolean>(true);

  useEffect(() => {
    if (!room || room.status !== 'playing') {
      prevTurnKeyRef.current = null;
      isInitialTurnMountRef.current = true;
      return;
    }

    const turnId = room.turnOrder ? room.turnOrder[room.turnIndex] : undefined;
    const currentKey = `${room.id}_R${room.currentRound}_T${room.turnIndex}_P${turnId}`;

    if (isInitialTurnMountRef.current) {
      isInitialTurnMountRef.current = false;
      prevTurnKeyRef.current = currentKey;
      return;
    }

    if (prevTurnKeyRef.current && prevTurnKeyRef.current !== currentKey) {
      // Real turn transition occurred during active gameplay!
      if (turnId === currentPlayerId) {
        playYourTurn();
      } else {
        playTurnEnd();
      }
    }

    prevTurnKeyRef.current = currentKey;
  }, [room?.id, room?.currentRound, room?.turnIndex, room?.status, currentPlayerId]);

  const prevStatusRef = useRef<string | null>(null);
  useEffect(() => {
    if (room?.status === 'round-end' && prevStatusRef.current && prevStatusRef.current !== 'round-end') {
      playCallLeast();
    }
    prevStatusRef.current = room?.status || null;
  }, [room?.status]);

  useEffect(() => {
    const rawMsgs: ChatMessage[] = room?.messages 
      ? (Array.isArray(room.messages) ? (room.messages as ChatMessage[]) : (Object.values(room.messages) as ChatMessage[]))
      : [];

    if (rawMsgs.length === 0) return;

    // Seed existing message IDs on initial mount without triggering audio/toast/badge
    if (isInitialMsgLoadRef.current) {
      rawMsgs.forEach(m => {
        if (m) {
          const key = m.id || `${m.senderId}_${m.timestamp}_${m.text}`;
          seenMsgIdsRef.current.add(key);
        }
      });
      isInitialMsgLoadRef.current = false;
      return;
    }

    let hasNewOtherMsg = false;
    let latestNewOtherMsg: { senderName: string; text: string } | null = null;
    let newUnreadAdd = 0;

    rawMsgs.forEach(m => {
      if (!m) return;
      const key = m.id || `${m.senderId}_${m.timestamp}_${m.text}`;
      if (seenMsgIdsRef.current.has(key)) return;

      seenMsgIdsRef.current.add(key);

      if (m.senderId === 'system') {
        setSystemToast(m.text);
        return;
      }

      // Notify only if sent by another player
      if (m.senderId !== currentPlayerId) {
        hasNewOtherMsg = true;
        latestNewOtherMsg = { senderName: m.senderName, text: m.text };
        newUnreadAdd += 1;
      }
    });

    if (hasNewOtherMsg) {
      // Play pleasant notification sound (respects soundMuted)
      playChatMessage();

      if (showChat) {
        setUnreadCount(0);
      } else {
        setUnreadCount(prev => prev + newUnreadAdd);
        if (latestNewOtherMsg) {
          setChatToast(latestNewOtherMsg);
        }
      }
    }
  }, [room?.messages, currentPlayerId, showChat]);

  useEffect(() => {
    if (chatToast) {
      const timer = setTimeout(() => setChatToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [chatToast]);
  
  useEffect(() => {
    if (systemToast) {
      const timer = setTimeout(() => setSystemToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [systemToast]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  if (!room) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container} />
      </SafeAreaView>
    );
  }

  const players = room.players || {};
  const me = players[currentPlayerId];
  
  const turnOrder = room.turnOrder || [];
  const currentTurnId = turnOrder[room.turnIndex];
  const isMyTurn = currentTurnId === currentPlayerId && room.status === 'playing';

  // Rotate players so logged-in player is always at index 0 (Bottom Center)
  const myIndex = turnOrder.indexOf(currentPlayerId);
  const rotatedPlayers = myIndex >= 0 
    ? [...turnOrder.slice(myIndex), ...turnOrder.slice(0, myIndex)]
    : turnOrder;

  const handleToggle = (id: string) => {
    const logMsg1 = `[handleToggle] Clicked card ID: ${id}, isMyTurn: ${isMyTurn}, turnPhase: ${room.turnPhase}, currentTurnId: ${currentTurnId}, currentPlayerId: ${currentPlayerId}`;
    console.log(logMsg1);
    if (typeof window !== 'undefined') {
      (window as any).myLogs = (window as any).myLogs || [];
      (window as any).myLogs.push(logMsg1);
    }

    if (!isMyTurn || room.turnPhase !== 'discarding' || isAnimatingCard) {
      const logMsg2 = `[handleToggle] Early return because isMyTurn is ${isMyTurn}, turnPhase is ${room.turnPhase}, isAnimating: ${isAnimatingCard}`;
      console.log(logMsg2);
      if (typeof window !== 'undefined') {
        (window as any).myLogs.push(logMsg2);
      }
      return;
    }
    
    const isSelecting = !selected.includes(id);
    if (isSelecting && selected.length > 0) {
      const firstCard = (me && me.hand ? me.hand : []).find(c => c.id === selected[0]);
      const newCard = (me && me.hand ? me.hand : []).find(c => c.id === id);
      
      if (firstCard && newCard) {
        const isSameRank = firstCard.rank === newCard.rank;
        const isPotentialRun = firstCard.suit === newCard.suit && 
          Math.abs(getSequenceValue(firstCard.rank) - getSequenceValue(newCard.rank)) === 1;

        if (!isSameRank && !isPotentialRun) {
          setErrorMsg("2 different values cannot be discarded at a time.");
          return;
        }
      }
    }

    setSelected(prev => {
      const nextSelected = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      const logMsg3 = `[handleToggle] setSelected callback: prev: ${JSON.stringify(prev)} next: ${JSON.stringify(nextSelected)}`;
      console.log(logMsg3);
      if (typeof window !== 'undefined') {
        (window as any).myLogs.push(logMsg3);
      }
      return nextSelected;
    });
  };

  const handleDiscard = () => {
    if (selected.length === 0) return;
    const cardsToDiscard = (me && me.hand ? me.hand : []).filter(c => selected.includes(c.id));
    if (!isValidSetOrRun(cardsToDiscard)) {
      Alert.alert("Invalid Discard", "2 different values cannot be discarded at a time.");
      return;
    }
    onDiscardAndDraw(selected);
    setSelected([]);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const renderCard = (card: CardType, isSelected: boolean, onPress?: () => void, isJoker?: boolean) => {
    const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';
    const suitIcon = card.suit === 'Hearts' ? '♥' : card.suit === 'Diamonds' ? '♦' : card.suit === 'Spades' ? '♠' : '♣';
    return (
      <TouchableOpacity 
        key={card.id} 
        style={[styles.card, isSelected && styles.selectedCard, isJoker && styles.jokerCardGlow]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      >
        {isJoker && <Text style={styles.jokerBadge}>★ JOKER</Text>}
        <Text style={[styles.cardRank, { color: isRed ? '#e11d48' : '#111' }, isJoker && { marginTop: 4 }]}>{card.rank}</Text>
        <Text style={[styles.cardSuit, { color: isRed ? '#e11d48' : '#111' }]}>{suitIcon}</Text>
        <View style={styles.cardBottom}>
          <Text style={[styles.cardRankSmall, { color: isRed ? '#e11d48' : '#111' }]}>{card.rank}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRoundSummary = () => {
    const isGameOver = room.status === 'game-over';
    const playersList = Object.values(players).sort((a, b) => a.totalScore - b.totalScore);
    const caller = Object.values(players).find(p => p.hasCalledLeast);
    const jokerRank = room.jokerCard?.rank;

    return (
      <Modal visible={room.status === 'round-end' || room.status === 'game-over'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.summaryContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 6 }}>
              <Text style={styles.summaryTitle}>{isGameOver ? 'GAME OVER' : 'ROUND OVER'}</Text>
              <TouchableOpacity 
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ef4444' }} 
                onPress={onLeaveRoom}
              >
                <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>Exit Game ✕</Text>
              </TouchableOpacity>
            </View>
            {caller && <Text style={styles.callerText}>{caller.name} called LEAST!</Text>}
            
            <ScrollView style={styles.summaryCardsScroll} showsVerticalScrollIndicator={false}>
              {playersList.map(p => {
                const isWinner = isGameOver ? p.id === room.winnerId : p.id === room.roundWinnerId;
                const finalCards = p.hand || [];

                return (
                  <View key={p.id} style={[styles.summaryPlayerCard, isWinner && styles.winnerPlayerCard]}>
                    <View style={styles.summaryPlayerHeader}>
                      <Text style={styles.summaryPlayerName}>
                        {p.name} {p.id === currentPlayerId ? '(You)' : ''} {isWinner ? '[WINNER]' : ''} {p.isOut ? '[OUT]' : ''}
                      </Text>
                      <Text style={styles.summaryTotalText}>{p.totalScore} pts total</Text>
                    </View>

                    {/* Step/Card UI for Round Scores */}
                    <View style={styles.stepRoundsBox}>
                      <Text style={styles.stepRoundsTitle}>Round Breakdown:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepRoundsScroll}>
                        {(p.roundScores && p.roundScores.length > 0 ? p.roundScores : [p.roundScore]).map((score, idx) => (
                          <View key={idx} style={[styles.stepRoundCard, idx === (room.currentRound || 1) - 1 && styles.stepRoundCardCurrent]}>
                            <Text style={styles.stepRoundNum}>R{idx + 1}</Text>
                            <Text style={[styles.stepRoundScore, score === 80 && { color: '#ef4444' }]}>{score}</Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Final Cards Display */}
                    <View style={styles.finalCardsBox}>
                      <Text style={styles.finalCardsTitle}>Final Hand (Score: {p.roundScore} pts):</Text>
                      {finalCards.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.finalCardsScroll}>
                          {finalCards.map((c, i) => {
                            const isJoker = jokerRank && c.rank === jokerRank;
                            return (
                              <View key={c.id || i} style={{ marginRight: 6 }}>
                                {renderCard(c, false, undefined, isJoker)}
                              </View>
                            );
                          })}
                        </ScrollView>
                      ) : (
                        <Text style={styles.noCardsText}>No cards in hand</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {isGameOver ? (
              <View style={styles.winnerSection}>
                <Text style={styles.winnerTitle}>🏆 Winner: {playersList[0]?.name}!</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, width: '100%', justifyContent: 'center' }}>
                  <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#16a34a' }]} onPress={onStartGame} activeOpacity={0.8}>
                    <Text style={styles.summaryBtnText}>⚡ Play Rematch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#ef4444' }]} onPress={onLeaveRoom} activeOpacity={0.8}>
                    <Text style={styles.summaryBtnText}>Back to Home</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, width: '100%', justifyContent: 'center' }}>
                <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#2563eb', flex: 1.2 }]} onPress={onNextRound} activeOpacity={0.8}>
                  <Text style={styles.summaryBtnText}>Start Round {(room.currentRound || 1) + 1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#ef4444', flex: 0.8 }]} onPress={onLeaveRoom} activeOpacity={0.8}>
                  <Text style={styles.summaryBtnText}>Exit Game</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    );
  };

  const renderChatModal = () => (
    <Modal visible={showChat} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined} style={styles.modalOverlay}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Game Chat</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current && scrollViewRef.current.scrollToEnd({ animated: true })}>
            {(Object.values(room.messages || {})).map((msg, idx) => (
              <View key={idx} style={[
                styles.msgBubble, 
                msg.senderId === 'system' ? styles.sysMsg : (msg.senderId === currentPlayerId ? styles.myMsg : styles.theirMsg)
              ]}>
                {msg.senderId !== 'system' && <Text style={styles.msgSender}>{msg.senderName}</Text>}
                <Text style={[styles.msgText, msg.senderId === 'system' && styles.sysMsgText]}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.chatEmojiBar}>
            {['🔥', '👏', '😂', '😡', '❤️', '😎', '🎉', '👍', '👎', '💡', '🏆', '👀', '✨', '💀', '🚀'].map(emo => (
              <TouchableOpacity key={emo} style={styles.chatEmojiBtn} onPress={() => setMessage(prev => prev + emo)}>
                <Text style={styles.chatEmojiText}>{emo}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chatInputRow}>
            <TextInput style={styles.chatInput} placeholder="Type a message..." placeholderTextColor="#888" value={message} onChangeText={setMessage} onSubmitEditing={handleSend} />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}><Text style={styles.sendBtnText}>Send</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderScoresModal = () => (
    <Modal visible={showScoresModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitleText}>Current Scores</Text>
            <TouchableOpacity onPress={() => setShowScoresModal(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.scoreModalTable} showsVerticalScrollIndicator={false}>
            {turnOrder.map(id => {
              const p = players[id];
              if (!p) return null;
              return (
                <View key={id} style={styles.scoreModalCardRow}>
                  <View style={styles.scoreModalHeader}>
                    <Text style={[styles.scoreModalName, id === currentPlayerId && { color: '#fbbf24' }]} numberOfLines={1}>
                      {p.name} {(!room.hostId || (id !== room.hostId && id !== currentPlayerId)) ? `(${p.hand?.length || 0} cards)` : ''}
                    </Text>
                    <Text style={styles.scoreModalPoints}>{p.totalScore} pts</Text>
                  </View>
                  <View style={styles.modalStepRoundsBox}>
                    {(p.roundScores || []).map((sc, idx) => (
                      <View key={idx} style={styles.modalStepRoundPill}>
                        <Text style={styles.modalStepRoundPillText}>R{idx+1}: {sc}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseActionBtn} onPress={() => setShowScoresModal(false)}>
            <Text style={styles.modalCloseActionBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal visible={showEdit} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitleText}>Change Your Name</Text>
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
  );

  const renderLiveScoreboard = () => (
    <View style={styles.liveScoreboardCard} pointerEvents="box-none">
      <View style={styles.liveScoreboardHeader}>
        <Text style={styles.liveScoreboardColPlayer}>PLAYER</Text>
        <Text style={styles.liveScoreboardColScore}>SCORE</Text>
      </View>
      <ScrollView style={{ maxHeight: isMobile ? 150 : 240 }} showsVerticalScrollIndicator={false}>
        {turnOrder.map(id => {
          const p = players[id];
          if (!p) return null;
          const isTurn = currentTurnId === id;
          const isMe = id === currentPlayerId;

          return (
            <View 
              key={id} 
              style={[
                styles.liveScoreboardRow, 
                isTurn && styles.liveScoreboardRowActive
              ]}
            >
              <Text 
                style={[
                  styles.liveScoreboardPlayerName, 
                  isTurn && styles.liveScoreboardPlayerNameActive
                ]}
                numberOfLines={1}
              >
                {isTurn ? '▶ ' : ''}{p.name} {isMe ? '(You)' : ''}
              </Text>
              <Text 
                style={[
                  styles.liveScoreboardScoreText,
                  isTurn && styles.liveScoreboardScoreTextActive
                ]}
              >
                {p.totalScore}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderRoundSummary()}
        {renderChatModal()}
        {renderScoresModal()}
        {renderEditModal()}
        {renderLiveScoreboard()}
        {systemToast && <View style={styles.systemToast}><Text style={styles.systemToastText}>{systemToast}</Text></View>}
        {errorMsg && <View style={styles.errorToast}><Text style={styles.errorToastText}>{errorMsg}</Text></View>}
        {chatToast && !showChat && (
          <TouchableOpacity 
            style={styles.chatToast} 
            onPress={handleOpenChat}
            activeOpacity={0.85}
          >
            <View style={styles.chatToastContent}>
              <Text style={styles.chatToastHeader}>💬 New message from {chatToast.senderName}</Text>
              <Text style={styles.chatToastText} numberOfLines={1}>{chatToast.text}</Text>
            </View>
            <Text style={styles.chatToastOpenHint}>View ➔</Text>
          </TouchableOpacity>
        )}

        {/* ── TOP HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.leaveBtn} onPress={onLeaveRoom}>
              <Text style={styles.leaveBtnText}>{width < 768 ? 'Exit' : 'Leave'}</Text>
            </TouchableOpacity>
            <Text style={styles.roundInfo}>RND {room.currentRound}/{room.maxRounds}</Text>
          </View>

          {width >= 550 && (
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoSmall} 
              resizeMode="contain" 
            />
          )}

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={toggleSound} activeOpacity={0.8}>
              <Text style={styles.headerIconBtnText}>{soundMuted ? '🔇 Off' : '🔊 On'}</Text>
            </TouchableOpacity>
            {width < 768 && (
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowScoresModal(true)}>
                <Text style={styles.headerIconBtnText}>Scores</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => { setNewName(room?.players?.[currentPlayerId]?.name || ''); setShowEdit(true); }}>
              <Text style={styles.headerIconBtnText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerIconBtn, unreadCount > 0 && styles.headerIconBtnUnread]} 
              onPress={handleOpenChat}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.headerIconBtnText}>Chat</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── TABLE CENTERED ── */}
        <View style={styles.tableWrapper} pointerEvents="box-none">
          <View style={styles.tableRailOuter}>
            <View style={styles.tableRailInner}>
              <View style={styles.table}>
                <View style={styles.feltSeam} pointerEvents="none" />

                {rotatedPlayers.map((id, index) => {
                  const player = players[id];
                  if (!player) return null;
                  const isCurrentTurn = currentTurnId === id;
                  const isOut = player.isOut;
                  const isHost = id === room.hostId;
                  const isMe = id === currentPlayerId;

                  const { x, y } = getPerimeterCoords(index, n);
                  
                  const half = avatarSize / 2;
                  const pos: any = { 
                    top: `${y}%`, 
                    left: `${x}%`, 
                    transform: [{ translateX: -half }, { translateY: -half }] 
                  };
                  return (
                    <View key={id} style={[styles.opponentArea, pos]} pointerEvents="box-none">
                      <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }} pointerEvents="box-none">
                        
                        {/* Avatar */}
                        <View style={[styles.avatarBox, isCurrentTurn && styles.activeAvatar]}>
                          <Text style={styles.avatarText}>{player.name ? player.name.charAt(0).toUpperCase() : '?'}</Text>
                          {isCurrentTurn ? <ActivePlayerGlow size={avatarSize} /> : null}
                          {isHost && <View style={styles.hostBadge}><Text style={styles.hostBadgeText}>HOST</Text></View>}
                          {!isOut && <View style={styles.cardCountBadge}><Text style={styles.cardCountText}>{(player.hand && player.hand.length) || 0}</Text></View>}
                          {isOut && <View style={styles.outOverlay}><Text style={styles.outOverlayText}>OUT</Text></View>}
                        </View>

                        {/* Label & Opponent Cards */}
                        {(() => {
                          let infoStyle: any = { position: 'absolute', alignItems: 'center', zIndex: 70, width: 110 };
                          let cardStyle: any = { flexDirection: 'row' };
                          let showCardsAbove = true;

                          if (y === 100) {
                            infoStyle = { ...infoStyle, top: avatarSize + 4 };
                            if (x < 50) infoStyle.alignItems = 'flex-start';
                            if (x > 50) infoStyle.alignItems = 'flex-end';
                            showCardsAbove = false;
                          } else if (y === 0) {
                            infoStyle = { ...infoStyle, bottom: avatarSize + 4 };
                            if (x < 50) infoStyle.alignItems = 'flex-start';
                            if (x > 50) infoStyle.alignItems = 'flex-end';
                            cardStyle = { ...cardStyle, marginBottom: 5 };
                            showCardsAbove = true;
                          } else if (x === 100) {
                            infoStyle = { ...infoStyle, top: avatarSize + 4, right: -15, alignItems: 'flex-end' };
                            showCardsAbove = true;
                          } else if (x === 0) {
                            infoStyle = { ...infoStyle, top: avatarSize + 4, left: -15, alignItems: 'flex-start' };
                            showCardsAbove = true;
                          }

                          return (
                            <View style={infoStyle} pointerEvents="none">
                              {showCardsAbove && !isMe && !isOut && (
                                <View style={[styles.opponentHand, cardStyle]}>
                                  {Array.from({ length: Math.min((player.hand && player.hand.length) || 0, 5) }).map((_, i) => (
                                    <View key={i} style={[styles.cardBackSmall, { marginLeft: i === 0 ? 0 : -8 }]} />
                                  ))}
                                </View>
                              )}
                              
                              <View style={styles.opponentLabelBox}>
                                <Text style={styles.opponentName} numberOfLines={1}>{player.name} {isMe ? '(You)' : ''}</Text>
                                {!isMe && !isHost && (
                                  <Text style={styles.opponentCardCountText}>{player.hand?.length || 0} cards</Text>
                                )}
                              </View>

                              {!showCardsAbove && !isMe && !isOut && (
                                <View style={[styles.opponentHand, cardStyle, { marginTop: 5 }]}>
                                  {Array.from({ length: Math.min((player.hand && player.hand.length) || 0, 5) }).map((_, i) => (
                                    <View key={i} style={[styles.cardBackSmall, { marginLeft: i === 0 ? 0 : -8 }]} />
                                  ))}
                                </View>
                              )}
                            </View>
                          );
                        })()}
                      </View>
                    </View>
                  );
                })}

                <View style={styles.boardCenter} pointerEvents="box-none">
                  <View style={{ alignItems: 'center' }} pointerEvents="box-none">
                    <View style={styles.centerPilesRow} pointerEvents="box-none">
                      {room.jokerCard && (
                        <View style={styles.pileContainer} pointerEvents="box-none">
                          <Text style={styles.pileLabel}>JOKER</Text>
                          <View style={styles.jokerCardWrapper} pointerEvents="none">{renderCard(room.jokerCard, false)}</View>
                        </View>
                      )}
                      <View style={styles.pileContainer} pointerEvents="box-none">
                        <Text style={styles.pileLabel}>DECK</Text>
                        <TouchableOpacity 
                          ref={deckRef}
                          style={[styles.cardBack, (!isMyTurn || room.turnPhase !== 'picking' || isAnimatingCard) && styles.disabled]} 
                          onPress={() => animateDrawCard('deck')} 
                          disabled={!isMyTurn || room.turnPhase !== 'picking' || isAnimatingCard}
                          activeOpacity={0.7}
                        >
                          <View style={styles.cardPattern} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pileContainer} pointerEvents="box-none">
                        <Text style={styles.pileLabel}>{room.pendingDiscard && room.pendingDiscard.length > 0 ? "PREV DISCARD" : "DISCARD"}</Text>
                        {room.discardPile.length > 0 ? (
                          <TouchableOpacity 
                            ref={discardRef}
                            style={styles.cardCluster}
                            onPress={(isMyTurn && room.turnPhase === 'picking' && !isAnimatingCard) ? () => animateDrawCard('discard') : undefined}
                            disabled={!isMyTurn || room.turnPhase !== 'picking' || isAnimatingCard}
                            activeOpacity={0.7}
                          >
                            {room.discardPile.slice(-(room.lastDiscardedCount || 1)).map((card, idx) => (
                              <View key={card.id} style={{ marginLeft: idx === 0 ? 0 : -25 }} pointerEvents="none">
                                {renderCard(card, false)}
                              </View>
                            ))}
                          </TouchableOpacity>
                        ) : (
                          <View ref={discardRef} style={[styles.card, styles.emptyPile]} />
                        )}
                      </View>

                      {room.pendingDiscard && room.pendingDiscard.length > 0 && (
                        <View style={styles.pileContainer} pointerEvents="box-none">
                          <Text style={styles.pileLabel}>NEW DISCARD</Text>
                          <View style={styles.cardCluster} pointerEvents="none">
                            {room.pendingDiscard.map((card, idx) => (
                              <View key={card.id} style={{ marginLeft: idx === 0 ? 0 : -25 }}>
                                {renderCard(card, false)}
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>

                    <View style={styles.centerBoardInfoBox}>
                      <View style={styles.centerMetaRow}>
                        <Text style={styles.centerRoundBadge}>ROUND {room.currentRound || 1} OF {room.maxRounds || 5}</Text>
                        {room.status === 'playing' && (
                          <View style={[styles.timerBadge, isTimedMode && remainingSec <= 10 && styles.timerBadgeWarning]}>
                            <Text style={[styles.timerText, isTimedMode && remainingSec <= 10 && styles.timerTextWarning]}>
                              {isTimedMode ? `⏱️ ${formatTime(remainingSec)}` : '∞ No Timer'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.onTableTurnText}>
                        {(me && me.isOut) 
                          ? 'YOU ARE OUT' 
                          : (isMyTurn 
                              ? (room.turnPhase === 'discarding' ? '⚡ YOUR TURN: DISCARD!' : '🎴 YOUR TURN: PICK!') 
                              : `👉 ${players[currentTurnId] ? players[currentTurnId].name : 'Opponent'}'s Turn`
                            )
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── PLAYER BOTTOM DOCK (Cards & Action Buttons) ── */}
        {me && !me.isOut && (
          <View style={styles.playerDockContainer} pointerEvents="box-none">
            <View style={styles.dockTopBarContainer} pointerEvents="box-none">
              {onSortHand && (
                <TouchableOpacity style={styles.sortBtn} onPress={onSortHand} activeOpacity={0.8}>
                  <Text style={styles.sortBtnText}>Sort Cards</Text>
                </TouchableOpacity>
              )}
            </View>

            {isMyTurn && room.turnPhase === 'discarding' && (
              <View style={styles.dockActionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.discardBtn, (selected.length === 0 || isAnimatingCard) && styles.disabled]}
                  onPress={animateDiscardCard}
                  disabled={selected.length === 0 || isAnimatingCard}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Discard {selected.length > 0 ? `(${selected.length})` : ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.leastBtn]}
                  onPress={() => {
                    playCallLeast();
                    onCallLeast();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Least!</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.myHandDockWrapper} ref={handRef}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.myHandScroll}
                style={styles.myHandScrollView}
              >
                {(me.hand || []).map(card => {
                  const isJoker = room.jokerCard?.rank === card.rank;
                  return renderCard(card, selected.includes(card.id), () => handleToggle(card.id), isJoker);
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Flying Card Overlay for smooth drawing/discarding flight animation */}
        {flyingCard && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 9999,
              transform: [
                { translateX: flyAnim.x },
                { translateY: flyAnim.y },
                {
                  rotate: flyRotate.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ['-360deg', '360deg'],
                  }),
                },
                { scale: flyScale },
              ],
              marginLeft: -(isSmallScreen ? 22 : 30),
              marginTop: -(isSmallScreen ? 32 : 43),
            }}
            pointerEvents="none"
          >
            {flyingCard.isBack ? (
              <View style={styles.cardBack}>
                <View style={styles.cardPattern} />
              </View>
            ) : (
              flyingCard.card && renderCard(flyingCard.card, false)
            )}
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (width: number, height: number, n: number = 4, avatarSize: number = 40, feltColor: string = '#076324') => {
  const isSmall = width < 500;
  const isMobile = width < 768;
  const isTiny = width < 360;
  const isLandscape = width > height;

  const tableWidth = isLandscape
    ? Math.min(width * 0.88, 850 + n * 20)
    : Math.min(width - 12, 380 + n * 12);
  
  const csmW = Math.max(10, 22 - n);
  const csmH = Math.max(14, 30 - n * 1.5);
  const cardW = isTiny ? 40 : (isSmall ? 44 : 60);
  const cardH = isTiny ? 58 : (isSmall ? 64 : 86);

  const bgTheme = feltColor === '#076324' ? '#0b5e28' : feltColor;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: bgTheme,
    },
    container: {
      flex: 1,
      backgroundColor: bgTheme, 
      justifyContent: 'space-between',
    },
    /* Header */
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isSmall ? 8 : 16,
      paddingVertical: isSmall ? 6 : 10,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      zIndex: 100,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: isSmall ? 6 : 10 },
    logoSmall: { 
      width: isSmall ? 90 : 160, 
      height: isSmall ? 36 : 55 
    },
    roundInfo: { color: '#facc15', fontSize: isSmall ? 11 : 16, fontWeight: '900', letterSpacing: 0.5 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: isSmall ? 4 : 8 },
    headerIconBtn: { 
      backgroundColor: 'rgba(51, 65, 85, 0.8)', 
      paddingHorizontal: isSmall ? 8 : 12, 
      paddingVertical: isSmall ? 5 : 8, 
      borderRadius: 8, 
      borderWidth: 1, 
      borderColor: 'rgba(255,255,255,0.1)',
      minHeight: 32,
      justifyContent: 'center',
    },
    headerIconBtnText: { color: '#fff', fontSize: isSmall ? 11 : 13, fontWeight: 'bold' },
    leaveBtn: { 
      backgroundColor: '#ef4444', 
      paddingHorizontal: isSmall ? 10 : 16, 
      paddingVertical: isSmall ? 5 : 8, 
      borderRadius: 8,
      minHeight: 32,
      justifyContent: 'center',
    },
    leaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: isSmall ? 11 : 14 },

    /* Live Scoreboard (Compact Responsive Table) */
    liveScoreboardCard: {
      position: 'absolute',
      right: isMobile ? 8 : 20,
      top: isMobile ? 54 : 75,
      zIndex: 200,
      backgroundColor: 'rgba(15, 23, 42, 0.94)',
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.22)',
      padding: isMobile ? 8 : 12,
      minWidth: isMobile ? 180 : 220,
      maxWidth: isMobile ? 220 : 270,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
    },
    liveScoreboardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1.5,
      borderBottomColor: 'rgba(255, 255, 255, 0.2)',
      paddingBottom: 6,
      marginBottom: 4,
    },
    liveScoreboardColPlayer: {
      color: '#94a3b8',
      fontSize: isMobile ? 11 : 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      flex: 1,
    },
    liveScoreboardColScore: {
      color: '#94a3b8',
      fontSize: isMobile ? 11 : 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      textAlign: 'right',
      minWidth: 55,
    },
    liveScoreboardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: isMobile ? 4 : 6,
      paddingHorizontal: 6,
      borderRadius: 8,
      marginVertical: 1.5,
    },
    liveScoreboardRowActive: {
      backgroundColor: 'rgba(250, 204, 21, 0.18)',
      borderLeftWidth: 3.5,
      borderLeftColor: '#facc15',
    },
    liveScoreboardPlayerName: {
      color: '#cbd5e1',
      fontSize: isMobile ? 12 : 13,
      fontWeight: '600',
      flex: 1,
      marginRight: 8,
    },
    liveScoreboardPlayerNameActive: {
      color: '#facc15',
      fontWeight: '900',
    },
    liveScoreboardScoreText: {
      color: '#ffffff',
      fontSize: isMobile ? 13 : 15,
      fontWeight: '700',
      textAlign: 'right',
      minWidth: 55,
    },
    liveScoreboardScoreTextActive: {
      color: '#facc15',
      fontWeight: '900',
    },

    tableWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isSmall ? 4 : 12,
      paddingBottom: isSmall ? 20 : 60,
    },
    /* Mahogany wood rail */
    tableRailOuter: {
      borderRadius: 999,
      backgroundColor: '#3d1400',
      padding: isSmall ? 8 : 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.8,
      shadowRadius: 30,
      elevation: 25,
    },
    tableRailInner: {
      borderRadius: 999,
      backgroundColor: '#5a1a00',
      padding: isSmall ? 3 : 6,
    },
    table: {
      width: tableWidth,
      aspectRatio: isLandscape ? 2.5 : 1.35, 
      backgroundColor: feltColor, 
      borderRadius: 999,
      position: 'relative',
      overflow: 'visible',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    feltSeam: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 999,
      borderWidth: isSmall ? 6 : 15,
      borderColor: 'rgba(0,0,0,0.15)',
      margin: 2,
    },
    boardCenter: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerPilesRow: {
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: isSmall ? 8 : 25, 
      marginVertical: isSmall ? 4 : 10,
    },
    pileContainer: { alignItems: 'center' },
    pileLabel: { color: 'rgba(255,255,255,0.8)', fontSize: isSmall ? 8 : 10, fontWeight: '900', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' },
    cardCluster: { flexDirection: 'row', alignItems: 'center' },
    card: {
      width: cardW,
      height: cardH,
      backgroundColor: '#fff',
      borderRadius: 6,
      padding: isSmall ? 2 : 4,
      justifyContent: 'space-between',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
    },
    selectedCard: { 
      borderColor: '#facc15', 
      borderWidth: 3, 
      transform: [{ translateY: -14 }],
      shadowColor: '#facc15',
      shadowOpacity: 0.8,
      shadowRadius: 12,
    },
    cardRank: { fontSize: Math.max(10, cardW * 0.35), fontWeight: '900' },
    cardSuit: { fontSize: Math.max(14, cardW * 0.45), textAlign: 'center' },
    cardBottom: { alignItems: 'flex-end' },
    cardRankSmall: { fontSize: Math.max(8, cardW * 0.25), fontWeight: '900' },
    cardBack: {
      width: cardW,
      height: cardH,
      backgroundColor: '#1e40af',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#fff',
      overflow: 'hidden',
    },
    cardPattern: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: 4, borderRadius: 4 },
    emptyPile: { backgroundColor: 'rgba(255,255,255,0.05)', borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
    jokerCardWrapper: { opacity: 0.95 },
    
    opponentArea: { position: 'absolute', width: avatarSize, height: avatarSize, zIndex: 60 },
    avatarBox: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: '#e2e8f0', 
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#c9a84c', 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 10,
    },
    activeAvatar: { borderColor: '#4ade80', borderWidth: 4, shadowColor: '#4ade80', shadowOpacity: 0.8 },
    avatarText: { color: '#0f172a', fontWeight: '900', fontSize: avatarSize * 0.45 },
    hostBadge: { 
      position: 'absolute', 
      top: -10, 
      backgroundColor: '#facc15', 
      paddingHorizontal: 6, 
      paddingVertical: 2, 
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#854d0e',
    },
    hostBadgeText: { color: '#000', fontSize: 8, fontWeight: '900' },
    cardCountBadge: {
      position: 'absolute', bottom: -6, right: -6,
      backgroundColor: '#c9a84c', width: 18, height: 18,
      borderRadius: 9, justifyContent: 'center', alignItems: 'center',
      borderWidth: 2, borderColor: '#fff',
    },
    cardCountText: { color: '#000', fontSize: 9, fontWeight: '900' },
    outOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: avatarSize/2, justifyContent: 'center', alignItems: 'center' },
    outOverlayText: { color: '#ef4444', fontSize: 10, fontWeight: '900' },

    opponentLabelBox: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.85)',
      paddingHorizontal: isSmall ? 6 : 8, 
      paddingVertical: isSmall ? 2 : 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(201,168,76,0.5)',
      minWidth: isSmall ? 55 : 70,
    },
    opponentName: { color: '#fff', fontSize: isSmall ? 9 : 11, fontWeight: '900' },
    opponentCardCountText: { color: '#facc15', fontSize: isSmall ? 8 : 10, fontWeight: 'bold', marginTop: 1 },
    
    opponentHand: { flexDirection: 'row', marginTop: 2 },
    cardBackSmall: { width: csmW, height: csmH, backgroundColor: '#1e3a8a', borderRadius: 4, borderWidth: 1, borderColor: '#93c5fd' },
    
    centerBoardInfoBox: {
      alignItems: 'center',
      marginTop: isSmall ? 2 : 4,
      backgroundColor: 'rgba(10, 22, 40, 0.85)',
      paddingHorizontal: isSmall ? 10 : 16,
      paddingVertical: isSmall ? 4 : 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(250, 204, 21, 0.4)',
    },
    centerMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isSmall ? 6 : 8,
      marginBottom: 2,
    },
    centerRoundBadge: {
      color: '#38bdf8',
      fontSize: isSmall ? 9 : 12,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    timerBadge: {
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      paddingHorizontal: isSmall ? 6 : 8,
      paddingVertical: 2,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#38bdf8',
    },
    timerBadgeWarning: {
      backgroundColor: 'rgba(239, 68, 68, 0.25)',
      borderColor: '#ef4444',
    },
    timerText: {
      color: '#38bdf8',
      fontSize: isSmall ? 9 : 12,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    timerTextWarning: {
      color: '#ef4444',
      fontWeight: '900',
    },
    onTableTurnText: { color: '#facc15', fontSize: isSmall ? 11 : 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 8, textAlign: 'center' },
    
    /* Dedicated Bottom Player Dock */
    playerDockContainer: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: isSmall ? 8 : 12,
      paddingHorizontal: isSmall ? 6 : 10,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
      zIndex: 1000,
    },
    dockActionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: isSmall ? 10 : 16,
      marginBottom: isSmall ? 8 : 12,
    },
    myHandDockWrapper: {
      width: '100%',
      maxWidth: 700,
      height: cardH + 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    myHandScroll: {
      alignItems: 'center',
      gap: isSmall ? 6 : 10,
      paddingHorizontal: 12,
    },
    myHandScrollView: {
      flexGrow: 0,
    },
    actionBtn: { paddingVertical: isSmall ? 8 : 12, paddingHorizontal: isSmall ? 16 : 30, borderRadius: 25, alignItems: 'center', minWidth: isSmall ? 95 : 140, elevation: 5 },
    discardBtn: { backgroundColor: '#2563eb' },
    leastBtn: { backgroundColor: '#16a34a' },
    disabled: { opacity: 0.5 },
    actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: isSmall ? 13 : 18, letterSpacing: 0.5 },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 12 },
    modalBox: { backgroundColor: '#0f172a', width: '94%', maxWidth: 400, maxHeight: '90%', borderRadius: 24, padding: isSmall ? 16 : 24, borderWidth: 1, borderColor: '#334155' },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10 },
    modalTitleText: { color: '#fff', fontSize: isSmall ? 17 : 20, fontWeight: '900' },
    scoreModalTable: { maxHeight: 300, marginBottom: 20 },
    scoreModalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    scoreModalName: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10 },
    scoreModalPoints: { color: '#facc15', fontSize: 16, fontWeight: '900' },
    modalCloseActionBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    modalCloseActionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    summaryContainer: { 
      backgroundColor: '#0f172a', 
      width: '94%', 
      maxWidth: 440, 
      maxHeight: '86%', 
      borderRadius: 24, 
      padding: isSmall ? 14 : 20, 
      alignItems: 'center', 
      borderWidth: 1.5, 
      borderColor: '#334155',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    summaryTitle: { color: '#fff', fontSize: isSmall ? 20 : 26, fontWeight: '900', marginBottom: 6 },
    callerText: { color: '#facc15', fontSize: isSmall ? 14 : 16, fontWeight: 'bold', marginBottom: 10 },
    summaryCardsScroll: { width: '100%', flexGrow: 1, flexShrink: 1, marginVertical: 6 },
    scoreTable: { width: '100%', marginBottom: 25 },
    scoreRowHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10, marginBottom: 10 },
    scoreHeaderCell: { color: '#94a3b8', flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
    scoreRow: { flexDirection: 'row', paddingVertical: 8 },
    scoreCell: { color: '#fff', flex: 1, textAlign: 'center', fontSize: 16 },
    winnerSection: { alignItems: 'center', width: '100%', marginTop: 4 },
    winnerTitle: { fontSize: isSmall ? 16 : 20, color: '#22c55e', fontWeight: '900', marginBottom: 8, textAlign: 'center' },
    summaryBtn: { backgroundColor: '#2563eb', paddingVertical: isSmall ? 10 : 12, paddingHorizontal: isSmall ? 10 : 16, borderRadius: 14, flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
    summaryBtnText: { color: '#fff', fontWeight: '900', fontSize: isSmall ? 13 : 15, textAlign: 'center' },

    
    chatContainer: { width: '94%', maxWidth: 450, height: '80%', backgroundColor: '#0f172a', borderRadius: 24, borderWidth: 1, borderColor: '#334155', padding: isSmall ? 14 : 20 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10 },
    chatTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
    closeBtn: { color: '#94a3b8', fontSize: 24 },
    msgBubble: { padding: 10, borderRadius: 16, marginBottom: 8, maxWidth: '85%' },
    myMsg: { backgroundColor: '#2563eb', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    theirMsg: { backgroundColor: '#1e293b', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    msgSender: { color: '#94a3b8', fontSize: 10, marginBottom: 2, fontWeight: 'bold' },
    msgText: { color: '#fff', fontSize: 14 },
    chatInputRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    chatEmojiBar: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, marginBottom: 4, paddingVertical: 6, paddingHorizontal: 6, backgroundColor: '#1e293b', borderRadius: 16, justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
    chatEmojiBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10 },
    chatEmojiText: { fontSize: 18 },
    chatInput: { flex: 1, backgroundColor: '#1e293b', color: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 25, fontSize: 14 },
    sendBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 25 },
    sendBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
    errorToast: { position: 'absolute', top: 70, alignSelf: 'center', backgroundColor: '#e11d48', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, zIndex: 1000, borderWidth: 2, borderColor: '#fff' },
    errorToastText: { color: '#fff', fontWeight: '900', fontSize: 13, textAlign: 'center' },
    sysMsg: { backgroundColor: 'rgba(14, 165, 233, 0.2)', alignSelf: 'center', maxWidth: '95%', borderWidth: 1, borderColor: '#0ea5e9', paddingVertical: 6, paddingHorizontal: 12 },
    sysMsgText: { color: '#38bdf8', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
    systemToast: { position: 'absolute', top: 75, alignSelf: 'center', backgroundColor: 'rgba(15, 23, 42, 0.95)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 30, zIndex: 1000, borderWidth: 1.5, borderColor: '#38bdf8', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8 },
    systemToastText: { color: '#38bdf8', fontWeight: '900', fontSize: 13, textAlign: 'center', letterSpacing: 0.5 },
    modalInput: { backgroundColor: '#1e293b', color: '#fff', borderWidth: 1, borderColor: '#475569', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 20 },
    modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#334155' },
    modalCancelBtnText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 15 },
    modalSaveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#0275d8' },
    modalSaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    
    dockTopBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 6,
      width: '100%',
    },
    sortBtn: {
      backgroundColor: '#f59e0b',
      paddingVertical: isSmall ? 5 : 8,
      paddingHorizontal: isSmall ? 12 : 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#fef3c7',
      elevation: 4,
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
    },
    sortBtnText: { color: '#000', fontWeight: '900', fontSize: isSmall ? 12 : 14, letterSpacing: 0.5 },
    jokerCardGlow: {
      borderColor: '#facc15',
      borderWidth: 2,
      shadowColor: '#facc15',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    jokerBadge: {
      position: 'absolute',
      top: 2,
      alignSelf: 'center',
      color: '#facc15',
      fontSize: 9,
      fontWeight: '900',
      backgroundColor: '#1e293b',
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    summaryPlayerCard: {

      backgroundColor: '#1e293b',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#334155',
      width: '100%',
    },
    winnerPlayerCard: {
      borderColor: '#f59e0b',
      borderWidth: 2,
    },
    summaryPlayerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#334155',
      paddingBottom: 8,
    },
    summaryPlayerName: { color: '#fff', fontSize: 18, fontWeight: '900' },
    summaryTotalText: { color: '#facc15', fontSize: 18, fontWeight: 'bold' },
    stepRoundsBox: { marginBottom: 12 },
    stepRoundsTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 },
    stepRoundsScroll: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
    stepRoundCard: {
      backgroundColor: '#0f172a',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#38bdf8',
      alignItems: 'center',
      minWidth: 50,
    },
    stepRoundCardCurrent: { borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.15)' },
    stepRoundNum: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
    stepRoundScore: { color: '#fff', fontSize: 14, fontWeight: '900' },
    finalCardsBox: { marginTop: 4 },
    finalCardsTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 },
    finalCardsScroll: { flexDirection: 'row', paddingBottom: 4, alignItems: 'center' },
    noCardsText: { color: '#64748b', fontStyle: 'italic', fontSize: 14 },
    
    scoreboardPlayerBox: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    scoreboardPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 4,
    },
    scoreboardRoundPill: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#38bdf8',
    },
    scoreboardRoundPillText: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },

    scoreModalCardRow: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    scoreModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalStepRoundsBox: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    modalStepRoundPill: {
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#38bdf8',
    },
    modalStepRoundPillText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },

    chatToast: {
      position: 'absolute',
      top: 65,
      alignSelf: 'center',
      backgroundColor: '#1e293b',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      zIndex: 1100,
      borderWidth: 1.5,
      borderColor: '#3b82f6',
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 12,
    },
    chatToastContent: {
      flex: 1,
      marginRight: 10,
    },
    chatToastHeader: {
      color: '#60a5fa',
      fontWeight: '900',
      fontSize: 13,
      marginBottom: 2,
    },
    chatToastText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    chatToastOpenHint: {
      color: '#93c5fd',
      fontSize: 12,
      fontWeight: '800',
    },
    unreadBadge: {
      backgroundColor: '#ef4444',
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 1,
      minWidth: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ffffff',
    },
    unreadBadgeText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '900',
    },
    headerIconBtnUnread: {
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.25)',
    },
  });
};
