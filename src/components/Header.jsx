import { useTheme } from "../contexts/ThemeContext";
import theme from "../constants/theme";

export default function Header({}) {
  const { darkMode } = useTheme();

  return (
    <header
      style={{
        position: "relative",
        background: darkMode
          ? "linear-gradient(180deg, rgba(15,8,41,0.95) 0%, rgba(8,6,23,0.98) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
        padding: `clamp(16px, 4vw, 24px) clamp(16px, 5vw, 32px) clamp(12px, 3vw, 16px)`,
        zIndex: 10,
      }}
    >
      {/* Inject the color-shifting animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className="header-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "clamp(12px, 3vw, 24px)",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Brand Section */}
        <div style={{ flex: "1 1 auto", minWidth: 200 }}>
          <h1
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: "clamp(24px, 6vw, 32px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              background: darkMode
                ? "linear-gradient(135deg, #a78bfa, #60a5fa, #a89bfa, #a78bfa)"
                : "linear-gradient(135deg, #3c00ff, #3b82f6, #0076ba, #7c3aed)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 4s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 4px 0",
            }}
          >
            Nexa Calculator
          </h1>
          <p
            style={{
              fontFamily: theme.fonts.body,
              fontSize: "clamp(11px, 2.5vw, 13px)",
              color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Academic Excellence Suite • GPA • CGPA • Scientific
          </p>
        </div>
      </div>
    </header>
  );
}
