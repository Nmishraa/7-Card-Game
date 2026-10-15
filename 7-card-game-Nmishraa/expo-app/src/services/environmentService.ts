/**
 * Environment detection service
 * Detects whether the game is running as an embedded standalone game (CrazyGames, Poki, iframe)
 * or as the full public web application on cards.gnanamai.com.
 */

export const isEmbeddedGame = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    // 1. Explicit flag set in standalone packages (CrazyGames, Poki, etc.)
    if ((window as any).IS_CRAZYGAMES === true || (window as any).__IS_EMBEDDED_GAME__ === true) {
      return true;
    }

    // 2. Running inside an iframe container
    if (window.self !== window.top) {
      return true;
    }

    // 3. Domain is not cards.gnanamai.com and not local development
    const hostname = window.location.hostname;
    if (
      hostname &&
      !hostname.includes('cards.gnanamai.com') &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      return true;
    }
  } catch (e) {
    // Accessing window.top in cross-origin sandboxed iframes throws SecurityError
    return true;
  }
  return false;
};
