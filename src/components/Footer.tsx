import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export function Footer() {
  const { footerConfig, profile, downloadVCard } = usePortfolio();

  return (
    <footer className="fixed-site-footer">
      <div className="footer-inner-content">
        <Link
          to="/"
          className="footer-kinetic-brand text-decoration-none"
          title="Return to Home Identity Card"
        >
          <span className="year">{footerConfig.year || '2026'}</span>
          <span className="name">{footerConfig.brandmarkText || 'DIPANJAN BAIDYA'}</span>
          <span style={{ color: 'var(--g-neon-flash)', fontSize: '10px' }}>
            // {footerConfig.subText || 'OFFICIAL PORTFOLIO'}
          </span>
        </Link>

        <div className="footer-actions">
          <a
            href={profile.githubUrl || 'https://github.com/dipanjanbaidya2007'}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href={profile.linkedinUrl || 'https://www.linkedin.com/in/dipanjanbaidya/'}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href={`mailto:${profile.email || 'dipanjanbaidya2007@gmail.com'}`}>
            Direct Email
          </a>
          <Link
            to="/admin"
            className="p-1 rounded text-[var(--g-muted)] hover:text-[var(--g-neon-flash)] hover:bg-[rgba(255,122,0,0.12)] transition-colors opacity-65 hover:opacity-100 flex items-center justify-center"
            title="Studio CMS Access"
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
          <button type="button" className="footer-pill-btn" onClick={downloadVCard}>
            DOWNLOAD V-CARD
          </button>
        </div>
      </div>
    </footer>
  );
}
