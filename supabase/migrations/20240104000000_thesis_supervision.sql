-- ==============================================================================
-- Migration: Thesis Supervision Table, Triggers & RLS Policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.thesis_supervision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    reg_no TEXT,
    thesis_title TEXT NOT NULL,
    degree_level TEXT NOT NULL DEFAULT 'MS or MPhil', -- 'PhD', 'MS or MPhil', 'BS'
    role TEXT NOT NULL DEFAULT 'Supervisor', -- 'Supervisor', 'Co-supervisor'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_thesis_supervision ON public.thesis_supervision;
CREATE TRIGGER set_updated_at_thesis_supervision 
BEFORE UPDATE ON public.thesis_supervision 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.thesis_supervision ENABLE ROW LEVEL SECURITY;

-- Public Read (SELECT) Policy
DROP POLICY IF EXISTS "Allow public read access for thesis_supervision" ON public.thesis_supervision;
CREATE POLICY "Allow public read access for thesis_supervision" 
ON public.thesis_supervision FOR SELECT USING (true);

-- Authenticated Admin Full Access Policy
DROP POLICY IF EXISTS "Allow full access for authenticated users on thesis_supervision" ON public.thesis_supervision;
CREATE POLICY "Allow full access for authenticated users on thesis_supervision" 
ON public.thesis_supervision FOR ALL TO authenticated USING (true) WITH CHECK (true);
