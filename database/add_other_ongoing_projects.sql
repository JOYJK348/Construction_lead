-- Migration to add other_ongoing_projects to stakeholder_details
ALTER TABLE stakeholder_details ADD COLUMN IF NOT EXISTS other_ongoing_projects TEXT;
