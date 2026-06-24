import { useState, useCallback, useMemo } from "react";
import { useCGPA } from "../hooks/useCGPA";
import { generatePDF } from "../utils/pdfExport";
import { downloadCSV } from "../utils/csvExport";
import { logEvent } from "../firebase/analytics";
import { trackExport } from "../firebase/exportTracker";
import CGPAResultCard from "./CGPAResultCard";
import ExportModal from "./ExportModal";
import Toast from "./Toast";
import theme from "../constants/theme";

export default function CGPACalculator({
  scale,
  darkMode: _deprecatedDarkMode,
}) {
  const { sems, addSem, removeSem, updateSem, calculate, result, error } =
    useCGPA(scale);

  const [calculating, setCalculating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // ── Memoized styles (dark mode only) ──────────────────────────────────
  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: "clamp(13px, 2.5vw, 14px)",
      fontWeight: 600,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.5)",
      margin: "0 0 18px 0",
    }),
    [],
  );

  const semesterCardStyle = useMemo(
    () => ({
      background: "rgba(30, 20, 60, 0.45)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      padding: "clamp(18px, 4vw, 22px)",
      transition: "all 0.25s ease",
    }),
    [],
  );

  const addButtonStyle = useMemo(
    () => ({
      width: "100%",
      padding: "clamp(12px, 2.5vw, 14px)",
      border: "2px dashed rgba(124,58,237,0.3)",
      borderRadius: 14,
      background: "transparent",
      color: "#c4b5fd",
      fontSize: "clamp(14px, 3vw, 15px)",
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all 0.25s ease",
    }),
    [],
  );

  const calculateButtonStyle = useMemo(
    () => ({
      width: "100%",
      padding: "clamp(14px, 3vw, 17px)",
      background: calculating
        ? "linear-gradient(135deg, #6d28d9, #5b21b6)"
        : "linear-gradient(135deg, #7c3aed, #6d28d9)",
      color: "#fff",
      border: "none",
      borderRadius: 14,
      fontSize: "clamp(16px, 3.5vw, 17px)",
      fontWeight: 600,
      cursor: calculating ? "progress" : "pointer",
      boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      transition: "all 0.3s ease",
      transform: calculating ? "scale(0.98)" : "scale(1)",
      opacity: calculating ? 0.9 : 1,
    }),
    [calculating],
  );

  const exportButtonStyle = useMemo(
    () => ({
      padding: "10px 22px",
      background: "rgba(124,58,237,0.1)",
      border: "1px solid rgba(124,58,237,0.3)",
      borderRadius: 10,
      color: "#c4b5fd",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "all 0.25s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    }),
    [],
  );

  const errorBoxStyle = useMemo(
    () => ({
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: 12,
      padding: "12px 16px",
      fontSize: 13,
      color: "#fca5a5",
      marginTop: 16,
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }),
    [],
  );

  const WarningIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    if (sems.length === 0) {
      setToast({
        message: "Add at least one semester GPA to calculate CGPA.",
        type: "info",
      });
      return;
    }
    setCalculating(true);
    requestAnimationFrame(() => {
      calculate();
      logEvent("cgpa_calculated", {
        scale,
        semesters_count: sems.length,
        timestamp: new Date().toISOString(),
      });
      setCalculating(false);
    });
  }, [calculate, scale, sems.length]);

  const handleExport = useCallback(
    async (exportData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });
      const data = {
        ...exportData,
        scale,
        semesters: sems.map((s) => ({ gpa: s.val })),
        cgpaResult: result,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      try {
        if (exportData.format === "pdf") {
          await generatePDF(data);
        } else {
          downloadCSV(data);
        }

        await trackExport({
          studentName: exportData.studentName || "",
          studentId: exportData.studentId || "",
          university: exportData.university || "",
          semester: exportData.semester || "All Semesters",
          scale,
          gpa: result?.cgpa || 0,
          credits: result?.total || 0,
          date: data.date,
          exportType: exportData.format,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          },
        });

        logEvent("export_triggered", {
          format: exportData.format,
          type: "cgpa",
          cgpa: result?.cgpa,
        });

        setShowExportModal(false);
        setToast({
          message: "Export completed successfully!",
          type: "success",
        });
      } catch (err) {
        console.error("Export failed:", err);
        setToast({
          message: "Export failed. Please try again.",
          type: "error",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [sems, scale, result],
  );

  const handleRemoveEnter = useCallback((e) => {
    e.currentTarget.style.background = "rgba(239,68,68,0.25)";
  }, []);

  const handleRemoveLeave = useCallback((e) => {
    e.currentTarget.style.background = "rgba(239,68,68,0.12)";
  }, []);

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-up">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
        darkMode={_deprecatedDarkMode}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
        darkMode={_deprecatedDarkMode}
      />

      <h2 style={sectionTitleStyle}>Semester GPAs</h2>

      {/* Empty state */}
      {sems.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.1)",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            No semester GPAs added yet. Click "Add Semester" to begin.
          </p>
        </div>
      )}

      <div
        className="semester-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "clamp(12px, 2vw, 16px)",
          marginBottom: 20,
        }}
      >
        {sems.map((s, i) => (
          <div
            key={s.id}
            style={semesterCardStyle}
            role="group"
            aria-label={`Semester ${i + 1}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(12px, 2.5vw, 13px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Semester {i + 1}
              </span>
              {i >= 2 && (
                <button
                  onClick={() => removeSem(s.id)}
                  aria-label={`Remove semester ${i + 1}`}
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                    borderRadius: 8,
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                  onMouseEnter={handleRemoveEnter}
                  onMouseLeave={handleRemoveLeave}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <input
              type="number"
              min="0"
              max={scale}
              step="0.01"
              placeholder="0.00"
              value={s.val}
              onChange={(e) => updateSem(s.id, e.target.value)}
              aria-label={`Semester ${i + 1} GPA`}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "clamp(22px, 5vw, 26px)",
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
                padding: "6px 0",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = "#7c3aed";
                e.target.style.boxShadow = "0 2px 0 0 rgba(124,58,237,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = "rgba(255,255,255,0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        ))}
      </div>

      {sems.length < 8 && (
        <button
          onClick={addSem}
          style={addButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.06)";
            e.currentTarget.style.borderColor = "#a78bfa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
          }}
          aria-label="Add new semester"
        >
          <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
            +
          </span>
          Add Semester
        </button>
      )}

      <button
        onClick={handleCalculate}
        disabled={calculating}
        style={calculateButtonStyle}
        onMouseEnter={(e) => {
          if (!calculating)
            e.currentTarget.style.boxShadow =
              "0 12px 28px rgba(124, 58, 237, 0.45)";
        }}
        onMouseLeave={(e) => {
          if (!calculating)
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(124, 58, 237, 0.35)";
        }}
        aria-busy={calculating}
      >
        {calculating ? (
          <>
            <div
              className="loading-spinner"
              style={{ width: 20, height: 20, borderWidth: 2 }}
              aria-hidden="true"
            />
            Calculating...
          </>
        ) : (
          "Calculate Cumulative CGPA"
        )}
      </button>

      {error && (
        <div style={errorBoxStyle} role="alert">
          <WarningIcon />
          {error}
        </div>
      )}

      {result && (
        <>
          <CGPAResultCard
            cgpa={result.cgpa}
            sems={result.sems}
            total={result.total}
            best={result.best}
            scale={scale}
            darkMode={_deprecatedDarkMode}
          />
          <div style={{ marginTop: 20, textAlign: "right" }}>
            <button
              onClick={() => setShowExportModal(true)}
              style={exportButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.1)";
              }}
              aria-label="Export academic record as PDF or CSV"
            >
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Academic Record
            </button>
          </div>
        </>
      )}
    </div>
  );
}
