import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { isValidEmail } from '../utils/gpa';
import { logEvent } from '../firebase/analytics';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const INITIAL_STATE = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function useContactForm() {
  const [contact, setContact] = useState(INITIAL_STATE);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = useCallback(async () => {
    setError('');
    const { name, email, message } = contact;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError('Email service not configured.');
      return;
    }

    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject: contact.subject || 'Nexa Calculator Contact',
        message,
      });
      setSent(true);
      logEvent('contact_form_submitted', {
        timestamp: new Date().toISOString(),
      });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [contact]);

  return {
    contact,
    setContact,
    sent,
    setSent,
    error,
    setError,
    sending,
    submit,
  };
}