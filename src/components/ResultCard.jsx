import AnimatedNumber from './AnimatedNumber';
import { getStanding } from '../utils/grades';
import theme from '../constants/theme';

export default function ResultCard({ gpa, courses, credits, points, scale, darkMode }) {
  const numericGpa = parseFloat(gpa);
  const s = getStanding(numericGpa, scale);
  const maxGPA = parseFloat(scale);
  const isDark = darkMode;

  return (
    <div
      role="region"
      aria-label={`GPA result: ${numericGpa.toFixed(2)} out of ${maxGPA}, standing: ${s.t}`}
      style={{
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.2)'}`,
        marginTop: theme.spacing.xl,
        animation: 'fadeUp 0.4s ease',
        boxShadow: isDark
          ? '0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(167,139,250,0.1)'
          : '0 12px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(124,58,237,0.08)',
        background: isDark
          ? 'linear-gradient(180deg, rgba(20,15,40,0.6) 0%, rgba(15,12,35,0.8) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(250,250,255,0.9) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Main GPA display */}
      <div
        style={{
          background: 'transparent',
          padding: `clamp(20px, 5vw, ${theme.spacing.xxxl}px) clamp(16px, 4vw, ${theme.spacing.xxl}px)`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #7c3aed, #a78bfa, transparent)',
          }}
        />
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          Semester GPA
        </div>
        <div
          style={{
            fontSize: 'clamp(48px, 15vw, 72px)',
            fontWeight: 700,
            color: '#a78bfa',
            fontFamily: theme.fonts.mono,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: isDark
              ? '0 0 30px rgba(167,139,250,0.3)'
              : '0 0 20px rgba(124,58,237,0.1)',
          }}
        >
          <AnimatedNumber value={gpa} />
        </div>
        <div
          style={{
            fontSize: 13,
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          out of {maxGPA}.00
        </div>
        <div
          style={{
            marginTop: 16,
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 30,
            background: s.color
              ? `${s.color}15` // hex with alpha
              : 'rgba(167,139,250,0.12)',
            border: `1px solid ${s.color || '#a78bfa'}50`,
            color: s.color || '#a78bfa',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.02em',
            backdropFilter: 'blur(4px)',
          }}
        >
          {s.t}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          background: isDark
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.02)',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {[
          ['Courses', courses, ''],
          ['Credit hrs', credits, '.2f'],
          ['Quality pts', points, '.2f'],
        ].map(([label, value, fmt], i) => (
          <div
            key={i}
            style={{
              padding: 'clamp(12px, 3vw, 16px) 8px',
              textAlign: 'center',
              borderRight:
                i < 2
                  ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
                  : 'none',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: 700,
                color: isDark ? '#e2d9f3' : '#1a1035',
                fontFamily: theme.fonts.mono,
                lineHeight: 1.3,
              }}
            >
              {fmt ? parseFloat(value).toFixed(2) : value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}