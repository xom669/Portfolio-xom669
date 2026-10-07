export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
  badge?: string;
}

export interface ProfileData {
  fullName: string;
  moniker: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  phone?: string;
  webHub: string;
  githubUrl: string;
  altGithubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  twitterUrl: string;
  twitterHandle: string;
  discordHandle: string;
  coverBanner: string;
  avatarImage: string;
  degree: string;
  specialization: string;
  pgpHash: string;
  socials: SocialLink[];
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  images?: string[];
  link_url?: string;
  status?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'systems' | 'branding' | 'code' | 'web' | 'automation';
  desc: string;
  liveUrl?: string;
  githubUrl?: string;
  badge: string;
  tags: string[];
}

export interface MaterialItem {
  id: string;
  title: string;
  category: 'systems' | 'dsa' | 'design' | 'web' | 'notes';
  downloadUrl: string;
  fileType: string;
  fileSize: string;
  desc: string;
  badge?: string;
}

export interface JourneyItem {
  id: string;
  period: string;
  title: string;
  institution: string;
  desc: string;
  status: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  highlight: string;
  desc: string;
}

export interface HeaderConfig {
  showHeader?: boolean;
  showTicker?: boolean;
  brandTitle: string;
  brandBadge: string;
  tickerText: string;
  showCard?: boolean;
  customHeroText?: string;
  cardSpacing?: 'flush' | 'compact' | 'normal';
}

export interface FooterConfig {
  brandmarkText: string;
  subText: string;
  year: string;
}

export interface VideoItem {
  id: string;
  url: string;
  title?: string;
}
