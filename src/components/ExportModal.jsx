import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import theme from '../constants/theme';

export default function ExportModal({ isOpen, onClose, onExport, isExporting, darkMode }) {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [touched, setTouched] = useState(false);

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  const isDark = darkMode;

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the name input after modal animation
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isExporting) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isExporting]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setStudentName('');
      setStudentId('');
      setUniversity('');
      setSemester('');
      setExportFormat('pdf');
      setTouched(false);
    }
  }, [isOpen]);

  const handleExport = useCallback(() => {
    setTouched(true);
    if (!studentName.trim() || isExporting) return;
    onExport({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      university: university.trim(),
      semester: semester.trim(),
      format: exportFormat,
    });
  }, [studentName, studentId, university, semester, exportFormat, isExporting, onExport]);

  const showNameError = touched && !studentName.trim();

  // ── Memoized Styles ──────────────────────────────────────────────────
  const overlayStyle = useMemo(() => ({
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  }), []);

  const modalStyle = useMemo(() => ({
    background: isDark
      ? 'linear-gradient(160deg, rgba(30,20,60,0.95), rgba(15,12,35,0.95))'
      : 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(245,240,255,0.95))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.15)'}`,
    borderRadius: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isDark
      ? '0 24px 64px rgba(0,0,0,0.5)'
      : '0 24px 64px rgba(0,0,0,0.15)',
    animation: 'scaleIn 0.25s ease',
    overflow: 'hidden',
  }), [isDark]);

  const headerStyle = useMemo(() => ({
    padding: '20px 24px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
    background: isDark ? 'rgba(30,20,60,0.8)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  }), [isDark]);

  const bodyStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  }), []);

  const footerStyle = useMemo(() => ({
    padding: '16px 24px 20px',
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
    display: 'flex',
    gap: 12,
    background: isDark ? 'rgba(30,20,60,0.8)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  }), [isDark]);

  const inputStyle = useCallback((isError = false) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1px solid ${
      isError ? 'rgba(239,68,68,0.5)' : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    }`,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    color: isDark ? '#f1f0ff' : '#1a1035',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: isDark
      ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
      : 'inset 0 2px 4px rgba(0,0,0,0.02)',
  }), [isDark]);

  const formatButtonStyle = useCallback((format) => {
    const active = exportFormat === format;
    return {
      flex: 1,
      padding: '12px 16px',
      borderRadius: 12,
      border: `1px solid ${
        active ? 'rgba(124,58,237,0.5)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
      }`,
      background: active
        ? (isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)')
        : 'transparent',
      color: active ? '#a78bfa' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
      fontWeight: 600,
      fontSize: 14,
      cursor: isExporting ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      opacity: isExporting ? 0.6 : 1,
    };
  }, [exportFormat, isExporting, isDark]);

  const exportButtonStyle = useMemo(() => {
    const disabled = !studentName.trim() || isExporting;
    return {
      flex: 2,
      padding: '14px',
      background: disabled
        ? 'rgba(124,58,237,0.25)'
        : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      border: 'none',
      borderRadius: 14,
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 8px 20px rgba(124,58,237,0.3)',
      transition: 'all 0.25s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    };
  }, [studentName, isExporting]);

  const cancelButtonStyle = useMemo(() => ({
    flex: 1,
    padding: '14px',
    background: 'transparent',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
    borderRadius: 14,
    color: isDark ? '#f1f0ff' : '#1a1035',
    fontWeight: 500,
    fontSize: 15,
    cursor: isExporting ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s ease',
    opacity: isExporting ? 0.6 : 1,
  }), [isExporting, isDark]);

  if (!isOpen) return null;

  return (
    <div
      style={overlayStyle}
      onClick={isExporting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        ref={modalRef}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2
            id="export-modal-title"
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(18px, 4vw, 22px)',
              fontWeight: 700,
              color: isDark ? '#f1f0ff' : '#1a1035',
              margin: 0,
            }}
          >
            Export Academic Record
          </h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close export modal"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              padding: 4,
              lineHeight: 1,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!isExporting) e.target.style.color = '#a78bfa'; }}
            onMouseLeave={(e) => { if (!isExporting) e.target.style.color = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'; }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={bodyStyle}>
          {/* Student Name */}
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
              Student Name <span aria-hidden="true">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="export-student-name"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (!touched) setTouched(true);
              }}
              placeholder="e.g. John Doe"
              required
              aria-required="true"
              aria-invalid={showNameError}
              style={inputStyle(showNameError)}
              disabled={isExporting}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = showNameError ? 'rgba(239,68,68,0.5)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')}
            />
            {showNameError && (
              <span role="alert" style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'block' }}>
                Please enter your name
              </span>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label
              htmlFor="export-student-id"
              style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}
            >
              Student ID
            </label>
            <input
              id="export-student-id"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 2024CS-045"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
            />
          </div>

          {/* University */}
          <div>
            <label
              htmlFor="export-university"
              style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}
            >
              University / College
            </label>
            <input
              id="export-university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. MIT"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
            />
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="export-semester"
              style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}
            >
              Semester
            </label>
            <input
              id="export-semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2024"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
            />
          </div>

          {/* Export Format Toggle */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>
              Format
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['pdf', 'csv'].map((format) => (
                <button
                  key={format}
                  onClick={() => { if (!isExporting) setExportFormat(format); }}
                  aria-pressed={exportFormat === format}
                  disabled={isExporting}
                  style={formatButtonStyle(format)}
                  onMouseEnter={(e) => {
                    if (!isExporting && exportFormat !== format) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExporting && exportFormat !== format) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {format === 'pdf' ? '📄 PDF' : '📊 CSV'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button
            onClick={handleExport}
            disabled={!studentName.trim() || isExporting}
            style={exportButtonStyle}
            onMouseEnter={(e) => {
              if (!(!studentName.trim() || isExporting))
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(124,58,237,0.5)';
            }}
            onMouseLeave={(e) => {
              if (!(!studentName.trim() || isExporting))
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.3)';
            }}
          >
            {isExporting ? (
              <>
                <div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Exporting...
              </>
            ) : (
              `Export ${exportFormat.toUpperCase()}`
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={cancelButtonStyle}
            onMouseEnter={(e) => {
              if (!isExporting) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
            }}
            onMouseLeave={(e) => {
              if (!isExporting) e.currentTarget.style.background = 'transparent';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}