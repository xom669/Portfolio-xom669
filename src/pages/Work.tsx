import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Work() {
  const { projects, profile } = usePortfolio();
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'ALL WORK & COMMISSIONS' },
    { key: 'systems', label: 'SYSTEMS & OS BUILDS' },
    { key: 'branding', label: 'BRANDING & BROCHURES' },
    { key: 'code', label: 'WEB CODE & HUBS' },
    { key: 'automation', label: 'INPUT AUTOMATION' }
  ];

  const filteredProjects = projects.filter((item) => {
    const matchesCat = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="border-b border-[var(--g-border)] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--g-emerald)] uppercase tracking-wider mb-2">
          <span>[ CATALOG DECK 01 ]</span>
          <span>●</span>
          <span>DEDICATED WORK DIRECTORY</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          Work & Projects
        </h1>
        <p className="text-sm text-[var(--g-muted)] max-w-2xl mt-2 leading-relaxed">
          Production systems, custom Linux live ISO toolchains, editorial brochures for luxury property developers, and microsecond-accurate input utilities.
        </p>
      </div>

      {/* METRIC BADGE STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Total Showcase</span>
          <span className="font-display text-3xl font-black text-white">{projects.length}</span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Systems / OS</span>
          <span className="font-display text-3xl font-black text-[var(--g-emerald)]">
            {projects.filter((p) => p.category === 'systems').length}
          </span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Branding & Print</span>
          <span className="font-display text-3xl font-black text-[var(--g-neon-flash)]">
            {projects.filter((p) => p.category === 'branding').length}
          </span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Live Codebases</span>
          <span className="font-display text-3xl font-black text-white">
            {projects.filter((p) => p.category === 'code' || p.category === 'web').length}
          </span>
        </div>
      </div>

      {/* TWO-SIDED WORKBENCH */}
      <div className="two-sided-layout">
        {/* LEFT STICKY FILTER PANEL */}
        <div className="left-side-control-panel">
          <div className="left-panel-title">DIRECTORY FILTERS</div>

          <div className="glimpse-nav-list">
            {categories.map((cat) => {
              const count =
                cat.key === 'all'
                  ? projects.length
                  : projects.filter((p) => p.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  type="button"
                  className={`glimpse-nav-item ${currentCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setCurrentCategory(cat.key)}
                >
                  <span>{cat.label}</span>
                  <span className="indicator text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="block font-mono text-[10px] text-[var(--g-emerald)] uppercase tracking-wider mb-2">
              SEARCH BY KEYWORD OR TECH
            </label>
            <input
              type="text"
              placeholder="e.g., Alpine, C#, Photoshop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--g-void)] border border-[var(--g-border)] rounded px-3 py-2 text-xs font-mono text-white placeholder-[var(--g-muted)] outline-none focus:border-[var(--g-emerald)] transition-colors"
            />
          </div>

        </div>

        {/* RIGHT SCROLLABLE DECK */}
        <div className="right-side-scroll-deck">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-[var(--g-muted)] border border-dashed border-[var(--g-border)] rounded">
              NO PROJECTS MATCH THE APPLIED CRITERIA.
            </div>
          ) : (
            filteredProjects.map((item) => (
              <div key={item.id} className="scroll-card-unit">
                <div>
                  <span className="unit-badge-tag">{item.badge}</span>
                  <span className="block font-mono text-[10px] text-[var(--g-muted)] mt-2 uppercase">
                    CATEGORY: {item.category}
                  </span>
                </div>

                <div className="unit-info-center space-y-2">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[rgba(52,16,91,0.45)] border border-[var(--g-border)] text-neutral-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unit-action-btn"
                    >
                      <span>CODE</span> ↗
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unit-action-btn bg-[var(--g-emerald)] text-[var(--g-void)] font-black hover:bg-white"
                    >
                      <span>LIVE</span> ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
