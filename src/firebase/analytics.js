// src/firebase/analytics.js
import { logEvent as firebaseLogEvent, setUserProperties as fbSetUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Log a custom event to Firebase Analytics.
 * Gracefully handles missing analytics (e.g., blocked by ad-blocker).
 */
export function logEvent(eventName, params = {}) {
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, {
        ...params,
        page_location: window.location.href,
        page_title: document.title,
      });
    } catch (error) {
      console.warn('Analytics logEvent error:', error);
    }
  }
}

/**
 * Set user properties (e.g., theme preference).
 */
export function setUserProperties(properties) {
  if (analytics) {
    try {
      fbSetUserProperties(analytics, properties);
    } catch (error) {
      console.warn('Analytics setUserProperties error:', error);
    }
  }
}

/**
 * Track page view manually (useful for SPAs).
 */
export function trackPageView(path) {
  logEvent('page_view', {
    page_path: path,
    page_title: document.title,
  });
}