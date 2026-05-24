// src/firebase/exportTracker.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Save export details to Firestore for analytics dashboard.
 * Returns a promise that resolves with the document reference.
 */
export async function trackExport(data) {
  try {
    // Validate required fields
    const safeData = {
      studentName: String(data.studentName || '').trim(),
      studentId: String(data.studentId || '').trim(),
      university: String(data.university || '').trim(),
      semester: String(data.semester || '').trim(),
      scale: String(data.scale || ''),
      gpa: Number(data.gpa) || 0,
      credits: Number(data.credits) || 0,
      date: String(data.date || ''),
      exportType: String(data.exportType || ''), // 'pdf' or 'csv'
      timestamp: serverTimestamp(), // Firestore server timestamp
      deviceInfo: {
        userAgent: String(data.deviceInfo?.userAgent || navigator.userAgent),
        platform: String(data.deviceInfo?.platform || navigator.platform),
        language: String(data.deviceInfo?.language || navigator.language),
        screenWidth: Number(data.deviceInfo?.screenWidth) || window.screen.width,
        screenHeight: Number(data.deviceInfo?.screenHeight) || window.screen.height,
      },
    };

    const docRef = await addDoc(collection(db, 'exports'), safeData);
    console.log('Export tracked with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Failed to track export:', error);
    // Silently fail - don't interrupt user flow
    return null;
  }
}