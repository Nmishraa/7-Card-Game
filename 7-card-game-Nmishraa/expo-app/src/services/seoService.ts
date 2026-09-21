export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  h1: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: "7 Cards Least Game Online – Play Free 7 Card Game",
    description: "Play 7 Cards Least online for free. Learn the rules, play against AI, and enjoy an interactive card game experience. Explore how to play, scoring, sets, runs, jokers, and strategy.",
    canonical: "https://cards.gnanamai.com/",
    h1: "Play 7 Cards Least Online",
  },
  "7-cards-least": {
    title: "7 Cards Least Game Online – Play Free 7 Cards Least",
    description: "Play 7 Cards Least online for free. Learn the rules, how to play, strategy, scoring, and start an online game.",
    canonical: "https://cards.gnanamai.com/7-cards-least",
    h1: "7 Cards Least Game Online",
  },
  "7-cards-least-rules": {
    title: "7 Cards Least Rules – Complete Guide to the Game",
    description: "Understand 7 Cards Least rules, card point values, valid discard sets and suited runs, Joker wildcard evaluation, match & skip rules, and scoring penalties.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Least Rules",
  },
  "7-cards-least-how-to-play": {
    title: "How to Play 7 Cards Least Online",
    description: "Learn how to play 7 Cards Least online with a step-by-step guide covering dealing, hand combinations, drawing, discarding, Joker ranks, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Least",
  },
  "7-cards-least-strategy": {
    title: "7 Cards Least Strategy – Tips for Playing Better",
    description: "Master 7 Cards Least strategy: organize your hand, discard high-value face cards, utilize wild Jokers, track discards, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Least Strategy",
  },
  "7-cards-least-faq": {
    title: "7 Cards Least FAQ – Rules, Gameplay & Online Play",
    description: "Find answers to frequently asked questions about 7 Cards Least rules, card values, online multiplayer, playing against AI, sets and runs, and scoring.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Least Frequently Asked Questions",
  },
  rules: {
    title: "7 Cards Least Rules – Complete Guide to the Game",
    description: "Understand 7 Cards Least rules, card point values, valid discard sets and suited runs, Joker wildcard evaluation, match & skip rules, and scoring penalties.",
    canonical: "https://cards.gnanamai.com/7-cards-least/rules",
    h1: "7 Cards Least Rules",
  },
  "how-to-play": {
    title: "How to Play 7 Cards Least Online",
    description: "Learn how to play 7 Cards Least online with a step-by-step guide covering dealing, hand combinations, drawing, discarding, Joker ranks, and calling Least.",
    canonical: "https://cards.gnanamai.com/7-cards-least/how-to-play",
    h1: "How to Play 7 Cards Least",
  },
  strategy: {
    title: "7 Cards Least Strategy – Tips for Playing Better",
    description: "Master 7 Cards Least strategy: organize your hand, discard high-value face cards, utilize wild Jokers, track discards, and calculate safe Least call score windows.",
    canonical: "https://cards.gnanamai.com/7-cards-least/strategy",
    h1: "7 Cards Least Strategy",
  },
  multiplayer: {
    title: "7 Card Game Multiplayer – Play Online With Friends",
    description: "Play 7 Card Game online with friends or real-time online players. Create private 4-digit code rooms, customize round counts, and enjoy live table chat.",
    canonical: "https://cards.gnanamai.com/multiplayer",
    h1: "Play 7 Card Game Multiplayer Online",
  },
  "play-against-ai": {
    title: "Play 7 Card Game Against AI Online",
    description: "Play 7 Card Game against intelligent computer AI bots directly in your web browser for free. Enjoy zero-wait single-player card game practice.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "Play 7 Card Game Against AI",
  },
  solo: {
    title: "Play 7 Card Game Against AI Online",
    description: "Play 7 Card Game against intelligent computer AI bots directly in your web browser for free. Enjoy zero-wait single-player card game practice.",
    canonical: "https://cards.gnanamai.com/play-against-ai",
    h1: "Play 7 Card Game Against AI",
  },
  faq: {
    title: "7 Cards Least FAQ – Rules, Gameplay & Online Play",
    description: "Find answers to frequently asked questions about 7 Cards Least rules, card values, online multiplayer, playing against AI, sets and runs, and scoring.",
    canonical: "https://cards.gnanamai.com/7-cards-least/faq",
    h1: "7 Cards Least Frequently Asked Questions",
  },
  notFound: {
    title: "Page Not Found – 7 Cards Least",
    description: "The requested card room or page was not found. Return to 7 Cards Least home, how to play guide, or rules.",
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
