const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[SEO Prerender Error] dist/index.html does not exist. Run "npx expo export --platform web" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(indexPath, 'utf-8');

const routes = [
  {
    path: '/',
    dir: distDir,
    title: '7 Card Game Online – Play With Friends or AI | Cards',
    description: 'Play 7 Card Game online with friends or AI. Learn the rules, play multiplayer games, challenge computer opponents, and enjoy a fast browser-based card game.',
    canonical: 'https://cards.gnanamai.com/',
    h1: '7 Card Game Online – Play With Friends or AI',
    h2: 'Play 7 Card Game online with friends or AI. Learn the rules, play multiplayer games, challenge computer opponents, and enjoy a fast browser-based card game.',
    content: 'Join real-time multiplayer 7 Card Game rooms, play solo vs computer AI bots, discard sets and runs, and track scores live on cards.gnanamai.com.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Card Game - 7-Cards Least Online",
      "url": "https://cards.gnanamai.com/",
      "description": "Play 7 Card Game (7-Cards Least) online with friends or AI computer bots in real-time multiplayer.",
      "applicationCategory": "GameApplication",
      "gamePlatform": "Web Browser",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  {
    path: '/how-to-play',
    dir: path.join(distDir, 'how-to-play'),
    title: 'How to Play 7 Card Game – Beginner Guide & Rules',
    description: "Learn how to play 7 Card Game with a simple beginner-friendly guide covering card setup, turn flow, Joker wildcards, scoring, and calling Least.",
    canonical: 'https://cards.gnanamai.com/how-to-play',
    h1: 'How to Play 7 Card Game',
    h2: "A beginner's guide to card setup, turn flow, scoring, and strategies for 7 Cards Least.",
    content: 'Understand dealing 7 cards, discarding sets (pairs/triples) and suited runs, drawing from the deck, and calling Least to end rounds.',
    schema: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Play 7 Card Game",
      "description": "Step-by-step beginner guide to dealing, discarding, drawing, and calling Least in 7 Card Game.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Deal 7 Cards",
          "text": "Each player is dealt 7 cards from a standard 52-card deck. One remaining card is flipped face-up as the Joker rank."
        },
        {
          "@type": "HowToStep",
          "name": "Discard & Draw",
          "text": "On your turn, discard a single card, matching rank sets, or suited runs, then draw one card from the deck or discard pile."
        },
        {
          "@type": "HowToStep",
          "name": "Call Least",
          "text": "When your total hand score is lower than opponents, call Least to end the round and score 0 points."
        }
      ]
    }
  },
  {
    path: '/rules',
    dir: path.join(distDir, 'rules'),
    title: '7 Card Game Rules – Scoring, Discards & Penalties',
    description: 'Complete official rules for 7 Card Game: card point values, valid discard sets and runs, match & skip rules, and the 80-point penalty.',
    canonical: 'https://cards.gnanamai.com/rules',
    h1: '7 Card Game Official Rules & Scoring',
    h2: 'Understand card point values, valid discard runs, joker rules, and elimination penalties.',
    content: 'Aces = 1pt, Face cards = 10pts, Joker rank = 0pts. Match & skip turns when discard ranks match. 80-point wrong call penalty applies when calling Least incorrectly.',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 Card Game Official Rules & Scoring Guide",
      "url": "https://cards.gnanamai.com/rules",
      "author": { "@type": "Organization", "name": "7 Card Game" }
    }
  },
  {
    path: '/strategy',
    dir: path.join(distDir, 'strategy'),
    title: '7 Card Game Strategy & Winning Tips – Master 7 Cards Least',
    description: 'Discover top strategies for 7 Card Game: Joker management, multi-card discards, high-value card dumps, and calculated Least calls to win online.',
    canonical: 'https://cards.gnanamai.com/strategy',
    h1: '7 Card Game Strategy & Winning Tips',
    h2: 'Master score reduction, Joker management, discard tactics, and risk-calculated Least calls in 7 Cards Least online.',
    content: 'Learn when to dump face cards early, how to build 3+ card suited runs, tracking opponent discard habits, and safe Least calling score windows.',
    schema: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "7 Card Game Strategy & Winning Tactics",
      "url": "https://cards.gnanamai.com/strategy"
    }
  },
  {
    path: '/variations',
    dir: path.join(distDir, 'variations'),
    title: '7 Card Game Regional Variations & 7-Cards Least Rules',
    description: 'Explore regional names and variations of 7 Card Game including 7-Cards Least, Seven Card Knock Rummy, and custom house rules.',
    canonical: 'https://cards.gnanamai.com/variations',
    h1: '7 Card Game Regional Names & Rules Variations',
    h2: 'Explore different names and house rule variations of 7 Card Game around the world.',
    content: '7-Cards Least is widely played in South Asia and globally as Low Hand Rummy. Compare 2v2 partner play, fixed jokers vs dynamic jokers, and penalty thresholds.',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 Card Game Regional Names and Rules Variations",
      "url": "https://cards.gnanamai.com/variations"
    }
  },
  {
    path: '/multiplayer',
    dir: path.join(distDir, 'multiplayer'),
    title: '7 Card Game Multiplayer – Play Online with Friends',
    description: 'Play 7 Card Game online with friends or real-time online players in your web browser. Create private rooms with 4-digit codes or join Quick Match.',
    canonical: 'https://cards.gnanamai.com/multiplayer',
    h1: '7 Card Game Online Multiplayer',
    h2: 'Play real-time multiplayer card games with friends or instant computer AI matchfilling.',
    content: 'Create private 4-digit room code lobbies, play 1 to 20 round matches, chat live with players, and enjoy fast online card play on cards.gnanamai.com.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Card Game Online Multiplayer",
      "url": "https://cards.gnanamai.com/multiplayer",
      "applicationCategory": "GameApplication"
    }
  },
  {
    path: '/solo',
    dir: path.join(distDir, 'solo'),
    title: '7 Card Game Solo – Play vs Computer AI',
    description: 'Play 7 Card Game solo against computer AI bots directly in your web browser for free with zero waiting time.',
    canonical: 'https://cards.gnanamai.com/solo',
    h1: '7 Card Game Solo – Play vs Computer AI',
    h2: 'Practice your card strategies offline or solo against intelligent computer opponents.',
    content: 'Zero waiting time solo card game against smart computer bots. Practice Joker evaluations, set building, and Least calls before playing live multiplayer.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Card Game Solo Play",
      "url": "https://cards.gnanamai.com/solo",
      "applicationCategory": "GameApplication"
    }
  },
  {
    path: '/faq',
    dir: path.join(distDir, 'faq'),
    title: '7 Card Game FAQ – Rules, Gameplay & Common Questions',
    description: 'Find answers to common questions about 7 Card Game rules, gameplay, multiplayer, Joker mechanics, wrong call penalties, and playing online.',
    canonical: 'https://cards.gnanamai.com/faq',
    h1: '7 Card Game FAQ & Help Center',
    h2: 'Frequently asked questions about rules, turns, scoring, multiplayer, and solo computer play.',
    content: 'Answers to: What is 7 Card Game? How does the Joker work? What happens on wrong Least calls? Is it free to play?',
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is 7 Card Game (7-Cards Least)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "7 Card Game is a fast-paced multiplayer card game played with 7 cards per player where players aim for the lowest hand score."
          }
        },
        {
          "@type": "Question",
          "name": "How does the Joker card work in 7 Card Game?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The face-up card flipped during setup sets the Joker rank. Any card matching that rank counts as 0 points."
          }
        }
      ]
    }
  }
];

console.log('[SEO Prerender] Starting static HTML generation for routes...');

routes.forEach(route => {
  if (!fs.existsSync(route.dir)) {
    fs.mkdirSync(route.dir, { recursive: true });
  }

  let routeHtml = templateHtml;

  // Replace Title
  routeHtml = routeHtml.replace(/<title>.*?<\/title>/gi, `<title>${route.title}</title>`);
  routeHtml = routeHtml.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${route.title}" />`);
  routeHtml = routeHtml.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${route.title}" />`);
  routeHtml = routeHtml.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${route.title}" />`);

  // Replace Description
  routeHtml = routeHtml.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${route.description}" />`);
  routeHtml = routeHtml.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${route.description}" />`);
  routeHtml = routeHtml.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${route.description}" />`);

  // Replace Canonical & OG URL
  routeHtml = routeHtml.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${route.canonical}" />`);
  routeHtml = routeHtml.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${route.canonical}" />`);
  routeHtml = routeHtml.replace(/<meta name="twitter:url" content=".*?" \/>/gi, `<meta name="twitter:url" content="${route.canonical}" />`);

  // Inject route-specific Schema
  if (route.schema) {
    const schemaScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(route.schema, null, 2)}\n    </script>\n  </head>`;
    routeHtml = routeHtml.replace('</head>', schemaScript);
  }

  // Update fallback Semantic HTML inside <div id="root">
  const fallbackHtml = `
    <div id="root">
      <main id="main-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #062d12; color: #ffffff; text-align: center; padding: 20px;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 10px; color: #ffffff;">${route.h1}</h1>
        <h2 style="font-size: 1.25rem; color: #cbd5e1; font-weight: normal; margin-bottom: 20px;">${route.h2}</h2>
        <p style="max-width: 600px; line-height: 1.6; color: #94a3b8;">
          ${route.content}
        </p>
        <nav aria-label="Quick Links" style="margin-top: 15px; font-size: 14px;">
          <a href="https://cards.gnanamai.com/" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Play Game</a> |
          <a href="https://cards.gnanamai.com/how-to-play" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">How to Play</a> |
          <a href="https://cards.gnanamai.com/rules" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Rules</a> |
          <a href="https://cards.gnanamai.com/strategy" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Strategy</a> |
          <a href="https://cards.gnanamai.com/variations" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Variations</a> |
          <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Multiplayer</a> |
          <a href="https://cards.gnanamai.com/solo" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Solo</a> |
          <a href="https://cards.gnanamai.com/faq" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">FAQ</a>
        </nav>
      </main>
    </div>`;

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/, fallbackHtml);

  const targetFile = path.join(route.dir, 'index.html');
  fs.writeFileSync(targetFile, routeHtml, 'utf-8');
  console.log(`[SEO Prerender] Generated: ${path.relative(distDir, targetFile)}`);
});

console.log('[SEO Prerender] Successfully pre-rendered static HTML for all 8 routes!');
