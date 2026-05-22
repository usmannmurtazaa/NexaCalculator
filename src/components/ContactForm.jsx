import { useState, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { isValidEmail } from "../utils/gpa";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactForm({ darkMode }) {
  const [form,        setForm]        = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,        setSent]        = useState(false);
  const [error,       setError]       = useState("");
  const [isSending,   setIsSending]   = useState(false);

  const setField = useCallback((field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  }, []);

  const reset = () => {
    setSent(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    setError("");
  };

  const submit = async () => {
    setError("");
    const { name, email, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields."); return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address."); return;
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError("Email service not configured."); return;
    }
    setIsSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject:    form.subject || "Nexa Calculator Contact",
        message,
      });
      setSent(true);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const bg        = darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const border    = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textCol   = darkMode ? "#fff"                   : "#333";
  const subCol    = darkMode ? "rgba(255,255,255,0.4)"  : "rgba(0,0,0,0.5)";

  const inputStyle = {
    width: "100%",
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`,
    borderRadius: 12, padding: "12px 14px",
    color: textCol, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none", transition: "border-color 0.2s", display: "block",
  };

  return (
    <div style={{ margin: "0 clamp(16px,4vw,24px)", padding: "clamp(28px,5vw,36px) 0 0",
      borderTop: `1px solid ${border}` }}>
      <h2 className="font-serif" style={{
        fontSize: "clamp(28px,6vw,36px)", fontWeight: 700,
        background: darkMode
          ? "linear-gradient(135deg,#fff,#c4b5fd)"
          : "linear-gradient(135deg,#333,#7c3aed)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: 8,
      }}>
        Get in Touch
      </h2>
      <p style={{ fontSize: "clamp(14px,3vw,16px)", color: subCol, marginBottom: 24 }}>
        Have questions or feedback? We'd love to hear from you.
      </p>

      {sent ? (
        <div style={{
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
          borderRadius: 20, padding: "clamp(28px,5vw,36px)", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399" }}>Message Sent Successfully!</div>
          <button
            onClick={reset}
            style={{
              marginTop: 24, padding: "12px 28px",
              background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 12, color: "#34d399", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 24, padding: "clamp(24px,4vw,32px)" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 18 }}>
            <input
              type="text" placeholder="Your name *"
              value={form.name} onChange={e => setField("name", e.target.value)}
              aria-label="Your name" style={inputStyle}
            />
            <input
              type="email" placeholder="Email address *"
              value={form.email} onChange={e => setField("email", e.target.value)}
              aria-label="Email address" style={inputStyle}
            />
          </div>
          <input
            type="text" placeholder="Subject"
            value={form.subject} onChange={e => setField("subject", e.target.value)}
            aria-label="Subject" style={{ ...inputStyle, marginBottom: 18 }}
          />
          <textarea
            rows={5} placeholder="Write your message here... *"
            value={form.message} onChange={e => setField("message", e.target.value)}
            aria-label="Message" style={{ ...inputStyle, minHeight: 120, marginBottom: 24 }}
          />

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12, padding: "14px 18px", fontSize: 14,
              color: "#fca5a5", marginBottom: 18,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={isSending}
            aria-label="Send message"
            style={{
              width: "100%", padding: "clamp(14px,3vw,17px)",
              background: isSending ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff", border: "none", borderRadius: 14,
              fontSize: "clamp(15px,3.5vw,17px)", fontWeight: 600,
              cursor: isSending ? "not-allowed" : "pointer",
              boxShadow: isSending ? "none" : "0 8px 20px rgba(124,58,237,0.3)",
              transition: "all 0.2s",
            }}
          >
            {isSending ? "Sending…" : "Send Message"}
          </button>
        </div>
      )}
    </div>
  );
}