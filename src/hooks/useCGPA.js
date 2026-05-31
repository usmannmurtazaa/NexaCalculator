import { useState, useCallback, useMemo } from 'react';
import { MAX_SEMESTERS } from '../constants/limits';
import { logEvent } from '../firebase/analytics';

// ── Helper ──────────────────────────────────────────────────────────
const createInitialSems = () => [
  { id: 1, val: '' },
  { id: 2, val: '' },
];

/**
 * useCGPA – manage semester GPAs and compute cumulative result.
 *
 * @param {string} scale – GPA scale (e.g., '4.0')
 * @returns {object} { sems, addSem, removeSem, updateSem, reset, calculate, result, error }
 */
export function useCGPA(scale) {
  const [sems, setSems] = useState(createInitialSems);
  const [nextId, setNextId] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const maxGPA = useMemo(() => parseFloat(scale), [scale]);

  // Add a new semester (up to MAX_SEMESTERS)
  const addSem = useCallback(() => {
    if (sems.length >= MAX_SEMESTERS) return;
    setSems((prev) => [...prev, { id: nextId, val: '' }]);
    setNextId((n) => n + 1);
    logEvent('semester_added', { total: sems.length + 1 });
  }, [sems.length, nextId]);

  // Remove a semester by id
  const removeSem = useCallback(
    (id) => {
      setSems((prev) => prev.filter((s) => s.id !== id));
      setResult(null);
      logEvent('semester_removed', { removedId: id, remaining: sems.length - 1 });
    },
    [sems.length]
  );

  // Update a semester's GPA value
  const updateSem = useCallback((id, val) => {
    setSems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, val } : s))
    );
  }, []);

  // Reset to initial state (2 empty semesters)
  const reset = useCallback(() => {
    setSems(createInitialSems());
    setNextId(3);
    setResult(null);
    setError('');
  }, []);

  // Calculate cumulative GPA
  const calculate = useCallback(() => {
    setError('');
    let total = 0;
    let count = 0;
    let best = 0;

    for (const s of sems) {
      if (s.val === '' || s.val === null) continue;
      const n = parseFloat(s.val);
      if (isNaN(n) || n < 0 || n > maxGPA) {
        setError(`Enter valid GPA values (0.00 – ${maxGPA.toFixed(2)}).`);
        return;
      }
      total += n;
      count++;
      if (n > best) best = n;
    }

    if (count === 0) {
      setError('Please enter at least one semester GPA.');
      return;
    }

    const cgpaValue = (total / count).toFixed(2);
    const totalFixed = total.toFixed(2);
    const bestFixed = best.toFixed(2);

    setResult({
      cgpa: cgpaValue,
      sems: count,
      total: totalFixed,
      best: bestFixed,
    });

    logEvent('cgpa_calculated', {
      scale,
      semesters: count,
      total: totalFixed,
      cgpa: cgpaValue,
      best: bestFixed,
      timestamp: new Date().toISOString(),
    });
  }, [sems, maxGPA, scale]);

  return {
    sems,
    addSem,
    removeSem,
    updateSem,
    reset,          // new
    calculate,
    result,
    error,
  };
}