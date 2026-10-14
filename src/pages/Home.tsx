import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio, getYoutubeEmbedUrl } from '../context/PortfolioContext';
import type { BlogPost } from '../types';

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
  const {
    profile,
    headerConfig,
    youtubeVideos,
    projects,
    portalConfig,
    blogPosts,
    showToast
  } = usePortfolio();

  const chassisRef = useRef<HTMLDivElement | null>(null);
  const flipperRef = useRef<HTMLDivElement | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // Flashed projects showcase selection & rotating interval
  const flashedProjects = useMemo(() => {
    if (portalConfig?.flashedProjectIds && portalConfig.flashedProjectIds.length > 0) {
      const selected = projects.filter((p) => portalConfig.flashedProjectIds?.includes(p.id));
      if (selected.length > 0) return selected;
    }
    return projects.slice(0, 5);
  }, [projects, portalConfig?.flashedProjectIds]);

  const [flashedIdx, setFlashedIdx] = useState(0);

  useEffect(() => {
    if (flashedProjects.length <= 1) return;
    const interval = setInterval(() => {
      setFlashedIdx((prev) => (prev + 1) % flashedProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [flashedProjects.length]);

  const activeFlashedProject = flashedProjects[flashedIdx] || projects[0];

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
      const isMobile = window.innerWidth < 640;
      flipperRef.current.style.transform = next
        ? isMobile
          ? 'rotateY(180deg)'
          : 'perspective(1400px) rotateY(180deg)'
        : isMobile
          ? 'rotateY(0deg)'
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
              <div
                className={`pass-surface pass-surface-front ${
                  isFlipped ? 'surface-hidden' : 'surface-active'
                }`}
              >
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
                      📋 <span className="hidden xs:inline">COPY </span>EMAIL
                    </button>
                    <button
                      type="button"
                      className="btn-green-glass flex-1"
                      onClick={() => setIsQRModalOpen(true)}
                    >
                      📱 <span className="hidden xs:inline">SCAN </span>QR
                    </button>
                    <button type="button" className="btn-green-glass flex-1" onClick={togglePassFlip}>
                      ↻ FLIP<span className="hidden xs:inline"> CARD</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PASS BACK: DRAFT SPECS */}
              <div
                className={`pass-surface pass-surface-back ${
                  isFlipped ? 'surface-active' : 'surface-hidden'
                }`}
              >
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
                        rel="noopener noreferrer"
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
                        rel="noopener noreferrer"
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
                        rel="noopener noreferrer"
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
                        rel="noopener noreferrer"
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

      {/* PORTALS DIRECTORY SECTION [01]: VERTICAL MENU + FLASH SHOWCASE WINDOW */}
      <section className="space-y-4 pt-2">
        <div className="section-mini-header flex items-center justify-between">
          <h2>[01] Explore Directory & Portals</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-muted)] uppercase">
            ARCHITECTURAL PORTALS & RADAR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT: VERTICAL MENU OF 3 ARCHITECTURAL PAGES */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* PORTAL 1: WORK & PROJECTS */}
            <Link
              to="/work"
              className="group p-4 sm:p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="unit-badge-tag text-[9px]">CATALOG DECK</span>
                  <span className="text-xs font-mono text-[var(--g-emerald)] group-hover:translate-x-1 transition-transform">
                    EXPLORE →
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                  Work & Projects ↗
                </h3>
                <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                  {portalConfig?.workDesc || 'Interactive engineering portfolio, production web systems, and system utilities.'}
                </p>
              </div>
            </Link>

            {/* PORTAL 2: STUDY VAULT */}
            <Link
              to="/materials"
              className="group p-4 sm:p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="unit-badge-tag text-[9px]">DOWNLOAD VAULT</span>
                  <span className="text-xs font-mono text-[var(--g-emerald)] group-hover:translate-x-1 transition-transform">
                    ACCESS →
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                  Study Materials ↗
                </h3>
                <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                  {portalConfig?.materialsDesc || 'Curated technical packages, engineering notes, and toolchains.'}
                </p>
              </div>
            </Link>

            {/* PORTAL 3: ABOUT & JOURNEY */}
            <Link
              to="/about"
              className="group p-4 sm:p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="unit-badge-tag text-[9px]">PROFILE & ARMORY</span>
                  <span className="text-xs font-mono text-[var(--g-emerald)] group-hover:translate-x-1 transition-transform">
                    VIEW →
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                  About & Journey ↗
                </h3>
                <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                  {portalConfig?.aboutDesc || '25-skill technical stack, academic engineering timeline, and background.'}
                </p>
              </div>
            </Link>
          </div>

          {/* RIGHT: FLASHING SHOWCASE WINDOW (PROJECT RADAR) */}
          <div className="lg:col-span-7 rounded-xl bg-black/60 border border-[var(--g-border-solid)] p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Top scanning header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--g-emerald)] shadow-[0_0_8px_var(--g-emerald)] animate-pulse" />
                <span className="text-[var(--g-neon-flash)] font-bold tracking-wider uppercase">
                  [RADAR // PROJECT FLASH DISPLAY]
                </span>
              </div>
              {flashedProjects.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400">
                    0{flashedIdx + 1} / 0{flashedProjects.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFlashedIdx((prev) => (prev - 1 + flashedProjects.length) % flashedProjects.length)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                    title="Previous project"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlashedIdx((prev) => (prev + 1) % flashedProjects.length)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                    title="Next project"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* Active Flashed Project Card */}
            {activeFlashedProject ? (
              <div className="space-y-4 my-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="unit-badge-tag text-[9px] uppercase tracking-wider">
                    {activeFlashedProject.badge || 'FEATURED'}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--g-emerald)] uppercase">
                    // {activeFlashedProject.category}
                  </span>
                </div>

                <h4 className="font-display text-2xl sm:text-3xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors leading-tight">
                  {activeFlashedProject.title}
                </h4>

                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed line-clamp-3">
                  {activeFlashedProject.desc}
                </p>

                {activeFlashedProject.tags && activeFlashedProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeFlashedProject.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono text-neutral-300 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="my-auto text-center font-mono text-xs text-[var(--g-muted)] py-8">
                SCANNING CHANNELS... NO ACTIVE PROJECTS MARKED FOR RADAR.
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                {activeFlashedProject?.liveUrl && (
                  <a
                    href={activeFlashedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--g-neon-flash)] hover:underline font-bold"
                  >
                    LIVE DEMO ↗
                  </a>
                )}
                {activeFlashedProject?.githubUrl && (
                  <a
                    href={activeFlashedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white underline"
                  >
                    SOURCE CODE ↗
                  </a>
                )}
              </div>
              <Link
                to="/work"
                className="btn-green-glass py-1.5 px-3 text-[11px] text-decoration-none"
              >
                VIEW ALL PROJECTS ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SLEEK VERTICAL SOCIAL NETWORKS HUB & EXPANSION VOID [02] */}
      <section className="space-y-4 pt-2">
        <div className="section-mini-header flex items-center justify-between">
          <h2>[02] Social Networks & Transformation Hub</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-neon-flash)] uppercase">
            ACTIVE CHANNELS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT: VERTICAL SOCIAL MENU */}
          <div className="lg:col-span-6 flex flex-col gap-2">
            {profile.socials && profile.socials.length > 0 ? (
              profile.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] hover:bg-[rgba(255,122,0,0.12)] transition-all flex items-center justify-between group text-decoration-none shadow-md"
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
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] font-mono text-xs text-[var(--g-muted)]">
                NO SOCIAL CHANNELS LINKED.
              </div>
            )}
          </div>

          {/* RIGHT: RESERVED VOID BLACK SPACE FOR FUTURE INTEGRATIONS */}
          <div className="lg:col-span-6 min-h-[160px] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[var(--g-neon-flash)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--g-neon-flash)] animate-pulse" />
                <span>[BAY 02 // RESERVED VOID]</span>
              </div>
              <p className="text-xs font-mono text-neutral-400 max-w-xs leading-relaxed">
                FUTURE INTEGRATION STANDBY // EXPANSION MATRIX RESERVED FOR UPCOMING HARDWARE & TELEMETRY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AMBIENT CONTINUOUS PLAIN VIDEO SHOWCASE (CMS CONTROLLED, UNINTERRUPTIBLE, ZERO ADS/CONTROLS) */}
      {youtubeVideos && youtubeVideos.length > 0 && (
        <section className="pt-2">
          <div
            className={`grid grid-cols-1 ${
              youtubeVideos.length === 1
                ? 'max-w-2xl mx-auto'
                : youtubeVideos.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3'
            } gap-4`}
          >
            {youtubeVideos.map((videoUrl, idx) => {
              if (!videoUrl || !videoUrl.trim()) return null;
              const direct = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(videoUrl.trim());
              const embedUrl = direct ? null : getYoutubeEmbedUrl(videoUrl, true);
              if (!direct && !embedUrl) return null;

              return (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[var(--g-border-solid)] shadow-2xl select-none group"
                >
                  {/* Plain continuous ambient playback wrapper */}
                  <div className="absolute inset-0 pointer-events-none scale-[1.3] transform-gpu flex items-center justify-center overflow-hidden">
                    {direct ? (
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <iframe
                        src={embedUrl!}
                        title={`Ambient Stream ${idx + 1}`}
                        className="w-full h-full border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        tabIndex={-1}
                      />
                    )}
                  </div>
                  {/* Click shield: prevents stopping or interacting with player */}
                  <div
                    className="absolute inset-0 bg-transparent cursor-default pointer-events-auto"
                    aria-hidden="true"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FIELD DISPATCHES & BLOG JOURNAL (CMS CONTROLLED POSTS) */}
      {blogPosts && blogPosts.filter((p) => p.published !== false).length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="section-mini-header flex items-center justify-between">
            <h2>[03] Field Dispatches & Terminal Journal</h2>
            <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-emerald)] uppercase">
              RECENT LOGS & ESSAYS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts
              .filter((p) => p.published !== false)
              .map((post) => (
                <article
                  key={post.id}
                  className="p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between shadow-lg group hover:-translate-y-1"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--g-muted)]">
                      <span className="unit-badge-tag text-[9px]">{post.tag || 'SYSTEMS'}</span>
                      <span>{post.readTime || '3 MIN READ'}</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[var(--g-muted)] leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">{post.date}</span>
                    <button
                      type="button"
                      onClick={() => setReadingPost(post)}
                      className="text-[var(--g-neon-flash)] hover:underline font-bold"
                    >
                      READ DISPATCH →
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {/* DISPATCH READING MODAL */}
      {readingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-xl bg-[var(--g-frame)] border border-[var(--g-emerald)] p-6 sm:p-8 flex flex-col shadow-2xl space-y-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--g-emerald)]">
                  <span className="unit-badge-tag text-[9px]">{readingPost.tag || 'SYSTEMS'}</span>
                  <span>●</span>
                  <span>{readingPost.date}</span>
                  <span>●</span>
                  <span>{readingPost.readTime || '3 MIN READ'}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  {readingPost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReadingPost(null)}
                className="text-neutral-400 hover:text-white text-xl p-1 font-mono"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 font-sans text-sm text-neutral-300 leading-relaxed max-h-[60vh]">
              {readingPost.summary && (
                <p className="font-mono text-xs text-[var(--g-neon-flash)] bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.25)] rounded-lg p-3">
                  {readingPost.summary}
                </p>
              )}
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {readingPost.content}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between font-mono text-xs">
              <span className="text-neutral-500">AUTHOR // {profile.fullName}</span>
              <button
                type="button"
                onClick={() => setReadingPost(null)}
                className="btn-green-glass py-1.5 px-4 font-bold"
              >
                CLOSE DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}

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
