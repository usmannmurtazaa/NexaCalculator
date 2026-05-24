import { useState, useEffect, useRef } from 'react';
import theme from '../constants/theme';

export default function ExportModal({ isOpen, onClose, onExport, darkMode }) {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');

  const modalRef = useRef(null);
  const isDark = darkMode;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setStudentName('');
      setStudentId('');
      setUniversity('');
      setSemester('');
      setExportFormat('pdf');
    }
  }, [isOpen]);

  const handleExport = () => {
    if (!studentName.trim()) return;
    onExport({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      university: university.trim(),
      semester: semester.trim(),
      format: exportFormat,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeDown 0.2s ease',
        padding: '16px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(30,20,60,0.95), rgba(15,12,35,0.95))'
            : 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(245,240,255,0.95))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.15)'}`,
          borderRadius: theme.borderRadius.xl,
          padding: 'clamp(20px, 6vw, 32px)',
          maxWidth: 500,
          width: '100%',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 24px 64px rgba(0,0,0,0.15), 0 0 0 1px rgba(124,58,237,0.08)',
          animation: 'scaleIn 0.25s ease',
          position: 'relative',
        }}
      >
        {/* Close button (X) */}
        <button
          onClick={onClose}
          aria-label="Close export modal"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontSize: 18,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)';
          }}
        >
          ✕
        </button>

        <h2
          id="export-modal-title"
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: 700,
            color: isDark ? '#f1f0ff' : '#1a1035',
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}
        >
          Export Academic Record
        </h2>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Student Name (required) */}
          <div>
            <label
              htmlFor="export-student-name"
              style={{
                display: 'block',
                marginBottom: 6,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Student Name *
            </label>
            <input
              id="export-student-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              style={inputStyle(isDark, !studentName)}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) =>
                (e.target.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)')
              }
            />
            {!studentName && (
              <span style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'block' }}>
                Required
              </span>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label
              htmlFor="export-student-id"
              style={{
                display: 'block',
                marginBottom: 6,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Student ID
            </label>
            <input
              id="export-student-id"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 2024CS-045"
              style={inputStyle(isDark)}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) =>
                (e.target.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)')
              }
            />
          </div>

          {/* University */}
          <div>
            <label
              htmlFor="export-university"
              style={{
                display: 'block',
                marginBottom: 6,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              University/College
            </label>
            <input
              id="export-university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. MIT"
              style={inputStyle(isDark)}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) =>
                (e.target.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)')
              }
            />
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="export-semester"
              style={{
                display: 'block',
                marginBottom: 6,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Semester
            </label>
            <input
              id="export-semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Fall 2024"
              style={inputStyle(isDark)}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) =>
                (e.target.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)')
              }
            />
          </div>

          {/* Export Format Toggle */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Format
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['pdf', 'csv'].map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  aria-pressed={exportFormat === format}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 12,
                    border: `1px solid ${
                      exportFormat === format
                        ? 'rgba(124,58,237,0.5)'
                        : isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)'
                    }`,
                    background:
                      exportFormat === format
                        ? isDark
                          ? 'rgba(124,58,237,0.15)'
                          : 'rgba(124,58,237,0.08)'
                        : 'transparent',
                    color: exportFormat === format ? '#a78bfa' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {format === 'pdf' ? '📄 PDF' : '📊 CSV'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={handleExport}
            disabled={!studentName.trim()}
            style={{
              flex: 2,
              padding: '14px',
              background: studentName.trim()
                ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                : 'rgba(124,58,237,0.25)',
              border: 'none',
              borderRadius: 14,
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: studentName.trim() ? 'pointer' : 'not-allowed',
              boxShadow: studentName.trim()
                ? '0 8px 20px rgba(124,58,237,0.3)'
                : 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              if (studentName.trim())
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(124,58,237,0.45)';
            }}
            onMouseLeave={(e) => {
              if (studentName.trim())
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.3)';
            }}
          >
            Export {exportFormat.toUpperCase()}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: 14,
              color: isDark ? '#f1f0ff' : '#1a1035',
              fontWeight: 500,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper for consistent input styling
function inputStyle(isDark, isError = false) {
  return {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1px solid ${
      isError
        ? 'rgba(239,68,68,0.5)'
        : isDark
        ? 'rgba(255,255,255,0.12)'
        : 'rgba(0,0,0,0.12)'
    }`,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    color: isDark ? '#f1f0ff' : '#1a1035',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxShadow: isDark
      ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
      : 'inset 0 2px 4px rgba(0,0,0,0.02)',
  };
}