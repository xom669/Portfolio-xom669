import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { fetchFromCloud, pushToCloud } from '../lib/cloudSync';
import type {
  ProfileData,
  ProjectItem,
  MaterialItem,
  JourneyItem,
  MilestoneItem,
  HeaderConfig,
  FooterConfig,
  SocialLink
} from '../types';

const DEFAULT_PROFILE: ProfileData = {
  fullName: 'Dipanjan Baidya',
  moniker: 'XOM 669',
  headline: 'ER STUDENT , CODER & GRAPHIC ARTIST',
  location: 'Kolkata, West Bengal, India',
  bio: 'I’m a 19-year-old nocturnal explorer, audiophile, and frequent night driver. Off the asphalt, I’m involved in real estate and have a background in freelance design. Alongside that, I’m pursuing Computer Science and Engineering, usually channeling my spare hours into quirky, unnecessary scripts that compile well past 2 AM.',
  email: 'dipanjan@xom669.in',
  phone: '+91 98765 43210',
  webHub: 'xom669.in',
  githubUrl: 'https://github.com/dipanjanbaidya2007',
  altGithubUrl: 'https://github.com/xom669',
  linkedinUrl: 'https://www.linkedin.com/in/dipanjanbaidya/',
  instagramUrl: 'https://instagram.com/dipanjan.baidya',
  instagramHandle: '@dipanjan.baidya',
  twitterUrl: 'https://twitter.com/xom669',
  twitterHandle: '@xom669',
  discordHandle: 'xom669#0',
  coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  avatarImage: '/dipanjan_avatar.png',
  degree: 'Undergraduate in Computer Science & Engineering',
  specialization: 'ER STUDENT , CODER & GRAPHIC ARTIST',
  pgpHash: '669A 4B22 F081 XOM9 2026',
  socials: [
    {
      id: 'soc-1',
      platform: 'GitHub',
      handle: 'dipanjanbaidya2007',
      url: 'https://github.com/dipanjanbaidya2007',
      badge: 'PRIMARY CODE'
    },
    {
      id: 'soc-2',
      platform: 'LinkedIn',
      handle: 'dipanjanbaidya',
      url: 'https://www.linkedin.com/in/dipanjanbaidya/',
      badge: 'NETWORK'
    },
    {
      id: 'soc-3',
      platform: 'Instagram',
      handle: '@dipanjan.baidya',
      url: 'https://instagram.com/dipanjan.baidya',
      badge: 'VISUAL ARTS'
    },
    {
      id: 'soc-4',
      platform: 'X / Twitter',
      handle: '@xom669',
      url: 'https://twitter.com/xom669',
      badge: 'DISPATCHES'
    },
    {
      id: 'soc-5',
      platform: 'Discord',
      handle: 'xom669#0',
      url: 'https://discord.com',
      badge: 'DIRECT CHAT'
    },
    {
      id: 'soc-6',
      platform: 'Telegram',
      handle: '@xom669',
      url: 'https://t.me/xom669',
      badge: 'ENCRYPTED'
    }
  ]
};

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    title: 'PendriveOS • Custom Alpine Linux Live ISO',
    category: 'systems',
    desc: 'Ultra-lightweight bootable Alpine Linux distribution crafted for instant plug-and-play environments. Features zero telemetry, tailored package management, and sub-10-second cold boot speeds.',
    tags: ['Alpine Linux', 'Shell Scripting', 'ISO Engineering', 'Kernel Optimization'],
    githubUrl: 'https://github.com/dipanjanbaidya2007',
    badge: 'V3.2 RELEASE'
  },
  {
    id: 'p-2',
    title: 'Gurgaon Luxury Real Estate Identity & Editorial',
    category: 'branding',
    desc: 'Comprehensive minimalist visual branding, corporate identity guidelines, and high-gloss editorial print brochures for premier luxury developments in Gurgaon.',
    tags: ['Photoshop', 'Illustrator', 'Editorial Print', 'Typography'],
    liveUrl: 'https://xom669.in',
    badge: 'CLIENT WORK'
  },
  {
    id: 'p-3',
    title: 'Antigravity AutoClicker & Utility Engine',
    category: 'systems',
    desc: 'High-precision, microsecond-accurate input automation engine compiled with native C# and AutoHotkey bindings. Low CPU footprint with custom hotkey listening.',
    tags: ['C# .NET', 'Win32 API', 'AutoHotkey', 'Low Latency'],
    githubUrl: 'https://github.com/dipanjanbaidya2007',
    badge: 'STANDALONE TOOL'
  },
  {
    id: 'p-4',
    title: 'xom669.in Cyber-Editorial Virtual Hub',
    category: 'code',
    desc: 'Bespoke cyber-editorial web experience combining living typography, fluid canvas simulation, interactive 3D virtual card, and reactive multi-page architecture.',
    tags: ['React 19', 'TypeScript', 'Canvas API', 'Cyber Styling'],
    githubUrl: 'https://github.com/dipanjanbaidya2007',
    liveUrl: 'https://xom669.in',
    badge: 'PRODUCTION'
  },
  {
    id: 'p-5',
    title: 'Monster Energy Kinetic Visual Campaign',
    category: 'branding',
    desc: 'Experimental high-voltage visualization campaign utilizing aggressive kinetic character treatments, neon grid borders, and dynamic poster compositions.',
    tags: ['Graphic Identity', 'Posters', 'Visual Arts'],
    liveUrl: 'https://xom669.in',
    badge: 'CONCEPT ART'
  },
  {
    id: 'p-6',
    title: 'Brutalist Comic Sketchbook Canvas',
    category: 'code',
    desc: 'Interactive comic-border sketchbook canvas panels with custom panel state persistence and reactive physics widgets.',
    tags: ['React', 'Tailwind CSS', 'State Engine'],
    githubUrl: 'https://github.com/dipanjanbaidya2007',
    badge: 'LAB EXPERIMENT'
  }
];

const DEFAULT_MATERIALS: MaterialItem[] = [
  {
    id: 'm-1',
    title: 'Alpine Linux ISO Build Scripts & Manifests',
    category: 'systems',
    downloadUrl: 'https://github.com/dipanjanbaidya2007',
    fileType: 'TAR.GZ',
    fileSize: '14.2 MB',
    desc: 'Complete reproducible scripts, package profiles, APK repositories, and build configs to compile custom bootable Alpine Linux ISOs.',
    badge: 'FULL BUILD SUITE'
  },
  {
    id: 'm-2',
    title: 'Algorithms & Data Structures Revision Deck',
    category: 'dsa',
    downloadUrl: 'https://github.com/dipanjanbaidya2007',
    fileType: 'PDF',
    fileSize: '48 Pages (3.4 MB)',
    desc: 'Hand-curated quick revision notes on Tree Traversals, Graph Shortest Paths, Dynamic Programming, and C++ STL complexities.',
    badge: 'EXAM & INTERVIEW READY'
  },
  {
    id: 'm-3',
    title: 'Cyberpunk Grid & Typography Vector Starter Pack',
    category: 'design',
    downloadUrl: 'https://github.com/dipanjanbaidya2007',
    fileType: 'FIGMA / AI',
    fileSize: '28.5 MB',
    desc: 'Clean vector UI kit featuring HUD borders, monospace grid lines, technical warning labels, and barcode glyphs.',
    badge: 'DESIGN ASSETS'
  },
  {
    id: 'm-4',
    title: 'Operating Systems & Linux Kernel Architecture Reference',
    category: 'notes',
    downloadUrl: 'https://github.com/dipanjanbaidya2007',
    fileType: 'MARKDOWN / PDF',
    fileSize: '18 Pages (1.8 MB)',
    desc: 'Curated technical reference notes on Linux kernels, process management, memory virtual paging, and zero-bloat systems architecture.',
    badge: 'TECHNICAL GUIDE'
  },
  {
    id: 'm-5',
    title: 'Modern Front-End Boilerplate & Antigravity Presets',
    category: 'web',
    downloadUrl: 'https://github.com/dipanjanbaidya2007',
    fileType: 'ZIP',
    fileSize: '6.2 MB',
    desc: 'Zero-configuration Vite, TypeScript, and Tailwind preset configured with custom canvas metaball backgrounds and cyber tokens.',
    badge: 'STARTER KIT'
  }
];

const DEFAULT_SKILLS = [
  'Photoshop',
  'Illustrator',
  'TypeScript',
  'React.js',
  'Next.js',
  'Python',
  'C++',
  'C# Automation',
  'Alpine Linux',
  'Supabase',
  'Tailwind CSS',
  'Docker',
  'Linux Kernel',
  'WebGL & Canvas',
  'Node.js & Express',
  'AutoHotkey',
  'Figma',
  'Git & GitHub',
  'PostgreSQL',
  'REST APIs',
  'UI Architecture',
  'Graphic Identity',
  'Editorial Design',
  'Bash Scripting',
  'Performance Optimization'
];

const DEFAULT_JOURNEY: JourneyItem[] = [
  {
    id: 'j-1',
    period: '2026-2030',
    title: 'B.Tech in Computer Science Engeering',
    institution: 'Heritage Institute of Technology , Kolkata',
    desc: 'Getting a undergrad CSE degree from HIT from MAKAUT',
    status: 'Pursuing'
  },
  {
    id: 'j-2',
    period: '2014 - 2026',
    title: 'Schooling',
    institution: 'Kendriya Vidyalaya No.2 Saltlake',
    desc: 'Completed my 10th and 12th',
    status: 'Completed'
  }
];

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    id: 'milestone-1',
    title: 'PendriveOS Alpine Linux Build',
    highlight: 'Instant Boot ISO',
    desc: 'Architected custom bootable minimal OS distribution booting in under 10 seconds.'
  },
  {
    id: 'milestone-2',
    title: 'Gurgaon Luxury Property Identity',
    highlight: 'Client Branding Deliverable',
    desc: 'Designed editorial brochures, typography guidelines, and corporate visual system.'
  },
  {
    id: 'milestone-3',
    title: 'Antigravity Suite & Input Engine',
    highlight: 'Microsecond Low Latency',
    desc: 'Engineered high-performance desktop automation utility with native C# bindings.'
  }
];

const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  showHeader: true,
  showTicker: false,
  brandTitle: '',
  brandBadge: '',
  tickerText: 'DIPANJAN BAIDYA • ER STUDENT , CODER & GRAPHIC ARTIST • KOLKATA, INDIA',
  showCard: true,
  customHeroText: '',
  cardSpacing: 'flush'
};

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandmarkText: 'DIPANJAN BAIDYA',
  subText: 'OFFICIAL PORTFOLIO',
  year: '2026'
};

export const DEFAULT_YOUTUBE_VIDEOS: string[] = [
  'https://www.youtube.com/watch?v=ScMzIvxBSi4'
];

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const match = trimmed.match(/(?:v=|\/embed\/|\/v\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

interface PortfolioContextType {
  profile: ProfileData;
  projects: ProjectItem[];
  materials: MaterialItem[];
  skills: string[];
  journey: JourneyItem[];
  milestones: MilestoneItem[];
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  youtubeVideos: string[];
  toastMessage: string | null;
  adminPasscode: string;

  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedTime: string | null;
  syncWithCloud: () => Promise<void>;

  updateProfile: (profile: Partial<ProfileData>) => void;
  updateSocials: (socials: SocialLink[]) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  moveProject: (index: number, direction: 'up' | 'down') => void;

  addMaterial: (material: Omit<MaterialItem, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<MaterialItem>) => void;
  deleteMaterial: (id: string) => void;
  moveMaterial: (index: number, direction: 'up' | 'down') => void;

  updateSkills: (skills: string[]) => void;
  updateJourney: (journey: JourneyItem[]) => void;
  deleteJourney: (id: string) => void;
  moveJourney: (index: number, direction: 'up' | 'down') => void;
  updateMilestones: (milestones: MilestoneItem[]) => void;
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void;
  updateFooterConfig: (config: Partial<FooterConfig>) => void;
  updateYoutubeVideos: (videos: string[]) => void;
  updateAdminPasscode: (code: string) => void;
  
  resetToDefaults: () => void;
  showToast: (message: string) => void;
  downloadVCard: () => void;
  exportAllData: () => string;
  importAllData: (dataJson: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
  }
  return fallback;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const loaded = loadStorage('xom669_profile', DEFAULT_PROFILE);
    if (loaded) {
      if (!loaded.headline || loaded.headline === 'Creative Web Developer & Digital Artist') {
        loaded.headline = DEFAULT_PROFILE.headline;
      }
      if (!loaded.bio || loaded.bio.includes('19-year-old creative developer and digital artist based in Kolkata')) {
        loaded.bio = DEFAULT_PROFILE.bio;
      }
      if (!loaded.specialization || loaded.specialization === 'Brutalist Interfaces, Alpine ISO Builds, Branding') {
        loaded.specialization = DEFAULT_PROFILE.specialization;
      }
      if (!loaded.degree || loaded.degree === 'Undergraduate in Computer Science & Technology') {
        loaded.degree = DEFAULT_PROFILE.degree;
      }
      if (loaded.email === 'dipanjanbaidya2007@gmail.com' || !loaded.email) {
        loaded.email = 'dipanjan@xom669.in';
      }
    }
    return loaded;
  });
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    loadStorage('xom669_projects', DEFAULT_PROJECTS)
  );
  const [materials, setMaterials] = useState<MaterialItem[]>(() =>
    loadStorage('xom669_materials', DEFAULT_MATERIALS)
  );
  const [skills, setSkills] = useState<string[]>(() =>
    loadStorage('xom669_skills', DEFAULT_SKILLS)
  );
  const [journey, setJourney] = useState<JourneyItem[]>(() => {
    const loaded = loadStorage('xom669_journey', DEFAULT_JOURNEY);
    if (Array.isArray(loaded) && loaded.some((item) => item.institution?.includes('University Technical Campus'))) {
      return DEFAULT_JOURNEY;
    }
    return loaded;
  });
  const [milestones, setMilestones] = useState<MilestoneItem[]>(() =>
    loadStorage('xom669_milestones', DEFAULT_MILESTONES)
  );
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => {
    const saved = loadStorage<Partial<HeaderConfig>>('xom669_header_config', DEFAULT_HEADER_CONFIG);
    const merged = { ...DEFAULT_HEADER_CONFIG, ...saved };
    if (merged.brandTitle && merged.brandTitle.toLowerCase() === 'identity card') {
      merged.brandTitle = '';
    }
    return merged;
  });
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() =>
    loadStorage('xom669_footer_config', DEFAULT_FOOTER_CONFIG)
  );
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>(() => {
    const loaded = loadStorage('xom669_youtube_videos', DEFAULT_YOUTUBE_VIDEOS);
    if (Array.isArray(loaded)) {
      const filtered = loaded.filter((v) => !v.includes('jfKfPfyJRdk'));
      if (filtered.length > 0) return filtered;
    }
    return DEFAULT_YOUTUBE_VIDEOS;
  });

  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    try {
      const code = localStorage.getItem('xom669_admin_passcode');
      if (code) return code;
    } catch {}
    return '6699';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Cloud Synchronization across PC and Mobile devices
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const isInitialCloudLoadComplete = useRef(false);

  // Background cloud fetch on startup to unify PC and Mobile
  useEffect(() => {
    let isMounted = true;
    async function initCloudSync() {
      setCloudSyncStatus('syncing');
      try {
        const cloud = await fetchFromCloud();
        if (cloud && isMounted) {
          if (cloud.profile) {
            setProfile((prev) => ({ ...prev, ...cloud.profile }));
            if (Array.isArray(cloud.projects)) setProjects(cloud.projects);
            if (Array.isArray(cloud.materials)) setMaterials(cloud.materials);
            if (Array.isArray(cloud.skills)) setSkills(cloud.skills);
            if (Array.isArray(cloud.journey)) setJourney(cloud.journey);
            if (Array.isArray(cloud.milestones)) setMilestones(cloud.milestones);
            if (cloud.headerConfig) setHeaderConfig(cloud.headerConfig);
            if (cloud.footerConfig) setFooterConfig(cloud.footerConfig);
            if (Array.isArray(cloud.youtubeVideos)) setYoutubeVideos(cloud.youtubeVideos);
            if (cloud.adminPasscode) setAdminPasscode(cloud.adminPasscode);

            setCloudSyncStatus('synced');
            setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
          } else {
            // First time seeding cloud data from defaults
            pushToCloud({
              profile,
              projects,
              materials,
              skills,
              journey,
              milestones,
              headerConfig,
              footerConfig,
              youtubeVideos,
              adminPasscode
            }).then(() => {
              if (isMounted) {
                setCloudSyncStatus('synced');
                setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
              }
            });
          }
        } else if (isMounted) {
          setCloudSyncStatus('synced');
        }
      } catch {
        if (isMounted) setCloudSyncStatus('error');
      } finally {
        if (isMounted) isInitialCloudLoadComplete.current = true;
      }
    }
    initCloudSync();

    // When user switches back to PC or Mobile tab, auto-sync from cloud
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFromCloud().then((cloud) => {
          if (cloud?.profile && isMounted) {
            setProfile((prev) => ({ ...prev, ...cloud.profile }));
            if (Array.isArray(cloud.projects)) setProjects(cloud.projects);
            if (Array.isArray(cloud.materials)) setMaterials(cloud.materials);
            if (Array.isArray(cloud.skills)) setSkills(cloud.skills);
            if (Array.isArray(cloud.journey)) setJourney(cloud.journey);
            if (Array.isArray(cloud.milestones)) setMilestones(cloud.milestones);
            if (cloud.headerConfig) setHeaderConfig(cloud.headerConfig);
            if (cloud.footerConfig) setFooterConfig(cloud.footerConfig);
            if (Array.isArray(cloud.youtubeVideos)) setYoutubeVideos(cloud.youtubeVideos);
            if (cloud.adminPasscode) setAdminPasscode(cloud.adminPasscode);
            setCloudSyncStatus('synced');
            setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Debounced cloud push whenever state is updated (after initial pull)
  useEffect(() => {
    if (!isInitialCloudLoadComplete.current) return;

    setCloudSyncStatus('syncing');
    const timer = setTimeout(() => {
      pushToCloud({
        profile,
        projects,
        materials,
        skills,
        journey,
        milestones,
        headerConfig,
        footerConfig,
        youtubeVideos,
        adminPasscode
      }).then((ok) => {
        if (ok) {
          setCloudSyncStatus('synced');
          setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
        } else {
          setCloudSyncStatus('error');
        }
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [profile, projects, materials, skills, journey, milestones, headerConfig, footerConfig, youtubeVideos, adminPasscode]);

  // Manual sync function for CMS button
  const syncWithCloud = async () => {
    setCloudSyncStatus('syncing');
    showToast('↻ Synchronizing with cloud database...');
    try {
      const cloud = await fetchFromCloud();
      if (cloud) {
        if (cloud.profile) setProfile((prev) => ({ ...prev, ...cloud.profile }));
        if (Array.isArray(cloud.projects)) setProjects(cloud.projects);
        if (Array.isArray(cloud.materials)) setMaterials(cloud.materials);
        if (Array.isArray(cloud.skills)) setSkills(cloud.skills);
        if (Array.isArray(cloud.journey)) setJourney(cloud.journey);
        if (Array.isArray(cloud.milestones)) setMilestones(cloud.milestones);
        if (cloud.headerConfig) setHeaderConfig(cloud.headerConfig);
        if (cloud.footerConfig) setFooterConfig(cloud.footerConfig);
        if (Array.isArray(cloud.youtubeVideos)) setYoutubeVideos(cloud.youtubeVideos);
        if (cloud.adminPasscode) setAdminPasscode(cloud.adminPasscode);
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
        showToast('✓ PC & Mobile are 100% synchronized!');
      } else {
        setCloudSyncStatus('error');
        showToast('✕ Could not reach cloud database.');
      }
    } catch {
      setCloudSyncStatus('error');
      showToast('✕ Network error during sync.');
    }
  };

  // Auto-sync state to localStorage
  useEffect(() => {
    localStorage.setItem('xom669_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('xom669_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('xom669_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('xom669_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('xom669_journey', JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    localStorage.setItem('xom669_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('xom669_header_config', JSON.stringify(headerConfig));
  }, [headerConfig]);

  useEffect(() => {
    localStorage.setItem('xom669_footer_config', JSON.stringify(footerConfig));
  }, [footerConfig]);

  useEffect(() => {
    localStorage.setItem('xom669_youtube_videos', JSON.stringify(youtubeVideos));
  }, [youtubeVideos]);

  useEffect(() => {
    localStorage.setItem('xom669_admin_passcode', adminPasscode);
  }, [adminPasscode]);

  // Toast timer
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const updateProfile = (partial: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    showToast('✓ Profile updated successfully!');
  };

  const updateSocials = (socials: SocialLink[]) => {
    setProfile((prev) => ({ ...prev, socials }));
    showToast('✓ Social links updated!');
  };

  const updateAdminPasscode = (code: string) => {
    setAdminPasscode(code);
    showToast('✓ Admin passcode updated successfully!');
  };

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...project,
      id: `p-${Date.now()}`
    };
    setProjects((prev) => [newProject, ...prev]);
    showToast(`✓ Project "${project.title}" created!`);
  };

  const updateProject = (id: string, partial: Partial<ProjectItem>) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    showToast('✓ Project updated successfully!');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('✓ Project removed from catalog.');
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    setProjects((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
    showToast(`✓ Project order shifted ${direction}.`);
  };

  const addMaterial = (material: Omit<MaterialItem, 'id'>) => {
    const newMaterial: MaterialItem = {
      ...material,
      id: `m-${Date.now()}`
    };
    setMaterials((prev) => [newMaterial, ...prev]);
    showToast(`✓ Study Material "${material.title}" added to Vault!`);
  };

  const updateMaterial = (id: string, partial: Partial<MaterialItem>) => {
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    showToast('✓ Study Material updated!');
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('✓ Study Material removed.');
  };

  const moveMaterial = (index: number, direction: 'up' | 'down') => {
    setMaterials((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
    showToast(`✓ Material moved ${direction}.`);
  };

  const updateSkills = (newSkills: string[]) => {
    setSkills(newSkills);
    showToast('✓ Skills armory updated!');
  };

  const updateJourney = (newJourney: JourneyItem[]) => {
    setJourney(newJourney);
    showToast('✓ Education & Journey updated!');
  };

  const deleteJourney = (id: string) => {
    setJourney((prev) => prev.filter((j) => j.id !== id));
    showToast('✓ Journey milestone removed.');
  };

  const moveJourney = (index: number, direction: 'up' | 'down') => {
    setJourney((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
    showToast(`✓ Journey entry moved ${direction}.`);
  };

  const updateMilestones = (newMilestones: MilestoneItem[]) => {
    setMilestones(newMilestones);
    showToast('✓ Milestones updated!');
  };

  const updateHeaderConfig = (partial: Partial<HeaderConfig>) => {
    setHeaderConfig((prev) => ({ ...prev, ...partial }));
    showToast('✓ Header configuration updated!');
  };

  const updateFooterConfig = (partial: Partial<FooterConfig>) => {
    setFooterConfig((prev) => ({ ...prev, ...partial }));
    showToast('✓ Footer configuration updated!');
  };

  const updateYoutubeVideos = (videos: string[]) => {
    setYoutubeVideos(videos);
    showToast('✓ Featured YouTube video showcase updated!');
  };

  const resetToDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setProjects(DEFAULT_PROJECTS);
    setMaterials(DEFAULT_MATERIALS);
    setSkills(DEFAULT_SKILLS);
    setJourney(DEFAULT_JOURNEY);
    setMilestones(DEFAULT_MILESTONES);
    setHeaderConfig(DEFAULT_HEADER_CONFIG);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    setYoutubeVideos(DEFAULT_YOUTUBE_VIDEOS);
    setAdminPasscode('6699');
    localStorage.clear();
    showToast('✓ Reset all sections to factory default configuration.');
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${profile.fullName.split(' ').slice(1).join(' ') || ''};${profile.fullName.split(' ')[0] || ''};;;
FN:${profile.fullName} (${profile.moniker})
ORG:Dipanjan Baidya Studio
TITLE:${profile.headline}
EMAIL;TYPE=INTERNET,PREF:${profile.email}
TEL;TYPE=CELL:${profile.phone || '+91 98765 43210'}
URL;TYPE=WORK:https://${profile.webHub}
URL;TYPE=GITHUB:${profile.githubUrl}
ADR;TYPE=WORK:;;${profile.location.split(',')[0] || 'Kolkata'};${profile.location.split(',')[1] || 'West Bengal'};;India
NOTE:Cyber Sunset Orange & Obsidian Violet Portfolio Pass • Alpine Linux Builds & Modern Creative Code.
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, '_')}_VCard.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✓ Contact V-Card downloaded successfully!');
  };

  const exportAllData = (): string => {
    const payload = {
      profile,
      projects,
      materials,
      skills,
      journey,
      milestones,
      headerConfig,
      footerConfig,
      youtubeVideos,
      exportedAt: Date.now()
    };
    return JSON.stringify(payload, null, 2);
  };

  const importAllData = (dataJson: string): boolean => {
    try {
      const data = JSON.parse(dataJson);
      if (data && typeof data === 'object') {
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.materials)) setMaterials(data.materials);
        if (Array.isArray(data.skills)) setSkills(data.skills);
        if (Array.isArray(data.journey)) setJourney(data.journey);
        if (Array.isArray(data.milestones)) setMilestones(data.milestones);
        if (data.headerConfig) setHeaderConfig(data.headerConfig);
        if (data.footerConfig) setFooterConfig(data.footerConfig);
        if (Array.isArray(data.youtubeVideos)) setYoutubeVideos(data.youtubeVideos);
        showToast('✓ All portfolio data successfully imported and synced!');
        return true;
      }
      showToast('✕ Invalid portfolio data structure.');
      return false;
    } catch {
      showToast('✕ Error parsing JSON data.');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        materials,
        skills,
        journey,
        milestones,
        headerConfig,
        footerConfig,
        youtubeVideos,
        toastMessage,
        adminPasscode,
        cloudSyncStatus,
        lastSyncedTime,
        syncWithCloud,
        updateProfile,
        updateSocials,
        addProject,
        updateProject,
        deleteProject,
        moveProject,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        moveMaterial,
        updateSkills,
        updateJourney,
        deleteJourney,
        moveJourney,
        updateMilestones,
        updateHeaderConfig,
        updateFooterConfig,
        updateYoutubeVideos,
        updateAdminPasscode,
        resetToDefaults,
        showToast,
        downloadVCard,
        exportAllData,
        importAllData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
