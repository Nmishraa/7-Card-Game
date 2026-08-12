"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = require("./src/engine/gameLogic");
// Create a mock room where:
// - Host is active (totalScore = 50)
// - Bot 1 is eliminated (totalScore = 220, isOut = true)
// - Bot 2 is active (totalScore = 60)
//
// The current round ends with Host calling least.
const initialRoom = {
    id: 'test-room',
    hostId: 'host1',
    status: 'playing',
    deck: [],
    discardPile: [],
    players: {
        ['host1']: {
            id: 'host1',
            name: 'Host Player',
            hand: [
                { id: '1', rank: '2', suit: 'Hearts', value: 2 }
            ],
            roundScore: 2,
            totalScore: 50,
            hasCalledLeast: false
        },
        ['bot1']: {
            id: 'bot1',
            name: 'Eliminated Bot',
            hand: [],
            roundScore: 0,
            totalScore: 220,
            hasCalledLeast: false,
            isBot: true,
            isOut: true
        },
        ['bot2']: {
            id: 'bot2',
            name: 'Active Bot',
            hand: [
                { id: '2', rank: 'K', suit: 'Spades', value: 10 }
            ],
            roundScore: 10,
            totalScore: 60,
            hasCalledLeast: false,
            isBot: true
        },
    },
    turnIndex: 0,
    turnOrder: ['host1', 'bot1', 'bot2'],
    currentRound: 2,
    maxRounds: 5,
    turnPhase: 'discarding',
    lastDiscardedCount: 1,
};
console.log('--- TEST 1: callLeast execution ---');
// Host calls least. Host roundScore is 2. Bot 2 roundScore is 10.
// Bot 1 (eliminated) roundScore is 0.
// If Bot 1 was NOT ignored, lowestScore would be 0 (Bot 1's), meaning Host did not win the call, incurring penalty!
// If Bot 1 IS ignored, lowestScore is 2 (Host's). Host wins.
// Host gets 0 points. Bot 2 gets 10 - 2 = 8 points. Bot 1 gets 0 points.
const endRoundRoom = (0, gameLogic_1.callLeast)(initialRoom, 'host1');
const host = endRoundRoom.players['host1'];
const bot1 = endRoundRoom.players['bot1'];
const bot2 = endRoundRoom.players['bot2'];
console.log(`Host totalScore (expected 50): ${host.totalScore}`);
console.log(`Eliminated Bot totalScore (expected 220): ${bot1.totalScore}`);
console.log(`Active Bot totalScore (expected 68): ${bot2.totalScore}`);
if (host.totalScore !== 50) {
    console.error('FAIL: Host got penalized because the eliminated bot was not ignored!');
    process.exit(1);
}
if (bot1.totalScore !== 220) {
    console.error(`FAIL: Eliminated bot score changed to ${bot1.totalScore}!`);
    process.exit(1);
}
if (bot2.totalScore !== 68) {
    console.error(`FAIL: Active bot score is ${bot2.totalScore}, expected 68!`);
    process.exit(1);
}
console.log('SUCCESS: callLeast logic handles eliminated players correctly!');
console.log('\n--- TEST 2: startRound execution ---');
// Now let's start the next round
const nextRoundRoom = (0, gameLogic_1.startRound)(endRoundRoom);
const hostNext = nextRoundRoom.players['host1'];
const bot1Next = nextRoundRoom.players['bot1'];
const bot2Next = nextRoundRoom.players['bot2'];
console.log(`Host hand size (expected 7): ${hostNext.hand.length}`);
console.log(`Eliminated Bot hand size (expected 0): ${bot1Next.hand.length}`);
console.log(`Active Bot hand size (expected 7): ${bot2Next.hand.length}`);
console.log(`Eliminated Bot isOut (expected true): ${bot1Next.isOut}`);
if (bot1Next.hand.length !== 0 || !bot1Next.isOut) {
    console.error('FAIL: Eliminated bot was dealt cards in the new round!');
    process.exit(1);
}
console.log('SUCCESS: startRound logic handles eliminated players correctly!');
console.log('\nALL TESTS PASSED!');
