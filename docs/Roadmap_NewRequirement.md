# Roadmap: Lead & Site Management System Implementation

This roadmap outlines the step-by-step transition from the current "Lead Collection" system to the full "Lead & Site Management System." Each step is designed to be **Playwright-test-friendly** and secure.

---

## Phase 1: Security & Audit Foundation
*Objective: Build the core security layer and audit tracking.*

### Step 1.1: Authentication & Security
- **Task:** Implement **Password Hashing** for all user accounts (using Argon2 or Bcrypt).
- **Task:** Set up **Session Management** (Persistent login sessions with secure cookies/tokens).
- **Task:** Role-based Access Control (Admin vs. Engineer).

### Step 1.2: Global Audit System (Standardized Columns)
- **Task:** Add the following columns to **EVERY** table for full accountability:
    - `created_at` (Timestamp)
    - `created_by` (User ID)
    - `updated_at` (Timestamp)
    - `updated_by` (User ID)
    - `deleted_at` (Timestamp - for **Soft Deletes**)
    - `deleted_by` (User ID)
- **Task:** Implementation of DB Triggers to auto-manage `updated_at`.

### Step 1.3: Schema Refactoring
- **Task:** Create new tables for assignments and visits.
- **New Tables:**
    - `users`: (id, email, password_hash, role, audit_columns...)
    - `lead_assignments`: Track engineer assignments.
    - `site_visit_logs`: Store visit timestamps, geo-coordinates, and village names.
- **Update Existing Tables:** Inject audit columns into `leads`, `customer_contact_details`, etc.

### Step 1.4: Business Logic & Availability Flow
- **Task:** Implement **"Person Not Available"** status logic.
    - If client/engineer not available during visit, mark as `Temporarily Closed`.
    - Capture `callback_date` or `next_availability_timestamp`.
- **Task:** Implement **Duplicate Check**.
    - Query database for existing mobile/address before new Lead ID generation.

---

## Phase 2: Enhanced Lead Creation & Engineer Assignment
*Objective: Move from "Collect Once" to "Manage Ongoing."*

### Step 2.1: Lead ID Generator & Assignment
- **Task:** Create a user-friendly ID generator (e.g., `CL-2024-001`).
- **Task:** Add "Assign Engineer" workflow.

### Step 2.2: Automated Notification System
- **Task:** Create a **Reminder Engine**.
    - System scans `next_availability_timestamp`.
    - **Logic:** Auto-trigger notification/alert to the assigned engineer **1 day before** the scheduled date.
- **Task:** Implement "Site Visit Count" auto-calculation.

---

## Phase 3: Geo-Tagging & Media Integration
*Objective: Automatic location capture for field verification.*

### Step 3.1: GPS & Reverse Geocoding
- **Task:** Integrate `navigator.geolocation` API.
- **Task:** Implement Reverse Geocoding to fetch "Village/Nearest Common Place" from coordinates.
- **Task:** Attach these details to every photo upload.

---

## Phase 4: Core Workflow (The Decision Engine)
*Objective: Implement the Yes/No logic and Master Data migration.*

### Step 4.1: Status & Reason Capture
- **Task:** Add "Approve (Yes) / Reject (No)" buttons on Admin Dashboard.
- **Task:** If "No," show mandatory modal for "Reason Capture."
- **Task:** If "Yes," trigger the migration to the **Master Data Archive**.

### Step 4.2: Roaming Table Logic
- **Task:** Filter the main dashboard to show only "Roaming" (Active/Incomplete) leads by default.

---

## Phase 5: Dashboards & UI/UX Polish
*Objective: Professional management view for Admin and User.*

### Step 5.1: User (Engineer) Dashboard
- **Features:** Show "My Pending Tasks," "Completed Marks," and "Notifications."

### Step 5.2: Admin Dashboard (Advanced)
- **Table Columns:** (Lead ID, Name, Village, Engineer, Visits, Doors Est, Status, Reason, Dates).
- **Filters:** Multi-filter logic (Search by village, engineer, etc.).

---

## Phase 6: Reporting & Exports
*Objective: Data portability.*

### Step 6.1: Excel & PDF Generation
- **Task:** Use libraries like `jsPDF` and `xlsx` to export the filtered Admin data.

---

## Phase 7: Automation & Testing Readiness
*Objective: Ensuring reliability and Playwright integration.*

### Step 7.1: Notifications & Reminders
- **Task:** Set up alerts for upcoming leads and "Completion" notifications for users.

### Step 7.2: Playwright Test Suite Prep
- **Task:** Add `data-testid` attributes to all critical workflow buttons.
- **Task:** Create a testing script for:
    - Successful Lead Creation.
    - Duplicate detection test.
    - Admin Approval -> Move to Master test.

---

## Summary of Flow for Development
1. **DB/Schema Updates** (The Foundation)
2. **Assignment & Visit Logic** (The Workflow)
3. **Geo-location Integration** (The Field Data)
4. **Admin Approval Loop** (The Business Decision)
5. **Dashboard & Filters** (The Management View)
6. **Reporting & Testing** (The Output & Reliability)
