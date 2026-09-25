export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  h1: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: "7 Cards Game Online (7cards) – Play 7 Cards Least Free With Friends & AI",
    description: "Play 7 Cards Game (7cards / 7 Cards Least) online for free. Enjoy real-time 7 card game multiplayer with friends or practice solo against computer AI. No download required.",
    canonical: "https://cards.gnanamai.com/",
    h1: "7 Cards Game Online – 7cards & 7 Cards Least",
  },
  "7-cards-least": {
    title: "7 Cards Game (7cards) – How to Play 7 Cards Least Online",
    description: "Discover 7 Cards Game (7cards), the popular low-hand card game. Learn how 7 cards are dealt, how discard sets & suited runs work, and start playing online.",
    canonical: "https://cards.gnanamai.com/7-cards-least",
    h1: "7 Cards Game – 7cards Online",
  },
  "7-cards-least-rules": {
    title: "7 Cards Game Rules (7cards) – Official Scoring & Turn Guide",
    description: "Official 7 Cards Game rules guide. Learn card point values (Aces=1, Face cards=10), Joker wildcard mechanics, Match & Skip turns, and the 80-point wrong call penalty.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Game Rules & Scoring",
  },
  "7-cards-least-how-to-play": {
    title: "How to Play 7 Cards Game (7cards) – Complete Step-by-Step Guide",
    description: "Learn how to play 7 Cards Game (7cards) with a beginner-friendly step-by-step guide covering dealing 7 cards, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Game",
  },
  "7-cards-least-strategy": {
    title: "7 Cards Game Strategy – Tips & Tactics for 7cards & 7 Cards Least",
    description: "Master winning 7 Cards Game strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Game Strategy",
  },
  "7-cards-least-faq": {
    title: "7 Cards Game FAQ – Answers to 7cards & 7 Cards Least Questions",
    description: "Answers to common 7 Cards Game questions: card values, dealing 7 cards, online multiplayer rooms, AI difficulty, Joker wildcard evaluation, and score elimination.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Game Frequently Asked Questions",
  },
  rules: {
    title: "7 Cards Game Rules (7cards) – Official Scoring & Turn Guide",
    description: "Official 7 Cards Game rules guide. Learn card point values (Aces=1, Face cards=10), Joker wildcard mechanics, Match & Skip turns, and the 80-point wrong call penalty.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Game Rules & Scoring",
  },
  "how-to-play": {
    title: "How to Play 7 Cards Game (7cards) – Complete Step-by-Step Guide",
    description: "Learn how to play 7 Cards Game (7cards) with a beginner-friendly step-by-step guide covering dealing 7 cards, drawing, discarding sets & runs, Joker wildcard rank, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Game",
  },
  strategy: {
    title: "7 Cards Game Strategy – Tips & Tactics for 7cards & 7 Cards Least",
    description: "Master winning 7 Cards Game strategies: dump high-value face cards early, track opponent discards, utilize zero-point Jokers, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Game Strategy",
  },
  multiplayer: {
    title: "7 Cards Game Multiplayer – Play 7cards Online With Friends",
    description: "Play 7 Cards Game multiplayer online with friends or real opponents. Create private 4-digit code rooms, customize rounds, and enjoy live table chat.",
    canonical: "https://cards.gnanamai.com/multiplayer",
    h1: "7 Cards Game Multiplayer Online",
  },
  "play-against-ai": {
    title: "7 Cards Game Against AI (7cards) – Play Free Online",
    description: "Play 7 Cards Game against computer AI bots online for free. Practice your card shedding strategy, test Joker plays, and play instant solo matches with zero wait.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "7 Cards Game Against AI",
  },
  solo: {
    title: "7 Cards Game Against AI (7cards) – Play Free Online",
    description: "Play 7 Cards Game against computer AI bots online for free. Practice your card shedding strategy, test Joker plays, and play instant solo matches with zero wait.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "7 Cards Game Against AI",
  },
  faq: {
    title: "7 Cards Game FAQ – Answers to 7cards & 7 Cards Least Questions",
    description: "Answers to common 7 Cards Game questions: card values, dealing 7 cards, online multiplayer rooms, AI difficulty, Joker wildcard evaluation, and score elimination.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Game Frequently Asked Questions",
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
