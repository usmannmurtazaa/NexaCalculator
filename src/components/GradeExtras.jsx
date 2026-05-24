import { useState, useCallback } from 'react';

/**
 * GradeProgressBar – Animated progress bar showing GPA relative to scale.
 * Includes markers, percentage label, and smooth glow effects.
 */
export function GradeProgressBar({ gpa, scale, darkMode }) {
  const max = parseFloat(scale);
  const numericGpa = parseFloat(gpa) || 0;
  const pct = Math.min((numericGpa / max) * 100, 100);
  const markers = [0, max * 0.5, max * 0.75, max];
  const subCol = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const isHigh = pct >= 70;
  const isMedium = pct >= 40;

  return (
    <div
      role="progressbar"
      aria-valuenow={numericGpa}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`GPA progress: ${numericGpa.toFixed(2)} out of ${max}`}
      style={{
        marginTop: 24,
        padding: '0 4px',
        width: '100%',
      }}
    >
      {/* Percentage label */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: subCol,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Progress
        </div>
        <div style={{
          fontSize: 'clamp(11px, 2vw, 13px)',
          fontWeight: 700,
          color: isHigh ? '#10b981' : isMedium ? '#f59e0b' : '#ef4444',
        }}>
          {numericGpa.toFixed(2)} / {max} ({pct.toFixed(0)}%)
        </div>
      </div>

      {/* Markers */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: subCol,
        marginBottom: 6,
        letterSpacing: 0.5,
      }}>
        {markers.map((m, i) => (
          <span key={i}>{m.toFixed(2)}</span>
        ))}
      </div>

      {/* Bar */}
      <div
        style={{
          height: 8,
          background: darkMode
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(0,0,0,0.07)',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: darkMode
            ? 'inset 0 1px 3px rgba(0,0,0,0.3)'
            : 'inset 0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: isHigh
              ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
              : isMedium
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #ef4444, #f87171)',
            borderRadius: 10,
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: isHigh
              ? '0 0 12px rgba(124,58,237,0.5)'
              : isMedium
              ? '0 0 12px rgba(245,158,11,0.5)'
              : '0 0 12px rgba(239,68,68,0.5)',
          }}
        />
      </div>
    </div>
  );
}

/**
 * TargetGPACalculator – Computes required future GPA to reach a target.
 * Validated, glassmorphic UI with clear error handling.
 */
export function TargetGPACalculator({ currentGPA, totalCredits, darkMode }) {
  const [targetGPA, setTargetGPA] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [requiredGPA, setRequiredGPA] = useState(null);
  const [error, setError] = useState('');

  const isDark = darkMode;

  const calculateRequired = useCallback(() => {
    setError('');
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
      targetGPA === '' ||
      remainingCredits === ''
    ) {
      setError('Please fill all fields with valid numbers.');
      return;
    }

    if (target < 0) {
      setError('Target GPA must be non‑negative.');
      return;
    }
    if (remaining <= 0) {
      setError('Remaining credits must be greater than zero.');
      return;
    }

    const required = (target * (total + remaining) - current * total) / remaining;
    if (required < 0) {
      setRequiredGPA('0.00 (target already reached)');
    } else {
      setRequiredGPA(required.toFixed(2));
    }
  }, [currentGPA, targetGPA, totalCredits, remainingCredits]);

  const inputStyle = (value) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    color: isDark ? '#f1f0ff' : '#1a1035',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxShadow: isDark
      ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
      : 'inset 0 2px 4px rgba(0,0,0,0.02)',
    ...(value === '' ? {} : { borderColor: isDark ? 'rgba(167,139,250,0.5)' : 'rgba(124,58,237,0.4)' }),
  });

  return (
    <div
      className="animate-scale-in"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(30,20,60,0.5), rgba(15,12,35,0.6))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,235,255,0.7))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.15)'}`,
        borderRadius: 20,
        padding: 'clamp(18px, 4vw, 24px)',
        marginTop: 24,
        boxShadow: isDark
          ? '0 12px 32px rgba(0,0,0,0.4)'
          : '0 12px 32px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span aria-hidden="true" style={{ fontSize: 20 }}>🎯</span>
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          margin: 0,
          color: isDark ? '#e2d9f3' : '#1a1035',
        }}>
          Target GPA Calculator
        </h3>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          }}>
            Target GPA
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 3.50"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            style={inputStyle(targetGPA)}
            onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
            onBlur={(e) =>
              (e.target.style.borderColor = isDark
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(0,0,0,0.1)')
            }
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          }}>
            Remaining Credits
          </span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 30"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            style={inputStyle(remainingCredits)}
            onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
            onBlur={(e) =>
              (e.target.style.borderColor = isDark
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(0,0,0,0.1)')
            }
          />
        </label>

        {error && (
          <div
            role="alert"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              color: '#fca5a5',
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={calculateRequired}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            borderRadius: 14,
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(124,58,237,0.25)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 26px rgba(124,58,237,0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Calculate Required GPA
        </button>

        {requiredGPA !== null && (
          <div
            className="animate-fade-up"
            style={{
              textAlign: 'center',
              marginTop: 8,
              padding: '16px',
              background: isDark
                ? 'rgba(124,58,237,0.08)'
                : 'rgba(124,58,237,0.04)',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)'}`,
            }}
          >
            <div style={{
              fontSize: 12,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500,
            }}>
              Required GPA in remaining courses
            </div>
            <div style={{
              fontSize: 'clamp(24px, 8vw, 32px)',
              fontWeight: 700,
              color: isDark ? '#c4b5fd' : '#7c3aed',
            }}>
              {requiredGPA}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}