import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import theme from "../constants/theme";
import { logEvent } from "../firebase/analytics";

// ── SVG Icons ──────────────────────────────────────────────────────────
const BackspaceIcon = () => (
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
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

// ── Button Layouts ────────────────────────────────────────────────────
const NORMAL_BUTTONS = [
  ["MC", "MR", "M+", "M-"],
  ["C", "⌫", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["00", "0", ".", "="],
];

const SCIENTIFIC_BUTTONS = [
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

// ── Scientific functions ──────────────────────────────────────────────
const SCI_FUNCTIONS = {
  sin: (x, mode) =>
    mode === "deg" ? Math.sin((x * Math.PI) / 180) : Math.sin(x),
  cos: (x, mode) =>
    mode === "deg" ? Math.cos((x * Math.PI) / 180) : Math.cos(x),
  tan: (x, mode) =>
    mode === "deg" ? Math.tan((x * Math.PI) / 180) : Math.tan(x),
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  "√": Math.sqrt,
  "∛": Math.cbrt,
  "x²": (x) => Math.pow(x, 2),
  "x³": (x) => Math.pow(x, 3),
  "10ˣ": (x) => Math.pow(10, x),
  log: Math.log10,
  ln: Math.log,
  "|x|": Math.abs,
  "±": (x) => -x,
  "1/x": (x) => 1 / x,
};

export default function CalculatorPanel({ darkMode: _deprecatedDarkMode }) {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");
  const containerRef = useRef(null);

  // ── Keyboard Support ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      const key = e.key;

      if (key === "Enter") {
        e.preventDefault();
        if (mode === "normal") handleNormalClick("=");
        else handleScientific("=");
      } else if (key === "Escape") {
        setInput("");
        setResult("0");
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (/^[0-9.]$/.test(key)) {
        setInput((prev) => prev + key);
      } else if (key === "+") setInput((prev) => prev + "+");
      else if (key === "-") setInput((prev) => prev + "-");
      else if (key === "*") setInput((prev) => prev + "*");
      else if (key === "/") setInput((prev) => prev + "/");
      else if (key === "(") setInput((prev) => prev + "(");
      else if (key === ")") setInput((prev) => prev + ")");
      else if (key === "%") setInput((prev) => prev + "%");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, input]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleNormalClick = useCallback(
    (value) => {
      if (value === "C") {
        setInput("");
        setResult("0");
      } else if (value === "⌫") {
        setInput((prev) => prev.slice(0, -1));
      } else if (value === "=") {
        try {
          const safe = input.replace(/[^0-9+\-*/%.()]/g, "");
          const evalResult = Function('"use strict";return (' + safe + ")")();
          const res =
            typeof evalResult === "number" ? evalResult.toString() : "Error";
          setResult(res);
          setHistory((prev) => [`${input} = ${res}`, ...prev.slice(0, 4)]);
          setInput(res);
          logEvent("calculator_operation", {
            operation: "evaluate",
            expression: input,
          });
        } catch {
          setResult("Error");
          setInput("");
        }
      } else {
        setInput((prev) => prev + value);
      }
    },
    [input],
  );

  const handleMemory = useCallback(
    (action) => {
      const current = parseFloat(result) || 0;
      switch (action) {
        case "MC":
          setMemory(0);
          break;
        case "MR":
          setInput((prev) => prev + memory.toString());
          break;
        case "M+":
          setMemory((m) => m + current);
          break;
        case "M-":
          setMemory((m) => m - current);
          break;
      }
      logEvent("calculator_memory", { action });
    },
    [result, memory],
  );

  const handleScientific = useCallback(
    (func) => {
      if (func === "π") {
        setInput((prev) => prev + "π");
        return;
      }
      if (func === "e") {
        setInput((prev) => prev + "e");
        return;
      }
      if (func === "xʸ") {
        setInput((prev) => prev + "**");
        return;
      }
      if (func === "(" || func === ")") {
        setInput((prev) => prev + func);
        return;
      }

      const current = parseFloat(input) || 0;
      let res;
      try {
        if (func === "n!") {
          if (current < 0 || !Number.isInteger(current)) {
            res = NaN;
          } else {
            res = 1;
            for (let i = 2; i <= current; i++) res *= i;
          }
        } else {
          const fn = SCI_FUNCTIONS[func];
          if (fn) {
            res = fn(current, angleMode);
          } else {
            return;
          }
        }

        const resStr = res.toString();
        setResult(resStr);
        setInput(resStr);
        setHistory((prev) => [
          `${func}(${current}) = ${resStr}`,
          ...prev.slice(0, 4),
        ]);
        logEvent("calculator_scientific", { func });
      } catch {
        setResult("Error");
        setInput("");
      }
    },
    [input, angleMode],
  );

  const handleButtonClick = useCallback(
    (btn) => {
      if (["MC", "MR", "M+", "M-"].includes(btn)) {
        handleMemory(btn);
      } else if (mode === "normal") {
        handleNormalClick(btn);
      } else {
        if (
          Object.keys(SCI_FUNCTIONS).includes(btn) ||
          ["π", "e", "xʸ", "(", ")", "n!"].includes(btn)
        ) {
          handleScientific(btn);
        } else {
          handleNormalClick(btn);
        }
      }
    },
    [mode, handleMemory, handleNormalClick, handleScientific],
  );

  // ── Styles (dark‑only) ──────────────────────────────────────────────
  const displayContainerStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, rgba(30,20,60,0.6), rgba(15,12,35,0.7))",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 20,
      padding: "clamp(18px, 5vw, 24px)",
      border: "1px solid rgba(255,255,255,0.1)",
      marginBottom: 18,
      boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
      minHeight: 90,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }),
    [],
  );

  const expressionStyle = useMemo(
    () => ({
      fontSize: "clamp(12px, 3vw, 14px)",
      color: "rgba(255,255,255,0.45)",
      fontFamily: theme.fonts.mono,
      minHeight: 22,
      wordBreak: "break-all",
      textAlign: "right",
    }),
    [],
  );

  const resultStyle = useMemo(
    () => ({
      fontSize: "clamp(28px, 6vw, 40px)",
      fontWeight: 600,
      color: "#f1f0ff",
      fontFamily: theme.fonts.mono,
      letterSpacing: "-0.5px",
      wordBreak: "break-all",
      textAlign: "right",
      lineHeight: 1.2,
      marginTop: 4,
    }),
    [],
  );

  const modeButtonStyle = useCallback(
    (active) => ({
      flex: 1,
      padding: "10px 0",
      background: active
        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
        : "transparent",
      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      color: "#fff",
      fontSize: "clamp(12px, 3vw, 13px)",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: theme.fonts.body,
      textTransform: "capitalize",
      letterSpacing: "0.02em",
      transition: "all 0.2s ease",
      boxShadow: active ? "0 8px 18px rgba(124,58,237,0.3)" : "none",
    }),
    [],
  );

  const buttonStyleMap = useRef({});
  const getButtonStyle = useCallback((btn) => {
    const key = btn;
    if (!buttonStyleMap.current[key]) {
      buttonStyleMap.current[key] = {
        padding: "clamp(10px, 3vw, 14px) 4px",
        background: ["C", "="].includes(btn)
          ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
          : ["MC", "MR", "M+", "M-"].includes(btn)
            ? "rgba(167,139,250,0.18)"
            : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        color: ["C", "="].includes(btn) ? "#fff" : "#f1f0ff",
        fontSize: "clamp(13px, 3.5vw, 16px)",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: /\d/.test(btn) ? theme.fonts.mono : theme.fonts.body,
        transition: "all 0.15s ease",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      };
    }
    return buttonStyleMap.current[key];
  }, []);

  const hoverEnter = useCallback((e, btn) => {
    if (!["C", "="].includes(btn)) {
      e.currentTarget.style.background = "rgba(124,58,237,0.25)";
      e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
    }
  }, []);

  const hoverLeave = useCallback((e, btn) => {
    if (!["C", "="].includes(btn)) {
      e.currentTarget.style.background = ["MC", "MR", "M+", "M-"].includes(btn)
        ? "rgba(167,139,250,0.18)"
        : "rgba(255,255,255,0.06)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    }
  }, []);

  const buttonsToRender =
    mode === "normal" ? NORMAL_BUTTONS : SCIENTIFIC_BUTTONS;

  return (
    <div
      ref={containerRef}
      className="animate-fade-up"
      style={{
        maxWidth: 500,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Angle Mode Toggle (Scientific Only) */}
      {mode === "scientific" && (
        <div
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
          role="radiogroup"
          aria-label="Angle unit"
        >
          {["deg", "rad"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setAngleMode(m);
                logEvent("calculator_angle_mode", { mode: m });
              }}
              role="radio"
              aria-checked={angleMode === m}
              style={{
                flex: 1,
                padding: "8px 0",
                background:
                  angleMode === m
                    ? "rgba(124,58,237,0.25)"
                    : "rgba(255,255,255,0.04)",
                border:
                  angleMode === m
                    ? "1px solid #7c3aed"
                    : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "all 0.2s ease",
                backdropFilter: "blur(6px)",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Memory Indicator */}
      {memory !== 0 && (
        <div
          style={{
            fontSize: 11,
            color: "#a78bfa",
            marginBottom: 8,
            fontFamily: theme.fonts.mono,
            fontWeight: 500,
            background: "rgba(167,139,250,0.1)",
            padding: "4px 10px",
            borderRadius: 20,
            display: "inline-block",
            backdropFilter: "blur(4px)",
          }}
        >
          M: {memory}
        </div>
      )}

      {/* Display */}
      <div style={displayContainerStyle} aria-live="polite" aria-atomic="true">
        <div aria-label="Expression" style={expressionStyle}>
          {input || "0"}
        </div>
        <div style={resultStyle}>{result}</div>
      </div>

      {/* Mode Switcher */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 18 }}
        role="tablist"
        aria-label="Calculator mode"
      >
        {["normal", "scientific"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              logEvent("calculator_mode_switch", { mode: m });
            }}
            role="tab"
            aria-selected={mode === m}
            style={modeButtonStyle(mode === m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Button Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(6px, 2vw, 10px)",
        }}
        role="group"
        aria-label={`${mode === "normal" ? "Standard" : "Scientific"} calculator buttons`}
      >
        {buttonsToRender.map((row, i) =>
          row.map((btn, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleButtonClick(btn)}
              style={getButtonStyle(btn)}
              onMouseEnter={(e) => hoverEnter(e, btn)}
              onMouseLeave={(e) => hoverLeave(e, btn)}
              aria-label={btn === "⌫" ? "backspace" : btn}
            >
              {btn === "⌫" ? <BackspaceIcon /> : btn}
            </button>
          )),
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            animation: "fadeUp 0.4s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Recent
            </div>
            <button
              onClick={() => setHistory([])}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 500,
              }}
              aria-label="Clear history"
            >
              Clear
            </button>
          </div>
          {history.map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: "clamp(11px, 2.5vw, 13px)",
                color: "rgba(255,255,255,0.5)",
                fontFamily: theme.fonts.mono,
                padding: "5px 0",
                wordBreak: "break-all",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
