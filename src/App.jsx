import { useState, useEffect } from 'react';
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

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const visitors = useVisitors(1312);
  const [tab, setTab] = useState('gpa');
  const [scale, setScale] = useState('4.0');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <LoadingSpinner darkMode={darkMode} />;

  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        background: darkMode ? theme.colors.backgroundDark : theme.colors.backgroundLight,
        color: darkMode ? theme.colors.textPrimaryDark : theme.colors.textPrimaryLight,
        minHeight: '100vh',
        transition: theme.animation,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #1a1035; color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed44; border-radius: 4px; }
        @media (max-width: 768px) { .header-container { flex-direction: column; align-items: flex-start !important; gap: 12px; } }
        @media (max-width: 480px) { .semester-grid { grid-template-columns: 1fr !important; } .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .header-container h1 { font-size: clamp(20px, 5vw, 24px) !important; } button { min-height: 44px; } input, select, textarea { font-size: 16px !important; } }
      `}</style>

      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} visitors={visitors} />
      <Navigation tab={tab} setTab={setTab} darkMode={darkMode} />

      {(tab === 'gpa' || tab === 'cgpa') && (
        <div
          style={{
            padding: `${theme.spacing.md}px ${theme.spacing.lg}px 0`,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            }}
          >
            GPA Scale:
          </span>
          <select
            value={scale}
            onChange={e => setScale(e.target.value)}
            style={{
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 8,
              padding: '8px 16px',
              color: darkMode ? '#fff' : '#333',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option value="4.0">4.0 Scale</option>
            <option value="5.0">5.0 Scale</option>
            <option value="10.0">10.0 Scale</option>
          </select>
        </div>
      )}

      <main style={{ padding: `${theme.spacing.lg}px ${theme.spacing.lg}px` }}>
        {tab === 'gpa' && <GPACalculator scale={scale} darkMode={darkMode} />}
        {tab === 'cgpa' && <CGPACalculator scale={scale} darkMode={darkMode} />}
        {tab === 'calculator' && <CalculatorPanel darkMode={darkMode} />}
      </main>

      <ContactSection darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}