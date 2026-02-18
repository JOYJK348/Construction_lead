-- Add submitted_by column to leads table for role-based access control
ALTER TABLE leads ADD COLUMN submitted_by VARCHAR(255);
