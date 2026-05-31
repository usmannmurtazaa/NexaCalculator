import React from 'react';
import ReactDOM from 'react-dom/client';
import './firebase/firebase'; // Initialize Firebase before App renders
import { ThemeProvider } from './components/ThemeContext';
import App from './App';
import './styles/global.css';

// ── Pre‑hydrate theme to avoid flash of wrong mode ──────────────────────────
// This reads from localStorage (or system preference) before React boots.
(function applyInitialTheme() {
  try {
    const saved = localStorage.getItem('nexa-theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (saved === 'system' && prefersDark) || (!saved && prefersDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  } catch (e) { /* ignore */ }
})();

// ── Error Boundary (premium production resilience) ──────────────────────────
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You could log to an external service here
    console.error('Nexa Calculator - App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
            padding: '24px',
            textAlign: 'center',
            background: '#0f0c29',
            color: '#fff',
          }}
        >
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', marginBottom: 16 }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.7, marginBottom: 24, maxWidth: 400 }}>
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ marginTop: 32, textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 8, maxWidth: '100%', overflow: 'auto', fontSize: 13 }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// ── Mount point validation ──────────────────────────────────────────────────
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html contains <div id="root"></div>');
}

// ── Render app with all providers ───────────────────────────────────────────
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);