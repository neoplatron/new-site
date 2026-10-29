ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS install_product_type VARCHAR(100);
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS invoice_date DATE;
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS kit_serial_number VARCHAR(100);
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS vehicle_model VARCHAR(150);
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS drive_folder_id TEXT;
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS drive_folder_url TEXT;
ALTER TABLE public.warranty_registrations ADD COLUMN IF NOT EXISTS sheet_logged_at TIMESTAMPTZ;
