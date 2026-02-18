-- ============================================
-- Construction Lead Management Database Schema
-- ============================================

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS door_specifications CASCADE;
DROP TABLE IF EXISTS payment_details CASCADE;
DROP TABLE IF EXISTS stakeholder_details CASCADE;
DROP TABLE IF EXISTS project_information CASCADE;
DROP TABLE IF EXISTS customer_contact_details CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- ============================================
-- Main Leads Table
-- ============================================
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    lead_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'New' NOT NULL,
    notes TEXT
);

-- ============================================
-- 1) Customer Contact Details
-- ============================================
CREATE TABLE customer_contact_details (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(255), -- Optional
    address_site_location TEXT NOT NULL,
    alternate_contact_person VARCHAR(255), -- Optional
    alternate_number VARCHAR(20), -- Optional
    remarks TEXT, -- Optional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- 2) Project Information
-- ============================================
CREATE TABLE project_information (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    building_type VARCHAR(100) NOT NULL,
    construction_stage VARCHAR(100) NOT NULL,
    door_requirement_timeline VARCHAR(100) NOT NULL,
    total_units_floors VARCHAR(100), -- Optional (If Multi-Unit)
    estimated_total_door_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- 3) Stakeholder Details
-- ============================================
CREATE TABLE stakeholder_details (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    architect_engineer_name VARCHAR(255) NOT NULL,
    architect_contact_number VARCHAR(20) NOT NULL,
    contractor_name VARCHAR(255) NOT NULL,
    contractor_contact_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- 4) Door Specifications
-- ============================================
CREATE TABLE door_specifications (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    door_type VARCHAR(100) NOT NULL,
    material_type VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    specification_details TEXT, -- Optional (only for Special Door)
    photo_url TEXT, -- Optional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 0)
);

-- ============================================
-- 5) Payment & Project Level Details
-- ============================================
CREATE TABLE payment_details (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    payment_methods TEXT[] NOT NULL, -- Array of payment methods (required, at least one)
    lead_source VARCHAR(100) NOT NULL,
    project_priority VARCHAR(50) NOT NULL,
    expected_completion_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_payment_methods_not_empty CHECK (array_length(payment_methods, 1) > 0),
    CONSTRAINT chk_priority_valid CHECK (project_priority IN ('Hot', 'Warm', 'Cold'))
);

-- ============================================
-- Create Indexes for Better Performance
-- ============================================
CREATE INDEX idx_leads_lead_number ON leads(lead_number);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_customer_lead_id ON customer_contact_details(lead_id);
CREATE INDEX idx_customer_mobile ON customer_contact_details(mobile_number);
CREATE INDEX idx_customer_email ON customer_contact_details(email_address);

CREATE INDEX idx_project_lead_id ON project_information(lead_id);
CREATE INDEX idx_project_building_type ON project_information(building_type);
CREATE INDEX idx_project_construction_stage ON project_information(construction_stage);

CREATE INDEX idx_stakeholder_lead_id ON stakeholder_details(lead_id);

CREATE INDEX idx_door_lead_id ON door_specifications(lead_id);
CREATE INDEX idx_door_type ON door_specifications(door_type);

CREATE INDEX idx_payment_lead_id ON payment_details(lead_id);
CREATE INDEX idx_payment_priority ON payment_details(project_priority);
CREATE INDEX idx_payment_source ON payment_details(lead_source);

-- ============================================
-- Create Updated_At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Apply Updated_At Triggers to All Tables
-- ============================================
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_updated_at
    BEFORE UPDATE ON customer_contact_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_updated_at
    BEFORE UPDATE ON project_information
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholder_updated_at
    BEFORE UPDATE ON stakeholder_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_door_updated_at
    BEFORE UPDATE ON door_specifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at
    BEFORE UPDATE ON payment_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data Insert (Optional - for testing)
-- ============================================
-- Insert a sample lead
INSERT INTO leads (lead_number, status, notes) 
VALUES ('LEAD-2025-0001', 'New', 'Sample lead for testing');

-- Get the last inserted lead_id
DO $$
DECLARE
    sample_lead_id INTEGER;
BEGIN
    SELECT id INTO sample_lead_id FROM leads WHERE lead_number = 'LEAD-2025-0001';
    
    -- Insert sample customer details
    INSERT INTO customer_contact_details (
        lead_id, customer_name, mobile_number, email_address, 
        address_site_location, remarks
    ) VALUES (
        sample_lead_id, 'Rajesh Kumar', '9876543210', 'rajesh@example.com',
        'Plot No 123, Green Valley, Chennai - 600001', 'Urgent requirement'
    );
    
    -- Insert sample project information
    INSERT INTO project_information (
        lead_id, project_name, building_type, construction_stage,
        door_requirement_timeline, total_units_floors, estimated_total_door_count
    ) VALUES (
        sample_lead_id, 'Green Valley Residency', 'Independent House / Villa', 
        'Ready for Door Work', '03/2025', '2 Floors', 12
    );
    
    -- Insert sample stakeholder details
    INSERT INTO stakeholder_details (
        lead_id, architect_engineer_name, architect_contact_number,
        contractor_name, contractor_contact_number
    ) VALUES (
        sample_lead_id, 'Ar. Suresh Kumar', '9876543211',
        'BuildWell Constructions', '9876543212'
    );
    
    -- Insert sample door specifications
    INSERT INTO door_specifications (lead_id, door_type, material_type, size, quantity)
    VALUES 
        (sample_lead_id, 'Main Door', 'Teak Wood', '3ft x 7ft', 1),
        (sample_lead_id, 'Interior Door', 'Flush Door', '2.5ft x 6.5ft', 6),
        (sample_lead_id, 'Bathroom Door', 'PVC/FRP', '2ft x 6.5ft', 3);
    
    -- Insert sample payment details
    INSERT INTO payment_details (
        lead_id, payment_methods, lead_source, project_priority, expected_completion_date
    ) VALUES (
        sample_lead_id, ARRAY['Bank Transfer', 'Advance Payment'], 
        'Referral', 'Hot', '2025-06-30'
    );
END $$;

-- ============================================
-- Useful Views for Reporting
-- ============================================

-- Complete Lead View (All details in one view)
CREATE OR REPLACE VIEW complete_lead_details AS
SELECT 
    l.id as lead_id,
    l.lead_number,
    l.status,
    l.created_at as lead_created_at,
    
    -- Customer Details
    c.customer_name,
    c.mobile_number,
    c.email_address,
    c.address_site_location,
    c.alternate_contact_person,
    c.alternate_number,
    c.remarks as customer_remarks,
    
    -- Project Details
    p.project_name,
    p.building_type,
    p.construction_stage,
    p.door_requirement_timeline,
    p.total_units_floors,
    p.estimated_total_door_count,
    
    -- Stakeholder Details
    s.architect_engineer_name,
    s.architect_contact_number,
    s.contractor_name,
    s.contractor_contact_number,
    
    -- Payment Details
    pay.payment_methods,
    pay.lead_source,
    pay.project_priority,
    pay.expected_completion_date
    
FROM leads l
LEFT JOIN customer_contact_details c ON l.id = c.lead_id
LEFT JOIN project_information p ON l.id = p.lead_id
LEFT JOIN stakeholder_details s ON l.id = s.lead_id
LEFT JOIN payment_details pay ON l.id = pay.lead_id;

-- Door Summary View
CREATE OR REPLACE VIEW door_summary AS
SELECT 
    l.lead_number,
    l.status,
    d.door_type,
    d.material_type,
    d.size,
    d.quantity,
    d.specification_details
FROM leads l
INNER JOIN door_specifications d ON l.id = d.lead_id
ORDER BY l.lead_number, d.door_type;

-- ============================================
-- Comments for Documentation
-- ============================================
COMMENT ON TABLE leads IS 'Main leads table storing basic lead information';
COMMENT ON TABLE customer_contact_details IS 'Section 1: Customer contact information';
COMMENT ON TABLE project_information IS 'Section 2: Project details and requirements';
COMMENT ON TABLE stakeholder_details IS 'Section 3: Architect and contractor information';
COMMENT ON TABLE door_specifications IS 'Section 4: Door type specifications with materials and quantities';
COMMENT ON TABLE payment_details IS 'Section 5 & 6: Payment methods and project priority information';

COMMENT ON COLUMN leads.lead_number IS 'Unique identifier for the lead (e.g., LEAD-2025-0001)';
COMMENT ON COLUMN leads.status IS 'Lead status: New, In Progress, Quoted, Won, Lost';
COMMENT ON COLUMN door_specifications.door_type IS 'Type: Main Door, Interior Door, Bathroom Door, Pooja Door, Balcony Door, Kitchen Utility Door, Glass Door, Fire Exit Door, Special Door';
COMMENT ON COLUMN payment_details.payment_methods IS 'Array of selected payment methods: Bank Transfer, Cash, Advance Payment';
COMMENT ON COLUMN payment_details.project_priority IS 'Priority level: Hot, Warm, Cold';

-- ============================================
-- Grant Permissions (Adjust as needed)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
