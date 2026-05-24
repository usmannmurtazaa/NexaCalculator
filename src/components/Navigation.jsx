import { useCallback } from 'react';
import theme from '../constants/theme';
import { logEvent } from '../firebase/analytics';

export default function Navigation({ tab, setTab, darkMode }) {
  const handleTabChange = useCallback(
    (newTab) => {
      setTab(newTab);
      logEvent('tab_switched', {
        tab: newTab,
        previous_tab: tab,
        timestamp: new Date().toISOString(),
      });
    },
    [setTab, tab]
  );

  const tabs = [
    { key: 'gpa', label: 'Semester GPA', icon: '📊' },
    { key: 'cgpa', label: 'Cumulative CGPA', icon: '📈' },
    { key: 'calculator', label: 'Scientific Calculator', icon: '🔢' },
  ];

  return (
    <nav
      role="tablist"
      aria-label="Calculator mode selector"
      style={{
        display: 'flex',
        gap: 'clamp(4px, 1vw, 8px)',
        marginTop: 'clamp(16px, 4vw, 24px)',
        flexWrap: 'wrap',
        padding: '0 clamp(16px, 5vw, 32px)',
        background: darkMode
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 20,
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.06)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
        maxWidth: '100%',
        position: 'sticky',
        top: 8,
        zIndex: 50,
        transition: 'all 0.3s ease',
      }}
    >
      {tabs.map(({ key, label, icon }) => {
        const isActive = tab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            onClick={() => handleTabChange(key)}
            style={{
              padding: 'clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 32px)',
              fontSize: 'clamp(13px, 3vw, 15px)',
              fontWeight: 600,
              cursor: 'pointer',
              background: isActive
                ? darkMode
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(167,139,250,0.1))'
                  : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.05))'
                : 'transparent',
              border: 'none',
              borderRadius: 16,
              color: isActive
                ? darkMode ? '#ffffff' : '#1a1035'
                : darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: theme.fonts.body,
              textTransform: 'capitalize',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: isActive
                ? darkMode
                  ? '0 4px 16px rgba(124,58,237,0.3)'
                  : '0 4px 16px rgba(124,58,237,0.15)'
                : 'none',
              backdropFilter: isActive ? 'blur(8px)' : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = darkMode
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.1em' }}>
              {icon}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30%',
                  height: 3,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                  borderRadius: '4px 4px 0 0',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}