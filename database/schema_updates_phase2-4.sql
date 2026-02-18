-- ======================================================
-- Phase 2-4 Schema Updates
-- Additional columns and tables for complete functionality
-- ======================================================

-- Add missing columns to site_visits table
ALTER TABLE site_visits 
ADD COLUMN IF NOT EXISTS village_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS place_details TEXT;

-- Add status_reason column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS status_reason TEXT;

-- Ensure notifications table exists
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'reminder', -- reminder, completion, assignment
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Add next_availability_date if not exists
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS next_availability_date DATE;

COMMENT ON COLUMN site_visits.village_name IS 'Village or nearest place name from reverse geocoding';
COMMENT ON COLUMN site_visits.place_details IS 'Full address details from geocoding service';
COMMENT ON COLUMN leads.status_reason IS 'Reason for rejection or temporary closure';
COMMENT ON COLUMN leads.next_availability_date IS 'Date when customer will be available (for reminders)';
