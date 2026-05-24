/**
 * Academic grading scales and standing determination.
 * Supports 4.0, 5.0, and 10.0 scales.
 */

export const GRADES = [
  { l: 'A+  — 4.00', p: 4.0, g: 'A+' },
  { l: 'A   — 4.00', p: 4.0, g: 'A' },
  { l: 'A−  — 3.67', p: 3.67, g: 'A−' },
  { l: 'B+  — 3.33', p: 3.33, g: 'B+' },
  { l: 'B   — 3.00', p: 3.0, g: 'B' },
  { l: 'B−  — 2.67', p: 2.67, g: 'B−' },
  { l: 'C+  — 2.33', p: 2.33, g: 'C+' },
  { l: 'C   — 2.00', p: 2.0, g: 'C' },
  { l: 'C−  — 1.67', p: 1.67, g: 'C−' },
  { l: 'D   — 1.00', p: 1.0, g: 'D' },
  { l: 'F   — 0.00', p: 0.0, g: 'F' },
];

export const SCALES = {
  '4.0': GRADES,
  '5.0': [
    { l: 'A  — 5.00', p: 5.0, g: 'A' },
    { l: 'B  — 4.00', p: 4.0, g: 'B' },
    { l: 'C  — 3.00', p: 3.0, g: 'C' },
    { l: 'D  — 2.00', p: 2.0, g: 'D' },
    { l: 'E  — 1.00', p: 1.0, g: 'E' },
    { l: 'F  — 0.00', p: 0.0, g: 'F' },
  ],
  '10.0': [
    { l: '10  — 10.0', p: 10.0, g: '10' },
    { l: '9   — 9.00', p: 9.0, g: '9' },
    { l: '8   — 8.00', p: 8.0, g: '8' },
    { l: '7   — 7.00', p: 7.0, g: '7' },
    { l: '6   — 6.00', p: 6.0, g: '6' },
    { l: '5   — 5.00', p: 5.0, g: '5' },
    { l: '4   — 4.00', p: 4.0, g: '4' },
  ],
};

/**
 * Determine academic standing based on GPA percentage relative to scale.
 * @param {number} g - GPA value
 * @param {string} scale - GPA scale key (e.g. '4.0')
 * @returns {{ t: string, color: string }} standing text and color
 */
export function getStanding(g, scale = '4.0') {
  const maxGPA = parseFloat(scale);
  const percentage = (g / maxGPA) * 100;

  if (percentage >= 92.5)
    return { t: "Outstanding — Dean's List", color: '#a78bfa' };
  if (percentage >= 75)
    return { t: 'Very Good Standing', color: '#34d399' };
  if (percentage >= 62.5)
    return { t: 'Good Standing', color: '#60a5fa' };
  if (percentage >= 50)
    return { t: 'Satisfactory', color: '#fbbf24' };
  if (percentage >= 25)
    return { t: 'Below Average', color: '#f87171' };
  return { t: 'Academic Probation', color: '#ef4444' };
}