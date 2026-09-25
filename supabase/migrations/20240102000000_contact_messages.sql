-- ==============================================================================
-- Migration: Contact Messages table for Hamza Portfolio
-- Enables public contact submissions & admin message management / notifications
-- ==============================================================================

-- 1. Create contact_messages table
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

-- 2. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS set_updated_at_contact_messages ON public.contact_messages;
CREATE TRIGGER set_updated_at_contact_messages 
BEFORE UPDATE ON public.contact_messages 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone (public, anon, authenticated) to INSERT inquiries via the contact form
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert on contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

-- Allow authenticated admins full access (SELECT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow full access for authenticated users on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow full access for authenticated users on contact_messages" 
ON public.contact_messages 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
