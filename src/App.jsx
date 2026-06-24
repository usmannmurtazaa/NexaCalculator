// src/App.jsx
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { useVisitors } from "./hooks/useVisitors";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import GPACalculator from "./components/GPACalculator";
import CGPACalculator from "./components/CGPACalculator";
import CalculatorPanel from "./components/CalculatorPanel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const { darkMode } = useTheme();
  const [tab, setTab] = useState("gpa");
  const [scale, setScale] = useState("4.0");
  const [isLoaded, setIsLoaded] = useState(false);
  const visitors = useVisitors(1312);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleScaleChange = useCallback((e) => {
    setScale(e.target.value);
  }, []);

  if (!isLoaded) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  return (
    <div
      id="nexa-app-root"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--color-bg-secondary)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header darkMode={darkMode} visitors={visitors} />
        <Navigation tab={tab} setTab={setTab} darkMode={darkMode} />

        {(tab === "gpa" || tab === "cgpa") && (
          <div
            style={{
              padding: "1rem",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <span
              style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}
            >
              GPA Scale
            </span>
            <select
              value={scale}
              onChange={handleScaleChange}
              style={{
                padding: "0.5rem 2rem 0.5rem 1rem",
                borderRadius: 12,
                border: "1px solid var(--color-border-primary)",
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b7280' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="4.0">4.0 Scale</option>
              <option value="5.0">5.0 Scale</option>
              <option value="10.0">10.0 Scale</option>
            </select>
          </div>
        )}

        <main style={{ padding: "clamp(1rem, 4vw, 2rem)" }}>
          {tab === "gpa" && <GPACalculator scale={scale} darkMode={darkMode} />}
          {tab === "cgpa" && (
            <CGPACalculator scale={scale} darkMode={darkMode} />
          )}
          {tab === "calculator" && <CalculatorPanel darkMode={darkMode} />}
        </main>

        <ContactSection darkMode={darkMode} />
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}
