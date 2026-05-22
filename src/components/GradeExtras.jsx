import { useState } from "react";

export function GradeProgressBar({ gpa, scale, darkMode }) {
  const max     = parseFloat(scale);
  const pct     = Math.min((parseFloat(gpa) / max) * 100, 100);
  const markers = [0, max * 0.5, max * 0.75, max];
  const subCol  = darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)";

  return (
    <div style={{ marginTop: 16, padding: "0 2px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 10, color: subCol, marginBottom: 6, letterSpacing: 0.5,
      }}>
        {markers.map((m, i) => <span key={i}>{m.toFixed(2)}</span>)}
      </div>
      <div style={{
        height: 6,
        background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        borderRadius: 8, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
          borderRadius: 8, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>
    </div>
  );
}

export function TargetGPACalculator({ currentGPA, totalCredits, darkMode }) {
  const [targetGPA,        setTargetGPA]        = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredGPA,      setRequiredGPA]      = useState(null);

  const calculate = () => {
    const current   = parseFloat(currentGPA)        || 0;
    const target    = parseFloat(targetGPA)         || 0;
    const total     = parseFloat(totalCredits)      || 0;
    const remaining = parseFloat(remainingCredits)  || 0;
    if (remaining === 0) { setRequiredGPA("N/A"); return; }
    const req = (target * (total + remaining) - current * total) / remaining;
    setRequiredGPA(req.toFixed(2));
  };

  const surfaceBg   = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg     = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)";
  const textCol     = darkMode ? "#fff"                   : "#333";

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: 10, padding: "10px",
    color: textCol, width: "100%", outline: "none",
  };

  return (
    <div style={{
      background: surfaceBg, border: `1px solid ${borderCol}`,
      borderRadius: 16, padding: 20, marginTop: 20,
    }}>
      <h3 style={{ fontSize: 15, marginBottom: 16, color: "#a78bfa" }}>🎯 Target GPA Calculator</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <input
          type="number" placeholder="Target GPA"
          value={targetGPA} onChange={e => setTargetGPA(e.target.value)}
          aria-label="Target GPA" style={inputStyle}
        />
        <input
          type="number" placeholder="Remaining Credits"
          value={remainingCredits} onChange={e => setRemainingCredits(e.target.value)}
          aria-label="Remaining credits" style={inputStyle}
        />
        <button
          onClick={calculate}
          style={{
            padding: "10px",
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            border: "none", borderRadius: 10, color: "#fff",
            cursor: "pointer", fontWeight: 500,
          }}
        >
          Calculate Required GPA
        </button>
        {requiredGPA !== null && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 12, color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)" }}>
              Required GPA in remaining courses:
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#a78bfa" }}>{requiredGPA}</div>
          </div>
        )}
      </div>
    </div>
  );
}