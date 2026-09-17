export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  h1: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: "7 Card Game Online – Free Multiplayer Card Game",
    description: "Play 7 Card Game online for free. Learn the rules, see how the game works, and enjoy a simple browser-based card game.",
    canonical: "https://cards.gnanamai.com/",
    h1: "Play 7 Card Game Online",
  },
  "how-to-play": {
    title: "How to Play 7 Card Game – Beginner's Guide",
    description: "Learn how to play 7 Card Game with a simple beginner-friendly guide covering setup, turns, cards, scoring, and gameplay.",
    canonical: "https://cards.gnanamai.com/how-to-play",
    h1: "How to Play 7 Card Game",
  },
  rules: {
    title: "7 Card Game Rules – How to Play and Win",
    description: "Understand the 7 Card Game rules, gameplay, turns, scoring, and card actions with this easy-to-follow guide.",
    canonical: "https://cards.gnanamai.com/rules",
    h1: "7 Card Game Rules",
  },
  multiplayer: {
    title: "7 Card Game Multiplayer – Play Online",
    description: "Play 7 Card Game online and learn how multiplayer gameplay works in your browser.",
    canonical: "https://cards.gnanamai.com/multiplayer",
    h1: "7 Card Game Multiplayer",
  },
  solo: {
    title: "7 Card Game Solo – Play Online",
    description: "Play 7 Card Game solo in your browser and learn how the single-player game works.",
    canonical: "https://cards.gnanamai.com/solo",
    h1: "7 Card Game Solo",
  },
  faq: {
    title: "7 Card Game FAQ – Rules, Gameplay & Common Questions",
    description: "Find answers to common questions about 7 Card Game rules, gameplay, multiplayer, and playing online.",
    canonical: "https://cards.gnanamai.com/faq",
    h1: "7 Card Game FAQ",
  },
  notFound: {
    title: "Page Not Found – 7 Card Game",
    description: "The requested page was not found. Return to 7 Card Game home, how to play guide, or rules.",
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
