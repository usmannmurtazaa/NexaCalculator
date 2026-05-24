import { useState, useCallback } from 'react';
import { MAX_SEMESTERS } from '../constants/limits';
import { logEvent } from '../firebase/analytics';

function createInitialSems() {
  return [
    { id: 1, val: '' },
    { id: 2, val: '' },
  ];
}

export function useCGPA(scale) {
  const [sems, setSems] = useState(createInitialSems);
  const [nextId, setNextId] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const addSem = useCallback(() => {
    if (sems.length >= MAX_SEMESTERS) return;
    setSems((prev) => [...prev, { id: nextId, val: '' }]);
    setNextId((n) => n + 1);
    logEvent('semester_added', { total: sems.length + 1 });
  }, [sems.length, nextId]);

  const removeSem = useCallback(
    (id) => {
      setSems((prev) => prev.filter((s) => s.id !== id));
      setResult(null);
      logEvent('semester_removed', { removedId: id });
    },
    []
  );

  const updateSem = useCallback((id, val) => {
    setSems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, val } : s))
    );
  }, []);

  const calculate = useCallback(() => {
    setError('');
    const maxGPA = parseFloat(scale);
    let total = 0,
      count = 0,
      best = 0;

    for (const s of sems) {
      if (s.val === '') continue;
      const n = parseFloat(s.val);
      if (isNaN(n) || n < 0 || n > maxGPA) {
        setError(`Enter valid GPA values (0.00 – ${maxGPA}.00).`);
        return;
      }
      total += n;
      count++;
      if (n > best) best = n;
    }

    if (!count) {
      setError('Please enter at least one semester GPA.');
      return;
    }

    const cgpaValue = (total / count).toFixed(2);
    setResult({
      cgpa: cgpaValue,
      sems: count,
      total: total.toFixed(2),
      best: best.toFixed(2),
    });

    logEvent('cgpa_calculated', {
      scale,
      semesters: count,
      total,
      cgpa: parseFloat(cgpaValue),
      best: parseFloat(best.toFixed(2)),
      timestamp: new Date().toISOString(),
    });
  }, [sems, scale]);

  return {
    sems,
    addSem,
    removeSem,
    updateSem,
    calculate,
    result,
    error,
  };
}