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
    title: '7 Cards Least Game Online – Play Free With Friends & AI',
    description: 'Play 7 Cards Least online for free. Enjoy real-time multiplayer card games with friends or practice solo against computer AI. No download required.',
    canonical: 'https://cards.gnanamai.com/',
    h1: '7 Cards Least Game Online',
    h2: 'Play 7 Cards Least online for free with friends or computer AI opponents.',
    content: 'Join real-time multiplayer 7 Cards Least rooms, play solo vs computer AI bots, discard sets and runs, and track scores live on cards.gnanamai.com.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Cards Least Game Online",
      "url": "https://cards.gnanamai.com/",
      "description": "Play 7 Cards Least online for free with friends or AI computer bots in real-time multiplayer.",
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
    path: '/7-cards-least',
    dir: path.join(distDir, '7-cards-least'),
    title: '7 Cards Least Card Game – What Is 7 Cards Least & How It Works',
    description: 'Discover 7 Cards Least, the popular low-hand card game. Learn how 7 cards are dealt, how discard sets & suited runs work, and start playing online.',
    canonical: 'https://cards.gnanamai.com/7-cards-least',
    h1: '7 Cards Least Card Game',
    h2: 'The ultimate online portal for 7 Cards Least rules, strategy, and multiplayer gameplay.',
    content: 'Play 7 Cards Least online, learn how the game works, explore card point scoring, joker wildcards, and compete in free browser matches.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "7 Cards Least Card Game",
      "url": "https://cards.gnanamai.com/7-cards-least",
      "applicationCategory": "GameApplication"
    }
  },
  {
    path: '/7-cards-least/rules',
    dir: path.join(distDir, '7-cards-least', 'rules'),
    title: '7 Cards Least Rules – Complete Game Rules & Scoring Guide',
    description: 'Official 7 Cards Least rules guide. Learn card point values (Aces=1, Face cards=10), Joker wildcard mechanics, Match & Skip turns, and the 80-point wrong call penalty.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/rules',
    h1: '7 Cards Least Rules',
    h2: 'Complete guide to card point values, discards, wildcards, turn rules, and penalties.',
    content: 'Aces = 1pt, Face cards = 10pts, Joker rank = 0pts. Match & skip turns when discard ranks match. 80-point wrong call penalty applies when calling Least incorrectly.',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
          { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
          { "@type": "ListItem", "position": 3, "name": "Rules", "item": "https://cards.gnanamai.com/7-cards-least/rules" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "7 Cards Least Official Rules Guide",
        "url": "https://cards.gnanamai.com/7-cards-least/rules"
      }
    ]
  },
  {
    path: '/7-cards-least/how-to-play',
    dir: path.join(distDir, '7-cards-least', 'how-to-play'),
    title: 'How to Play 7 Cards Least – Complete Guide',
    description: 'Learn how to play 7 Cards Least with a beginner-friendly step-by-step guide covering dealing, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/how-to-play',
    h1: 'How to Play 7 Cards Least',
    h2: "A beginner-friendly step-by-step guide to dealing, drawing, discarding, and winning.",
    content: 'Understand dealing 7 cards, discarding sets and suited runs, drawing replacement cards, and calling Least to end rounds.',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
          { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
          { "@type": "ListItem", "position": 3, "name": "How to Play", "item": "https://cards.gnanamai.com/7-cards-least/how-to-play" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Play 7 Cards Least",
        "description": "Beginner guide to dealing, discarding, drawing, and calling Least in 7 Cards Least.",
        "step": [
          { "@type": "HowToStep", "name": "Start Game", "text": "Enter player name and select round count." },
          { "@type": "HowToStep", "name": "Discard & Draw", "text": "Discard single cards, sets, or runs, then draw a replacement card." },
          { "@type": "HowToStep", "name": "Call Least", "text": "Call Least when your hand total is lower than all opponents." }
        ]
      }
    ]
  },
  {
    path: '/7-cards-least/strategy',
    dir: path.join(distDir, '7-cards-least', 'strategy'),
    title: '7 Cards Least Strategy – Tips & Tactics',
    description: 'Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/strategy',
    h1: '7 Cards Least Strategy',
    h2: 'Educational tactical guide to organizing hands, prioritizing discards, and managing risks.',
    content: 'Learn when to dump face cards early, how to build 3+ card suited runs, tracking opponent discard habits, and safe Least calling score windows.',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
          { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
          { "@type": "ListItem", "position": 3, "name": "Strategy", "item": "https://cards.gnanamai.com/7-cards-least/strategy" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "7 Cards Least Strategy & Tips for Playing Better",
        "url": "https://cards.gnanamai.com/7-cards-least/strategy"
      }
    ]
  },
  {
    path: '/7-cards-least/faq',
    dir: path.join(distDir, '7-cards-least', 'faq'),
    title: '7 Cards Least FAQ – Rules, Gameplay & Online Play',
    description: 'Answers to common 7 Cards Least questions: card values, dealing rules, online multiplayer rooms, AI difficulty, Joker wildcard evaluation, and score elimination.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/faq',
    h1: '7 Cards Least Frequently Asked Questions',
    h2: 'Frequently asked questions about rules, turns, scoring, multiplayer, and AI play.',
    content: 'Answers to: What is 7 Cards Least? How do you play? Can I play online? Is it free? How do Jokers work? Can I play against AI?',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cards.gnanamai.com/" },
          { "@type": "ListItem", "position": 2, "name": "7 Cards Least", "item": "https://cards.gnanamai.com/7-cards-least" },
          { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://cards.gnanamai.com/7-cards-least/faq" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is 7 Cards Least?",
            "acceptedAnswer": { "@type": "Answer", "text": "7 Cards Least is a fast-paced multiplayer card game played with 7 cards per player where players aim for the lowest hand score." }
          },
          {
            "@type": "Question",
            "name": "How do you play 7 Cards Least?",
            "acceptedAnswer": { "@type": "Answer", "text": "Each player receives 7 cards. Discard single cards, matching rank sets, or suited runs, then draw a replacement card." }
          }
        ]
      }
    ]
  },
  {
    path: '/rules',
    dir: path.join(distDir, 'rules'),
    title: '7 Cards Least Rules – Complete Game Rules & Scoring Guide',
    description: 'Official 7 Cards Least rules guide. Learn card point values (Aces=1, Face cards=10), Joker wildcard mechanics, Match & Skip turns, and the 80-point wrong call penalty.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/rules',
    h1: '7 Cards Least Rules',
    h2: 'Complete guide to card point values, discards, wildcards, turn rules, and penalties.',
    content: 'Aces = 1pt, Face cards = 10pts, Joker rank = 0pts.'
  },
  {
    path: '/how-to-play',
    dir: path.join(distDir, 'how-to-play'),
    title: 'How to Play 7 Cards Least – Complete Guide',
    description: 'Learn how to play 7 Cards Least with a beginner-friendly step-by-step guide covering dealing, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/how-to-play',
    h1: 'How to Play 7 Cards Least',
    h2: "A beginner-friendly step-by-step guide to dealing, drawing, discarding, and winning.",
    content: 'Understand dealing 7 cards, discarding sets and suited runs, drawing replacement cards.'
  },
  {
    path: '/strategy',
    dir: path.join(distDir, 'strategy'),
    title: '7 Cards Least Strategy – Tips & Tactics',
    description: 'Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/strategy',
    h1: '7 Cards Least Strategy',
    h2: 'Educational tactical guide to organizing hands, prioritizing discards, and managing risks.',
    content: 'Learn when to dump face cards early, how to build 3+ card suited runs.'
  },
  {
    path: '/faq',
    dir: path.join(distDir, 'faq'),
    title: '7 Cards Least FAQ – Rules, Gameplay & Online Play',
    description: 'Answers to common 7 Cards Least questions: card values, dealing rules, online multiplayer rooms, AI difficulty, Joker wildcard evaluation, and score elimination.',
    canonical: 'https://cards.gnanamai.com/7-cards-least/faq',
    h1: '7 Cards Least Frequently Asked Questions',
    h2: 'Frequently asked questions about rules, turns, scoring, multiplayer, and AI play.',
    content: 'Answers to: What is 7 Cards Least? How do you play? Can I play online?'
  },
  {
    path: '/multiplayer',
    dir: path.join(distDir, 'multiplayer'),
    title: '7 Cards Least Multiplayer – Play Online With Friends',
    description: 'Play 7 Cards Least multiplayer online with friends or real opponents. Create private 4-digit code rooms, customize rounds, and enjoy live table chat.',
    canonical: 'https://cards.gnanamai.com/multiplayer',
    h1: '7 Cards Least Multiplayer Online',
    h2: 'Play real-time multiplayer card games with friends or instant online player matchfilling.',
    content: 'Create private 4-digit room code lobbies, play 1 to 20 round matches.'
  },
  {
    path: '/play-against-ai',
    dir: path.join(distDir, 'play-against-ai'),
    title: '7 Cards Least Against AI – Play Free Online',
    description: 'Play 7 Cards Least against computer AI bots online for free. Practice your card shedding strategy, test Joker plays, and play instant solo matches with zero wait.',
    canonical: 'https://cards.gnanamai.com/play-against-ai',
    h1: '7 Cards Least Against AI',
    h2: 'Practice your card strategies solo against intelligent computer opponents.',
    content: 'Zero waiting time single-player card game against computer AI bots.'
  }
];

console.log('[SEO Prerender] Starting static HTML generation for 7 Cards Least cluster routes...');

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
          <a href="https://cards.gnanamai.com/7-cards-least" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">7 Cards Least</a> |
          <a href="https://cards.gnanamai.com/7-cards-least/rules" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Rules</a> |
          <a href="https://cards.gnanamai.com/7-cards-least/how-to-play" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">How to Play</a> |
          <a href="https://cards.gnanamai.com/7-cards-least/strategy" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Strategy</a> |
          <a href="https://cards.gnanamai.com/multiplayer" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Multiplayer</a> |
          <a href="https://cards.gnanamai.com/play-against-ai" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">Play Against AI</a> |
          <a href="https://cards.gnanamai.com/7-cards-least/faq" style="color: #38bdf8; margin: 0 8px; text-decoration: none;">FAQ</a>
        </nav>
      </main>
    </div>`;

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>/, fallbackHtml);

  const targetFile = path.join(route.dir, 'index.html');
  fs.writeFileSync(targetFile, routeHtml, 'utf-8');
  console.log(`[SEO Prerender] Generated: ${path.relative(distDir, targetFile)}`);
});

console.log('[SEO Prerender] Successfully pre-rendered static HTML for all 7 Cards Least cluster routes!');
