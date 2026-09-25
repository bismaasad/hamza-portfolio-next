export interface HeroSection {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  resume_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  content: string;
  image_url?: string | null;
  bio_highlights?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  year: string;
  description?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  image_url?: string | null;
  publisher?: string | null;
  year?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption?: string | null;
  category?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  social_links?: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

