import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export function Footer() {
  const { footerConfig, profile } = usePortfolio();

  return (
    <footer className="fixed-site-footer">
      <div className="footer-inner-content">
        <div className="footer-kinetic-brand text-[11px] sm:text-xs">
          <span className="year text-[var(--g-emerald)]">{footerConfig.year || '2026'}</span>
          <span className="name text-neutral-300 font-semibold">{footerConfig.brandmarkText || 'DIPANJAN BAIDYA'}</span>
          {footerConfig.subText && (
            <span className="text-[10px] text-[var(--g-muted)] font-mono hidden sm:inline">
              // {footerConfig.subText}
            </span>
          )}
        </div>

        <div className="footer-actions flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono">
          <a
            href={profile.githubUrl || 'https://github.com/dipanjanbaidya2007'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--g-offwhite)] hover:text-[var(--g-neon-flash)] transition-colors"
          >
            GitHub
          </a>
          <span className="text-white/20">•</span>
          <a
            href={profile.linkedinUrl || 'https://www.linkedin.com/in/dipanjanbaidya/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--g-offwhite)] hover:text-[var(--g-neon-flash)] transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-white/20">•</span>
          <a
            href={`mailto:${profile.email || 'dipanjan@xom669.in'}`}
            className="text-[var(--g-offwhite)] hover:text-[var(--g-neon-flash)] transition-colors"
          >
            Email
          </a>
          <Link
            to="/admin"
            className="ml-1 p-1 rounded text-[var(--g-muted)] hover:text-[var(--g-neon-flash)] hover:bg-[rgba(255,122,0,0.12)] transition-colors opacity-75 hover:opacity-100 flex items-center justify-center"
            title="Studio CMS"
            aria-label="Studio CMS"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
