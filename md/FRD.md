# Functional Requirement Document (FRD)
## Project Name: Construction Lead Management System (LeadPro)
**Version:** 1.0  
**Date:** 2026-02-18

---

## 1. User Roles & Permissions
### 1.1 Admin
*   Full system access.
*   Ability to **View**, **Approve**, or **Reject** leads submitted by engineers.
*   Access to the Admin Dashboard for an overview of all leads (Status: Pending, Roaming, Master, Temporarily Closed).
*   Can create new leads if necessary.

### 1.2 Field Engineer
*   Restricted access to "My Leads" and "New Lead Entry".
*   Can **Create** new leads via the multi-step form.
*   Can **View** the status of their submitted leads.
*   Can **Resubmit** rejected leads after making corrections.

---

## 2. Functional Modules

### 2.1 Authentication Module
**Requirement:** Secure login with email and password.
*   **Idle Timeout:** System automatically logs out users after **30 minutes** of inactivity to ensure security.
*   **Session Management:** Directs users to `/session-expired` upon timeout.
*   **Login Redirects:** Admins go to `/admin`, Engineers to `/engineer`.

### 2.2 Lead Collection Module (Multi-Step Form)
**Requirement:** A guided, step-by-step process to ensure complete data capture.

*   **Step 1: Customer Details (`customer`)**
    *   **Fields:** Customer Name, Mobile Number (Validated), Site Address/Location.
    *   **Logic:** If `isClientAvailable` is "No", allow immediate submission as a "Site Visit" (skips remaining steps).
    *   **Validation:** Address is mandatory. Follow-up Date required if client unavailable.

*   **Step 2: Project Details (`project`)**
    *   **Fields:** Project Name, Building Type, Construction Stage, Door Requirement Timeline, Estimated Total Door Count.
    *   **Validation:** All fields mandatory to gauge potential deal value.

*   **Step 3: Stakeholder Details (`stakeholders`)**
    *   **Fields:** Architect Name & Contact, Contractor Name & Contact.
    *   **Validation:** Architect and Contractor names are required. Review step available.

*   **Step 4: Door Specifications (`doorSpecifications`)**
    *   **Fields:** Door Type, Material, Size, Quantity (Dynamic list - user can add multiple types).
    *   **Validation:** At least **one** door type with quantity > 0 must be added.

*   **Step 5: Payment & Priority (`payment`)**
    *   **Fields:** Payment Methods (Multiple Select), Lead Source, Project Priority, Expected Completion Date.

*   **Step 6: Review & Submit (`summary`)**
    *   **Action:** Displays all entered data for final verification before saving to the database.

### 2.3 Dashboard Module
**Requirement:** Role-specific views for managing leads.
*   **Admin Dashboard:**
    *   Filter leads by Status (Roaming, Master, Closed).
    *   **Action:** Approve Lead (Changes status to 'Master').
    *   **Action:** Reject Lead (Requires reason, sends back to Engineer).
*   **Engineer Dashboard:**
    *   List of leads submitted by the logged-in engineer.
    *   View detailed status of each lead.
    *   "New Lead" button to start the collection form.

### 2.4 Lead Status Lifecycle
*   **Roaming:** Initial status upon submission by Engineer.
*   **Master:** Approved lead (Active project).
*   **Temporarily Closed:** Lead on hold or client unavailable.
*   **Pending:** Awaiting further action or changes.

---

## 3. Technical Requirements

### 3.1 Frontend
*   **Framework:** React (Vite).
*   **Styling:** Tailwind CSS (Responsive Design).
*   **State Management:** React Hooks (`useState`, `useEffect`) & Local Storage persistence (`leadpro_form_data`) to prevent data loss on refresh.
*   **Animations:** Framer Motion for smooth step transitions.

### 3.2 Backend & Database
*   **Platform:** Supabase (PostgreSQL).
*   **Core Tables:**
    *   `users`: Authentication & Roles.
    *   `leads`: Central lead record.
    *   `customer_details`: Linked to `leads`.
    *   `project_information`, `stakeholder_details`, `door_specifications`, `payment_details`: Detailed attributes.
    *   `site_visits`: Tracks geo-location (Latitude/Longitude) and visit notes.

### 3.3 Security & Validation
*   **Form Validation:** Client-side validation for mandatory fields and mobile number format (`validateMobile`).
*   **Access Control:** Role-based routing (Admin routes inaccessible to Engineers).
