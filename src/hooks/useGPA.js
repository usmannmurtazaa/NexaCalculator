import { useState, useCallback } from 'react';
import { GRADES, SCALES } from '../utils/grades';
import { MAX_COURSES } from '../constants/limits';
import { logEvent } from '../firebase/analytics';

function createInitialCourses() {
  return [
    { id: 1, code: '', credits: 3, gradeIdx: 0 },
    { id: 2, code: '', credits: 3, gradeIdx: 0 },
    { id: 3, code: '', credits: 3, gradeIdx: 0 },
  ];
}

export function useGPA(scale) {
  const [courses, setCourses] = useState(createInitialCourses);
  const [nextId, setNextId] = useState(4);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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
      logEvent('course_removed', { removedId: id });
    },
    []
  );

  const updateCourse = useCallback((id, field, val) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  }, []);

  const calculate = useCallback(() => {
    setError('');
    const currentCourses = courses; // stable reference
    if (!currentCourses || currentCourses.length === 0) {
      setError('Add at least one course.');
      return;
    }

    for (const c of currentCourses) {
      if (!c.code || !c.code.trim()) {
        setError('Please fill in all course codes.');
        return;
      }
    }

    const gradeScale = SCALES[scale] || GRADES;
    let tp = 0,
      tc = 0;
    for (const c of currentCourses) {
      const grade = gradeScale[c.gradeIdx];
      if (!grade) continue;
      tp += grade.p * c.credits;
      tc += c.credits;
    }

    const gpa = tc ? tp / tc : 0;
    const gpaStr = gpa.toFixed(2);

    setResult({
      gpa: gpaStr,
      count: currentCourses.length,
      credits: tc,
      points: tp,
    });

    logEvent('gpa_calculated', {
      scale,
      courses_count: currentCourses.length,
      total_credits: tc,
      total_points: tp,
      gpa: parseFloat(gpaStr),
      timestamp: new Date().toISOString(),
    });
  }, [courses, scale]);

  return { courses, addCourse, removeCourse, updateCourse, calculate, result, error };
}