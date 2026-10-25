const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[SEO Prerender Error] dist/index.html does not exist. Run "npx expo export --platform web" first.');
  process.exit(1);
}

let templateHtml = fs.readFileSync(indexPath, 'utf-8');

// Defensively strip legacy geo-targeting tags from template
templateHtml = templateHtml.replace(/<!-- Geo-Targeting Tags -->[\s\S]*?<meta name="ICBM" content="[^"]*" \/>\s*/gi, '');
templateHtml = templateHtml.replace(/<meta name="geo\.[^"]+" content="[^"]*" \/>\s*/gi, '');
templateHtml = templateHtml.replace(/<meta name="ICBM" content="[^"]*" \/>\s*/gi, '');

// Ensure cookie banner links to /privacy instead of javascript:void(0)
templateHtml = templateHtml.replace(/href="javascript:void\(0\)" id="link-open-privacy"/gi, 'href="/privacy" id="link-open-privacy"');

// Clean up legacy duplicate directories to save crawl budget
const legacyDirs = ['7cards-least-', '7cards-least', 'rules', 'how-to-play', 'strategy', 'faq'];
legacyDirs.forEach(dirName => {
  const fullPath = path.join(distDir, dirName);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`[SEO Prerender] Removed legacy duplicate directory: dist/${dirName}`);
  }
});

const navHtml = `
  <nav aria-label="Quick Links" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 15px; text-align: center;">
    <a href="https://cards.gnanamai.com/" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Play Online</a> |
    <a href="https://cards.gnanamai.com/7-cards-least" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">7 Cards Least Guide</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Official Rules</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">How to Play</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">Strategy &amp; Tips</a> |
    <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; margin: 0 8px; text-decoration: none; font-weight: bold;">FAQ</a> |
    <a href="https://cards.gnanamai.com/about" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">About</a> |
    <a href="https://cards.gnanamai.com/contact" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Contact</a> |
    <a href="https://cards.gnanamai.com/privacy" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Privacy</a>
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
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "VideoGame",
          "@id": "https://cards.gnanamai.com/#game",
          "name": "7 Cards Least",
          "alternateName": "Seven Cards Least",
          "url": "https://cards.gnanamai.com/",
          "description": "A tactical low-hand card shedding game where the goal is to finish with the lowest score at the table.",
          "genre": ["Card Game", "Strategy Game"],
          "gamePlatform": "Web Browser",
          "applicationCategory": "Game",
          "operatingSystem": "Any",
          "playMode": ["SinglePlayer", "MultiPlayer"],
          "numberOfPlayers": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 8
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Nmishraa",
            "url": "https://cards.gnanamai.com/"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://cards.gnanamai.com/#website",
          "url": "https://cards.gnanamai.com/",
          "name": "7 Cards Least",
          "description": "Play 7 Cards Least Online – Free real-time multiplayer card shedding game with friends or computer AI.",
          "publisher": {
            "@type": "Organization",
            "name": "7 Card Game",
            "url": "https://cards.gnanamai.com/",
            "logo": "https://cards.gnanamai.com/assets/logo.png"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Play Free With Friends &amp; AI</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">A tactical low-hand card shedding game where the goal is to finish with the lowest score at the table.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          <strong>7 Cards Least</strong> is an indie card shedding game built around calculated risk, card deduction, and timing. Instead of trying to build high-value tricks or meld points, each player is dealt 7 cards and works to shed heavy liabilities. When you calculate that your hand sum has dropped to 10 points or less, you can declare <strong>"LEAST!"</strong> on your turn. If your hand is strictly lower than every opponent, you take 0 penalty points; but if an opponent ties or holds a lower score, you take an <strong>80-point penalty</strong>.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎴 Card Values, Relative Scoring &amp; Penalties</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">
          In 7 Cards Least, card ranks determine how fast you can safely reach declaring range:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Number Cards (2 to 10):</strong> Worth their exact face value (2–10 points).</li>
          <li><strong style="color: #ffffff;">Face Cards (J, Q, K):</strong> Flat 10 points each. Unmatched face cards are your biggest early liability.</li>
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point. Low anchor cards that make ideal sequences like A-2-3.</li>
          <li><strong style="color: #ffffff;">Table Joker (0 Points):</strong> At round setup, the dealer flips one card into the center. Any card matching that rank—regardless of suit—counts as 0 points for the entire round.</li>
          <li><strong style="color: #ffffff;">Relative Difference Scoring:</strong> When a caller wins, opponents take penalty points equal only to the difference (their hand score minus the winning score). You are not penalized your full hand score unless the winner held 0 points.</li>
          <li><strong style="color: #ffffff;">The 80-Point Blunder:</strong> The caller must strictly beat every opponent. In a tie or loss, the caller receives an 80-point penalty, while the true lowest player wins with 0 points.</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🕹️ How a Turn Works &amp; How to Start Playing</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Each turn follows a clean, tactical loop:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">1. Discard Phase:</strong> Play a single card, a matching set of 2+ cards of the same rank (e.g. 8♠ 8♦), or a suited run of 3+ consecutive cards (e.g. 5♣ 6♣ 7♣).</li>
          <li><strong style="color: #ffffff;">2. Match &amp; Skip Shortcut:</strong> If your discard matches the rank currently on top of the discard pile, your turn ends immediately without drawing! Your hand size permanently shrinks by one card.</li>
          <li><strong style="color: #ffffff;">3. Draw Phase:</strong> If not skipped, draw 1 card from either the face-down deck or the face-up discard pile. If a drawn deck card matches your discard rank, it drops immediately to the pile.</li>
          <li><strong style="color: #ffffff;">4. Calling Least:</strong> Before discarding on your turn, if your total hand score is 10 points or fewer, tap "LEAST!" to stop the round and trigger the showdown.</li>
          <li><strong style="color: #ffffff;">Multiplayer &amp; Solo AI:</strong> Jump into a game using Quick Match above, practice solo against computer bots in <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">AI mode</a>, or create private lobbies with WhatsApp invites in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">multiplayer mode</a>.</li>
        </ul>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least',
    dir: path.join(distDir, '7-cards-least'),
    title: '7 Cards Least Game Online – Official Guide & Portal',
    description: 'Comprehensive guide to 7 Cards Least card game. Master deck setup, zero-point Joker wildcards, turn sequences, Match & Skip, and 80-point penalty.',
    canonical: 'https://cards.gnanamai.com/7-cards-least',
    h1: '7 Cards Least Game Online – Official Guide & Portal',
    h2: 'Master the rules, scoring, discards, and winning strategies for 7 Cards Least.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://cards.gnanamai.com/7-cards-least#article",
          "headline": "7 Cards Least Game Online – Official Guide & Portal",
          "url": "https://cards.gnanamai.com/7-cards-least",
          "description": "Comprehensive guide to 7 Cards Least card game. Master deck setup, zero-point Joker wildcards, turn sequences, Match & Skip, and 80-point penalty.",
          "inLanguage": "en-US",
          "author": {
            "@type": "Person",
            "name": "Nmishraa",
            "url": "https://cards.gnanamai.com/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "7 Card Game",
            "url": "https://cards.gnanamai.com/",
            "logo": "https://cards.gnanamai.com/assets/logo.png"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/7-cards-least#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Game Online – Official Guide &amp; Portal</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">An indie tactical card game where the lowest hand score wins. Learn deck setup, zero-point table Jokers, Match &amp; Skip mechanics, and tournament survival.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          <strong>7 Cards Least</strong> is an indie card shedding game built around calculated risk, card deduction, and timing. Each player is dealt 7 cards from a standard deck (or two decks for tables with 6 to 8 players). Unlike traditional rummy where you keep cards to meld long sequences, your entire goal here is hand reduction: stripping out heavy point cards while maneuvering into a sub-10 point hand to declare Least.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎴 Deck Setup &amp; The Table Joker Wildcard</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A game uses a standard 52-card deck (single deck for 2 to 5 players; two shuffled decks for 6 to 8 players) with no physical jokers. At the beginning of each round, 1 card is flipped face-up in the center to establish the <strong>zero-point Joker rank</strong>. Any card matching this rank in any player's hand scores <strong>0 points</strong>! For example, if a 7 is flipped, all four 7s (7♠, 7♥, 7♦, 7♣) count as 0 points. A second card is flipped face-up to begin the Discard Pile, and 7 cards are dealt to each player.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">📋 Card Point Values</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">
          Hand scores are calculated by summing the point values of all remaining cards:
        </p>
        <ul style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong style="color: #ffffff;">Ace (A):</strong> 1 Point (the lowest standard card).</li>
          <li><strong style="color: #ffffff;">Number Cards (2 to 10):</strong> Face Value (2–10 points based on rank).</li>
          <li><strong style="color: #ffffff;">Face Cards (Jack, Queen, King):</strong> 10 Points each (high liability cards to discard early).</li>
          <li><strong style="color: #ffffff;">Table Joker Rank:</strong> 0 Points (established by the round setup flip).</li>
          <li><strong style="color: #ffffff;">Least Calling Window:</strong> Total hand score must be 10 points or less to call Least.</li>
          <li><strong style="color: #ffffff;">False Call Penalty:</strong> An 80-point penalty is assessed if an opponent holds an equal or lower score.</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🕹️ Turn Progression &amp; Actions</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Turns proceed clockwise around the table. Each turn involves two distinct phases:
        </p>
        <ol style="line-height: 1.8; color: #94a3b8; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>Phase 1 – Discarding:</strong> Drop a single card, a matching set (e.g. 9♠-9♥-9♦), or a suited sequence (e.g. 4♣-5♣-6♣) onto the Discard Pile.</li>
          <li><strong>Match &amp; Skip:</strong> If your discard matches the rank of the current top discard card, your turn concludes immediately without drawing, permanently shrinking your hand.</li>
          <li><strong>Phase 2 – Drawing:</strong> If not skipped, draw 1 card from either the face-down Draw Deck or the face-up Discard Pile. If a drawn deck card matches your discard rank, it drops immediately to the discard pile without entering hand.</li>
        </ol>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🏆 Calling "LEAST!" &amp; 80-Point Penalty</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When your hand sum drops to 10 points or less, you can call <strong>LEAST!</strong> on your turn before discarding. All hands are revealed: if your hand is strictly lower than every opponent, you win the round with 0 penalty points. Opponents receive points equal to their hand score minus your winning score. However, if any opponent ties or holds a lower score, you incur an <strong>80-point penalty</strong>, while the true lowest player wins with 0 points. Players reaching 200 cumulative points across rounds are eliminated.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🌐 Explore Related Guides</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Deepen your expertise with our <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; text-decoration: underline;">official scoring rules</a>, learn <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; text-decoration: underline;">how to play step-by-step</a>, study <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; text-decoration: underline;">winning strategies &amp; hand examples</a>, review the <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; text-decoration: underline;">FAQ section</a>, play with friends in <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; text-decoration: underline;">online multiplayer</a>, or practice against <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; text-decoration: underline;">computer AI bots</a>.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least/rules',
    dir: path.join(distDir, '7-cards-least', 'rules'),
    title: '7 Cards Least Official Rules & Scoring Guide (Ace=1, Face=10, Jokers=0)',
    description: 'Official 7 Cards Least rules & scoring guide. Complete point breakdown (Ace=1, 2-10 face value, J/Q/K=10, Joker=0), match & skip turns, and 80-point wrong call penalty.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/rules',
    h1: '7 Cards Least Official Rules & Scoring Guide',
    h2: 'Complete guide to card values, turns, discard combinations, Joker wildcards, and penalties.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "Rules", "item": "https://cards.gnanamai.com/7-cards-least/rules" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://cards.gnanamai.com/7-cards-least/rules#article",
          "headline": "7 Cards Least Official Rules & Scoring Guide",
          "url": "https://cards.gnanamai.com/7-cards-least/rules",
          "description": "Official 7 Cards Least rules & scoring guide. Complete point breakdown (Ace=1, 2-10 face value, J/Q/K=10, Joker=0), match & skip turns, and 80-point wrong call penalty.",
          "inLanguage": "en-US",
          "author": {
            "@type": "Person",
            "name": "Nmishraa",
            "url": "https://cards.gnanamai.com/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "7 Card Game",
            "url": "https://cards.gnanamai.com/",
            "logo": "https://cards.gnanamai.com/assets/logo.png"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/7-cards-least/rules#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
            { "@type": "ListItem", "position": 3, "name": "Rules", "item": "https://cards.gnanamai.com/7-cards-least/rules" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Official Rules &amp; Scoring Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Complete guide to card values, turn flow, discard combinations, Joker wildcards, and penalties.</h2>
        
        <!-- Official Game Overview & Scoring Table -->
        <div style="background: rgba(56, 189, 248, 0.08); border: 2px solid #38bdf8; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
          <h3 style="font-size: 1.2rem; color: #38bdf8; margin: 0 0 10px; font-weight: bold;">⚡ How 7 Cards Least is Played (Official Rules)</h3>
          <p style="color: #f1f5f9; line-height: 1.7; font-size: 0.98rem; margin: 0 0 14px;">
            In <strong>7 Cards Least</strong>, players are dealt 7 cards from a standard 52-card deck (or two decks for 6 to 8 players). Unlike traditional card games that reward point hoarding, the goal here is to shed heavy liabilities and finish each round with the <strong>lowest total hand point count</strong>. You do this by discarding high-value face cards (10 pts), assembling matching sets or suited runs, and calling <em>"LEAST!"</em> before discarding when your hand drops to 10 points or fewer.
          </p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem; color: #cbd5e1;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(56, 189, 248, 0.4); color: #38bdf8;">
                  <th style="padding: 8px 10px;">Card Rank</th>
                  <th style="padding: 8px 10px;">Point Value</th>
                  <th style="padding: 8px 10px;">Shedding Strategy</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">Ace (A)</td>
                  <td style="padding: 8px 10px; color: #34d399; font-weight: bold;">1 Point</td>
                  <td style="padding: 8px 10px;">Keep in hand (lowest standard card value)</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">2 through 10</td>
                  <td style="padding: 8px 10px; color: #fbbf24;">Face Value (2–10 pts)</td>
                  <td style="padding: 8px 10px;">Discard high numbers (8–10); keep low numbers (2–3)</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">Jack, Queen, King</td>
                  <td style="padding: 8px 10px; color: #f87171; font-weight: bold;">10 Points Each</td>
                  <td style="padding: 8px 10px;">Discard immediately in sets or as singles</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">Table Joker</td>
                  <td style="padding: 8px 10px; color: #a78bfa; font-weight: bold;">0 Points</td>
                  <td style="padding: 8px 10px;">Hold (zero-point wildcard for lowest hand score)</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">Calling Least Threshold</td>
                  <td style="padding: 8px 10px; color: #38bdf8; font-weight: bold;">≤ 10 Points</td>
                  <td style="padding: 8px 10px;">Must hold 10 points or less to declare Least</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; font-weight: bold; color: #fff;">Wrong Call Penalty</td>
                  <td style="padding: 8px 10px; color: #ef4444; font-weight: bold;">+80 Points</td>
                  <td style="padding: 8px 10px;">Assessed if an opponent ties or holds a lower hand</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
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
          On your turn, you must discard valid cards onto the Discard Pile before drawing a replacement card. Valid discards include single cards, matching rank sets (e.g. 10♥-10♦), or suited runs of 3+ consecutive cards (e.g. 5♠-6♠-7♠). After discarding, draw one replacement card from either the face-down Draw Deck or top card of the Discard Pile. If your discard matches the current pile top rank, Match &amp; Skip triggers: your turn ends immediately without drawing.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">4. Declaring LEAST! &amp; Concrete Penalty Examples</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When your total hand score is 10 points or less, you may declare <strong>LEAST!</strong> during your turn.
          <br /><br />
          <strong>Scenario A – Victory:</strong> Caller holds 4 points. Opponent holds 9 points. Caller wins the round with 0 penalty points, while opponent scores 5 points (9 − 4).
          <br /><br />
          <strong>Scenario B – False Call (80-Point Penalty):</strong> Caller declares Least with 7 points, but an opponent holds 5 points! Because the caller did not strictly beat every opponent, the caller incurs the <strong>80-point penalty</strong>.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">5. 3 Common Scoring Mistakes &amp; How to Avoid Them</h3>
        <div style="background: rgba(2, 6, 23, 0.6); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.08);">
          <p style="color: #fbbf24; font-weight: bold; margin: 0 0 6px;">Mistake 1: Calling LEAST with a Tie</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • <em>Example:</em> You declare LEAST with 6 points. An opponent also reveals 6 points.<br />
            • <strong>The Rule:</strong> The caller must strictly beat all opponents. In a tie, the caller receives the full <strong>+80 point penalty</strong>, while the opponent earns 0 points!
          </p>
          <p style="color: #fbbf24; font-weight: bold; margin: 0 0 6px;">Mistake 2: Face Card Valuation Assumptions</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • <em>Example:</em> Holding Jack, Queen, and King.<br />
            • <strong>The Rule:</strong> Jacks, Queens, and Kings each count as flat 10 points (not 11, 12, 13). They represent instant liability and should be dumped in pairs or singles early.
          </p>
          <p style="color: #fbbf24; font-weight: bold; margin: 0 0 6px;">Mistake 3: King-Ace Wrapping in Runs</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0;">
            • <em>Example:</em> Attempting to play Q♠-K♠-A♠.<br />
            • <strong>The Rule:</strong> Aces are strictly low cards worth 1 point. Suited runs can run A-2-3-4, but King-Ace wrapping is illegal.
          </p>
        </div>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">6. Additional Guides &amp; Resources</h3>
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
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "How to Play", "item": "https://cards.gnanamai.com/7-cards-least/how-to-play" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "HowTo",
          "@id": "https://cards.gnanamai.com/7-cards-least/how-to-play#howto",
          "name": "How to Play 7 Cards Least – Step-by-Step Guide",
          "description": "A beginner-friendly walkthrough to dealing cards, drawing, discarding sets & runs, and calling Least.",
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Choose Game Mode & Launch",
              "text": "Select your nickname and choose between singleplayer vs AI or multiplayer room."
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Understand Your 7 Cards & Score",
              "text": "Identify your card values: Ace=1, numbers face value, face cards=10, and matching table Joker=0 points."
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Discard High-Point Cards & Combinations",
              "text": "Discard a single card, matching rank sets, or suited runs onto the Discard Pile."
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "Draw a Replacement Card",
              "text": "Draw one card from the draw deck or the face-up discard pile, unless Match & Skip applies."
            },
            {
              "@type": "HowToStep",
              "position": 5,
              "name": "Declare LEAST! at 10 Points or Less",
              "text": "When your total hand sum drops to 10 points or less, call LEAST! on your turn to win the round with 0 points."
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/7-cards-least/how-to-play#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
            { "@type": "ListItem", "position": 3, "name": "How to Play", "item": "https://cards.gnanamai.com/7-cards-least/how-to-play" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">How to Play 7 Cards Least – Step-by-Step Guide</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">A beginner-friendly walkthrough to dealing cards, drawing, discarding, and calling Least.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Learning <strong>7 Cards Least</strong> is fast and highly engaging! This beginner-friendly walkthrough guides you step-by-step through every phase of a match, from table setup to declaring Least for victory.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 1: Join or Host a Room</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Enter your player nickname on cards.gnanamai.com. Choose between instant solo play against AI bots or creating a private room lobby to play multiplayer with friends using a unique 4-digit code.
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
          After discarding, pick up one replacement card from either the face-down Draw Deck or the face-up Discard Pile to keep your hand size balanced at 7 cards, unless Match &amp; Skip applies.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">Step 5: Declare LEAST! for the Win</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When your total hand sum drops to 10 points or lower, click <strong>LEAST!</strong> during your turn. Hands are revealed. If your score is strictly the lowest, you score 0 penalty points for the round!
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🃏 Worked Example: A Complete Turn-by-Turn Sample Round</h3>
        <div style="background: rgba(2, 6, 23, 0.6); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.08);">
          <p style="color: #34d399; font-weight: bold; margin: 0 0 6px;">1. Table Setup &amp; Dealing</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • Players: Alice, Bob, and Charlie. Each receives 7 dealt cards.<br />
            • Table Setup Card: <strong style="color: #fbbf24;">4♥</strong> is flipped. (All four 4s are Table Jokers = 0 pts!)<br />
            • Discard Pile Starter: <strong style="color: #ffffff;">8♣</strong> is flipped face-up.<br />
            • Alice's Starting Hand: K♠ (10), Q♦ (10), 9♣ (9), 5♠ (5), 5♦ (5), 4♠ (Joker = 0), A♥ (1). Hand Total = 40 pts.
          </p>

          <p style="color: #38bdf8; font-weight: bold; margin: 0 0 6px;">2. Turn 1 (Alice): High-Liability Discard</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • Action: Alice discards heavy King of Spades (K♠ = 10 pts) to the pile.<br />
            • Draw: Alice draws 2♦ (2 pts) from the face-down deck.<br />
            • Alice's New Hand: Q♦ (10), 9♣ (9), 5♠ (5), 5♦ (5), 2♦ (2), 4♠ (0), A♥ (1) = 32 pts (reduced from 40).
          </p>

          <p style="color: #fbbf24; font-weight: bold; margin: 0 0 6px;">3. Turn 2 (Bob): Tactical Match &amp; Skip</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • Bob holds K♥. Since top discard is K♠, Bob drops K♥ onto the pile!<br />
            • <strong style="color: #38bdf8;">Match &amp; Skip Triggers:</strong> Bob's discard rank matches the pile top! Bob skips drawing. His hand permanently drops from 7 cards down to 6 cards.
          </p>

          <p style="color: #38bdf8; font-weight: bold; margin: 0 0 6px;">4. Turn 4 (Alice): Multi-Card Pair Shedding</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 12px;">
            • Alice discards her matching pair of Fives (5♠ + 5♦ = 10 pts shed in one move).<br />
            • Alice draws 3♣ (3 pts) from the deck.<br />
            • Alice's Hand is now: 4♠ (Joker = 0), A♥ (1), 2♦ (2), 3♣ (3) = <strong style="color: #34d399;">Total 6 points!</strong>
          </p>

          <p style="color: #34d399; font-weight: bold; margin: 0 0 6px;">5. The Victory Declaration &amp; Hand Reveal</p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0;">
            • On her next turn, Alice's hand is ≤ 10 points. She taps <strong style="color: #fbbf24;">"LEAST!"</strong><br />
            • All hands revealed: Alice has 6 pts, Bob has 14 pts, Charlie has 23 pts.<br />
            • Outcome: Alice strictly holds the lowest score! Alice scores <strong style="color: #34d399;">0 penalty points</strong>. Bob receives +8 pts (14 − 6), Charlie receives +17 pts (23 − 6).
          </p>
        </div>
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
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "Strategy", "item": "https://cards.gnanamai.com/7-cards-least/strategy" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://cards.gnanamai.com/7-cards-least/strategy#article",
          "headline": "7 Cards Least Winning Strategy & Tactics",
          "url": "https://cards.gnanamai.com/7-cards-least/strategy",
          "description": "Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.",
          "inLanguage": "en-US",
          "author": {
            "@type": "Person",
            "name": "Nmishraa",
            "url": "https://cards.gnanamai.com/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "7 Card Game",
            "url": "https://cards.gnanamai.com/",
            "logo": "https://cards.gnanamai.com/assets/logo.png"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/7-cards-least/strategy#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
            { "@type": "ListItem", "position": 3, "name": "Strategy", "item": "https://cards.gnanamai.com/7-cards-least/strategy" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Winning Strategy &amp; Tactics</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Calculated risk management, card deduction, and call timing. Study these real tactical decisions to consistently outplay your opponents.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Winning consistently at <strong>7 Cards Least</strong> requires a balance of aggressive point shedding, hand tracking, and risk management when calling Least. Here are concrete strategy tactics tested during match development:
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">1. The Opening Dilemma: Shedding Single Face Cards vs. Holding Pairs</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Unmatched face cards (J, Q, K) are flat 10-point liabilities. If you hold an isolated King, discard it on Turn 1 immediately. However, if dealt a <strong>pair of Kings (20 points)</strong>, decide between playing safe (discarding one King on Turn 1) or holding both to dump 20 points at once on Turn 2. If opponents are drawing blind from the deck, holding the pair is generally safe; if an opponent took an Ace from the open pile, dump high cards immediately!
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">2. Multi-Card Discard Optimization</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Focus on building matching rank pairs/triples or suited runs (e.g. 6♥-7♥-8♥). Discarding 2 to 4 cards in a single move rapidly drops your total hand sum in fewer turns than single-card discards, saving up to 3 turns.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">3. Tactical Zero-Point Joker Preservation</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Cards matching the Table Joker setup rank count as 0 points. Preserve zero-point Jokers to substitute in suited sequences or hold them to guarantee a low-scoring hand for an unchallengeable Least declaration.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">4. Exploiting the Match &amp; Skip Tactic</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          When an opponent discards a card rank you also hold, drop your matching rank card to trigger Match &amp; Skip. Your turn ends without drawing, permanently reducing your hand size and accelerating your path to Least.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">5. Safe Calling Windows &amp; The "When to Call LEAST" Decision Matrix</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 14px;">
          While the game permits declaring Least at 10 points or less, declaring at 8, 9 or 10 points carries high risk of suffering an 80-point penalty. Use this contextual guidance:
        </p>
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.92rem; color: #cbd5e1; background: rgba(2, 6, 23, 0.6); border-radius: 8px;">
            <thead>
              <tr style="border-bottom: 2px solid rgba(56, 189, 248, 0.4); color: #38bdf8;">
                <th style="padding: 8px 10px;">Hand Score</th>
                <th style="padding: 8px 10px;">Risk Level</th>
                <th style="padding: 8px 10px;">Action Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 8px 10px; font-weight: bold; color: #34d399;">0 to 3 Pts</td>
                <td style="padding: 8px 10px; color: #34d399; font-weight: bold;">Very Low</td>
                <td style="padding: 8px 10px;">Call LEAST immediately. Opponents virtually never match sub-3 point hands.</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 8px 10px; font-weight: bold; color: #fbbf24;">4 to 6 Pts</td>
                <td style="padding: 8px 10px; color: #fbbf24; font-weight: bold;">Moderate</td>
                <td style="padding: 8px 10px;">Call if opponents are drawing blind from the deck; hold if an opponent took an Ace or 2 from the open pile.</td>
              </tr>
              <tr>
                <td style="padding: 8px 10px; font-weight: bold; color: #ef4444;">7 to 10 Pts</td>
                <td style="padding: 8px 10px; color: #ef4444; font-weight: bold;">High Risk</td>
                <td style="padding: 8px 10px;">High Danger. In 4+ player tables, someone usually holds ≤ 6 pts. Discard 1 more turn to avoid the 80-pt blunder.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">6. Tournament &amp; 200-Point Survival Play</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          In multi-round matches, players reaching 200 cumulative points are eliminated. If your score approaches 140+ points, prioritize survival and only call Least on near-zero hands to avoid an elimination blow.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/7-cards-least/faq',
    dir: path.join(distDir, '7-cards-least', 'faq'),
    title: '7 Cards Least FAQ – Frequently Asked Questions & Answers',
    description: 'Specific answers to detailed player questions about edge-case rules, reshuffling, Joker runs, ties, turn limits, and online multiplayer rooms.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/faq',
    h1: '7 Cards Least Frequently Asked Questions',
    h2: 'Everything you need to know about rules, turns, scoring, online multiplayer, and AI bots.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
      { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://cards.gnanamai.com/7-cards-least/faq" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FAQPage",
          "@id": "https://cards.gnanamai.com/7-cards-least/faq#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can Ace be used at both high and low ends in suited runs (e.g. A-2-3 vs Q-K-A)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "In 7 Cards Least, Ace is strictly a low card worth 1 point. Suited runs can begin with Ace (A-2-3-4), but King-Ace wrapping (e.g. Q-K-A) is not permitted."
              }
            },
            {
              "@type": "Question",
              "name": "What happens if the Draw Deck runs out of cards during an active round?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If the face-down Draw Deck is completely depleted during gameplay, our engine leaves the current top card of the discard pile face-up on the table, shuffles all previously discarded cards into a brand new draw deck with Fisher-Yates randomization, and sends a quick notification to the game chat. Play continues uninterrupted."
              }
            },
            {
              "@type": "Question",
              "name": "Can I discard cards matching the Table Joker rank as a set or sequence?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Cards matching the round's Table Joker rank score 0 points, but they retain their original rank and suit identities for set and run combinations."
              }
            },
            {
              "@type": "Question",
              "name": "What happens if two or more opponents tie for the lowest score when Least is declared?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If the caller holds more points than the opponents, the caller fails and incurs the full 80-point penalty. If two or more opponents tie for the lowest hand score, both tied opponents share round victory and receive 0 penalty points."
              }
            },
            {
              "@type": "Question",
              "name": "What happens if a player discards their entire hand on a Match & Skip?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If a player's final remaining card (or set) matches the rank on top of the discard pile, Match & Skip triggers and skips the draw phase. Their hand drops to 0 cards (0 points). On their next turn, the engine automatically declares Least for them, winning the round with 0 points."
              }
            },
            {
              "@type": "Question",
              "name": "Can I call 'Least!' on my very first turn of a round?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! If your dealt hand already totals 10 points or less—for example, if you were dealt multiple Jokers (0 pts) and low Aces—you are legally permitted to declare 'LEAST!' on your very first turn."
              }
            },
            {
              "@type": "Question",
              "name": "Do I always have to draw a card after discarding on every turn?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Standard turns require discarding valid cards followed by drawing 1 card. However, if your discard rank matches the rank of the current top card on the Discard Pile, the Match & Skip rule activates: your turn ends immediately without drawing."
              }
            },
            {
              "@type": "Question",
              "name": "How does the 200-point elimination rule work across tournament rounds?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "7 Cards Least is played across a series of rounds (customizable from 1 to 20 rounds). Points accumulate round over round. Any player whose cumulative penalty score reaches or surpasses 200 points is eliminated."
              }
            },
            {
              "@type": "Question",
              "name": "Can I play 7 Cards Least on mobile without downloading an app or signing up?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! 7 Cards Least runs completely in mobile browsers (Safari, Chrome, Firefox) on iOS and Android with no download or signup required."
              }
            },
            {
              "@type": "Question",
              "name": "Can I create private rooms to play with family and friends across different devices?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Table hosts can create private rooms with customizable rounds (1 to 20) and turn timers (60-sec or unlimited). A unique 4-digit code and direct WhatsApp link are generated."
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/7-cards-least/faq#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
            { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://cards.gnanamai.com/7-cards-least/faq" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Frequently Asked Questions</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Specific answers to detailed player questions about edge-case rules, reshuffling, Joker runs, ties, turn limits, and online multiplayer rooms.</h2>
        
        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can Ace be used at both high and low ends in suited runs (e.g. A-2-3 vs Q-K-A)?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: In 7 Cards Least, Ace is strictly a low card worth 1 point. Suited runs can begin with Ace (A-2-3-4), but King-Ace wrapping (e.g. Q-K-A) is not permitted. This makes Aces uniquely valuable for anchoring low-scoring suited sequences.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: What happens if the Draw Deck runs out of cards during an active round?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: If the face-down Draw Deck is completely depleted during gameplay, our engine leaves the current top card of the discard pile face-up on the table, shuffles all previously discarded cards into a brand new draw deck with Fisher-Yates randomization, and sends a quick notification to the game chat. Play continues uninterrupted.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: What happens if a player discards their entire hand on a Match &amp; Skip?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: If a player's final remaining card (or set) matches the rank on top of the discard pile, Match &amp; Skip triggers and skips the draw phase. Their hand drops to 0 cards (0 points). On their next turn, the engine automatically declares Least for them, winning the round with 0 points.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can I discard cards matching the Table Joker rank as a set or sequence?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Yes! Cards matching the round's Table Joker rank score 0 points, but they retain their original rank and suit identities for set and run combinations. You can discard a set of Jokers or include a Joker in a suited sequence.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: What happens if two or more opponents tie for the lowest score when Least is declared?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: If the caller holds more points than the opponents, the caller fails and incurs the full 80-point penalty. If two or more opponents tie for the lowest hand score (e.g. both hold 3 points), both tied opponents share round victory and receive 0 penalty points, while all other players score their point difference.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can I call "Least!" on my very first turn of a round?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Yes! If your dealt hand already totals 10 points or less—for example, if you were dealt multiple Jokers (0 pts) and low Aces—you are legally permitted to declare "LEAST!" on your very first turn.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Do I always have to draw a card after discarding on every turn?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Standard turns require discarding valid cards followed by drawing 1 card. However, if your discard rank matches the rank of the current top card on the Discard Pile, the "Match &amp; Skip" rule activates: your turn ends immediately without drawing, permanently shrinking your hand size.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: How does the 200-point elimination rule work across tournament rounds?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: 7 Cards Least is played across a series of rounds (customizable from 1 to 20 rounds). Points accumulate round over round. Any player whose cumulative penalty score reaches or surpasses 200 points is eliminated from the table. The player with the lowest score at the end wins.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can I play 7 Cards Least on mobile without downloading an app or signing up?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Yes! 7 Cards Least runs completely in mobile browsers (Safari, Chrome, Firefox) on iOS and Android. Touch gestures, tap-to-select cards, and table animations work smoothly with no app store download or signup required.
        </p>

        <h3 style="font-size: 1.2rem; color: #38bdf8; margin-top: 20px; margin-bottom: 8px;">Q: Can I create private rooms to play with family and friends across different devices?</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          A: Yes. Table hosts can create private rooms with customizable rounds (1 to 20) and turn timers (60-sec or unlimited). A unique 4-digit code and direct WhatsApp link are generated, allowing friends to join across any device.
        </p>
        ${navHtml}
      </article>
    `
  },
  {
    path: '/multiplayer',
    dir: path.join(distDir, 'multiplayer'),
    title: 'Play 7 Cards Least Online Free – Multiplayer Card Game With Friends',
    description: 'Play 7 Cards Least online for free with friends, family, or online players. Create private rooms, join with 4-digit codes, instant play in your browser with no download.',
    canonical: 'https://cards.gnanamai.com/multiplayer',
    robots: 'noindex, follow',
    h1: 'Play 7 Cards Least Online Free – Multiplayer',
    h2: 'Create private rooms, invite friends via WhatsApp, or join instant online player tables.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Multiplayer Mode", "item": "https://cards.gnanamai.com/multiplayer" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://cards.gnanamai.com/multiplayer#webapp",
          "name": "Play 7 Cards Least Online Free – Multiplayer",
          "url": "https://cards.gnanamai.com/multiplayer",
          "description": "Create private 4-digit room codes, share WhatsApp invite links, and play real-time 7 Cards Least multiplayer with friends and online opponents.",
          "applicationCategory": "GameApplication",
          "gamePlatform": "Web Browser",
          "operatingSystem": "All"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/multiplayer#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "Multiplayer Mode", "item": "https://cards.gnanamai.com/multiplayer" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">Play 7 Cards Least Online Free – Multiplayer</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Create private rooms, invite friends via WhatsApp, or join instant online player tables.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Experience real-time multiplayer <strong>7 Cards Least</strong> online with friends, family, or online card players across desktop, mobile, and tablet browsers on cards.gnanamai.com.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">⚡ Instant Quick Match &amp; Seamless Fill</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Jump straight into a live game! Quick Match instantly pairs you with real players or adaptive computer AI bots (AlphaBot, BetaBot, OmegaBot) so your table is always full and playable with zero waiting.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">🔒 Private Tables, WhatsApp Links &amp; 4-Digit Codes</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Hosting game night with friends? Set up a private table, customize your match length (1 to 20 rounds), and share your 4-digit room code or WhatsApp invite link. Anyone can tap the link and join from their phone or computer browser without downloading an app or creating an account.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 20px; margin-bottom: 10px;">💬 Real-Time State Sync &amp; Table Timers</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Turns, discards, and score calculations are synchronized in real time across all active players. Waiting rooms stay active for 15 minutes before expiring. Once a tournament concludes, players have 5 minutes to request a rematch together before the table closes.
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
    robots: 'noindex, follow',
    h1: '7 Cards Least Against Computer AI',
    h2: 'Practice your card shedding tactics singleplayer against smart computer bots.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Play Against AI", "item": "https://cards.gnanamai.com/play-against-ai" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://cards.gnanamai.com/play-against-ai#webapp",
          "name": "7 Cards Least Against Computer AI",
          "url": "https://cards.gnanamai.com/play-against-ai",
          "description": "Practice 7 Cards Least singleplayer against intelligent computer bots. Zero matchmaking delay, customizable bot counts, and instant play in your browser.",
          "applicationCategory": "GameApplication",
          "gamePlatform": "Web Browser",
          "operatingSystem": "All"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/play-against-ai#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "Play Against AI", "item": "https://cards.gnanamai.com/play-against-ai" }
          ]
        }
      ]
    },
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
    robots: 'noindex, follow',
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
  },
  {
    path: '/daily-challenge',
    dir: path.join(distDir, 'daily-challenge'),
    title: '7 Cards Least Daily Challenge – Play Today\'s Puzzle Online',
    description: 'Play the official daily 7 Cards Least lowest-score challenge. Identical 7-card starting hands and joker wildcards for all players. Solve in 3 turns and share your score!',
    canonical: 'https://cards.gnanamai.com/daily-challenge',
    robots: 'noindex, follow',
    h1: '7 Cards Least Daily Challenge',
    h2: 'Solve today\'s deterministic lowest-score puzzle with 3 strategic card-shedding turns.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Daily Challenge", "item": "https://cards.gnanamai.com/daily-challenge" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://cards.gnanamai.com/daily-challenge#webapp",
          "name": "7 Cards Least Daily Challenge",
          "url": "https://cards.gnanamai.com/daily-challenge",
          "description": "Daily lowest-score card game challenge with reproducible seeded starting hands, table wildcards, and score sharing.",
          "applicationCategory": "GameApplication",
          "gamePlatform": "Web Browser",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/daily-challenge#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "Daily Challenge", "item": "https://cards.gnanamai.com/daily-challenge" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Daily Challenge</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Solve today's deterministic lowest-score puzzle with 3 strategic card-shedding turns.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          Welcome to the official <strong>7 Cards Least Daily Challenge</strong>! Every calendar day, a brand new puzzle is generated using a deterministic date seed. Every player globally receives the exact same starting 7 cards, the exact same zero-point Table Joker rank, and the exact same top discard card.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎯 How the Daily Challenge Works</h3>
        <ul style="line-height: 1.8; color: #cbd5e1; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>3 Strategic Turns:</strong> You have 3 discard and pickup decisions to reduce your hand's point liability as much as possible.</li>
          <li><strong>Zero-Point Jokers:</strong> Any card in your hand matching the day's Table Joker rank counts as 0 points.</li>
          <li><strong>Match &amp; Skip:</strong> If your discarded card matches the rank of the top card on the discard pile, you trigger Match &amp; Skip—bypassing the pickup step and permanently shrinking your hand.</li>
          <li><strong>Reproducible &amp; Fair:</strong> Your final score is saved in your browser and verified against the daily seed. Share your score summary with friends to see who sheds best!</li>
        </ul>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://cards.gnanamai.com/daily-challenge" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 1.05rem;">▶️ Play Today's Daily Challenge</a>
        </div>

        ${navHtml}
      </article>
    `
  },
  {
    path: '/strategy-lab',
    dir: path.join(distDir, 'strategy-lab'),
    title: '7 Cards Least Strategy Lab – Interactive Tactical Scenarios',
    description: 'Master 7 Cards Least with realistic interactive scenarios. Learn when to shed face cards, preserve pairs, break runs, and calculate 80-point penalty risks.',
    canonical: 'https://cards.gnanamai.com/strategy-lab',
    robots: 'noindex, follow',
    h1: '7 Cards Least Interactive Strategy Lab',
    h2: 'Test real-game card decisions with instant strategic feedback, penalty risk evaluations, and optimal move analyses.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Strategy Lab", "item": "https://cards.gnanamai.com/strategy-lab" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://cards.gnanamai.com/strategy-lab#webapp",
          "name": "7 Cards Least Strategy Lab",
          "url": "https://cards.gnanamai.com/strategy-lab",
          "description": "Interactive card game laboratory featuring tactical scenarios, point calculations, and strategy explanations.",
          "applicationCategory": "EducationalApplication",
          "gamePlatform": "Web Browser",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/strategy-lab#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "Strategy Lab", "item": "https://cards.gnanamai.com/strategy-lab" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Interactive Strategy Lab</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Test real-game card decisions with instant strategic feedback, penalty risk evaluations, and optimal move analyses.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          The <strong>7 Cards Least Strategy Lab</strong> is an interactive training ground designed to elevate your decision-making in competitive matches. Work through curated, realistic card situations modeled directly on the official game rules.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🧪 What You Can Practice in the Lab</h3>
        <ul style="line-height: 1.8; color: #cbd5e1; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>High Face-Card Dumps:</strong> Why discarding heavy 10-point face cards (K, Q, J) on Turn 1 protects you against sudden opponent Least declarations.</li>
          <li><strong>Matching Sets vs. Suited Runs:</strong> Evaluating whether shedding a pair of 9s (18 pts) immediately is superior to holding them for a speculative straight run.</li>
          <li><strong>The 80-Point Least Call Risk:</strong> Calculating opponent hand distributions before calling Least with 7 points versus waiting one more cycle to guarantee victory.</li>
          <li><strong>Joker Wildcard Manipulation:</strong> Capitalizing on the zero-point table wildcard while dumping high collateral cards.</li>
          <li><strong>Match &amp; Skip Exploits:</strong> Recognizing opportunities to match the top discard rank to shed without taking an additional card.</li>
        </ul>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://cards.gnanamai.com/strategy-lab" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 1.05rem;">🔬 Enter the Interactive Strategy Lab</a>
        </div>

        ${navHtml}
      </article>
    `
  },
  {
    path: '/score-calculator',
    dir: path.join(distDir, 'score-calculator'),
    title: '7 Cards Least Score Calculator – Hand Points & Least Eligibility',
    description: 'Calculate your 7 Cards Least hand score instantly. Check wild Joker values, assess Least declaration eligibility (≤10 pts), and simulate discard strategies.',
    canonical: 'https://cards.gnanamai.com/score-calculator',
    robots: 'noindex, follow',
    h1: '7 Cards Least Quick Score Calculator',
    h2: 'Instant card point evaluation, zero-point Joker calculation, and Least call eligibility checker.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Score Calculator", "item": "https://cards.gnanamai.com/score-calculator" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://cards.gnanamai.com/score-calculator#webapp",
          "name": "7 Cards Least Score Calculator",
          "url": "https://cards.gnanamai.com/score-calculator",
          "description": "Visual card score calculator for 7 Cards Least with zero-point wild Joker selection and Least call threshold verification.",
          "applicationCategory": "UtilitiesApplication",
          "gamePlatform": "Web Browser",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cards.gnanamai.com/score-calculator#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
            { "@type": "ListItem", "position": 2, "name": "Score Calculator", "item": "https://cards.gnanamai.com/score-calculator" }
          ]
        }
      ]
    },
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">7 Cards Least Quick Score Calculator</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Instant card point evaluation, zero-point Joker calculation, and Least call eligibility checker.</h2>
        
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">
          The <strong>7 Cards Least Score Calculator</strong> provides instantaneous, accurate point calculations for any custom 1 to 7 card hand. Validate your in-game calculations, discover your exact distance from the ≤10 point Least threshold, and test what-if discard outcomes.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">📊 Official Point Evaluation Rules</h3>
        <ul style="line-height: 1.8; color: #cbd5e1; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>Aces (A):</strong> 1 point each.</li>
          <li><strong>Number Cards (2–10):</strong> Face value (e.g. 7 of Diamonds = 7 points).</li>
          <li><strong>Face Cards (J, Q, K):</strong> 10 points each.</li>
          <li><strong>Wild Joker Rank:</strong> Any card matching the table's designated Joker rank counts as exactly <strong>0 points</strong>.</li>
          <li><strong>Least Eligibility:</strong> A player may declare "Least!" only when their total hand score is <strong>10 points or less</strong>.</li>
        </ul>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://cards.gnanamai.com/score-calculator" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 1.05rem;">🧮 Open Interactive Score Calculator</a>
        </div>

        ${navHtml}
      </article>
    `
  },
  {
    path: '/privacy',
    dir: path.join(distDir, 'privacy'),
    title: 'Privacy Policy – 7 Cards Least Online',
    description: 'Official Privacy Policy for 7 Cards Least online at cards.gnanamai.com. Information on minimal data collection, cookies, Google Consent Mode v2, and player privacy rights.',
    canonical: 'https://cards.gnanamai.com/privacy',
    robots: 'index, follow',
    h1: 'Privacy Policy',
    h2: 'How we collect, protect, and handle data on cards.gnanamai.com.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://cards.gnanamai.com/privacy" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">Privacy Policy</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">How we collect, protect, and handle data on cards.gnanamai.com.</h2>
        <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 16px;">Last Updated: October 22, 2026</p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">1. Introduction &amp; Data Controller</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Welcome to 7 Cards Least (<strong>cards.gnanamai.com</strong>), operated by <strong>Gnanam AI</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your privacy and are committed to protecting personal data in compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and global privacy standards. For privacy inquiries, contact <strong>support@gnanamai.com</strong>.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">2. What Data We Collect</h3>
        <ul style="line-height: 1.8; color: #cbd5e1; font-size: 0.95rem; margin-left: 20px; margin-bottom: 16px;">
          <li><strong>Guest Identifiers:</strong> Randomly generated anonymous IDs and local display names stored in your browser.</li>
          <li><strong>Optional Profile Data:</strong> Basic profile info (email, display name) if you choose to sign in via Google.</li>
          <li><strong>Gameplay Diagnostics:</strong> Turn sequences, card discards, and scores transiently processed to synchronize game tables.</li>
          <li><strong>Anonymous Analytics:</strong> Only collected with your explicit consent via Google Consent Mode v2.</li>
        </ul>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">3. Cookies &amp; Tracking Choices</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          We utilize Google Consent Mode v2. Analytical cookies remain inactive until you explicitly click &quot;Accept All&quot; on our cookie banner.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">4. Your Rights</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          You can request access, correction, or deletion of any stored data by contacting our team at <a href="mailto:support@gnanamai.com" style="color: #38bdf8; text-decoration: underline;">support@gnanamai.com</a>.
        </p>

        ${navHtml}
      </article>
    `
  },
  {
    path: '/about',
    dir: path.join(distDir, 'about'),
    title: 'About Us – 7 Cards Least Online',
    description: 'Learn about 7 Cards Least on cards.gnanamai.com, developed by Gnanam AI. Our mission is to provide an authentic, instant, ad-free card gaming experience.',
    canonical: 'https://cards.gnanamai.com/about',
    robots: 'index, follow',
    h1: 'About 7 Cards Least',
    h2: 'Who runs cards.gnanamai.com, our story, and our commitment to fair card play.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://cards.gnanamai.com/about" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">About 7 Cards Least</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Who runs cards.gnanamai.com, our story, and our commitment to fair card play.</h2>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">👋 Who Runs the Site</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          7 Cards Least (<strong>cards.gnanamai.com</strong>) is designed, developed, and maintained by <strong>Gnanam AI</strong>, an independent studio focused on building accessible, high-performance web software and digital card games.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🎯 Why This Site Exists</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          7 Cards Least is a traditional shedding card game played by generations of card enthusiasts under names like Low Hand Rummy or Seven Cards Least. We built this platform so players anywhere can enjoy authentic matches with zero installation friction, no intrusive ads, and true turn-by-turn mechanics.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🛡️ Fair Play &amp; Modern Technology</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          The game engine runs on deterministic card shuffling, verified turn state machines, and synchronized web technologies. Practice solo against intelligent computer bots or create private rooms to play real-time games with friends and family.
        </p>

        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          Have questions or ideas? Contact us at <a href="mailto:support@gnanamai.com" style="color: #38bdf8; text-decoration: underline;">support@gnanamai.com</a>.
        </p>

        ${navHtml}
      </article>
    `
  },
  {
    path: '/contact',
    dir: path.join(distDir, 'contact'),
    title: 'Contact Us – 7 Cards Least Online',
    description: 'Contact the 7 Cards Least development team at Gnanam AI. Email support@gnanamai.com for gameplay inquiries, bug reports, and player feedback.',
    canonical: 'https://cards.gnanamai.com/contact',
    robots: 'index, follow',
    h1: 'Contact Us',
    h2: 'Official support, inquiries, and player feedback for cards.gnanamai.com.',
    breadcrumbs: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://cards.gnanamai.com/contact" }
    ],
    fullHtml: `
      <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
        <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">Contact Us</h1>
        <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">Official support, inquiries, and player feedback for cards.gnanamai.com.</h2>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">📬 Direct Email Support</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          For all player support, questions, bug reports, or feature recommendations, please email:
        </p>
        <p style="font-size: 1.2rem; font-weight: bold; color: #38bdf8; margin-bottom: 16px;">
          <a href="mailto:support@gnanamai.com" style="color: #38bdf8; text-decoration: underline;">support@gnanamai.com</a>
        </p>
        <p style="line-height: 1.7; color: #94a3b8; font-size: 0.9rem; margin-bottom: 16px;">
          We review player feedback daily and reply within 24 to 48 business hours.
        </p>

        <h3 style="font-size: 1.3rem; color: #38bdf8; margin-top: 24px; margin-bottom: 10px;">🏢 Publisher &amp; Developer Details</h3>
        <p style="line-height: 1.7; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 16px;">
          <strong>Publisher:</strong> Gnanam AI<br />
          <strong>Platform:</strong> https://cards.gnanamai.com<br />
          <strong>Primary Contact:</strong> support@gnanamai.com
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

  // Replace Robots tag if specified on route
  if (route.robots) {
    routeHtml = routeHtml.replace(/<meta name="robots" content=".*?" \/>/gi, `<meta name="robots" content="${route.robots}" />`);
  }

  // Inject or replace tailored JSON-LD schema graph
  if (route.schema) {
    const formattedSchema = `    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>`;
    routeHtml = routeHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, formattedSchema);
  }

  if (route.redirect) {
    const metaRedirect = `  <meta http-equiv="refresh" content="0;url=${route.canonical}" />\n    <script>window.location.replace("${route.canonical}");</script>\n  </head>`;
    routeHtml = routeHtml.replace('</head>', metaRedirect);
  }

  // Route semantic content
  const bodyContent = route.fullHtml || `
    <article style="max-width: 900px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
      <h1 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #ffffff; text-align: center;">${route.h1 || route.title}</h1>
      <h2 style="font-size: 1.25rem; color: #38bdf8; font-weight: 600; margin-bottom: 20px; text-align: center;">${route.h2 || ''}</h2>
      <p style="line-height: 1.7; color: #cbd5e1; font-size: 1rem; margin-bottom: 16px;">${route.description || ''}</p>
      ${navHtml}
    </article>
  `;

  // Clean, lightweight <noscript> fallback that does not duplicate the real DOM content
  const noscriptHtml = `
    <noscript>
      <div style="padding: 20px; color: #ffffff; background-color: #062d12; font-family: sans-serif; text-align: center;">
        <p style="margin: 0; font-size: 15px;">JavaScript is required to play 7 Cards Least online. Please enable JavaScript in your browser settings.</p>
      </div>
    </noscript>`;

  routeHtml = routeHtml.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptHtml);

  // Inject full semantic content directly into the real DOM inside <div id="root">
  // so Googlebot Smartphone (which executes JS and suppresses <noscript>) reads the full H1,
  // article, rules table, FAQs, and navigation links immediately upon fetching the HTML.
  // When React mounts, React cleanly replaces this initial content with the interactive app.
  const prerenderedRootHtml = `
    <div id="root">
      <main id="main-content" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100vh; width: 100%; background: radial-gradient(circle at center, #0b5e28 0%, #062d12 100%); color: #ffffff; text-align: center; padding: 24px 16px; box-sizing: border-box; flex: 1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow-y: auto;">
        <header style="margin-bottom: 24px; display: flex; flex-direction: column; align-items: center;">
          <img src="/logo-badge.png" style="width: 76px; height: 76px; margin-bottom: 12px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.6));" alt="7 Cards Least Logo" />
          <div style="width: 28px; height: 28px; border: 3px solid rgba(56, 189, 248, 0.2); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="color: #34d399; font-weight: 700; margin-top: 10px; font-size: 14px; letter-spacing: 0.5px;">Free Online Card Shedding Game</p>
        </header>

        <section id="prerendered-content" style="width: 100%; max-width: 900px; text-align: left; margin: 0 auto;">
          ${bodyContent}
        </section>
      </main>
    </div>`;

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>(?=\s*<!--|\s*<script)/, prerenderedRootHtml);

  const targetFile = path.join(route.dir, 'index.html');
  fs.writeFileSync(targetFile, routeHtml, 'utf-8');
  console.log(`[SEO Prerender] Generated: ${path.relative(distDir, targetFile)}`);
});

// Copy sitemap.xml and robots.txt from public to dist to ensure 100% synchronization
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(path.join(publicDir, 'sitemap.xml'))) {
  fs.copyFileSync(path.join(publicDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
  console.log('[SEO Prerender] Synced: public/sitemap.xml -> dist/sitemap.xml');
}
if (fs.existsSync(path.join(publicDir, 'robots.txt'))) {
  fs.copyFileSync(path.join(publicDir, 'robots.txt'), path.join(distDir, 'robots.txt'));
  console.log('[SEO Prerender] Synced: public/robots.txt -> dist/robots.txt');
}

// Ensure logo assets are synced to /assets/logo.png and /logo.png
const publicAssetsDir = path.join(publicDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });
if (!fs.existsSync(distAssetsDir)) fs.mkdirSync(distAssetsDir, { recursive: true });

const sourceLogo = path.join(publicDir, 'logo-badge.png');
if (fs.existsSync(sourceLogo)) {
  fs.copyFileSync(sourceLogo, path.join(publicAssetsDir, 'logo.png'));
  fs.copyFileSync(sourceLogo, path.join(distAssetsDir, 'logo.png'));
  fs.copyFileSync(sourceLogo, path.join(distDir, 'logo-badge.png'));
  fs.copyFileSync(sourceLogo, path.join(distDir, 'logo.png'));
  console.log('[SEO Prerender] Synced: logo assets -> dist/assets/logo.png & dist/logo.png');
}

// Generate static 404.html with noindex to prevent Soft 404 penalties
const html404 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>404 Page Not Found – 7 Cards Least</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.ico" />
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: radial-gradient(circle at center, #0b5e28 0%, #062d12 100%); color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 20px; box-sizing: border-box; }
    .box { max-width: 520px; background: rgba(15, 23, 42, 0.95); padding: 40px 32px; border-radius: 16px; border: 1px solid rgba(56, 189, 248, 0.3); box-shadow: 0 16px 32px rgba(0,0,0,0.5); }
    h1 { font-size: 3.5rem; margin: 0 0 8px; color: #38bdf8; font-weight: 800; }
    h2 { font-size: 1.4rem; margin: 0 0 16px; color: #fff; }
    p { color: #cbd5e1; font-size: 1rem; line-height: 1.6; margin-bottom: 24px; }
    a { display: inline-block; background: #0284c7; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; transition: background 0.2s; }
    a:hover { background: #0369a1; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page or resource you are looking for does not exist on 7 Cards Least.</p>
    <a href="https://cards.gnanamai.com/">Return to 7 Cards Least Home</a>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
fs.writeFileSync(path.join(publicDir, '404.html'), html404, 'utf-8');
console.log('[SEO Prerender] Generated: dist/404.html & public/404.html');

console.log('[SEO Prerender] Successfully pre-rendered static HTML for all 7 Cards Least cluster routes!');

