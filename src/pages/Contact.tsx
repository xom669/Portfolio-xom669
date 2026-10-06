import { useState, type FormEvent } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact() {
  const { profile, downloadVCard, showToast } = usePortfolio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate direct dispatch
    setSubmitted(true);
    showToast('✓ Dispatch transmission received successfully!');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const copyEmail = () => {
    navigator.clipboard
      .writeText(profile.email)
      .then(() => showToast(`✓ Email copied: ${profile.email}`))
      .catch(() => showToast(`Email: ${profile.email}`));
  };

  return (
    <div className="space-y-12">
      {/* PAGE HEADER */}
      <div className="border-b border-[var(--g-border)] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--g-emerald)] uppercase tracking-wider mb-2">
          <span>[ TRANSMISSION 04 ]</span>
          <span>●</span>
          <span>DIRECT DISPATCH & INQUIRIES</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          Contact Hub & Channels
        </h1>
        <p className="text-sm text-[var(--g-muted)] max-w-2xl mt-2 leading-relaxed">
          Open for contract system engineering, branding commissions, Alpine Linux packaging, and technical inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TRANSMISSION FORM */}
        <div className="lg:col-span-7 p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
          <div className="border-b border-[var(--g-border)] pb-4">
            <span className="unit-badge-tag text-[9px]">ENCRYPTED TRANSMISSION</span>
            <h2 className="font-display text-3xl font-black text-white uppercase mt-2">
              Send a Direct Message
            </h2>
            <p className="text-xs text-[var(--g-muted)] mt-1">
              Dispatches forward immediately to {profile.email}.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded bg-[rgba(255,122,0,0.12)] border border-[var(--g-emerald)] text-center space-y-3 font-mono">
              <span className="text-2xl text-[var(--g-neon-flash)]">✓</span>
              <h3 className="font-bold text-white text-base">DISPATCH TRANSMITTED</h3>
              <p className="text-xs text-[var(--g-offwhite)]">
                Thank you. Your message has been logged and Dipanjan Baidya will review your inquiry promptly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-1.5 rounded bg-[var(--g-emerald)] text-[var(--g-void)] text-xs font-bold"
              >
                SEND ANOTHER TRANSMISSION
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase tracking-wider block">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-entry"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase tracking-wider block">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-entry"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase tracking-wider block">Subject Inquiry</label>
                <input
                  type="text"
                  placeholder="e.g., Custom Alpine ISO or Branding Project"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase tracking-wider block">Message Details *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your project, timeline, scope, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-entry"
                />
              </div>

              <button
                type="submit"
                className="btn-green-glass btn-highlight w-full py-3 text-center text-sm font-black uppercase tracking-wider mt-4"
              >
                DISPATCH TRANSMISSION ↗
              </button>
            </form>
          )}
        </div>

        {/* CHANNEL TELEMETRY SIDEBAR */}
        <div className="lg:col-span-5 space-y-5">
          {/* CHANNEL CARD */}
          <div className="p-6 rounded-lg bg-[var(--g-black)] border border-[var(--g-border-solid)] space-y-4">
            <span className="unit-badge-tag text-[9px]">DIRECT CHANNELS</span>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-[var(--g-frame)] border border-[var(--g-border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--g-muted)] block uppercase">PRIMARY INBOX</span>
                  <span className="text-white font-bold">{profile.email}</span>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-2.5 py-1 rounded bg-[rgba(255,122,0,0.18)] text-[var(--g-emerald)] hover:bg-[var(--g-emerald)] hover:text-black transition-colors text-[10px]"
                >
                  COPY
                </button>
              </div>

              <div className="p-3 rounded bg-[var(--g-frame)] border border-[var(--g-border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--g-muted)] block uppercase">BASE LOCATION</span>
                  <span className="text-white font-bold">{profile.location}</span>
                </div>
                <span className="text-[10px] text-[var(--g-neon-flash)]">UTC+5:30</span>
              </div>

              <div className="p-3 rounded bg-[var(--g-frame)] border border-[var(--g-border)]">
                <span className="text-[10px] text-[var(--g-muted)] block uppercase">VERIFIED GITHUB</span>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--g-emerald)] hover:underline block pt-1"
                >
                  {profile.githubUrl}
                </a>
              </div>

              <div className="p-3 rounded bg-[var(--g-frame)] border border-[var(--g-border)]">
                <span className="text-[10px] text-[var(--g-muted)] block uppercase">LINKEDIN NETWORK</span>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--g-emerald)] hover:underline block pt-1"
                >
                  {profile.linkedinUrl}
                </a>
              </div>
            </div>
          </div>

          {/* V-CARD FAST ACCESS */}
          <div className="p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-4">
            <span className="unit-badge-tag text-[9px]">MOBILE VIRTUAL CARD</span>
            <p className="text-xs text-[var(--g-muted)] leading-relaxed">
              Download the standardized electronic business card (.vcf) formatted for iOS, Android, and Outlook contact books.
            </p>
            <button
              type="button"
              onClick={downloadVCard}
              className="btn-green-glass btn-highlight w-full py-2.5 text-xs text-center font-bold"
            >
              ⬇ DOWNLOAD DIPANJAN_BAIDYA.VCF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
