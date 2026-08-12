"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var gameLogic_1 = require("./src/engine/gameLogic");
var b1 = 'bot1';
var b2 = 'bot2';
var b3 = 'bot3';
var initialRoom = {
    id: 'test',
    hostId: 'host1',
    status: 'lobby',
    deck: [],
    discardPile: [],
    players: (_a = {},
        _a['host1'] = { id: 'host1', name: 'host', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false },
        _a[b1] = { id: b1, name: 'Computer 1', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
        _a[b2] = { id: b2, name: 'Computer 2', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
        _a[b3] = { id: b3, name: 'Computer 3', hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: true },
        _a),
    turnIndex: 0,
    turnOrder: ['host1', b1, b2, b3],
    currentRound: 1,
    maxRounds: 5,
};
var startedRoom = (0, gameLogic_1.startRound)(initialRoom);
console.log('Room started. Turn:', startedRoom.turnIndex);
// Host plays turn
startedRoom.turnIndex = 1;
var state1 = (0, gameLogic_1.botPlayTurn)(startedRoom, b1);
console.log('Bot 1 played. New turn:', state1.turnIndex);
var state2 = (0, gameLogic_1.botPlayTurn)(state1, b2);
console.log('Bot 2 played. New turn:', state2.turnIndex);
var state3 = (0, gameLogic_1.botPlayTurn)(state2, b3);
console.log('Bot 3 played. New turn:', state3.turnIndex);
