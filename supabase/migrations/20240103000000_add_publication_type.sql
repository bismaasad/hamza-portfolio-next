-- Add publication_type column to publications table
ALTER TABLE public.publications 
ADD COLUMN IF NOT EXISTS publication_type TEXT DEFAULT 'Journal';
