import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf";

const isDevelopment = import.meta.env.DEV;

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  if (isDevelopment) {
    console.log('✅ EmailJS initialized successfully');
  }
}

// Wrap console logs for development only
if (!isDevelopment) {
  console.log = () => { };
  console.warn = () => { };
}

// ---------- GPA / CGPA Constants & Helpers ----------
const GRADES = [
  { l: "A+  — 4.00", p: 4.0, g: "A+" },
  { l: "A   — 4.00", p: 4.0, g: "A" },
  { l: "A−  — 3.67", p: 3.67, g: "A−" },
  { l: "B+  — 3.33", p: 3.33, g: "B+" },
  { l: "B   — 3.00", p: 3.0, g: "B" },
  { l: "B−  — 2.67", p: 2.67, g: "B−" },
  { l: "C+  — 2.33", p: 2.33, g: "C+" },
  { l: "C   — 2.00", p: 2.0, g: "C" },
  { l: "C−  — 1.67", p: 1.67, g: "C−" },
  { l: "D   — 1.00", p: 1.0, g: "D" },
  { l: "F   — 0.00", p: 0.0, g: "F" },
];

const SCALES = {
  "4.0": GRADES,
  "5.0": [
    { l: "A  — 5.00", p: 5.0, g: "A" },
    { l: "B  — 4.00", p: 4.0, g: "B" },
    { l: "C  — 3.00", p: 3.0, g: "C" },
    { l: "D  — 2.00", p: 2.0, g: "D" },
    { l: "E  — 1.00", p: 1.0, g: "E" },
    { l: "F  — 0.00", p: 0.0, g: "F" },
  ],
  "10.0": [
    { l: "10  — 10.0", p: 10.0, g: "10" },
    { l: "9   — 9.00", p: 9.0, g: "9" },
    { l: "8   — 8.00", p: 8.0, g: "8" },
    { l: "7   — 7.00", p: 7.0, g: "7" },
    { l: "6   — 6.00", p: 6.0, g: "6" },
    { l: "5   — 5.00", p: 5.0, g: "5" },
    { l: "4   — 4.00", p: 4.0, g: "4" },
  ],
};

function getStanding(g, scale = "4.0") {
  const maxGPA = parseFloat(scale);
  const percentage = (g / maxGPA) * 100;
  if (percentage >= 92.5) return { t: "Outstanding — Dean's List", color: "#a78bfa" };
  if (percentage >= 75) return { t: "Very Good Standing", color: "#34d399" };
  if (percentage >= 62.5) return { t: "Good Standing", color: "#60a5fa" };
  if (percentage >= 50) return { t: "Satisfactory", color: "#fbbf24" };
  if (percentage >= 25) return { t: "Below Average", color: "#f87171" };
  return { t: "Academic Probation", color: "#ef4444" };
}

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = 0;
    const end = parseFloat(value) || 0;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((start + (end - start) * eased).toFixed(decimals));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, decimals]);
  return <span>{display}</span>;
}

function CourseCard({ id, index, removable, onRemove, data, onChange, scale, darkMode }) {
  const gradeOptions = SCALES[scale] || GRADES;

  return (
    <div style={{
      background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: 16, padding: "20px 20px 16px", position: "relative",
      transition: "all 0.3s", marginBottom: 12,
      animation: "slideIn 0.25s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        position: "absolute", top: -10, left: 16,
        background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
        color: "#fff", fontSize: 10, fontWeight: 600,
        padding: "3px 10px", borderRadius: 20, letterSpacing: 1,
        fontFamily: "'JetBrains Mono', monospace"
      }}>COURSE {index + 1}</div>

      {removable && (
        <button onClick={() => onRemove(id)} style={{
          position: "absolute", top: 12, right: 14,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
          color: "#f87171", borderRadius: 8, width: 26, height: 26,
          cursor: "pointer", fontSize: 14, display: "flex",
          alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
        >×</button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10, marginTop: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Course Code</div>
          <input
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. CS-301"
            onChange={e => onChange(id, "code", e.target.value)}
            style={{
              width: "100%", background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 10, padding: "9px 12px", color: darkMode ? "#fff" : "#333", fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace", outline: "none", transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#7c3aed"}
            onBlur={e => e.target.style.borderColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Credits</div>
          <select
            value={data.credits}
            onChange={e => onChange(id, "credits", parseInt(e.target.value))}
            style={{
              width: "100%", background: darkMode ? "#1a1035" : "#fff",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 10, padding: "9px 8px", color: darkMode ? "#fff" : "#333", fontSize: 14, outline: "none", cursor: "pointer"
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c} cr</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Grade</div>
        <select
          value={data.gradeIdx}
          onChange={e => onChange(id, "gradeIdx", parseInt(e.target.value))}
          style={{
            width: "100%", background: darkMode ? "#1a1035" : "#fff",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 10, padding: "9px 12px", color: darkMode ? "#fff" : "#333", fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace", outline: "none", cursor: "pointer"
          }}
        >
          {gradeOptions.map((g, i) => <option key={i} value={i}>{g.l}</option>)}
        </select>
      </div>
    </div>
  );
}

function ResultCard({ gpa, courses, credits, points, scale, darkMode }) {
  const s = getStanding(parseFloat(gpa), scale);
  const maxGPA = parseFloat(scale);

  return (
    <div style={{
      borderRadius: 20, overflow: "hidden", border: "1px solid rgba(167,139,250,0.25)",
      marginTop: 20, animation: "fadeUp 0.4s ease"
    }}>
      <div style={{ background: darkMode ? "linear-gradient(135deg,#0f0829 0%,#1a0f3a 100%)" : "linear-gradient(135deg,#f5f5f5 0%,#e0e0e0 100%)", padding: "32px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", marginBottom: 12 }}>Semester GPA</div>
        <div style={{ fontSize: "clamp(48px, 15vw, 68px)", fontWeight: 700, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: -2 }}>
          <AnimatedNumber value={gpa} />
        </div>
        <div style={{ fontSize: 12, color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", marginTop: 4 }}>
          out of {maxGPA}.00
        </div>
        <div style={{ marginTop: 12, display: "inline-block", padding: "5px 16px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: `1px solid ${s.color}33`, color: s.color, fontSize: 12, fontWeight: 500 }}>
          {s.t}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        {[["Courses", courses, ""], ["Credit hrs", credits, ""], ["Quality pts", points, ".2f"]].map(([k, v, fmt], i) => (
          <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none" }}>
            <div style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: darkMode ? "#e2d9f3" : "#333", fontFamily: "'JetBrains Mono',monospace" }}>{fmt ? parseFloat(v).toFixed(2) : v}</div>
            <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CGPAResultCard({ cgpa, sems, total, best, scale, darkMode }) {
  const s = getStanding(parseFloat(cgpa), scale);
  const maxGPA = parseFloat(scale);

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(167,139,250,0.25)", marginTop: 20, animation: "fadeUp 0.4s ease" }}>
      <div style={{ background: darkMode ? "linear-gradient(135deg,#0f0829,#1a0f3a)" : "linear-gradient(135deg,#f5f5f5,#e0e0e0)", padding: "32px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", marginBottom: 12 }}>Cumulative CGPA</div>
        <div style={{ fontSize: "clamp(48px, 15vw, 68px)", fontWeight: 700, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: -2 }}>
          <AnimatedNumber value={cgpa} />
        </div>
        <div style={{ fontSize: 12, color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", marginTop: 4 }}>
          out of {maxGPA}.00
        </div>
        <div style={{ marginTop: 12, display: "inline-block", padding: "5px 16px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: `1px solid ${s.color}33`, color: s.color, fontSize: 12, fontWeight: 500 }}>
          {s.t}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        {[["Semesters", sems, false], ["GPA sum", total, true], ["Best sem", best, true]].map(([k, v, fmt], i) => (
          <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none" }}>
            <div style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: darkMode ? "#e2d9f3" : "#333", fontFamily: "'JetBrains Mono',monospace" }}>{fmt ? parseFloat(v).toFixed(2) : v}</div>
            <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradeProgressBar({ gpa, scale, darkMode }) {
  const maxGPA = parseFloat(scale);
  const pct = Math.min((parseFloat(gpa) / maxGPA) * 100, 100);
  const markers = [0, maxGPA * 0.5, maxGPA * 0.75, maxGPA];

  return (
    <div style={{ marginTop: 16, padding: "0 2px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", marginBottom: 6, letterSpacing: 0.5 }}>
        {markers.map((m, i) => <span key={i}>{m.toFixed(2)}</span>)}
      </div>
      <div style={{ height: 6, background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 8, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>
    </div>
  );
}

function CalculatorPanel({ darkMode }) {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");

  const handleNormalClick = (value) => {
    if (value === "C") { setInput(""); setResult("0"); }
    else if (value === "⌫") { setInput(prev => prev.slice(0, -1)); }
    else if (value === "=") {
      try {
        const evalResult = Function('"use strict";return (' + input + ')')();
        const res = typeof evalResult === "number" ? evalResult.toString() : "Error";
        setResult(res);
        setHistory(prev => [`${input} = ${res}`, ...prev.slice(0, 4)]);
        setInput(res);
      } catch { setResult("Error"); setInput(""); }
    } else {
      setInput(prev => prev + value);
    }
  };

  const handleMemory = (action) => {
    const current = parseFloat(result) || 0;
    switch (action) {
      case "MC": setMemory(0); break;
      case "MR": setInput(prev => prev + memory.toString()); break;
      case "M+": setMemory(m => m + current); break;
      case "M-": setMemory(m => m - current); break;
      default: break;
    }
  };

  const handleScientific = (func) => {
    const current = parseFloat(input) || 0;
    let res;
    try {
      switch (func) {
        case "sin": res = angleMode === "deg" ? Math.sin(current * Math.PI / 180) : Math.sin(current); break;
        case "cos": res = angleMode === "deg" ? Math.cos(current * Math.PI / 180) : Math.cos(current); break;
        case "tan": res = angleMode === "deg" ? Math.tan(current * Math.PI / 180) : Math.tan(current); break;
        case "asin": res = Math.asin(current); break;
        case "acos": res = Math.acos(current); break;
        case "atan": res = Math.atan(current); break;
        case "√": res = Math.sqrt(current); break;
        case "∛": res = Math.cbrt(current); break;
        case "x²": res = Math.pow(current, 2); break;
        case "x³": res = Math.pow(current, 3); break;
        case "xʸ": setInput(prev => prev + "**"); return;
        case "10ˣ": res = Math.pow(10, current); break;
        case "log": res = Math.log10(current); break;
        case "ln": res = Math.log(current); break;
        case "π": res = Math.PI; break;
        case "e": res = Math.E; break;
        case "|x|": res = Math.abs(current); break;
        case "±": res = -current; break;
        case "1/x": res = 1 / current; break;
        case "n!":
          if (current < 0 || !Number.isInteger(current)) { res = NaN; break; }
          res = 1; for (let i = 2; i <= current; i++) res *= i;
          break;
        case "(": setInput(prev => prev + "("); return;
        case ")": setInput(prev => prev + ")"); return;
      }
      const resStr = res.toString();
      setResult(resStr);
      setInput(resStr);
      setHistory(prev => [`${func}(${current}) = ${resStr}`, ...prev.slice(0, 4)]);
    } catch { setResult("Error"); setInput(""); }
  };

  const normalButtons = [
    ["MC", "MR", "M+", "M-"],
    ["C", "⌫", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "("],
    ["asin", "acos", "atan", ")"],
    ["√", "∛", "x²", "x³"],
    ["log", "ln", "10ˣ", "xʸ"],
    ["π", "e", "|x|", "n!"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["C", "0", ".", "+"],
    ["MC", "MR", "M+", "="],
  ];

  return (
    <div>
      {mode === "scientific" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setAngleMode("deg")} style={{ flex: 1, padding: "6px", background: angleMode === "deg" ? "rgba(124,58,237,0.2)" : darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: angleMode === "deg" ? "1px solid #7c3aed" : `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 8, color: darkMode ? "#fff" : "#333", fontSize: 12, cursor: "pointer" }}>DEG</button>
          <button onClick={() => setAngleMode("rad")} style={{ flex: 1, padding: "6px", background: angleMode === "rad" ? "rgba(124,58,237,0.2)" : darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: angleMode === "rad" ? "1px solid #7c3aed" : `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 8, color: darkMode ? "#fff" : "#333", fontSize: 12, cursor: "pointer" }}>RAD</button>
        </div>
      )}

      {memory !== 0 && (
        <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>M: {memory}</div>
      )}

      <div style={{ background: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)", borderRadius: 16, padding: "clamp(16px, 4vw, 20px) clamp(14px, 3vw, 18px)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, marginBottom: 18 }}>
        <div style={{ fontSize: "clamp(12px, 3vw, 14px)", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", minHeight: 22, wordBreak: "break-all" }}>{input || "0"}</div>
        <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 600, color: darkMode ? "#fff" : "#333", fontFamily: "'JetBrains Mono', monospace", letterSpacing: -1, wordBreak: "break-all" }}>{result}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["normal", "scientific"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "clamp(8px, 2vw, 10px)", background: mode === m ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: mode === m ? "none" : `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, color: "#fff", fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{m}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(6px, 2vw, 8px)" }}>
        {(mode === "normal" ? normalButtons : scientificButtons).map((row, i) =>
          row.map((btn, j) => (
            <button key={`${i}-${j}`} onClick={() => {
              if (["MC", "MR", "M+", "M-"].includes(btn)) handleMemory(btn);
              else if (mode === "normal") handleNormalClick(btn);
              else {
                if (["sin", "cos", "tan", "asin", "acos", "atan", "√", "∛", "x²", "x³", "10ˣ", "log", "ln", "π", "e", "|x|", "±", "1/x", "n!", "(", ")"].includes(btn)) {
                  if (btn === "π" || btn === "e") setInput(prev => prev + btn);
                  else handleScientific(btn);
                } else handleNormalClick(btn);
              }
            }} style={{
              padding: "clamp(10px, 3vw, 14px) 0",
              background: ["C", "="].includes(btn) ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : ["MC", "MR", "M+", "M-"].includes(btn) ? "rgba(167,139,250,0.15)" : darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 12, color: darkMode ? "#fff" : "#333",
              fontSize: "clamp(12px, 3.5vw, 14px)", fontWeight: 500, cursor: "pointer",
              fontFamily: btn.match(/[0-9]/) ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
              transition: "all 0.15s", gridColumn: btn === "=" ? "span 1" : "auto"
            }}
              onMouseEnter={e => { if (!["C", "="].includes(btn)) e.currentTarget.style.background = "rgba(124,58,237,0.25)"; }}
              onMouseLeave={e => { if (!["C", "="].includes(btn)) e.currentTarget.style.background = ["MC", "MR", "M+", "M-"].includes(btn) ? "rgba(167,139,250,0.15)" : darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"; }}
            >{btn}</button>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Recent</div>
            <button onClick={() => setHistory([])} style={{ background: "transparent", border: "none", color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 10, cursor: "pointer" }}>Clear</button>
          </div>
          {history.map((h, i) => (
            <div key={i} style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", padding: "4px 0", wordBreak: "break-all" }}>{h}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function TargetGPACalculator({ currentGPA, totalCredits, darkMode }) {
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredGPA, setRequiredGPA] = useState(null);

  const calculateRequired = () => {
    const current = parseFloat(currentGPA) || 0;
    const target = parseFloat(targetGPA) || 0;
    const total = parseFloat(totalCredits) || 0;
    const remaining = parseFloat(remainingCredits) || 0;
    if (remaining === 0) { setRequiredGPA("N/A"); return; }
    const required = (target * (total + remaining) - current * total) / remaining;
    setRequiredGPA(required.toFixed(2));
  };

  return (
    <div style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: 20, marginTop: 20 }}>
      <h3 style={{ fontSize: 15, marginBottom: 16, color: "#a78bfa" }}>🎯 Target GPA Calculator</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <input type="number" placeholder="Target GPA" value={targetGPA} onChange={e => setTargetGPA(e.target.value)} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, padding: "10px", color: darkMode ? "#fff" : "#333" }} />
        <input type="number" placeholder="Remaining Credits" value={remainingCredits} onChange={e => setRemainingCredits(e.target.value)} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, padding: "10px", color: darkMode ? "#fff" : "#333" }} />
        <button onClick={calculateRequired} style={{ padding: "10px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 500 }}>Calculate Required GPA</button>
        {requiredGPA && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 12, color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)" }}>Required GPA in remaining courses:</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#a78bfa" }}>{requiredGPA}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExportModal({ isOpen, onClose, onExport, darkMode }) {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleExport = () => {
    onExport({ studentName, studentId, university, semester, format: exportFormat });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(5px)" }} onClick={onClose}>
      <div style={{ background: darkMode ? "#1a1035" : "#fff", borderRadius: 20, padding: 30, maxWidth: 500, width: "90%" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 20, color: darkMode ? "#fff" : "#333" }}>Export Academic Record</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: 13 }}>Student Name *</label>
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5", color: darkMode ? "#fff" : "#333" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: 13 }}>Student ID</label>
          <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5", color: darkMode ? "#fff" : "#333" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: 13 }}>University/College</label>
          <input type="text" value={university} onChange={e => setUniversity(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5", color: darkMode ? "#fff" : "#333" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: 13 }}>Semester</label>
          <input type="text" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g., Fall 2024" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5", color: darkMode ? "#fff" : "#333" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 6, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontSize: 13 }}>Export Format</label>
          <select value={exportFormat} onChange={e => setExportFormat(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5", color: darkMode ? "#fff" : "#333" }}>
            <option value="pdf">PDF Document</option>
            <option value="csv">CSV Spreadsheet</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExport} disabled={!studentName} style={{ flex: 1, padding: 12, background: studentName ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(124,58,237,0.3)", border: "none", borderRadius: 10, color: "#fff", cursor: studentName ? "pointer" : "not-allowed", fontWeight: 600 }}>Export</button>
          <button onClick={onClose} style={{ flex: 1, padding: 12, background: "transparent", border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, borderRadius: 10, color: darkMode ? "#fff" : "#333", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [tab, setTab] = useState("gpa");
  const [visitors, setVisitors] = useState(1312);
  const [scale, setScale] = useState("4.0");
  const [courses, setCourses] = useState([
    { id: 1, code: "", credits: 3, gradeIdx: 0 },
    { id: 2, code: "", credits: 3, gradeIdx: 0 },
    { id: 3, code: "", credits: 3, gradeIdx: 0 },
  ]);
  const [nextCId, setNextCId] = useState(4);
  const [gpaResult, setGpaResult] = useState(null);
  const [gpaErr, setGpaErr] = useState("");

  const [sems, setSems] = useState([
    { id: 1, val: "" },
    { id: 2, val: "" },
  ]);
  const [nextSId, setNextSId] = useState(3);
  const [cgpaResult, setCgpaResult] = useState(null);
  const [cgpaErr, setCgpaErr] = useState("");

  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactErr, setContactErr] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [showTargetGPA, setShowTargetGPA] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.6) setVisitors(v => v + Math.floor(Math.random() * 2) + 1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setGpaResult(null);
    setCgpaResult(null);
  }, [scale]);

  const addCourse = () => { if (courses.length >= 8) return; setCourses(prev => [...prev, { id: nextCId, code: "", credits: 3, gradeIdx: 0 }]); setNextCId(n => n + 1); };
  const removeCourse = (id) => { setCourses(prev => prev.filter(c => c.id !== id)); setGpaResult(null); };
  const updateCourse = (id, field, val) => { setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c)); };

  const calcGPA = () => {
    setGpaErr("");
    if (courses.length === 0) { setGpaErr("Add at least one course."); return; }
    for (const c of courses) { if (!c.code.trim()) { setGpaErr("Please fill in all course codes."); return; } }
    let tp = 0, tc = 0;
    const gradeScale = SCALES[scale] || GRADES;
    for (const c of courses) { tp += gradeScale[c.gradeIdx].p * c.credits; tc += c.credits; }
    const gpa = tc ? tp / tc : 0;
    setGpaResult({ gpa: gpa.toFixed(2), count: courses.length, credits: tc, points: tp });
  };

  const addSem = () => { if (sems.length >= 8) return; setSems(prev => [...prev, { id: nextSId, val: "" }]); setNextSId(n => n + 1); };
  const removeSem = (id) => { setSems(prev => prev.filter(s => s.id !== id)); setCgpaResult(null); };
  const updateSem = (id, val) => setSems(prev => prev.map(s => s.id === id ? { ...s, val } : s));

  const calcCGPA = () => {
    setCgpaErr("");
    let total = 0, count = 0, best = 0;
    const maxGPA = parseFloat(scale);
    for (const s of sems) {
      if (s.val === "") continue;
      const n = parseFloat(s.val);
      if (isNaN(n) || n < 0 || n > maxGPA) { setCgpaErr(`Enter valid GPA values (0.00 – ${maxGPA}.00).`); return; }
      total += n; count++; if (n > best) best = n;
    }
    if (!count) { setCgpaErr("Please enter at least one semester GPA."); return; }
    setCgpaResult({ cgpa: (total / count).toFixed(2), sems: count, total: total.toFixed(2), best: best.toFixed(2) });
  };

  const submitContact = async () => {
    setContactErr("");
    if (!contact.name.trim() || !contact.email.trim() || !contact.message.trim()) {
      setContactErr("Please fill in all required fields."); return;
    }
    if (!/\S+@\S+\.\S+/.test(contact.email)) {
      setContactErr("Please enter a valid email address."); return;
    }
    setIsSending(true);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setContactErr("Email service not configured."); setIsSending(false); return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: contact.name,
        from_email: contact.email,
        subject: contact.subject || "Nexa Calculator Contact",
        message: contact.message
      });
      setContactSent(true);
      setContact({ name: "", email: "", subject: "", message: "" });
    } catch {
      setContactErr("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleExport = (exportData) => {
    const gradeScale = SCALES[scale] || GRADES;
    const data = {
      ...exportData,
      scale,
      courses: courses.map(c => ({ code: c.code || "—", credits: c.credits, grade: gradeScale[c.gradeIdx].g, points: gradeScale[c.gradeIdx].p.toFixed(2) })),
      gpaResult,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    if (exportData.format === "pdf") {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("NEXA CALCULATOR", 105, 25, { align: "center" });
      doc.setFontSize(12);
      doc.setTextColor(199, 181, 253);
      doc.text("Academic Excellence Suite", 105, 35, { align: "center" });

      let yPos = 55;

      // Student Info
      doc.setDrawColor(124, 58, 237);
      doc.line(15, yPos - 5, 195, yPos - 5);
      doc.setFontSize(16);
      doc.setTextColor(124, 58, 237);
      doc.text("ACADEMIC RECORD", 105, yPos, { align: "center" });
      yPos += 12;

      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Student Information", 20, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`Name: ${data.studentName}`, 25, yPos); yPos += 6;
      if (data.studentId) { doc.text(`Student ID: ${data.studentId}`, 25, yPos); yPos += 6; }
      if (data.university) { doc.text(`Institution: ${data.university}`, 25, yPos); yPos += 6; }
      if (data.semester) { doc.text(`Semester: ${data.semester}`, 25, yPos); yPos += 6; }
      doc.text(`Generated: ${data.date}`, 25, yPos);
      yPos += 12;

      // Course Table
      doc.line(20, yPos, 190, yPos); yPos += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(124, 58, 237);
      doc.text("Course Details", 20, yPos); yPos += 8;

      doc.setFillColor(124, 58, 237);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("Course Code", 25, yPos + 5.5);
      doc.text("Credits", 85, yPos + 5.5);
      doc.text("Grade", 115, yPos + 5.5);
      doc.text("Points", 155, yPos + 5.5);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      data.courses.forEach((course, index) => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        if (index % 2 === 0) { doc.setFillColor(245, 245, 250); doc.rect(20, yPos - 4, 170, 7, 'F'); }
        doc.text(course.code, 25, yPos);
        doc.text(course.credits.toString(), 85, yPos);
        doc.text(course.grade, 115, yPos);
        doc.text(course.points, 155, yPos);
        yPos += 7;
      });

      // Summary
      yPos += 10;
      doc.setDrawColor(124, 58, 237);
      doc.line(20, yPos, 190, yPos); yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(124, 58, 237);
      doc.text("Academic Summary", 20, yPos); yPos += 10;

      doc.setFillColor(249, 248, 255);
      doc.rect(20, yPos - 4, 170, 30, 'F');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("GPA", 40, yPos + 3);
      doc.setFontSize(18);
      doc.setTextColor(124, 58, 237);
      doc.text(data.gpaResult.gpa, 40, yPos + 15);
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`out of ${data.scale}`, 40, yPos + 22);
      doc.setFont("helvetica", "bold");
      doc.text("Total Credits", 105, yPos + 3);
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text(data.gpaResult.credits.toString(), 105, yPos + 15);
      doc.setFont("helvetica", "bold");
      doc.text("Quality Points", 150, yPos + 3);
      doc.setFontSize(14);
      doc.text(data.gpaResult.points.toFixed(2), 150, yPos + 15);
      yPos += 40;

      // Standing
      const standing = getStanding(parseFloat(data.gpaResult.gpa), data.scale);
      doc.setFillColor(standing.color === "#a78bfa" ? 167 : standing.color === "#34d399" ? 52 : standing.color === "#60a5fa" ? 96 : standing.color === "#fbbf24" ? 251 : standing.color === "#f87171" ? 248 : 239);
      doc.rect(20, yPos - 4, 170, 12, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`Academic Standing: ${standing.t}`, 105, yPos + 3, { align: "center" });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(124, 58, 237);
        doc.text("Crafted by Usman Murtaza • Nexa Calculator", 105, 290, { align: "center" });
        doc.text("nexacalculator.netlify.app", 105, 295, { align: "center" });
      }

      doc.save(`Nexa_Academic_Record_${data.studentName.replace(/\s+/g, '_')}.pdf`);
    } else {
      let csv = "NEXA CALCULATOR - ACADEMIC RECORD\n==========================================\n\nSTUDENT INFORMATION\n";
      csv += `Student Name,${data.studentName}\nStudent ID,${data.studentId}\nUniversity,${data.university}\nSemester,${data.semester}\nDate,${data.date}\nScale,${data.scale}\n\nCOURSE DETAILS\nCode,Credits,Grade,Points\n`;
      data.courses.forEach(c => csv += `${c.code},${c.credits},${c.grade},${c.points}\n`);
      csv += `\nACADEMIC SUMMARY\nGPA,${data.gpaResult.gpa}\nCredits,${data.gpaResult.credits}\nPoints,${data.gpaResult.points.toFixed(2)}\n\nGenerated by Nexa Calculator - Crafted by Usman Murtaza`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Nexa_Record_${data.studentName.replace(/\s+/g, '_')}.csv`;
      a.click();
    }
  };

  const inputStyle = { width: "100%", background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`, borderRadius: 12, padding: "12px 14px", color: darkMode ? "#fff" : "#333", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s", display: "block" };

  if (!isLoaded) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: darkMode ? "#080617" : "#f5f5f5" }}><div style={{ width: "50px", height: "50px", border: "3px solid rgba(124, 58, 237, 0.1)", borderRadius: "50%", borderTopColor: "#7c3aed", animation: "spin 1s ease-in-out infinite" }} /></div>;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: darkMode ? "#080617" : "#f5f5f5", color: darkMode ? "#fff" : "#333", minHeight: "100vh", transition: "all 0.3s", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #1a1035; color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed44; border-radius: 4px; }
        @media (max-width: 768px) { .header-container { flex-direction: column; align-items: flex-start !important; gap: 12px; } }
        @media (max-width: 480px) { .semester-grid { grid-template-columns: 1fr !important; } .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .header-container h1 { font-size: clamp(20px, 5vw, 24px) !important; } button { min-height: 44px; } input, select, textarea { font-size: 16px !important; } }
      `}</style>

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} onExport={handleExport} darkMode={darkMode} />

      {/* Header */}
      <div style={{ background: darkMode ? "linear-gradient(180deg,#0f0829 0%,#080617 100%)" : "linear-gradient(180deg,#fff 0%,#f5f5f5 100%)", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, padding: "clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) 0" }}>
        <div className="header-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(14px, 3vw, 18px) 0 0" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em", background: darkMode ? "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)" : "linear-gradient(135deg, #333 0%, #7c3aed 50%, #6d28d9 100%)", backgroundSize: "200% 200%", animation: "gradientShift 3s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 4px 0" }}>Nexa Calculator</h1>
            <p style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontWeight: 500 }}>Academic Excellence Suite • GPA • CGPA • Scientific</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: "transparent", border: "none", fontSize: 24, cursor: "pointer" }}>{darkMode ? "🌙" : "☀️"}</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: darkMode ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)", border: `1px solid ${darkMode ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.2)"}`, borderRadius: 30, padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)", backdropFilter: "blur(10px)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 600, color: darkMode ? "#c4b5fd" : "#7c3aed" }}>{visitors.toLocaleString()}</span>
              <span style={{ fontSize: "clamp(10px, 2vw, 12px)", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)" }}>active</span>
            </div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: "clamp(8px, 2vw, 16px)", marginTop: "clamp(16px, 4vw, 24px)", flexWrap: "wrap" }}>
          {["gpa", "cgpa", "calculator"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600, cursor: "pointer", background: tab === t ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))" : "transparent", border: "none", borderBottom: tab === t ? "3px solid #7c3aed" : "3px solid transparent", color: tab === t ? (darkMode ? "#fff" : "#333") : (darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"), transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize", borderRadius: "8px 8px 0 0" }}>
              {t === "gpa" ? "📊 Semester GPA" : t === "cgpa" ? "📈 Cumulative CGPA" : "🔢 Scientific Calculator"}
            </button>
          ))}
        </nav>
      </div>

      {/* Scale Selector */}
      {(tab === "gpa" || tab === "cgpa") && (
        <div style={{ padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px) 0", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>GPA Scale:</span>
          <select value={scale} onChange={e => setScale(e.target.value)} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 8, padding: "8px 16px", color: darkMode ? "#fff" : "#333", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
            <option value="4.0">4.0 Scale</option>
            <option value="5.0">5.0 Scale</option>
            <option value="10.0">10.0 Scale</option>
          </select>
          {(tab === "gpa" && gpaResult) && (
            <button onClick={() => setShowExportModal(true)} style={{ marginLeft: "auto", padding: "8px 16px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#a78bfa", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>📥 Export Academic Record</button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px)" }}>
        {tab === "gpa" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", margin: 0 }}>Current Courses & Grades</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => setShowTargetGPA(!showTargetGPA)} style={{ padding: "6px 14px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 20, color: "#a78bfa", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>{showTargetGPA ? "Hide" : "Show"} Target GPA</button>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#7c3aed", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", padding: "5px 14px", borderRadius: 20, fontWeight: 500 }}>{courses.length} / 8 courses</div>
              </div>
            </div>
            {courses.map((c, i) => <CourseCard key={c.id} id={c.id} index={i} removable={i >= 3} onRemove={removeCourse} data={c} onChange={updateCourse} scale={scale} darkMode={darkMode} />)}
            {courses.length < 8 && <button onClick={addCourse} style={{ width: "100%", padding: "clamp(11px, 2.5vw, 13px)", border: "2px dashed rgba(124,58,237,0.4)", borderRadius: 14, background: "transparent", color: "#a78bfa", fontSize: "clamp(14px, 3vw, 15px)", fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ fontSize: 22 }}>+</span> Add New Course</button>}
            <button onClick={calcGPA} style={{ width: "100%", padding: "clamp(14px, 3vw, 17px)", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(16px, 3.5vw, 17px)", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)" }}>Calculate Semester GPA</button>
            {gpaErr && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#fca5a5", marginTop: 12 }}>⚠️ {gpaErr}</div>}
            {gpaResult && (
              <>
                <ResultCard gpa={gpaResult.gpa} courses={gpaResult.count} credits={gpaResult.credits} points={gpaResult.points} scale={scale} darkMode={darkMode} />
                <GradeProgressBar gpa={gpaResult.gpa} scale={scale} darkMode={darkMode} />
                {showTargetGPA && <TargetGPACalculator currentGPA={gpaResult.gpa} totalCredits={gpaResult.credits} darkMode={darkMode} />}
              </>
            )}
          </div>
        )}

        {tab === "cgpa" && (
          <div>
            <h2 style={{ fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", margin: "0 0 16px 0" }}>Semester GPAs</h2>
            <div className="semester-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(10px, 2vw, 14px)", marginBottom: 16 }}>
              {sems.map((s, i) => (
                <div key={s.id} style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: "clamp(16px, 3vw, 20px)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 600, color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)" }}>Semester {i + 1}</span>
                    {i >= 2 && <button onClick={() => removeSem(s.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, width: 26, height: 26, cursor: "pointer" }}>×</button>}
                  </div>
                  <input type="number" min="0" max={scale} step="0.01" placeholder="0.00" value={s.val} onChange={e => updateSem(s.id, e.target.value)} style={{ width: "100%", background: "transparent", border: "none", borderBottom: `2px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`, color: darkMode ? "#fff" : "#333", fontSize: "clamp(22px, 5vw, 26px)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, padding: "6px 0", outline: "none" }} />
                </div>
              ))}
            </div>
            {sems.length < 8 && <button onClick={addSem} style={{ width: "100%", padding: "clamp(11px, 2.5vw, 13px)", border: "2px dashed rgba(124,58,237,0.4)", borderRadius: 14, background: "transparent", color: "#a78bfa", fontSize: "clamp(14px, 3vw, 15px)", fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ fontSize: 22 }}>+</span> Add Semester</button>}
            <button onClick={calcCGPA} style={{ width: "100%", padding: "clamp(14px, 3vw, 17px)", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(16px, 3.5vw, 17px)", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)" }}>Calculate Cumulative CGPA</button>
            {cgpaErr && <div style={{ color: "#fca5a5", marginTop: 12 }}>⚠️ {cgpaErr}</div>}
            {cgpaResult && <CGPAResultCard cgpa={cgpaResult.cgpa} sems={cgpaResult.sems} total={cgpaResult.total} best={cgpaResult.best} scale={scale} darkMode={darkMode} />}
          </div>
        )}

        {tab === "calculator" && <CalculatorPanel darkMode={darkMode} />}
      </main>

      {/* Contact Section */}
      <div style={{ margin: "0 clamp(16px, 4vw, 24px)", padding: "clamp(28px, 5vw, 36px) 0 0", borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px, 6vw, 36px)", fontWeight: 700, background: darkMode ? "linear-gradient(135deg, #fff, #c4b5fd)" : "linear-gradient(135deg, #333, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>Get in Touch</h2>
        <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", marginBottom: 24 }}>Have questions or feedback? We'd love to hear from you.</p>

        {contactSent ? (
          <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "clamp(28px, 5vw, 36px)", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399" }}>Message Sent Successfully!</div>
            <button onClick={() => { setContactSent(false); setContact({ name: "", email: "", subject: "", message: "" }); }} style={{ marginTop: 24, padding: "12px 28px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12, color: "#34d399", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Send Another Message</button>
          </div>
        ) : (
          <div style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, padding: "clamp(24px, 4vw, 32px)" }}>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 18 }}>
              <input type="text" placeholder="Your name *" value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              <input type="email" placeholder="Email address *" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
            </div>
            <input type="text" placeholder="Subject" value={contact.subject} onChange={e => setContact(p => ({ ...p, subject: e.target.value }))} style={{ ...inputStyle, marginBottom: 18 }} />
            <textarea rows={5} placeholder="Write your message here... *" value={contact.message} onChange={e => setContact(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, minHeight: 120, marginBottom: 24 }} />
            {contactErr && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#fca5a5", marginBottom: 18 }}>⚠️ {contactErr}</div>}
            <button onClick={submitContact} disabled={isSending} style={{ width: "100%", padding: "clamp(14px, 3vw, 17px)", background: isSending ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(15px, 3.5vw, 17px)", fontWeight: 600, cursor: isSending ? "not-allowed" : "pointer", boxShadow: isSending ? "none" : "0 8px 20px rgba(124, 58, 237, 0.3)" }}>{isSending ? "Sending..." : "Send Message"}</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "clamp(28px, 5vw, 36px) clamp(16px, 4vw, 24px)", marginTop: "clamp(28px, 5vw, 36px)", borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <p style={{ margin: "0 0 8px 0", fontSize: "clamp(15px, 3.5vw, 17px)", fontFamily:'ui-sans-serif', color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>Crafted by <a href="https://usmanmurtaza.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>Usman Murtaza</a></p>
        <p style={{ margin: 0, fontSize: "clamp(11px, 2.5vw, 12px)", color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>Nexa Calculator v2.0 — Academic Excellence Suite</p>
      </footer>
    </div>
  );
}