import { useState } from 'react';
import theme from '../constants/theme';

export default function TargetGPACalculator({ currentGPA, totalCredits, darkMode }) {
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredGPA, setRequiredGPA] = useState(null);

  const calculateRequired = () => {
    const current = parseFloat(currentGPA) || 0;
    const target = parseFloat(targetGPA) || 0;
    const total = parseFloat(totalCredits) || 0;
    const remaining = parseFloat(remainingCredits) || 0;
    if (remaining === 0) {
      setRequiredGPA("N/A");
      return;
    }
    const required = (target * (total + remaining) - current * total) / remaining;
    setRequiredGPA(required.toFixed(2));
  };

  const isDark = darkMode;

  return (
    <div
      style={{
        background: isDark ? theme.colors.cardDark : theme.colors.cardLight,
        border: `1px solid ${isDark ? theme.colors.borderDark : theme.colors.borderLight}`,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        marginTop: theme.spacing.xl,
      }}
    >
      <h3 style={{ fontSize: 15, marginBottom: 16, color: theme.colors.primaryLight }}>
        🎯 Target GPA Calculator
      </h3>
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
            Target GPA
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={targetGPA}
            onChange={e => setTargetGPA(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
              color: isDark ? '#fff' : '#333',
            }}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
            Remaining Credits
          </span>
          <input
            type="number"
            min="0"
            value={remainingCredits}
            onChange={e => setRemainingCredits(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
              color: isDark ? '#fff' : '#333',
            }}
          />
        </label>
        <button
          onClick={calculateRequired}
          style={{
            padding: '10px',
            background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Calculate Required GPA
        </button>
        {requiredGPA && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <div style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)' }}>
              Required GPA in remaining courses:
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: theme.colors.primaryLight }}>
              {requiredGPA}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}