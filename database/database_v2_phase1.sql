-- ======================================================
-- Phase 1: Security, Audit & Enhanced Management Schema
-- ======================================================

-- Enable UUID extension for better security if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Core Users Table (Security & Sessions)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'engineer')),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);

-- 2. Update Leads Table for Enhanced Tracking
-- We drop and recreate or alter. Let's create a robust version.
DROP TABLE IF EXISTS leads CASCADE;
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., CL-2024-001
    status VARCHAR(50) NOT NULL DEFAULT 'Roaming', -- Roaming, Master, Temporarily Closed
    status_reason TEXT, -- Stores reason if status is 'No' or 'Temporarily Closed'
    next_availability_date TIMESTAMP WITH TIME ZONE, -- For auto-notifications
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id)
);

-- 3. Lead Assignments (Track history of engineers)
CREATE TABLE lead_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    engineer_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- 4. Site Visits & Geo-Tagging
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    engineer_id UUID NOT NULL REFERENCES users(id),
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Geo Data
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    village_name VARCHAR(255),
    place_details TEXT,
    
    -- Visit Outcome
    is_available BOOLEAN DEFAULT TRUE,
    visit_notes TEXT,
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- 5. Customer Details (Updated with Audit)
CREATE TABLE customer_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(255),
    site_address TEXT NOT NULL,
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- 6. Door Specifications (Linked to Site Visits or Leads)
CREATE TABLE door_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES site_visits(id), -- Specific visit when data was collected
    door_type VARCHAR(100) NOT NULL,
    material_type VARCHAR(100),
    size VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    photo_url TEXT,
    is_our_product BOOLEAN DEFAULT TRUE, -- Track if bought from us or elsewhere
    
    -- Audit Columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- ======================================================
-- DB Triggers for Updated_At
-- ======================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_leads BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_customer BEFORE UPDATE ON customer_details FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ======================================================
-- Sample Data for Verification
-- ======================================================

-- Insert a default admin (Password: Admin@123 - Hashed in app logic later)
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@leadpro.com', 'PBKDF2_HASH_PLACEHOLDER', 'System Admin', 'admin');
