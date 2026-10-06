import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function About() {
  const { profile, skills, journey, milestones } = usePortfolio();
  const [skillSearch, setSkillSearch] = useState('');

  const filteredSkills = skills.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* PAGE HEADER */}
      <div className="border-b border-[var(--g-border)] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--g-emerald)] uppercase tracking-wider mb-2">
          <span>[ PROFILE DECK 03 ]</span>
          <span>●</span>
          <span>BIOGRAPHY & TECHNICAL ARMORY</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          About & Journey
        </h1>
        <p className="text-sm text-[var(--g-muted)] max-w-2xl mt-2 leading-relaxed">
          The background, technical proficiencies, education history, and architectural principles driving Dipanjan Baidya ({profile.moniker}).
        </p>
      </div>

      {/* BIOGRAPHY & MANIFESTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-5">
          <span className="unit-badge-tag text-[10px]">THE CREATIVE ENGINE</span>
          <h2 className="font-display text-3xl font-black text-white uppercase">
            Aesthetic Brutalism meets Zero-Bloat Systems
          </h2>
          <p className="text-sm text-[var(--g-offwhite)] leading-relaxed">
            I am a 19-year-old creative developer and visual artist based out of <strong>{profile.location}</strong>. I operate at the intersection of aesthetic graphic design and rigorous low-latency computer systems.
          </p>
          <p className="text-sm text-[var(--g-muted)] leading-relaxed">
            From compiling tailored Alpine Linux live distributions that boot in under 10 seconds to crafting high-gloss corporate identity brochures for premier real estate developments in Gurgaon, my philosophy is focused on zero fluff, high signal-to-noise ratio, and tactile kinetic typography.
          </p>
          <div className="pt-4 border-t border-[var(--g-border)] flex flex-wrap gap-4 font-mono text-xs">
            <div>
              <span className="text-[var(--g-muted)] block text-[10px] uppercase">Base Station</span>
              <span className="text-white font-bold">{profile.location}</span>
            </div>
            <div>
              <span className="text-[var(--g-muted)] block text-[10px] uppercase">Undergraduate Field</span>
              <span className="text-[var(--g-emerald)] font-bold">{profile.degree}</span>
            </div>
            <div>
              <span className="text-[var(--g-muted)] block text-[10px] uppercase">Primary Focus</span>
              <span className="text-[var(--g-neon-flash)] font-bold">{profile.specialization}</span>
            </div>
          </div>
        </div>

        {/* IDENTITY PASSPORT SIDEBAR */}
        <div className="p-8 rounded-lg bg-[var(--g-black)] border border-[var(--g-border-solid)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="unit-badge-tag text-[10px]">SECURITY TELEMETRY</span>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[var(--g-muted)] block text-[10px] uppercase">VERIFIED IDENTITY:</span>
                <span className="text-white font-bold">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-[var(--g-muted)] block text-[10px] uppercase">PUBLIC MONIKER:</span>
                <span className="text-[var(--g-emerald)] font-bold">{profile.moniker}</span>
              </div>
              <div>
                <span className="text-[var(--g-muted)] block text-[10px] uppercase">SECURITY PGP HASH:</span>
                <span className="text-[var(--g-neon-flash)] font-bold text-[11px]">{profile.pgpHash}</span>
              </div>
              <div>
                <span className="text-[var(--g-muted)] block text-[10px] uppercase">PRIMARY GITHUB:</span>
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-[var(--g-emerald)] underline">
                  {profile.githubUrl.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>

          <Link
            to="/admin"
            className="btn-green-glass btn-highlight w-full text-center text-xs py-2.5 text-decoration-none"
          >
            ⚙ UPDATE BIOGRAPHY IN BACKEND
          </Link>
        </div>
      </div>

      {/* 25-SKILL ARMORY */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--g-border)] pb-4">
          <div>
            <h2 className="font-display text-3xl font-black text-white uppercase">
              The 25-Skill Armory
            </h2>
            <span className="font-mono text-xs text-[var(--g-muted)]">
              SOFTWARE, LANGUAGES, RUNTIMES & ARCHITECTURES
            </span>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search skill armory..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full bg-[var(--g-void)] border border-[var(--g-border)] rounded px-3 py-1.5 text-xs font-mono text-white placeholder-[var(--g-muted)] outline-none focus:border-[var(--g-emerald)] transition-colors"
            />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <div className="flex flex-wrap gap-2.5">
            {filteredSkills.length === 0 ? (
              <span className="text-xs font-mono text-[var(--g-muted)]">No skills found matching "{skillSearch}".</span>
            ) : (
              filteredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded bg-[rgba(52,16,91,0.45)] border border-[var(--g-border)] font-mono text-xs text-[var(--g-offwhite)] hover:bg-[var(--g-emerald)] hover:text-[var(--g-void)] transition-all cursor-default"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* EDUCATION JOURNEY TIMELINE */}
      <section className="space-y-6">
        <div className="border-b border-[var(--g-border)] pb-4">
          <h2 className="font-display text-3xl font-black text-white uppercase">
            Education & Academic Journey
          </h2>
          <span className="font-mono text-xs text-[var(--g-muted)]">
            CHRONOLOGICAL FORMATION & CREDENTIALS
          </span>
        </div>

        <div className="space-y-4">
          {journey.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--g-emerald)] transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="unit-badge-tag text-[9px]">{item.period}</span>
                  <span className="font-mono text-[10px] text-[var(--g-neon-flash)] font-bold">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-black text-white">{item.title}</h3>
                <span className="font-mono text-xs text-[var(--g-emerald)] block">{item.institution}</span>
                <p className="text-xs text-[var(--g-muted)] leading-relaxed pt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KEY MILESTONES */}
      <section className="space-y-6">
        <div className="border-b border-[var(--g-border)] pb-4">
          <h2 className="font-display text-3xl font-black text-white uppercase">
            Milestones & Distinctions
          </h2>
          <span className="font-mono text-xs text-[var(--g-muted)]">
            KEY SYSTEM DELIVERABLES & ART DIRECTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {milestones.map((m) => (
            <div key={m.id} className="p-6 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-2">
              <span className="unit-badge-tag text-[9px]">{m.highlight}</span>
              <h4 className="font-display text-xl font-black text-white">{m.title}</h4>
              <p className="text-xs text-[var(--g-muted)] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
