export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  h1: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: "7 Cards Least Online – Play 7 Cards Game & Seven Cards Free",
    description: "Play 7 Cards Least online for free. Track 7 cards least score live, discard matching sets and runs to achieve the lowest hand points, and win against friends or AI.",
    canonical: "https://cards.gnanamai.com/",
    h1: "7 Cards Least Game Online – Play Free With Friends & AI",
  },
  "7-cards-least": {
    title: "7 Cards Least Game Online – Official Guide & Portal",
    description: "Comprehensive guide to 7 Cards Least card game. Master deck setup, zero-point Joker wildcards, turn sequences, Match & Skip, and 80-point penalty.",
    canonical: "https://cards.gnanamai.com/7-cards-least",
    h1: "7 Cards Least Game Online – Official Guide & Portal",
  },
  "7-cards-least-rules": {
    title: "7 Cards Least Official Rules & Scoring Guide (Ace=1, Face=10, Jokers=0)",
    description: "Official 7 Cards Least rules & scoring guide. Complete point breakdown (Ace=1, 2-10 face value, J/Q/K=10, Joker=0), match & skip turns, and 80-point wrong call penalty.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Least Official Rules & Scoring Guide",
  },
  "7-cards-least-how-to-play": {
    title: "How to Play 7 Cards Least – Complete Step-by-Step Guide",
    description: "Learn how to play 7 Cards Least with a beginner-friendly step-by-step guide covering dealing, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Least – Step-by-Step Guide",
  },
  "7-cards-least-strategy": {
    title: "7 Cards Least Strategy – Tips & Tactics to Win More Matches",
    description: "Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Least Winning Strategy & Tactics",
  },
  "7-cards-least-faq": {
    title: "7 Cards Least FAQ – Frequently Asked Questions & Answers",
    description: "Specific answers to detailed player questions about edge-case rules, reshuffling, Joker runs, ties, turn limits, and online multiplayer rooms.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Least Frequently Asked Questions",
  },
  rules: {
    title: "7 Cards Least Official Rules & Scoring Guide (Ace=1, Face=10, Jokers=0)",
    description: "Official 7 Cards Least rules & scoring guide. Complete point breakdown (Ace=1, 2-10 face value, J/Q/K=10, Joker=0), match & skip turns, and 80-point wrong call penalty.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Least Official Rules & Scoring Guide",
  },
  "how-to-play": {
    title: "How to Play 7 Cards Least – Complete Step-by-Step Guide",
    description: "Learn how to play 7 Cards Least with a beginner-friendly step-by-step guide covering dealing, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Least – Step-by-Step Guide",
  },
  strategy: {
    title: "7 Cards Least Strategy – Tips & Tactics to Win More Matches",
    description: "Master winning 7 Cards Least strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Least Winning Strategy & Tactics",
  },
  multiplayer: {
    title: "Play 7 Cards Least Online Free – Multiplayer Card Game With Friends",
    description: "Play 7 Cards Least online for free with friends, family, or online players. Create private rooms, join with 4-digit codes, instant play in your browser with no download.",
    canonical: "https://cards.gnanamai.com/multiplayer",
    h1: "Play 7 Cards Least Online Free – Multiplayer",
  },
  "play-against-ai": {
    title: "7 Cards Least Against AI – Play Free Online",
    description: "Practice 7 Cards Least singleplayer against intelligent computer bots. Zero matchmaking delay, customizable bot counts, and instant play in your browser.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "7 Cards Least Against Computer AI",
  },
  solo: {
    title: "7 Cards Least Against AI – Play Free Online",
    description: "Practice 7 Cards Least singleplayer against intelligent computer bots. Zero matchmaking delay, customizable bot counts, and instant play in your browser.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "7 Cards Least Against Computer AI",
  },
  faq: {
    title: "7 Cards Least FAQ – Frequently Asked Questions & Answers",
    description: "Specific answers to detailed player questions about edge-case rules, reshuffling, Joker runs, ties, turn limits, and online multiplayer rooms.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Least Frequently Asked Questions",
  },
  "daily-challenge": {
    title: "7 Cards Least Daily Challenge – Lowest Score Puzzle",
    description: "Play today's 7 Cards Least Daily Challenge. Solve the seeded lowest-score puzzle, discard sets and runs, and share your score.",
    canonical: "https://cards.gnanamai.com/daily-challenge",
    h1: "7 Cards Least Daily Challenge",
  },
  "strategy-lab": {
    title: "7 Cards Least Interactive Strategy Lab – Test Your Moves",
    description: "Interactive 7 Cards Least strategy lab. Practice realistic hand scenarios, test discards, set/run decisions, and Least calls with instant feedback.",
    canonical: "https://cards.gnanamai.com/strategy-lab",
    h1: "Interactive 7 Cards Least Strategy Lab",
  },
  "score-calculator": {
    title: "7 Cards Least Score Calculator – Hand Points & Least Eligibility",
    description: "Free online 7 Cards Least score calculator. Select your hand cards and table joker to calculate points, detect valid sets/runs, and check Least call status.",
    canonical: "https://cards.gnanamai.com/score-calculator",
    h1: "7 Cards Least Score Calculator",
  },
  notFound: {
    title: "Page Not Found – 7 Cards Game",
    description: "The requested card room or page was not found. Return to 7 Cards Game home, how to play guide, or rules.",
    canonical: "https://cards.gnanamai.com/404",
    h1: "Page Not Found",
  }
};

export function updatePageSeo(routeKey: string) {
  if (typeof document === 'undefined') return;

  const config = SEO_CONFIGS[routeKey] || SEO_CONFIGS.home;

  // Title
  document.title = config.title;

  // Helper to set or create meta tags
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', config.description);

  // Open Graph
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', config.canonical);

  // Twitter
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', config.canonical);
}
