"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botPlayTurn = exports.checkRoomExpiration = exports.EMPTY_ROOM_TTL_MS = exports.POST_GAME_TTL_MS = exports.WAITING_ROOM_TTL_MS = exports.formatCountdown = exports.callLeast = exports.handleTurnTimeout = exports.drawCard = exports.playTurn = exports.findFirstPlayerIndex = exports.startRound = exports.logTurnDiagnostic = exports.calculateHandScore = exports.shuffleDeck = exports.createDeck = exports.isValidSetOrRun = exports.getNextTurnIndex = exports.sortHand = exports.SUIT_ORDER = exports.getSequenceValue = exports.getCardValue = void 0;
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const getCardValue = (rank) => {
    if (rank === 'A')
        return 1;
    if (['J', 'Q', 'K'].includes(rank))
        return 10;
    return parseInt(rank, 10);
};
exports.getCardValue = getCardValue;
const getSequenceValue = (rank) => {
    const rankMap = {
        'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'J': 11, 'Q': 12, 'K': 13
    };
    return rankMap[rank];
};
exports.getSequenceValue = getSequenceValue;
exports.SUIT_ORDER = {
    'Clubs': 1,
    'Diamonds': 2,
    'Hearts': 3,
    'Spades': 4,
};
const sortHand = (hand) => {
    if (!hand || hand.length === 0)
        return [];
    return [...hand].sort((a, b) => {
        const valA = (0, exports.getSequenceValue)(a.rank);
        const valB = (0, exports.getSequenceValue)(b.rank);
        if (valA !== valB) {
            return valA - valB;
        }
        const suitA = exports.SUIT_ORDER[a.suit] || 0;
        const suitB = exports.SUIT_ORDER[b.suit] || 0;
        return suitA - suitB;
    });
};
exports.sortHand = sortHand;
const getNextTurnIndex = (room, currentIndex) => {
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
exports.getNextTurnIndex = getNextTurnIndex;
const isValidSetOrRun = (cards) => {
    if (cards.length === 0)
        return false;
    if (cards.length === 1)
        return true;
    // Check for Set (same rank)
    const firstRank = cards[0].rank;
    if (cards.every(c => c.rank === firstRank))
        return true;
    // Check for Run (3+ cards, same suit, sequential)
    if (cards.length >= 3) {
        const suit = cards[0].suit;
        if (cards.every(c => c.suit === suit)) {
            const values = cards.map(c => (0, exports.getSequenceValue)(c.rank)).sort((a, b) => a - b);
            for (let i = 0; i < values.length - 1; i++) {
                if (values[i + 1] !== values[i] + 1)
                    return false;
            }
            return true;
        }
    }
    return false;
};
exports.isValidSetOrRun = isValidSetOrRun;
const createDeck = (numDecks = 1) => {
    const deck = [];
    for (let i = 0; i < numDecks; i++) {
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                deck.push({
                    id: `${suit}-${rank}-${i}`,
                    suit,
                    rank,
                    value: (0, exports.getCardValue)(rank),
                });
            }
        }
    }
    return deck;
};
exports.createDeck = createDeck;
const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
exports.shuffleDeck = shuffleDeck;
const calculateHandScore = (hand, jokerCard) => {
    return hand.reduce((total, card) => {
        // Rule: If card matches Joker rank, it counts as zero
        if (jokerCard && card.rank === jokerCard.rank)
            return total;
        return total + card.value;
    }, 0);
};
exports.calculateHandScore = calculateHandScore;
const logTurnDiagnostic = (tag, room, extra = {}) => {
    if (!room)
        return;
    const activePlayerId = room.turnOrder ? room.turnOrder[room.turnIndex] : 'unknown';
    const activePlayer = room.players ? room.players[activePlayerId] : null;
    const pName = activePlayer ? activePlayer.name : activePlayerId;
    const pId = extra.playerId || activePlayerId;
    const hasDiscarded = room.turnPhase === 'picking' || (room.pendingDiscard && room.pendingDiscard.length > 0);
    const hasPickedUp = room.turnPhase === 'discarding' && !hasDiscarded;
    console.log(`[TURN_DIAGNOSTIC] [${tag}] timestamp=${Date.now()} | round=${room.currentRound || 1} | turnIndex=${room.turnIndex} | phase=${room.turnPhase} | activePlayer=${activePlayerId} (${pName}) | targetPlayer=${pId} | hasDiscarded=${hasDiscarded} | hasPickedUp=${hasPickedUp}${extra.source ? ` | source=${extra.source}` : ''}${extra.reason ? ` | reason=${extra.reason}` : ''}`);
};
exports.logTurnDiagnostic = logTurnDiagnostic;
const startRound = (room) => {
    const isRematch = room.status === 'game-over';
    const numDecks = room.turnOrder.length > 5 ? 2 : 1;
    let deck = (0, exports.shuffleDeck)((0, exports.createDeck)(numDecks));
    const newPlayers = { ...room.players };
    const jokerCard = deck.splice(0, 1)[0]; // Pick Joker FIRST
    // Deal 7 cards to each player
    room.turnOrder.forEach(playerId => {
        const p = newPlayers[playerId];
        if (isRematch) {
            const hand = (0, exports.sortHand)(deck.splice(0, 7));
            newPlayers[playerId] = {
                ...p,
                hand,
                roundScore: (0, exports.calculateHandScore)(hand, jokerCard),
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
        const hand = (0, exports.sortHand)(deck.splice(0, 7));
        newPlayers[playerId] = {
            ...p,
            hand,
            roundScore: (0, exports.calculateHandScore)(hand, jokerCard),
            hasCalledLeast: false,
        };
    });
    const discardPile = deck.splice(0, 1);
    const firstTurnIdx = (0, exports.findFirstPlayerIndex)(room);
    const now = Date.now();
    const readyRoom = {
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
    (0, exports.logTurnDiagnostic)('TURN_START', readyRoom, { reason: 'round_started' });
    (0, exports.logTurnDiagnostic)('ACTIVE_PLAYER', readyRoom);
    (0, exports.logTurnDiagnostic)('DISCARD_AVAILABLE', readyRoom);
    return readyRoom;
};
exports.startRound = startRound;
const findFirstPlayerIndex = (room) => {
    const hostIdx = room.turnOrder.indexOf(room.hostId);
    if (hostIdx === -1)
        return 0;
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
exports.findFirstPlayerIndex = findFirstPlayerIndex;
const playTurn = (room, playerId, discardedCardIds) => {
    if (room.turnOrder[room.turnIndex] !== playerId || room.turnPhase !== 'discarding')
        return room;
    const player = room.players[playerId];
    // Capture top discard rank BEFORE current discard
    const topDiscardRank = room.discardPile.length > 0
        ? room.discardPile[room.discardPile.length - 1].rank
        : null;
    // Validate discarded cards (Set or Run)
    const discardedCards = player.hand.filter(c => discardedCardIds.includes(c.id));
    if (!(0, exports.isValidSetOrRun)(discardedCards))
        return room;
    // Remove from hand
    const newHand = (0, exports.sortHand)(player.hand.filter(c => !discardedCardIds.includes(c.id)));
    const newDeck = [...room.deck];
    const pendingDiscard = [...discardedCards];
    const newDiscardPile = [...room.discardPile];
    const newPlayers = { ...room.players };
    newPlayers[playerId] = {
        ...player,
        hand: newHand,
        roundScore: (0, exports.calculateHandScore)(newHand, room.jokerCard)
    };
    (0, exports.logTurnDiagnostic)('DISCARD_ACTION', room, { playerId });
    // Rule: If player drops same card rank as on open deck, skip picking
    const isMatch = discardedCards.some(c => c.rank === topDiscardRank);
    const now = Date.now();
    if (isMatch) {
        // Commit discard immediately and end turn
        newDiscardPile.push(...pendingDiscard);
        const nextIdx = (0, exports.getNextTurnIndex)(room, room.turnIndex);
        const resultRoom = {
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
        (0, exports.logTurnDiagnostic)('TURN_COMPLETE', resultRoom, { playerId, reason: 'discard_match_skip_pickup' });
        (0, exports.logTurnDiagnostic)('NEXT_PLAYER', resultRoom);
        (0, exports.logTurnDiagnostic)('ACTIVE_PLAYER', resultRoom);
        (0, exports.logTurnDiagnostic)('DISCARD_AVAILABLE', resultRoom);
        return resultRoom;
    }
    const resultRoom = {
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
    (0, exports.logTurnDiagnostic)('PICKUP_AVAILABLE', resultRoom, { playerId });
    return resultRoom;
};
exports.playTurn = playTurn;
const drawCard = (room, playerId, source) => {
    if (room.turnOrder[room.turnIndex] !== playerId || room.turnPhase !== 'picking')
        return room;
    (0, exports.logTurnDiagnostic)('PICKUP_ACTION', room, { playerId, source });
    const player = room.players[playerId];
    let newDeck = [...room.deck];
    let newDiscardPile = [...room.discardPile];
    let pickedCard;
    let reshuffled = false;
    if (source === 'deck') {
        if (newDeck.length === 0) {
            if (newDiscardPile.length <= 1) {
                // No cards available anywhere: commit pending discard and pass the turn instead of freezing.
                const stuckNow = Date.now();
                return {
                    ...room,
                    discardPile: [...newDiscardPile, ...(room.pendingDiscard || [])],
                    pendingDiscard: [],
                    turnIndex: (0, exports.getNextTurnIndex)(room, room.turnIndex),
                    turnPhase: 'discarding',
                    turnStartTime: stuckNow,
                    updatedAt: stuckNow,
                    version: (room.version || 0) + 1,
                };
            }
            const topCard = newDiscardPile[newDiscardPile.length - 1];
            const cardsToReshuffle = newDiscardPile.slice(0, newDiscardPile.length - 1);
            newDeck = (0, exports.shuffleDeck)(cardsToReshuffle);
            newDiscardPile = [topCard];
            reshuffled = true;
        }
        pickedCard = newDeck.pop();
    }
    else {
        pickedCard = newDiscardPile.pop();
    }
    if (!pickedCard)
        return room;
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
        newMessages = msgArray;
    }
    const lastDiscardedRank = newDiscardPile.length > 0 ? newDiscardPile[newDiscardPile.length - 1].rank : undefined;
    const now = Date.now();
    const nextIdx = (0, exports.getNextTurnIndex)(room, room.turnIndex);
    if (source === 'deck' && pickedCard.rank === lastDiscardedRank) {
        newDiscardPile.push(pickedCard);
        newDiscardPile.push(...(room.pendingDiscard || []));
        const result = {
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
        (0, exports.logTurnDiagnostic)('CARD_DRAWN', result, { playerId, source, reason: 'immediate_drop_match' });
        (0, exports.logTurnDiagnostic)('TURN_COMPLETE', result, { playerId, reason: 'pickup_immediate_drop' });
        (0, exports.logTurnDiagnostic)('NEXT_PLAYER', result);
        (0, exports.logTurnDiagnostic)('ACTIVE_PLAYER', result);
        (0, exports.logTurnDiagnostic)('DISCARD_AVAILABLE', result);
        return result;
    }
    const newHand = (0, exports.sortHand)([...player.hand, pickedCard]);
    const newPlayers = { ...room.players };
    newPlayers[playerId] = {
        ...player,
        hand: newHand,
        roundScore: (0, exports.calculateHandScore)(newHand, room.jokerCard)
    };
    newDiscardPile.push(...(room.pendingDiscard || []));
    const result = {
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
    (0, exports.logTurnDiagnostic)('CARD_DRAWN', result, { playerId, source });
    (0, exports.logTurnDiagnostic)('TURN_COMPLETE', result, { playerId, reason: 'pickup_completed' });
    (0, exports.logTurnDiagnostic)('NEXT_PLAYER', result);
    (0, exports.logTurnDiagnostic)('ACTIVE_PLAYER', result);
    (0, exports.logTurnDiagnostic)('DISCARD_AVAILABLE', result);
    return result;
};
exports.drawCard = drawCard;
const handleTurnTimeout = (room, playerId) => {
    if (!room || room.status !== 'playing')
        return room;
    const currentTurnId = room.turnOrder[room.turnIndex];
    if (currentTurnId !== playerId)
        return room;
    const player = room.players[playerId];
    if (!player || player.isOut)
        return room;
    let state = { ...room };
    const now = Date.now();
    if (state.turnPhase === 'discarding') {
        if (!player.hand || player.hand.length === 0) {
            // Empty hand (e.g. whole hand dropped on a match) scores 0 – auto-call LEAST instead of stalling.
            return (0, exports.callLeast)(room, playerId);
        }
        const cardToDiscard = player.hand[0];
        (0, exports.logTurnDiagnostic)('DISCARD_ACTION', state, { playerId, reason: 'timeout_autodiscard' });
        state = (0, exports.playTurn)(state, playerId, [cardToDiscard.id]);
        return {
            ...state,
            turnStartTime: now,
            updatedAt: now,
            version: (state.version || 0) + 1,
        };
    }
    else if (state.turnPhase === 'picking') {
        (0, exports.logTurnDiagnostic)('PICKUP_ACTION', state, { playerId, reason: 'timeout_autopickup' });
        state = (0, exports.drawCard)(state, playerId, 'deck');
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
exports.handleTurnTimeout = handleTurnTimeout;
const callLeast = (room, callerId) => {
    // Only the active player may call LEAST, at the start of their turn, while the round is in play.
    if (room.status !== 'playing' ||
        room.turnOrder[room.turnIndex] !== callerId ||
        room.turnPhase !== 'discarding') {
        return room;
    }
    // Clone each player so the previous room state is never mutated.
    const newPlayers = {};
    Object.entries(room.players).forEach(([id, p]) => {
        newPlayers[id] = { ...p, roundScores: [...(p.roundScores || [])] };
    });
    let lowestScore = Infinity;
    let lowestPlayerId = '';
    Object.values(newPlayers).forEach(p => {
        if (p.isOut || p.totalScore >= 200)
            return;
        if (p.roundScore < lowestScore) {
            lowestScore = p.roundScore;
            lowestPlayerId = p.id;
        }
        else if (p.roundScore === lowestScore) {
            if (lowestPlayerId === callerId)
                lowestPlayerId = p.id;
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
            }
            else {
                p.roundScore = 0;
            }
        }
        else {
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
    const endRoom = {
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
    (0, exports.logTurnDiagnostic)('TURN_COMPLETE', endRoom, { playerId: callerId, reason: 'called_least' });
    return endRoom;
};
exports.callLeast = callLeast;
const formatCountdown = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
exports.formatCountdown = formatCountdown;
exports.WAITING_ROOM_TTL_MS = 15 * 60 * 1000;
exports.POST_GAME_TTL_MS = 5 * 60 * 1000;
exports.EMPTY_ROOM_TTL_MS = 5 * 60 * 1000;
const checkRoomExpiration = (room) => {
    if (!room)
        return { isExpired: false };
    if (room.status === 'expired' || room.isExpired) {
        return { isExpired: true, expiredReason: 'This private room has expired.' };
    }
    const now = Date.now();
    if (room.status === 'lobby') {
        const createdAt = room.createdAt || now;
        if (now - createdAt >= exports.WAITING_ROOM_TTL_MS) {
            return { isExpired: true, expiredReason: 'Waiting room expired after 15 minutes.' };
        }
        const humanPlayers = Object.values(room.players || {}).filter(p => !p.isBot);
        if (humanPlayers.length === 0) {
            const emptyAt = room.emptyAt || now;
            if (now - emptyAt >= exports.EMPTY_ROOM_TTL_MS) {
                return { isExpired: true, expiredReason: 'Room expired due to 5 minutes of inactivity.' };
            }
        }
    }
    if (room.status === 'playing' || room.status === 'round-end') {
        return { isExpired: false };
    }
    if (room.status === 'game-over') {
        const gameOverAt = room.gameOverAt || room.finishedAt || now;
        if (now - gameOverAt >= exports.POST_GAME_TTL_MS) {
            return { isExpired: true, expiredReason: 'Post-game room expired after 5 minutes.' };
        }
    }
    return { isExpired: false };
};
exports.checkRoomExpiration = checkRoomExpiration;
const botPlayTurn = (room, botId) => {
    let currentState = { ...room };
    const bot = currentState.players[botId];
    if (!bot)
        return room;
    // 1. Perform Discard Phase
    if (currentState.turnPhase === 'discarding') {
        if (!bot.hand || bot.hand.length === 0 || bot.roundScore <= 10) {
            return (0, exports.callLeast)(currentState, botId);
        }
        let bestMove = { ids: [bot.hand[0].id], value: bot.hand[0].value };
        const rankGroups = {};
        bot.hand.forEach(c => {
            if (!rankGroups[c.rank])
                rankGroups[c.rank] = [];
            rankGroups[c.rank].push(c.id);
        });
        Object.values(rankGroups).forEach(ids => {
            const sum = ids.reduce((acc, id) => {
                const card = bot.hand.find(c => c.id === id);
                return acc + (card ? card.value : 0);
            }, 0);
            if (sum > bestMove.value)
                bestMove = { ids, value: sum };
        });
        const suitGroups = {};
        bot.hand.forEach(c => {
            if (!suitGroups[c.suit])
                suitGroups[c.suit] = [];
            suitGroups[c.suit].push(c);
        });
        Object.values(suitGroups).forEach(suitCards => {
            const sorted = [...suitCards].sort((a, b) => (0, exports.getSequenceValue)(a.rank) - (0, exports.getSequenceValue)(b.rank));
            let currentRun = [];
            for (let i = 0; i < sorted.length; i++) {
                const lastVal = currentRun.length > 0 ? (0, exports.getSequenceValue)(currentRun[currentRun.length - 1].rank) : -1;
                const currentVal = (0, exports.getSequenceValue)(sorted[i].rank);
                if (currentRun.length === 0 || currentVal === lastVal + 1) {
                    currentRun.push(sorted[i]);
                }
                else if (currentVal !== lastVal) {
                    if (currentRun.length >= 3) {
                        const sum = currentRun.reduce((acc, c) => acc + c.value, 0);
                        if (sum > bestMove.value)
                            bestMove = { ids: currentRun.map(c => c.id), value: sum };
                    }
                    currentRun = [sorted[i]];
                }
            }
            if (currentRun.length >= 3) {
                const sum = currentRun.reduce((acc, c) => acc + c.value, 0);
                if (sum > bestMove.value)
                    bestMove = { ids: currentRun.map(c => c.id), value: sum };
            }
        });
        return (0, exports.playTurn)(currentState, botId, bestMove.ids);
    }
    // 2. Perform Picking Phase
    if (currentState.turnPhase === 'picking') {
        const topDiscard = currentState.discardPile[currentState.discardPile.length - 1];
        if (topDiscard && topDiscard.value <= 2) {
            return (0, exports.drawCard)(currentState, botId, 'discard');
        }
        else {
            return (0, exports.drawCard)(currentState, botId, 'deck');
        }
    }
    return currentState;
};
exports.botPlayTurn = botPlayTurn;
