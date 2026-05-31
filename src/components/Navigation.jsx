import { useCallback, useRef, useEffect } from 'react';
import theme from '../constants/theme';
import { logEvent } from '../firebase/analytics';

const TABS = [
  { key: 'gpa', label: 'Semester GPA', icon: '📊' },
  { key: 'cgpa', label: 'Cumulative CGPA', icon: '📈' },
  { key: 'calculator', label: 'Scientific Calculator', icon: '🔢' },
];

export default function Navigation({ tab, setTab, darkMode }) {
  const navRef = useRef(null);

  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === tab) return;
      setTab(newTab);
      logEvent('tab_switched', {
        tab: newTab,
        previous_tab: tab,
        timestamp: new Date().toISOString(),
      });
    },
    [setTab, tab]
  );

  // Keyboard navigation support (arrow keys move focus between tabs)
  const handleKeyDown = useCallback(
    (e) => {
      const buttons = navRef.current?.querySelectorAll('[role="tab"]');
      if (!buttons || buttons.length === 0) return;

      const currentIndex = Array.from(buttons).indexOf(document.activeElement);
      let nextIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % buttons.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = buttons.length - 1;
          break;
        default:
          return;
      }
      buttons[nextIndex]?.focus();
      // Optionally activate the tab on focus? Usually better to not auto-activate, just move focus.
    },
    []
  );

  // Ensure the active tab is visible within horizontal scroll (mobile)
  useEffect(() => {
    const activeButton = navRef.current?.querySelector('[aria-selected="true"]');
    if (activeButton && navRef.current) {
      const container = navRef.current;
      // Check if element is out of view and scroll it into center
      const containerWidth = container.offsetWidth;
      const tabLeft = activeButton.offsetLeft;
      const tabWidth = activeButton.offsetWidth;

      if (tabLeft < container.scrollLeft || tabLeft + tabWidth > container.scrollLeft + containerWidth) {
        container.scrollTo({
          left: tabLeft - containerWidth / 2 + tabWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [tab]);

  return (
    <nav
      ref={navRef}
      role="tablist"
      aria-label="Calculator mode selector"
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        gap: 'clamp(4px, 1vw, 8px)',
        marginTop: 'clamp(16px, 4vw, 24px)',
        flexWrap: 'nowrap',           // prevents wrapping on mobile; scroll instead
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',       // Firefox
        msOverflowStyle: 'none',      // IE/Edge
        WebkitOverflowScrolling: 'touch',
        padding: '4px clamp(12px, 5vw, 20px)',
        background: darkMode
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 20,
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.25)'
          : '0 8px 32px rgba(0,0,0,0.06)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
        maxWidth: 'calc(100% - 32px)',
        position: 'sticky',
        top: 8,
        zIndex: 50,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        // Hide scrollbar for Chrome/Safari
        '::WebkitScrollbar': {
          display: 'none',
        },
      }}
    >
      {/* Inline style for hiding WebKit scrollbar */}
      <style>{`
        nav::-webkit-scrollbar { display: none; }
      `}</style>

      {TABS.map(({ key, label, icon }) => {
        const isActive = tab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            tabIndex={isActive ? 0 : -1}   // only active tab is in tab order
            onClick={() => handleTabChange(key)}
            style={{
              flex: '0 0 auto',
              padding: 'clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)',
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
                ? (darkMode ? '#ffffff' : '#1a1035')
                : (darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'),
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: theme.fonts.body,
              textTransform: 'capitalize',
              letterSpacing: '0.01em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              boxShadow: isActive
                ? (darkMode
                    ? '0 4px 16px rgba(124,58,237,0.3)'
                    : '0 4px 16px rgba(124,58,237,0.15)')
                : 'none',
              backdropFilter: isActive ? 'blur(8px)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              outline: 'none',
              // focus-visible style handled globally, but ensure custom focus ring
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
            <span>{label}</span>
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
                  transition: 'width 0.3s ease',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}