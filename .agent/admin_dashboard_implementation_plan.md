# Admin Dashboard - Complete Implementation Plan

## Overview
Build a comprehensive Admin Dashboard with full control over leads, engineers, surveys, reports, and system management.

## Phase 1: Navigation & Layout Structure ✅
**Files to Create/Modify:**
- `src/components/AdminDashboard.jsx` - Main dashboard component with navigation
- `src/components/Admin/` - New folder for admin-specific components

**Navigation Items:**
1. Home Overview
2. Leads Management
3. Survey Entries
4. Engineer Tracking
5. Client Purchases
6. Reports & Exports
7. Notifications
8. Master Data Archive
9. Settings
10. Help/Support

## Phase 2: Home Overview Module
**Components:**
- `src/components/Admin/HomeOverview.jsx`

**Features:**
- Stats tiles (Total, Pending, Completed, Reminders)
- Charts (Engineer visits count/value, Completion trends)
- Quick actions
- Recent activity feed

## Phase 3: Leads Management Module
**Components:**
- `src/components/Admin/LeadsManagement.jsx`
- `src/components/Admin/LeadDetailsModal.jsx`
- `src/components/Admin/LeadEditModal.jsx`

**Features:**
- Create new leads (auto-generate unique Lead ID)
- View all leads in table format
- Filters: Village, Engineer, Client, Date, Status
- Sortable columns
- Edit/update existing leads
- Mark status: Yes (Completed) / No (Not Completed)
- Capture reason if "No"
- Assign engineers to leads
- Export to Excel/PDF

**Table Columns:**
- Lead ID
- Client Name
- Village
- Engineer
- Site Visits
- Doors Est.
- Status
- Reason (if No)
- Completion Date
- Realization Date

## Phase 4: Survey Entry & Requirements Module
**Components:**
- `src/components/Admin/SurveyManagement.jsx`
- `src/components/Admin/SurveyEditModal.jsx`

**Features:**
- Add survey data (site size, door estimation, photos)
- Edit requirements after initial entry
- Track if client already purchased from us or elsewhere
- Geo-tagged photos with location metadata
- Audit trail for changes

## Phase 5: Engineer Tracking Module
**Components:**
- `src/components/Admin/EngineerTracking.jsx`
- `src/components/Admin/EngineerPerformance.jsx`

**Features:**
- Show engineer's current assignments
- Past site visits (count and value)
- Performance summary (completed vs pending)
- Count-wise tracking
- Value-wise tracking
- Engineer comparison charts

## Phase 6: Client Purchases Module
**Components:**
- `src/components/Admin/ClientPurchases.jsx`

**Features:**
- Track goods bought (main door vs other doors)
- Purchase history
- Revenue tracking
- Client purchase patterns

## Phase 7: Reports & Exports Module
**Components:**
- `src/components/Admin/ReportsExports.jsx`

**Features:**
- Generate Excel reports
- Generate PDF reports
- Custom date range selection
- Filter by engineer, village, status
- Download buttons

## Phase 8: Master Data Archive Module
**Components:**
- `src/components/Admin/MasterArchive.jsx`

**Features:**
- Only fully completed leads
- Separate from roaming table
- Search and filter
- Export capabilities
- View-only mode

## Phase 9: Settings Module
**Components:**
- `src/components/Admin/Settings.jsx`

**Features:**
- Role permissions management
- System configuration
- User management
- Notification settings

## Phase 10: Advanced Features
**Features to Implement:**
- Geo-location integration (photos with metadata)
- Auto reminders for pending leads
- Alerts when client not available
- Completion notifications
- Audit trail (every action logged with timestamp)
- Role-based permissions (Admin sees all, Engineers see only their leads)

## Database Schema Requirements
**Tables Needed:**
- `leads` (existing)
- `customer_details` (existing)
- `project_information` (existing)
- `site_visits` (existing)
- `lead_assignments` (existing)
- `notifications` (existing)
- `audit_logs` (new - for tracking all changes)
- `client_purchases` (new - for purchase tracking)
- `engineer_performance` (new - for performance metrics)

## Implementation Order
1. ✅ Create folder structure
2. ✅ Build navigation layout
3. ✅ Implement Home Overview
4. ✅ Build Leads Management (core module)
5. ✅ Add Survey Management
6. ✅ Create Engineer Tracking
7. ✅ Build Reports & Exports
8. ✅ Add Master Archive
9. ✅ Implement Settings
10. ✅ Add advanced features (geo-location, notifications, audit trail)

## Technical Stack
- React (existing)
- Framer Motion (animations)
- Lucide React (icons)
- Supabase (backend)
- Chart.js or Recharts (for graphs)
- XLSX library (Excel export)
- jsPDF (PDF export)

## Estimated Time
- Phase 1-2: 2-3 hours
- Phase 3-4: 3-4 hours
- Phase 5-6: 2-3 hours
- Phase 7-8: 2-3 hours
- Phase 9-10: 3-4 hours
**Total: 12-17 hours of development**

## Next Steps
1. Start with Phase 1: Create navigation structure
2. Build HomeOverview component
3. Implement Leads Management (most critical)
4. Add remaining modules progressively
