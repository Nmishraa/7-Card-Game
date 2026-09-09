/**
 * Google Analytics 4 (GA4) Service for 7 Card Game
 * Supports Web (Expo Web / React Native Web) and dynamic Measurement ID configuration.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const STORAGE_KEY_GA_ID = '7card_ga_measurement_id';
const DEFAULT_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || 'G-1WQS2TKE5H';

let currentMeasurementId = DEFAULT_MEASUREMENT_ID;
let isInitialized = false;

/**
 * Get active GA Measurement ID
 */
export const getGAMeasurementId = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedId = window.localStorage.getItem(STORAGE_KEY_GA_ID);
    if (savedId && savedId.trim().startsWith('G-')) {
      return savedId.trim();
    }
  }
  return currentMeasurementId;
};

/**
 * Set custom GA Measurement ID dynamically
 */
export const setGAMeasurementId = (newId: string): void => {
  const trimmed = newId.trim().toUpperCase();
  if (trimmed && trimmed.startsWith('G-')) {
    currentMeasurementId = trimmed;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_GA_ID, trimmed);
    }
    // Re-initialize with new ID
    initGA(trimmed, true);
  }
};

/**
 * Initialize Google Analytics 4 Script
 */
export const initGA = (measurementId?: string, forceReload = false): boolean => {
  if (typeof window === 'undefined' || !window.document) {
    return false;
  }

  const activeId = measurementId || getGAMeasurementId();
  currentMeasurementId = activeId;

  if (isInitialized && !forceReload) {
    return true;
  }

  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = window.gtag || gtag;

    // Check if script element already exists
    const scriptId = 'ga-gtag-script';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.async = true;
      scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${activeId}`;
      document.head.appendChild(scriptEl);
    } else if (forceReload) {
      scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${activeId}`;
    }

    window.gtag('js', new Date());
    window.gtag('config', activeId, {
      send_page_view: true,
      app_name: '7 Card Game',
      app_version: '1.0.0',
    });

    isInitialized = true;
    console.log(`[Google Analytics 4] Initialized with ID: ${activeId}`);
    return true;
  } catch (err) {
    console.error('[Google Analytics 4] Initialization error:', err);
    return false;
  }
};

/**
 * Check if GA is active and initialized
 */
export const isGAInitialized = (): boolean => isInitialized;

/**
 * Track Page / Screen View in GA4
 */
export const trackGAPageView = (screenName: string, title?: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  const activeId = getGAMeasurementId();
  try {
    window.gtag('event', 'page_view', {
      page_title: title || `7 Card Game - ${screenName}`,
      page_location: window.location.href,
      page_path: `/${screenName.toLowerCase()}`,
      send_to: activeId,
    });
  } catch (err) {
    console.warn('[Google Analytics 4] Page view error:', err);
  }
};

/**
 * Track Custom Event in GA4
 */
export const trackGAEvent = (eventName: string, params: Record<string, any> = {}): void => {
  if (typeof window === 'undefined') return;

  // Auto-init if not initialized yet
  if (!isInitialized) {
    initGA();
  }

  if (window.gtag) {
    try {
      window.gtag('event', eventName, {
        ...params,
        app_name: '7 Card Game',
        timestamp: Date.now(),
      });
      console.log(`[Google Analytics 4] Event tracked: ${eventName}`, params);
    } catch (err) {
      console.warn('[Google Analytics 4] Event track error:', err);
    }
  }
};

/**
 * Send Test GA Event for verification
 */
export const sendTestGAEvent = (): { success: boolean; eventName: string; timestamp: number } => {
  const timestamp = Date.now();
  const eventName = 'test_ga_ping';

  trackGAEvent(eventName, {
    test_type: 'manual_dashboard_test',
    measurement_id: getGAMeasurementId(),
  });

  return { success: true, eventName, timestamp };
};
