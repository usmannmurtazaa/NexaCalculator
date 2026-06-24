import { useEffect, useCallback, useMemo } from "react";
import { useContactForm } from "../hooks/useContactForm";
import { logEvent } from "../firebase/analytics";
import theme from "../constants/theme";

// ── SVG Icons ──────────────────────────────────────────────────────────
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

const CheckCircleIcon = () => (
  <svg
    width="56"
    height="56"
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

export default function ContactSection({ darkMode: _deprecatedDarkMode }) {
  const { contact, setContact, sent, setSent, error, sending, submit } =
    useContactForm();

  useEffect(() => {
    if (sent) {
      logEvent("contact_form_submitted", {
        timestamp: new Date().toISOString(),
      });
    }
  }, [sent]);

  const handleChange = useCallback(
    (field, value) => {
      setContact((prev) => ({ ...prev, [field]: value }));
      if (sent) setSent(false);
    },
    [setContact, sent, setSent],
  );

  // Memoised input style – always dark
  const inputStyle = useMemo(
    () => ({
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "12px 16px",
      color: "#f1f0ff",
      fontSize: 15,
      fontFamily: theme.fonts.body,
      fontWeight: 400,
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    }),
    [],
  );

  const handleFocus = useCallback((e) => {
    e.target.style.borderColor = "#7c3aed";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
  }, []);

  const handleBlur = useCallback((e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  }, []);

  // Success state
  if (sent) {
    return (
      <section
        style={{
          margin: `0 clamp(16px, 5vw, 32px)`,
          padding: "clamp(32px, 6vw, 48px) 0 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          animation: "fadeUp 0.5s ease",
        }}
        aria-label="Contact message sent"
      >
        <div
          className="animate-scale-in"
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: 24,
            padding: "clamp(32px, 6vw, 40px)",
            textAlign: "center",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 56,
              marginBottom: 16,
              color: "#34d399",
              lineHeight: 1,
            }}
          >
            <CheckCircleIcon />
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 5vw, 24px)",
              fontWeight: 700,
              color: "#34d399",
              margin: "0 0 8px",
            }}
          >
            Message Sent!
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 24,
            }}
          >
            Thank you for reaching out. We’ll respond shortly.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setContact({ name: "", email: "", subject: "", message: "" });
            }}
            style={{
              padding: "14px 32px",
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.4)",
              borderRadius: 14,
              color: "#34d399",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(52,211,153,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(52,211,153,0.12)")
            }
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        margin: `0 clamp(16px, 5vw, 32px)`,
        padding: "clamp(32px, 6vw, 48px) 0 0",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        animation: "fadeUp 0.5s ease",
      }}
      aria-labelledby="contact-heading"
    >
      <h2
        id="contact-heading"
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: "clamp(28px, 6vw, 40px)",
          fontWeight: 700,
          background: "linear-gradient(135deg, #ffffff, #c4b5fd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        Get in Touch
      </h2>
      <p
        style={{
          fontSize: "clamp(14px, 3vw, 16px)",
          color: "rgba(255,255,255,0.5)",
          marginBottom: 28,
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        Have questions or feedback? We’d love to hear from you.
      </p>

      <div
        style={{
          background: "rgba(30,20,60,0.5)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "clamp(24px, 5vw, 36px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 18,
          }}
        >
          {/* Name field */}
          <div>
            <label htmlFor="contact-name" className="sr-only">
              Your name (required)
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your name *"
              value={contact.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              aria-required="true"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="contact-email" className="sr-only">
              Email address (required)
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Email address *"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              aria-required="true"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="contact-subject" className="sr-only">
            Subject (optional)
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="Subject (optional)"
            value={contact.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Message */}
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="contact-message" className="sr-only">
            Message (required)
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Write your message here... *"
            value={contact.message}
            onChange={(e) => handleChange("message", e.target.value)}
            required
            aria-required="true"
            style={{
              ...inputStyle,
              minHeight: 130,
              resize: "vertical",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 14,
              color: "#fca5a5",
              marginBottom: 18,
              backdropFilter: "blur(8px)",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <WarningIcon />
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={submit}
          disabled={sending}
          aria-label={sending ? "Sending message" : "Send message"}
          style={{
            width: "100%",
            padding: "clamp(14px, 3vw, 17px)",
            background: sending
              ? "rgba(124,58,237,0.5)"
              : "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: "clamp(15px, 3.5vw, 17px)",
            fontWeight: 600,
            cursor: sending ? "not-allowed" : "pointer",
            boxShadow: sending ? "none" : "0 8px 20px rgba(124,58,237,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.25s ease",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            if (!sending)
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(124,58,237,0.45)";
          }}
          onMouseLeave={(e) => {
            if (!sending)
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(124,58,237,0.3)";
          }}
        >
          {sending ? (
            <>
              <div
                className="loading-spinner"
                style={{ width: 18, height: 18, borderWidth: 2 }}
                aria-hidden="true"
              />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </section>
  );
}
