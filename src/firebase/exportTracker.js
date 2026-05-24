import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';
import { logEvent } from './analytics';

/**
 * Save export activity to Firestore and log analytics event.
 */
export async function trackExport({
  studentName,
  studentId,
  university,
  semester,
  scale,
  gpa,
  credits,
  date,
  exportType,
  timestamp,
  deviceInfo,
}) {
  // Firestore
  if (firestore) {
    try {
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
        timestamp: serverTimestamp(), // server timestamp for consistency
        deviceInfo,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Firestore export tracking error:', error);
    }
  }

  // Analytics event (always fires if analytics is loaded)
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}

/**
 * Collect device/browser info (same as elsewhere, but placed here for independence).
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}