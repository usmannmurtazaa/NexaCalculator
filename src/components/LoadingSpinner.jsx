import { useMemo } from "react";
import theme from "../constants/theme";

export default function LoadingSpinner({
  darkMode: _deprecatedDarkMode,
  size = "md",
  message,
}) {
  const dimensions = useMemo(() => {
    if (typeof size === "number")
      return { container: size + 16, spinner: size };
    switch (size) {
      case "sm":
        return { container: 40, spinner: 24 };
      case "lg":
        return { container: 72, spinner: 36 };
      default:
        return { container: 56, spinner: 28 };
    }
  }, [size]);

  const containerStyle = useMemo(
    () => ({
      width: dimensions.container,
      height: dimensions.container,
      borderRadius: "50%",
      background: "var(--glass-bg)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid var(--glass-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "var(--glass-shadow)",
      animation: "scaleIn 0.3s ease",
    }),
    [dimensions.container],
  );

  const spinnerStyle = useMemo(
    () => ({
      width: dimensions.spinner,
      height: dimensions.spinner,
      border: `3px solid rgba(124, 58, 237, 0.15)`,
      borderTopColor: "#7c3aed",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }),
    [dimensions.spinner],
  );

  const brandStyle = useMemo(
    () => ({
      fontFamily: theme.fonts.heading,
      fontSize: "clamp(20px, 5vw, 28px)",
      fontWeight: 700,
      background: "linear-gradient(135deg, #ffffff, #c4b5fd)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      letterSpacing: "-0.02em",
      animation: "fadeUp 0.5s ease both 0.2s",
    }),
    [],
  );

  const messageStyle = useMemo(
    () => ({
      fontFamily: theme.fonts.body,
      fontSize: "clamp(14px, 3vw, 16px)",
      color: "var(--text-secondary)",
      fontWeight: 400,
      marginTop: -8,
      animation: "fadeUp 0.5s ease both 0.35s",
    }),
    [],
  );

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-label={`Loading Nexa Calculator${message ? ": " + message : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--bg-app)",
        transition: "background 0.3s ease",
        gap: 24,
        padding: "clamp(16px, 5vw, 32px)",
      }}
    >
      <div style={containerStyle}>
        <div style={spinnerStyle} />
      </div>
      <div style={brandStyle}>Nexa Calculator</div>
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );
}
