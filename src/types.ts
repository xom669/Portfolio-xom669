export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'published' | 'draft';
  link_url?: string;
  category?: string;
  size?: 'square' | 'large' | 'tall' | 'wide';
  created_at: string;
}
