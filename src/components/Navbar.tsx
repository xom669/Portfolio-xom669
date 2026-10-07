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
      label: 'Identity',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
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

  return (
    <header className="fixed-site-header">
      {/* OPTIONAL TICKER MARQUEE (CONFIGURABLE VIA BACKEND CMS) */}
      {headerConfig.showTicker && (
        <div className="header-ticker" aria-hidden="true">
          <div className="header-ticker-track">
            <span>{headerConfig.tickerText}</span>
            <span className="ticker-chip">IDENTITY HUB</span>
            <span className="ticker-beacon">●</span>
            <span>{headerConfig.tickerText}</span>
            <span className="ticker-chip">IDENTITY HUB</span>
          </div>
        </div>
      )}

      {/* SLEEK MINIMAL NAVBAR */}
      <div className="header-navbar">
        <Link to="/" className="header-brand-logo text-decoration-none group">
          <span className="w-2 h-2 rounded-full bg-[var(--g-emerald)] shadow-[0_0_8px_var(--g-emerald)] group-hover:scale-125 transition-transform" />
          <span className="brand-main-text text-sm sm:text-base font-bold tracking-tight">
            {headerConfig.brandTitle || 'Identity Card'}
          </span>
          {headerConfig.brandBadge && (
            <span className="brand-sub-badge text-[9px] uppercase tracking-wider py-0.5 px-1.5 hidden sm:inline-block">
              {headerConfig.brandBadge}
            </span>
          )}
        </Link>

        {/* Desktop Navigation - Sleek & Spaced to never overflow */}
        <nav className="header-nav-links hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[rgba(255,122,0,0.18)] text-[var(--g-neon-flash)] border border-[rgba(255,122,0,0.4)] shadow-[0_0_12px_rgba(255,122,0,0.2)] font-bold'
                    : 'text-[var(--g-offwhite)] hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <span className="opacity-80">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* Compact Kolkata Time - Only on wide desktop to prevent crowding */}
          <div className="kolkata-time-chip hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10 text-[10px] font-mono text-[var(--g-muted)]">
            <span className="pulse-dot" />
            <span>{kolkataTime || 'KOLKATA'}</span>
          </div>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-md border border-[var(--g-border)] bg-[rgba(255,255,255,0.04)] text-[var(--g-neon-flash)] font-mono text-xs hover:bg-[rgba(255,122,0,0.12)] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="text-sm">{mobileMenuOpen ? '✕' : '☰'}</span>
            <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Sleek & Compact */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(10,4,20,0.98)] backdrop-blur-2xl border-b border-[var(--g-border)] px-4 py-3 flex flex-col gap-1 font-mono text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[rgba(255,122,0,0.18)] text-[var(--g-neon-flash)] font-bold border border-[rgba(255,122,0,0.35)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-[var(--g-emerald)]">{link.icon}</span>
              <span className="tracking-wide uppercase text-[11px]">{link.label}</span>
            </NavLink>
          ))}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[var(--g-muted)] px-1">
            <span className="flex items-center gap-1.5">
              <span className="pulse-dot" />
              <span>KOLKATA {kolkataTime}</span>
            </span>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--g-emerald)] hover:underline"
            >
              CMS Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
