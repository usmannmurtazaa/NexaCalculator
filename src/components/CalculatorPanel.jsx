import { useState, useCallback } from 'react';
import theme from '../constants/theme';

export default function CalculatorPanel({ darkMode }) {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");

  const handleNormalClick = useCallback(
    (value) => {
      if (value === "C") {
        setInput("");
        setResult("0");
      } else if (value === "⌫") {
        setInput(prev => prev.slice(0, -1));
      } else if (value === "=") {
        try {
          const evalResult = Function('"use strict";return (' + input + ')')();
          const res = typeof evalResult === "number" ? evalResult.toString() : "Error";
          setResult(res);
          setHistory(prev => [`${input} = ${res}`, ...prev.slice(0, 4)]);
          setInput(res);
        } catch {
          setResult("Error");
          setInput("");
        }
      } else {
        setInput(prev => prev + value);
      }
    },
    [input]
  );

  const handleMemory = useCallback(
    (action) => {
      const current = parseFloat(result) || 0;
      switch (action) {
        case "MC":
          setMemory(0);
          break;
        case "MR":
          setInput(prev => prev + memory.toString());
          break;
        case "M+":
          setMemory(m => m + current);
          break;
        case "M-":
          setMemory(m => m - current);
          break;
      }
    },
    [result, memory]
  );

  const handleScientific = useCallback(
    (func) => {
      const current = parseFloat(input) || 0;
      let res;
      try {
        switch (func) {
          case "sin":
            res = angleMode === "deg" ? Math.sin((current * Math.PI) / 180) : Math.sin(current);
            break;
          case "cos":
            res = angleMode === "deg" ? Math.cos((current * Math.PI) / 180) : Math.cos(current);
            break;
          case "tan":
            res = angleMode === "deg" ? Math.tan((current * Math.PI) / 180) : Math.tan(current);
            break;
          case "asin":
            res = Math.asin(current);
            break;
          case "acos":
            res = Math.acos(current);
            break;
          case "atan":
            res = Math.atan(current);
            break;
          case "√":
            res = Math.sqrt(current);
            break;
          case "∛":
            res = Math.cbrt(current);
            break;
          case "x²":
            res = Math.pow(current, 2);
            break;
          case "x³":
            res = Math.pow(current, 3);
            break;
          case "xʸ":
            setInput(prev => prev + "**");
            return;
          case "10ˣ":
            res = Math.pow(10, current);
            break;
          case "log":
            res = Math.log10(current);
            break;
          case "ln":
            res = Math.log(current);
            break;
          case "π":
            res = Math.PI;
            setInput(prev => prev + "π");
            return;
          case "e":
            res = Math.E;
            setInput(prev => prev + "e");
            return;
          case "|x|":
            res = Math.abs(current);
            break;
          case "±":
            res = -current;
            break;
          case "1/x":
            res = 1 / current;
            break;
          case "n!":
            if (current < 0 || !Number.isInteger(current)) {
              res = NaN;
              break;
            }
            res = 1;
            for (let i = 2; i <= current; i++) res *= i;
            break;
          case "(":
            setInput(prev => prev + "(");
            return;
          case ")":
            setInput(prev => prev + ")");
            return;
          default:
            return;
        }
        const resStr = res.toString();
        setResult(resStr);
        setInput(resStr);
        setHistory(prev => [`${func}(${current}) = ${resStr}`, ...prev.slice(0, 4)]);
      } catch {
        setResult("Error");
        setInput("");
      }
    },
    [input, angleMode]
  );

  const isDark = darkMode;

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

  const buttonsToRender = mode === "normal" ? normalButtons : scientificButtons;

  return (
    <div>
      {mode === "scientific" && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {["deg", "rad"].map(m => (
            <button
              key={m}
              onClick={() => setAngleMode(m)}
              style={{
                flex: 1,
                padding: '6px',
                background:
                  angleMode === m
                    ? 'rgba(124,58,237,0.2)'
                    : isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.03)',
                border:
                  angleMode === m
                    ? '1px solid #7c3aed'
                    : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 8,
                color: isDark ? '#fff' : '#333',
                fontSize: 12,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {memory !== 0 && (
        <div
          style={{
            fontSize: 11,
            color: '#a78bfa',
            marginBottom: 8,
            fontFamily: theme.fonts.mono,
          }}
        >
          M: {memory}
        </div>
      )}

      <div
        style={{
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
          borderRadius: 16,
          padding: 'clamp(16px, 4vw, 20px) clamp(14px, 3vw, 18px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
            fontFamily: theme.fonts.mono,
            minHeight: 22,
            wordBreak: 'break-all',
          }}
        >
          {input || "0"}
        </div>
        <div
          style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 600,
            color: isDark ? '#fff' : '#333',
            fontFamily: theme.fonts.mono,
            letterSpacing: -1,
            wordBreak: 'break-all',
          }}
        >
          {result}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {["normal", "scientific"].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: 'clamp(8px, 2vw, 10px)',
              background:
                mode === m
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                  : isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.03)',
              border:
                mode === m
                  ? 'none'
                  : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 10,
              color: '#fff',
              fontSize: 'clamp(12px, 3vw, 13px)',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(6px, 2vw, 8px)',
        }}
      >
        {buttonsToRender.map((row, i) =>
          row.map((btn, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => {
                if (["MC", "MR", "M+", "M-"].includes(btn)) handleMemory(btn);
                else if (mode === "normal") handleNormalClick(btn);
                else {
                  if (
                    [
                      "sin","cos","tan","asin","acos","atan",
                      "√","∛","x²","x³","10ˣ","log","ln",
                      "|x|","±","1/x","n!","(",")",
                    ].includes(btn)
                  ) {
                    if (btn === "π" || btn === "e") {
                      setInput(prev => prev + btn);
                    } else {
                      handleScientific(btn);
                    }
                  } else {
                    handleNormalClick(btn);
                  }
                }
              }}
              style={{
                padding: 'clamp(10px, 3vw, 14px) 0',
                background:
                  ["C", "="].includes(btn)
                    ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                    : ["MC", "MR", "M+", "M-"].includes(btn)
                    ? 'rgba(167,139,250,0.15)'
                    : isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 12,
                color: isDark ? '#fff' : '#333',
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: /\d/.test(btn) ? theme.fonts.mono : theme.fonts.body,
                transition: 'all 0.15s',
                gridColumn: btn === "=" ? 'span 1' : 'auto',
              }}
              onMouseEnter={e => {
                if (!["C", "="].includes(btn)) {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.25)';
                }
              }}
              onMouseLeave={e => {
                if (!["C", "="].includes(btn)) {
                  e.currentTarget.style.background = ["MC", "MR", "M+", "M-"].includes(btn)
                    ? 'rgba(167,139,250,0.15)'
                    : isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)';
                }
              }}
            >
              {btn}
            </button>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Recent
            </div>
            <button
              onClick={() => setHistory([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          {history.map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: 'clamp(11px, 2.5vw, 13px)',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                fontFamily: theme.fonts.mono,
                padding: '4px 0',
                wordBreak: 'break-all',
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