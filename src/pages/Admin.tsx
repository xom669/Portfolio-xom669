import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio, getYoutubeEmbedUrl, isDirectVideoUrl } from '../context/PortfolioContext';
import { compressImage } from '../lib/imageCompressor';
import { uploadVideoFile, SUPABASE_VIDEOS_BUCKET_SQL } from '../lib/videoStorage';
import { SUPABASE_SETUP_SQL } from '../lib/cloudSync';
import type { ProjectItem, MaterialItem, JourneyItem, SocialLink, BlogPost } from '../types';

export default function Admin() {
  const {
    profile,
    updateProfile,
    updateSocials,
    projects,
    addProject,
    deleteProject,
    moveProject,
    materials,
    addMaterial,
    deleteMaterial,
    moveMaterial,
    portalConfig,
    updatePortalConfig,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    skills,
    updateSkills,
    journey,
    updateJourney,
    deleteJourney,
    moveJourney,
    headerConfig,
    updateHeaderConfig,
    footerConfig,
    updateFooterConfig,
    youtubeVideos,
    updateYoutubeVideos,
    adminPasscode,
    updateAdminPasscode,
    resetToDefaults,
    showToast,
    cloudSyncStatus,
    lastSyncedTime,
    syncWithCloud,
    exportAllData,
    importAllData
  } = usePortfolio();

  // Password Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('xom669_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [newPasscodeDraft, setNewPasscodeDraft] = useState('');

  // Project Deletion Gate Modal State (Requires tick-box confirmation)
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleteConfirmedChecked, setIsDeleteConfirmedChecked] = useState(false);

  // Sync / Export / Import Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Reset Confirmation Password Gate State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetError, setResetError] = useState(false);

  // Handle Passcode Unlock (strictly checks user's adminPasscode with no backdoors)
  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (enteredPasscode.trim() === adminPasscode.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('xom669_admin_session', 'true');
      setAuthError(false);
      showToast('✓ Studio CMS Authenticated & Unlocked.');
    } else {
      setAuthError(true);
      showToast('✕ Incorrect passcode. Access denied.');
    }
  };

  // Handle Confirmed Reset with Password
  const handleConfirmReset = (e: FormEvent) => {
    e.preventDefault();
    if (resetPasswordInput.trim() === adminPasscode.trim()) {
      resetToDefaults();
      setIsResetModalOpen(false);
      setResetPasswordInput('');
      setResetError(false);
      showToast('✓ All fields and sections reset to factory defaults.');
    } else {
      setResetError(true);
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('xom669_admin_session');
    setEnteredPasscode('');
    showToast('✓ Studio CMS Locked.');
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'vcard' | 'socials' | 'portals' | 'blog' | 'projects' | 'materials' | 'videos' | 'skills' | 'journey' | 'telemetry'
  >('vcard');

  // Local Profile Draft
  const [profileDraft, setProfileDraft] = useState({ ...profile });
  const [socialsDraft, setSocialsDraft] = useState<SocialLink[]>([
    ...(profile.socials || [])
  ]);

  // Local Portal & Project Radar Draft
  const [portalDraft, setPortalDraft] = useState({
    workDesc: portalConfig?.workDesc || '',
    materialsDesc: portalConfig?.materialsDesc || '',
    aboutDesc: portalConfig?.aboutDesc || '',
    flashedProjectIds: portalConfig?.flashedProjectIds || []
  });

  // Blog Posts Draft / Form State
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogTag, setNewBlogTag] = useState('SYSTEMS');
  const [newBlogReadTime, setNewBlogReadTime] = useState('3 MIN READ');
  const [newBlogSummary, setNewBlogSummary] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Featured Videos Draft (allows uploading direct video files or pasting links)
  const [videosDraft, setVideosDraft] = useState<string[]>(() => {
    if (youtubeVideos && youtubeVideos.length > 0) {
      return [...youtubeVideos];
    }
    return ['', '', ''];
  });

  // Direct Video File Upload State
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Local Header/Footer Draft
  const [headerDraft, setHeaderDraft] = useState(() => {
    const draft = {
      showHeader: true,
      showTicker: false,
      showCard: true,
      customHeroText: '',
      cardSpacing: 'flush' as 'flush' | 'compact' | 'normal',
      ...headerConfig
    };
    if (draft.brandTitle && draft.brandTitle.toLowerCase() === 'identity card') {
      draft.brandTitle = '';
    }
    return draft;
  });
  const [footerDraft, setFooterDraft] = useState({ ...footerConfig });

  // New Social State
  const [newSocPlatform, setNewSocPlatform] = useState('');
  const [newSocHandle, setNewSocHandle] = useState('');
  const [newSocUrl, setNewSocUrl] = useState('');
  const [newSocBadge, setNewSocBadge] = useState('OFFICIAL');

  // New Project State
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<
    'systems' | 'branding' | 'code' | 'web' | 'automation'
  >('systems');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTags, setNewProjectTags] = useState('');
  const [newProjectLive, setNewProjectLive] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');
  const [newProjectBadge, setNewProjectBadge] = useState('FEATURED');

  // New Material State
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<
    'systems' | 'dsa' | 'design' | 'web' | 'notes'
  >('systems');
  const [newMatUrl, setNewMatUrl] = useState('');
  const [newMatFormat, setNewMatFormat] = useState('PDF');
  const [newMatSize, setNewMatSize] = useState('N/A');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatBadge, setNewMatBadge] = useState('RESOURCE');

  // Skills State
  const [newSkillInput, setNewSkillInput] = useState('');

  // Journey State
  const [newJourneyPeriod, setNewJourneyPeriod] = useState('');
  const [newJourneyTitle, setNewJourneyTitle] = useState('');
  const [newJourneyInstitution, setNewJourneyInstitution] = useState('');
  const [newJourneyDesc, setNewJourneyDesc] = useState('');
  const [newJourneyStatus, setNewJourneyStatus] = useState('ACTIVE');

  // If not authenticated, render Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-xl bg-[var(--g-frame)] border border-[var(--g-border-solid)] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(255,122,0,0.15)] border border-[var(--g-emerald)] flex items-center justify-center text-[var(--g-neon-flash)] text-xl">
            🔒
          </div>
          <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
            Studio CMS Locked
          </h2>
          <p className="font-mono text-xs text-[var(--g-muted)]">
            Enter private administrator passcode to access backend telemetry and controls.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[var(--g-emerald)] uppercase font-bold block">Passcode</label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter administrator passcode"
              value={enteredPasscode}
              onChange={(e) => {
                setEnteredPasscode(e.target.value);
                setAuthError(false);
              }}
              className={`form-entry ${authError ? 'border-red-500 bg-red-950/20' : ''}`}
            />
            {authError && (
              <span className="text-red-400 text-[10px] block font-bold pt-1">
                ✕ Invalid passcode. Access denied.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-green-glass btn-highlight w-full py-3 text-center text-xs font-bold uppercase tracking-wider"
          >
            UNLOCK STUDIO CMS ↗
          </button>
        </form>

        <div className="pt-3 border-t border-[var(--g-border)] flex items-center justify-between text-[11px] font-mono text-[var(--g-muted)]">
          <Link to="/" className="text-[var(--g-neon-flash)] hover:underline">
            ← Return to Live Site
          </Link>
          <span className="text-[10px]">AUTH LEVEL: ROOT</span>
        </div>
      </div>
    );
  }

  // Handle Profile Save
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(profileDraft);
    showToast('✓ Profile, Biography, and personal details saved!');
  };

  // Handle Featured Videos Save
  const handleSaveVideos = (e: FormEvent) => {
    e.preventDefault();
    const cleanVideos = videosDraft.map((v) => v.trim()).filter(Boolean);
    updateYoutubeVideos(cleanVideos);
    showToast('✓ Featured video showcase saved!');
  };

  // Direct Video File Upload Handler
  const handleVideoFileUpload = async (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('⚠️ Video file is larger than 50MB. Upload may take a little longer.');
    }

    setUploadingVideoIdx(idx);
    setUploadStatus('Reading video file from device...');
    showToast('⚡ Processing video upload...');

    try {
      const result = await uploadVideoFile(file, (msg) => {
        setUploadStatus(msg);
      });

      const updated = [...videosDraft];
      updated[idx] = result.url;
      setVideosDraft(updated);
      updateYoutubeVideos(updated);

      if (result.mode === 'storage') {
        showToast('✓ Video streamed to Supabase Storage CDN & saved!');
      } else {
        showToast('✓ Video saved locally & synced to cloud database!');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      showToast('✕ Video upload failed. Please try another video file or link.');
    } finally {
      setUploadingVideoIdx(null);
      setUploadStatus('');
      e.target.value = '';
    }
  };

  // Handle Portals & Project Radar Save
  const handleSavePortals = (e: FormEvent) => {
    e.preventDefault();
    updatePortalConfig(portalDraft);
    showToast('✓ Portal descriptions and project radar saved!');
  };

  const handleToggleFlashProject = (projectId: string) => {
    setPortalDraft((prev) => {
      const current = prev.flashedProjectIds || [];
      const exists = current.includes(projectId);
      const next = exists ? current.filter((id) => id !== projectId) : [...current, projectId];
      return { ...prev, flashedProjectIds: next };
    });
  };

  // Handle Blog Post Submit
  const handleSaveBlogPost = (e: FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      showToast('Please enter both title and content for the dispatch.');
      return;
    }
    if (editingBlogId) {
      updateBlogPost(editingBlogId, {
        title: newBlogTitle.trim(),
        tag: newBlogTag.trim() || 'SYSTEMS',
        readTime: newBlogReadTime.trim() || '3 MIN READ',
        summary: newBlogSummary.trim(),
        content: newBlogContent.trim()
      });
      setEditingBlogId(null);
    } else {
      addBlogPost({
        title: newBlogTitle.trim(),
        tag: newBlogTag.trim() || 'SYSTEMS',
        readTime: newBlogReadTime.trim() || '3 MIN READ',
        date: new Date().toISOString().split('T')[0],
        summary: newBlogSummary.trim(),
        content: newBlogContent.trim(),
        published: true
      });
    }
    setNewBlogTitle('');
    setNewBlogSummary('');
    setNewBlogContent('');
    setNewBlogReadTime('3 MIN READ');
  };

  const handleStartEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setNewBlogTitle(post.title);
    setNewBlogTag(post.tag);
    setNewBlogReadTime(post.readTime || '3 MIN READ');
    setNewBlogSummary(post.summary);
    setNewBlogContent(post.content);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEditBlog = () => {
    setEditingBlogId(null);
    setNewBlogTitle('');
    setNewBlogSummary('');
    setNewBlogContent('');
    setNewBlogReadTime('3 MIN READ');
  };

  // Handle Socials Save
  const handleSaveSocials = (e: FormEvent) => {
    e.preventDefault();
    updateSocials(socialsDraft);
    updateProfile({
      instagramUrl: profileDraft.instagramUrl,
      instagramHandle: profileDraft.instagramHandle,
      twitterUrl: profileDraft.twitterUrl,
      twitterHandle: profileDraft.twitterHandle,
      discordHandle: profileDraft.discordHandle
    });
    showToast('✓ All social channels and handles synchronized!');
  };

  // Add custom social
  const handleAddSocial = (e: FormEvent) => {
    e.preventDefault();
    if (!newSocPlatform.trim() || !newSocUrl.trim()) return;

    const newSocialItem: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newSocPlatform.trim(),
      handle: newSocHandle.trim() || `@${newSocPlatform.toLowerCase()}`,
      url: newSocUrl.trim(),
      badge: newSocBadge.trim() || 'PROFILE'
    };

    const updated = [...socialsDraft, newSocialItem];
    setSocialsDraft(updated);
    updateSocials(updated);

    setNewSocPlatform('');
    setNewSocHandle('');
    setNewSocUrl('');
    setNewSocBadge('OFFICIAL');
    showToast(`✓ Added ${newSocialItem.platform} channel!`);
  };

  const handleDeleteSocial = (id: string) => {
    const updated = socialsDraft.filter((s) => s.id !== id);
    setSocialsDraft(updated);
    updateSocials(updated);
    showToast('✓ Social link removed.');
  };

  // Handle Header/Footer Save
  const handleSaveTelemetry = (e: FormEvent) => {
    e.preventDefault();
    updateHeaderConfig(headerDraft);
    updateFooterConfig(footerDraft);
    showToast('✓ Header ticker & footer configuration saved!');
  };

  // Update passcode
  const handleChangePasscode = (e: FormEvent) => {
    e.preventDefault();
    if (!newPasscodeDraft.trim()) return;
    updateAdminPasscode(newPasscodeDraft.trim());
    setNewPasscodeDraft('');
  };

  // Media uploaders with client-side canvas compression for mobile camera photos
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast('⚡ Compressing cover banner...');
    try {
      const b64 = await compressImage(file, 1200, 600, 0.85);
      setProfileDraft((prev) => ({ ...prev, coverBanner: b64 }));
      updateProfile({ coverBanner: b64 });
      showToast('✓ Cover banner compressed & updated!');
    } catch (err) {
      console.error('Cover banner upload failed:', err);
      showToast('✕ Failed to process cover banner.');
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast('⚡ Compressing avatar photo...');
    try {
      const b64 = await compressImage(file, 600, 600, 0.85);
      setProfileDraft((prev) => ({ ...prev, avatarImage: b64 }));
      updateProfile({ avatarImage: b64 });
      showToast('✓ Avatar photo compressed & saved!');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      showToast('✕ Failed to process avatar image.');
    }
  };

  // Add Project Submit
  const handleAddProjectSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectDesc.trim()) return;

    addProject({
      title: newProjectTitle.trim(),
      category: newProjectCategory,
      desc: newProjectDesc.trim(),
      tags: newProjectTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: newProjectLive.trim() || undefined,
      githubUrl: newProjectGithub.trim() || undefined,
      badge: newProjectBadge.trim() || 'NEW'
    });

    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTags('');
    setNewProjectLive('');
    setNewProjectGithub('');
    setNewProjectBadge('FEATURED');
  };

  // Add Material Submit
  const handleAddMaterialSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim() || !newMatUrl.trim()) return;

    addMaterial({
      title: newMatTitle.trim(),
      category: newMatCategory,
      downloadUrl: newMatUrl.trim(),
      fileType: newMatFormat.trim() || 'FILE',
      fileSize: newMatSize.trim() || 'N/A',
      desc: newMatDesc.trim() || '',
      badge: newMatBadge.trim() || 'DOWNLOAD'
    });

    setNewMatTitle('');
    setNewMatUrl('');
    setNewMatFormat('PDF');
    setNewMatSize('N/A');
    setNewMatDesc('');
  };

  // Add Skill
  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) {
      showToast('Skill already exists in armory.');
      return;
    }
    updateSkills([...skills, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add Journey
  const handleAddJourneySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newJourneyTitle.trim() || !newJourneyInstitution.trim()) return;

    const newItem: JourneyItem = {
      id: `j-${Date.now()}`,
      period: newJourneyPeriod.trim() || '2024 — Present',
      title: newJourneyTitle.trim(),
      institution: newJourneyInstitution.trim(),
      desc: newJourneyDesc.trim() || '',
      status: newJourneyStatus.trim() || 'ACTIVE'
    };

    updateJourney([newItem, ...journey]);
    setNewJourneyPeriod('');
    setNewJourneyTitle('');
    setNewJourneyInstitution('');
    setNewJourneyDesc('');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* HEADER BANNER */}
      <div className="border-b border-[var(--g-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--g-emerald)] uppercase tracking-wider mb-2">
            <span>[ STUDIO BACKEND CMS ]</span>
            <span>●</span>
            <span className="text-[var(--g-neon-flash)]">PASSWORD PROTECTED</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            Studio Backend CMS
          </h1>
          <p className="text-sm text-[var(--g-muted)] max-w-2xl mt-2 leading-relaxed">
            Manage your V-Card, social media profiles, project catalog, study materials vault, 25-skill armory, journey, and global telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Cloud Sync Status Indicator & Manual Sync Button */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--g-black)] border border-[var(--g-border)] text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-400'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-amber-400 animate-pulse'
                  : cloudSyncStatus === 'error'
                  ? 'bg-red-400'
                  : 'bg-neutral-500'
              }`}
            />
            <span className="text-neutral-300 font-bold">
              {cloudSyncStatus === 'synced'
                ? 'SUPABASE SYNCED'
                : cloudSyncStatus === 'syncing'
                ? 'SYNCING...'
                : cloudSyncStatus === 'error'
                ? 'OFFLINE'
                : 'SUPABASE'}
            </span>
            {lastSyncedTime && (
              <span className="text-[10px] text-[var(--g-muted)] hidden sm:inline">
                ({lastSyncedTime})
              </span>
            )}
            <button
              type="button"
              onClick={() => syncWithCloud()}
              className="ml-1 text-[var(--g-neon-flash)] hover:underline font-bold"
              title="Force sync now between PC and Mobile"
            >
              ↻ SYNC NOW
            </button>
          </div>

          <Link
            to="/"
            className="btn-green-glass btn-highlight text-xs py-2 px-4 text-decoration-none"
          >
            VIEW LIVE SITE ↗
          </Link>
          <button
            type="button"
            onClick={() => {
              const code = exportAllData();
              navigator.clipboard.writeText(code).then(() => {
                showToast('✓ Full CMS data copied to clipboard!');
              }).catch(() => {});
              setIsExportModalOpen(true);
            }}
            className="btn-green-glass text-xs py-2 px-3 border-[var(--g-border)] text-neutral-300 hover:text-white"
            title="Export full portfolio snapshot as code"
          >
            📋 EXPORT
          </button>
          <button
            type="button"
            onClick={() => {
              setImportJsonText('');
              setIsImportModalOpen(true);
            }}
            className="btn-green-glass text-xs py-2 px-3 border-[var(--g-border)] text-neutral-300 hover:text-white"
            title="Import portfolio data from another device"
          >
            📥 IMPORT
          </button>
          <button
            type="button"
            onClick={handleLock}
            className="btn-green-glass text-xs py-2 px-3 border-[var(--g-border)] text-neutral-300 hover:text-white"
            title="Lock session"
          >
            🔒 LOCK CMS
          </button>
          <button
            type="button"
            onClick={() => {
              setResetPasswordInput('');
              setResetError(false);
              setIsResetModalOpen(true);
            }}
            className="btn-green-glass text-xs py-2 px-3 text-red-400 hover:text-white hover:bg-red-950 border-red-900/50"
            title="Reset all fields to initial defaults"
          >
            RESET ALL
          </button>
        </div>
      </div>

      {/* RESET ALL PASSWORD CONFIRMATION MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl bg-[var(--g-frame)] border border-red-500/50 p-6 space-y-4 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-xl">⚠️</span>
              <h3 className="font-display text-lg font-bold uppercase text-white">Confirm Factory Reset</h3>
            </div>
            <p className="text-[var(--g-muted)]">
              This will restore all portfolio data to defaults. Please enter your administrator password to authorize:
            </p>
            <form onSubmit={handleConfirmReset} className="space-y-3">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin password"
                value={resetPasswordInput}
                onChange={(e) => {
                  setResetPasswordInput(e.target.value);
                  setResetError(false);
                }}
                className={`form-entry ${resetError ? 'border-red-500 bg-red-950/30' : ''}`}
              />
              {resetError && (
                <span className="text-red-400 text-[10px] block font-bold">
                  ✕ Incorrect password. Reset unauthorized.
                </span>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="py-2 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-mono"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded bg-red-600 hover:bg-red-500 text-white font-bold transition-colors font-mono"
                >
                  CONFIRM RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT DELETION CONFIRMATION MODAL WITH TICK-BOX */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[var(--g-frame)] border border-red-500/60 p-6 space-y-4 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-xl">🗑️</span>
              <h3 className="font-display text-lg font-bold uppercase text-white">Confirm Project Deletion</h3>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              You are about to permanently delete <strong className="text-white font-bold">"{projectToDelete.title}"</strong> from the project catalog. This will sync and remove it from both PC and mobile versions.
            </p>
            <label className="flex items-start gap-3 p-3.5 rounded bg-red-950/30 border border-red-850/50 cursor-pointer text-neutral-200 select-none">
              <input
                type="checkbox"
                checked={isDeleteConfirmedChecked}
                onChange={(e) => setIsDeleteConfirmedChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-red-500 cursor-pointer"
              />
              <span className="text-[11px] leading-snug">
                I confirm that I want to delete this project from the catalog.
              </span>
            </label>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setProjectToDelete(null);
                  setIsDeleteConfirmedChecked(false);
                }}
                className="py-2 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-mono"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={!isDeleteConfirmedChecked}
                onClick={() => {
                  if (isDeleteConfirmedChecked && projectToDelete) {
                    deleteProject(projectToDelete.id);
                    setProjectToDelete(null);
                    setIsDeleteConfirmedChecked(false);
                  }
                }}
                className={`py-2 px-4 rounded font-bold font-mono transition-all ${
                  isDeleteConfirmedChecked
                    ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-lg shadow-red-950/50'
                    : 'bg-red-950/30 text-neutral-500 border border-red-900/30 cursor-not-allowed'
                }`}
              >
                DELETE PROJECT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT DATA MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[var(--g-frame)] border border-[var(--g-border-solid)] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--g-border)] pb-2">
              <div className="flex items-center gap-2 text-[var(--g-neon-flash)]">
                <span className="text-xl">📋</span>
                <h3 className="font-display text-lg font-bold uppercase text-white">Export Portfolio Sync Code</h3>
              </div>
              <button type="button" onClick={() => setIsExportModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <p className="text-[var(--g-muted)]">
              This code contains your complete portfolio configuration (profile, avatar, banner, links, projects, and journey). You can paste this on your phone or any other device to sync immediately:
            </p>
            <textarea
              readOnly
              rows={8}
              value={exportAllData()}
              className="form-entry font-mono text-[11px] select-all cursor-text"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(exportAllData()).then(() => {
                    showToast('✓ Copied to clipboard!');
                  });
                }}
                className="btn-green-glass btn-highlight py-2 px-4 font-bold"
              >
                COPY TO CLIPBOARD
              </button>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="btn-green-glass py-2 px-3 text-neutral-300"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT DATA MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[var(--g-frame)] border border-[var(--g-emerald)] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--g-border)] pb-2">
              <div className="flex items-center gap-2 text-[var(--g-emerald)]">
                <span className="text-xl">📥</span>
                <h3 className="font-display text-lg font-bold uppercase text-white">Import Portfolio Data</h3>
              </div>
              <button type="button" onClick={() => setIsImportModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <p className="text-[var(--g-muted)]">
              Paste the exported sync code from your computer or phone below to immediately apply all changes:
            </p>
            <textarea
              rows={8}
              placeholder="Paste exported portfolio JSON here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="form-entry font-mono text-[11px]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="btn-green-glass py-2 px-3 text-neutral-300"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  if (importAllData(importJsonText)) {
                    setIsImportModalOpen(false);
                    setImportJsonText('');
                    window.location.reload();
                  }
                }}
                className="btn-green-glass btn-highlight py-2 px-4 font-bold"
              >
                APPLY DATA TO SITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--g-border)] pb-3">
        {[
          { key: 'vcard', label: '1. Profile & Bio' },
          { key: 'socials', label: '2. Social Media Links' },
          { key: 'portals', label: '3. Portals & Radar' },
          { key: 'blog', label: '4. Dispatches & Blog' },
          { key: 'projects', label: '5. Projects Catalog' },
          { key: 'materials', label: '6. Study Vault' },
          { key: 'videos', label: '7. Ambient Video' },
          { key: 'skills', label: '8. Technical Stack' },
          { key: 'journey', label: '9. Journey & Education' },
          { key: 'telemetry', label: '10. Header, Footer & Passcode' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 sm:px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all ${
              activeTab === tab.key
                ? 'bg-[var(--g-emerald)] text-[var(--g-void)] shadow-[0_0_15px_rgba(255,122,0,0.45)]'
                : 'bg-[var(--g-frame)] text-[var(--g-muted)] hover:text-white border border-[var(--g-border-solid)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: IDENTITY & V-CARD
          ========================================================================= */}
      {activeTab === 'vcard' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
            <div className="border-b border-[var(--g-border)] pb-3 flex justify-between items-center">
              <div>
                <span className="unit-badge-tag text-[9px]">V-CARD SPECIFICATION SHEET</span>
                <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                  Personal Details & Location
                </h2>
              </div>
              <button type="submit" className="btn-green-glass btn-highlight text-xs py-2 px-5">
                SAVE CHANGES
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Full Legal Name</label>
                <input
                  type="text"
                  value={profileDraft.fullName}
                  onChange={(e) => setProfileDraft({ ...profileDraft, fullName: e.target.value })}
                  className="form-entry"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Public Moniker / Call-sign</label>
                <input
                  type="text"
                  value={profileDraft.moniker}
                  onChange={(e) => setProfileDraft({ ...profileDraft, moniker: e.target.value })}
                  className="form-entry"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Base Location (City, State, Country)</label>
                <input
                  type="text"
                  value={profileDraft.location}
                  onChange={(e) => setProfileDraft({ ...profileDraft, location: e.target.value })}
                  className="form-entry"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Professional Headline</label>
                <input
                  type="text"
                  value={profileDraft.headline}
                  onChange={(e) => setProfileDraft({ ...profileDraft, headline: e.target.value })}
                  className="form-entry"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Primary Email</label>
                <input
                  type="email"
                  value={profileDraft.email}
                  onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })}
                  className="form-entry"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Phone / Mobile (for vCard)</label>
                <input
                  type="text"
                  value={profileDraft.phone || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Main Web Hub Domain</label>
                <input
                  type="text"
                  value={profileDraft.webHub}
                  onChange={(e) => setProfileDraft({ ...profileDraft, webHub: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Security PGP Key Hash</label>
                <input
                  type="text"
                  value={profileDraft.pgpHash}
                  onChange={(e) => setProfileDraft({ ...profileDraft, pgpHash: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Undergraduate Field / Degree</label>
                <input
                  type="text"
                  value={profileDraft.degree}
                  onChange={(e) => setProfileDraft({ ...profileDraft, degree: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Specialization Focus</label>
                <input
                  type="text"
                  value={profileDraft.specialization}
                  onChange={(e) => setProfileDraft({ ...profileDraft, specialization: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-2 md:col-span-2 p-4 rounded bg-[rgba(255,122,0,0.06)] border border-[rgba(255,122,0,0.3)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-[var(--g-neon-flash)] uppercase font-bold block text-xs">
                    About Section Biography & Personal Manifesto
                  </label>
                  <span className="text-[10px] text-[var(--g-emerald)] font-mono">
                    ● SYNCS TO ABOUT PAGE & VIRTUAL ID CARD
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={profileDraft.bio}
                  onChange={(e) => setProfileDraft({ ...profileDraft, bio: e.target.value })}
                  placeholder="Enter your comprehensive biography here..."
                  className="form-entry w-full font-mono text-xs"
                />
                <span className="text-[10px] text-[var(--g-muted)] block">
                  Changes made here update the About & Journey section narrative and the glimpse text on your home identity card.
                </span>
              </div>
            </div>

            {/* Media Uploaders */}
            <div className="pt-4 border-t border-[var(--g-border)] grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-4 rounded bg-[var(--g-black)] border border-[var(--g-border)] space-y-3">
                <span className="text-[var(--g-neon-flash)] uppercase font-bold block">Cover Banner Photo</span>
                <img
                  src={profileDraft.coverBanner}
                  alt="Cover preview"
                  className="w-full h-24 object-cover rounded border border-[var(--g-border)]"
                />
                <label className="btn-green-glass text-[11px] py-1.5 px-3 block text-center cursor-pointer">
                  UPLOAD NEW COVER BANNER
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </div>

              <div className="p-4 rounded bg-[var(--g-black)] border border-[var(--g-border)] space-y-3">
                <span className="text-[var(--g-neon-flash)] uppercase font-bold block">Avatar Portrait</span>
                <div className="flex items-center gap-4">
                  <img
                    src={profileDraft.avatarImage}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--g-emerald)] shadow-[0_0_15px_rgba(255,122,0,0.45)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/dipanjan_avatar.svg';
                    }}
                  />
                  <label className="btn-green-glass text-[11px] py-1.5 px-3 block text-center cursor-pointer flex-1">
                    UPLOAD NEW AVATAR
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-green-glass btn-highlight py-2.5 px-6 font-bold">
                ✓ SAVE V-CARD SPECIFICATIONS
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 2: SOCIALS & CHANNELS (SYNCED WITH VIRTUAL CARD & SOCIALS WIDGET)
          ========================================================================= */}
      {activeTab === 'socials' && (
        <div className="space-y-8">
          {/* Direct Social Form */}
          <form onSubmit={handleSaveSocials} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
            <div className="border-b border-[var(--g-border)] pb-3 flex justify-between items-center">
              <div>
                <span className="unit-badge-tag text-[9px]">SOCIAL MATRIX CMS</span>
                <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                  Primary Social Profiles
                </h2>
                <p className="text-xs text-[var(--g-muted)] font-mono mt-1">
                  These links sync automatically to the Virtual Card and the long Socials Widget on the home page.
                </p>
              </div>
              <button type="submit" className="btn-green-glass btn-highlight text-xs py-2 px-5">
                SAVE SOCIALS
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/dipanjan.baidya"
                  value={profileDraft.instagramUrl || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, instagramUrl: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@dipanjan.baidya"
                  value={profileDraft.instagramHandle || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, instagramHandle: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/dipanjanbaidya/"
                  value={profileDraft.linkedinUrl}
                  onChange={(e) => setProfileDraft({ ...profileDraft, linkedinUrl: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Primary GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/dipanjanbaidya2007"
                  value={profileDraft.githubUrl}
                  onChange={(e) => setProfileDraft({ ...profileDraft, githubUrl: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">X / Twitter URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/xom669"
                  value={profileDraft.twitterUrl || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, twitterUrl: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">X / Twitter Handle</label>
                <input
                  type="text"
                  placeholder="@xom669"
                  value={profileDraft.twitterHandle || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, twitterHandle: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Discord Tag / Username</label>
                <input
                  type="text"
                  placeholder="xom669#0"
                  value={profileDraft.discordHandle || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, discordHandle: e.target.value })}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">Secondary / Alt GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/xom669"
                  value={profileDraft.altGithubUrl}
                  onChange={(e) => setProfileDraft({ ...profileDraft, altGithubUrl: e.target.value })}
                  className="form-entry"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button type="submit" className="btn-green-glass btn-highlight py-2 px-6 font-bold">
                ✓ SYNCHRONIZE PRIMARY SOCIALS
              </button>
            </div>
          </form>

          {/* Add New Custom Social */}
          <form onSubmit={handleAddSocial} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-4 font-mono text-xs">
            <h3 className="font-display text-xl font-bold text-white uppercase">
              + Add Custom Social Platform (YouTube, Telegram, Behance, etc.)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Platform (e.g. YouTube)"
                value={newSocPlatform}
                onChange={(e) => setNewSocPlatform(e.target.value)}
                className="form-entry"
              />
              <input
                type="text"
                required
                placeholder="Handle / Username (@dipanjan)"
                value={newSocHandle}
                onChange={(e) => setNewSocHandle(e.target.value)}
                className="form-entry"
              />
              <input
                type="url"
                required
                placeholder="Full Link (https://...)"
                value={newSocUrl}
                onChange={(e) => setNewSocUrl(e.target.value)}
                className="form-entry"
              />
              <input
                type="text"
                placeholder="Badge (e.g. VIDEO / LAB)"
                value={newSocBadge}
                onChange={(e) => setNewSocBadge(e.target.value)}
                className="form-entry"
              />
            </div>

            <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold">
              + INSERT CUSTOM CHANNEL
            </button>
          </form>

          {/* Existing Socials List */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="font-display text-xl font-bold text-white uppercase">
              Configured Social Channels ({socialsDraft.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialsDraft.map((soc) => (
                <div
                  key={soc.id}
                  className="p-3.5 rounded bg-[var(--g-black)] border border-[var(--g-border)] flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <span className="text-[var(--g-neon-flash)] font-bold block">{soc.platform}</span>
                    <span className="text-white text-[11px] block">{soc.handle}</span>
                    <a href={soc.url} target="_blank" rel="noopener noreferrer" className="text-[var(--g-muted)] text-[10px] truncate block hover:underline">
                      {soc.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSocial(soc.id)}
                    className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-400 hover:text-white shrink-0 text-[10px]"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: PORTALS DIRECTORY & PROJECT RADAR
          ========================================================================= */}
      {activeTab === 'portals' && (
        <form onSubmit={handleSavePortals} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
            <div className="border-b border-[var(--g-border)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="unit-badge-tag text-[9px]">PORTALS & SHOWCASE RADAR</span>
                <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                  Portal Descriptions & Flashed Projects
                </h2>
                <p className="text-xs text-[var(--g-muted)] font-mono mt-1">
                  Customize the descriptive text for the 3 main portals, and pick which projects cycle on the live Project Radar showcase window.
                </p>
              </div>
              <button type="submit" className="btn-green-glass btn-highlight text-xs py-2 px-5 shrink-0">
                SAVE PORTALS & RADAR
              </button>
            </div>

            <div className="space-y-5 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">
                  Work & Projects Portal Description
                </label>
                <textarea
                  rows={2}
                  value={portalDraft.workDesc}
                  onChange={(e) => setPortalDraft({ ...portalDraft, workDesc: e.target.value })}
                  placeholder="e.g. Interactive engineering portfolio, production web systems, and system utilities."
                  className="form-entry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">
                  Study Materials Portal Description
                </label>
                <textarea
                  rows={2}
                  value={portalDraft.materialsDesc}
                  onChange={(e) => setPortalDraft({ ...portalDraft, materialsDesc: e.target.value })}
                  placeholder="e.g. Curated technical packages, engineering notes, and toolchains."
                  className="form-entry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[var(--g-emerald)] uppercase font-bold block">
                  About & Journey Portal Description
                </label>
                <textarea
                  rows={2}
                  value={portalDraft.aboutDesc}
                  onChange={(e) => setPortalDraft({ ...portalDraft, aboutDesc: e.target.value })}
                  placeholder="e.g. 25-skill technical stack, academic engineering timeline, and background."
                  className="form-entry"
                />
              </div>
            </div>

            {/* PROJECT RADAR SELECTION */}
            <div className="pt-4 border-t border-[var(--g-border)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white uppercase">
                    Select Projects Flashed on Radar Window
                  </h3>
                  <p className="text-xs text-[var(--g-muted)] font-mono">
                    Click any project below to toggle it on or off from the home page radar flash display.
                  </p>
                </div>
                <span className="text-xs font-mono text-[var(--g-neon-flash)] font-bold">
                  {(portalDraft.flashedProjectIds || []).length} SELECTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {projects.map((p) => {
                  const isSelected = (portalDraft.flashedProjectIds || []).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleFlashProject(p.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all select-none font-mono text-xs ${
                        isSelected
                          ? 'bg-[rgba(255,122,0,0.18)] border-[var(--g-emerald)] shadow-[0_0_12px_rgba(255,122,0,0.25)]'
                          : 'bg-black/40 border-white/10 hover:border-white/30 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="unit-badge-tag text-[8px] uppercase">{p.category}</span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-[var(--g-neon-flash)]' : 'text-neutral-500'}`}>
                          {isSelected ? '● FLASHING' : '○ EXCLUDED'}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white truncate">{p.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB: TERMINAL DISPATCHES & BLOG JOURNAL
          ========================================================================= */}
      {activeTab === 'blog' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveBlogPost} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-5">
            <div className="border-b border-[var(--g-border)] pb-3 flex items-center justify-between">
              <div>
                <span className="unit-badge-tag text-[9px]">EDITORIAL CMS</span>
                <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                  {editingBlogId ? 'Edit Terminal Dispatch' : '+ Publish New Dispatch / Post'}
                </h2>
              </div>
              {editingBlogId && (
                <button
                  type="button"
                  onClick={handleCancelEditBlog}
                  className="btn-green-glass text-xs py-1.5 px-3 text-neutral-400 hover:text-white"
                >
                  CANCEL EDIT
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Dispatch Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building Minimal Linux Kernels & Microsecond Engines"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Category / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. SYSTEMS, DEVLOG, ARCHITECTURE"
                  value={newBlogTag}
                  onChange={(e) => setNewBlogTag(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Estimated Read Time</label>
                <input
                  type="text"
                  placeholder="3 MIN READ"
                  value={newBlogReadTime}
                  onChange={(e) => setNewBlogReadTime(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Summary / Subtitle (Shown on card)</label>
                <input
                  type="text"
                  placeholder="Brief 1-2 sentence teaser for readers..."
                  value={newBlogSummary}
                  onChange={(e) => setNewBlogSummary(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[var(--g-emerald)] uppercase block">Full Dispatch Content (Markdown & Text) *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write the full post here. Paragraph breaks and markdown formatting are preserved..."
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  className="form-entry"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-green-glass btn-highlight py-2 px-6 font-bold text-xs font-mono">
                {editingBlogId ? 'SAVE CHANGES TO DISPATCH' : 'PUBLISH DISPATCH'}
              </button>
              {editingBlogId && (
                <button
                  type="button"
                  onClick={handleCancelEditBlog}
                  className="btn-green-glass py-2 px-4 text-xs font-mono text-neutral-300"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>

          {/* List Existing Blog Posts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Published Dispatches ({blogPosts.length})
              </h3>
              <span className="font-mono text-xs text-[var(--g-muted)]">
                Manage, edit, or delete live field notes
              </span>
            </div>

            {blogPosts.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-neutral-500 border border-dashed border-white/10 rounded-lg">
                NO DISPATCHES PUBLISHED YET. USE THE FORM ABOVE TO WRITE YOUR FIRST POST.
              </div>
            ) : (
              blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="unit-badge-tag text-[9px]">{post.tag || 'SYSTEMS'}</span>
                      <span className="text-[var(--g-muted)]">{post.date}</span>
                      <span className="text-[var(--g-neon-flash)]">{post.readTime || '3 MIN READ'}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        post.published !== false
                          ? 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30'
                          : 'border-yellow-500/50 text-yellow-400 bg-yellow-950/30'
                      }`}>
                        {post.published !== false ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-bold text-white pt-0.5">{post.title}</h4>
                    <p className="text-[var(--g-muted)] line-clamp-2 leading-relaxed">{post.summary || post.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditBlog(post)}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="px-3 py-1.5 rounded bg-red-950/60 border border-red-800 text-red-400 hover:text-white font-mono text-xs font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BLOG POST DELETION CONFIRMATION MODAL */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[var(--g-frame)] border border-red-500/60 p-6 space-y-4 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-xl">🗑️</span>
              <h3 className="font-display text-lg font-bold uppercase text-white">Delete Dispatch</h3>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white font-bold">"{postToDelete.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="py-2 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-mono"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBlogPost(postToDelete.id);
                  setPostToDelete(null);
                }}
                className="py-2 px-4 rounded bg-red-600 hover:bg-red-500 text-white font-bold transition-colors font-mono"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PROJECTS CATALOG
          ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-8">
          <form onSubmit={handleAddProjectSubmit} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-5">
            <div className="border-b border-[var(--g-border)] pb-3">
              <span className="unit-badge-tag text-[9px]">CATALOG MANAGEMENT</span>
              <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                + Add New Project Record
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., PendriveOS V3.2"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Category *</label>
                <select
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value as any)}
                  className="form-entry"
                >
                  <option value="systems">Systems & OS</option>
                  <option value="branding">Branding & Brochures</option>
                  <option value="code">Web Code & Hubs</option>
                  <option value="automation">Input Automation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g., V3.2 RELEASE or CLIENT WORK"
                  value={newProjectBadge}
                  onChange={(e) => setNewProjectBadge(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="Alpine Linux, Shell, Kernel, C#"
                  value={newProjectTags}
                  onChange={(e) => setNewProjectTags(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">GitHub Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newProjectGithub}
                  onChange={(e) => setNewProjectGithub(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Live Demo / URL</label>
                <input
                  type="url"
                  placeholder="https://xom669.in"
                  value={newProjectLive}
                  onChange={(e) => setNewProjectLive(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Project Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed summary of the project architecture and outcomes..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="form-entry"
                />
              </div>
            </div>

            <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold text-xs font-mono">
              + INSERT PROJECT TO CATALOG
            </button>
          </form>

          {/* List Existing Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Current Project Catalog ({projects.length})
              </h3>
              <span className="font-mono text-xs text-[var(--g-muted)]">
                Use ↑ / ↓ to rearrange display sequence on live site
              </span>
            </div>
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="unit-badge-tag text-[9px]">{p.badge}</span>
                    <span className="text-[var(--g-muted)] uppercase">({p.category})</span>
                    <span className="text-[10px] text-neutral-500 font-bold">#{idx + 1}</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-white pt-1">{p.title}</h4>
                  <p className="text-[var(--g-muted)] leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveProject(idx, 'up')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === 0
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Project Up"
                  >
                    ↑ UP
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => moveProject(idx, 'down')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === projects.length - 1
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Project Down"
                  >
                    ↓ DOWN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectToDelete(p);
                      setIsDeleteConfirmedChecked(false);
                    }}
                    className="px-3 py-1.5 rounded bg-red-950/60 border border-red-800 text-red-400 hover:text-white font-mono text-xs font-bold"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: STUDY VAULT
          ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-8">
          <form onSubmit={handleAddMaterialSubmit} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-5">
            <div className="border-b border-[var(--g-border)] pb-3">
              <span className="unit-badge-tag text-[9px]">VAULT REPOSITORY</span>
              <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                + Add Study Material / Resource
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Linux Kernel Internals Deck"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Category *</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value as any)}
                  className="form-entry"
                >
                  <option value="systems">Systems & Scripts</option>
                  <option value="dsa">DSA & Algorithms</option>
                  <option value="design">Design Assets</option>
                  <option value="notes">OS & Kernel Notes</option>
                  <option value="web">Starter Boilerplates</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">File Format Tag</label>
                <input
                  type="text"
                  placeholder="PDF, TAR.GZ, FIGMA, ZIP"
                  value={newMatFormat}
                  onChange={(e) => setNewMatFormat(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">File Size / Pages</label>
                <input
                  type="text"
                  placeholder="14.2 MB or 48 Pages"
                  value={newMatSize}
                  onChange={(e) => setNewMatSize(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Download / Repository Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/... or Google Drive URL"
                  value={newMatUrl}
                  onChange={(e) => setNewMatUrl(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of what is included in this package..."
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  className="form-entry"
                />
              </div>
            </div>

            <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold text-xs font-mono">
              + INSERT MATERIAL TO VAULT
            </button>
          </form>

          {/* List Existing Materials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Current Vault Resources ({materials.length})
              </h3>
              <span className="font-mono text-xs text-[var(--g-muted)]">
                Use ↑ / ↓ to arrange Vault download sequence
              </span>
            </div>
            {materials.map((m, idx) => (
              <div
                key={m.id}
                className="p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="unit-badge-tag text-[9px]">{m.fileType}</span>
                    <span className="text-[var(--g-muted)]">SIZE: {m.fileSize}</span>
                    <span className="text-[var(--g-emerald)] uppercase">({m.category})</span>
                    <span className="text-[10px] text-neutral-500 font-bold">#{idx + 1}</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-white pt-1">{m.title}</h4>
                  <p className="text-[var(--g-muted)] leading-relaxed">{m.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveMaterial(idx, 'up')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === 0
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Material Up"
                  >
                    ↑ UP
                  </button>
                  <button
                    type="button"
                    disabled={idx === materials.length - 1}
                    onClick={() => moveMaterial(idx, 'down')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === materials.length - 1
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Material Down"
                  >
                    ↓ DOWN
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMaterial(m.id)}
                    className="px-3 py-1.5 rounded bg-red-950/60 border border-red-800 text-red-400 hover:text-white font-mono text-xs font-bold"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: FEATURED VIDEOS (DIRECT UPLOADS & YOUTUBE STREAMING)
          ========================================================================= */}
      {activeTab === 'videos' && (
        <form onSubmit={handleSaveVideos} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
            <div className="border-b border-[var(--g-border)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="unit-badge-tag text-[9px]">AMBIENT VIDEO CHANNELS</span>
                <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                  Ambient Video Loop Channels
                </h2>
                <p className="text-xs text-[var(--g-muted)] font-mono mt-1">
                  Upload video files directly from your phone/PC (MP4, WebM, MOV) or paste YouTube links. Videos run in a clean, ambient loop on the home page with no player controls or branding.
                </p>
              </div>
              <button type="submit" className="btn-green-glass btn-highlight text-xs py-2 px-5 shrink-0">
                SAVE VIDEOS
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {videosDraft.map((videoUrl, idx) => {
                const isDirect = isDirectVideoUrl(videoUrl);
                const embedUrl = isDirect ? null : getYoutubeEmbedUrl(videoUrl, false);
                const isUploading = uploadingVideoIdx === idx;
                const isDataUrl = videoUrl.startsWith('data:video/');

                return (
                  <div key={idx} className="p-4 rounded-lg bg-[var(--g-black)] border border-[var(--g-border)] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-[var(--g-emerald)] uppercase font-bold text-xs">
                        Video Channel #{idx + 1} {isDirect ? '• Direct Video File' : '• Stream Link'}
                      </label>
                      <div className="flex items-center gap-2">
                        {isDirect ? (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            ● DIRECT AMBIENT VIDEO
                          </span>
                        ) : embedUrl ? (
                          <span className="text-[10px] text-[var(--g-neon-flash)] font-mono font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                            ● YOUTUBE STREAM
                          </span>
                        ) : videoUrl.trim() ? (
                          <span className="text-[10px] text-red-400 font-mono">
                            ✕ UNRECOGNIZED LINK
                          </span>
                        ) : (
                          <span className="text-[10px] text-[var(--g-muted)] font-mono">
                            EMPTY
                          </span>
                        )}
                        {videosDraft.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = videosDraft.filter((_, i) => i !== idx);
                              setVideosDraft(copy);
                            }}
                            className="text-red-400 hover:text-white text-[10px] px-2 py-0.5 rounded bg-red-950/40 border border-red-900/60"
                          >
                            REMOVE
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DIRECT UPLOAD BUTTON & INPUT ROW */}
                    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                      <div className="flex-1 min-w-0">
                        {isDataUrl ? (
                          <div className="flex items-center justify-between px-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs">
                            <span className="truncate">
                              📹 Uploaded Video (~{Math.round(videoUrl.length / 1024)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...videosDraft];
                                copy[idx] = '';
                                setVideosDraft(copy);
                              }}
                              className="text-red-400 hover:text-white text-[10px] font-bold ml-2 underline shrink-0"
                            >
                              CLEAR
                            </button>
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Direct video link (.mp4, .webm) or YouTube URL"
                            value={videoUrl}
                            onChange={(e) => {
                              const copy = [...videosDraft];
                              copy[idx] = e.target.value;
                              setVideosDraft(copy);
                            }}
                            className="form-entry w-full"
                          />
                        )}
                      </div>

                      {/* Direct Upload File Input */}
                      <label className={`btn-green-glass flex items-center justify-center gap-2 px-4 py-2 cursor-pointer font-bold text-xs shrink-0 select-none ${
                        isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-emerald-400'
                      }`}>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                          className="hidden"
                          onChange={(e) => handleVideoFileUpload(e, idx)}
                          disabled={isUploading}
                        />
                        <span>{isUploading ? '⏳ UPLOADING...' : '📁 UPLOAD VIDEO FILE'}</span>
                      </label>
                    </div>

                    {isUploading && (
                      <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>{uploadStatus || 'Processing and caching video...'}</span>
                      </div>
                    )}

                    {/* Native Direct Video Preview Player */}
                    {isDirect && (
                      <div className="pt-2">
                        <span className="text-[10px] text-emerald-400 block mb-1.5 uppercase font-mono font-bold">
                          Direct Video Preview (Autoplays seamlessly on homepage):
                        </span>
                        <div className="max-w-md aspect-video rounded-lg overflow-hidden border border-emerald-900/80 bg-black shadow-lg">
                          <video
                            src={videoUrl}
                            controls
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* YouTube Video Preview Player */}
                    {!isDirect && embedUrl && (
                      <div className="pt-2">
                        <span className="text-[10px] text-[var(--g-muted)] block mb-1.5 uppercase font-mono">
                          YouTube Video Preview:
                        </span>
                        <div className="max-w-md aspect-video rounded-lg overflow-hidden border border-[var(--g-border-solid)] bg-black shadow-lg">
                          <iframe
                            src={embedUrl}
                            title={`Preview ${idx + 1}`}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setVideosDraft([...videosDraft, ''])}
                  className="btn-green-glass text-xs py-2 px-4 border border-white/10 text-neutral-300 hover:text-white"
                >
                  + ADD ANOTHER VIDEO CHANNEL
                </button>
                <button
                  type="submit"
                  className="btn-green-glass btn-highlight py-2 px-6 font-bold"
                >
                  ✓ SAVE FEATURED VIDEOS
                </button>
              </div>
            </div>

            {/* Cloud Storage CDN Setup Info Box */}
            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--g-border)] space-y-2 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span>💡</span> DIRECT VIDEO UPLOAD ENGINE
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_VIDEOS_BUCKET_SQL).then(() => {
                      showToast('✓ Storage Bucket SQL copied to clipboard!');
                    }).catch(() => {});
                  }}
                  className="text-[10px] text-[var(--g-emerald)] hover:underline font-bold"
                >
                  📋 COPY SUPABASE STORAGE BUCKET SQL
                </button>
              </div>
              <p className="text-[var(--g-muted)] leading-relaxed">
                Directly uploaded videos are saved and cached automatically via high-speed cloud database sync and instant IndexedDB local cache. If you also want global CDN streaming directly from Supabase Storage, run the copied SQL snippet once in your Supabase SQL Editor.
              </p>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 6: TECHNICAL STACK / 25-SKILL ARMORY
          ========================================================================= */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6">
            <div className="border-b border-[var(--g-border)] pb-3">
              <span className="unit-badge-tag text-[9px]">SKILLS ARMORY</span>
              <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                Manage Technical Stack
              </h2>
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-3">
              <input
                type="text"
                placeholder="Add new skill (e.g. Rust, WebGL Shaders, Go)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="form-entry flex-1 font-mono text-xs"
              />
              <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold text-xs font-mono shrink-0">
                + ADD SKILL
              </button>
            </form>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[var(--g-muted)] block">
                Active Armory ({skills.length} skills): Click [✕] to remove any skill.
              </span>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded bg-[rgba(52,16,91,0.45)] border border-[var(--g-border)] font-mono text-xs text-white flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-400 hover:text-red-300 font-bold ml-1"
                      title="Remove skill"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: JOURNEY & EDUCATION
          ========================================================================= */}
      {activeTab === 'journey' && (
        <div className="space-y-8">
          <form onSubmit={handleAddJourneySubmit} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-5">
            <div className="border-b border-[var(--g-border)] pb-3">
              <span className="unit-badge-tag text-[9px]">CHRONOLOGICAL FORMATION</span>
              <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                + Add Journey / Milestone Entry
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Time Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2024 — Present"
                  value={newJourneyPeriod}
                  onChange={(e) => setNewJourneyPeriod(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Status Badge</label>
                <input
                  type="text"
                  placeholder="e.g., ACTIVE ENROLLMENT or COMPLETED"
                  value={newJourneyStatus}
                  onChange={(e) => setNewJourneyStatus(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Degree / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., B.Tech in Computer Science"
                  value={newJourneyTitle}
                  onChange={(e) => setNewJourneyTitle(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--g-emerald)] uppercase block">Institution / Council *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Technical Campus, Kolkata"
                  value={newJourneyInstitution}
                  onChange={(e) => setNewJourneyInstitution(e.target.value)}
                  className="form-entry"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[var(--g-emerald)] uppercase block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Specialization focus, coursework, distinctions..."
                  value={newJourneyDesc}
                  onChange={(e) => setNewJourneyDesc(e.target.value)}
                  className="form-entry"
                />
              </div>
            </div>

            <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold text-xs font-mono">
              + INSERT JOURNEY ENTRY
            </button>
          </form>

          {/* List Existing Journey */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Current Journey Milestones ({journey.length})
              </h3>
              <span className="font-mono text-xs text-[var(--g-muted)]">
                Use ↑ / ↓ to arrange chronology order
              </span>
            </div>
            {journey.map((j, idx) => (
              <div
                key={j.id}
                className="p-5 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="unit-badge-tag text-[9px]">{j.period}</span>
                    <span className="text-[var(--g-neon-flash)] font-bold">{j.status}</span>
                    <span className="text-[10px] text-neutral-500 font-bold">#{idx + 1}</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-white pt-1">{j.title}</h4>
                  <span className="text-[var(--g-emerald)] block">{j.institution}</span>
                  <p className="text-[var(--g-muted)] leading-relaxed pt-1">{j.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveJourney(idx, 'up')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === 0
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Journey Up"
                  >
                    ↑ UP
                  </button>
                  <button
                    type="button"
                    disabled={idx === journey.length - 1}
                    onClick={() => moveJourney(idx, 'down')}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono font-bold transition-all ${
                      idx === journey.length - 1
                        ? 'opacity-25 cursor-not-allowed border-white/5 text-neutral-600'
                        : 'bg-white/5 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move Journey Down"
                  >
                    ↓ DOWN
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteJourney(j.id)}
                    className="px-3 py-1.5 rounded bg-red-950/60 border border-red-800 text-red-400 hover:text-white font-mono text-xs font-bold"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: HEADER, FOOTER & PASSCODE TELEMETRY
          ========================================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveTelemetry} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-6 font-mono text-xs">
            <div className="border-b border-[var(--g-border)] pb-3">
              <span className="unit-badge-tag text-[9px]">GLOBAL TELEMETRY</span>
              <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                Header & Footer Text Configuration
              </h2>
            </div>

            <div className="space-y-5">
              {/* VISIBILITY TOGGLES */}
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--g-border)] space-y-3">
                <span className="text-[var(--g-neon-flash)] font-bold uppercase tracking-wider block">
                  LAYOUT & VISIBILITY TOGGLES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-2 rounded bg-[var(--g-black)] border border-[var(--g-border)] cursor-pointer hover:border-[var(--g-emerald)] transition-colors">
                    <input
                      type="checkbox"
                      checked={headerDraft.showHeader !== false}
                      onChange={(e) => setHeaderDraft({ ...headerDraft, showHeader: e.target.checked })}
                      className="accent-[var(--g-emerald)] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white font-bold">Top Header Nav</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded bg-[var(--g-black)] border border-[var(--g-border)] cursor-pointer hover:border-[var(--g-emerald)] transition-colors">
                    <input
                      type="checkbox"
                      checked={!!headerDraft.showTicker}
                      onChange={(e) => setHeaderDraft({ ...headerDraft, showTicker: e.target.checked })}
                      className="accent-[var(--g-emerald)] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white font-bold">Running Ticker</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded bg-[var(--g-black)] border border-[var(--g-border)] cursor-pointer hover:border-[var(--g-emerald)] transition-colors">
                    <input
                      type="checkbox"
                      checked={headerDraft.showCard !== false}
                      onChange={(e) => setHeaderDraft({ ...headerDraft, showCard: e.target.checked })}
                      className="accent-[var(--g-emerald)] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white font-bold">Virtual ID Card</span>
                  </label>
                </div>
              </div>

              {/* CARD POSITIONING & CUSTOM TEXT */}
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--g-border)] space-y-3">
                <span className="text-[var(--g-emerald)] font-bold uppercase tracking-wider block">
                  IDENTITY CARD CONTROLS & HERO TEXT
                </span>
                
                <div className="space-y-1.5">
                  <label className="text-neutral-300 block">
                    Card Vertical Spacing (Move card upwards)
                  </label>
                  <div className="flex gap-2">
                    {(['flush', 'compact', 'normal'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setHeaderDraft({ ...headerDraft, cardSpacing: mode })}
                        className={`py-1.5 px-3 rounded text-xs font-mono font-bold uppercase transition-all ${
                          (headerDraft.cardSpacing || 'flush') === mode
                            ? 'bg-[var(--g-emerald)] text-black shadow-md'
                            : 'bg-[var(--g-black)] text-neutral-300 border border-[var(--g-border)] hover:border-white'
                        }`}
                      >
                        {mode === 'flush' ? '↑ Top Flush' : mode === 'compact' ? 'Compact' : 'Standard'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-neutral-300 block">
                    Custom Intro / Headline Text (Displayed above card or at top of home)
                  </label>
                  <textarea
                    rows={2}
                    value={headerDraft.customHeroText || ''}
                    onChange={(e) => setHeaderDraft({ ...headerDraft, customHeroText: e.target.value })}
                    placeholder="e.g. Welcome to my creative portfolio and systems repository..."
                    className="form-entry font-mono"
                  />
                  <span className="text-[10px] text-[var(--g-muted)]">Leave empty to show card directly at top with no headline text.</span>
                </div>
              </div>

              {/* HEADER DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Header Brand Main Title
                  </label>
                  <input
                    type="text"
                    value={headerDraft.brandTitle}
                    onChange={(e) => setHeaderDraft({ ...headerDraft, brandTitle: e.target.value })}
                    placeholder="Leave empty or enter custom title (e.g. xom669)"
                    className="form-entry font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Header Brand Sub-Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={headerDraft.brandBadge}
                    onChange={(e) => setHeaderDraft({ ...headerDraft, brandBadge: e.target.value })}
                    placeholder="XOM669 / PORTFOLIO"
                    className="form-entry font-mono"
                  />
                </div>
              </div>

              {headerDraft.showTicker && (
                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Running Marquee Ticker Text (Infinite loop at top)
                  </label>
                  <textarea
                    rows={2}
                    value={headerDraft.tickerText}
                    onChange={(e) => setHeaderDraft({ ...headerDraft, tickerText: e.target.value })}
                    className="form-entry font-mono"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[var(--g-border)]">
                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Footer Brandmark Name
                  </label>
                  <input
                    type="text"
                    value={footerDraft.brandmarkText}
                    onChange={(e) => setFooterDraft({ ...footerDraft, brandmarkText: e.target.value })}
                    className="form-entry font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Footer Brandmark Sub-Text
                  </label>
                  <input
                    type="text"
                    value={footerDraft.subText}
                    onChange={(e) => setFooterDraft({ ...footerDraft, subText: e.target.value })}
                    className="form-entry font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--g-emerald)] uppercase font-bold block">
                    Footer Year
                  </label>
                  <input
                    type="text"
                    value={footerDraft.year}
                    onChange={(e) => setFooterDraft({ ...footerDraft, year: e.target.value })}
                    className="form-entry font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button type="submit" className="btn-green-glass btn-highlight py-2.5 px-6 font-bold">
                ✓ SAVE HEADER & FOOTER TELEMETRY
              </button>
            </div>
          </form>

          {/* Change Admin Passcode Card */}
          <form onSubmit={handleChangePasscode} className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-4 font-mono text-xs">
            <div className="border-b border-[var(--g-border)] pb-2 flex items-center gap-2">
              <span className="text-[var(--g-neon-flash)]">🔒</span>
              <h3 className="font-display text-xl font-bold text-white uppercase">
                Change Studio CMS Passcode
              </h3>
            </div>
            <p className="text-[var(--g-muted)]">
              Current Passcode is active. Enter a new passcode below to update it immediately:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                required
                placeholder="New passcode (e.g. 7788)"
                value={newPasscodeDraft}
                onChange={(e) => setNewPasscodeDraft(e.target.value)}
                className="form-entry flex-1"
              />
              <button type="submit" className="btn-green-glass btn-highlight py-2 px-5 font-bold shrink-0">
                UPDATE PASSCODE
              </button>
            </div>
          </form>

          {/* Supabase Cloud Database Telemetry & Setup Card */}
          <div className="p-6 sm:p-8 rounded-lg bg-[var(--g-frame)] border border-[var(--g-border-solid)] space-y-4 font-mono text-xs">
            <div className="border-b border-[var(--g-border)] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[var(--g-emerald)]">⚡</span>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Supabase Cloud Database
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                CONNECTED & ACTIVE
              </span>
            </div>
            <p className="text-[var(--g-muted)] leading-relaxed">
              Connected to your Supabase instance (<code className="text-white">uvfttvbsbakwbvtnlzsd.supabase.co</code>). All edits to your bio, projects, materials, journey, skills, and videos automatically sync in real-time between your PC and mobile devices.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => syncWithCloud()}
                className="btn-green-glass btn-highlight py-2 px-4 font-bold"
              >
                ↻ FORCE SYNC WITH SUPABASE
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SETUP_SQL).then(() => {
                    showToast('✓ Supabase setup SQL copied to clipboard!');
                  }).catch(() => {});
                }}
                className="btn-green-glass py-2 px-4 font-bold border-[var(--g-border)] text-neutral-300 hover:text-white"
                title="Copy optional SQL to create clean portfolio_config table in Supabase SQL editor"
              >
                📋 COPY OPTIONAL SQL SETUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
