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
        setKolkataTime('18:30:00 IST');
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
      to: '/modilinifight',
      label: 'Apps & Games',
      isExternal: true,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <span className="ticker-chip">SYSTEMS HUB</span>
            <span className="ticker-beacon">●</span>
            <span>{headerConfig.tickerText}</span>
            <span className="ticker-chip">SYSTEMS HUB</span>
          </div>
        </div>
      )}

      {/* MAIN NAVIGATION HEADER: HOME, APPS & GAMES, PROJECTS, VAULT, ABOUT, CONTACT */}
      <div className="header-nav-layer px-2 sm:px-6 py-2 bg-black/60 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-2xl mx-auto grid grid-cols-6 gap-1 sm:gap-2">
          {navLinks.map((link) =>
            'isExternal' in link && link.isExternal ? (
              <a
                key={link.to}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 sm:px-2 rounded text-[10px] sm:text-xs font-mono font-medium transition-colors text-center text-decoration-none text-neutral-300 hover:text-[var(--g-neon-flash)] hover:bg-white/5 border border-transparent"
              >
                <span className="opacity-80 shrink-0">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 sm:px-2 rounded text-[10px] sm:text-xs font-mono font-medium transition-colors text-center text-decoration-none ${
                    isActive
                      ? 'bg-[rgba(255,122,0,0.22)] text-[var(--g-neon-flash)] border border-[rgba(255,122,0,0.5)] shadow-[0_0_10px_rgba(255,122,0,0.2)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <span className="opacity-80 shrink-0">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* SUB-BAR BELOW HEADER: IST TIME TICKER */}
      <div className="header-ist-subbar border-b border-white/10 bg-black/80 backdrop-blur-md px-3 sm:px-6 py-1 font-mono text-[10px]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--g-emerald)] shadow-[0_0_6px_var(--g-emerald)] animate-pulse" />
            <span className="tracking-wider uppercase">KOLKATA • INDIA</span>
          </div>
          <div className="text-[var(--g-neon-flash)] font-medium tracking-wider">
            ● {kolkataTime || '19:30:00 IST'}
          </div>
        </div>
      </div>
    </header>
  );
}
