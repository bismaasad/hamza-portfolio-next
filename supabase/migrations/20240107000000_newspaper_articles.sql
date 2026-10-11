-- ==============================================================================
-- Migration: Newspaper Articles Table, Triggers & RLS Policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newspaper_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    newspaper_name TEXT NOT NULL,
    publish_date TEXT,
    author_byline TEXT,
    image_url TEXT,
    article_text TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_newspaper_articles ON public.newspaper_articles;
CREATE TRIGGER set_updated_at_newspaper_articles 
BEFORE UPDATE ON public.newspaper_articles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.newspaper_articles ENABLE ROW LEVEL SECURITY;

-- Public Read (SELECT) Policy
DROP POLICY IF EXISTS "Allow public read access for newspaper_articles" ON public.newspaper_articles;
CREATE POLICY "Allow public read access for newspaper_articles" 
ON public.newspaper_articles FOR SELECT USING (true);

-- Authenticated Admin Full Access Policy
DROP POLICY IF EXISTS "Allow full access for authenticated users on newspaper_articles" ON public.newspaper_articles;
CREATE POLICY "Allow full access for authenticated users on newspaper_articles" 
ON public.newspaper_articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
