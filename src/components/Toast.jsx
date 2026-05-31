import { useEffect, useState, useCallback, useMemo } from 'react';

export default function Toast({ message, type = 'info', onClose, darkMode, duration = 4000 }) {
  const [progress, setProgress] = useState(100);

  // Auto‑dismiss timer & progress bar
  useEffect(() => {
    if (!message) {
      setProgress(100);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 16); // ~60fps

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [message, duration, onClose]);

  // Prevent render if no message
  if (!message) return null;

  // ── Memoized styles ─────────────────────────────────────────────────
  const bgColor = useMemo(() => {
    if (type === 'success') return 'rgba(52,211,153,0.15)';
    if (type === 'error') return 'rgba(239,68,68,0.15)';
    return darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  }, [type, darkMode]);

  const textColor = useMemo(() => {
    if (type === 'success') return '#34d399';
    if (type === 'error') return '#fca5a5';
    return darkMode ? '#f1f0ff' : '#1a1035';
  }, [type, darkMode]);

  const borderColor = useMemo(() => {
    if (type === 'success') return 'rgba(52,211,153,0.4)';
    if (type === 'error') return 'rgba(239,68,68,0.4)';
    return darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  }, [type, darkMode]);

  const icon = useMemo(() => {
    if (type === 'success') return '✅';
    if (type === 'error') return '❌';
    return 'ℹ️';
  }, [type]);

  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  // Close handler with keyboard (Escape)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={ariaLive}
      onKeyDown={handleKeyDown}
      tabIndex={0} // makes it focusable so Escape works
      style={{
        position: 'fixed',
        bottom: 'clamp(20px, 4vh, 32px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: bgColor,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: '12px 20px',
        borderRadius: 14,
        fontSize: 'clamp(13px, 3vw, 15px)',
        fontWeight: 600,
        zIndex: 2000,
        animation: 'fadeUp 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 'calc(100vw - 32px)',
        boxShadow: darkMode
          ? '0 8px 24px rgba(0,0,0,0.4)'
          : '0 8px 24px rgba(0,0,0,0.1)',
        outline: 'none',
        overflow: 'hidden', // for progress bar
        transition: 'all 0.2s ease',
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: type === 'success'
            ? 'linear-gradient(90deg, #34d399, #6ee7b7)'
            : type === 'error'
            ? 'linear-gradient(90deg, #ef4444, #fca5a5)'
            : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          borderRadius: '3px 0 0 0',
          transition: 'width 0.1s linear',
        }}
      />
      <span aria-hidden="true" style={{ fontSize: '1.1em' }}>{icon}</span>
      <span style={{ flex: 1, wordBreak: 'break-word' }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: 18,
          padding: '2px 6px',
          borderRadius: 6,
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        ✕
      </button>
    </div>
  );
}