export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'published' | 'draft';
  link_url?: string;
  category?: string;
  size: 'square' | 'large' | 'tall' | 'wide';
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Graphic Design' | 'Coding Languages' | 'Web Development';
  enabled: boolean;
  order?: number;
}

export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  pfp_url: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  updated_at: string;
}
