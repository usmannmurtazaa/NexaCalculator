import { useState, useCallback, useMemo } from 'react';
import { GRADES, SCALES } from '../utils/grades';
import { MAX_COURSES } from '../constants/limits';
import { logEvent } from '../firebase/analytics';

// ── Helpers ──────────────────────────────────────────────────────────
const createInitialCourses = () => [
  { id: 1, code: '', credits: 3, gradeIdx: 0 },
  { id: 2, code: '', credits: 3, gradeIdx: 0 },
  { id: 3, code: '', credits: 3, gradeIdx: 0 },
];

/**
 * useGPA – manage course list and compute semester GPA.
 *
 * @param {string} scale – GPA scale (e.g., '4.0')
 * @returns {object} { courses, addCourse, removeCourse, updateCourse, reset, calculate, result, error }
 */
export function useGPA(scale) {
  const [courses, setCourses] = useState(createInitialCourses);
  const [nextId, setNextId] = useState(4);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const maxScale = useMemo(() => parseFloat(scale), [scale]);

  const addCourse = useCallback(() => {
    if (courses.length >= MAX_COURSES) return;
    setCourses((prev) => [
      ...prev,
      { id: nextId, code: '', credits: 3, gradeIdx: 0 },
    ]);
    setNextId((n) => n + 1);
    logEvent('course_added', { total: courses.length + 1 });
  }, [courses.length, nextId]);

  const removeCourse = useCallback(
    (id) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setResult(null);
      logEvent('course_removed', { removedId: id, remaining: courses.length - 1 });
    },
    [courses.length]
  );

  const updateCourse = useCallback((id, field, val) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setCourses(createInitialCourses());
    setNextId(4);
    setResult(null);
    setError('');
  }, []);

  const calculate = useCallback(() => {
    setError('');

    if (!courses || courses.length === 0) {
      setError('Add at least one course.');
      return;
    }

    // Validate course codes
    const missingCodes = courses.filter((c) => !c.code || !c.code.trim());
    if (missingCodes.length > 0) {
      const indices = missingCodes
        .map((c) => courses.indexOf(c) + 1)
        .join(', ');
      setError(`Please fill in course code(s) for course(s): ${indices}.`);
      return;
    }

    const gradeScale = SCALES[scale] || GRADES;
    let totalPoints = 0;
    let totalCredits = 0;

    for (const c of courses) {
      const grade = gradeScale[c.gradeIdx];
      if (!grade) continue;
      totalPoints += grade.p * c.credits;
      totalCredits += c.credits;
    }

    const gpa = totalCredits ? totalPoints / totalCredits : 0;
    const gpaStr = gpa.toFixed(2);
    const totalPointsFixed = totalPoints.toFixed(2);

    setResult({
      gpa: gpaStr,
      count: courses.length,
      credits: totalCredits,
      points: totalPointsFixed,
    });

    logEvent('gpa_calculated', {
      scale,
      courses_count: courses.length,
      total_credits: totalCredits,
      total_points: totalPointsFixed,
      gpa: parseFloat(gpaStr),
      timestamp: new Date().toISOString(),
    });
  }, [courses, scale]);

  return {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    reset, // new
    calculate,
    result,
    error,
  };
}