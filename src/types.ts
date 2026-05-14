export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'published' | 'draft';
  link_url?: string;
  category?: string;
  created_at: string;
}
