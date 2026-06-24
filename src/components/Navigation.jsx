import { useCallback, useRef, useEffect } from "react";
import theme from "../constants/theme";
import { logEvent } from "../firebase/analytics";

// ---------- SVG icons ----------
const GPAIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <line x1="6.5" y1="6.5" x2="6.5" y2="6.5" strokeWidth="1.5" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" strokeWidth="1.5" />
    <line x1="6.5" y1="17.5" x2="6.5" y2="17.5" strokeWidth="1.5" />
    <line x1="17.5" y1="17.5" x2="17.5" y2="17.5" strokeWidth="1.5" />
  </svg>
);

const CGPAIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </svg>
);

const CalculatorIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="12" y2="14" />
    <line x1="12" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
    <line x1="12" y1="18" x2="16" y2="18" />
  </svg>
);

const TABS = [
  { key: "gpa", label: "Semester GPA", Icon: GPAIcon },
  { key: "cgpa", label: "Cumulative CGPA", Icon: CGPAIcon },
  { key: "calculator", label: "Scientific Calculator", Icon: CalculatorIcon },
];

export default function Navigation({ tab, setTab }) {
  const navRef = useRef(null);

  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === tab) return;
      setTab(newTab);
      logEvent("tab_switched", {
        tab: newTab,
        previous_tab: tab,
        timestamp: new Date().toISOString(),
      });
    },
    [setTab, tab],
  );

  const handleKeyDown = useCallback((e) => {
    const buttons = navRef.current?.querySelectorAll('[role="tab"]');
    if (!buttons || buttons.length === 0) return;

    const currentIndex = Array.from(buttons).indexOf(document.activeElement);
    let nextIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }
    buttons[nextIndex]?.focus();
  }, []);

  useEffect(() => {
    const activeButton = navRef.current?.querySelector(
      '[aria-selected="true"]',
    );
    if (activeButton && navRef.current) {
      const container = navRef.current;
      const containerWidth = container.offsetWidth;
      const tabLeft = activeButton.offsetLeft;
      const tabWidth = activeButton.offsetWidth;

      if (
        tabLeft < container.scrollLeft ||
        tabLeft + tabWidth > container.scrollLeft + containerWidth
      ) {
        container.scrollTo({
          left: tabLeft - containerWidth / 2 + tabWidth / 2,
          behavior: "smooth",
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
        display: "flex",
        gap: "clamp(4px, 1vw, 8px)",
        marginTop: "clamp(16px, 4vw, 24px)",
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        padding: "4px clamp(12px, 5vw, 20px)",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content",
        maxWidth: "calc(100% - 32px)",
        position: "sticky",
        top: 8,
        zIndex: 50,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

      {TABS.map(({ key, label, Icon }) => {
        const isActive = tab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleTabChange(key)}
            style={{
              flex: "0 0 auto",
              padding: "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)",
              fontSize: "clamp(13px, 3vw, 15px)",
              fontWeight: 600,
              cursor: "pointer",
              background: isActive
                ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(167,139,250,0.1))"
                : "transparent",
              border: "none",
              borderRadius: 16,
              color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: theme.fonts.body,
              textTransform: "capitalize",
              letterSpacing: "0.01em",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              boxShadow: isActive ? "0 4px 16px rgba(124,58,237,0.3)" : "none",
              backdropFilter: isActive ? "blur(8px)" : "none",
              position: "relative",
              overflow: "hidden",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <span
              aria-hidden="true"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <Icon />
            </span>
            <span>{label}</span>
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "30%",
                  height: 3,
                  background:
                    "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                  borderRadius: "4px 4px 0 0",
                  transition: "width 0.3s ease",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
