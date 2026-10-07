import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export function Navbar() {
  const { headerConfig } = usePortfolio();
  const [kolkataTime, setKolkataTime] = useState('');

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
        setKolkataTime(`${timeStr} IST`);
      } catch {
        setKolkataTime('18:30 IST');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // If user turned off header in CMS, don't render it
  if (headerConfig.showHeader === false) {
    return null;
  }

  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: '/work',
      label: 'Projects',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      to: '/materials',
      label: 'Vault',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      to: '/about',
      label: 'About',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      to: '/contact',
      label: 'Contact',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // Check if there is a custom brand title that is NOT "Identity Card"
  const showCustomBrand =
    headerConfig.brandTitle &&
    headerConfig.brandTitle.trim().toLowerCase() !== 'identity card' &&
    headerConfig.brandTitle.trim() !== '';

  return (
    <header className="fixed-site-header">
      {/* OPTIONAL TICKER MARQUEE (CONFIGURABLE VIA BACKEND CMS) */}
      {headerConfig.showTicker && (
        <div className="header-ticker" aria-hidden="true">
          <div className="header-ticker-track">
            <span>{headerConfig.tickerText}</span>
            <span className="ticker-chip">SYSTEMS HUB</span>
            <span className="ticker-beacon">●</span>
            <span>{headerConfig.tickerText}</span>
            <span className="ticker-chip">SYSTEMS HUB</span>
          </div>
        </div>
      )}

      {/* SLEEK NAVBAR: All menus line up cleanly without cropping */}
      <div className="header-navbar">
        {/* Optional Brand Title on Desktop (Hidden on mobile or if not set, no 'Identity Card') */}
        {showCustomBrand && (
          <Link to="/" className="header-brand-logo hidden md:flex items-center gap-2 text-decoration-none group">
            <span className="w-2 h-2 rounded-full bg-[var(--g-emerald)] shadow-[0_0_8px_var(--g-emerald)] group-hover:scale-125 transition-transform" />
            <span className="brand-main-text text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
              {headerConfig.brandTitle}
            </span>
          </Link>
        )}

        {/* Navigation Menus: Perfectly lined up on phones and PCs */}
        <nav className="w-full md:w-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 sm:px-3 rounded-md sm:rounded-full text-[11px] sm:text-xs font-mono transition-all text-center ${
                  isActive
                    ? 'bg-[rgba(255,122,0,0.2)] text-[var(--g-neon-flash)] border border-[rgba(255,122,0,0.5)] font-bold shadow-[0_0_10px_rgba(255,122,0,0.25)]'
                    : 'text-[var(--g-offwhite)] hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <span className="opacity-80 shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Compact Kolkata Time on wide desktop screens */}
        <div className="kolkata-time-chip hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10 text-[10px] font-mono text-[var(--g-muted)]">
          <span className="pulse-dot" />
          <span>{kolkataTime || 'KOLKATA'}</span>
        </div>
      </div>
    </header>
  );
}
