import { useMemo } from "react";
import AnimatedNumber from "./AnimatedNumber";
import { getStanding } from "../utils/grades";
import theme from "../constants/theme";

export default function CGPAResultCard({ cgpa, sems, total, best, scale }) {
  const numericCgpa = parseFloat(cgpa);
  const standing = getStanding(numericCgpa, scale);
  const maxGPA = parseFloat(scale);

  // ── Memoized styles (dark mode only) ─────────────────────────────────
  const cardStyle = useMemo(
    () => ({
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      border: "1px solid rgba(167,139,250,0.25)",
      marginTop: theme.spacing.xl,
      animation: "fadeUp 0.4s ease",
      boxShadow:
        "0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(167,139,250,0.1)",
      background:
        "linear-gradient(180deg, rgba(20,15,40,0.6) 0%, rgba(15,12,35,0.8) 100%)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }),
    [],
  );

  const mainSectionStyle = useMemo(
    () => ({
      padding: `clamp(20px, 5vw, ${theme.spacing.xxxl}px) clamp(16px, 4vw, ${theme.spacing.xxl}px)`,
      textAlign: "center",
      position: "relative",
    }),
    [],
  );

  const topGradientStyle = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background:
        "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, transparent)",
    }),
    [],
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.4)",
      marginBottom: 12,
      fontWeight: 500,
    }),
    [],
  );

  const gpaNumberStyle = useMemo(
    () => ({
      fontSize: "clamp(48px, 15vw, 72px)",
      fontWeight: 700,
      color: "#a78bfa",
      fontFamily: theme.fonts.mono,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      textShadow: "0 0 30px rgba(167,139,250,0.3)",
    }),
    [],
  );

  const outOfStyle = useMemo(
    () => ({
      fontSize: 13,
      color: "rgba(255,255,255,0.3)",
      marginTop: 6,
      fontWeight: 500,
    }),
    [],
  );

  const standingBadgeStyle = useMemo(
    () => ({
      marginTop: 16,
      display: "inline-block",
      padding: "6px 18px",
      borderRadius: 30,
      background: standing.color
        ? `${standing.color}20`
        : "rgba(167,139,250,0.12)",
      border: `1px solid ${standing.color || "#a78bfa"}50`,
      color: standing.color || "#a78bfa",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.02em",
      backdropFilter: "blur(4px)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "default",
    }),
    [standing],
  );

  const statsGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      background: "rgba(255,255,255,0.02)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }),
    [],
  );

  const statItemStyle = useMemo(
    () => ({
      padding: "clamp(12px, 3vw, 16px) 8px",
      textAlign: "center",
      transition: "background-color 0.2s ease",
    }),
    [],
  );

  const statValueStyle = useMemo(
    () => ({
      fontSize: "clamp(16px, 4vw, 18px)",
      fontWeight: 700,
      color: "#e2d9f3",
      fontFamily: theme.fonts.mono,
      lineHeight: 1.3,
    }),
    [],
  );

  const statLabelStyle = useMemo(
    () => ({
      fontSize: 11,
      color: "rgba(255,255,255,0.35)",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginTop: 4,
      fontWeight: 500,
    }),
    [],
  );

  const stats = useMemo(
    () => [
      { label: "Semesters", value: sems },
      { label: "GPA Sum", value: total },
      { label: "Best Sem", value: best },
    ],
    [sems, total, best],
  );

  // ── Hover handler for standing badge ─────────────────────────────────
  const handleBadgeMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = `0 0 12px ${standing.color || "#a78bfa"}40`;
  };
  const handleBadgeMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div
      role="region"
      aria-label={`CGPA result: ${numericCgpa.toFixed(2)} out of ${maxGPA}, standing: ${standing.t}`}
      style={cardStyle}
    >
      {/* Main CGPA display */}
      <div style={mainSectionStyle}>
        <div aria-hidden="true" style={topGradientStyle} />
        <div style={labelStyle}>Cumulative CGPA</div>
        <div style={gpaNumberStyle}>
          <AnimatedNumber value={cgpa} />
        </div>
        <div style={outOfStyle}>out of {maxGPA}.00</div>
        <div
          style={standingBadgeStyle}
          onMouseEnter={handleBadgeMouseEnter}
          onMouseLeave={handleBadgeMouseLeave}
          aria-label={`Academic standing: ${standing.t}`}
        >
          {standing.t}
        </div>
      </div>

      {/* Statistics row */}
      <div style={statsGridStyle}>
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              ...statItemStyle,
              borderRight:
                i < stats.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={statValueStyle}>
              {typeof stat.value === "number" && stat.value % 1 !== 0
                ? parseFloat(stat.value).toFixed(2)
                : stat.value}
            </div>
            <div style={statLabelStyle}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
