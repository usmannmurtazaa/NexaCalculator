import { useState, useCallback } from 'react';
import { useGPA } from '../hooks/useGPA';
import { GRADES, SCALES } from '../utils/grades';
import { generatePDF } from '../utils/pdfExport';
import { downloadCSV } from '../utils/csvExport';
import { logEvent } from '../firebase/analytics';
import { trackExport } from '../firebase/exportTracker';
import CourseCard from './CourseCard';
import ResultCard from './ResultCard';
import { GradeProgressBar, TargetGPACalculator } from './GradeExtras';
import ExportModal from './ExportModal';
import Toast from './Toast';
import theme from '../constants/theme';

export default function GPACalculator({ scale, darkMode }) {
  const {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    calculate,
    result,
    error,
  } = useGPA(scale);

  const [showTargetGPA, setShowTargetGPA] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleCalculate = useCallback(() => {
    setCalculating(true);
    setTimeout(() => {
      calculate();
      logEvent('gpa_calculated', {
        scale,
        courses_count: courses.length,
        timestamp: new Date().toISOString(),
      });
      setCalculating(false);
    }, 50);
  }, [calculate, scale, courses.length]);

  const handleExport = useCallback(
    async (exportData) => {
      setIsExporting(true);
      setToast({ message: '', type: '' });
      const gradeScale = SCALES[scale] || GRADES;
      const data = {
        ...exportData,
        scale,
        courses: courses.map((c) => ({
          code: c.code || '—',
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

      try {
        if (exportData.format === 'pdf') {
          await generatePDF(data);
        } else {
          downloadCSV(data);
        }

        await trackExport({
          studentName: exportData.studentName || '',
          studentId: exportData.studentId || '',
          university: exportData.university || '',
          semester: exportData.semester || '',
          scale,
          gpa: result?.gpa || 0,
          credits: result?.credits || 0,
          date: data.date,
          exportType: exportData.format,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          },
        });

        logEvent('export_triggered', {
          format: exportData.format,
          scale,
          gpa: result?.gpa,
        });

        setShowExportModal(false);
        setToast({ message: 'Export completed successfully!', type: 'success' });
      } catch (err) {
        console.error('Export failed:', err);
        setToast({ message: 'Export failed. Please try again.', type: 'error' });
      } finally {
        setIsExporting(false);
      }
    },
    [courses, scale, result]
  );

  const isDark = darkMode;

  return (
    <div className="animate-fade-up">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
        darkMode={darkMode}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
        darkMode={darkMode}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(13px, 2.5vw, 14px)',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)',
            margin: 0,
          }}
        >
          Current Courses & Grades
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowTargetGPA(!showTargetGPA)}
            style={{
              padding: '6px 16px',
              background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
              border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.2)'}`,
              borderRadius: 20,
              color: '#a78bfa',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)')}
          >
            {showTargetGPA ? 'Hide' : 'Show'} Target GPA
          </button>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              color: isDark ? '#c4b5fd' : '#7c3aed',
              background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
              border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.2)'}`,
              padding: '6px 16px',
              borderRadius: 20,
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
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
            padding: 'clamp(12px, 2.5vw, 14px)',
            border: `2px dashed ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.25)'}`,
            borderRadius: 14,
            background: 'transparent',
            color: isDark ? '#c4b5fd' : '#7c3aed',
            fontSize: 'clamp(14px, 3vw, 15px)',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.25s ease',
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.06)' : 'rgba(124,58,237,0.03)';
            e.currentTarget.style.borderColor = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.25)';
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>+</span> Add New Course
        </button>
      )}

      <button
        onClick={handleCalculate}
        disabled={calculating}
        style={{
          width: '100%',
          padding: 'clamp(14px, 3vw, 17px)',
          background: calculating ? 'linear-gradient(135deg, #6d28d9, #5b21b6)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          fontSize: 'clamp(16px, 3.5vw, 17px)',
          fontWeight: 600,
          cursor: calculating ? 'wait' : 'pointer',
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.3s ease',
          transform: calculating ? 'scale(0.98)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!calculating) e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 58, 237, 0.45)';
        }}
        onMouseLeave={(e) => {
          if (!calculating) e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.35)';
        }}
      >
        {calculating ? (
          <>
            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            Calculating...
          </>
        ) : (
          'Calculate Semester GPA'
        )}
      </button>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 13,
            color: '#fca5a5',
            marginTop: 16,
            backdropFilter: 'blur(8px)',
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
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <button
              onClick={() => setShowExportModal(true)}
              style={{
                padding: '10px 22px',
                background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)',
                border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.25)'}`,
                borderRadius: 10,
                color: isDark ? '#c4b5fd' : '#7c3aed',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Academic Record
            </button>
          </div>
        </>
      )}
    </div>
  );
}