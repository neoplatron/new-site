-- Warranty registrations table
CREATE TABLE public.warranty_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    verification_uid VARCHAR(12) UNIQUE NOT NULL,
    warranty_type VARCHAR(20) NOT NULL CHECK (warranty_type IN ('vehicle', 'generator')),
    
    -- Customer details
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(6) NOT NULL,
    
    -- Installation details
    installation_date DATE NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    installed_by VARCHAR(255) NOT NULL,
    garage_name VARCHAR(255),
    
    -- Vehicle/Generator details
    vehicle_number VARCHAR(20),
    product_type VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(50),
    kms_driven INTEGER,
    
    -- Files (stored as base64 or URLs)
    invoice_data TEXT,
    vehicle_rc_data TEXT,
    installation_photos JSONB DEFAULT '[]'::jsonb,
    
    -- Dates
    registration_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Warranty claims table
CREATE TABLE public.warranty_claims (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    warranty_id UUID NOT NULL REFERENCES public.warranty_registrations(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    issue_description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for warranty system - no auth required)
ALTER TABLE public.warranty_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;

-- Public policies (warranty system is public facing, no auth required)
CREATE POLICY "Anyone can insert warranty registrations"
ON public.warranty_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read warranty registrations by UID"
ON public.warranty_registrations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert warranty claims"
ON public.warranty_claims
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read warranty claims"
ON public.warranty_claims
FOR SELECT
USING (true);

-- Index for faster UID lookups
CREATE INDEX idx_warranty_verification_uid ON public.warranty_registrations(verification_uid);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_warranty_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_warranty_registrations_updated_at
BEFORE UPDATE ON public.warranty_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_warranty_updated_at();