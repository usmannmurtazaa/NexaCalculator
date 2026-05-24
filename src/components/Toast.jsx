import { useEffect } from 'react';

export default function Toast({ message, type, onClose, darkMode, duration = 4000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  const bgColor =
    type === 'success'
      ? 'rgba(52,211,153,0.15)'
      : type === 'error'
      ? 'rgba(239,68,68,0.15)'
      : darkMode
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.1)';

  const textColor = type === 'success' ? '#34d399' : type === 'error' ? '#fca5a5' : darkMode ? '#fff' : '#000';

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: bgColor,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${textColor}40`,
        color: textColor,
        padding: '12px 24px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        zIndex: 2000,
        animation: 'fadeUp 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: '90vw',
      }}
    >
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      {message}
      <button
        onClick={onClose}
        aria-label="Close toast"
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: 16,
          marginLeft: 8,
        }}
      >
        ✕
      </button>
    </div>
  );
}