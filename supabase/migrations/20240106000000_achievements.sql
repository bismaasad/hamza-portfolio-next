-- ==============================================================================
-- Migration: Achievements Table, Triggers & RLS Policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    year TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_achievements ON public.achievements;
CREATE TRIGGER set_updated_at_achievements 
BEFORE UPDATE ON public.achievements 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Public Read (SELECT) Policy
DROP POLICY IF EXISTS "Allow public read access for achievements" ON public.achievements;
CREATE POLICY "Allow public read access for achievements" 
ON public.achievements FOR SELECT USING (true);

-- Authenticated Admin Full Access Policy
DROP POLICY IF EXISTS "Allow full access for authenticated users on achievements" ON public.achievements;
CREATE POLICY "Allow full access for authenticated users on achievements" 
ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
