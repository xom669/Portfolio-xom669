import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('git')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  if (p.includes('insta')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes('discord')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }
  if (p.includes('telegram')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export default function Home() {
  const { profile, headerConfig, showToast } = usePortfolio();

  const chassisRef = useRef<HTMLDivElement | null>(null);
  const flipperRef = useRef<HTMLDivElement | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // 3D gyroscopic tilt tracking (disabled on touch devices for mobile stability)
  useEffect(() => {
    const chassis = chassisRef.current;
    const flipper = flipperRef.current;
    if (!chassis || !flipper) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 640) return;

      const rect = chassis.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -5;
      const tiltY = (x / (rect.width / 2)) * 5;

      if (!isFlipped) {
        flipper.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      } else {
        flipper.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${180 + tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
      }
    };

    const handleMouseLeave = () => {
      if (!isFlipped) {
        flipper.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      } else {
        flipper.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(180deg) scale3d(1, 1, 1)';
      }
    };

    chassis.addEventListener('mousemove', handleMouseMove);
    chassis.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      chassis.removeEventListener('mousemove', handleMouseMove);
      chassis.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isFlipped]);

  const togglePassFlip = () => {
    const next = !isFlipped;
    setIsFlipped(next);
    if (flipperRef.current) {
      flipperRef.current.style.transform = next
        ? 'perspective(1400px) rotateY(180deg)'
        : 'perspective(1400px) rotateY(0deg)';
    }
  };

  const copyContact = () => {
    navigator.clipboard
      .writeText(profile.email)
      .then(() => showToast(`✓ Email copied: ${profile.email}`))
      .catch(() => showToast(`Email: ${profile.email}`));
  };

  const spacingClass =
    headerConfig?.cardSpacing === 'compact'
      ? 'pt-2 sm:pt-4'
      : headerConfig?.cardSpacing === 'normal'
      ? 'pt-6 sm:pt-8'
      : 'pt-0 sm:pt-1';

  return (
    <div className={`space-y-8 sm:space-y-12 ${spacingClass}`}>
      {/* OPTIONAL CUSTOM HERO TEXT CONFIGURED FROM CMS */}
      {headerConfig?.customHeroText && (
        <div className="text-center max-w-2xl mx-auto px-4 py-2">
          <p className="font-mono text-xs sm:text-sm text-[var(--g-neon-flash)] bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.25)] rounded-lg py-2.5 px-4 shadow-sm inline-block">
            {headerConfig.customHeroText}
          </p>
        </div>
      )}

      {/* FRONT & CENTER VIRTUAL CARD ("ABOUT ME") WITH 3D GYROSCOPIC TILT */}
      {headerConfig?.showCard !== false && (
        <section className="card-hero-centering" id="aboutCard">
          <div className="pass-3d-chassis" ref={chassisRef}>
            <div
              className={`pass-flipper-container ${isFlipped ? 'flipped' : ''}`}
              ref={flipperRef}
            >
              {/* PASS FRONT */}
              <div className="pass-surface pass-surface-front">
                {/* TOP COVER BANNER (Clean, removed 'Pass #xom669' & 'Edit CMS') */}
                <div className="card-cover-banner-wrap">
                  <img
                    src={profile.coverBanner}
                    alt="Panoramic cover banner"
                    className="card-cover-banner-img"
                  />
                  <div className="banner-dark-gradient" />
                </div>

                {/* CARD BODY OVERLAPPING BANNER */}
                <div className="card-body-content">
                  <div className="avatar-name-cluster">
                    <div className="card-small-photo-frame">
                      <img
                        src={profile.avatarImage || '/dipanjan_avatar.png'}
                        alt={profile.fullName}
                        className="avatar-img-circle"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/dipanjan_avatar.svg';
                        }}
                      />
                      <div className="online-indicator-pip" title="Active & Available" />
                    </div>

                    <div className="card-hero-titles">
                      <h1>{profile.fullName}</h1>
                      <p>{profile.moniker} • {profile.headline.toUpperCase()}</p>
                    </div>
                  </div>

                  <p className="about-glimpse-text">{profile.bio}</p>

                  {/* SOCIAL MEDIA QUICK BADGES ON CARD */}
                  <div className="mb-4">
                    <span className="text-[10px] font-mono text-[var(--g-muted)] uppercase tracking-wider block mb-1.5">
                      TRANSMISSION CHANNELS & SOCIALS:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.socials && profile.socials.length > 0 ? (
                        profile.socials.map((s) => (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.3)] hover:bg-[var(--g-emerald)] hover:text-black transition-all text-[11px] font-mono flex items-center gap-1.5 text-neutral-200"
                          >
                            <span className="font-bold text-[var(--g-neon-flash)] hover:text-black">
                              {s.platform}
                            </span>
                            <span className="opacity-80 text-[10px] hidden sm:inline">{s.handle}</span>
                          </a>
                        ))
                      ) : (
                        <span className="text-xs font-mono text-[var(--g-muted)]">No socials linked.</span>
                      )}
                    </div>
                  </div>

                  {/* COMPACT KEY METRICS */}
                  <div className="card-key-facts-grid">
                    <div className="key-fact">
                      <span className="label">Main Web Hub</span>
                      <span className="val">{profile.webHub}</span>
                    </div>
                    <div className="key-fact">
                      <span className="label">Location</span>
                      <span className="val">{profile.location}</span>
                    </div>
                    <div className="key-fact">
                      <span className="label">Primary Email</span>
                      <span className="val truncate">{profile.email}</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Clean, removed vCard download button) */}
                  <div className="card-action-btns-row">
                    <button type="button" className="btn-green-glass btn-highlight flex-1" onClick={copyContact}>
                      📋 COPY EMAIL
                    </button>
                    <button
                      type="button"
                      className="btn-green-glass flex-1"
                      onClick={() => setIsQRModalOpen(true)}
                    >
                      📱 SCAN QR
                    </button>
                    <button type="button" className="btn-green-glass flex-1" onClick={togglePassFlip}>
                      ↻ FLIP CARD
                    </button>
                  </div>
                </div>
              </div>

              {/* PASS BACK: DRAFT SPECS */}
              <div className="pass-surface pass-surface-back">
                <div>
                  <div className="back-nav-bar">
                    <span className="back-draft-badge text-[10px] sm:text-xs">
                      [IDENTITY SPECIFICATION SHEET // TELEMETRY]
                    </span>
                    <button
                      type="button"
                      className="btn-green-glass py-1 px-2.5 text-[10px]"
                      onClick={togglePassFlip}
                    >
                      ↺ FLIP FRONT
                    </button>
                  </div>

                  <div className="draft-field-table">
                    <div className="draft-field-row">
                      <span className="k">FULL LEGAL NAME:</span>
                      <span className="v">{profile.fullName}</span>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">ALIAS / MONIKER:</span>
                      <span className="v">{profile.moniker}</span>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">PRIMARY CODEBASE:</span>
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="v truncate max-w-[200px] sm:max-w-none text-[var(--g-neon-flash)] hover:underline"
                      >
                        {profile.githubUrl.replace('https://', '')}
                      </a>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">LINKEDIN NETWORK:</span>
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="v truncate max-w-[200px] sm:max-w-none text-[var(--g-neon-flash)] hover:underline"
                      >
                        {profile.linkedinUrl.replace('https://', '')}
                      </a>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">INSTAGRAM:</span>
                      <a
                        href={profile.instagramUrl || 'https://instagram.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="v text-[var(--g-neon-flash)] hover:underline"
                      >
                        {profile.instagramHandle || '@dipanjan.baidya'}
                      </a>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">X / TWITTER:</span>
                      <a
                        href={profile.twitterUrl || 'https://twitter.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="v text-[var(--g-neon-flash)] hover:underline"
                      >
                        {profile.twitterHandle || '@xom669'}
                      </a>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">CURRENT DEGREE / FIELD:</span>
                      <span className="v">{profile.degree}</span>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">SPECIALIZATION DRAFT:</span>
                      <span className="v">{profile.specialization}</span>
                    </div>
                    <div className="draft-field-row">
                      <span className="k">SECURITY PGP HASH:</span>
                      <span className="v text-[10px] sm:text-[11px] font-mono">{profile.pgpHash}</span>
                    </div>
                  </div>
                </div>

                <div className="card-action-btns-row mt-4">
                  <button type="button" className="btn-green-glass btn-highlight w-full" onClick={togglePassFlip}>
                    ↺ RETURN TO FRONT IDENTITY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PORTALS DIRECTORY SECTION [01] */}
      <section className="space-y-4 pt-2">
        <div className="section-mini-header">
          <h2>[01] Explore Directory & Portals</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-muted)] uppercase">
            ARCHITECTURAL PAGES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PORTAL CARD 1: WORK & PROJECTS */}
          <Link
            to="/work"
            className="group p-5 sm:p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-2.5">
              <span className="unit-badge-tag text-[9px]">CATALOG DECK</span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                Work & Projects ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                Alpine Linux live ISOs, luxury real estate editorial brochures, microsecond automation engines, and modern web apps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>EXPLORE DECK</span>
              <span>→</span>
            </div>
          </Link>

          {/* PORTAL CARD 2: STUDY VAULT */}
          <Link
            to="/materials"
            className="group p-5 sm:p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-2.5">
              <span className="unit-badge-tag text-[9px]">DOWNLOAD VAULT</span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                Study Materials ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                Curated lecture decks, algorithms & DSA revision notes, Alpine ISO build scripts, and vector UI starter packs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>ACCESS VAULT</span>
              <span>→</span>
            </div>
          </Link>

          {/* PORTAL CARD 3: ABOUT & ARMORY */}
          <Link
            to="/about"
            className="group p-5 sm:p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-2.5">
              <span className="unit-badge-tag text-[9px]">PROFILE & ARMORY</span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                About & Journey ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                The full 25-Skill Armory, academic engineering timeline, creative philosophies, and milestones.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>VIEW ARMORY</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* SLEEK MINIMAL SOCIAL NETWORKS HUB [02] */}
      <section className="space-y-4 pt-2">
        <div className="section-mini-header flex items-center justify-between">
          <h2>[02] Social Networks & Transformation Hub</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-neon-flash)] uppercase">
            ACTIVE CHANNELS
          </span>
        </div>

        {/* Minimal Social Links Grid with Icon + Clickable Link beside it */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.socials && profile.socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-3.5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] hover:bg-[rgba(255,122,0,0.12)] transition-all flex items-center justify-between group text-decoration-none shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-[rgba(255,255,255,0.06)] border border-white/10 flex items-center justify-center text-[var(--g-neon-flash)] group-hover:scale-110 group-hover:text-[var(--g-emerald)] transition-all shrink-0">
                  {getPlatformIcon(social.platform)}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[10px] font-mono text-[var(--g-muted)] uppercase tracking-wider">
                    {social.platform}
                  </span>
                  <span className="font-mono text-xs text-white group-hover:text-[var(--g-neon-flash)] font-bold truncate">
                    {social.handle || social.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-[var(--g-muted)] group-hover:text-[var(--g-neon-flash)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* QR SCANNER MODAL */}
      <div className={`rb-modal-shield ${isQRModalOpen ? 'open' : ''}`}>
        <div className="modal-box-card" style={{ textAlign: 'center' }}>
          <div className="modal-top-row">
            <h3>Instant Phone Scanner</h3>
            <button
              type="button"
              className="btn-close-modal"
              onClick={() => setIsQRModalOpen(false)}
            >
              &times;
            </button>
          </div>
          <p className="font-mono text-xs text-[var(--g-muted)] mb-5">
            Scan with smartphone camera to load {profile.fullName}'s virtual identity card and verified routes.
          </p>
          <div className="bg-white p-4 inline-block rounded border-2 border-[var(--g-emerald)] shadow-[0_0_25px_rgba(255,122,0,0.45)]">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2F${encodeURIComponent(profile.webHub)}`}
              alt="Virtual Card QR"
              width="200"
              height="200"
              className="mx-auto block"
            />
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="btn-green-glass btn-highlight w-full py-2"
              onClick={() => setIsQRModalOpen(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
