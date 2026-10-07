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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Play Free With Friends &amp; AI</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">The ultimate online portal for 7 Cards Least rules, strategy, and real-time multiplayer card games.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Welcome to <strong>7 Cards Least Online</strong> on cards.gnanamai.com! 7 Cards Least (also known as 7 Cards Game, Low Hand Rummy, or Seven Cards Least) is a fast-paced shedding card game played with 7 cards dealt to each player. Unlike traditional card games where accumulating high points leads to victory, the core objective of 7 Cards Least is to achieve the <em>lowest cumulative hand score</em> across rounds by discarding high-value cards, forming matching rank sets or suited runs, and declaring <strong>LEAST!</strong> when your hand total drops to 10 points or less.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎴 Card Point Values &amp; Scoring Overview</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">
          Understanding point values is critical for effective card shedding. Every card remaining in your hand at the end of a round adds to your round score penalty:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point (the lowest standard card value).</li>
          <li><strong style="color: #ffffff;">Number Cards (2 to 10):</strong> Face Value (2–10 points each).</li>
          <li><strong style="color: #ffffff;">Face Cards (J, Q, K):</strong> 10 Points each (high liability cards to shed early).</li>
          <li><strong style="color: #ffffff;">Table Joker Wildcard:</strong> 0 Points (determined by the face-up card during table setup).</li>
          <li><strong style="color: #ffffff;">Least Declaration Threshold:</strong> Total hand score must be 10 points or less to call Least.</li>
          <li><strong style="color: #ffffff;">False Call Penalty:</strong> An 80-point penalty is assessed if an opponent holds an equal or lower score upon reveal.</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎮 Flexible Game Modes &amp; Features</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Whether you want to play instant solo matches or host private games with friends, cards.gnanamai.com provides seamless cross-platform gameplay:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Real-Time Online Multiplayer:</strong> Create private room lobbies with unique 4-digit codes, share WhatsApp invite links, and play with 2 to 8 real players in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">online multiplayer mode</a>.</li>
          <li><strong style="color: #ffffff;">Singleplayer AI Practice:</strong> Play against 1 to 7 smart computer bots with zero wait times in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">play against AI mode</a>.</li>
          <li><strong style="color: #ffffff;">Custom Match Rules:</strong> Adjust round counts, turn timers (60-second limit or infinite), and felt table themes.</li>
          <li><strong style="color: #ffffff;">Comprehensive Guides:</strong> Master game details with our <a href="https://cards.gnanamai.com/7-cards-least" style="color: #38bdf8; text-decoration: underline;">7 Cards Least Guide</a>, review the <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official rules</a>, read the <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play tutorial</a>, explore <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">winning strategies</a>, or check out our <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; text-decoration: underline;">frequently asked questions</a>.</li>
        </ul>
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
    h2: 'Master the rules, scoring, discards, and winning strategies for 7 Cards Least.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least Guide", "item": "https://cards.gnanamai.com/7-cards-least" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Official Guide &amp; Portal</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Master the rules, scoring, discards, and winning strategies for 7 Cards Least.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          <strong>7 Cards Least</strong> (commonly known as 7 Cards Least Game Online, 7 card game, or low hand rummy) is a classic shedding card game played with a standard 52-card deck. As a popular lowest score card game, 7 Cards Least flips traditional card mechanics upside down: players aim to shed high-point cards, minimize their hand total, and finish each match with the least score.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎴 Objective of Getting the Lowest Score</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          The primary goal in 7 Cards Least is to achieve the lowest hand point total at the end of every round. Players are dealt 7 cards each. Holding face cards like Jacks, Queens, and Kings adds 10 penalty points per card to your hand. To win, players strategically discard pairs, triples, or suited runs, hold zero-point Jokers, and call <strong>LEAST!</strong> when their total hand score reaches 10 points or fewer.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">📋 Card Point Values &amp; Card Scoring</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">
          Card scoring in 7 Cards Least is straightforward yet highly tactical:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point (the most valuable standard card for keeping hand totals low).</li>
          <li><strong style="color: #ffffff;">Number Cards (2 to 10):</strong> Face Value (2 to 10 points based on rank).</li>
          <li><strong style="color: #ffffff;">Face Cards (J, Q, K):</strong> 10 Points each (heavy point burdens to shed early).</li>
          <li><strong style="color: #ffffff;">Table Joker Wildcard:</strong> 0 Points (established by the face-up setup card during table deal).</li>
          <li><strong style="color: #ffffff;">Least Call Requirement:</strong> Hand total must be 10 points or less to call Least.</li>
          <li><strong style="color: #ffffff;">False Call Penalty:</strong> An 80-point penalty is added if an opponent has an equal or lower score.</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🕹️ Gameplay: Drawing and Discarding</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Understanding how the game works during each turn is key to winning:
        </p>
        <ol style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>Dealing:</strong> 7 cards are dealt to each player. 1 card is turned face-up on the table to determine the zero-point Joker rank, and 1 card starts the Discard Pile.</li>
          <li><strong>Discarding:</strong> On your turn, select a single card, a matching set (e.g. 9♠-9♥-9♦), or a suited numerical sequence (e.g. 4♣-5♣-6♣) to drop onto the Discard Pile.</li>
          <li><strong>Drawing:</strong> Draw one replacement card from either the face-down Draw Deck or the top face-up card of the Discard Pile.</li>
          <li><strong>Match &amp; Skip:</strong> If a player discards a card matching the rank of the current Discard Pile top card, adjacent players can drop matching cards for extra shedding.</li>
        </ol>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🏆 How a Round Ends &amp; How the Winner Is Determined</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A round ends when a player calls <strong>LEAST!</strong> during their turn. All players reveal their remaining cards. If the caller's score is strictly lower than every opponent's hand, the caller wins the round and receives 0 penalty points, while opponents score their remaining hand values. However, if an opponent holds an equal or lower score, the caller suffers a severe 80-point penalty! Across a match of multiple rounds, scores accumulate, and the player with the least score when others hit the point limit is crowned champion.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🌐 Playing With Friends &amp; Playing Online</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Playing online is 100% free on cards.gnanamai.com. You can create private room code lobbies to <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">play with friends and family</a> across mobile and desktop browsers, or practice solo in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">singleplayer mode against AI</a>. For detailed guidelines, check out the <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official 7 Cards Least rules</a>, learn <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play step-by-step</a>, explore <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">card shedding strategy</a>, or visit our <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; text-decoration: underline;">FAQ section</a>.
        </p>
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least Guide", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "Official Rules", "item": "https://cards.gnanamai.com/7-cards-least/rules" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Official Rules &amp; Scoring Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Complete guide to card values, turn flow, discard combinations, Joker wildcards, and penalties.</h2>
        
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">1. Deck Setup &amp; Dealing</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          7 Cards Least is played with a standard 52-card deck without physical jokers. At the start of each round, 7 cards are dealt to each player. One card is flipped face-up in the center to establish the zero-point Table Joker rank for the round, and a second card is flipped face-up to begin the Discard Pile. The remaining undealt cards form the face-down Draw Deck.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">2. Card Values &amp; Scoring System</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">
          Cards remaining in your hand at the end of a round represent penalty points. The point breakdown is strictly defined:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point.</li>
          <li><strong style="color: #ffffff;">2 to 10:</strong> Face Value (2, 3, 4, 5, 6, 7, 8, 9, 10 points).</li>
          <li><strong style="color: #ffffff;">Jack, Queen, King (J, Q, K):</strong> 10 Points each.</li>
          <li><strong style="color: #ffffff;">Table Joker Rank:</strong> 0 Points (all cards matching the setup card rank count as 0).</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">3. Valid Discard Combinations &amp; Turn Flow</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          On your turn, you must discard valid cards onto the Discard Pile before drawing a replacement card. Valid discards include single cards, matching rank sets (e.g. 10♥-10♦), or suited runs of 3+ consecutive cards (e.g. 5♠-6♠-7♠). After discarding, draw one replacement card from either the face-down Draw Deck or top card of the Discard Pile.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">4. Declaring LEAST! &amp; The 80-Point Wrong Call Penalty</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When your total hand score is 10 points or less, you may declare <strong>LEAST!</strong> during your turn. All hands are instantly revealed. If your hand total is strictly lower than every opponent, you score 0 penalty points for the round, while opponents score their remaining hand values. However, if any opponent holds an equal or lower score, you have committed a false call and receive an <strong>80-point penalty</strong>!
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">5. Additional Guides &amp; Resources</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Learn more with our <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">step-by-step how to play walkthrough</a>, study <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">winning card shedding strategies</a>, test your skills in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">online multiplayer</a>, practice against <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">computer AI bots</a>, or read the <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; text-decoration: underline;">7 Cards Least FAQ</a>.
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least Guide", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "How to Play", "item": "https://cards.gnanamai.com/7-cards-least/how-to-play" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">How to Play 7 Cards Least – Step-by-Step Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">A beginner-friendly walkthrough to dealing cards, drawing, discarding, and calling Least.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Learning <strong>7 Cards Least</strong> is fast and highly engaging for players of all skill levels! This beginner-friendly walkthrough guides you step-by-step through every phase of a match, from entering a table to declaring Least for victory.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 1: Join or Host a Room</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Enter your player name on cards.gnanamai.com. Choose between joining an instant <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">singleplayer match against computer AI bots</a> or creating a private room lobby to <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">play multiplayer online with friends</a> using a unique 4-digit room code.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 2: Evaluate Your Dealt Hand</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Each player receives 7 dealt cards. Examine your hand to spot heavy point liabilities—especially face cards (Jacks, Queens, Kings) worth 10 points each. Look for Aces (1 pt), matching pairs, suited sequences, and any cards matching the zero-point Table Joker setup card.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 3: Discard High-Point Cards &amp; Combinations</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          On your turn, discard a single card, a matching rank pair/triple (e.g. 8♥-8♦), or a suited numerical sequence (e.g. 4♣-5♣-6♣) onto the Discard Pile. Discarding multi-card combinations sheds maximum points in one move.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 4: Draw a Replacement Card</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          After discarding, pick up one replacement card from either the face-down Draw Deck or the face-up Discard Pile to keep your hand size balanced at 7 cards.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 5: Declare LEAST! for the Win</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When your total hand sum drops to 10 points or lower, click <strong>LEAST!</strong> during your turn. Hands are revealed. If your score is the lowest, you score 0 penalty points for the round! Review our <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official rules and scoring table</a>, study expert <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">7 Cards Least strategies</a>, or visit our <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; text-decoration: underline;">FAQ section</a>.
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least Guide", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "Strategy & Tips", "item": "https://cards.gnanamai.com/7-cards-least/strategy" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Winning Strategy &amp; Tactics</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Expert tactics for managing hand values, timing Least calls, and outplaying opponents.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Winning consistently at <strong>7 Cards Least</strong> requires a balance of aggressive point shedding, hand tracking, and risk management when calling Least. Here are key strategy tactics used by top players:
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">1. Early Game: Dump Face Cards &amp; Tens</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Always prioritize discarding Jacks, Queens, Kings, and 10s during your first 3 turns. Holding unmatched 10-point face cards creates massive liability if an opponent calls Least quickly.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">2. Multi-Card Discard Optimization</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Focus on building matching rank pairs/triples or suited runs (e.g. 6♥-7♥-8♥). Discarding 2 to 4 cards in a single move rapidly drops your total hand sum in fewer turns than single-card discards.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">3. Tactical Zero-Point Joker Preservation</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Cards matching the Table Joker setup rank count as 0 points. Preserve zero-point Jokers to substitute in suited sequences or hold them to guarantee a zero-point hand for an unchallengeable Least declaration.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">4. Discard Pile Tracking &amp; Safe Least Thresholds</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Track which cards opponents draw from the Discard Pile to estimate their remaining hand points. Avoid declaring Least at 8 to 10 points if opponents have collected low Aces or Jokers; target 0 to 5 points to prevent the 80-point wrong call penalty.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">5. Additional Gameplay Guides</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Check out the <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official 7 Cards Least rules</a>, learn <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play step-by-step</a>, practice in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">singleplayer against computer AI</a>, or challenge friends in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">online multiplayer mode</a>.
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least Guide", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://cards.gnanamai.com/7-cards-least/faq" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Frequently Asked Questions</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Everything you need to know about rules, turns, scoring, online multiplayer, and AI bots.</h2>
        
        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: What is 7 Cards Least and how does it work?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: 7 Cards Least is a shedding card game played with 7 cards per player where the objective is to finish each round with the lowest hand point score by discarding high-value cards and calling Least when your hand total is 10 points or less.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Is 7 Cards Least free to play online?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Yes! 7 Cards Least is 100% free to play on cards.gnanamai.com directly in web browsers on desktop, tablet, and mobile with no app download required.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: How are card point values scored?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Ace = 1 point, Number cards (2–10) = face value, Face cards (J, Q, K) = 10 points each, and cards matching the Table Joker setup card = 0 points.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: What happens on a false or wrong Least call?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: If an opponent holds an equal or lower hand score when Least is declared, the caller is penalized with an 80-point penalty!
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can I play with friends or AI computer bots?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Both! You can host private 4-digit room code lobbies in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">online multiplayer mode</a> or practice solo against 1 to 7 computer bots in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">play against AI mode</a>. For full rules and strategies, explore our <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official rules page</a>, read <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play</a>, or study <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">winning strategies</a>.
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Multiplayer Mode", "item": "https://cards.gnanamai.com/multiplayer" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Online Multiplayer</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Create private rooms, invite friends via WhatsApp, or join instant online player tables.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Experience real-time multiplayer <strong>7 Cards Least</strong> online with friends, family, or online card players across desktop, mobile, and tablet browsers on cards.gnanamai.com.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">⚡ Private Lobbies &amp; 4-Digit Room Codes</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Create a private room in 1 click! Host games for 2 to 8 players. Customize match round counts (from 1 to 20 rounds) and turn timers (60-second limit or unlimited mode). Share the generated 4-digit room code or WhatsApp invite link to let friends join instantly with zero app download.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">💬 Live Table Chat &amp; Player Reactions</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Interact with opponents during turns using real-time table chat messages and express your emotions with animated card player reactions. Enjoy fast-paced, smooth gameplay optimized for touch screens and desktop devices.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">📚 Related Guides &amp; Modes</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Explore the <a href="https://cards.gnanamai.com/7-cards-least" style="color: #38bdf8; text-decoration: underline;">7 Cards Least main guide</a>, review <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official scoring rules</a>, read <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play</a>, or practice solo in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">play against AI mode</a>.
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
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Play Against AI", "item": "https://cards.gnanamai.com/play-against-ai" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Against Computer AI</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Practice your card shedding tactics singleplayer against smart computer bots.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Practice <strong>7 Cards Least</strong> solo anytime with zero wait! Challenge 1 to 7 intelligent computer AI bots in singleplayer mode directly in your browser.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">🤖 Smart Computer Bot Opponents</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Test card shedding tactics, evaluate zero-point Table Joker plays, and hone your Least call timing against computer bots engineered to simulate realistic card decisions, set formations, and strategic declarations.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">⚡ Instant Fast-Paced Matches</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Enjoy zero matchmaking delays and zero turn timer waits. Play hundreds of practice hands per hour to master card combinations before competing in online player matches.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">📚 Related Guides</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Read the <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official rules</a>, study <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">winning strategies</a>, or jump into <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">multiplayer mode with friends</a>.
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
