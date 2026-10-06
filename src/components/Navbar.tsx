import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export function Navbar() {
  const { headerConfig } = usePortfolio();
  const [kolkataTime, setKolkataTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(new Date());
        setKolkataTime(`KOLKATA ${timeStr} • UTC+5:30`);
      } catch {
        setKolkataTime('KOLKATA 18:30:00 • UTC+5:30');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { to: '/', label: 'Identity Card' },
    { to: '/work', label: 'Work & Projects' },
    { to: '/materials', label: 'Study Vault' },
    { to: '/about', label: 'About & Armory' },
    { to: '/contact', label: 'Contact Hub' }
  ];

  return (
    <header className="fixed-site-header">
      {/* RUNNING TICKER (CONFIGURABLE VIA BACKEND) */}
      <div className="header-ticker" aria-hidden="true">
        <div className="header-ticker-track">
          <span>{headerConfig.tickerText}</span>
          <span className="ticker-chip">CYBER-EDITORIAL PASS</span>
          <span className="ticker-beacon">●</span>
          <span>{headerConfig.tickerText}</span>
          <span className="ticker-chip">CYBER-EDITORIAL PASS</span>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="header-navbar">
        <Link to="/" className="header-brand-logo text-decoration-none">
          <span className="brand-main-text">{headerConfig.brandTitle || 'DIPANJAN BAIDYA'}</span>
          <span className="brand-sub-badge">{headerConfig.brandBadge || 'OFFICIAL PORTFOLIO'}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav-links hidden md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-[var(--g-neon-flash)] font-bold border-b border-[var(--g-emerald)] pb-0.5'
                    : 'text-[var(--g-offwhite)] hover:text-[var(--g-neon-flash)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="kolkata-time-chip">
            <span className="pulse-dot" />
            <span>{kolkataTime || 'KOLKATA 18:30:00 • UTC+5:30'}</span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="kolkata-time-chip border-0 p-0 text-[9px]">
            <span className="pulse-dot" />
            <span>{kolkataTime.split('•')[0]}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded border border-[var(--g-border)] bg-[var(--g-frame)] text-[var(--g-neon-flash)] font-mono text-xs"
          >
            {mobileMenuOpen ? '✕ CLOSE' : '☰ MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--g-black)] border-b border-[var(--g-border)] px-6 py-4 flex flex-col gap-3 font-mono text-xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-1.5 uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[var(--g-emerald)] font-bold' : 'text-neutral-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
