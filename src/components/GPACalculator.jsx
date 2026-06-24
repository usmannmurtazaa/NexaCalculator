import { useState, useCallback, useMemo } from "react";
import { useGPA } from "../hooks/useGPA";
import { GRADES, SCALES } from "../utils/grades";
import { generatePDF } from "../utils/pdfExport";
import { downloadCSV } from "../utils/csvExport";
import { logEvent } from "../firebase/analytics";
import { trackExport } from "../firebase/exportTracker";
import CourseCard from "./CourseCard";
import ResultCard from "./ResultCard";
import { GradeProgressBar, TargetGPACalculator } from "./GradeExtras";
import ExportModal from "./ExportModal";
import Toast from "./Toast";
import theme from "../constants/theme";

// ── Helper: grade scale lookup ──────────────────────────────────────────
const useGradeScale = (scale) =>
  useMemo(() => SCALES[scale] || GRADES, [scale]);

export default function GPACalculator({ scale, darkMode }) {
  const {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    calculate,
    result,
    error,
  } = useGPA(scale);

  const gradeScale = useGradeScale(scale);

  const [showTargetGPA, setShowTargetGPA] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // ── Calculate handler ────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    if (courses.length === 0) {
      setToast({
        message: "Add at least one course to calculate GPA.",
        type: "info",
      });
      return;
    }
    setCalculating(true);
    requestAnimationFrame(() => {
      calculate();
      logEvent("gpa_calculated", {
        scale,
        courses_count: courses.length,
        timestamp: new Date().toISOString(),
      });
      setCalculating(false);
    });
  }, [calculate, scale, courses.length]);

  // ── Export handler ──────────────────────────────────────────────────
  const handleExport = useCallback(
    async (exportData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });

      const data = {
        ...exportData,
        scale,
        courses: courses.map((c) => ({
          code: c.code || "—",
          credits: c.credits,
          grade: gradeScale[c.gradeIdx]?.g || "N/A",
          points: gradeScale[c.gradeIdx]?.p?.toFixed(2) || "0.00",
        })),
        gpaResult: result,
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
          semester: exportData.semester || "",
          scale,
          gpa: result?.gpa || 0,
          credits: result?.credits || 0,
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
          scale,
          gpa: result?.gpa,
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
    [courses, scale, result, gradeScale],
  );

  // ── Styles (dark mode only) ──────────────────────────────────────────
  const containerStyle = useMemo(
    () => ({
      maxWidth: 840,
      margin: "0 auto",
      padding: "0 0 20px",
      animation: "fadeUp 0.5s ease-out",
    }),
    [],
  );

  const sectionHeaderStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
      flexWrap: "wrap",
      gap: 12,
    }),
    [],
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: "clamp(14px, 2.5vw, 15px)",
      fontWeight: 600,
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.55)",
      margin: 0,
    }),
    [],
  );

  const addCourseButtonStyle = useMemo(
    () => ({
      width: "100%",
      padding: "clamp(14px, 2.5vw, 16px)",
      border: "2px dashed rgba(124,58,237,0.35)",
      borderRadius: 14,
      background: "transparent",
      color: "#c4b5fd",
      fontSize: "clamp(14px, 3vw, 16px)",
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      transition: "all 0.3s ease",
      backdropFilter: "blur(4px)",
    }),
    [],
  );

  const calculateButtonStyle = useMemo(
    () => ({
      width: "100%",
      padding: "clamp(16px, 3vw, 18px)",
      background: calculating
        ? "linear-gradient(135deg, #6d28d9, #5b21b6)"
        : "linear-gradient(135deg, #7c3aed, #6d28d9)",
      color: "#fff",
      border: "none",
      borderRadius: 14,
      fontSize: "clamp(16px, 3.5vw, 18px)",
      fontWeight: 600,
      cursor: calculating ? "progress" : "pointer",
      boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
      letterSpacing: "0.02em",
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
      padding: "14px 18px",
      fontSize: 14,
      color: "#fca5a5",
      marginTop: 16,
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }),
    [],
  );

  const counterStyle = useMemo(
    () => ({
      fontFamily: theme.fonts.mono,
      fontSize: 13,
      color: "#c4b5fd",
      background: "rgba(124,58,237,0.12)",
      border: "1px solid rgba(124,58,237,0.25)",
      padding: "6px 16px",
      borderRadius: 20,
      fontWeight: 500,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    }),
    [],
  );

  const targetButtonStyle = useMemo(
    () => ({
      padding: "6px 16px",
      background: "rgba(124,58,237,0.12)",
      border: "1px solid rgba(124,58,237,0.25)",
      borderRadius: 20,
      color: "#a78bfa",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div style={containerStyle} className="animate-fade-up">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
        darkMode={darkMode}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
        darkMode={darkMode}
      />

      {/* Section header */}
      <div style={sectionHeaderStyle}>
        <h2 style={headingStyle}>Current Courses & Grades</h2>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {result && (
            <button
              onClick={() => setShowTargetGPA(!showTargetGPA)}
              style={targetButtonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(124,58,237,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(124,58,237,0.12)")
              }
              aria-expanded={showTargetGPA}
              aria-controls="target-gpa-section"
            >
              {showTargetGPA ? "Hide" : "Show"} Target GPA
            </button>
          )}
          <div style={counterStyle} aria-live="polite" aria-atomic="true">
            {courses.length} / 8 courses
          </div>
        </div>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.1)",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            No courses added yet. Click the button below to start building your
            GPA.
          </p>
        </div>
      )}

      {/* Course cards */}
      {courses.map((c, i) => (
        <CourseCard
          key={c.id}
          id={c.id}
          index={i}
          removable={i >= 3}
          onRemove={removeCourse}
          data={c}
          onChange={updateCourse}
          scale={scale}
          darkMode={darkMode}
        />
      ))}

      {/* Add course button (max 8) */}
      {courses.length < 8 && (
        <button
          onClick={addCourse}
          style={addCourseButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.06)";
            e.currentTarget.style.borderColor = "#a78bfa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
          }}
          aria-label="Add new course"
        >
          <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
            +
          </span>
          Add New Course
        </button>
      )}

      {/* Calculate button */}
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
          "Calculate Semester GPA"
        )}
      </button>

      {/* Error message */}
      {error && (
        <div style={errorBoxStyle} role="alert">
          <WarningIcon />
          {error}
        </div>
      )}

      {/* Results section */}
      {result && (
        <>
          <ResultCard
            gpa={result.gpa}
            courses={result.count}
            credits={result.credits}
            points={result.points}
            scale={scale}
            darkMode={darkMode}
          />
          <GradeProgressBar
            gpa={result.gpa}
            scale={scale}
            darkMode={darkMode}
          />

          {showTargetGPA && (
            <div id="target-gpa-section">
              <TargetGPACalculator
                currentGPA={result.gpa}
                totalCredits={result.credits}
                darkMode={darkMode}
              />
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: "right" }}>
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
