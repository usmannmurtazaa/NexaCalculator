import { useState, useCallback } from 'react';
import { GRADES, SCALES } from '../utils/grades';
import { MAX_COURSES } from '../constants/limits';

function createInitialCourses() {
  return [
    { id: 1, code: "", credits: 3, gradeIdx: 0 },
    { id: 2, code: "", credits: 3, gradeIdx: 0 },
    { id: 3, code: "", credits: 3, gradeIdx: 0 },
  ];
}

export function useGPA(scale) {
  const [courses, setCourses] = useState(createInitialCourses);
  const [nextId, setNextId] = useState(4);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addCourse = useCallback(() => {
    if (courses.length >= MAX_COURSES) return;
    setCourses(prev => [...prev, { id: nextId, code: "", credits: 3, gradeIdx: 0 }]);
    setNextId(n => n + 1);
  }, [courses.length, nextId]);

  const removeCourse = useCallback((id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setResult(null);
  }, []);

  const updateCourse = useCallback((id, field, val) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  }, []);

  const calculate = useCallback(() => {
    setError("");
    if (courses.length === 0) {
      setError("Add at least one course.");
      return;
    }
    for (const c of courses) {
      if (!c.code.trim()) {
        setError("Please fill in all course codes.");
        return;
      }
    }
    const gradeScale = SCALES[scale] || GRADES;
    let tp = 0, tc = 0;
    for (const c of courses) {
      tp += gradeScale[c.gradeIdx].p * c.credits;
      tc += c.credits;
    }
    const gpa = tc ? tp / tc : 0;
    setResult({
      gpa: gpa.toFixed(2),
      count: courses.length,
      credits: tc,
      points: tp,
    });
  }, [courses, scale]);

  return { courses, addCourse, removeCourse, updateCourse, calculate, result, error };
}