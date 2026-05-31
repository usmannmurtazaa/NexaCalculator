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

  // Validate and submit
  const submit = useCallback(async () => {
    setError('');
    const { name, email, message } = contact;

    // Trim and validate
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError('Email service is not configured. Please try again later.');
      return;
    }

    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name.trim(),
        from_email: email.trim(),
        subject: contact.subject.trim() || 'Nexa Calculator Contact',
        message: message.trim(),
      });
      setSent(true);
      logEvent('contact_form_submitted', {
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [contact]);

  // Reset form to initial state
  const reset = useCallback(() => {
    setContact(INITIAL_STATE);
    setSent(false);
    setError('');
  }, []);

  return {
    contact,
    setContact,
    sent,
    setSent,
    error,
    sending,
    submit,
    reset,          // new convenience function
  };
}