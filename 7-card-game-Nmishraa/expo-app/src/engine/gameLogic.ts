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

export const startRound = (room: GameRoom): GameRoom => {
  const numDecks = room.turnOrder.length > 5 ? 2 : 1;
  let deck = shuffleDeck(createDeck(numDecks));
  const newPlayers = { ...room.players };
  
  const jokerCard = deck.splice(0, 1)[0]; // Pick Joker FIRST
  
  // Deal 7 cards to each player
  room.turnOrder.forEach(playerId => {
    const p = newPlayers[playerId];
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
    const hand = deck.splice(0, 7);
    newPlayers[playerId] = {
      ...p,
      hand,
      roundScore: calculateHandScore(hand, jokerCard),
      hasCalledLeast: false,
    };
  });

  const discardPile = deck.splice(0, 1); 
  // (Already picked above)

  return {
    ...room,
    deck,
    discardPile,
    jokerCard,
    players: newPlayers,
    status: 'playing',
    turnIndex: findFirstPlayerIndex(room),
    turnPhase: 'discarding',
    lastDiscardedCount: 1,
    roundWinnerId: null,
  };
};

export const findFirstPlayerIndex = (room: GameRoom): number => {
  const hostIdx = room.turnOrder.indexOf(room.hostId);
  if (hostIdx === -1) return 0;

  // Round 1 -> 1 seat to the right of host
  // Round 2 -> 2 seats to the right of host
  // Round N -> N seats to the right of host
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
  const newHand = player.hand.filter(c => !discardedCardIds.includes(c.id));
  const newDeck = [...room.deck];
  const pendingDiscard = [...discardedCards];
  const newDiscardPile = [...room.discardPile];

  const newPlayers = { ...room.players };
  newPlayers[playerId] = {
    ...player,
    hand: newHand,
    roundScore: calculateHandScore(newHand, room.jokerCard)
  };

  // Rule: If player drops same card rank as on open deck, skip picking
  const isMatch = discardedCards.some(c => c.rank === topDiscardRank);

  if (isMatch) {
    // Commit discard immediately and end turn
    newDiscardPile.push(...pendingDiscard);
    return {
      ...room,
      deck: newDeck,
      discardPile: newDiscardPile,
      players: newPlayers,
      pendingDiscard: [],
      turnPhase: 'discarding',
      turnIndex: getNextTurnIndex(room, room.turnIndex),
      lastDiscardedCount: discardedCardIds.length,
    };
  }

  return {
    ...room,
    deck: newDeck,
    players: newPlayers,
    pendingDiscard,
    turnPhase: 'picking',
    lastDiscardedCount: discardedCardIds.length,
  };
};

export const drawCard = (
  room: GameRoom,
  playerId: string,
  source: 'deck' | 'discard'
): GameRoom => {
  if (room.turnOrder[room.turnIndex] !== playerId || room.turnPhase !== 'picking') return room;

  const player = room.players[playerId];
  let newDeck = [...room.deck];
  let newDiscardPile = [...room.discardPile];
  let pickedCard: Card | undefined;
  let reshuffled = false;

  if (source === 'deck') {
    if (newDeck.length === 0) {
      // Keep the top visible card on the discard pile; shuffle the rest into a new deck
      if (newDiscardPile.length <= 1) {
        // Only 0 or 1 card in discard pile — nothing to reshuffle into a deck
        return room;
      }
      const topCard = newDiscardPile[newDiscardPile.length - 1]; // preserve top visible card
      const cardsToReshuffle = newDiscardPile.slice(0, newDiscardPile.length - 1);
      newDeck = shuffleDeck(cardsToReshuffle);
      newDiscardPile = [topCard]; // only the top card remains on the open pile
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

  // Immediate Drop Rule: 
  // If the picked card rank matches the rank of cards just discarded, it goes straight to discard.
  // Use newDiscardPile here so the rank check works correctly even after a reshuffle
  const lastDiscardedRank = newDiscardPile.length > 0 ? newDiscardPile[newDiscardPile.length - 1].rank : undefined;
  
  if (source === 'deck' && pickedCard.rank === lastDiscardedRank) {
    // It's a match! Drop it immediately.
    newDiscardPile.push(pickedCard);
    // After picking, the cards you discarded earlier this turn finally go on the pile
    newDiscardPile.push(...(room.pendingDiscard || []));

    const result: GameRoom = {
      ...room,
      deck: newDeck,
      discardPile: newDiscardPile,
      pendingDiscard: [],
      turnIndex: getNextTurnIndex(room, room.turnIndex),
      turnPhase: 'discarding',
    };
    if (newMessages !== undefined) {
      result.messages = newMessages;
    }
    return result;
  }

  const newHand = [...player.hand, pickedCard];
  const newPlayers = { ...room.players };
  newPlayers[playerId] = {
    ...player,
    hand: newHand,
    roundScore: calculateHandScore(newHand, room.jokerCard)
  };

  // Turn ends: place discarded cards on top of the pile
  newDiscardPile.push(...(room.pendingDiscard || []));

  const result: GameRoom = {
    ...room,
    deck: newDeck,
    discardPile: newDiscardPile,
    players: newPlayers,
    pendingDiscard: [],
    turnIndex: getNextTurnIndex(room, room.turnIndex),
    turnPhase: 'discarding',
  };
  if (newMessages !== undefined) {
    result.messages = newMessages;
  }
  return result;
};

export const callLeast = (room: GameRoom, callerId: string): GameRoom => {
  const newPlayers = { ...room.players };
  let lowestScore = Infinity;
  let lowestPlayerId = '';
  
  Object.values(newPlayers).forEach(p => {
    if (p.isOut || p.totalScore >= 200) return; // Do not consider eliminated players
    if (p.roundScore < lowestScore) {
      lowestScore = p.roundScore;
      lowestPlayerId = p.id;
    } else if (p.roundScore === lowestScore) {
      // Tie breaker logic: caller loses ties, or another person ties
      // If someone else ties the caller, the caller is not strictly "the lowest"
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
        p.roundScore = 80; // Penalty
      } else {
        p.roundScore = 0; // Caller wins, 0 points
      }
    } else {
      // Everyone else gets their score minus the winner's score
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
    // Winner is the person with the lowest score among those NOT out
    // If everyone is out except one, that one wins.
    activePlayers.forEach(p => {
      if (p.totalScore < bestTotal) {
        bestTotal = p.totalScore;
        winnerId = p.id;
      }
    });
    // Fallback if everyone is somehow out
    if (!winnerId && Object.keys(newPlayers).length > 0) {
      winnerId = Object.values(newPlayers).sort((a, b) => a.totalScore - b.totalScore)[0].id;
    }
  }

  return {
    ...room,
    players: newPlayers,
    status: isGameOver ? 'game-over' : 'round-end',
    roundWinnerId: callerWon ? callerId : lowestPlayerId,
    winnerId,
  };
};

export const botPlayTurn = (room: GameRoom, botId: string): GameRoom => {
  let currentState = { ...room };
  const bot = currentState.players[botId];
  if (!bot || !bot.hand || bot.hand.length === 0) return room;

  // 1. Perform Discard Phase
  if (currentState.turnPhase === 'discarding') {
    // Call least if score is low enough
    if (bot.roundScore <= 10) {
      return callLeast(currentState, botId);
    }

    // Find best combination to discard (highest total value)
    let bestMove = { ids: [bot.hand[0].id], value: bot.hand[0].value };

    // Check for sets (same rank)
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

    // Check for runs (same suit, sequential)
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

  // 2. Perform Picking Phase (runs immediately after discard or if already in picking)
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
