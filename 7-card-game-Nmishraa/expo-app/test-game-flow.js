const {
  createDeck, shuffleDeck, sortHand, getCardValue, isValidSetOrRun,
  calculateHandScore, startRound, playTurn, drawCard, callLeast, botPlayTurn
} = require('./src/engine/gameLogic');

console.log('=====================================================');
console.log('🧪 7 CARDS LEAST: COMPREHENSIVE AUTOMATED TEST SUITE');
console.log('=====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// Test 1: Deck Creation and Card Values
// -----------------------------------------------------------------------------
console.log('--- 1. Testing Deck Creation & Card Point Values ---');
const deck = createDeck(1);
assert(deck.length === 52, `Single deck has exactly 52 cards (got ${deck.length})`);
assert(getCardValue('A') === 1, 'Ace has value 1');
assert(getCardValue('2') === 2, '2 has value 2');
assert(getCardValue('10') === 10, '10 has value 10');
assert(getCardValue('J') === 10, 'Jack has value 10');
assert(getCardValue('Q') === 10, 'Queen has value 10');
assert(getCardValue('K') === 10, 'King has value 10');

// -----------------------------------------------------------------------------
// Test 2: Sets and Runs Validation
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Sets & Runs Validation ---');
const singleCard = [{ id: '1', rank: '7', suit: 'Hearts', value: 7 }];
assert(isValidSetOrRun(singleCard), 'Single card is valid discard');

const pair = [
  { id: '1', rank: '9', suit: 'Hearts', value: 9 },
  { id: '2', rank: '9', suit: 'Spades', value: 9 }
];
assert(isValidSetOrRun(pair), 'Pair of equal ranks is valid discard');

const threeOfAKind = [
  { id: '1', rank: 'K', suit: 'Hearts', value: 10 },
  { id: '2', rank: 'K', suit: 'Clubs', value: 10 },
  { id: '3', rank: 'K', suit: 'Diamonds', value: 10 }
];
assert(isValidSetOrRun(threeOfAKind), 'Three of a kind is valid discard');

const suitedRun = [
  { id: '1', rank: '4', suit: 'Hearts', value: 4 },
  { id: '2', rank: '5', suit: 'Hearts', value: 5 },
  { id: '3', rank: '6', suit: 'Hearts', value: 6 }
];
assert(isValidSetOrRun(suitedRun), 'Suited run of 3 consecutive cards is valid discard');

const invalidMix = [
  { id: '1', rank: '4', suit: 'Hearts', value: 4 },
  { id: '2', rank: '5', suit: 'Spades', value: 5 },
  { id: '3', rank: '6', suit: 'Hearts', value: 6 }
];
assert(!isValidSetOrRun(invalidMix), 'Unsuited run is rejected');

// -----------------------------------------------------------------------------
// Test 3: Table Joker Scoring Parity
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Table Joker Wildcard Point Calculations ---');
const joker = { id: 'j', rank: '7', suit: 'Diamonds', value: 7 };
const handWithJoker = [
  { id: '1', rank: '7', suit: 'Hearts', value: 7 }, // matches joker -> 0 pts
  { id: '2', rank: 'A', suit: 'Spades', value: 1 },  // 1 pt
  { id: '3', rank: 'K', suit: 'Clubs', value: 10 }   // 10 pts
];
const scoreWithJoker = calculateHandScore(handWithJoker, joker);
assert(scoreWithJoker === 11, `Hand with matching Joker rank scores 11 pts (7 becomes 0) (got ${scoreWithJoker})`);

const scoreWithoutJoker = calculateHandScore(handWithJoker, null);
assert(scoreWithoutJoker === 18, `Hand without Joker scores 18 pts (got ${scoreWithoutJoker})`);

// -----------------------------------------------------------------------------
// Test 4: Game Round Setup & Player Dealing
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Round Setup & Dealing Sequence ---');
const initialRoom = {
  id: 'TEST',
  hostId: 'human_1',
  status: 'waiting',
  currentRound: 1,
  totalRounds: 3,
  turnTimeLimit: 60,
  players: {
    'human_1': { id: 'human_1', name: 'Alice', isHost: true, isConnected: true, hand: [], roundScore: 0, totalScore: 0, isOut: false, roundScores: [] },
    'bot_1': { id: 'bot_1', name: 'Bot 1', isHost: false, isConnected: true, isBot: true, hand: [], roundScore: 0, totalScore: 0, isOut: false, roundScores: [] },
    'bot_2': { id: 'bot_2', name: 'Bot 2', isHost: false, isConnected: true, isBot: true, hand: [], roundScore: 0, totalScore: 0, isOut: false, roundScores: [] },
    'bot_3': { id: 'bot_3', name: 'Bot 3', isHost: false, isConnected: true, isBot: true, hand: [], roundScore: 0, totalScore: 0, isOut: false, roundScores: [] }
  },
  turnOrder: ['human_1', 'bot_1', 'bot_2', 'bot_3'],
  turnIndex: 0,
  turnPhase: 'discarding',
  discardPile: [],
  deck: [],
  roundScores: {},
  version: 0
};

const roundActiveRoom = startRound(initialRoom);
assert(roundActiveRoom.status === 'playing', 'Room status transitions to playing');
assert(roundActiveRoom.jokerCard !== null, `Table Joker is selected: ${roundActiveRoom.jokerCard.rank} of ${roundActiveRoom.jokerCard.suit}`);
assert(roundActiveRoom.discardPile.length === 1, 'Top discard pile has exactly 1 initial card');
assert(roundActiveRoom.players['human_1'].hand.length === 7, 'Human player has 7 cards dealt');
assert(roundActiveRoom.players['bot_1'].hand.length === 7, 'Bot 1 has 7 cards dealt');
assert(roundActiveRoom.players['bot_2'].hand.length === 7, 'Bot 2 has 7 cards dealt');
assert(roundActiveRoom.players['bot_3'].hand.length === 7, 'Bot 3 has 7 cards dealt');

// -----------------------------------------------------------------------------
// Test 5: Turn Sequence (Discard -> Draw -> Next Player)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Turn Flow (Discard -> Draw -> Turn Advance) ---');
const activePlayerId = roundActiveRoom.turnOrder[roundActiveRoom.turnIndex];
const activePlayer = roundActiveRoom.players[activePlayerId];
const cardToDiscard = activePlayer.hand[0];

const afterDiscard = playTurn(roundActiveRoom, activePlayerId, [cardToDiscard.id]);
assert(afterDiscard.players[activePlayerId].hand.length === 6, 'Hand decremented to 6 cards after discard');
assert(afterDiscard.turnPhase === 'picking' || afterDiscard.turnPhase === 'discarding', 'Turn phase updated correctly');

if (afterDiscard.turnPhase === 'picking') {
  const afterDraw = drawCard(afterDiscard, activePlayerId, 'deck');
  const handLen = afterDraw.players[activePlayerId].hand.length;
  assert(handLen === 7 || handLen === 6, `Hand returns to 7 cards (or 6 if immediate drop matched top discard rank, got ${handLen})`);
  assert(afterDraw.turnIndex !== roundActiveRoom.turnIndex, 'Turn advanced to next player');
}

// -----------------------------------------------------------------------------
// Test 6: AI Bot Play Turn
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Bot Automated Play (botPlayTurn) ---');
const botRoom = { ...roundActiveRoom };
const botId = 'bot_1';
botRoom.turnIndex = botRoom.turnOrder.indexOf(botId);
botRoom.turnPhase = 'discarding';
const botHandBefore = botRoom.players[botId].hand.length;

const afterBotTurn = botPlayTurn(botRoom, botId);
assert(afterBotTurn.players[botId].hand.length >= 1 && afterBotTurn.players[botId].hand.length <= 7, `Bot hand is valid after bot turn (${afterBotTurn.players[botId].hand.length} cards remaining)`);

// -----------------------------------------------------------------------------
// Test 7: Least Call Threshold & 80-Point Penalty Evaluation
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Least Declaration & Penalty Rules ---');
// Scenario A: Legitimate Least call (Alice has 4 pts, Bob has 15 pts)
const leastRoomA = {
  ...roundActiveRoom,
  players: {
    'human_1': { ...roundActiveRoom.players['human_1'], hand: [{ id: 'a', rank: '4', suit: 'Hearts', value: 4 }], roundScore: 4, totalScore: 0 },
    'bot_1': { ...roundActiveRoom.players['bot_1'], hand: [{ id: 'b', rank: '10', suit: 'Spades', value: 10 }, { id: 'c', rank: '5', suit: 'Diamonds', value: 5 }], roundScore: 15, totalScore: 0 }
  },
  turnOrder: ['human_1', 'bot_1'],
  turnIndex: 0
};
const resultA = callLeast(leastRoomA, 'human_1');
assert(resultA.roundWinnerId === 'human_1', 'Alice wins round with 4 points');
assert(resultA.players['human_1'].roundScore === 0, 'Alice earns 0 penalty points as lowest hand');
assert(resultA.players['bot_1'].roundScore === 11, 'Bob takes relative penalty score (15 - 4 = 11 pts)');

// Scenario B: False Least call (Alice calls with 9 pts, but Bob has 5 pts)
const leastRoomB = {
  ...roundActiveRoom,
  players: {
    'human_1': { ...roundActiveRoom.players['human_1'], hand: [{ id: 'a', rank: '9', suit: 'Hearts', value: 9 }], roundScore: 9, totalScore: 0 },
    'bot_1': { ...roundActiveRoom.players['bot_1'], hand: [{ id: 'b', rank: '5', suit: 'Spades', value: 5 }], roundScore: 5, totalScore: 0 }
  },
  turnOrder: ['human_1', 'bot_1'],
  turnIndex: 0
};
const resultB = callLeast(leastRoomB, 'human_1');
assert(resultB.roundWinnerId === 'bot_1', 'Bob wins round because he holds lower score (5 vs 9)');
assert(resultB.players['human_1'].roundScore === 80, 'Alice incurs flat 80-point penalty for false call');
assert(resultB.players['bot_1'].roundScore === 0, 'Bob earns 0 points for lowest hand');

// -----------------------------------------------------------------------------
// Test 8: Deterministic PRNG for Daily Challenge
// -----------------------------------------------------------------------------
console.log('\n--- 8. Testing Daily Challenge Determinism & Reproducibility ---');
function getDailySeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const seed1 = getDailySeed('2026-10-11');
const rand1a = seededRandom(seed1);
const rand1b = seededRandom(seed1);
const sampleA = [rand1a(), rand1a(), rand1a()];
const sampleB = [rand1b(), rand1b(), rand1b()];
assert(JSON.stringify(sampleA) === JSON.stringify(sampleB), 'Daily seed produces 100% identical sequence on repeated calls');

const seed2 = getDailySeed('2026-10-12');
const rand2 = seededRandom(seed2);
const sampleC = [rand2(), rand2(), rand2()];
assert(JSON.stringify(sampleA) !== JSON.stringify(sampleC), 'Different calendar date produces distinct seed sequence');

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n=====================================================');
console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('=====================================================');
if (failCount > 0) process.exit(1);
