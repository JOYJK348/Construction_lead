# Project Functional Task Report
**Project Name:** LeadPro (Construction Site Lead Collection System)
**Date:** 2026-01-03
**Status:** Phase 1 - Mobile Field Collection & Admin Dashboard

---

## 1. Executive Summary
This document outlines the current functional capabilities of the LeadPro application. The system consists of a **Mobile-First Field Application** for data collection and a **Web-Based Admin Dashboard** for management and review.

> **Note:** This report matches the active codebase found in `e:\COnstructionLead`. If "Viruthai Pongal" refers to a different feature set not present in this repository, please verify the active workspace. This report covers the **Lead Collection System** and its **Admin Panel**.

---

## 2. Admin Panel (Manager View)
*The "Admin Panel" allows managers to review overlapping field data and track lead status.*

### 2.1 Dashboard Overview
- **Lead Feed:** Displays a chronological list of all submitted leads with key details:
  - Lead ID (e.g., `LEAD - 1735...`)
  - Status (New, Verified, etc.)
  - Project Name
  - Customer Name & Date
  - Total Estimated Doors
- **Quick Links:** button to create a `New Lead` manually from the dashboard.
- **Role-Based View:**
  - **Admins:** View ALL leads from all users.
  - **Field Users:** View ONLY leads submitted by their email.

### 2.2 Search & Filtering
- **Global Search:** Real-time filtering of the lead list by:
  - Lead Number / ID
  - Customer Name
  - Project Name
- **Empty State:** Visual feedback when no leads match the search criteria.

### 2.3 Lead Inspection
- **Detailed View:** Managers can click "View" on any lead card to open the **Summary View**.
- **Data Read-Only:** The view mode prevents accidental edits while reviewing:
  - Full Customer Contact details.
  - Project Stage & Timeline.
  - Stakeholder contacts (Architect/Contractor).
  - Detailed Door Specifications (Materials, Sizes, Quantities, Photos).
  - Payment preferences and Priority status.

---

## 3. Field App (Lead Collection Wizard)
*The core collection tool used by Field Officers (FOS) on site.*

### 3.1 Authentication & Landing
- **Premium Landing Page:** High-impact visuals with animations (Framer Motion) to introduce the system.
- **Login System:** Simple email-based authentication.
  - **Role Awareness:** Directs users to the Form (Field User) or Dashboard (Admin) based on assigned role.

### 3.2 Registration Wizard (6-Step Process)
The form is broken down into 6 logical steps to ensure data completion.

**Step 1: Customer Details**
- **Inputs:** Owner Name, Mobile Number, Email (Optional), Site Address, Alternate Contact, Remarks.
- **Validation:**
  - Name & Address are mandatory.
  - Mobile Number: Strict 10-digit validation; non-numeric characters stripped.

**Step 2: Project Information**
- **Inputs:** Project Name, Building Type (Villa/Apartment/Commercial), Construction Stage (Foundation to Ready), Door Requirement Timeline, Total Units.
- **Mandatory Fields:** Building Type, Stage, Timeline, Estimated Total Door Count.

**Step 3: Stakeholder Details**
- **Inputs:** Architect/Engineer Name & Contact, Contractor Name & Contact.
- **Validation:** Contact numbers validated for format if provided.

**Step 4: Door Specifications**
- **Dynamic Selection:** Users can specify details for multiple door types:
  - Main Door, Interior, Bathroom, Pooja, Balcony, Utility, etc.
- **Per-Door Data:**
  - **Material:** Dropdown/Text selection.
  - **Size:** Dimensions (e.g., 3ft x 7ft).
  - **Quantity:** Numeric input.
  - **Photo Upload:** Integration for capturing/uploading door visuals (stored as Base64/URL).
- **Validation:** At least one door type with Quantity > 0 must be added.

**Step 5: Payment & Priority**
- **Inputs:** Payment Methods (Cash/Bank/Advance), Lead Source, Project Priority (High/Med/Low), Expected Completion Date.
- **Validation:** All fields are required to categorize the lead value.

**Step 6: Review & Submit**
- **Summary Screen:** displayed before final submission to verify all entries.
- **Submission Logic:**
  - Generates unique Lead ID.
  - Atomic transaction: Saves to 5 related database tables simultaneously.
  - **Success Screen:** Visual confirmation with "Collect Another Lead" or "Back to Dashboard" options.

---

## 4. Technical specifications & Validation Rules

### 4.1 Data Integrity
- **Sanitization:**
  - **Mobile:** Auto-removes non-digits.
  - **Names:** Allow text and spaces only.
  - **Addresses:** Allow alphanumeric + basic punctuation.
- **Required Fields:** The wizard prevents navigation to the next step until all required fields in the current section are valid.

### 4.2 Database Structure (Supabase)
The system maps frontend data to the following relational tables:
1.  `leads`: Core record (Status, Submitter, Lead Number).
2.  `customer_contact_details`: Owner info.
3.  `project_information`: Site technical details.
4.  `stakeholder_details`: Key contacts.
5.  `door_specifications`: One-to-many relationship (multiple doors per lead).
6.  `payment_details`: Financial & priority info.
