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
import { GameRoom, Card as CardType } from '../engine/types';
import { isValidSetOrRun, getSequenceValue } from '../engine/gameLogic';

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
  currentFeltColor?: string;
}

const ActivePlayerGlow: React.FC<{ size: number }> = ({ size }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
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
  room, currentPlayerId, onDiscardAndDraw, onDrawCard, onCallLeast, onNextRound, onSendMessage, onLeaveRoom, onEditName, onSortHand, currentFeltColor 
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
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState(room?.players?.[currentPlayerId]?.name || '');
  const [systemToast, setSystemToast] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const prevMessagesCount = useRef((room?.messages ? Object.values(room.messages) : []).length);
  
  useEffect(() => {
    const msgs = room?.messages ? Object.values(room.messages) : [];
    if (msgs.length > prevMessagesCount.current) {
      const latest = msgs[msgs.length - 1];
      if (latest && latest.senderId === 'system') {
        setSystemToast(latest.text);
        const timer = setTimeout(() => setSystemToast(null), 4000);
        prevMessagesCount.current = msgs.length;
        return () => clearTimeout(timer);
      }
      prevMessagesCount.current = msgs.length;
    }
  }, [room?.messages]);
  
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  if (!room) return <ActivityIndicator color="#fff" />;

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

    if (!isMyTurn || room.turnPhase !== 'discarding') {
      const logMsg2 = `[handleToggle] Early return because isMyTurn is ${isMyTurn} or turnPhase is ${room.turnPhase}`;
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
            <Text style={styles.summaryTitle}>{isGameOver ? 'GAME OVER' : 'ROUND OVER'}</Text>
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
                <Text style={styles.winnerTitle}>Winner: {playersList[0]?.name}!</Text>
                <TouchableOpacity style={styles.summaryBtn} onPress={onLeaveRoom}>
                  <Text style={styles.summaryBtnText}>Back to Home</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.summaryBtn} onPress={onNextRound}>
                <Text style={styles.summaryBtnText}>Start Round {(room.currentRound || 1) + 1}</Text>
              </TouchableOpacity>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderRoundSummary()}
        {renderChatModal()}
        {renderScoresModal()}
        {renderEditModal()}
        {systemToast && <View style={styles.systemToast}><Text style={styles.systemToastText}>{systemToast}</Text></View>}
        {errorMsg && <View style={styles.errorToast}><Text style={styles.errorToastText}>{errorMsg}</Text></View>}

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
            {width < 768 && (
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowScoresModal(true)}>
                <Text style={styles.headerIconBtnText}>Scores</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => { setNewName(room?.players?.[currentPlayerId]?.name || ''); setShowEdit(true); }}>
              <Text style={styles.headerIconBtnText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowChat(true)}>
              <Text style={styles.headerIconBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scoreboard on the top-right of the page (desktop only) */}
        {width >= 768 && (
          <View style={styles.pageScoreboard}>
            <Text style={styles.scoreboardTitle}>Scores</Text>
            <ScrollView style={styles.pageScoreboardScroll} showsVerticalScrollIndicator={true}>
              {turnOrder.map(id => {
                const p = players[id];
                if (!p) return null;
                return (
                  <View key={id} style={styles.scoreboardPlayerBox}>
                    <View style={styles.scoreboardRow}>
                      <Text style={[styles.scoreboardName, id === currentPlayerId && { color: '#fbbf24' }]} numberOfLines={1}>
                        {p.name} {(!room.hostId || (id !== room.hostId && id !== currentPlayerId)) ? `(${p.hand?.length || 0} cards)` : ''}
                      </Text>
                      <Text style={styles.scoreboardPoints}>{p.totalScore}</Text>
                    </View>
                    <View style={styles.scoreboardPillsRow}>
                      {(p.roundScores || []).map((sc, idx) => (
                        <View key={idx} style={styles.scoreboardRoundPill}>
                          <Text style={styles.scoreboardRoundPillText}>R{idx+1}: {sc}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

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
                          style={[styles.cardBack, (!isMyTurn || room.turnPhase !== 'picking') && styles.disabled]} 
                          onPress={() => onDrawCard('deck')} 
                          disabled={!isMyTurn || room.turnPhase !== 'picking'}
                          activeOpacity={0.7}
                        >
                          <View style={styles.cardPattern} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pileContainer} pointerEvents="box-none">
                        <Text style={styles.pileLabel}>{room.pendingDiscard && room.pendingDiscard.length > 0 ? "PREV DISCARD" : "DISCARD"}</Text>
                        {room.discardPile.length > 0 ? (
                          <TouchableOpacity 
                            style={styles.cardCluster}
                            onPress={(isMyTurn && room.turnPhase === 'picking') ? () => onDrawCard('discard') : undefined}
                            disabled={!isMyTurn || room.turnPhase !== 'picking'}
                            activeOpacity={0.7}
                          >
                            {room.discardPile.slice(-(room.lastDiscardedCount || 1)).map((card, idx) => (
                              <View key={card.id} style={{ marginLeft: idx === 0 ? 0 : -25 }} pointerEvents="none">
                                {renderCard(card, false)}
                              </View>
                            ))}
                          </TouchableOpacity>
                        ) : (
                          <View style={[styles.card, styles.emptyPile]} />
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

                    <Text style={styles.onTableTurnText}>
                      {(me && me.isOut) ? 'YOU ARE OUT' : (isMyTurn ? (room.turnPhase === 'discarding' ? 'Your turn: Discard!' : 'Your turn: Pick!') : `${players[currentTurnId] ? players[currentTurnId].name : ''}'s turn...`)}
                    </Text>
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
                  style={[styles.actionBtn, styles.discardBtn, selected.length === 0 && styles.disabled]}
                  onPress={handleDiscard}
                  disabled={selected.length === 0}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Discard {selected.length > 0 ? `(${selected.length})` : ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.leastBtn]}
                  onPress={onCallLeast}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Least!</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.myHandDockWrapper}>
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
      </View>
    </SafeAreaView>
  );
};

const createStyles = (width: number, height: number, n: number = 4, avatarSize: number = 40, feltColor: string = '#076324') => {
  const isSmall = width < 500;
  const isLandscape = width > height;

  const tableWidth = isLandscape
    ? Math.min(width * 0.85, 850 + n * 20)
    : Math.min(width - 24, 380 + n * 12);
  
  const csmW = Math.max(12, 25 - n);
  const csmH = Math.max(17, 35 - n * 1.5);
  const cardW = isSmall ? 48 : 60;
  const cardH = isSmall ? 70 : 86;

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
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      zIndex: 100,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoSmall: { 
      width: isSmall ? 100 : 160, 
      height: isSmall ? 40 : 55 
    },
    roundInfo: { color: '#facc15', fontSize: isSmall ? 13 : 16, fontWeight: '900', letterSpacing: 1 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerIconBtn: { 
      backgroundColor: 'rgba(51, 65, 85, 0.8)', 
      paddingHorizontal: isSmall ? 10 : 12, 
      paddingVertical: isSmall ? 6 : 8, 
      borderRadius: 8, 
      borderWidth: 1, 
      borderColor: 'rgba(255,255,255,0.1)' 
    },
    headerIconBtnText: { color: '#fff', fontSize: isSmall ? 12 : 13, fontWeight: 'bold' },
    leaveBtn: { backgroundColor: '#ef4444', paddingHorizontal: isSmall ? 12 : 16, paddingVertical: isSmall ? 6 : 8, borderRadius: 8 },
    leaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: isSmall ? 12 : 14 },

    /* Scoreboard */
    pageScoreboard: {
      position: 'absolute',
      right: 20,
      top: 90, 
      maxHeight: '70%',
      backgroundColor: 'rgba(0,0,0,0.75)',
      padding: 15,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.25)',
      width: 170, 
      zIndex: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
    },
    pageScoreboardScroll: {
      marginTop: 2,
    },
    scoreboardTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center', letterSpacing: 1 },
    scoreboardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    scoreboardName: { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1, marginRight: 8 },
    scoreboardPoints: { color: '#facc15', fontSize: 15, fontWeight: '900' },

    tableWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      paddingBottom: isSmall ? 40 : 60,
    },
    /* Mahogany wood rail */
    tableRailOuter: {
      borderRadius: 999,
      backgroundColor: '#3d1400',
      padding: isSmall ? 12 : 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.8,
      shadowRadius: 30,
      elevation: 25,
    },
    tableRailInner: {
      borderRadius: 999,
      backgroundColor: '#5a1a00',
      padding: isSmall ? 4 : 6,
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
      borderWidth: isSmall ? 10 : 15,
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
      gap: isSmall ? 12 : 25, 
      marginVertical: isSmall ? 6 : 10,
    },
    pileContainer: { alignItems: 'center' },
    pileLabel: { color: 'rgba(255,255,255,0.8)', fontSize: isSmall ? 9 : 10, fontWeight: '900', marginBottom: 6, letterSpacing: 1.5, textTransform: 'uppercase' },
    cardCluster: { flexDirection: 'row', alignItems: 'center' },
    card: {
      width: cardW,
      height: cardH,
      backgroundColor: '#fff',
      borderRadius: 6,
      padding: 4,
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
    cardRank: { fontSize: Math.max(12, cardW * 0.35), fontWeight: '900' },
    cardSuit: { fontSize: Math.max(16, cardW * 0.45), textAlign: 'center' },
    cardBottom: { alignItems: 'flex-end' },
    cardRankSmall: { fontSize: Math.max(9, cardW * 0.25), fontWeight: '900' },
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
      position: 'absolute', bottom: -8, right: -8,
      backgroundColor: '#c9a84c', width: 20, height: 20,
      borderRadius: 10, justifyContent: 'center', alignItems: 'center',
      borderWidth: 2, borderColor: '#fff',
    },
    cardCountText: { color: '#000', fontSize: 10, fontWeight: '900' },
    outOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: avatarSize/2, justifyContent: 'center', alignItems: 'center' },
    outOverlayText: { color: '#ef4444', fontSize: 10, fontWeight: '900' },

    opponentLabelBox: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.85)',
      paddingHorizontal: 8, 
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(201,168,76,0.5)',
      minWidth: 70,
    },
    opponentName: { color: '#fff', fontSize: 11, fontWeight: '900' },
    opponentCardCountText: { color: '#facc15', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
    
    opponentHand: { flexDirection: 'row', marginTop: 4 },
    cardBackSmall: { width: csmW, height: csmH, backgroundColor: '#1e3a8a', borderRadius: 4, borderWidth: 1, borderColor: '#93c5fd' },
    
    onTableTurnText: { color: '#facc15', fontSize: isSmall ? 16 : 24, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 8, marginTop: 8, textAlign: 'center', paddingHorizontal: 10 },
    
    /* Dedicated Bottom Player Dock */
    playerDockContainer: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
      zIndex: 1000,
    },
    dockActionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 12,
    },
    myHandDockWrapper: {
      width: '100%',
      maxWidth: 700,
      height: cardH + 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    myHandScroll: {
      alignItems: 'center',
      gap: isSmall ? 6 : 10,
      paddingHorizontal: 16,
    },
    myHandScrollView: {
      flexGrow: 0,
    },
    actionBtn: { paddingVertical: isSmall ? 10 : 12, paddingHorizontal: isSmall ? 20 : 30, borderRadius: 25, alignItems: 'center', minWidth: isSmall ? 110 : 140, elevation: 5 },
    discardBtn: { backgroundColor: '#2563eb' },
    leastBtn: { backgroundColor: '#16a34a' },
    disabled: { opacity: 0.5 },
    actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: isSmall ? 15 : 18, letterSpacing: 1 },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
    modalBox: { backgroundColor: '#0f172a', width: '100%', maxWidth: 400, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#334155' },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 12 },
    modalTitleText: { color: '#fff', fontSize: 20, fontWeight: '900' },
    scoreModalTable: { maxHeight: 300, marginBottom: 20 },
    scoreModalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    scoreModalName: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10 },
    scoreModalPoints: { color: '#facc15', fontSize: 16, fontWeight: '900' },
    modalCloseActionBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    modalCloseActionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    summaryContainer: { backgroundColor: '#0f172a', width: '100%', maxWidth: 450, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    summaryTitle: { color: '#fff', fontSize: isSmall ? 22 : 28, fontWeight: '900', marginBottom: 16 },
    callerText: { color: '#facc15', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    scoreTable: { width: '100%', marginBottom: 25 },
    scoreRowHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10, marginBottom: 10 },
    scoreHeaderCell: { color: '#94a3b8', flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
    scoreRow: { flexDirection: 'row', paddingVertical: 8 },
    scoreCell: { color: '#fff', flex: 1, textAlign: 'center', fontSize: 16 },
    winnerSection: { alignItems: 'center', width: '100%' },
    winnerTitle: { fontSize: 24, color: '#22c55e', fontWeight: '900', marginBottom: 20 },
    summaryBtn: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 30, width: '100%', alignItems: 'center' },
    summaryBtnText: { color: '#fff', fontWeight: '900', fontSize: 18 },
    
    chatContainer: { width: '100%', maxWidth: 450, height: '70%', backgroundColor: '#0f172a', borderRadius: 24, borderWidth: 1, borderColor: '#334155', padding: 20 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 12 },
    chatTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
    closeBtn: { color: '#94a3b8', fontSize: 24 },
    msgBubble: { padding: 12, borderRadius: 16, marginBottom: 10, maxWidth: '85%' },
    myMsg: { backgroundColor: '#2563eb', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    theirMsg: { backgroundColor: '#1e293b', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    msgSender: { color: '#94a3b8', fontSize: 11, marginBottom: 4, fontWeight: 'bold' },
    msgText: { color: '#fff', fontSize: 15 },
    chatInputRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    chatEmojiBar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 4, paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#1e293b', borderRadius: 16, justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
    chatEmojiBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12 },
    chatEmojiText: { fontSize: 20 },
    chatInput: { flex: 1, backgroundColor: '#1e293b', color: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25, fontSize: 15 },
    sendBtn: { backgroundColor: '#2563eb', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 25 },
    sendBtnText: { color: '#fff', fontWeight: '900' },
    errorToast: { position: 'absolute', top: 80, alignSelf: 'center', backgroundColor: '#e11d48', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, zIndex: 1000, borderWidth: 2, borderColor: '#fff' },
    errorToastText: { color: '#fff', fontWeight: '900', fontSize: 14, textAlign: 'center' },
    sysMsg: { backgroundColor: 'rgba(14, 165, 233, 0.2)', alignSelf: 'center', maxWidth: '95%', borderWidth: 1, borderColor: '#0ea5e9', paddingVertical: 8, paddingHorizontal: 16 },
    sysMsgText: { color: '#38bdf8', fontSize: 13, textAlign: 'center', fontWeight: 'bold' },
    systemToast: { position: 'absolute', top: 90, alignSelf: 'center', backgroundColor: 'rgba(15, 23, 42, 0.95)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, zIndex: 1000, borderWidth: 1.5, borderColor: '#38bdf8', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8 },
    systemToastText: { color: '#38bdf8', fontWeight: '900', fontSize: 15, textAlign: 'center', letterSpacing: 0.5 },
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
      marginBottom: 8,
      width: '100%',
    },
    sortBtn: {
      backgroundColor: '#f59e0b',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#fef3c7',
      elevation: 4,
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
    },
    sortBtnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
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
      overflow: 'hidden',
    },
    summaryCardsScroll: {
      maxHeight: 450,
      width: '100%',
      marginBottom: 20,
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
  });
};
