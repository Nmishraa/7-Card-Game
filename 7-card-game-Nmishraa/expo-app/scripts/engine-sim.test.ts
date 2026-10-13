/* Engine turn-sequence simulation. Run: npx -y tsx scripts/engine-sim.test.ts */
import { startRound, playTurn, drawCard, callLeast, botPlayTurn, handleTurnTimeout } from '../src/engine/gameLogic';
import { GameRoom, Player } from '../src/engine/types';

const origLog = console.log; console.log = () => {};
let pass = 0, fail = 0;
const check = (name: string, cond: boolean, info = '') => {
  if (cond) pass++; else { fail++; origLog(`FAIL: ${name} ${info}`); }
};
const mk = (id: string, bot = false): Player => ({ id, name: id, hand: [], roundScore: 0, totalScore: 0, hasCalledLeast: false, isBot: bot, isOut: false, roundScores: [] } as any);
const makeRoom = (n: number): GameRoom => {
  const ids = ['human', ...Array.from({ length: n - 1 }, (_, i) => `bot${i + 1}`)];
  const players: any = {}; ids.forEach((id, i) => players[id] = mk(id, i > 0));
  return { id: 'T', hostId: 'human', status: 'playing', deck: [], discardPile: [], players, turnIndex: 0, turnOrder: ids,
    turnPhase: 'discarding', lastDiscardedCount: 1, currentRound: 1, maxRounds: 5, turnTimeLimit: 60, jokerCard: null, pendingDiscard: [], messages: [] } as any;
};
const totalCards = (r: GameRoom) => r.deck.length + r.discardPile.length + (r.pendingDiscard || []).length + 1 /* joker */ +
  Object.values(r.players).reduce((a, p) => a + (p.hand?.length || 0), 0);

for (const n of [2, 4, 6, 8]) {
  let r = startRound(makeRoom(n));
  const expected = n > 5 ? 104 : 52;
  check(`[${n}p] deal 7 each`, Object.values(r.players).every(p => p.hand.length === 7));
  check(`[${n}p] card conservation at start`, totalCards(r) === expected, `${totalCards(r)}`);
  check(`[${n}p] starts in discarding`, r.turnPhase === 'discarding');
  const first = r.turnOrder[r.turnIndex];
  const other = r.turnOrder[(r.turnIndex + 1) % n];
  // Illegal actions
  check(`[${n}p] draw before discard rejected`, drawCard(r, first, 'deck') === r);
  check(`[${n}p] out-of-turn discard rejected`, playTurn(r, other, [r.players[other].hand[0].id]) === r);
  check(`[${n}p] out-of-turn LEAST rejected`, callLeast(r, other) === r);
  const h = r.players[first].hand;
  const bad = h.find((c, i) => i > 0 && c.rank !== h[0].rank && c.suit !== h[0].suit);
  if (bad) check(`[${n}p] invalid set rejected`, playTurn(r, first, [h[0].id, bad.id]) === r);

  // Full games driven by bot logic for every seat (incl. "human")
  for (let game = 0; game < 50; game++) {
    r = startRound(makeRoom(n));
    let steps = 0;
    while (r.status === 'playing' && steps < 5000) {
      const pid = r.turnOrder[r.turnIndex];
      const before = r;
      const handBefore = before.players[pid].hand.length;
      let next = botPlayTurn(r, pid);
      if (next === r) next = handleTurnTimeout(r, pid);
      check(`[${n}p] progress (no stall)`, next !== r, `phase=${r.turnPhase}`);
      if (next === r) break;
      if (next.status === 'playing') {
        check(`[${n}p] conservation`, totalCards(next) === expected, `${totalCards(next)} vs ${expected}`);
        if (before.turnPhase === 'discarding' && next.turnPhase === 'picking') {
          check(`[${n}p] same player picks after discard`, next.turnOrder[next.turnIndex] === pid);
          check(`[${n}p] hand shrinks on discard`, next.players[pid].hand.length < handBefore);
        }
        if (before.turnPhase === 'picking') {
          check(`[${n}p] turn passes after pick`, next.turnIndex !== before.turnIndex || n === 1);
          check(`[${n}p] pending committed`, (next.pendingDiscard || []).length === 0);
          check(`[${n}p] double draw rejected`, drawCard(next, pid, 'deck') === next);
        }
        const ids = Object.values(next.players).flatMap(p => p.hand.map(c => c.id))
          .concat(next.deck.map(c => c.id), next.discardPile.map(c => c.id));
        check(`[${n}p] no duplicate card ids`, new Set(ids).size === ids.length);
      }
      r = next; steps++;
    }
    check(`[${n}p] round ended via LEAST`, r.status === 'round-end' || r.status === 'game-over', r.status);
    const caller = Object.values(r.players).find(p => p.hasCalledLeast);
    check(`[${n}p] caller recorded`, !!caller);
    if (caller) {
      const won = r.roundWinnerId === caller.id;
      check(`[${n}p] caller score 0 or 80`, won ? caller.roundScore === 0 : caller.roundScore === 80);
    }
    check(`[${n}p] scores non-negative`, Object.values(r.players).every(p => p.roundScore >= 0));
  }
}

// callLeast must not mutate the previous state
{
  const r = startRound(makeRoom(3));
  const snap = JSON.stringify(r.players);
  const after = callLeast(r, r.turnOrder[r.turnIndex]);
  check('callLeast immutable', JSON.stringify(r.players) === snap && after !== r);
}
// Exhausted deck & pile no longer freezes
{
  let r = startRound(makeRoom(2));
  const pid = r.turnOrder[r.turnIndex];
  r = playTurn({ ...r, deck: [], discardPile: [] }, pid, [r.players[pid].hand[0].id]);
  const n2 = drawCard(r, pid, 'deck');
  check('exhausted deck passes turn', n2 !== r && n2.turnPhase === 'discarding' && n2.turnIndex !== r.turnIndex);
}
// Empty hand auto-LEAST
{
  let r = startRound(makeRoom(2));
  const pid = r.turnOrder[r.turnIndex];
  r = { ...r, players: { ...r.players, [pid]: { ...r.players[pid], hand: [], roundScore: 0 } } };
  check('empty hand bot -> LEAST', botPlayTurn(r, pid).status !== 'playing');
  check('empty hand timeout -> LEAST', handleTurnTimeout(r, pid).status !== 'playing');
}

origLog(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
