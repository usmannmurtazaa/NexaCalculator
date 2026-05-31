// ── Imports ────────────────────────────────────────────────────────────────────
import { SCALES, GRADES, getStanding } from './grades';            // now uses upgraded grades.js
import { trackExport } from '../firebase/exportTracker';
import { downloadCSV as coreDownloadCSV } from './csvExport';      // already upgraded
import { generatePDF as coreGeneratePDF } from './pdfExport';      // already upgraded

// Re‑export getStanding for convenience (already from grades.js)
export { getStanding };

// ── GPA Calculation ───────────────────────────────────────────────────────────
export function calcGPA(courses, scale) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return { error: 'No courses provided' };
  }
  const gradeScale = SCALES[scale] ?? GRADES;
  let totalPoints = 0;
  let totalCredits = 0;

  for (const c of courses) {
    if (c.credits <= 0) continue;  // skip invalid credits silently? Could add validation
    const grade = gradeScale[c.gradeIdx];
    if (!grade) continue;
    totalPoints += grade.p * c.credits;
    totalCredits += c.credits;
  }

  if (totalCredits === 0) {
    return { error: 'Total credits must be greater than zero' };
  }

  const gpa = totalPoints / totalCredits;
  return {
    gpa: parseFloat(gpa.toFixed(2)),
    count: courses.length,
    credits: totalCredits,
    points: parseFloat(totalPoints.toFixed(2)),
  };
}

// ── CGPA Calculation ──────────────────────────────────────────────────────────
export function calcCGPA(sems, scale) {
  if (!Array.isArray(sems) || sems.length === 0) {
    return { error: 'No semesters provided' };
  }
  const max = parseFloat(scale);
  let total = 0;
  let count = 0;
  let best = 0;

  for (const s of sems) {
    if (s.val === '' || s.val === null || s.val === undefined) continue;
    const n = parseFloat(s.val);
    if (isNaN(n) || n < 0 || n > max) {
      return { error: `Enter valid GPA values (0.00 – ${max.toFixed(2)}).` };
    }
    total += n;
    count++;
    if (n > best) best = n;
  }

  if (count === 0) {
    return { error: 'Please enter at least one semester GPA.' };
  }

  return {
    cgpa: parseFloat((total / count).toFixed(2)),
    sems: count,
    total: parseFloat(total.toFixed(2)),
    best: parseFloat(best.toFixed(2)),
  };
}

// ── CSV Export (delegates to upgraded csvExport.js) ───────────────────────────
export function downloadCSV(data) {
  // The data object is already prepared by the caller (GPACalculator)
  // It contains: { studentName, studentId, university, semester, date, scale, courses, gpaResult }
  // We'll pass it directly to the central downloadCSV, which handles formatting.
  try {
    coreDownloadCSV(data);
    // Firebase tracking is done inside coreDownloadCSV? No, but we can keep here if needed.
    // However, the caller (GPACalculator) already calls trackExport separately.
    // To avoid double tracking, we rely on the caller's logic.
  } catch (err) {
    console.error('CSV export failed:', err);
  }
}

// ── PDF Export (delegates to upgraded pdfExport.js) ───────────────────────────
export async function generatePDF(data) {
  try {
    await coreGeneratePDF(data);
    // Again, tracking is handled by the calling component.
  } catch (err) {
    console.error('PDF export failed:', err);
  }
}

// ── Email Validation ──────────────────────────────────────────────────────────
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// ── Device Info (used internally, kept for backward compat) ───────────────────
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}