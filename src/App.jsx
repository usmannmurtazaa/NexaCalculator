import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

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

function getStanding(g) {
  if (g >= 3.7) return { t: "Dean's List — Exceptional", color: "#a78bfa" };
  if (g >= 3.0) return { t: "Very Good Standing", color: "#34d399" };
  if (g >= 2.5) return { t: "Good Standing", color: "#60a5fa" };
  if (g >= 2.0) return { t: "Satisfactory", color: "#fbbf24" };
  if (g >= 1.0) return { t: "Below Average", color: "#f87171" };
  return { t: "Academic Probation", color: "#ef4444" };
}

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = 0;
    const end = parseFloat(value);
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

function CourseCard({ id, index, removable, onRemove, data, onChange }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 20px 16px", position: "relative",
      transition: "border-color 0.2s, transform 0.2s", marginBottom: 12,
      animation: "slideIn 0.25s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
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
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Course Code</div>
          <input
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. HUM-121"
            onChange={e => onChange(id, "code", e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace", outline: "none", transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#7c3aed"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Credits</div>
          <select
            value={data.credits}
            onChange={e => onChange(id, "credits", parseInt(e.target.value))}
            style={{
              width: "100%", background: "#1a1035", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "9px 8px", color: "#fff", fontSize: 14, outline: "none", cursor: "pointer"
            }}
          >
            {[1, 2, 3, 4].map(c => <option key={c} value={c}>{c} cr</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Grade</div>
        <select
          value={data.gradeIdx}
          onChange={e => onChange(id, "gradeIdx", parseInt(e.target.value))}
          style={{
            width: "100%", background: "#1a1035", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace", outline: "none", cursor: "pointer"
          }}
        >
          {GRADES.map((g, i) => <option key={i} value={i}>{g.l}</option>)}
        </select>
      </div>
    </div>
  );
}

function ResultCard({ gpa, courses, credits, points }) {
  const s = getStanding(parseFloat(gpa));
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden", border: "1px solid rgba(167,139,250,0.25)",
      marginTop: 20, animation: "fadeUp 0.4s ease"
    }}>
      <div style={{ background: "linear-gradient(135deg,#0f0829 0%,#1a0f3a 100%)", padding: "32px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Semester GPA</div>
        <div style={{ fontSize: "clamp(48px, 15vw, 68px)", fontWeight: 700, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: -2 }}>
          <AnimatedNumber value={gpa} />
        </div>
        <div style={{ marginTop: 12, display: "inline-block", padding: "5px 16px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: `1px solid ${s.color}33`, color: s.color, fontSize: 12, fontWeight: 500 }}>
          {s.t}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[["Courses", courses, ""], ["Credit hrs", credits, ""], ["Quality pts", points, ".2f"]].map(([k, v, fmt], i) => (
          <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: "#e2d9f3", fontFamily: "'JetBrains Mono',monospace" }}>{fmt ? parseFloat(v).toFixed(2) : v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CGPAResultCard({ cgpa, sems, total, best }) {
  const s = getStanding(parseFloat(cgpa));
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(167,139,250,0.25)", marginTop: 20, animation: "fadeUp 0.4s ease" }}>
      <div style={{ background: "linear-gradient(135deg,#0f0829,#1a0f3a)", padding: "32px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Cumulative CGPA</div>
        <div style={{ fontSize: "clamp(48px, 15vw, 68px)", fontWeight: 700, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: -2 }}>
          <AnimatedNumber value={cgpa} />
        </div>
        <div style={{ marginTop: 12, display: "inline-block", padding: "5px 16px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: `1px solid ${s.color}33`, color: s.color, fontSize: 12, fontWeight: 500 }}>
          {s.t}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[["Semesters", sems, false], ["GPA sum", total, true], ["Best sem", best, true]].map(([k, v, fmt], i) => (
          <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: "#e2d9f3", fontFamily: "'JetBrains Mono',monospace" }}>{fmt ? parseFloat(v).toFixed(2) : v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradeProgressBar({ gpa }) {
  const pct = Math.min((parseFloat(gpa) / 4) * 100, 100);
  return (
    <div style={{ marginTop: 16, padding: "0 2px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: 0.5 }}>
        <span>0.00</span><span>2.00</span><span>3.00</span><span>4.00</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 8, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>
    </div>
  );
}

// ---------- Calculator Component ----------
function CalculatorPanel() {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);

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

  const handleScientific = (func) => {
    const current = parseFloat(input) || 0;
    let res;
    try {
      switch (func) {
        case "sin": res = Math.sin(current * Math.PI / 180); break;
        case "cos": res = Math.cos(current * Math.PI / 180); break;
        case "tan": res = Math.tan(current * Math.PI / 180); break;
        case "√": res = Math.sqrt(current); break;
        case "x²": res = Math.pow(current, 2); break;
        case "log": res = Math.log10(current); break;
        case "ln": res = Math.log(current); break;
        case "π": res = Math.PI; break;
        case "e": res = Math.E; break;
        case "(": setInput(prev => prev + "("); return;
        case ")": setInput(prev => prev + ")"); return;
        default: return;
      }
      const resStr = res.toString();
      setResult(resStr);
      setInput(resStr);
      setHistory(prev => [`${func}(${current}) = ${resStr}`, ...prev.slice(0, 4)]);
    } catch { setResult("Error"); setInput(""); }
  };

  const normalButtons = [
    ["C", "⌫", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "("],
    ["√", "x²", "log", ")"],
    ["ln", "π", "e", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["C", "0", ".", "="],
  ];

  return (
    <div>
      {/* Display */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: "clamp(16px, 4vw, 20px) clamp(14px, 3vw, 18px)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 18 }}>
        <div style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace", minHeight: 22, wordBreak: "break-all" }}>
          {input || "0"}
        </div>
        <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 600, color: "#fff", fontFamily: "'JetBrains Mono', monospace", letterSpacing: -1, wordBreak: "break-all" }}>
          {result}
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["normal", "scientific"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "clamp(8px, 2vw, 10px)", background: mode === m ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,0.03)",
            border: mode === m ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 500,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textTransform: "capitalize"
          }}>{m}</button>
        ))}
      </div>

      {/* Buttons Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(6px, 2vw, 8px)" }}>
        {(mode === "normal" ? normalButtons : scientificButtons).map((row, i) =>
          row.map((btn, j) => (
            <button key={`${i}-${j}`} onClick={() => {
              if (mode === "normal") handleNormalClick(btn);
              else {
                if (["sin", "cos", "tan", "√", "x²", "log", "ln", "π", "e", "(", ")"].includes(btn)) {
                  if (btn === "π" || btn === "e") { setInput(prev => prev + btn); }
                  else handleScientific(btn);
                } else handleNormalClick(btn);
              }
            }} style={{
              padding: "clamp(10px, 3vw, 14px) 0", background: ["C", "="].includes(btn) ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff", fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 500,
              cursor: "pointer", fontFamily: btn.match(/[0-9]/) ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
              transition: "all 0.15s", gridColumn: btn === "=" ? "span 1" : "auto"
            }}
              onMouseEnter={e => { if (!["C", "="].includes(btn)) e.currentTarget.style.background = "rgba(124,58,237,0.25)"; }}
              onMouseLeave={e => { if (!["C", "="].includes(btn)) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >{btn}</button>
          ))
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Recent</div>
          {history.map((h, i) => (
            <div key={i} style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", padding: "4px 0", wordBreak: "break-all" }}>{h}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [tab, setTab] = useState("gpa");
  const [visitors, setVisitors] = useState(1312);
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

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.6) setVisitors(v => v + Math.floor(Math.random() * 2) + 1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const addCourse = () => {
    if (courses.length >= 6) return;
    setCourses(prev => [...prev, { id: nextCId, code: "", credits: 3, gradeIdx: 0 }]);
    setNextCId(n => n + 1);
  };
  const removeCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setGpaResult(null);
  };
  const updateCourse = (id, field, val) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const calcGPA = () => {
    setGpaErr("");
    if (courses.length === 0) { setGpaErr("Add at least one course."); return; }
    for (const c of courses) {
      if (!c.code.trim()) { setGpaErr("Please fill in all course codes."); return; }
    }
    let tp = 0, tc = 0;
    for (const c of courses) {
      tp += GRADES[c.gradeIdx].p * c.credits;
      tc += c.credits;
    }
    const gpa = tc ? tp / tc : 0;
    setGpaResult({ gpa: gpa.toFixed(2), count: courses.length, credits: tc, points: tp });
  };

  const addSem = () => {
    if (sems.length >= 6) return;
    setSems(prev => [...prev, { id: nextSId, val: "" }]);
    setNextSId(n => n + 1);
  };
  const removeSem = (id) => {
    setSems(prev => prev.filter(s => s.id !== id));
    setCgpaResult(null);
  };
  const updateSem = (id, val) => setSems(prev => prev.map(s => s.id === id ? { ...s, val } : s));

  const calcCGPA = () => {
    setCgpaErr("");
    let total = 0, count = 0, best = 0;
    for (const s of sems) {
      if (s.val === "") continue;
      const n = parseFloat(s.val);
      if (isNaN(n) || n < 0 || n > 4) { setCgpaErr("Enter valid GPA values (0.00 – 4.00)."); return; }
      total += n; count++; if (n > best) best = n;
    }
    if (!count) { setCgpaErr("Please enter at least one semester GPA."); return; }
    setCgpaResult({ cgpa: (total / count).toFixed(2), sems: count, total: total.toFixed(2), best: best.toFixed(2) });
  };

  const submitContact = () => {
    setContactErr("");
    if (!contact.name.trim() || !contact.email.trim() || !contact.message.trim()) {
      setContactErr("Please fill in all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(contact.email)) {
      setContactErr("Please enter a valid email address.");
      return;
    }
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setContactSent(true);
        setContactErr("");
        setContact({ name: "", email: "", subject: "", message: "" });
      })
      .catch((err) => {
        console.error(err);
        setContactErr("Failed to send message. Try again.");
      });
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s", display: "block"
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080617", color: "#fff", minHeight: "100vh" }}>
      {/* SEO Meta (invisible, but helps search engines) */}
      <div style={{ display: "none" }}>
        <h1>GPA & CGPA Calculator with Scientific Calculator</h1>
        <p>Free online GPA calculator, CGPA calculator, and scientific calculator. Track academic performance and do advanced math.</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        * { box-sizing:border-box; }
        select option { background:#1a1035; color:#fff; }
        input::placeholder { color:rgba(255,255,255,0.2); }
        textarea::placeholder { color:rgba(255,255,255,0.2); }
        textarea { resize:vertical; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#7c3aed44; border-radius:4px; }
        
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
          .tab-buttons {
            justify-content: space-around;
          }
        }
        
        @media (max-width: 480px) {
          .semester-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .visitor-badge {
            align-self: flex-start;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#0f0829 0%,#080617 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) 0" }}>
        <div className="header-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(14px, 3vw, 18px) 0 0" }}>
          <div>
            <div style={{ 
              fontFamily: "'Poppins', serif", 
              fontSize: "clamp(20px, 5vw, 28px)", 
              fontWeight: 800, 
              letterSpacing: "-0.01em",
              background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease infinite",
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(167, 139, 250, 0.3)",
              marginBottom: "4px"
            }}>
              Nexa Calculator
            </div>
            <div style={{ 
              fontSize: "clamp(10px, 2.5vw, 12px)", 
              color: "rgba(255,255,255,0.4)", 
              letterSpacing: "0.15em", 
              textTransform: "uppercase", 
              marginTop: 2,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Academic Excellence Suite • GPA • CGPA • Scientific
            </div>
          </div>
          <div className="visitor-badge" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            background: "rgba(124,58,237,0.15)", 
            border: "1px solid rgba(124,58,237,0.3)", 
            borderRadius: 30, 
            padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(124, 58, 237, 0.2)"
          }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: "50%", 
              background: "#a78bfa", 
              animation: "pulse 2s infinite",
              boxShadow: "0 0 15px #a78bfa"
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 600, color: "#c4b5fd" }}>{visitors.toLocaleString()}</span>
            <span style={{ fontSize: "clamp(9px, 2vw, 11px)", color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, fontWeight: 400 }}>active users</span>
          </div>
        </div>

        <div className="tab-buttons" style={{ display: "flex", gap: "clamp(8px, 2vw, 16px)", marginTop: "clamp(16px, 4vw, 24px)", flexWrap: "wrap" }}>
          {["gpa", "cgpa", "calculator"].map((t, i) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)", 
              fontSize: "clamp(13px, 3vw, 15px)", 
              fontWeight: 600, 
              cursor: "pointer",
              background: tab === t ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))" : "transparent", 
              border: "none", 
              borderBottom: tab === t ? "3px solid #7c3aed" : "3px solid transparent",
              color: tab === t ? "#fff" : "rgba(255,255,255,0.4)", 
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "'DM Sans', sans-serif", 
              letterSpacing: "0.02em", 
              textTransform: "capitalize",
              borderRadius: "8px 8px 0 0",
              position: "relative",
              top: tab === t ? "0px" : "2px"
            }}
            onMouseEnter={e => { if (tab !== t) e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            onMouseLeave={e => { if (tab !== t) e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              {t === "gpa" ? "📊 Semester GPA" : t === "cgpa" ? "📈 Cumulative CGPA" : "🔢 Scientific Calculator"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 0" }}>
        {tab === "gpa" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Current Courses & Grades</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#7c3aed", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                {courses.length} / 6 courses
              </div>
            </div>

            {courses.map((c, i) => (
              <CourseCard key={c.id} id={c.id} index={i} removable={i >= 3} onRemove={removeCourse} data={c} onChange={updateCourse} />
            ))}

            {courses.length < 6 && (
              <button onClick={addCourse} style={{
                width: "100%", padding: "clamp(10px, 2.5vw, 12px)", border: "2px dashed rgba(124,58,237,0.4)",
                borderRadius: 14, background: "transparent", color: "#a78bfa", fontSize: "clamp(13px, 3vw, 14px)",
                fontWeight: 600, cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans',sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Add New Course
              </button>
            )}

            <button onClick={calcGPA} style={{
              width: "100%", padding: "clamp(13px, 3vw, 16px)", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(15px, 3.5vw, 16px)", fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5, transition: "all 0.3s",
              boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(124, 58, 237, 0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.3)"; }}
            >
              Calculate Semester GPA
            </button>

            {gpaErr && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#fca5a5", marginTop: 12, animation: "slideIn 0.3s ease" }}>
                ⚠️ {gpaErr}
              </div>
            )}

            {gpaResult && (
              <>
                <ResultCard gpa={gpaResult.gpa} courses={gpaResult.count} credits={gpaResult.credits} points={gpaResult.points} />
                <GradeProgressBar gpa={gpaResult.gpa} />
              </>
            )}
          </div>
        )}

        {tab === "cgpa" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Semester GPAs</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#7c3aed", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                {sems.length} / 6 semesters
              </div>
            </div>

            <div className="semester-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(8px, 2vw, 12px)", marginBottom: 16 }}>
              {sems.map((s, i) => (
                <div key={s.id} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "clamp(14px, 3vw, 18px) clamp(12px, 3vw, 16px)", position: "relative", animation: "slideIn 0.25s ease",
                  transition: "all 0.3s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Semester {i + 1}</div>
                    {i >= 2 && (
                      <button onClick={() => removeSem(s.id)} style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171", borderRadius: 8, width: 24, height: 24, cursor: "pointer",
                        fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                      >×</button>
                    )}
                  </div>
                  <input
                    type="number" min="0" max="4" step="0.01" placeholder="0.00"
                    value={s.val}
                    onChange={e => updateSem(s.id, e.target.value)}
                    style={{
                      width: "100%", background: "transparent", border: "none",
                      borderBottom: "2px solid rgba(255,255,255,0.15)", color: "#fff",
                      fontSize: "clamp(20px, 5vw, 24px)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600,
                      padding: "6px 0", outline: "none", transition: "border-color 0.3s"
                    }}
                    onFocus={e => e.target.style.borderBottomColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.15)"}
                  />
                </div>
              ))}
            </div>

            {sems.length < 6 && (
              <button onClick={addSem} style={{
                width: "100%", padding: "clamp(10px, 2.5vw, 12px)", border: "2px dashed rgba(124,58,237,0.4)",
                borderRadius: 14, background: "transparent", color: "#a78bfa", fontSize: "clamp(13px, 3vw, 14px)",
                fontWeight: 600, cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans',sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Add Semester
              </button>
            )}

            <button onClick={calcCGPA} style={{
              width: "100%", padding: "clamp(13px, 3vw, 16px)", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(15px, 3.5vw, 16px)", fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5, transition: "all 0.3s",
              boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(124, 58, 237, 0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.3)"; }}
            >
              Calculate Cumulative CGPA
            </button>

            {cgpaErr && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#fca5a5", marginTop: 12, animation: "slideIn 0.3s ease" }}>
                ⚠️ {cgpaErr}
              </div>
            )}

            {cgpaResult && <CGPAResultCard cgpa={cgpaResult.cgpa} sems={cgpaResult.sems} total={cgpaResult.total} best={cgpaResult.best} />}
          </div>
        )}

        {tab === "calculator" && <CalculatorPanel />}
      </div>

      {/* Contact Us */}
      <div style={{ margin: "0 clamp(16px, 4vw, 24px)", padding: "clamp(24px, 5vw, 32px) 0 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
          <div style={{ 
            fontFamily: "'Playfair Display',serif", 
            fontSize: "clamp(24px, 6vw, 32px)", 
            fontWeight: 700, 
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #fff, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>Get in Touch</div>
          <div style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Have questions or feedback? We'd love to hear from you.</div>
        </div>

        {contactSent ? (
          <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "clamp(24px, 5vw, 32px)", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "clamp(36px, 8vw, 48px)", marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, color: "#34d399" }}>Message Sent Successfully!</div>
            <div style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "rgba(255,255,255,0.5)", marginTop: 8 }}>We'll get back to you as soon as possible.</div>
            <button onClick={() => { setContactSent(false); setContact({ name: "", email: "", subject: "", message: "" }); }} style={{
              marginTop: 20, padding: "10px 24px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 12, color: "#34d399", fontSize: "clamp(13px, 3vw, 14px)", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; }}
            >Send Another Message</button>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(20px, 4vw, 28px)" }}>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(12px, 3vw, 16px)", marginBottom: 16 }}>
              {[["name", "Your name", "text"], ["email", "Email address", "email"]].map(([field, ph, type]) => (
                <div key={field}>
                  <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>{ph} <span style={{ color: "#7c3aed" }}>*</span></div>
                  <input type={type} placeholder={`Enter your ${ph.toLowerCase()}`} value={contact[field]}
                    onChange={e => setContact(p => ({ ...p, [field]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Subject</div>
              <input type="text" placeholder="What's this about?" value={contact.subject}
                onChange={e => setContact(p => ({ ...p, subject: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Message <span style={{ color: "#7c3aed" }}>*</span></div>
              <textarea rows={4} placeholder="Write your message here..." value={contact.message}
                onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                style={{ ...inputStyle, minHeight: 120 }}
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>

            {contactErr && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#fca5a5", marginBottom: 16, animation: "slideIn 0.3s ease" }}>
                ⚠️ {contactErr}
              </div>
            )}

            <button onClick={submitContact} style={{
              width: "100%", padding: "clamp(13px, 3vw, 16px)", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff", border: "none", borderRadius: 14, fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5, transition: "all 0.3s",
              boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(124, 58, 237, 0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.3)"; }}
            >
              Send Message
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "clamp(24px, 5vw, 32px) clamp(16px, 4vw, 24px) clamp(20px, 4vw, 28px)", marginTop: "clamp(24px, 5vw, 32px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(14px, 3.5vw, 16px)", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
          Crafted by{" "}
          <a
            href="https://usmanmurtaza.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#a78bfa",
              fontWeight: 800,
              textDecoration: "none",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => { e.currentTarget.style.Color = "#a78bfa"; }}
            onMouseLeave={e => { e.currentTarget.style.Color = "rgba(167, 139, 250, 0.3)"; }}
          >
            Usman Murtaza
          </a>
        </div>
        <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>
          Nexa Calculator — Academic Excellence Suite
        </div>
      </div>
    </div>
  );
}