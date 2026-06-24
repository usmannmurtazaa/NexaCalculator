import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import theme from "../constants/theme";

// ── SVG Icons ──────────────────────────────────────────────────────────
const PdfIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CsvIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
}) {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [touched, setTouched] = useState(false);

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isExporting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isExporting]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setStudentName("");
      setStudentId("");
      setUniversity("");
      setSemester("");
      setExportFormat("pdf");
      setTouched(false);
    }
  }, [isOpen]);

  const handleExport = useCallback(() => {
    setTouched(true);
    if (!studentName.trim() || isExporting) return;
    onExport({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      university: university.trim(),
      semester: semester.trim(),
      format: exportFormat,
    });
  }, [
    studentName,
    studentId,
    university,
    semester,
    exportFormat,
    isExporting,
    onExport,
  ]);

  const showNameError = touched && !studentName.trim();

  // ── Styles (dark‑only) ──────────────────────────────────────────────
  const overlayStyle = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "16px",
    }),
    [],
  );

  const modalStyle = useMemo(
    () => ({
      background:
        "linear-gradient(160deg, rgba(30,20,60,0.95), rgba(15,12,35,0.95))",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(167,139,250,0.2)",
      borderRadius: 24,
      width: "100%",
      maxWidth: 520,
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      animation: "scaleIn 0.25s ease",
      overflow: "hidden",
    }),
    [],
  );

  const headerStyle = useMemo(
    () => ({
      padding: "20px 24px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(30,20,60,0.8)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }),
    [],
  );

  const bodyStyle = useMemo(
    () => ({
      flex: 1,
      overflowY: "auto",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }),
    [],
  );

  const footerStyle = useMemo(
    () => ({
      padding: "16px 24px 20px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      gap: 12,
      background: "rgba(30,20,60,0.8)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }),
    [],
  );

  const inputStyle = useCallback(
    (isError = false) => ({
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: `1px solid ${isError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(8px)",
      color: "#f1f0ff",
      fontSize: 15,
      fontWeight: 500,
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    }),
    [],
  );

  const formatButtonStyle = useCallback(
    (format) => {
      const active = exportFormat === format;
      return {
        flex: 1,
        padding: "12px 16px",
        borderRadius: 12,
        border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
        background: active ? "rgba(124,58,237,0.15)" : "transparent",
        color: active ? "#a78bfa" : "rgba(255,255,255,0.5)",
        fontWeight: 600,
        fontSize: 14,
        cursor: isExporting ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: isExporting ? 0.6 : 1,
      };
    },
    [exportFormat, isExporting],
  );

  const exportButtonStyle = useMemo(() => {
    const disabled = !studentName.trim() || isExporting;
    return {
      flex: 2,
      padding: "14px",
      background: disabled
        ? "rgba(124,58,237,0.25)"
        : "linear-gradient(135deg, #7c3aed, #6d28d9)",
      border: "none",
      borderRadius: 14,
      color: "#fff",
      fontWeight: 600,
      fontSize: 15,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 8px 20px rgba(124,58,237,0.3)",
      transition: "all 0.25s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    };
  }, [studentName, isExporting]);

  const cancelButtonStyle = useMemo(
    () => ({
      flex: 1,
      padding: "14px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 14,
      color: "#f1f0ff",
      fontWeight: 500,
      fontSize: 15,
      cursor: isExporting ? "not-allowed" : "pointer",
      transition: "all 0.25s ease",
      opacity: isExporting ? 0.6 : 1,
    }),
    [isExporting],
  );

  if (!isOpen) return null;

  return (
    <div
      style={overlayStyle}
      onClick={isExporting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        ref={modalRef}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2
            id="export-modal-title"
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: "clamp(18px, 4vw, 22px)",
              fontWeight: 700,
              color: "#f1f0ff",
              margin: 0,
            }}
          >
            Export Academic Record
          </h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close export modal"
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: isExporting ? "not-allowed" : "pointer",
              padding: 4,
              lineHeight: 1,
              transition: "color 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isExporting) e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              if (!isExporting)
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form Body */}
        <div style={bodyStyle}>
          {/* Student Name */}
          <div>
            <label
              htmlFor="export-student-name"
              style={{
                display: "block",
                marginBottom: 6,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Student Name <span aria-hidden="true">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="export-student-name"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (!touched) setTouched(true);
              }}
              placeholder="e.g. John Doe"
              required
              aria-required="true"
              aria-invalid={showNameError}
              style={inputStyle(showNameError)}
              disabled={isExporting}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) =>
                (e.target.style.borderColor = showNameError
                  ? "rgba(239,68,68,0.5)"
                  : "rgba(255,255,255,0.12)")
              }
            />
            {showNameError && (
              <span
                role="alert"
                style={{
                  fontSize: 11,
                  color: "#f87171",
                  marginTop: 4,
                  display: "block",
                }}
              >
                Please enter your name
              </span>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label
              htmlFor="export-student-id"
              style={{
                display: "block",
                marginBottom: 6,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Student ID
            </label>
            <input
              id="export-student-id"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 2024CS-045"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.12)")
              }
            />
          </div>

          {/* University */}
          <div>
            <label
              htmlFor="export-university"
              style={{
                display: "block",
                marginBottom: 6,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              University / College
            </label>
            <input
              id="export-university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. MIT"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.12)")
              }
            />
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="export-semester"
              style={{
                display: "block",
                marginBottom: 6,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Semester
            </label>
            <input
              id="export-semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. Fall 2024"
              style={inputStyle()}
              disabled={isExporting}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.12)")
              }
            />
          </div>

          {/* Export Format Toggle */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Format
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["pdf", "csv"].map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    if (!isExporting) setExportFormat(format);
                  }}
                  aria-pressed={exportFormat === format}
                  disabled={isExporting}
                  style={formatButtonStyle(format)}
                  onMouseEnter={(e) => {
                    if (!isExporting && exportFormat !== format) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExporting && exportFormat !== format) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {format === "pdf" ? <PdfIcon /> : <CsvIcon />}
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button
            onClick={handleExport}
            disabled={!studentName.trim() || isExporting}
            style={exportButtonStyle}
            onMouseEnter={(e) => {
              if (!(!studentName.trim() || isExporting))
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              if (!(!studentName.trim() || isExporting))
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(124,58,237,0.3)";
            }}
          >
            {isExporting ? (
              <>
                <div
                  className="loading-spinner"
                  style={{ width: 18, height: 18, borderWidth: 2 }}
                />
                Exporting...
              </>
            ) : (
              `Export ${exportFormat.toUpperCase()}`
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={cancelButtonStyle}
            onMouseEnter={(e) => {
              if (!isExporting)
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              if (!isExporting)
                e.currentTarget.style.background = "transparent";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
