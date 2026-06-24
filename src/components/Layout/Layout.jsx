import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./Layout.module.css";

// ---------- SVG Icons ----------
const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
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

// Navigation item icons (no emojis)
const DashboardIcon = () => (
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
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const GPAIcon = () => (
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
    <path d="M22 10v6M2 10l10-7 10 7-10 7z" />
    <path d="M6 12v4" />
    <path d="M12 10v6" />
    <path d="M18 12v4" />
  </svg>
);

const CGPAIcon = () => (
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
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </svg>
);

const AboutIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ---------- Component ----------
export function Layout({ children }) {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", Icon: DashboardIcon },
    { path: "/gpa-calculator", label: "GPA Calculator", Icon: GPAIcon },
    { path: "/cgpa-calculator", label: "CGPA Calculator", Icon: CGPAIcon },
    { path: "/about", label: "About", Icon: AboutIcon },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = useCallback(
    (path) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    [location.pathname],
  );

  return (
    <div className={styles.layout} data-theme={darkMode ? "dark" : "light"}>
      {/* Header */}
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.headerContent}>
          <Link
            to="/"
            className={styles.logo}
            aria-label="Nexa Calculator Home"
          >
            <div className={styles.logoIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="var(--logo-bg, url(#logo-grad-layout))"
                />
                <path
                  d="M8 20V12l4 4 4-4v8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 12v8l4-4 4 4v-8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
                <defs>
                  <linearGradient
                    id="logo-grad-layout"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                  >
                    <stop stopColor="var(--color-brand-start, #3B82F6)" />
                    <stop
                      offset="1"
                      stopColor="var(--color-brand-end, #8B5CF6)"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.logoText}>
              Nexa<span className={styles.logoAccent}>Calc</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ""}`}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className={styles.navIcon}>
                  <item.Icon />
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            {/* Mobile Menu Toggle */}
            <button
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        <nav
          id="mobile-menu"
          className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}
          aria-hidden={!isMobileMenuOpen}
          aria-label="Mobile navigation"
        >
          <div className={styles.mobileNavContent}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${isActive(item.path) ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className={styles.navIcon}>
                  <item.Icon />
                </span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <svg
                    className={styles.activeIndicator}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7 10l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </main>

      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>Nexa Calculator</span>
            <p className={styles.footerTagline}>
              Professional Academic Performance Tool ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/about" className={styles.footerLink}>
              About
            </Link>
            <a
              href="mailto:support@nexacalculator.com"
              className={styles.footerLink}
            >
              Contact
            </a>
            <a href="#" className={styles.footerLink}>
              Privacy
            </a>
            <a href="#" className={styles.footerLink}>
              Terms
            </a>
          </div>
          <div className={styles.footerInfo}>
            <p className={styles.footerText}>
              Built with React + Vite + Firebase
            </p>
            <p className={styles.footerText}>Version 2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
