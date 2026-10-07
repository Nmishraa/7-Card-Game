const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[SEO Prerender Error] dist/index.html does not exist. Run "npx expo export --platform web" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(indexPath, 'utf-8');

const navHtml = `
  <nav aria-label="Quick Links" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 15px; text-align: center;">
    <a href="https://cards.gnanamai.com/" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Play Online</a> |
    <a href="https://cards.gnanamai.com/7-cards-least" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">7 Cards Least Guide</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Official Rules</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">How to Play</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Strategy &amp; Tips</a> |
    <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Multiplayer Mode</a> |
    <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Play Against AI</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">FAQ</a>
  </nav>
`;

const routes = [
  {
    path: '/',
    dir: distDir,
    title: '7 Cards Least Online – Play 7 Cards Game & Seven Cards Free',
    description: 'Play 7 Cards Least online for free. Enjoy real-time multiplayer card games with friends or practice solo against computer AI. No download required.',
    canonical: 'https://cards.gnanamai.com/',
    h1: '7 Cards Least Game Online – Play Free With Friends & AI',
    h2: 'The ultimate online portal for 7 Cards Least rules, strategy, and real-time multiplayer card games.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Play Free With Friends &amp; AI</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">The ultimate online portal for 7 Cards Least rules, strategy, and real-time multiplayer card games.</h2>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Welcome to <strong>7 Cards Least Online</strong> on cards.gnanamai.com. 7 Cards Least (also known as Low Hand Rummy or 7 Cards) is a fast-paced shedding card game played with 7 cards per player. The core objective is to achieve the <em>lowest cumulative hand point total</em> by discarding high-value cards, forming matching rank sets or suited runs, and declaring <strong>LEAST!</strong> when your hand score drops to 10 points or less.
        </p>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎴 Card Point Values &amp; Scoring System</h3>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px;">
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point</li>
          <li><strong style="color: #ffffff;">Number Cards (2 to 10):</strong> Face Value (2–10 points)</li>
          <li><strong style="color: #ffffff;">Face Cards (J, Q, K):</strong> 10 Points each</li>
          <li><strong style="color: #ffffff;">Table Joker Wildcard:</strong> 0 Points (established during table flip)</li>
          <li><strong style="color: #ffffff;">Least Threshold:</strong> Hand total ≤ 10 points required to declare Least</li>
          <li><strong style="color: #ffffff;">False Call Penalty:</strong> 80 points penalty if an opponent holds an equal or lower score</li>
        </ul>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎮 Game Modes Available</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Play instant singleplayer matches against 1 to 7 computer AI bots, or create private 4-digit room code lobbies to play with family and friends across desktop, tablet, and mobile browsers with no app download required.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least',
    dir: path.join(distDir, '7-cards-least'),
    title: '7 Cards Least Game Online – Lowest Score Card Game',
    description: '7 Cards Least Game Online is a free lowest score card game where players try to finish with the least score. Easy to learn and played online with friends and family.',
    canonical: 'https://cards.gnanamai.com/7-cards-least',
    h1: '7 Cards Least Game Online – Official Guide & Portal',
    h2: 'Master the rules, scoring, and winning strategies for 7 Cards Least.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Official Guide &amp; Portal</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Master the rules, scoring, discards, and winning strategies for 7 Cards Least.</h2>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          <strong>7 Cards Least</strong> is one of the most popular card shedding games played around the world. Every player starts with 7 cards dealt from a standard 52-card deck. The goal is simple: discard your high-value cards, keep zero-point Jokers and low Aces, and declare <em>LEAST!</em> when your total score is lower than everyone else at the table.
        </p>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">✨ Key Gameplay Features</h3>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px;">
          <li><strong style="color: #ffffff;">Matching Rank Discards:</strong> Discard single cards, pairs, triples, or 4 of a kind in a single turn.</li>
          <li><strong style="color: #ffffff;">Suited Runs:</strong> Discard 3 or more consecutive cards of the same suit (e.g. 4♠-5♠-6♠).</li>
          <li><strong style="color: #ffffff;">Wildcard Joker Flip:</strong> Table setup establishes a zero-point Joker rank that turns matching rank cards into 0 points.</li>
          <li><strong style="color: #ffffff;">Match &amp; Skip:</strong> If your discard rank matches the top of the discard pile, your turn finishes without needing to pick up.</li>
        </ul>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7cards-least',
    dir: path.join(distDir, '7cards-least'),
    title: '7 Cards Least Game Online – Lowest Score Card Game',
    description: '7 Cards Least Game Online is a free lowest score card game where players try to finish with the least score.',
    canonical: 'https://cards.gnanamai.com/7-cards-least',
    redirect: true
  },
  {
    path: '/7cards-least-',
    dir: path.join(distDir, '7cards-least-'),
    title: '7 Cards Least Game Online – Lowest Score Card Game',
    description: '7 Cards Least Game Online is a free lowest score card game where players try to finish with the least score.',
    canonical: 'https://cards.gnanamai.com/7-cards-least',
    redirect: true
  },
  {
    path: '/7-cards-least/rules',
    dir: path.join(distDir, '7-cards-least', 'rules'),
    title: '7 Cards Least Rules – Complete Game Rules & Scoring Guide',
    description: 'Official 7 Cards Least rules guide. Learn card point values (Aces=1, Face cards=10), Joker wildcard mechanics, Match & Skip turns, and the 80-point wrong call penalty.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/rules',
    h1: '7 Cards Least Official Rules & Scoring Guide',
    h2: 'Complete guide to card values, turns, discard combinations, Joker wildcards, and penalties.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Official Rules &amp; Scoring Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Complete guide to card values, turn flow, discard combinations, Joker wildcards, and penalties.</h2>
        
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">1. Objective &amp; Setup</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          The objective is to achieve the lowest cumulative score. Each player receives 7 cards. One card is dealt face-up to establish the table Joker rank, and one card starts the Discard Pile.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">2. Card Values</h3>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px;">
          <li><strong style="color: #fff;">Ace (A):</strong> 1 point</li>
          <li><strong style="color: #fff;">2 through 10:</strong> Face Value (2–10 points)</li>
          <li><strong style="color: #fff;">Jack, Queen, King:</strong> 10 points each</li>
          <li><strong style="color: #fff;">Joker Rank Card:</strong> 0 points</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">3. Declaring Least &amp; Penalties</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          You can declare <strong>LEAST</strong> during your turn if your total hand value is 10 points or less. If your hand value is strictly lower than all opponents, you score 0 points for the round. If an opponent holds an equal or lower score, you receive an <strong>80-point penalty</strong>!
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least/how-to-play',
    dir: path.join(distDir, '7-cards-least', 'how-to-play'),
    title: 'How to Play 7 Cards Least – Complete Step-by-Step Guide',
    description: 'Learn how to play 7 Cards Least with a beginner-friendly step-by-step guide covering dealing, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/how-to-play',
    h1: 'How to Play 7 Cards Least – Step-by-Step Guide',
    h2: 'A beginner-friendly walkthrough to dealing cards, drawing, discarding, and calling Least.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">How to Play 7 Cards Least – Step-by-Step Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">A beginner-friendly walkthrough to dealing cards, drawing, discarding, and calling Least.</h2>
        
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">Step 1: Start or Join a Game</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Enter your player name on cards.gnanamai.com. Choose to play solo against AI computer bots or create a private room to invite friends.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">Step 2: Discard High Cards &amp; Sets</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          On your turn, discard high-point cards (10s, Jacks, Queens, Kings) or form sets of matching ranks (e.g. two 8s) or suited runs (e.g. 5♦-6♦-7♦).
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">Step 3: Draw a Replacement Card</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          After discarding, pick up one card from either the face-down Draw Deck or the top of the Discard Pile to keep your hand size balanced.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">Step 4: Call LEAST to Win</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          When your hand sum drops to 10 points or less, tap <strong>LEAST!</strong>. All hands are revealed, and the player with the lowest score wins 0 points for the round.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least/strategy',
    dir: path.join(distDir, '7-cards-least', 'strategy'),
    title: '7 Cards Least Strategy – Tips & Tactics to Win More Matches',
    description: 'Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/strategy',
    h1: '7 Cards Least Winning Strategy & Tactics',
    h2: 'Expert tactics for managing hand values, timing Least calls, and outplaying opponents.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Winning Strategy &amp; Tactics</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Expert tactics for managing hand values, timing Least calls, and outplaying opponents.</h2>
        
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">1. Early Game: Shed High-Value Face Cards</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Always prioritize discarding Jacks, Queens, Kings, and 10s during early turns. Holding un-matched face cards exposes you to heavy point penalties if an opponent calls Least quickly.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">2. Build Multi-Card Discards</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Look for opportunities to discard pairs, triples, or 3+ card suited runs. Shedding multiple cards in one turn rapidly drops your total hand score.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">3. Safe Least Call Thresholds</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Calling Least with 7–10 points carries risk if opponents have collected Jokers (0 pts) or Aces (1 pt). The safest Least call score is 0 to 5 points.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least/faq',
    dir: path.join(distDir, '7-cards-least', 'faq'),
    title: '7 Cards Least FAQ – Frequently Asked Questions & Answers',
    description: 'Answers to common 7 Cards Least questions: card values, dealing rules, online multiplayer rooms, AI difficulty, Joker wildcard evaluation, and score elimination.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/faq',
    h1: '7 Cards Least Frequently Asked Questions',
    h2: 'Everything you need to know about rules, turns, scoring, online multiplayer, and AI bots.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Frequently Asked Questions</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Everything you need to know about rules, turns, scoring, online multiplayer, and AI bots.</h2>
        
        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px;">Q: What is 7 Cards Least?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          A: 7 Cards Least is a shedding card game where players aim for the lowest hand point total across rounds.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px;">Q: Is 7 Cards Least free to play online?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          A: Yes, 7 Cards Least is 100% free on cards.gnanamai.com with no app download or mandatory registration required.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px;">Q: How do Joker wildcards work?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          A: At table setup, one card is flipped face-up to set the zero-point Joker rank. All matching rank cards in hands count as 0 points.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/rules',
    dir: path.join(distDir, 'rules'),
    title: '7 Cards Least Rules – Complete Game Rules & Scoring Guide',
    canonical: 'https://cards.gnanamai.com/7-cards-least/rules',
    redirect: true
  },
  {
    path: '/how-to-play',
    dir: path.join(distDir, 'how-to-play'),
    title: 'How to Play 7 Cards Least – Complete Guide',
    canonical: 'https://cards.gnanamai.com/7-cards-least/how-to-play',
    redirect: true
  },
  {
    path: '/strategy',
    dir: path.join(distDir, 'strategy'),
    title: '7 Cards Least Strategy – Tips & Tactics',
    canonical: 'https://cards.gnanamai.com/7-cards-least/strategy',
    redirect: true
  },
  {
    path: '/faq',
    dir: path.join(distDir, 'faq'),
    title: '7 Cards Least FAQ – Rules, Gameplay & Online Play',
    canonical: 'https://cards.gnanamai.com/7-cards-least/faq',
    redirect: true
  },
  {
    path: '/multiplayer',
    dir: path.join(distDir, 'multiplayer'),
    title: '7 Cards Least Multiplayer – Play Online With Friends',
    description: 'Play 7 Cards Least multiplayer online with friends or real opponents. Create private 4-digit code rooms, customize rounds, and enjoy live table chat.',
    canonical: 'https://cards.gnanamai.com/multiplayer',
    h1: '7 Cards Least Online Multiplayer',
    h2: 'Create private rooms, invite friends via WhatsApp, or join instant online player tables.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Online Multiplayer</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Create private rooms, invite friends via WhatsApp, or join instant online player tables.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Play real-time multiplayer 7 Cards Least online with friends, family, or online opponents across the world on cards.gnanamai.com.
        </p>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">⚡ Private Lobbies &amp; 4-Digit Room Codes</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Host a table in 1 click! Customize match round counts (1 to 20 rounds) and turn timer options (1 minute or infinite). Share the 4-digit room code with friends to let them join instantly.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/play-against-ai',
    dir: path.join(distDir, 'play-against-ai'),
    title: '7 Cards Least Against AI – Play Free Online',
    description: 'Play 7 Cards Least against computer AI bots online for free. Practice your card shedding strategy, test Joker plays, and play instant solo matches with zero wait.',
    canonical: 'https://cards.gnanamai.com/play-against-ai',
    h1: '7 Cards Least Against Computer AI',
    h2: 'Practice your card shedding tactics singleplayer against smart computer bots.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Against Computer AI</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Practice your card shedding tactics singleplayer against smart computer bots.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Practice 7 Cards Least solo anytime with zero wait! Challenge 1 to 7 intelligent computer AI bots in singleplayer mode.
        </p>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px;">🤖 Smart Bot Opponents</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem;">
          Test your discard strategies, practice Joker rank calculations, and hone your Least call timing against computer bots designed to simulate real player card decisions.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/demo',
    dir: path.join(distDir, 'demo'),
    title: '7 Cards Game Demo – 45-Second Interactive Preview',
    description: 'Watch the 45-second animated gameplay preview of 7 Cards Least. See card dealing, discard strategy, LEAST calls, and table hand reveals in action.',
    canonical: 'https://cards.gnanamai.com/demo',
    h1: '7 Cards Least 45-Second Gameplay Preview',
    h2: 'Watch animated dealing, card discards, LEAST calls, and winning hand reveals.',
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least 45-Second Gameplay Preview</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Watch animated dealing, card discards, LEAST calls, and winning hand reveals.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Experience 7 Cards Least in action with our 45-second interactive preview video. See how card dealing, discard sets, Joker ranks, and Least declarations work in real time.
        </p>
        ${navHtml}
      </article>
    `
  }
];

console.log('[SEO Prerender] Starting static HTML generation for 7 Cards Least cluster routes...');

routes.forEach(route => {
  if (!fs.existsSync(route.dir)) {
    fs.mkdirSync(route.dir, { recursive: true });
  }

  let routeHtml = templateHtml;

  // Replace Title
  if (route.title) {
    routeHtml = routeHtml.replace(/<title>.*?<\/title>/gi, `<title>${route.title}</title>`);
    routeHtml = routeHtml.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${route.title}" />`);
    routeHtml = routeHtml.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${route.title}" />`);
    routeHtml = routeHtml.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${route.title}" />`);
  }

  // Replace Description
  if (route.description) {
    routeHtml = routeHtml.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${route.description}" />`);
    routeHtml = routeHtml.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${route.description}" />`);
    routeHtml = routeHtml.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${route.description}" />`);
  }

  // Replace Canonical & OG URL
  if (route.canonical) {
    routeHtml = routeHtml.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${route.canonical}" />`);
    routeHtml = routeHtml.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${route.canonical}" />`);
    routeHtml = routeHtml.replace(/<meta name="twitter:url" content=".*?" \/>/gi, `<meta name="twitter:url" content="${route.canonical}" />`);
  }

  // Inject or update BreadcrumbList inside main schema graph
  if (route.breadcrumbs) {
    const breadcrumbJson = JSON.stringify(route.breadcrumbs, null, 12);
    routeHtml = routeHtml.replace(
      /"@type": "BreadcrumbList",[\s\S]*?"itemListElement": \[[\s\S]*?\]/,
      `"@type": "BreadcrumbList",\n          "@id": "${route.canonical}#breadcrumb",\n          "itemListElement": ${breadcrumbJson}`
    );
  }

  if (route.redirect) {
    const metaRedirect = `  <meta http-equiv="refresh" content="0;url=${route.canonical}" />\n    <script>window.location.replace("${route.canonical}");</script>\n  </head>`;
    routeHtml = routeHtml.replace('</head>', metaRedirect);
  }

  // Update fallback Semantic HTML inside <div id="root">
  const bodyContent = route.fullHtml || `
    <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
      <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">${route.h1 || route.title}</h1>
      <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">${route.h2 || ''}</h2>
      <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">${route.description || ''}</p>
      ${navHtml}
    </article>
  `;

  const fallbackHtml = `
    <div id="root">
      <main id="main-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; width: 100%; background-color: #062d12; color: #ffffff; text-align: center; padding: 20px; box-sizing: border-box; flex: 1;">
        ${bodyContent}
      </main>
    </div>`;

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/, fallbackHtml);

  const targetFile = path.join(route.dir, 'index.html');
  fs.writeFileSync(targetFile, routeHtml, 'utf-8');
  console.log(`[SEO Prerender] Generated: ${path.relative(distDir, targetFile)}`);
});

console.log('[SEO Prerender] Successfully pre-rendered static HTML for all 7 Cards Least cluster routes!');
