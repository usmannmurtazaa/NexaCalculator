import { useState } from 'react';
import { useGPA } from '../hooks/useGPA';
import { GRADES, SCALES } from '../utils/grades';
import { generatePDF } from '../utils/pdfExport';
import { downloadCSV } from '../utils/csvExport';
import CourseCard from './CourseCard';
import ResultCard from './ResultCard';
import GradeProgressBar from './GradeProgressBar';
import TargetGPACalculator from './TargetGPACalculator';
import ExportModal from './ExportModal';
import theme from '../constants/theme';

export default function GPACalculator({ scale, darkMode }) {
  const { courses, addCourse, removeCourse, updateCourse, calculate, result, error } = useGPA(scale);
  const [showTargetGPA, setShowTargetGPA] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = (exportData) => {
    const gradeScale = SCALES[scale] || GRADES;
    const data = {
      ...exportData,
      scale,
      courses: courses.map(c => ({
        code: c.code || "—",
        credits: c.credits,
        grade: gradeScale[c.gradeIdx].g,
        points: gradeScale[c.gradeIdx].p.toFixed(2),
      })),
      gpaResult: result,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    if (exportData.format === 'pdf') {
      generatePDF(data);
    } else {
      downloadCSV(data);
    }
  };

  const isDark = darkMode;

  return (
    <div>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        darkMode={darkMode}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          Current Courses & Grades
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setShowTargetGPA(!showTargetGPA)}
            style={{
              padding: '6px 14px',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 20,
              color: '#a78bfa',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {showTargetGPA ? 'Hide' : 'Show'} Target GPA
          </button>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              color: '#7c3aed',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              padding: '5px 14px',
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {courses.length} / 8 courses
          </div>
        </div>
      </div>

      {courses.map((c, i) => (
        <CourseCard
          key={c.id}
          id={c.id}
          index={i}
          removable={i >= 3}
          onRemove={removeCourse}
          data={c}
          onChange={updateCourse}
          scale={scale}
          darkMode={darkMode}
        />
      ))}

      {courses.length < 8 && (
        <button
          onClick={addCourse}
          style={{
            width: '100%',
            padding: 'clamp(11px, 2.5vw, 13px)',
            border: '2px dashed rgba(124,58,237,0.4)',
            borderRadius: 14,
            background: 'transparent',
            color: '#a78bfa',
            fontSize: 'clamp(14px, 3vw, 15px)',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 22 }}>+</span> Add New Course
        </button>
      )}

      <button
        onClick={calculate}
        style={{
          width: '100%',
          padding: 'clamp(14px, 3vw, 17px)',
          background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          fontSize: 'clamp(16px, 3.5vw, 17px)',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
        }}
      >
        Calculate Semester GPA
      </button>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 13,
            color: '#fca5a5',
            marginTop: 12,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {result && (
        <>
          <ResultCard
            gpa={result.gpa}
            courses={result.count}
            credits={result.credits}
            points={result.points}
            scale={scale}
            darkMode={darkMode}
          />
          <GradeProgressBar gpa={result.gpa} scale={scale} darkMode={darkMode} />
          {showTargetGPA && (
            <TargetGPACalculator
              currentGPA={result.gpa}
              totalCredits={result.credits}
              darkMode={darkMode}
            />
          )}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <button
              onClick={() => setShowExportModal(true)}
              style={{
                padding: '8px 16px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 8,
                color: '#a78bfa',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📥 Export Academic Record
            </button>
          </div>
        </>
      )}
    </div>
  );
}