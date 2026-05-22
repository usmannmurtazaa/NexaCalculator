import theme from '../constants/theme';

export default function GradeProgressBar({ gpa, scale, darkMode }) {
  const maxGPA = parseFloat(scale);
  const pct = Math.min((parseFloat(gpa) / maxGPA) * 100, 100);
  const markers = [0, maxGPA * 0.5, maxGPA * 0.75, maxGPA];

  return (
    <div style={{ marginTop: 16, padding: `0 2px` }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: darkMode ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight,
          marginBottom: 6,
          letterSpacing: 0.5,
        }}
      >
        {markers.map((m, i) => (
          <span key={i}>{m.toFixed(2)}</span>
        ))}
      </div>
      <div
        style={{
          height: 6,
          background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
            borderRadius: 8,
            transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </div>
    </div>
  );
}