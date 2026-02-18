-- 1. பழைய டெஸ்ட் டேட்டாவை கிளியர் செய்தல் (Optional)
-- TRUNCATE leads, customer_details, project_information, site_visits, lead_assignments, door_specifications, payment_details, stakeholder_details, notifications CASCADE;

-- 2. இன்ஜினியர்களை உருவாக்குதல் (Users)
INSERT INTO users (id, full_name, role, email, password_hash) 
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Arun Prasanth', 'engineer', 'arun@leadpro.com', '$2b$10$dummyhash1'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sathish Kumar', 'engineer', 'sathish@leadpro.com', '$2b$10$dummyhash2'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Priyanka Bose', 'engineer', 'priyanka@leadpro.com', '$2b$10$dummyhash3'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Manoj Bharat', 'engineer', 'manoj@leadpro.com', '$2b$10$dummyhash4')
ON CONFLICT (id) DO NOTHING;

-- 3. லீட்களை உருவாக்குதல் (10 Leads)
INSERT INTO leads (id, lead_number, status, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'LP-24-001', 'Master', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'LP-24-002', 'Master', NOW() - INTERVAL '28 days'),
('550e8400-e29b-41d4-a716-446655440003', 'LP-24-003', 'Master', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440004', 'LP-24-004', 'Roaming', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440005', 'LP-24-005', 'Roaming', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440006', 'LP-24-006', 'Roaming', NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440007', 'LP-24-007', 'Roaming', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440008', 'LP-24-008', 'Temporarily Closed', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440009', 'LP-24-009', 'Temporarily Closed', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440010', 'LP-24-010', 'Roaming', NOW() - INTERVAL '4 days');

-- 4. கஸ்டமர் டீடைல்ஸ் (Correct Column: mobile_number)
INSERT INTO customer_details (lead_id, customer_name, mobile_number, email_address, site_address)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh K', '9840112233', 'rajesh@example.com', '123 Main St, Chennai'),
('550e8400-e29b-41d4-a716-446655440002', 'Bala Murugan', '9840112244', 'bala@example.com', '45 North Blvd, Madurai'),
('550e8400-e29b-41d4-a716-446655440003', 'Anitha Devi', '9840112255', 'anitha@example.com', '78 South Ave, Coimbatore'),
('550e8400-e29b-41d4-a716-446655440004', 'Manoj Krishna', '9840112266', 'manoj@example.com', '12 West Rd, Salem'),
('550e8400-e29b-41d4-a716-446655440005', 'Suresh Raina', '9840112277', 'suresh@example.com', '34 East Ln, Trichy'),
('550e8400-e29b-41d4-a716-446655440006', 'Priya Dharshini', '9840112288', 'priya@example.com', '56 Cross St, Chennai'),
('550e8400-e29b-41d4-a716-446655440007', 'Vimal Kumar', '9840112299', 'vimal@example.com', '89 Park Way, Madurai'),
('550e8400-e29b-41d4-a716-446655440008', 'Deepak Raja', '9840112300', 'deepak@example.com', '10 Hill View, Coimbatore'),
('550e8400-e29b-41d4-a716-446655440009', 'Meena Kumari', '9840112311', 'meena@example.com', '21 River Side, Trichy'),
('550e8400-e29b-41d4-a716-446655440010', 'Ram Charan', '9840112322', 'ram@example.com', '32 Garden View, Salem');

-- 5. ப்ராஜெக்ட் டீடைல்ஸ் (Correct Columns: project_name, building_type, construction_stage, door_requirement_timeline, estimated_total_door_count)
INSERT INTO project_information (lead_id, project_name, building_type, construction_stage, door_requirement_timeline, estimated_total_door_count)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Green Villa', 'Individual House', 'Finishing', '1 Month', 5),
('550e8400-e29b-41d4-a716-446655440002', 'Sky Residency', 'Apartment', 'Structure Complete', '3 Months', 12),
('550e8400-e29b-41d4-a716-446655440003', 'Hilltop Homes', 'Villa', 'Flooring', '2 Weeks', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Ocean View', 'Commercial', 'Plastering', '2 Months', 7),
('550e8400-e29b-41d4-a716-446655440005', 'Royal Empire', 'Apartment', 'Ready', 'Immediate', 15),
('550e8400-e29b-41d4-a716-446655440006', 'Lotus Garden', 'Individual House', 'Finishing', '1 Month', 2),
('550e8400-e29b-41d4-a716-446655440007', 'Sunrise Apts', 'Apartment', 'Flooring', '3 Weeks', 8),
('550e8400-e29b-41d4-a716-446655440008', 'Park View', 'Villa', 'Structure', '6 Months', 6),
('550e8400-e29b-41d4-a716-446655440009', 'Gold Tower', 'Office', 'Plastering', '2 Months', 4),
('550e8400-e29b-41d4-a716-446655440010', 'Metro Square', 'Apartment', 'Ready', 'Immediate', 10);

-- 6. சர்வே/சைட் விசிட் (Correct Columns: lead_id, engineer_id, village_name, visit_notes)
INSERT INTO site_visits (lead_id, engineer_id, village_name, visit_notes)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Velachery', 'Visited, measurements taken'),
('550e8400-e29b-41d4-a716-446655440002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'RS Puram', 'Confirmed order size'),
('550e8400-e29b-41d4-a716-446655440003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Anna Nagar', 'Follow up next week'),
('550e8400-e29b-41d4-a716-446655440004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Gandhi Road', 'Quotation sent'),
('550e8400-e29b-41d4-a716-446655440005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Steel City', 'Waiting for advance'),
('550e8400-e29b-41d4-a716-446655440006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Thillai Nagar', 'Initial inspection done'),
('550e8400-e29b-41d4-a716-446655440007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Adyar', 'Client requested catalog'),
('550e8400-e29b-41d4-a716-446655440008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Peelamedu', 'Custom door requested'),
('550e8400-e29b-41d4-a716-446655440009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KK Nagar', 'Site work delayed'),
('550e8400-e29b-41d4-a716-446655440010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'White Town', 'Order pending decision');

-- 7. அசைன்மெண்ட்ஸ்
INSERT INTO lead_assignments (lead_id, engineer_id, is_current)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true),
('550e8400-e29b-41d4-a716-446655440002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', true),
('550e8400-e29b-41d4-a716-446655440003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', true),
('550e8400-e29b-41d4-a716-446655440004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', true),
('550e8400-e29b-41d4-a716-446655440005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true),
('550e8400-e29b-41d4-a716-446655440006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', true),
('550e8400-e29b-41d4-a716-446655440007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', true),
('550e8400-e29b-41d4-a716-446655440008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', true),
('550e8400-e29b-41d4-a716-446655440009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true),
('550e8400-e29b-41d4-a716-446655440010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', true);
