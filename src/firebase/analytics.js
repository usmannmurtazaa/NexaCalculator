// src/firebase/analytics.js
import { logEvent as firebaseLogEvent, setUserProperties as fbSetUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';

// ── Device / Browser Detection (cached) ────────────────────────────
let deviceInfoCache = null;

function getDeviceInfo() {
  if (deviceInfoCache) return deviceInfoCache;
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';
  const language = navigator.language || 'unknown';
  const screenWidth = window.screen?.width || 0;
  const screenHeight = window.screen?.height || 0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Device type heuristic
  let deviceType = 'desktop';
  if (/Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'mobile';
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      deviceType = 'tablet';
    }
  }

  // Browser detection
  let browserName = 'Unknown';
  if (ua.includes('Firefox/')) browserName = 'Firefox';
  else if (ua.includes('Edg/')) browserName = 'Edge';
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browserName = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browserName = 'Safari';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browserName = 'Opera';

  deviceInfoCache = {
    device_type: deviceType,
    browser: browserName,
    platform,
    language,
    screen_resolution: `${screenWidth}x${screenHeight}`,
    viewport: `${viewportWidth}x${viewportHeight}`,
  };
  return deviceInfoCache;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Log a custom event to Firebase Analytics.
 * Automatically enriches with device, browser, page location, and timestamp.
 * Gracefully handles missing analytics (e.g., blocked by ad-blocker).
 */
export function logEvent(eventName, params = {}) {
  if (!analytics) return;

  try {
    const deviceInfo = getDeviceInfo();
    firebaseLogEvent(analytics, eventName, {
      ...params,
      page_location: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      ...deviceInfo,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Analytics logEvent error:', error);
    }
  }
}

/**
 * Set user properties (e.g., theme preference).
 * Also sets device info once per session for better segmentation.
 */
export function setUserProperties(properties) {
  if (!analytics) return;

  try {
    // Merge with device info the first time
    const deviceInfo = getDeviceInfo();
    fbSetUserProperties(analytics, {
      ...properties,
      device_type: deviceInfo.device_type,
      browser: deviceInfo.browser,
      screen_resolution: deviceInfo.screen_resolution,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Analytics setUserProperties error:', error);
    }
  }
}

/**
 * Track page view manually (useful for SPAs).
 * Automatically captures referrer and full path.
 */
export function trackPageView(path) {
  logEvent('page_view', {
    page_path: path,
    page_referrer: document.referrer || '',
  });
}

/**
 * Reset the cached device info (e.g., after orientation change).
 * Rarely needed.
 */
export function resetDeviceInfoCache() {
  deviceInfoCache = null;
}