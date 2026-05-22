import theme from '../constants/theme';
import { GRADES, SCALES } from '../utils/grades';

export default function CourseCard({ id, index, removable, onRemove, data, onChange, scale, darkMode }) {
  const gradeOptions = SCALES[scale] || GRADES;
  const isDark = darkMode;

  return (
    <div
      style={{
        background: isDark ? theme.colors.cardDark : theme.colors.cardLight,
        border: `1px solid ${isDark ? theme.colors.borderDark : theme.colors.borderLight}`,
        borderRadius: theme.borderRadius.lg,
        padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.lg}px`,
        position: 'relative',
        transition: `all ${theme.animation}`,
        marginBottom: theme.spacing.md,
        animation: 'slideIn 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.35)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? theme.colors.borderDark : theme.colors.borderLight;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: 16,
          background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: 20,
          letterSpacing: 1,
          fontFamily: theme.fonts.mono,
        }}
      >
        COURSE {index + 1}
      </div>

      {removable && (
        <button
          onClick={() => onRemove(id)}
          aria-label="Remove course"
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
            borderRadius: 8,
            width: 26,
            height: 26,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        >
          ×
        </button>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 10, marginTop: 8 }}>
        <div>
          <label
            htmlFor={`course-code-${id}`}
            style={{
              fontSize: 10,
              color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6,
              display: 'block',
            }}
          >
            Course Code
          </label>
          <input
            id={`course-code-${id}`}
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. CS-301"
            onChange={e => onChange(id, "code", e.target.value)}
            style={{
              width: '100%',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 10,
              padding: '9px 12px',
              color: isDark ? '#fff' : '#333',
              fontSize: 14,
              fontFamily: theme.fonts.mono,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          />
        </div>
        <div>
          <label
            htmlFor={`course-credits-${id}`}
            style={{
              fontSize: 10,
              color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6,
              display: 'block',
            }}
          >
            Credits
          </label>
          <select
            id={`course-credits-${id}`}
            value={data.credits}
            onChange={e => onChange(id, "credits", parseInt(e.target.value))}
            style={{
              width: '100%',
              background: isDark ? '#1a1035' : '#fff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 10,
              padding: '9px 8px',
              color: isDark ? '#fff' : '#333',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c} cr</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label
          htmlFor={`course-grade-${id}`}
          style={{
            fontSize: 10,
            color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 6,
            display: 'block',
          }}
        >
          Grade
        </label>
        <select
          id={`course-grade-${id}`}
          value={data.gradeIdx}
          onChange={e => onChange(id, "gradeIdx", parseInt(e.target.value))}
          style={{
            width: '100%',
            background: isDark ? '#1a1035' : '#fff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 10,
            padding: '9px 12px',
            color: isDark ? '#fff' : '#333',
            fontSize: 13,
            fontFamily: theme.fonts.mono,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {gradeOptions.map((g, i) => <option key={i} value={i}>{g.l}</option>)}
        </select>
      </div>
    </div>
  );
}