-- ==============================================================================
-- Migration: Administrative Roles Table, Triggers & RLS Policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.administrative_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    responsibilities TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_administrative_roles ON public.administrative_roles;
CREATE TRIGGER set_updated_at_administrative_roles 
BEFORE UPDATE ON public.administrative_roles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.administrative_roles ENABLE ROW LEVEL SECURITY;

-- Public Read (SELECT) Policy
DROP POLICY IF EXISTS "Allow public read access for administrative_roles" ON public.administrative_roles;
CREATE POLICY "Allow public read access for administrative_roles" 
ON public.administrative_roles FOR SELECT USING (true);

-- Authenticated Admin Full Access Policy
DROP POLICY IF EXISTS "Allow full access for authenticated users on administrative_roles" ON public.administrative_roles;
CREATE POLICY "Allow full access for authenticated users on administrative_roles" 
ON public.administrative_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);
