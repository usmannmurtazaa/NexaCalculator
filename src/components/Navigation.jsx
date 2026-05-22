import theme from '../constants/theme';

export default function Navigation({ tab, setTab, darkMode }) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 'clamp(8px, 2vw, 16px)',
        marginTop: 'clamp(16px, 4vw, 24px)',
        flexWrap: 'wrap',
        padding: '0 clamp(16px, 4vw, 24px)',
      }}
    >
      {["gpa", "cgpa", "calculator"].map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          style={{
            padding: 'clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: 600,
            cursor: 'pointer',
            background:
              tab === t
                ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))'
                : 'transparent',
            border: 'none',
            borderBottom: tab === t ? '3px solid #7c3aed' : '3px solid transparent',
            color:
              tab === t
                ? darkMode
                  ? '#fff'
                  : '#333'
                : darkMode
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(0,0,0,0.4)',
            transition: 'all 0.3s',
            fontFamily: theme.fonts.body,
            textTransform: 'capitalize',
            borderRadius: '8px 8px 0 0',
          }}
        >
          {t === "gpa" ? "📊 Semester GPA" : t === "cgpa" ? "📈 Cumulative CGPA" : "🔢 Scientific Calculator"}
        </button>
      ))}
    </nav>
  );
}