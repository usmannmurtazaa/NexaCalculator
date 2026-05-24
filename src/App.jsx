import { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { useVisitors } from './hooks/useVisitors';
import Header from './components/Header';
import Navigation from './components/Navigation';
import GPACalculator from './components/GPACalculator';
import CGPACalculator from './components/CGPACalculator';
import CalculatorPanel from './components/CalculatorPanel';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import theme from './constants/theme';
import { logEvent, setUserProperties } from './firebase/analytics';

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const visitors = useVisitors(1312);
  const [tab, setTab] = useState('gpa');
  const [scale, setScale] = useState('4.0');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    logEvent('app_loaded', {
      dark_mode: darkMode,
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      logEvent('tab_changed', {
        tab,
        scale: tab !== 'calculator' ? scale : null,
        timestamp: new Date().toISOString(),
      });
    }
  }, [tab, scale, isLoaded]);

  const handleScaleChange = useCallback(
    (e) => {
      const newScale = e.target.value;
      setScale(newScale);
      logEvent('scale_changed', {
        previous_scale: scale,
        new_scale: newScale,
        tab,
        timestamp: new Date().toISOString(),
      });
    },
    [scale, tab]
  );

  const handleToggleDarkMode = useCallback(() => {
    toggleDarkMode();
    logEvent('dark_mode_toggled', {
      new_mode: !darkMode,
      timestamp: new Date().toISOString(),
    });
  }, [darkMode, toggleDarkMode]);

  if (!isLoaded) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  return (
    <div
      className={`theme-transition ${darkMode ? 'dark' : ''}`}
      style={{
        fontFamily: theme.fonts.body,
        background: darkMode
          ? 'linear-gradient(135deg, #0f0c29, #1a1035 25%, #2d1b4e 75%, #0f0c29)'
          : 'linear-gradient(135deg, #f8f9ff, #eef1ff 25%, #f0e6ff 75%, #f8f9ff)',
        color: darkMode ? theme.colors.textPrimaryDark : theme.colors.textPrimaryLight,
        minHeight: '100vh',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 50, 220, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80, 150, 255, 0.06) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(120, 50, 220, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80, 150, 255, 0.03) 0%, transparent 50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { margin: 0; padding: 0; overflow-x: hidden; font-feature-settings: 'ss01', 'ss03', 'cv01'; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed44; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #7c3aed66; }
        
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
          outline: 2px solid #7c3aed;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .header-container { flex-direction: column; align-items: flex-start !important; gap: 12px; }
          .scale-selector-wrapper { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
          .main-content { padding: 16px 12px !important; }
        }
        @media (max-width: 480px) {
          .semester-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .header-container h1 { font-size: clamp(20px, 5vw, 24px) !important; }
          button, .btn { min-height: 44px; }
          input, select, textarea { font-size: 16px !important; }
          .scale-selector-wrapper { gap: 8px !important; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header darkMode={darkMode} toggleDarkMode={handleToggleDarkMode} visitors={visitors} />
        <Navigation tab={tab} setTab={setTab} darkMode={darkMode} />

        {(tab === 'gpa' || tab === 'cgpa') && (
          <div
            className="scale-selector-wrapper"
            style={{
              padding: `${theme.spacing.md}px clamp(16px, 5vw, ${theme.spacing.lg}px) 0`,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              animation: 'fadeDown 0.4s ease-out',
            }}
          >
            <span style={{ fontSize: 'clamp(13px, 2vw, 14px)', fontWeight: 500, color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)', letterSpacing: '0.01em' }}>
              GPA Scale
            </span>
            <select
              value={scale}
              onChange={handleScaleChange}
              aria-label="Select GPA scale"
              className="glass"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 12,
                padding: '10px 18px',
                color: darkMode ? '#fff' : '#1a1035',
                fontSize: 'clamp(14px, 2vw, 15px)',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.25s ease',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${darkMode ? '%23ffffff99' : '%231a103599'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) => (e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')}
            >
              <option value="4.0">4.0 Scale</option>
              <option value="5.0">5.0 Scale</option>
              <option value="10.0">10.0 Scale</option>
            </select>
          </div>
        )}

        <main
          className="main-content"
          style={{
            padding: `clamp(16px, 4vw, ${theme.spacing.lg}px) clamp(16px, 5vw, ${theme.spacing.lg}px)`,
            animation: 'scaleIn 0.45s ease-out',
            transformOrigin: 'top center',
          }}
        >
          {tab === 'gpa' && <GPACalculator scale={scale} darkMode={darkMode} />}
          {tab === 'cgpa' && <CGPACalculator scale={scale} darkMode={darkMode} />}
          {tab === 'calculator' && <CalculatorPanel darkMode={darkMode} />}
        </main>

        <ContactSection darkMode={darkMode} />
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}