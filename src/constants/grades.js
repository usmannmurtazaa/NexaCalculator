/**
 * Academic grading scales and standing determination.
 *
 * Supported scales:
 * - 4.0 (default)
 * - 5.0
 * - 10.0
 *
 * Each scale entry provides:
 * - l: display label (e.g. "A+  — 4.00")
 * - p: numeric point value
 * - g: raw grade letter/number
 */

// ── 4.0 Scale (default) ────────────────────────────────────────────
export const GRADES = Object.freeze([
  { l: 'A+  — 4.00', p: 4.0,  g: 'A+' },
  { l: 'A   — 4.00', p: 4.0,  g: 'A'  },
  { l: 'A−  — 3.67', p: 3.67, g: 'A−' },
  { l: 'B+  — 3.33', p: 3.33, g: 'B+' },
  { l: 'B   — 3.00', p: 3.0,  g: 'B'  },
  { l: 'B−  — 2.67', p: 2.67, g: 'B−' },
  { l: 'C+  — 2.33', p: 2.33, g: 'C+' },
  { l: 'C   — 2.00', p: 2.0,  g: 'C'  },
  { l: 'C−  — 1.67', p: 1.67, g: 'C−' },
  { l: 'D   — 1.00', p: 1.0,  g: 'D'  },
  { l: 'F   — 0.00', p: 0.0,  g: 'F'  },
]);

// ── Additional scales ──────────────────────────────────────────────
const SCALE_5_0 = Object.freeze([
  { l: 'A  — 5.00', p: 5.0, g: 'A' },
  { l: 'B  — 4.00', p: 4.0, g: 'B' },
  { l: 'C  — 3.00', p: 3.0, g: 'C' },
  { l: 'D  — 2.00', p: 2.0, g: 'D' },
  { l: 'E  — 1.00', p: 1.0, g: 'E' },
  { l: 'F  — 0.00', p: 0.0, g: 'F' },
]);

const SCALE_10_0 = Object.freeze([
  { l: '10  — 10.0', p: 10.0, g: '10' },
  { l: '9   — 9.00', p: 9.0,  g: '9'  },
  { l: '8   — 8.00', p: 8.0,  g: '8'  },
  { l: '7   — 7.00', p: 7.0,  g: '7'  },
  { l: '6   — 6.00', p: 6.0,  g: '6'  },
  { l: '5   — 5.00', p: 5.0,  g: '5'  },
  { l: '4   — 4.00', p: 4.0,  g: '4'  },
]);

// ── Scale map ──────────────────────────────────────────────────────
export const SCALES = Object.freeze({
  '4.0':  GRADES,
  '5.0':  SCALE_5_0,
  '10.0': SCALE_10_0,
});

/**
 * Retrieve the grade array for a given scale.
 * Falls back to the default 4.0 scale if not found.
 *
 * @param {string} scale - scale key (e.g. '4.0', '5.0')
 * @returns {Array<{l:string, p:number, g:string}>}
 */
export function getGradeScale(scale) {
  return SCALES[scale] || GRADES;
}

// ── Standing colours ───────────────────────────────────────────────
// Shared palette for consistency across components
export const STANDING_COLORS = {
  outstanding: '#a78bfa',
  veryGood:    '#34d399',
  good:        '#60a5fa',
  satisfactory:'#fbbf24',
  belowAverage:'#f87171',
  probation:   '#ef4444',
};

/**
 * Determine academic standing based on GPA percentage relative to scale.
 *
 * @param {number} gpa - GPA value (e.g. 3.50)
 * @param {string|number} scale - scale identifier (e.g. '4.0') or max GPA number
 * @returns {{ t: string, color: string }} standing text and associated colour
 */
export function getStanding(gpa, scale = '4.0') {
  const maxGPA = typeof scale === 'number' ? scale : parseFloat(scale);
  if (isNaN(maxGPA) || maxGPA <= 0) {
    // Fallback to default 4.0
    return getStanding(gpa, 4.0);
  }
  const percentage = (gpa / maxGPA) * 100;

  if (percentage >= 92.5) {
    return { t: "Outstanding — Dean's List", color: STANDING_COLORS.outstanding };
  }
  if (percentage >= 80) {  // slightly higher threshold for "Very Good"
    return { t: 'Very Good Standing', color: STANDING_COLORS.veryGood };
  }
  if (percentage >= 65) {
    return { t: 'Good Standing', color: STANDING_COLORS.good };
  }
  if (percentage >= 50) {
    return { t: 'Satisfactory', color: STANDING_COLORS.satisfactory };
  }
  if (percentage >= 35) {
    return { t: 'Below Average', color: STANDING_COLORS.belowAverage };
  }
  return { t: 'Academic Probation', color: STANDING_COLORS.probation };
}