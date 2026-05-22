import AnimatedNumber from './AnimatedNumber';
import { getStanding } from '../utils/grades';
import theme from '../constants/theme';

export default function CGPAResultCard({ cgpa, sems, total, best, scale, darkMode }) {
  const s = getStanding(parseFloat(cgpa), scale);
  const maxGPA = parseFloat(scale);
  const isDark = darkMode;

  return (
    <div
      style={{
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        border: '1px solid rgba(167,139,250,0.25)',
        marginTop: theme.spacing.xl,
        animation: 'fadeUp 0.4s ease',
      }}
    >
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg,#0f0829,#1a0f3a)'
            : 'linear-gradient(135deg,#f5f5f5,#e0e0e0)',
          padding: `${theme.spacing.xxxl}px ${theme.spacing.xxl}px`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)',
          }}
        />
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
            marginBottom: 12,
          }}
        >
          Cumulative CGPA
        </div>
        <div
          style={{
            fontSize: 'clamp(48px, 15vw, 68px)',
            fontWeight: 700,
            color: '#a78bfa',
            fontFamily: theme.fonts.mono,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          <AnimatedNumber value={cgpa} />
        </div>
        <div style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', marginTop: 4 }}>
          out of {maxGPA}.00
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: 20,
            background: 'rgba(167,139,250,0.1)',
            border: `1px solid ${s.color}33`,
            color: s.color,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {s.t}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {[
          ['Semesters', sems, false],
          ['GPA sum', total, true],
          ['Best sem', best, true],
        ].map(([label, value, fmt], i) => (
          <div
            key={i}
            style={{
              padding: '14px 8px',
              textAlign: 'center',
              borderRight:
                i < 2
                  ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
                  : 'none',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: 700,
                color: isDark ? '#e2d9f3' : '#333',
                fontFamily: theme.fonts.mono,
              }}
            >
              {fmt ? parseFloat(value).toFixed(2) : value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginTop: 3,
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