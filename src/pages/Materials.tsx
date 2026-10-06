import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function Materials() {
  const { materials, showToast } = usePortfolio();
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'ALL STUDY VAULT' },
    { key: 'systems', label: 'SYSTEMS & SCRIPTS' },
    { key: 'dsa', label: 'DSA & ALGORITHMS' },
    { key: 'design', label: 'DESIGN ASSETS' },
    { key: 'notes', label: 'OS & KERNEL NOTES' },
    { key: 'web', label: 'STARTER BOILERPLATES' }
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesCat = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (item: (typeof materials)[0]) => {
    showToast(`✓ Accessing package: ${item.title}`);
  };

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="border-b border-[var(--g-border)] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--g-emerald)] uppercase tracking-wider mb-2">
          <span>[ RESOURCE VAULT 02 ]</span>
          <span>●</span>
          <span>CURATED STUDY MATERIALS & SCRIPTS</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          Study Materials & Vault
        </h1>
        <p className="text-sm text-[var(--g-muted)] max-w-2xl mt-2 leading-relaxed">
          Open-access technical notes, algorithmic revision decks, Alpine Linux compilation scripts, and vector UI typography kits compiled for engineers and creators.
        </p>
      </div>

      {/* METRIC BADGE STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Total Resources</span>
          <span className="font-display text-3xl font-black text-white">{materials.length}</span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Formats Available</span>
          <span className="font-display text-3xl font-black text-[var(--g-emerald)]">PDF, TAR, ZIP</span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">License Type</span>
          <span className="font-display text-3xl font-black text-[var(--g-neon-flash)]">FREE / MIT</span>
        </div>
        <div className="p-4 rounded bg-[var(--g-frame)] border border-[var(--g-border-solid)]">
          <span className="block font-mono text-[10px] text-[var(--g-muted)] uppercase">Direct Downloads</span>
          <span className="font-display text-3xl font-black text-white">100% VERIFIED</span>
        </div>
      </div>

      {/* TWO-SIDED WORKBENCH */}
      <div className="two-sided-layout">
        {/* LEFT STICKY FILTER PANEL */}
        <div className="left-side-control-panel">
          <div className="left-panel-title">VAULT SECTIONS</div>

          <div className="glimpse-nav-list">
            {categories.map((cat) => {
              const count =
                cat.key === 'all'
                  ? materials.length
                  : materials.filter((m) => m.category === cat.key).length;
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
              SEARCH VAULT
            </label>
            <input
              type="text"
              placeholder="e.g., DSA, Kernel, Figma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--g-void)] border border-[var(--g-border)] rounded px-3 py-2 text-xs font-mono text-white placeholder-[var(--g-muted)] outline-none focus:border-[var(--g-emerald)] transition-colors"
            />
          </div>

          <div className="p-3.5 rounded bg-[var(--g-void)] border border-[var(--g-border)] font-mono text-xs text-[var(--g-muted)] mb-5">
            <span className="text-[var(--g-neon-flash)] block font-bold mb-1">CURATED DISTRIBUTION:</span>
            All study packages and toolchains are hosted on verified GitHub release artifacts.
          </div>

          <Link
            to="/admin"
            className="btn-quick-add text-center flex items-center justify-center gap-2 text-decoration-none"
          >
            <span>⚙ MANAGE VAULT IN BACKEND</span>
          </Link>
        </div>

        {/* RIGHT SCROLLABLE DECK */}
        <div className="right-side-scroll-deck">
          {filteredMaterials.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-[var(--g-muted)] border border-dashed border-[var(--g-border)] rounded">
              NO STUDY MATERIALS FOUND MATCHING YOUR QUERY.
            </div>
          ) : (
            filteredMaterials.map((item) => (
              <div key={item.id} className="scroll-card-unit">
                <div>
                  <span className="unit-badge-tag">{item.fileType}</span>
                  <span className="block font-mono text-[10px] text-[var(--g-muted)] mt-2">
                    SIZE: {item.fileSize}
                  </span>
                  {item.badge && (
                    <span className="mt-1 inline-block text-[9px] font-mono text-[var(--g-neon-flash)] border border-[rgba(0,255,163,0.3)] px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="unit-info-center space-y-1.5">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>

                <div>
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownload(item)}
                    className="unit-action-btn bg-[var(--g-emerald)] text-[var(--g-void)] font-black hover:bg-white"
                  >
                    <span>DOWNLOAD / VIEW</span> ⬇
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
