import { Card, Suit, Rank, GameRoom, Player } from './types';

const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const getCardValue = (rank: Rank): number => {
  if (rank === 'A') return 1;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank, 10);
};

export const getSequenceValue = (rank: Rank): number => {
  const rankMap: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13
  };
  return rankMap[rank];
};

export const SUIT_ORDER: Record<Suit, number> = {
  'Clubs': 1,
  'Diamonds': 2,
  'Hearts': 3,
  'Spades': 4,
};

export const sortHand = (hand: Card[]): Card[] => {
  if (!hand || hand.length === 0) return [];
  return [...hand].sort((a, b) => {
    const valA = getSequenceValue(a.rank);
    const valB = getSequenceValue(b.rank);
    if (valA !== valB) {
      return valA - valB;
    }
    const suitA = SUIT_ORDER[a.suit] || 0;
    const suitB = SUIT_ORDER[b.suit] || 0;
    return suitA - suitB;
  });
};


export const getNextTurnIndex = (room: GameRoom, currentIndex: number): number => {
  // Clockwise: move to the next index in the turnOrder array
  let nextIndex = (currentIndex + 1) % room.turnOrder.length;
  for (let i = 0; i < room.turnOrder.length; i++) {
    const playerId = room.turnOrder[nextIndex];
    if (!room.players[playerId].isOut) {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % room.turnOrder.length;
  }
  return currentIndex;
};

export const isValidSetOrRun = (cards: Card[]): boolean => {
  if (cards.length === 0) return false;
  if (cards.length === 1) return true;

  // Check for Set (same rank)
  const firstRank = cards[0].rank;
  if (cards.every(c => c.rank === firstRank)) return true;

  // Check for Run (3+ cards, same suit, sequential)
  if (cards.length >= 3) {
    const suit = cards[0].suit;
    if (cards.every(c => c.suit === suit)) {
      const values = cards.map(c => getSequenceValue(c.rank)).sort((a, b) => a - b);
      for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] !== values[i] + 1) return false;
      }
      return true;
    }
  }

  return false;
};

export const createDeck = (numDecks: number = 1): Card[] => {
  const deck: Card[] = [];
  for (let i = 0; i < numDecks; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `${suit}-${rank}-${i}`,
          suit,
          rank,
          value: getCardValue(rank),
        });
      }
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHandScore = (hand: Card[], jokerCard?: Card | null): number => {
  return hand.reduce((total, card) => {
    // Rule: If card matches Joker rank, it counts as zero
    if (jokerCard && card.rank === jokerCard.rank) return total;
    return total + card.value;
  }, 0);
};

export const logTurnDiagnostic = (
  tag: 'TURN_START' | 'ACTIVE_PLAYER' | 'PICKUP_AVAILABLE' | 'PICKUP_ACTION' | 'CARD_DRAWN' | 'DISCARD_AVAILABLE' | 'DISCARD_ACTION' | 'TURN_COMPLETE' | 'NEXT_PLAYER',
  room: GameRoom,
  extra: { playerId?: string; source?: string; reason?: string } = {}
) => {
  if (!room) return;
  const activePlayerId = room.turnOrder ? room.turnOrder[room.turnIndex] : 'unknown';
  const activePlayer = room.players ? room.players[activePlayerId] : null;
  const pName = activePlayer ? activePlayer.name : activePlayerId;
  const pId = extra.playerId || activePlayerId;
  
  const hasDiscarded = room.turnPhase === 'picking' || (room.pendingDiscard && room.pendingDiscard.length > 0);
  const hasPickedUp = room.turnPhase === 'discarding' && !hasDiscarded;

  console.log(
    `[TURN_DIAGNOSTIC] [${tag}] timestamp=${Date.now()} | round=${room.currentRound || 1} | turnIndex=${room.turnIndex} | phase=${room.turnPhase} | activePlayer=${activePlayerId} (${pName}) | targetPlayer=${pId} | hasDiscarded=${hasDiscarded} | hasPickedUp=${hasPickedUp}${extra.source ? ` | source=${extra.source}` : ''}${extra.reason ? ` | reason=${extra.reason}` : ''}`
  );
};

export const startRound = (room: GameRoom): GameRoom => {
  const isRematch = room.status === 'game-over';
  const numDecks = room.turnOrder.length > 5 ? 2 : 1;
  let deck = shuffleDeck(createDeck(numDecks));
  const newPlayers = { ...room.players };
  
  const jokerCard = deck.splice(0, 1)[0]; // Pick Joker FIRST
  
  // Deal 7 cards to each player
  room.turnOrder.forEach(playerId => {
    const p = newPlayers[playerId];
    if (isRematch) {
      const hand = sortHand(deck.splice(0, 7));
      newPlayers[playerId] = {
        ...p,
        hand,
        roundScore: calculateHandScore(hand, jokerCard),
        totalScore: 0,
        roundScores: [],
        hasCalledLeast: false,
        isOut: false,
      };
      return;
    }

    if (p.isOut || p.totalScore >= 200) {
      newPlayers[playerId] = {
        ...p,
        hand: [],
        roundScore: 0,
        hasCalledLeast: false,
        isOut: true,
      };
      return;
    }
    const hand = sortHand(deck.splice(0, 7));
    newPlayers[playerId] = {
      ...p,
      hand,
      roundScore: calculateHandScore(hand, jokerCard),
      hasCalledLeast: false,
    };
  });

  const discardPile = deck.splice(0, 1); 
  const firstTurnIdx = findFirstPlayerIndex(room);
  const now = Date.now();

  const readyRoom: GameRoom = {
    ...room,
    deck,
    discardPile,
    jokerCard,
    players: newPlayers,
    currentRound: isRematch ? 1 : (room.currentRound || 1),
    status: 'playing',
    finishedAt: undefined,
    isExpired: false,
    turnIndex: firstTurnIdx,
    turnPhase: 'discarding',
    lastDiscardedCount: 1,
    roundWinnerId: null,
    winnerId: null,
    turnStartTime: now,
    updatedAt: now,
    version: (room.version || 0) + 1,
  };

  logTurnDiagnostic('TURN_START', readyRoom, { reason: 'round_started' });
  logTurnDiagnostic('ACTIVE_PLAYER', readyRoom);
  logTurnDiagnostic('DISCARD_AVAILABLE', readyRoom);

  return readyRoom;
};


export const findFirstPlayerIndex = (room: GameRoom): number => {
  const hostIdx = room.turnOrder.indexOf(room.hostId);
  if (hostIdx === -1) return 0;

  const shift = room.currentRound || 1;
  const targetIdx = (hostIdx + shift) % room.turnOrder.length;

  for (let i = 0; i < room.turnOrder.length; i++) {
    const idx = (targetIdx + i) % room.turnOrder.length;
    const playerId = room.turnOrder[idx];
    if (room.players[playerId] && !room.players[playerId].isOut) {
      return idx;
    }
  }
  return hostIdx;
};

export const playTurn = (
  room: GameRoom,
  playerId: string,
  discardedCardIds: string[]
): GameRoom => {
  if (room.turnOrder[room.turnIndex] !== playerId) return room;

  const player = room.players[playerId];
  
  // Capture top discard rank BEFORE current discard
  const topDiscardRank = room.discardPile.length > 0 
    ? room.discardPile[room.discardPile.length - 1].rank 
    : null;

  // Validate discarded cards (Set or Run)
  const discardedCards = player.hand.filter(c => discardedCardIds.includes(c.id));
  if (!isValidSetOrRun(discardedCards)) return room;

  // Remove from hand
  const newHand = sortHand(player.hand.filter(c => !discardedCardIds.includes(c.id)));
  const newDeck = [...room.deck];
  const pendingDiscard = [...discardedCards];
  const newDiscardPile = [...room.discardPile];

  const newPlayers = { ...room.players };
  newPlayers[playerId] = {
    ...player,
    hand: newHand,
    roundScore: calculateHandScore(newHand, room.jokerCard)
  };

  logTurnDiagnostic('DISCARD_ACTION', room, { playerId });

  // Rule: If player drops same card rank as on open deck, skip picking
  const isMatch = discardedCards.some(c => c.rank === topDiscardRank);
  const now = Date.now();

  if (isMatch) {
    // Commit discard immediately and end turn
    newDiscardPile.push(...pendingDiscard);
    const nextIdx = getNextTurnIndex(room, room.turnIndex);

    const resultRoom: GameRoom = {
      ...room,
      deck: newDeck,
      discardPile: newDiscardPile,
      players: newPlayers,
      pendingDiscard: [],
      turnPhase: 'discarding',
      turnIndex: nextIdx,
      lastDiscardedCount: discardedCardIds.length,
      turnStartTime: now,
      updatedAt: now,
      version: (room.version || 0) + 1,
    };

    logTurnDiagnostic('TURN_COMPLETE', resultRoom, { playerId, reason: 'discard_match_skip_pickup' });
    logTurnDiagnostic('NEXT_PLAYER', resultRoom);
    logTurnDiagnostic('ACTIVE_PLAYER', resultRoom);
    logTurnDiagnostic('DISCARD_AVAILABLE', resultRoom);

    return resultRoom;
  }

  const resultRoom: GameRoom = {
    ...room,
    deck: newDeck,
    players: newPlayers,
    pendingDiscard,
    turnPhase: 'picking',
    lastDiscardedCount: discardedCardIds.length,
    turnStartTime: now,
    updatedAt: now,
    version: (room.version || 0) + 1,
  };

  logTurnDiagnostic('PICKUP_AVAILABLE', resultRoom, { playerId });

  return resultRoom;
};

export const drawCard = (
  room: GameRoom,
  playerId: string,
  source: 'deck' | 'discard'
): GameRoom => {
  if (room.turnOrder[room.turnIndex] !== playerId || room.turnPhase !== 'picking') return room;

  logTurnDiagnostic('PICKUP_ACTION', room, { playerId, source });

  const player = room.players[playerId];
  let newDeck = [...room.deck];
  let newDiscardPile = [...room.discardPile];
  let pickedCard: Card | undefined;
  let reshuffled = false;

  if (source === 'deck') {
    if (newDeck.length === 0) {
      if (newDiscardPile.length <= 1) {
        return room;
      }
      const topCard = newDiscardPile[newDiscardPile.length - 1];
      const cardsToReshuffle = newDiscardPile.slice(0, newDiscardPile.length - 1);
      newDeck = shuffleDeck(cardsToReshuffle);
      newDiscardPile = [topCard];
      reshuffled = true;
    }
    pickedCard = newDeck.pop();
  } else {
    pickedCard = newDiscardPile.pop();
  }

  if (!pickedCard) return room;

  let newMessages = room.messages;
  if (reshuffled) {
    const msgArray = room.messages 
      ? (Array.isArray(room.messages) ? [...room.messages] : Object.values(room.messages)) 
      : [];
    msgArray.push({
      id: 'sys_reshuffle_' + Date.now(),
      senderId: 'system',
      senderName: 'System 📢',
      text: '🔄 Deck was empty! The discard pile has been reshuffled into a new deck.',
      timestamp: Date.now(),
    });
    newMessages = msgArray as any;
  }

  const lastDiscardedRank = newDiscardPile.length > 0 ? newDiscardPile[newDiscardPile.length - 1].rank : undefined;
  const now = Date.now();
  const nextIdx = getNextTurnIndex(room, room.turnIndex);

  if (source === 'deck' && pickedCard.rank === lastDiscardedRank) {
    newDiscardPile.push(pickedCard);
    newDiscardPile.push(...(room.pendingDiscard || []));

    const result: GameRoom = {
      ...room,
      deck: newDeck,
      discardPile: newDiscardPile,
      pendingDiscard: [],
      turnIndex: nextIdx,
      turnPhase: 'discarding',
      turnStartTime: now,
      updatedAt: now,
      version: (room.version || 0) + 1,
    };
    if (newMessages !== undefined) {
      result.messages = newMessages;
    }

    logTurnDiagnostic('CARD_DRAWN', result, { playerId, source, reason: 'immediate_drop_match' });
    logTurnDiagnostic('TURN_COMPLETE', result, { playerId, reason: 'pickup_immediate_drop' });
    logTurnDiagnostic('NEXT_PLAYER', result);
    logTurnDiagnostic('ACTIVE_PLAYER', result);
    logTurnDiagnostic('DISCARD_AVAILABLE', result);

    return result;
  }

  const newHand = sortHand([...player.hand, pickedCard]);

  const newPlayers = { ...room.players };
  newPlayers[playerId] = {
    ...player,
    hand: newHand,
    roundScore: calculateHandScore(newHand, room.jokerCard)
  };

  newDiscardPile.push(...(room.pendingDiscard || []));

  const result: GameRoom = {
    ...room,
    deck: newDeck,
    discardPile: newDiscardPile,
    players: newPlayers,
    pendingDiscard: [],
    turnIndex: nextIdx,
    turnPhase: 'discarding',
    turnStartTime: now,
    updatedAt: now,
    version: (room.version || 0) + 1,
  };
  if (newMessages !== undefined) {
    result.messages = newMessages;
  }

  logTurnDiagnostic('CARD_DRAWN', result, { playerId, source });
  logTurnDiagnostic('TURN_COMPLETE', result, { playerId, reason: 'pickup_completed' });
  logTurnDiagnostic('NEXT_PLAYER', result);
  logTurnDiagnostic('ACTIVE_PLAYER', result);
  logTurnDiagnostic('DISCARD_AVAILABLE', result);

  return result;
};

export const handleTurnTimeout = (room: GameRoom, playerId: string): GameRoom => {
  if (!room || room.status !== 'playing') return room;
  const currentTurnId = room.turnOrder[room.turnIndex];
  if (currentTurnId !== playerId) return room;

  const player = room.players[playerId];
  if (!player || player.isOut || !player.hand || player.hand.length === 0) return room;

  let state = { ...room };
  const now = Date.now();

  if (state.turnPhase === 'discarding') {
    const cardToDiscard = player.hand[0];
    logTurnDiagnostic('DISCARD_ACTION', state, { playerId, reason: 'timeout_autodiscard' });
    state = playTurn(state, playerId, [cardToDiscard.id]);
    return {
      ...state,
      turnStartTime: now,
      updatedAt: now,
      version: (state.version || 0) + 1,
    };
  } else if (state.turnPhase === 'picking') {
    logTurnDiagnostic('PICKUP_ACTION', state, { playerId, reason: 'timeout_autopickup' });
    state = drawCard(state, playerId, 'deck');
    return {
      ...state,
      turnStartTime: now,
      updatedAt: now,
      version: (state.version || 0) + 1,
    };
  }

  return {
    ...state,
    turnStartTime: now,
    updatedAt: now,
    version: (state.version || 0) + 1,
  };
};

export const callLeast = (room: GameRoom, callerId: string): GameRoom => {
  const newPlayers = { ...room.players };
  let lowestScore = Infinity;
  let lowestPlayerId = '';
  
  Object.values(newPlayers).forEach(p => {
    if (p.isOut || p.totalScore >= 200) return;
    if (p.roundScore < lowestScore) {
      lowestScore = p.roundScore;
      lowestPlayerId = p.id;
    } else if (p.roundScore === lowestScore) {
      if (lowestPlayerId === callerId) lowestPlayerId = p.id;
    }
  });

  const callerWon = lowestPlayerId === callerId;
  
  Object.values(newPlayers).forEach(p => {
    if (p.isOut || p.totalScore >= 200) {
      p.isOut = true;
      p.roundScore = 0;
      p.roundScores = [...(p.roundScores || []), 0];
      return;
    }
    const handScore = p.roundScore;
    if (p.id === callerId) {
      p.hasCalledLeast = true;
      if (!callerWon) {
        p.roundScore = 80;
      } else {
        p.roundScore = 0;
      }
    } else {
      p.roundScore = Math.max(0, handScore - lowestScore);
    }
    p.totalScore += p.roundScore;
    p.roundScores = [...(p.roundScores || []), p.roundScore];
    if (p.totalScore >= 200) {
      p.isOut = true;
    }
  });

  const activePlayers = Object.values(newPlayers).filter(p => !p.isOut);
  const nextRound = room.currentRound + 1;
  const isGameOver = nextRound > room.maxRounds || activePlayers.length <= 1;

  let winnerId = null;
  if (isGameOver) {
    let bestTotal = Infinity;
    activePlayers.forEach(p => {
      if (p.totalScore < bestTotal) {
        bestTotal = p.totalScore;
        winnerId = p.id;
      }
    });
    if (!winnerId && Object.keys(newPlayers).length > 0) {
      winnerId = Object.values(newPlayers).sort((a, b) => a.totalScore - b.totalScore)[0].id;
    }
  }

  const now = Date.now();
  const endRoom: GameRoom = {
    ...room,
    players: newPlayers,
    status: isGameOver ? 'game-over' : 'round-end',
    finishedAt: isGameOver ? (room.finishedAt || now) : room.finishedAt,
    gameOverAt: isGameOver ? (room.gameOverAt || now) : room.gameOverAt,
    roundWinnerId: callerWon ? callerId : lowestPlayerId,
    winnerId,
    updatedAt: now,
    version: (room.version || 0) + 1,
  };

  logTurnDiagnostic('TURN_COMPLETE', endRoom, { playerId: callerId, reason: 'called_least' });

  return endRoom;
};

export const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const WAITING_ROOM_TTL_MS = 15 * 60 * 1000;
export const POST_GAME_TTL_MS = 5 * 60 * 1000;
export const EMPTY_ROOM_TTL_MS = 5 * 60 * 1000;

export const checkRoomExpiration = (room: GameRoom): { isExpired: boolean; expiredReason?: string } => {
  if (!room) return { isExpired: false };
  if (room.status === 'expired' || room.isExpired) {
    return { isExpired: true, expiredReason: 'This private room has expired.' };
  }

  const now = Date.now();

  if (room.status === 'lobby') {
    const createdAt = room.createdAt || now;
    if (now - createdAt >= WAITING_ROOM_TTL_MS) {
      return { isExpired: true, expiredReason: 'Waiting room expired after 15 minutes.' };
    }

    const humanPlayers = Object.values(room.players || {}).filter(p => !p.isBot);
    if (humanPlayers.length === 0) {
      const emptyAt = room.emptyAt || now;
      if (now - emptyAt >= EMPTY_ROOM_TTL_MS) {
        return { isExpired: true, expiredReason: 'Room expired due to 5 minutes of inactivity.' };
      }
    }
  }

  if (room.status === 'playing' || room.status === 'round-end') {
    return { isExpired: false };
  }

  if (room.status === 'game-over') {
    const gameOverAt = room.gameOverAt || room.finishedAt || now;
    if (now - gameOverAt >= POST_GAME_TTL_MS) {
      return { isExpired: true, expiredReason: 'Post-game room expired after 5 minutes.' };
    }
  }

  return { isExpired: false };
};

export const botPlayTurn = (room: GameRoom, botId: string): GameRoom => {
  let currentState = { ...room };
  const bot = currentState.players[botId];
  if (!bot || !bot.hand || bot.hand.length === 0) return room;

  // 1. Perform Discard Phase
  if (currentState.turnPhase === 'discarding') {
    if (bot.roundScore <= 10) {
      return callLeast(currentState, botId);
    }

    let bestMove = { ids: [bot.hand[0].id], value: bot.hand[0].value };

    const rankGroups: Record<string, string[]> = {};
    bot.hand.forEach(c => {
      if (!rankGroups[c.rank]) rankGroups[c.rank] = [];
      rankGroups[c.rank].push(c.id);
    });
    Object.values(rankGroups).forEach(ids => {
      const sum = ids.reduce((acc, id) => {
        const card = bot.hand.find(c => c.id === id);
        return acc + (card ? card.value : 0);
      }, 0);
      if (sum > bestMove.value) bestMove = { ids, value: sum };
    });

    const suitGroups: Record<string, Card[]> = {};
    bot.hand.forEach(c => {
      if (!suitGroups[c.suit]) suitGroups[c.suit] = [];
      suitGroups[c.suit].push(c);
    });
    Object.values(suitGroups).forEach(suitCards => {
      const sorted = [...suitCards].sort((a, b) => getSequenceValue(a.rank) - getSequenceValue(b.rank));
      let currentRun: Card[] = [];
      for (let i = 0; i < sorted.length; i++) {
        const lastVal = currentRun.length > 0 ? getSequenceValue(currentRun[currentRun.length - 1].rank) : -1;
        const currentVal = getSequenceValue(sorted[i].rank);
        if (currentRun.length === 0 || currentVal === lastVal + 1) {
          currentRun.push(sorted[i]);
        } else if (currentVal !== lastVal) {
          if (currentRun.length >= 3) {
            const sum = currentRun.reduce((acc, c) => acc + c.value, 0);
            if (sum > bestMove.value) bestMove = { ids: currentRun.map(c => c.id), value: sum };
          }
          currentRun = [sorted[i]];
        }
      }
      if (currentRun.length >= 3) {
        const sum = currentRun.reduce((acc, c) => acc + c.value, 0);
        if (sum > bestMove.value) bestMove = { ids: currentRun.map(c => c.id), value: sum };
      }
    });

    currentState = playTurn(currentState, botId, bestMove.ids);
  }

  // 2. Perform Picking Phase
  if (currentState.turnPhase === 'picking') {
    const topDiscard = currentState.discardPile[currentState.discardPile.length - 1];
    if (topDiscard && topDiscard.value <= 2) {
      currentState = drawCard(currentState, botId, 'discard');
    } else {
      currentState = drawCard(currentState, botId, 'deck');
    }
  }

  return currentState;
};

