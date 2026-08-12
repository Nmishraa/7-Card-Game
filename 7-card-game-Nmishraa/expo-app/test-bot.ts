import { startRound, botPlayTurn } from './src/engine/gameLogic';
import { GameRoom } from './src/engine/types';

const b1 = 'bot1';
const b2 = 'bot2';
const b3 = 'bot3';

let initialRoom: GameRoom = {
  id: 'test',
  hostId: 'host1',
  status: 'lobby',
  deck: [],
  discardPile: [],
  players: {
    ['host1']: { id: 'host1', name: 'host', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false },
    [b1]: { id: b1, name: 'Computer 1', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
    [b2]: { id: b2, name: 'Computer 2', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
    [b3]: { id: b3, name: 'Computer 3', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
  },
  turnIndex: 0,
  turnOrder: ['host1', b1, b2, b3],
  currentRound: 1,
  maxRounds: 5,
  turnPhase: 'discarding',
  lastDiscardedCount: 1,
};

let startedRoom = startRound(initialRoom);
console.log('Room started. Turn:', startedRoom.turnIndex);

// Host plays turn
startedRoom.turnIndex = 1; 
let state1 = botPlayTurn(startedRoom, b1);
console.log('Bot 1 played. New turn:', state1.turnIndex);

let state2 = botPlayTurn(state1, b2);
console.log('Bot 2 played. New turn:', state2.turnIndex);

let state3 = botPlayTurn(state2, b3);
console.log('Bot 3 played. New turn:', state3.turnIndex);
