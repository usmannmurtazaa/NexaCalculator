import { useCGPA } from '../hooks/useCGPA';
import CGPAResultCard from './CGPAResultCard';
import theme from '../constants/theme';

export default function CGPACalculator({ scale, darkMode }) {
  const { sems, addSem, removeSem, updateSem, calculate, result, error } = useCGPA(scale);
  const isDark = darkMode;

  return (
    <div>
      <h2
        style={{
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
          margin: '0 0 16px 0',
        }}
      >
        Semester GPAs
      </h2>
      <div
        className="semester-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(10px, 2vw, 14px)',
          marginBottom: 16,
        }}
      >
        {sems.map((s, i) => (
          <div
            key={s.id}
            style={{
              background: isDark ? theme.colors.cardDark : theme.colors.cardLight,
              border: `1px solid ${isDark ? theme.colors.borderDark : theme.colors.borderLight}`,
              borderRadius: theme.borderRadius.lg,
              padding: 'clamp(16px, 3vw, 20px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 'clamp(11px, 2.5vw, 13px)',
                  fontWeight: 600,
                  color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)',
                }}
              >
                Semester {i + 1}
              </span>
              {i >= 2 && (
                <button
                  onClick={() => removeSem(s.id)}
                  aria-label="Remove semester"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    borderRadius: 8,
                    width: 26,
                    height: 26,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <input
              type="number"
              min="0"
              max={scale}
              step="0.01"
              placeholder="0.00"
              value={s.val}
              onChange={e => updateSem(s.id, e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                color: isDark ? '#fff' : '#333',
                fontSize: 'clamp(22px, 5vw, 26px)',
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
                padding: '6px 0',
                outline: 'none',
              }}
            />
          </div>
        ))}
      </div>
      {sems.length < 8 && (
        <button
          onClick={addSem}
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
          <span style={{ fontSize: 22 }}>+</span> Add Semester
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
        Calculate Cumulative CGPA
      </button>
      {error && (
        <div style={{ color: '#fca5a5', marginTop: 12 }}>
          ⚠️ {error}
        </div>
      )}
      {result && (
        <CGPAResultCard
          cgpa={result.cgpa}
          sems={result.sems}
          total={result.total}
          best={result.best}
          scale={scale}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}