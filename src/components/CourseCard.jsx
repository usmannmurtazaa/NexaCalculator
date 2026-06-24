import { useMemo } from "react";
import theme from "../constants/theme";
import { GRADES, SCALES } from "../utils/grades";

export default function CourseCard({
  id,
  index,
  removable,
  onRemove,
  data,
  onChange,
  scale,
}) {
  const gradeOptions = useMemo(() => SCALES[scale] || GRADES, [scale]);

  // ── Dynamic styles (dark mode only) ───────────────────────────────────
  const cardStyle = useMemo(
    () => ({
      background: "rgba(30, 20, 60, 0.5)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: `${theme.spacing.lg}px ${theme.spacing.lg}px ${theme.spacing.md}px`,
      position: "relative",
      transition: "all 0.25s ease",
      marginBottom: theme.spacing.md,
      animation: "slideIn 0.25s ease",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    }),
    [],
  );

  const badgeStyle = useMemo(
    () => ({
      position: "absolute",
      top: -12,
      left: 16,
      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
      color: "#fff",
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 12px",
      borderRadius: 20,
      letterSpacing: 0.5,
      fontFamily: theme.fonts.mono,
      boxShadow: "0 4px 10px rgba(124,58,237,0.3)",
      zIndex: 1,
    }),
    [],
  );

  const removeButtonStyle = useMemo(
    () => ({
      position: "absolute",
      top: 12,
      right: 14,
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#f87171",
      borderRadius: 8,
      width: 28,
      height: 28,
      cursor: "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      backdropFilter: "blur(4px)",
      zIndex: 1,
    }),
    [],
  );

  const inputStyle = useMemo(
    () => ({
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "10px 14px",
      color: "#f1f0ff",
      fontSize: 14,
      fontFamily: theme.fonts.mono,
      fontWeight: 500,
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    }),
    [],
  );

  const selectStyle = useMemo(
    () => ({
      width: "100%",
      background: "rgba(20, 15, 40, 0.8)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "10px 32px 10px 14px",
      color: "#f1f0ff",
      fontSize: 14,
      fontWeight: 500,
      fontFamily: theme.fonts.mono,
      outline: "none",
      cursor: "pointer",
      backdropFilter: "blur(4px)",
      transition: "border-color 0.2s ease",
      appearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
    }),
    [],
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: 11,
      fontWeight: 500,
      color: "rgba(255,255,255,0.5)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      marginBottom: 6,
      display: "block",
    }),
    [],
  );

  // ── Hover / focus handlers (dark only) ───────────────────────────────
  const handleCardMouseEnter = (e) => {
    e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.35)";
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
  };

  const handleRemoveEnter = (e) => {
    e.currentTarget.style.background = "rgba(239,68,68,0.25)";
    e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
  };

  const handleRemoveLeave = (e) => {
    e.currentTarget.style.background = "rgba(239,68,68,0.12)";
    e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#7c3aed";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      role="group"
      aria-label={`Course ${index + 1}${data.code ? ": " + data.code : ""}`}
    >
      {/* Course number badge */}
      <div style={badgeStyle} aria-hidden="true">
        COURSE {index + 1}
      </div>

      {/* Remove button */}
      {removable && (
        <button
          onClick={() => onRemove(id)}
          aria-label={`Remove course ${index + 1}`}
          style={removeButtonStyle}
          onMouseEnter={handleRemoveEnter}
          onMouseLeave={handleRemoveLeave}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
          marginTop: 14,
        }}
        className="course-input-row"
      >
        {/* Course Code */}
        <div style={{ minWidth: 0 }}>
          <label htmlFor={`course-code-${id}`} style={labelStyle}>
            Course Code
          </label>
          <input
            id={`course-code-${id}`}
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. CS-301"
            onChange={(e) => onChange(id, "code", e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={`code-hint-${id}`}
          />
          <span id={`code-hint-${id}`} className="sr-only">
            Enter the course code, like CS-301
          </span>
        </div>

        {/* Credits */}
        <div style={{ width: 100 }}>
          <label htmlFor={`course-credits-${id}`} style={labelStyle}>
            Credits
          </label>
          <select
            id={`course-credits-${id}`}
            value={data.credits}
            onChange={(e) =>
              onChange(id, "credits", parseInt(e.target.value, 10))
            }
            style={selectStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <option key={c} value={c}>
                {c} cr
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Selector */}
      <div style={{ marginTop: 14 }}>
        <label htmlFor={`course-grade-${id}`} style={labelStyle}>
          Grade
        </label>
        <select
          id={`course-grade-${id}`}
          value={data.gradeIdx}
          onChange={(e) =>
            onChange(id, "gradeIdx", parseInt(e.target.value, 10))
          }
          style={selectStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {gradeOptions.map((g, i) => (
            <option key={i} value={i}>
              {g.l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
