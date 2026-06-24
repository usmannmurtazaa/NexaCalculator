import { useEffect, useState, useCallback, useMemo } from "react";

// ── SVG Icons ──────────────────────────────────────────────────────────
const SuccessIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#34d399"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fca5a5"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a78bfa"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 4000,
}) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  // Track visibility separately — never change hook count
  useEffect(() => {
    if (message) {
      setVisible(true);
      setProgress(100);
    }
  }, [message]);

  // Auto‑dismiss timer & progress bar
  useEffect(() => {
    if (!message || !visible) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 16);

    const timeout = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [message, duration, onClose, visible]);

  // Memoized styles (always called, never skipped)
  const bgColor = useMemo(() => {
    if (type === "success") return "rgba(52,211,153,0.15)";
    if (type === "error") return "rgba(239,68,68,0.15)";
    return "rgba(255,255,255,0.1)";
  }, [type]);

  const textColor = useMemo(() => {
    if (type === "success") return "#34d399";
    if (type === "error") return "#fca5a5";
    return "#f1f0ff";
  }, [type]);

  const borderColor = useMemo(() => {
    if (type === "success") return "rgba(52,211,153,0.4)";
    if (type === "error") return "rgba(239,68,68,0.4)";
    return "rgba(255,255,255,0.15)";
  }, [type]);

  const icon = useMemo(() => {
    if (type === "success") return <SuccessIcon />;
    if (type === "error") return <ErrorIcon />;
    return <InfoIcon />;
  }, [type]);

  const ariaLive = type === "error" ? "assertive" : "polite";

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setVisible(false);
        onClose?.();
      }
    },
    [onClose],
  );

  // Render null only after all hooks have been called
  if (!message || !visible) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={ariaLive}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: "fixed",
        bottom: "clamp(20px, 4vh, 32px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: bgColor,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: "12px 20px",
        borderRadius: 14,
        fontSize: "clamp(13px, 3vw, 15px)",
        fontWeight: 600,
        zIndex: 2000,
        animation: "fadeUp 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: "calc(100vw - 32px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        outline: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background:
            type === "success"
              ? "linear-gradient(90deg, #34d399, #6ee7b7)"
              : type === "error"
                ? "linear-gradient(90deg, #ef4444, #fca5a5)"
                : "linear-gradient(90deg, #7c3aed, #a78bfa)",
          borderRadius: "3px 0 0 0",
          transition: "width 0.1s linear",
        }}
      />
      <span
        aria-hidden="true"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, wordBreak: "break-word" }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          border: "none",
          color: textColor,
          cursor: "pointer",
          padding: "2px 6px",
          borderRadius: 6,
          transition: "background 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
