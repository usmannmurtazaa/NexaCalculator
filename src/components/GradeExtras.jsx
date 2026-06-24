import { useState, useCallback, useMemo } from "react";

// ── GradeProgressBar ──────────────────────────────────────────────────
export function GradeProgressBar({ gpa, scale }) {
  const max = parseFloat(scale);
  const numericGpa = parseFloat(gpa) || 0;
  const pct = useMemo(
    () => Math.min((numericGpa / max) * 100, 100),
    [numericGpa, max],
  );

  const markers = useMemo(() => [0, max * 0.5, max * 0.75, max], [max]);

  const barGradient = useMemo(() => {
    if (pct >= 70) return "linear-gradient(90deg, #7c3aed, #a78bfa)";
    if (pct >= 40) return "linear-gradient(90deg, #f59e0b, #fbbf24)";
    return "linear-gradient(90deg, #ef4444, #f87171)";
  }, [pct]);

  const barShadow = useMemo(() => {
    if (pct >= 70) return "0 0 12px rgba(124,58,237,0.5)";
    if (pct >= 40) return "0 0 12px rgba(245,158,11,0.5)";
    return "0 0 12px rgba(239,68,68,0.5)";
  }, [pct]);

  const isHigh = pct >= 70;
  const isMedium = pct >= 40;

  const containerStyle = useMemo(
    () => ({
      marginTop: 24,
      padding: "0 4px",
      width: "100%",
    }),
    [],
  );

  const labelRowStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8,
    }),
    [],
  );

  const trackStyle = useMemo(
    () => ({
      height: 8,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
    }),
    [],
  );

  const fillStyle = useMemo(
    () => ({
      height: "100%",
      width: `${pct}%`,
      background: barGradient,
      borderRadius: 10,
      transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      boxShadow: barShadow,
    }),
    [pct, barGradient, barShadow],
  );

  return (
    <div
      role="progressbar"
      aria-valuenow={numericGpa}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`GPA progress: ${numericGpa.toFixed(2)} out of ${max}`}
      style={containerStyle}
    >
      <div style={labelRowStyle}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Progress
        </span>
        <span
          style={{
            fontSize: "clamp(11px, 2vw, 13px)",
            fontWeight: 700,
            color: isHigh ? "#10b981" : isMedium ? "#f59e0b" : "#ef4444",
          }}
          aria-live="polite"
        >
          {numericGpa.toFixed(2)} / {max} ({pct.toFixed(0)}%)
        </span>
      </div>

      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
          letterSpacing: 0.5,
        }}
      >
        {markers.map((m, i) => (
          <span key={i}>{m.toFixed(2)}</span>
        ))}
      </div>

      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}

// ── TargetGPACalculator ────────────────────────────────────────────────
const TargetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export function TargetGPACalculator({
  currentGPA,
  totalCredits,
  darkMode: _deprecatedDarkMode,
}) {
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredGPA, setRequiredGPA] = useState(null);
  const [error, setError] = useState("");

  // All styles hardcoded to dark mode
  const cardStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, rgba(30,20,60,0.5), rgba(15,12,35,0.6))",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(167,139,250,0.2)",
      borderRadius: 20,
      padding: "clamp(18px, 4vw, 24px)",
      marginTop: 24,
      boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    }),
    [],
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: 16,
      fontWeight: 600,
      margin: 0,
      color: "#e2d9f3",
    }),
    [],
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: 13,
      fontWeight: 500,
      color: "rgba(255,255,255,0.6)",
    }),
    [],
  );

  const inputStyle = useCallback(
    (hasValue) => ({
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: `1px solid ${
        hasValue ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.12)"
      }`,
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(8px)",
      color: "#f1f0ff",
      fontSize: 15,
      fontWeight: 500,
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    }),
    [],
  );

  const calculateButtonStyle = useMemo(
    () => ({
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      border: "none",
      borderRadius: 14,
      color: "#fff",
      fontWeight: 600,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
      transition: "all 0.25s ease",
    }),
    [],
  );

  const errorBoxStyle = useMemo(
    () => ({
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 13,
      color: "#fca5a5",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }),
    [],
  );

  const resultCardStyle = useMemo(
    () => ({
      textAlign: "center",
      marginTop: 8,
      padding: "16px",
      background: "rgba(124,58,237,0.08)",
      borderRadius: 16,
      border: "1px solid rgba(124,58,237,0.2)",
    }),
    [],
  );

  // Calculation logic
  const calculateRequired = useCallback(() => {
    setError("");
    setRequiredGPA(null);

    const current = parseFloat(currentGPA);
    const target = parseFloat(targetGPA);
    const total = parseFloat(totalCredits);
    const remaining = parseFloat(remainingCredits);

    if (
      isNaN(current) ||
      isNaN(target) ||
      isNaN(total) ||
      isNaN(remaining) ||
      targetGPA === "" ||
      remainingCredits === ""
    ) {
      setError("Please fill all fields with valid numbers.");
      return;
    }
    if (target < 0) {
      setError("Target GPA must be non‑negative.");
      return;
    }
    if (remaining <= 0) {
      setError("Remaining credits must be greater than zero.");
      return;
    }

    const required =
      (target * (total + remaining) - current * total) / remaining;
    if (required < 0) {
      setRequiredGPA("0.00 (target already reached)");
    } else {
      setRequiredGPA(required.toFixed(2));
    }
  }, [currentGPA, totalCredits, targetGPA, remainingCredits]);

  // SVG warning icon for errors
  const WarningIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  return (
    <div className="animate-scale-in" style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", color: "#a78bfa" }}
        >
          <TargetIcon />
        </span>
        <h3 style={headingStyle}>Target GPA Calculator</h3>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <label
          htmlFor="target-gpa-input"
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <span style={labelStyle}>Target GPA</span>
          <input
            id="target-gpa-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 3.50"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            style={inputStyle(targetGPA !== "")}
            onFocus={(e) => {
              e.target.style.borderColor = "#7c3aed";
              e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.12)";
              e.target.style.boxShadow = "none";
            }}
            aria-required="true"
          />
        </label>

        <label
          htmlFor="remaining-credits-input"
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <span style={labelStyle}>Remaining Credits</span>
          <input
            id="remaining-credits-input"
            type="number"
            min="0"
            placeholder="e.g. 30"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            style={inputStyle(remainingCredits !== "")}
            onFocus={(e) => {
              e.target.style.borderColor = "#7c3aed";
              e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.12)";
              e.target.style.boxShadow = "none";
            }}
            aria-required="true"
          />
        </label>

        {error && (
          <div role="alert" style={errorBoxStyle}>
            <WarningIcon />
            {error}
          </div>
        )}

        <button
          onClick={calculateRequired}
          style={calculateButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 12px 26px rgba(124,58,237,0.4)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(124,58,237,0.25)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Calculate Required GPA
        </button>

        {requiredGPA !== null && (
          <div className="animate-fade-up" style={resultCardStyle}>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              Required GPA in remaining courses
            </div>
            <div
              style={{
                fontSize: "clamp(24px, 8vw, 32px)",
                fontWeight: 700,
                color: "#c4b5fd",
              }}
            >
              {requiredGPA}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
