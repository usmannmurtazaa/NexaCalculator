import { useState, useEffect, useRef } from 'react';
import theme from '../constants/theme';

export default function ExportModal({ isOpen, onClose, onExport, isExporting, darkMode }) {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');

  const modalRef = useRef(null);
  const isDark = darkMode;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isExporting) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isExporting]);

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
    if (!studentName.trim() || isExporting) return;
    onExport({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      university: university.trim(),
      semester: semester.trim(),
      format: exportFormat,
    });
    // Do NOT close modal here; parent will close on success/failure
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
      onClick={isExporting ? undefined : onClose}
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
        <button
          onClick={onClose}
          disabled={isExporting}
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
            cursor: isExporting ? 'not-allowed' : 'pointer',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontSize: 18,
            transition: 'all 0.2s ease',
          }}
        >
          ✕
        </button>

        <h2 id="export-modal-title" style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: isDark ? '#f1f0ff' : '#1a1035', marginBottom: 24, letterSpacing: '-0.02em' }}>
          Export Academic Record
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="export-student-name" style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>Student Name *</label>
            <input
              id="export-student-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              style={inputStyle(isDark, !studentName)}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')}
              disabled={isExporting}
            />
            {!studentName && <span style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'block' }}>Required</span>}
          </div>
          <div>
            <label htmlFor="export-student-id" style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>Student ID</label>
            <input id="export-student-id" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 2024CS-045" style={inputStyle(isDark)} onFocus={(e) => (e.target.style.borderColor = '#7c3aed')} onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')} disabled={isExporting} />
          </div>
          <div>
            <label htmlFor="export-university" style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>University/College</label>
            <input id="export-university" type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. MIT" style={inputStyle(isDark)} onFocus={(e) => (e.target.style.borderColor = '#7c3aed')} onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')} disabled={isExporting} />
          </div>
          <div>
            <label htmlFor="export-semester" style={{ display: 'block', marginBottom: 6, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>Semester</label>
            <input id="export-semester" type="text" value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="e.g., Fall 2024" style={inputStyle(isDark)} onFocus={(e) => (e.target.style.borderColor = '#7c3aed')} onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')} disabled={isExporting} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>Format</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['pdf', 'csv'].map((format) => (
                <button
                  key={format}
                  onClick={() => !isExporting && setExportFormat(format)}
                  aria-pressed={exportFormat === format}
                  disabled={isExporting}
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
                    background: exportFormat === format
                      ? isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)'
                      : 'transparent',
                    color: exportFormat === format ? '#a78bfa' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
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
                  }}
                >
                  {format === 'pdf' ? '📄 PDF' : '📊 CSV'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={handleExport}
            disabled={!studentName.trim() || isExporting}
            style={{
              flex: 2,
              padding: '14px',
              background: studentName.trim() && !isExporting
                ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                : 'rgba(124,58,237,0.25)',
              border: 'none',
              borderRadius: 14,
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: (studentName.trim() && !isExporting) ? 'pointer' : 'not-allowed',
              boxShadow: (studentName.trim() && !isExporting) ? '0 8px 20px rgba(124,58,237,0.3)' : 'none',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
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
            style={{
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
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function inputStyle(isDark, isError = false) {
  return {
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
    transition: 'border-color 0.2s ease',
    boxShadow: isDark ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.02)',
    opacity: isError ? 0.8 : 1,
  };
}