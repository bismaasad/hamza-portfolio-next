-- ==============================================================================
-- HAMZA PORTFOLIO - SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATIONS
-- Paste this entire script into the Supabase SQL Editor and click "Run".
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create updated_at trigger helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- TABLES CREATION
-- ==============================================================================

-- Table 1: Hero Section
CREATE TABLE IF NOT EXISTS public.hero (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 2: About Section
CREATE TABLE IF NOT EXISTS public.about (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    image_url TEXT,
    bio_highlights JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 3: Education
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    degree TEXT NOT NULL,
    institute TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 4: Experience
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 5: Publications
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    image_url TEXT,
    publisher TEXT,
    year TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 6: Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'Gilgit Valley',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 7: Contact Information
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 8: Admin Users (for Dashboard / Login)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 9: Contact Messages (Received via Contact Form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- AUTOMATIC UPDATED_AT TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS set_updated_at_hero ON public.hero;
CREATE TRIGGER set_updated_at_hero BEFORE UPDATE ON public.hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_about ON public.about;
CREATE TRIGGER set_updated_at_about BEFORE UPDATE ON public.about FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_education ON public.education;
CREATE TRIGGER set_updated_at_education BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_experience ON public.experience;
CREATE TRIGGER set_updated_at_experience BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_publications ON public.publications;
CREATE TRIGGER set_updated_at_publications BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_gallery ON public.gallery;
CREATE TRIGGER set_updated_at_gallery BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_contact_info ON public.contact_info;
CREATE TRIGGER set_updated_at_contact_info BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_admin_users ON public.admin_users;
CREATE TRIGGER set_updated_at_admin_users BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_contact_messages ON public.contact_messages;
CREATE TRIGGER set_updated_at_contact_messages BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Public Read (SELECT) Policies for portfolio content
CREATE POLICY "Allow public read access for hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Allow public read access for about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Allow public read access for education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read access for experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access for publications" ON public.publications FOR SELECT USING (true);
CREATE POLICY "Allow public read access for gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access for contact_info" ON public.contact_info FOR SELECT USING (true);

-- 2. Public Insert Policy for Contact Messages
CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages FOR INSERT TO public, anon, authenticated WITH CHECK (true);

-- 3. Authenticated Admin Full Access Policies (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Allow full access for authenticated users on hero" ON public.hero FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on about" ON public.about FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on publications" ON public.publications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on contact_info" ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on admin_users" ON public.admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for authenticated users on contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (OPTIONAL STARTER CONTENT)
-- ==============================================================================

INSERT INTO public.hero (title, subtitle, image_url, resume_url)
VALUES (
    'Hamza',
    'Software Engineer & Full-Stack Developer',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    '#'
) ON CONFLICT DO NOTHING;

INSERT INTO public.about (content, image_url, bio_highlights)
VALUES (
    'Passionate software engineer with expertise in building modern, scalable web applications and intuitive digital experiences.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    '["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"]'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO public.education (degree, institute, year, description, order_index)
VALUES 
    ('Bachelor of Science in Computer Science', 'University of Engineering and Technology', '2020 - 2024', 'Focused on Software Engineering, Data Structures, Algorithms, and Cloud Computing.', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.experience (role, company, duration, description, order_index)
VALUES 
    ('Assistant Professor', 'National Textile University Faisalabad', '2023 - Present', 'Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision.', 1),
    ('Lecturer', 'National Textile University Karachi Campus', '2020 - 2023', 'Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision.', 2),
    ('Senior Instructor of Mathematics', 'F.G. Public Colleges Jutial Gilgit', '2018 - 2020', 'Taught Mathematics at intermediate and college level, prepared course content and assessments.', 3),
    ('Lecturer', 'Army Public College Gilgit', '2016 - 2018', 'Taught Mathematics courses at college level.', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.publications (title, description, link, image_url, publisher, year, order_index)
VALUES 
    ('Modern Web Architecture with Next.js and Serverless Backends', 'An in-depth guide to modern application development, state management, and edge deployments.', 'https://github.com', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80', 'Tech Journal', '2024', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.gallery (image_url, caption, order_index)
VALUES 
    ('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'Coding setup and workspace', 1),
    ('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Tech conference & networking', 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.contact_info (email, phone, address, github_url, linkedin_url, twitter_url, instagram_url, social_links)
VALUES (
-- ==============================================================================
-- SUPABASE STORAGE: portfolio-images BUCKET & POLICIES
-- ==============================================================================

-- 1. Create the portfolio-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-images',
    'portfolio-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];

-- 2. Storage Policies for public read and uploads
DROP POLICY IF EXISTS "Public Read Access on portfolio-images" ON storage.objects;
CREATE POLICY "Public Read Access on portfolio-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Allow All Uploads on portfolio-images" ON storage.objects;
CREATE POLICY "Allow All Uploads on portfolio-images"
ON storage.objects FOR INSERT
TO public, anon, authenticated
WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Allow All Updates on portfolio-images" ON storage.objects;
CREATE POLICY "Allow All Updates on portfolio-images"
ON storage.objects FOR UPDATE
TO public, anon, authenticated
USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Allow All Deletes on portfolio-images" ON storage.objects;
CREATE POLICY "Allow All Deletes on portfolio-images"
ON storage.objects FOR DELETE
TO public, anon, authenticated
USING (bucket_id = 'portfolio-images');

