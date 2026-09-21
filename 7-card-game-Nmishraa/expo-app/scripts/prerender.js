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
    title: '7 Card Game Online – Play Free Multiplayer Card Game',
    description: 'Play 7 Card Game online for free. Learn the rules, play against AI, and enjoy an interactive card game experience. Explore how to play, scoring, sets, runs, jokers, and strategy.',
    canonical: 'https://cards.gnanamai.com/',
    h1: 'Play 7 Card Game Online',
    h2: 'Play 7 Card Game online for free with friends or computer AI opponents.',
    content: 'Join real-time multiplayer 7 Card Game rooms, play solo vs computer AI bots, discard sets and runs, and track scores live on cards.gnanamai.com.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Card Game Online",
      "url": "https://cards.gnanamai.com/",
      "description": "Play 7 Card Game (7-Cards Least) online for free with friends or AI computer bots in real-time multiplayer.",
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
    path: '/rules',
    dir: path.join(distDir, 'rules'),
    title: '7 Card Game Rules – Complete Guide to Playing 7 Cards',
    description: 'Understand 7 Card Game rules, card point values, valid discard sets and suited runs, Joker wildcard evaluation, match & skip rules, and scoring penalties.',
    canonical: 'https://cards.gnanamai.com/rules',
    h1: '7 Card Game Rules',
    h2: 'Complete documentation of official 7 Card Game rules, discards, jokers, and scoring.',
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
    path: '/how-to-play',
    dir: path.join(distDir, 'how-to-play'),
    title: "How to Play 7 Card Game Online – Beginner's Guide",
    description: "Learn how to play 7 Card Game with a step-by-step guide covering dealing, hand combinations, drawing, discarding, Joker ranks, and calling Least.",
    canonical: 'https://cards.gnanamai.com/how-to-play',
    h1: 'How to Play 7 Card Game',
    h2: "A step-by-step beginner's guide to card setup, turn flow, scoring, and strategies.",
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
    path: '/strategy',
    dir: path.join(distDir, 'strategy'),
    title: '7 Card Game Strategy – Tips to Improve Your Game',
    description: 'Master 7 Card Game strategy: organize your hand, discard high-value face cards, utilize wild Jokers, track discards, and calculate safe Least call score windows.',
    canonical: 'https://cards.gnanamai.com/strategy',
    h1: '7 Card Game Strategy',
    h2: 'Master score reduction, Joker management, discard tactics, and risk-calculated Least calls.',
    content: 'Learn when to dump face cards early, how to build 3+ card suited runs, tracking opponent discard habits, and safe Least calling score windows.',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 Card Game Strategy & Tips to Improve Your Game",
      "url": "https://cards.gnanamai.com/strategy"
    }
  },
  {
    path: '/multiplayer',
    dir: path.join(distDir, 'multiplayer'),
    title: '7 Card Game Multiplayer – Play Online With Friends',
    description: 'Play 7 Card Game online with friends or real-time online players. Create private 4-digit code rooms, customize round counts, and enjoy live table chat.',
    canonical: 'https://cards.gnanamai.com/multiplayer',
    h1: 'Play 7 Card Game Multiplayer Online',
    h2: 'Play real-time multiplayer card games with friends or instant online player matchfilling.',
    content: 'Create private 4-digit room code lobbies, play 1 to 20 round matches, chat live with players, and enjoy fast online card play on cards.gnanamai.com.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Card Game Multiplayer",
      "url": "https://cards.gnanamai.com/multiplayer",
      "applicationCategory": "GameApplication"
    }
  },
  {
    path: '/play-against-ai',
    dir: path.join(distDir, 'play-against-ai'),
    title: 'Play 7 Card Game Against AI Online',
    description: 'Play 7 Card Game against intelligent computer AI bots directly in your web browser for free. Enjoy zero-wait single-player card game practice.',
    canonical: 'https://cards.gnanamai.com/play-against-ai',
    h1: 'Play 7 Card Game Against AI',
    h2: 'Practice your card strategies solo against intelligent computer opponents.',
    content: 'Zero waiting time single-player card game against computer AI bots. Practice Joker evaluations, set building, and Least calls at your own pace.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Play 7 Card Game Against AI",
      "url": "https://cards.gnanamai.com/play-against-ai",
      "applicationCategory": "GameApplication"
    }
  },
  {
    path: '/solo',
    dir: path.join(distDir, 'solo'),
    title: 'Play 7 Card Game Against AI Online',
    description: 'Play 7 Card Game against intelligent computer AI bots directly in your web browser for free. Enjoy zero-wait single-player card game practice.',
    canonical: 'https://cards.gnanamai.com/play-against-ai',
    h1: 'Play 7 Card Game Against AI',
    h2: 'Practice your card strategies solo against intelligent computer opponents.',
    content: 'Zero waiting time single-player card game against computer AI bots.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Play 7 Card Game Against AI",
      "url": "https://cards.gnanamai.com/play-against-ai",
      "applicationCategory": "GameApplication"
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
    content: '7-Cards Least is widely played as Low Hand Rummy. Compare 2v2 partner play, fixed jokers vs dynamic jokers, and penalty thresholds.',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 Card Game Regional Variations",
      "url": "https://cards.gnanamai.com/variations"
    }
  },
  {
    path: '/faq',
    dir: path.join(distDir, 'faq'),
    title: '7 Card Game FAQ – Rules, Gameplay & Online Play',
    description: 'Find answers to frequently asked questions about 7 Card Game rules, card values, online multiplayer, playing against AI, sets and runs, and scoring.',
    canonical: 'https://cards.gnanamai.com/faq',
    h1: '7 Card Game Frequently Asked Questions',
    h2: 'Frequently asked questions about rules, turns, scoring, multiplayer, and AI play.',
    content: 'Answers to: What is 7 Card Game? How do you play? Can I play online? Is it free? How do Jokers work? Can I play against AI?',
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is 7 Card Game?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "7 Card Game is a fast-paced multiplayer card game played with 7 cards per player where players aim for the lowest hand score."
          }
        },
        {
          "@type": "Question",
          "name": "How do you play 7 Card Game?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each player receives 7 cards. Discard single cards, matching rank sets, or suited runs, then draw a replacement card."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play 7 Card Game online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can play 7 Card Game online for free directly in your web browser with friends or against computer AI."
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
          <a href="https://cards.gnanamai.com/" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Play</a> |
          <a href="https://cards.gnanamai.com/rules" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Rules</a> |
          <a href="https://cards.gnanamai.com/how-to-play" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">How to Play</a> |
          <a href="https://cards.gnanamai.com/strategy" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Strategy</a> |
          <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Multiplayer</a> |
          <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Play Against AI</a> |
          <a href="https://cards.gnanamai.com/faq" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">FAQ</a>
        </nav>
      </main>
    </div>`;

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/, fallbackHtml);

  const targetFile = path.join(route.dir, 'index.html');
  fs.writeFileSync(targetFile, routeHtml, 'utf-8');
  console.log(`[SEO Prerender] Generated: ${path.relative(distDir, targetFile)}`);
});

console.log('[SEO Prerender] Successfully pre-rendered static HTML for all specified routes!');
