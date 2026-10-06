import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function Home() {
  const { profile, downloadVCard, showToast } = usePortfolio();

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
      // Don't apply high tilt on narrow phone screens
      if (window.innerWidth < 640) return;

      const rect = chassis.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      if (!isFlipped) {
        flipper.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
      } else {
        flipper.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${180 + tiltY}deg) scale3d(1.012, 1.012, 1.012)`;
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

  const copyHandle = (handle: string, platform: string) => {
    navigator.clipboard
      .writeText(handle)
      .then(() => showToast(`✓ Copied ${platform} handle: ${handle}`))
      .catch(() => showToast(`${platform}: ${handle}`));
  };

  const renderLivingWords = (word: string) => {
    return word.split('').map((char, index) => {
      const rot = (((index * 17 + 5) % 16) - 8).toFixed(1);
      return (
        <span
          key={index}
          className="bounce-glyph"
          style={{ '--rot': rot } as CSSProperties}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* LAURA MESEGUER LIVING KINETIC TYPE HERO */}
      <div className="hero-type-stage">
        <div className="living-kinetic-logo">
          <div className="logo-word-group">{renderLivingWords('DIPANJAN')}</div>
          <div className="logo-word-group">{renderLivingWords('BAIDYA')}</div>
          <div className="logo-word-group" style={{ color: 'var(--g-emerald)' }}>
            //
          </div>
          <div className="logo-word-group">{renderLivingWords(profile.moniker || 'XOM 669')}</div>
        </div>

        {/* Below the header: removed "official portfolio" from the side as requested */}
        <div className="font-mono text-xs text-[var(--g-muted)] flex justify-end items-center">
          <span className="text-[10px] sm:text-xs text-[var(--g-neon-flash)] tracking-wider">
            ● BASE TELEMETRY: {profile.location.toUpperCase()}
          </span>
        </div>
      </div>

      {/* FRONT & CENTER VIRTUAL CARD ("ABOUT ME") WITH 3D GYROSCOPIC TILT */}
      <section className="card-hero-centering" id="aboutCard">
        <div className="pass-3d-chassis" ref={chassisRef}>
          <div
            className={`pass-flipper-container ${isFlipped ? 'flipped' : ''}`}
            ref={flipperRef}
          >
            {/* PASS FRONT */}
            <div className="pass-surface pass-surface-front">
              {/* TOP COVER BANNER */}
              <div className="card-cover-banner-wrap">
                <img
                  src={profile.coverBanner}
                  alt="Panoramic cover banner"
                  className="card-cover-banner-img"
                />
                <div className="banner-dark-gradient" />

                <div className="banner-corner-actions">
                  <span className="banner-badge-tag text-[9px] sm:text-[10px]">PASS #XOM-669-KOL</span>
                  <Link
                    to="/admin"
                    className="banner-btn-upload text-decoration-none text-[9px] sm:text-[10px]"
                    title="Customize in Studio Backend"
                  >
                    <span>⚙ EDIT CMS</span>
                  </Link>
                </div>
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

                {/* SOCIAL MEDIA QUICK BADGES ON CARD (SYNCED WITH BACKEND) */}
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

                {/* ACTION BUTTONS */}
                <div className="card-action-btns-row">
                  <button
                    type="button"
                    className="btn-green-glass btn-highlight"
                    onClick={downloadVCard}
                  >
                    ⬇ DOWNLOAD .VCF
                  </button>
                  <button type="button" className="btn-green-glass" onClick={copyContact}>
                    📋 COPY EMAIL
                  </button>
                  <button
                    type="button"
                    className="btn-green-glass"
                    onClick={() => setIsQRModalOpen(true)}
                  >
                    📱 SCAN QR
                  </button>
                  <button type="button" className="btn-green-glass" onClick={togglePassFlip}>
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
                    [DRAFT SPECIFICATION SHEET // VERIFIED IDENTITY TELEMETRY]
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
                      className="v truncate max-w-[200px] sm:max-w-none"
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
                      className="v truncate max-w-[200px] sm:max-w-none"
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
                      className="v"
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
                      className="v"
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
                    <span className="v text-[10px] sm:text-[11px]">{profile.pgpHash}</span>
                  </div>
                </div>

                <div className="draft-notes-box">
                  <strong style={{ color: 'var(--g-neon-flash)' }}>
                    CONFIGURABLE TELEMETRY:
                  </strong>
                  <br />
                  All parameters and social profiles on this card synchronize live from the Studio Backend CMS.
                </div>
              </div>

              <div className="card-action-btns-row">
                <button
                  type="button"
                  className="btn-green-glass btn-highlight"
                  onClick={downloadVCard}
                >
                  ⬇ SAVE V-CARD TO PHONE
                </button>
                <button type="button" className="btn-green-glass" onClick={togglePassFlip}>
                  ↺ RETURN TO FRONT IDENTITY
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTALS DIRECTORY SECTION [01] */}
      <section className="space-y-6 pt-4">
        <div className="section-mini-header">
          <h2>[01] Explore Directory & Portals</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-muted)] uppercase">
            SEPARATE ARCHITECTURAL PAGES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* PORTAL CARD 1: WORK & PROJECTS */}
          <Link
            to="/work"
            className="group p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="unit-badge-tag text-[10px]">CATALOG DECK</span>
              <h3 className="font-display text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                Work & Projects ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                Alpine Linux live ISOs, luxury real estate editorial brochures, microsecond automation engines, and modern web apps.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>EXPLORE DECK</span>
              <span>→</span>
            </div>
          </Link>

          {/* PORTAL CARD 2: STUDY VAULT */}
          <Link
            to="/materials"
            className="group p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="unit-badge-tag text-[10px]">DOWNLOAD VAULT</span>
              <h3 className="font-display text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                Study Materials ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                Curated lecture decks, algorithms & DSA revision notes, Alpine ISO build scripts, and vector UI starter packs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>ACCESS VAULT</span>
              <span>→</span>
            </div>
          </Link>

          {/* PORTAL CARD 3: ABOUT & ARMORY */}
          <Link
            to="/about"
            className="group p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between text-decoration-none shadow-lg hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="unit-badge-tag text-[10px]">PROFILE & ARMORY</span>
              <h3 className="font-display text-2xl font-black text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                About & Journey ↗
              </h3>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">
                The full 25-Skill Armory, academic engineering timeline, creative philosophies, and milestones.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-emerald)]">
              <span>VIEW ARMORY</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* NEW REQUESTED WIDE/LONG SOCIALS WIDGET BELOW [01] EXPLORE */}
      <section className="space-y-6 pt-2">
        <div className="section-mini-header">
          <h2>[02] Social Networks & Transmission Hub</h2>
          <span className="font-mono text-[10px] sm:text-[11px] text-[var(--g-neon-flash)] uppercase">
            ACTIVE CHANNELS MATRIX
          </span>
        </div>

        {/* LONG WIDGET CONTAINER */}
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--g-frame)] border border-[var(--g-border-solid)] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--g-border)] pb-4">
            <div>
              <span className="unit-badge-tag text-[9px] mb-1">CONNECTED PROFILES</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
                Direct Channels & Social Grid
              </h3>
            </div>
            <p className="font-mono text-xs text-[var(--g-muted)] max-w-sm sm:text-right">
              Direct connection lines to Dipanjan Baidya across code repositories, design circles, and encrypted transmissions.
            </p>
          </div>

          {/* Socials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.socials && profile.socials.map((social) => (
              <div
                key={social.id}
                className="p-4 rounded-lg bg-[var(--g-black)] border border-[var(--g-border)] hover:border-[var(--g-emerald)] transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--g-neon-flash)] font-bold tracking-wider uppercase block">
                      {social.badge || 'SOCIAL'}
                    </span>
                    <h4 className="font-display text-xl font-bold text-white group-hover:text-[var(--g-neon-flash)] transition-colors">
                      {social.platform}
                    </h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[var(--g-emerald)] animate-pulse" />
                </div>

                <div className="font-mono text-xs text-[var(--g-offwhite)] truncate bg-[var(--g-frame)] px-2.5 py-1.5 rounded border border-[var(--g-border-solid)]">
                  {social.handle}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded bg-[rgba(255,122,0,0.14)] hover:bg-[var(--g-emerald)] hover:text-black border border-[var(--g-border)] text-[var(--g-neon-flash)] font-mono text-[11px] font-bold text-center transition-all text-decoration-none"
                  >
                    OPEN ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => copyHandle(social.handle, social.platform)}
                    className="py-1.5 px-2.5 rounded bg-[var(--g-frame)] border border-[var(--g-border)] hover:border-[var(--g-emerald)] text-[var(--g-muted)] hover:text-white font-mono text-[11px] transition-all"
                    title="Copy Handle"
                  >
                    COPY
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom dispatch bar inside long widget */}
          <div className="p-4 rounded-lg bg-[var(--g-black)] border border-[var(--g-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[var(--g-muted)]">
              Direct Transmission Dispatch: <strong className="text-white">{profile.email}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyContact}
                className="px-3 py-1 rounded bg-[rgba(255,122,0,0.15)] text-[var(--g-neon-flash)] hover:bg-[var(--g-emerald)] hover:text-black transition-colors"
              >
                COPY INBOX
              </button>
              <Link
                to="/contact"
                className="px-3 py-1 rounded bg-[var(--g-emerald)] text-black font-bold hover:bg-white transition-colors text-decoration-none"
              >
                WRITE MESSAGE ↗
              </Link>
            </div>
          </div>
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
          <div className="bg-white p-5 inline-block rounded border-2 border-[var(--g-emerald)] shadow-[0_0_25px_rgba(255,122,0,0.45)]">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2F${encodeURIComponent(profile.webHub)}`}
              alt="Virtual Card QR"
              width="220"
              height="220"
              className="mx-auto block"
            />
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="btn-green-glass btn-highlight w-full"
              onClick={downloadVCard}
            >
              DOWNLOAD .VCF CARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
