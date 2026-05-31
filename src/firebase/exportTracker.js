import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';
import { logEvent } from './analytics';

/**
 * Retry a function with exponential backoff.
 * @param {Function} fn - async function to execute
 * @param {number} maxRetries - maximum attempts (default 3)
 * @param {number} baseDelayMs - initial delay (default 500ms)
 */
async function withRetry(fn, maxRetries = 3, baseDelayMs = 500) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Save export activity to Firestore (with retry) and log analytics event.
 * This function never throws; failures are logged but do not block the export.
 */
export async function trackExport(data) {
  const {
    studentName = '',
    studentId = '',
    university = '',
    semester = '',
    scale = '4.0',
    gpa = 0,
    credits = 0,
    date = new Date().toLocaleDateString(),
    exportType = 'unknown',
    timestamp = new Date().toISOString(),
    deviceInfo,
  } = data;

  // ── Firestore write (with retry) ──────────────────────────────
  if (firestore) {
    try {
      await withRetry(async () => {
        const exportsCollection = collection(firestore, 'exports');
        await addDoc(exportsCollection, {
          studentName,
          studentId,
          university,
          semester,
          scale,
          gpa,
          credits,
          date,
          exportType,
          // Firestore server timestamp for consistency, fallback to client
          timestamp: serverTimestamp(),
          deviceInfo: deviceInfo || getDefaultDeviceInfo(),
          createdAt: new Date().toISOString(),
        });
      });
    } catch (error) {
      // Firestore write failed after retries – not fatal
      if (process.env.NODE_ENV !== 'production') {
        console.error('Firestore export tracking failed after retries:', error);
      }
    }
  }

  // ── Analytics event (always fires if analytics loaded) ────────
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}

/**
 * Collect default device/browser info.
 * Used as fallback when the caller doesn't provide its own.
 */
function getDefaultDeviceInfo() {
  return {
    userAgent: navigator.userAgent || '',
    platform: navigator.platform || '',
    language: navigator.language || '',
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    viewportWidth: window.innerWidth || 0,
    viewportHeight: window.innerHeight || 0,
  };
}

/**
 * For backward compatibility – same as getDefaultDeviceInfo.
 * @deprecated Use the device info already collected by the analytics module.
 */
export function getDeviceInfo() {
  return getDefaultDeviceInfo();
}