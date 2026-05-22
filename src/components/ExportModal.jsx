import { useState } from 'react';
import theme from '../constants/theme';

export default function ExportModal({ isOpen, onClose, onExport, darkMode }) {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleExport = () => {
    onExport({ studentName, studentId, university, semester, format: exportFormat });
    onClose();
  };

  if (!isOpen) return null;

  const isDark = darkMode;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: isDark ? '#1a1035' : '#fff',
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.xxxl,
          maxWidth: 500,
          width: '90%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: 20, color: isDark ? '#fff' : '#333' }}>
          Export Academic Record
        </h2>

        {[
          { label: 'Student Name *', value: studentName, setter: setStudentName },
          { label: 'Student ID', value: studentId, setter: setStudentId },
          { label: 'University/College', value: university, setter: setUniversity },
          { label: 'Semester', value: semester, setter: setSemester, placeholder: 'e.g., Fall 2024' },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 6,
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: 13,
              }}
            >
              {label}
            </label>
            <input
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                color: isDark ? '#fff' : '#333',
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              fontSize: 13,
            }}
          >
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={e => setExportFormat(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
              color: isDark ? '#fff' : '#333',
            }}
          >
            <option value="pdf">PDF Document</option>
            <option value="csv">CSV Spreadsheet</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleExport}
            disabled={!studentName}
            style={{
              flex: 1,
              padding: 12,
              background: studentName
                ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                : 'rgba(124,58,237,0.3)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              cursor: studentName ? 'pointer' : 'not-allowed',
              fontWeight: 600,
            }}
          >
            Export
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              borderRadius: 10,
              color: isDark ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}