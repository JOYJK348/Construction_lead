# Durkkas Lead Management System - Master BRD Documentation

## Table of Contents
1. [Introduction](#1-introduction)
2. [Admin Dashboard Module](#2-admin-dashboard-module)
   - [Overview](#admin-overview)
   - [Leads Management & Approval](#admin-leads)
   - [User Control](#admin-users)
   - [Follow-ups & Reminders](#admin-followups)
   - [Reports & Exports](#admin-reports)
   - [Master Archive (Closed Won)](#admin-won)
   - [Permanent Archive (Closed Loss)](#admin-loss)
   - [Notification Center](#admin-notifications)
   - [Lead Verification Checklist](#admin-verification)
   - [Security & Session Management](#admin-security)
3. [Field Surveyor Module (Process Flow)](#3-field-surveyor-module)
   - [Introduction](#field-intro)
   - [Step 1: Customer Details](#field-step1)
   - [Step 2: Project Details](#field-step2)
   - [Step 3: Stakeholder Details](#field-step3)
   - [Step 4: Door Specifications & Smart Camera](#field-step4)
   - [Step 5: Payment & Priority](#field-step5)
   - [Step 6: Review & Final Submission](#field-step6)
   - [Personal Activity Dashboard](#field-dashboard)
   - [Offline Integrity & Sync Logic](#field-offline)
4. [User Dashboard (Surveyor Interface)](#4-user-dashboard)
   - [Profile & Identity](#user-profile)
   - [Navigation Menu](#user-nav)
   - [Home Overview](#user-home)
   - [My Leads Hub](#user-leads)
   - [New Entry Wizard](#user-wizard)
   - [Under Construction Tracking](#user-pending)
   - [Closed Won (Success)](#user-won)
   - [Notifications & Alerts](#user-notifications)

---

<a name="1-introduction"></a>
# 1. Introduction
Durkkas Lead Management System is a comprehensive platform designed for construction site lead tracking. It bridges the gap between field survey engineers and administrative managers by providing real-time data synchronization, professional reporting, and a guided survey process.

---

<a name="2-admin-dashboard-module"></a>
# 2. Admin Dashboard Module

<a name="admin-overview"></a>
## 2.1 Admin Dashboard - Introduction
The Admin Dashboard is the central control unit for the Durkkas Lead Management System. It is designed for managers and supervisors to track, review, and analyze leads submitted by field survey personnel.

### Primary Objectives
1. **Lead Approval Workflow**: Reviewing and approving/rejecting Roaming or Temporarily Closed leads.
2. **Team Oversight**: Monitoring the activities and performance of field engineers.
3. **Data Analysis**: Generating reports on door requirements and project timelines.
4. **Resubmission Tracking**: Handling leads that have been corrected after rejection.

### Key Interface Elements
* **Dashboard Overview**: Statistics on new, approved, and pending leads.
* **Leads Management**: Detailed table view with filtering and status updates.
* **Reports & Exports**: Tools for data extraction and deep-dive analysis.

---

## 2.2 Admin Dashboard - Home Overview (Detailed Specification)

### 1. Executive Summary
The **Home Overview** serves as the cockpit of the Durkkas Lead Management System. It is designed to minimize the time an administrator spends searching for information by presenting the most critical business metrics immediately upon login.

### 2. Visual Architecture & Design Philosophy
*   **Aesthetics**: Follows a premium "Glassmorphism" design with subtle shadows (`shadow-sm`) and rounded corners (`rounded-3xl`).
*   **Responsiveness**: 
    *   **Desktop**: Displays stats in a wide grid for at-a-glance monitoring.
    *   **Mobile**: Adjusts to a compact layout with an "Instagram-style" bottom navigation bar for easy thumb access.
*   **Real-time Synchronization**: Powered by **Supabase Realtime**, any lead submitted by a surveyor in the field appears on the Admin's dashboard within milliseconds without needing a page refresh.

### 3. Core Functional Components

#### A. Dynamic KPI Cards (The "Big Numbers")
Each card is color-coded to represent the psychological state of the lead:
1.  **Total Leads (Indigo)**: Represents the overall brand reach. 
    *   *Interaction*: Clicking this reveals the full database.
2.  **Active Leads / Roaming (Emerald)**: Represents current construction projects.
    *   *Visual Feature*: Includes a "Pulse Animation" (Green dot) to signify live activity.
3.  **Pending / Reminders (Amber)**: Represents "Missed Visits" (Temporarily Closed).
    *   *Criticality*: Displays a badge if the follow-up date is today.
4.  **Closed Won / Master (Blue)**: Represents finalized business orders.
5.  **Closed Loss (Slate)**: Represents archived projects with a documented "Loss Reason".

#### B. Field Force Analytics (Survey Person Activity)
This section provides transparency into the field operations:
*   **Activity Ranking**: Lists all Field Survey Persons (Engineers) sorted by the volume of leads they have generated.
*   **Individual Drill-down**: Clicking a staff member's name filters the dashboard to show only their specific leads.
*   **Engagement Tracking**: Helps management identify high performers and team members who may need additional training.

#### C. Quick Action Portal
To speed up high-frequency tasks, the Home Overview includes direct action triggers:
*   **Create New Lead**: A primary gradient button (Indigo to Purple) to manually log a lead if necessary.
*   **Jump to Reports**: A secondary link to the Analytics module for deep-dive exports.

### 4. Technical Data Flow
1.  **Initialization**: On component mount, a `fetchLeads` call retrieves the latest snapshot from the `leads` table.
2.  **Subscription**: The system opens a WebSocket channel to listen for `INSERT`, `UPDATE`, and `DELETE` events.
3.  **State Update**: The `stats` object is recalculated instantly whenever a change occurs in the database.

### 5. Business Value
*   **Operational Efficiency**: Reduces the need for phone calls between office and field staff.
*   **Strategic Planning**: Allows the owner to see volume-based trends (e.g., "Why are we getting more leads in Village X?") in real-time.
*   **Motivation**: Real-time staff tracking encourages healthy competition among field engineers.

---

<a name="admin-leads"></a>
## 2.3 Admin Dashboard - Leads Management & Approval Workflow

### 1. Introduction
The **Leads Management** module is the operational core of the Durkkas application. This is where raw data captured from the field is transformed into verified business opportunities through a structured approval process.

### 2. Dynamic Search & Intelligent Filtering
To handle large volumes of construction projects, the system provides a robust search and filtering engine:
*   **Universal Search**: A real-time search bar that scans through Lead Numbers, Customer Names, Project Names, and assigned Survey Persons.
*   **Multi-Criteria Filters**:
    *   **Status Filter**: View leads by their lifecycle stage (Roaming, Pending, Won, or Loss).
    *   **Village/Location Filter**: Aggregates unique site locations to help plan logistics.
    *   **Survey Person Filter**: Monitor work assigned to specific field engineers.
*   **Advanced Sorting**: Sort leads by "Newest Arrival," "Customer Name (A-Z)," or "Priority" to ensure no urgent project is missed.

### 3. The Lead Lifecycle States
Managing a construction lead involves several critical statuses:
1.  **Roaming (Active)**: The primary state for leads under construction or active review. These are "Work in Progress."
2.  **Temporarily Closed (Pending)**: Leads where the client was unavailable. These require future follow-ups.
3.  **Waiting**: A transitional state for leads that have missing or incomplete documentation.
4.  **Master (Closed Won)**: The final successful state for projects that have converted into orders.
5.  **Closed Permanently (Closed Loss)**: Projects that are no longer viable.

### 4. The Approval Workflow (Governance)
The Admin acts as the quality controller. Every lead must pass through this gate:

#### A. Approval Process
*   **Action**: Clicking the "Approve" button.
*   **Result**: The lead is verified and moved forward in the sales pipeline.

#### B. Rejection & Correction Logic
*   **Action**: Clicking the "Reject / Needs Update" button.
*   **The Modal**: Opens a mandatory "Rejection Reason" text area.
*   **Feedback Loop**: The reason (e.g., "Invalid site photo," "Incorrect door count") is logged and sent back to the Field Surveyor's notification center for correction.

#### C. Close as Loss Procedure
*   **Action**: Used for non-viable leads.
*   **Mandatory Requirement**: The Admin must select/enter a "Reason for Loss" (e.g., Budget issues, Client opted for a local carpenter).
*   **Data Integrity**: Removing the lead from the active list while preserving the history for future strategy analysis.

### 5. User Interface Features (Mobile & Desktop)
*   **Interactive Cards**: Each lead is presented as a "Lead Card" containing:
    *   **Badges**: Color-coded status labels.
    *   **Quick Metadata**: Assigned engineer, village name, and date of logging.
    *   **Pulse Indicators**: Showing the lead is currently being tracked.
*   **Action Drawer**: Buttons for "View," "Approve," "Reject," and "Archive" are strategically placed for high-speed processing on both touchscreens and mouse-based devices.

### 6. Technical Integration
*   **Supabase Direct**: Actions like `approveLead` and `rejectLead` trigger direct updates to the PostgreSQL database.
*   **Optimistic UI**: The dashboard updates immediately when an action is taken, providing a smooth, lag-free experience for the manager.

### 7. Business Impact
*   **Quality Control**: Prevents bad data from entering the final production sheets.
*   **Accountability**: Every decision (Approve/Reject/Loss) is logged with the Admin's timestamp.
*   **Transparency**: The entire team knows the exact status of every construction project in the territory.

---

<a name="admin-users"></a>
## 2.4 Admin Dashboard - User Control (Staff Management)

### 1. Introduction
The **User Control** module is the security and administrative backbone of the application. It allows the Super Admin to manage the internal team, including other Administrators and Field Survey Persons, ensuring that only authorized personnel can access sensitive construction data.

### 2. Dynamic User Directory
The interface provides a high-visibility list of all registered team members:
*   **Search & Discovery**: Real-time search functionality by Full Name, Username, Email, or User ID.
*   **Live Metrics**: 
    *   **Total Count**: Overall team size.
    *   **Active Count**: Number of currently authorized users.
    *   **Role Split**: Separate breakdown of Admins vs. Field Surveyors.
*   **Dual View System**:
    *   **Desktop View**: A comprehensive table showing detailed logs and contact info.
    *   **Mobile View**: Optimized "User Cards" for quick on-the-go management.

### 3. Account Roles & Permissions
The system operates on a strictly defined Role-Based Access Control (RBAC) model:
1.  **Administrator (Admin)**: 
    *   Full access to the Command Center.
    *   Can approve/reject leads.
    *   Can create and delete other users.
    *   Access to financial and export reports.
2.  **Field Survey Person (Engineer)**:
    *   Access limited to the Lead Capture Wizard.
    *   Can only see and manage their own assigned leads.
    *   Cannot view global reports or other users' data.

### 4. Account Lifecycle Management
Establishing and maintaining a secure team involves:

#### A. Professional Onboarding (Create User)
*   **Unique Credentials**: Every user is assigned a unique system ID (e.g., USR-001) for accountability.
*   **Personal Data**: Collection of Full Name, Email, Phone, and Residential Address.
*   **Auth Setup**: Mandatory Username and secure Password Hash generation.

#### B. Dynamic Policy Control (Edit & Update)
*   **Profile Updates**: Admins can update contact info or change a staff member's role if they are promoted.
*   **Password Resets**: Managers can manually reset passwords if a field surveyor forgets their credentials.

#### C. Kill-Switch (Activation & Deactivation)
*   **Toggle Switch**: A dedicated "Account Access" toggle allows the Admin to instantly disable a user's account without deleting their historical data.
*   **Use Case**: Essential for temporary staff or immediately barring access if an employee leaves the company.

#### D. Permanent Removal (Delete)
*   **Process**: A 2-step confirmation process to prevent accidental deletion.
*   **Impact**: Removes the credentials but preserves the leads already logged by that user (linked via ID) for database integrity.

### 5. Security & Technical Standards
*   **Data Integrity**: Managed via `authService`, interacting with the Supabase `users` table.
*   **Feedback Loop**: The UI provides loader animations (`Loader2`) and toast alerts for all success/fail operations.
*   **Responsive Input**: Modals are "Bottom-Sheet" style on mobile for better ergonomics.

### 6. Business Value
*   **Fraud Prevention**: Ensures that only legitimate company staff can log site visits.
*   **Team Scalability**: Allows the owner to scale the field force from 1 to 100+ engineers with ease.
*   **Accountability**: Every lead in the system is linked to a specific user, making it clear who captured which site data.

---

<a name="admin-followups"></a>
## 2.5 Admin Dashboard - Follow-ups & Reminders (Missed Visits)

### 1. Introduction
The **Follow-ups & Reminders** system is a specialized workflow designed to recover lost business opportunities. It specifically handles cases where the Field Survey Person visited a site but could not gather full information because the client was unavailable or the site was closed.

### 2. The "Missed Visit" Capture Logic
When an engineer encounters an unavailable client, the system triggers the following protocol:
*   **State Trigger**: The lead is marked as `Temporarily Closed`.
*   **Mandatory Site Identifier**: Instead of the customer name, the engineer captures a "Site Name" (e.g., "Park Avenue Site 3") to uniquely identify the location.
*   **Follow-up Scheduling**: The engineer must select a future **Follow-up Date** based on the client's availability.

### 3. Dedicated Follow-up Hub
The Admin Dashboard features a specialized tab (Reminders) that filters the database to show only active follow-up tasks:
*   **Zero-Noise Interface**: Hides all "Approved" or "Won" leads to keep the team focused only on pending visits.
*   **Time-Sensitive Sorting**: Leads are sorted by their follow-up date, with the most urgent (Today/Overdue) appearing at the top.
*   **Smart Alerts**: A persistent badge in the notification center warns the Admin if there are pending reminders for the current day.

### 4. Requirement Timeline Management
To ensure the project doesn't go cold, the Admin monitors the **Requirement Timeline**:
*   **Calendar Integration**: All follow-up leads display their expected door requirement dates.
*   **Proactive Planning**: If a project requirement is in "1 month" but the client is unavailable, the system flags it as a high-priority follow-up.

### 5. Follow-up Lifecycle
1.  **Stage 1: The Missed Visit**: Engineer logs the site with a "Temporarily Closed" status.
2.  **Stage 2: Automatic Reminder**: On the scheduled date, the Admin receives a notification.
3.  **Stage 3: Assignment/Re-visit**: The Admin instructs the engineer to visit the site again.
4.  **Stage 4: Lead Conversion**: Once the client is met and details are captured, the status is updated to `Roaming`, moving it into the standard approval workflow.

### 6. Business Strategy & Metrics
*   **Recovery Rate**: Measures how many "Temporarily Closed" leads were successfully converted into business.
*   **Churn Prevention**: Ensures that no construction site is forgotten just because the owner wasn't there during the first visit.
*   **Staff Efficiency**: Helps the management plan the engineer's travel routes based on upcoming follow-up dates in the same village/area.

### 7. Technical Implementation
*   **Filtering Logic**: Uses a specific PostgreSQL query: `leads.filter(l => l.status === 'Temporarily Closed')`.
*   **Notification Engine**: A background service (`notificationService`) scans the database daily for leads where the `follow_up_date` matches the current system date.

---

<a name="admin-reports"></a>
## 2.6 Admin Dashboard - Reports & Exports (Business Intelligence)

### 1. Introduction
The **Reports & Exports** module is the data powerhouse of the Durkkas application. It enables the management to aggregate, filter, and export field data into professional formats for auditing, meeting purposes, and long-term business analysis.

### 2. Advanced Multi-Layered Filtering
To extract precise information from thousands of leads, the system offers granular filtering controls:
*   **Search Engine**: Instant lookup by Project Name, Customer Name, Lead ID, or Village.
*   **Date Range Selector**: Filter data by `Start Date` and `End Date`. This is essential for generating monthly or quarterly performance reports.
*   **Territory Analysis (Village)**: Identify which villages are generating the most construction activity.
*   **Field Force Performance**: Filter leads by the assigned **Field Survey Person** to evaluate individual staff productivity.
*   **Lifecycle Stage (Status)**: Segregate data by "Under Construction," "Won," "Pending," or "Loss."

### 3. Real-Time Data Preview
Before committing to an export, the Admin can view a live preview of the filtered data:
*   **Key Metadata**: Displays Date, Lead Number, Customer/Project summary, and Village.
*   **Door Volume Calculation**: Automatically sums up the total number of doors requested in each lead to show the project's scale.
*   **Status Badges**: Visual confirmation of whether the data is active, archived, or waiting.
*   **Drill-Down Access**: An "Eye" icon allows the Admin to quickly open the full details of any lead in the preview list without leaving the report page.

### 4. Professional Export Channels
The system supports two primary export formats, each catering to different business needs:

#### A. Excel Export (.xlsx)
*   **Use Case**: Deep data analysis and manual calculations.
*   **Features**: Exports raw data into a spreadsheet format, including all door specifications, contact numbers, and site details.
*   **Benefit**: Easy to import into other accounting or ERP software.

#### B. PDF Export (.pdf)
*   **Use Case**: Formal documentation, sharing with stakeholders, or printing.
*   **Professional Branding**: Generates a clean, formatted document with the company's reporting structure.
*   **In-App Preview**: A full-screen PDF viewer allows the Admin to verify the report layout (`pdfPreviewUrl`) before downloading the file.

### 5. Technical Architecture
*   **Export Service**: Uses a dedicated `exportService` to handle complex data mapping.
*   **Blob Handling**: PDF previews are generated as blob URLs to ensure privacy and speed.
*   **Responsiveness**: The reporting table automatically switches to a "Card View" on mobile devices, ensuring that reports can be generated even while on the move.

### 6. Business Impact
*   **Accuracy**: Eliminates human error in totals and door counts by using automated accumulation logic.
*   **Strategic Growth**: Analytical reports help management decide where to focus marketing efforts (based on high-performing villages).
*   **Audit Readiness**: Maintains a professional, timestamped archive of every construction lead captured by the company.
*   **Transparency**: Provides the management with a "Single Source of Truth" for all sales and survey activity.

---

<a name="admin-won"></a>
## 2.7 Admin Dashboard - Closed Won (Master Archive)

### 1. Introduction
The **Closed Won** module, also known as the **Master Archive**, is the final sanctuary for all successfully converted leads. Once a construction project is verified, completed, and finalized by the Admin, it is transitioned to this high-authority status.

### 2. The Definition of "Master" Status
A lead enters the Master Archive only when:
*   The field survey is complete.
*   The Admin has reviewed and approved the technical specifications.
*   The project has reached its final successful conclusion (Order Finalized).
*   **Result**: The lead is moved from the active `Roaming` list to the `Master` table.

### 3. Archive Exploration & Filtering
Since the Master Archive houses the history of the company's success, the interface is optimized for high-speed retrieval:
*   **Village-Based Discovery**: A horizontal scrolling selector allows the Admin to quickly filter successful projects by village (e.g., "See all Master leads in Village X").
*   **Advanced Sorting**: 
    *   **Latest First**: Shows recently won projects.
    *   **Oldest First**: For historical data review.
    *   **Alphabetical (A-Z / Z-A)**: Sorted by Customer Name.
*   **Success Metrics**: A real-time counter displays exactly how many "Records of Success" are currently stored in the archive.

### 4. Master Record Card Interface
Every archived lead is presented as a premium "Master Card" with specific visual cues:
*   **Green Theme**: Uses a distinct emerald border (`border-emerald-200`) and background to signify a positive outcome.
*   **Won Badge**: A persistent "Won" label with a `CheckCircle` icon.
*   **Metadata Density**:
    *   **Lead ID**: The permanent unique identifier.
    *   **Project & Customer**: High-visibility titles.
    *   **Staff Credit**: Displays the name of the Field Survey Person who captured the lead.
    *   **Completion Date**: A precise date showing when the lead was moved to the Master state.

### 5. Data Permanence & Access
*   **View-Only Integrity**: Leads in the Master Archive are generally preserved in their final state. The Admin can click "View Details" to see the full technical specifications (door counts, dimensions, site photos) for future reference or repeat orders.
*   **Operational Cleanliness**: Moving leads here ensures the main "Leads Management" screen only contains active, actionable items, reducing cognitive load for the manager.

### 6. Business Value & Analytics
*   **Conversion Insights**: Helps calculate the "Win Rate" of the field force.
*   **Portfolio Showcase**: Acts as a digital portfolio of completed work.
*   **Long-Term Relationships**: Makes it easy to find old customer data if they return for a new project years later.

### 7. Technical Implementation
*   **State Filtering**: Uses the logic `leads.filter(l => l.status === 'Master')`.
*   **Responsive Grid**: Implements a responsive layout that scales from a single column on mobile to a 3-column grid on desktop monitors.
*   **Animations**: Uses `framer-motion` for smooth entry animations when a lead is first viewed in the archive.

---

<a name="admin-loss"></a>
## 2.8 Admin Dashboard - Closed Loss (Permanent Archive)

### 1. Introduction
The **Closed Loss** module is a strategic database of projects that did not lead to a successful outcome. Rather than simply deleting lost projects, the system archives them to provide data-driven insights into why business opportunities are being missed.

### 2. The Core Logic: "Why We Lost"
A lead is transitioned to the Closed Loss archive only when an Administrator manually marks it as `Closed Permanently`. 
*   **The Mandate**: The Admin must provide a **Loss Reason** (e.g., Client cancelled, Price mismatch, Competitor selection).
*   **The Purpose**: To ensure that every failed lead serves as a learning opportunity for the organization.

### 3. UI/UX: The Loss Card Philosophy
To differentiate from successful projects, the Closed Loss archive uses a distinct visual language:
*   **Alert Aesthetic**: Uses red highlights (`bg-red-50`), red borders, and `XCircle` icons to signify a non-converted state.
*   **Reason Highlight**: A specialized box (Reason for Loss) is prominently displayed on the card, showing the Admin's comments in an italicized format for immediate clarity.
*   **Historical Accuracy**: Displays the exact date the lead was moved to the loss state (`Closed On`).

### 4. Exploration & Analysis Tools
*   **Location Filtering**: Identify if a specific village or area has a higher rate of lost projects.
*   **Performance Tracking**: See which Field Survey Persons are associated with high-attrition leads.
*   **Chronological Sorting**: Evaluate if losses occur more frequently during specific seasons or time periods.

### 5. Technical Specification
*   **State Management**: Filters data using `leads.filter(l => l.status === 'Closed Permanently')`.
*   **Data Integrity**: Even though the project is "Lost," all captured site data, photos, and door specifications are preserved in the database for up to 5 years (audit-ready).
*   **Dynamic Layout**: Uses a multi-column responsive grid powered by `framer-motion` for a premium feel, even in the archive.

### 6. Business Value
*   **Competitive Intelligence**: Aggregating loss reasons helps identify if competitors are beating the company on price or service speed.
*   **Operational Transparency**: Prevents surveyors from being penalized for lost leads if the cancellation reason was beyond their control (e.g., project shelved by client).
*   **Future Recovery**: If a client reappears after 6 months for the same site, the Admin can quickly retrieve the old "Lost" lead to resume the conversation with full context.

### 7. Workflow
1.  **Lead Identification**: Admin identifies a non-viable lead in the management view.
2.  **Archival Action**: Admin clicks "Close as Loss" and enters the mandatory reason.
3.  **Final Move**: The lead disappears from the active dashboard and is permanently stored in the **Closed Loss Archive**.

---

<a name="admin-notifications"></a>
## 2.9 Admin Dashboard - Notification Center & Real-time Alerts

### 1. Introduction
The **Notification Center** is the central communication hub of the Durkkas application. It ensures that the right person receives the right information at the right time, preventing delays in project approvals, follow-ups, and field assignments.

### 2. Real-time Infrastructure
The system is built on **Supabase Realtime (WebSockets)**, providing an "Always-On" experience:
*   **Instant Delivery**: When a surveyor submits a lead or an Admin rejects one, the target user receives a notification in milliseconds without refreshing the page.
*   **Haptic & Visual Cues**: Mobile devices receive a subtle vibration (`vibrate` API) and a glowing "Pulse" animation on the bell icon to signify new activity.
*   **Unread Counter**: A vibrant red badge (e.g., "9+") keeps the Admin informed of the total volume of unaddressed updates.

### 3. Notification Types & Intelligence
Notifications are categorized into distinct types, each with its own visual identity (Action Icons and Colors):

| Type | Icon | Meaning | Receiver |
| :--- | :---: | :--- | :--- |
| **Reminder** | ⏰ | Upcoming follow-up or meeting | Admin & Surveyor |
| **Approval** | ✓ | Lead has been verified and approved | Field Surveyor |
| **Rejection** | ✗ | Lead needs correction / photo retake | Field Surveyor |
| **Assignment** | 👤 | A new lead or region has been assigned | Field Surveyor |
| **Completion** | ✅ | Project moved to Master Archive | Admin Team |

### 4. Automated Reminder Engine (`notificationService`)
The system includes a proactive background service that scans for upcoming deadlines:
*   **Follow-up Alerts**: Automatically scans the database for leads with `Temporarily Closed` status.
*   **Tomorrow's Agenda**: Every evening/morning, the engine finds meetings scheduled for the next day and pushes alerts to both the Admin and the respective surveyor.
*   **Dynamic Messaging**: Reminders include the Customer Name and Project Name (e.g., "⏰ Meeting with John Doe (Site A) is scheduled for tomorrow").

### 5. User Interface - The "Center" Experience
*   **The Dropdown Hub**: A quick-access menu from the header with a scrollable list of recent updates.
*   **Full-Page View**: A dedicated dashboard (`/admin/notifications`) for managing large volumes of alerts, categorized by "Today" and "Earlier".
*   **Accountability Features**: 
    *   **Mark All as Read**: Instantly clears the badge once the Admin has reviewed the log.
    *   **Delete Individual**: Allows users to clean up their personal alert history.
    *   **Persistence**: Notifications are stored in the database, ensuring no history is lost if the user logs out.

### 6. Business Value
*   **Reduced Friction**: Eliminates the need for manual check-ins (e.g., "Did you see my lead submission?").
*   **Zero-Miss Follow-ups**: Ensures that clients who were initially "Unavailable" are re-contacted precisely on the agreed date.
*   **Speed of Action**: Notifications drive the Admin to approve leads faster, leading to quicker business conversion.

### 7. Technical Workflow
1.  **Trigger**: Database event (Insert/Update) occurs in `leads` or `notifications` table.
2.  **Broadcast**: Supabase Broadcasts the change to the specific `user_id` channel.
3.  **Reception**: The `NotificationCenter` component receives the payload and updates the local state.
4.  **Action**: The user clicks the notification to jump directly to the relevant lead details.

---

<a name="admin-verification"></a>
## 2.10 Admin Dashboard - Lead Verification Checklist

### 1. Introduction
The **Lead Verification** process is the quality control gate of the Durkkas Lead Management System. Before an Admin clicks the "Approve" button, they must perform a 4-point verification check to ensure data accuracy and site feasibility.

### 2. The 4-Point Verification Checklist

#### A. Customer & Identity Verification
*   **Name & Contact**: Ensure the customer name is professionally entered (No nicknames or placeholders like "XYZ").
*   **Phone Validation**: Verify the mobile number is reachable.
*   **Duplicate Check**: The system automatically checks for duplicate lead numbers; however, the Admin should manually verify if a customer with the same site address already exists in the archive.

#### B. Project & Site Specifications
*   **Door Count Accuracy**: Cross-check the "Total Doors" captured with the individual door specifications.
*   **Dimensions Logic**: Review the height/width measurements. (e.g., If a door height is entered as "2 feet" instead of "7 feet", it must be flagged for correction).
*   **Site Context**: Ensure the village name and project name align with the territory assigned to that specific surveyor.

#### C. Visual Evidence (Photo Quality)
This is the most critical part of the verification process. The Admin must verify:
*   **Clarity**: Photos must be clear and not blurred.
*   **Evidence of Measurement**: Photos should ideally show the surveyor taking measurements at the site.
*   **Site Identification**: One photo should capture the overall site/building context to prevent fraudulent submissions.
*   **Decision**: If photos are missing or low-quality, the lead **must be rejected** with the reason: *"Low-quality photos, please re-visit and re-upload."*

#### D. Location & Map Integrity
*   **Geotag Alignment**: Access the map location provided by the surveyor.
*   **Address Match**: Check if the physical address entered manually matches the GPS location pinned on the map.
*   **Territory Integrity**: Ensure the site visit didn't happen outside the authorized operations area.

### 3. Decision Matrix
| Outcome | Action | System Result |
| :--- | :--- | :--- |
| **Pass** | Click "Approve" | Lead moves to active pipeline and notified to user. |
| **Fail (Minor)** | Click "Reject" | Reason is sent back for correction (e.g., "Change address"). |
| **Fail (Critical)** | Click "Close as Loss" | If the site is determined to be fake or non-viable. |

### 4. Technical Quality Guardrails
*   **Optimistic UI**: Whenever a verification result is logged, the dashboard updates immediately.
*   **Audit Logger**: The system records which Admin performed the verification and at what time.

### 5. Business Impact
*   **Waste Reduction**: Prevents production teams from manufacturing doors based on incorrect measurements.
*   **Operational Training**: Rejection reasons help in training field surveyors to be more accurate in future visits.
*   **Fraud Prevention**: Strict photo and GPS verification ensures engineers are physically visiting sites.

---

<a name="admin-security"></a>
## 2.11 Admin Dashboard - Security & Session Management

### 1. Introduction
The **Security & Session Management** module ensures that the Admin Dashboard remains protected from unauthorized access. It governs how administrators log in, how their active sessions are maintained, and how they manage their professional profile.

### 2. Authentication Protocol
*   **Role-Based Access**: Only users with the `Admin` role in the database can access the dashboard. If a surveyor attempts to access `/admin`, the system automatically redirects them to the Surveyor portal.
*   **Secure Login**: Credentials are verified via Supabase Auth, ensuring industry-standard encryption for passwords.

### 3. Session Lifecycle (Duration & Security)
The application implements an active session monitoring system to prevent data leaks on shared computers:
*   **Auto-Expiry**: If the Admin is inactive or the authentication token expires, the system triggers the `SessionExpired` state.
*   **Token Refresh**: The application automatically attempts to refresh the secure token in the background to ensure smooth work without frequent re-logins.
*   **Manual Logout**: A prominent "Logout" button in the menu immediately clears all local credentials and redirects the user to the login screen.

### 4. Protected Routes
*   **URL Guarding**: Every admin route (e.g., `/admin/users`, `/admin/reports`) is guarded. 
*   **Logic**: Before rendering any admin component, the system checks:
    1.  Is the user logged in?
    2.  Is the role `admin`?
    If any check fails, the dashboard content is blocked.

### 5. Profile Management
From the **Profile Menu (Top-Right Sidebar)**, the Admin can:
*   **Identity Snapshot**: View their Full Name, Email, and Role.
*   **Credential Update**: (Planned) Update their password or login username.
*   **Navigation Shortcuts**: Quickly jump between different sectors of the dashboard without using the main sidebar.

### 6. Real-time Security Sync
*   **Account Deactivation**: If an Admin's account is deactivated by the "Super Admin," their session will be invalidated in the next data sync, forcing them out of the system.
*   **Device History**: (Future) Tracking the IP and device from which the dashboard was accessed.

### 7. Operational Standards for Admins
*   **Session Best Practice**: Admins are encouraged to manually logout once their verification/reporting tasks for the day are complete.
*   **Password Integrity**: Passwords are never stored in plain text; they are hashed before being stored in the database.

---

<a name="3-field-surveyor-module"></a>
# 3. Field Surveyor Module (Process Flow)

<a name="field-intro"></a>
## 3.1 Field Surveyor - Introduction
The Field Surveyor module is a mobile-first application interface designed for engineers and survey personnel working directly at construction sites. It focuses on rapid, accurate, and professional data collection.

### Primary Objectives
1. **Accurate Site Capture**: Recording customer, project, and stakeholder details directly from the site.
2. **Missed Visit Logging**: Ensuring information is captured even when the client is unavailable.
3. **Specification Entry**: Calculating door counts and material requirements.
4. **Live Documentation**: Uploading site photos for transparency and verification.

### Core Features
* **Multi-Step Lead Wizard**: A guided form process to ensure zero data omission.
* **Auto-Location**: Fetching site addresses using GPS to save time.
* **Smart Validation**: Ensuring all mandatory fields like mobile numbers and site names are correct before submission.

---

<a name="field-step1"></a>
## 3.2 Field Surveyor - Step 1: Customer Details

### Feature Description
The first step of the lead capture process focuses on identifying the customer and the site location. It adapts dynamically based on whether the client is physically present.

### Key Sub-Features

#### 1. Client Availability Toggle
* **Client Available (Yes)**: Standard KYC collection (Name, Mobile, Email, Address).
* **Client Not Available (No)**: A specialized mode for "Missed Visits".

#### 2. Client Name / Site Name (Required)
* **Status**: Mandatory in both modes.
* **Purpose**: Even if the client is not found, a site name (e.g., "Dream Villa") must be entered.
* **Language Support**: Supports English and Tamil characters.
* **Validation**: Numbers are allowed (e.g., "Site 101").

#### 3. Smart Address Collection
* **Auto-Fetch**: Integration with OpenStreetMap to fetch address using current GPS coordinates.
* **Manual Edit**: Allows users to refine the fetched address.

#### 4. Communication Details
* **Mobile Number**: Strict 10-digit validation.
* **Email**: Optional with format validation.
* **Secondary Contact**: Fields for alternate persons (Contractors/Spouses).

### Logic & Flow
* If "Not Available" is selected, the "Follow-up Date" and "Estimated Door Count" become mandatory.
* Notifications sent to Admin will include the captured Site Name as the primary identifier.

---

<a name="field-step2"></a>
## 3.3 Field Surveyor - Step 2: Project Details

### Feature Description
This step captures technical details about the construction project to help the sales and production teams understand the scope of work.

### Key Sub-Features

#### 1. Basic Information
* **Project Name**: The official name of the construction project.
* **Building Type**: Selection from predefined types (Independent House, Apartment, Commercial, etc.).
* **Construction Stage**: Tracks the current progress (Foundation, Walls, Ready for Door Work, etc.).

#### 2. Requirement Timeline (Premium Interaction)
* **Status**: Mandatory.
* **Interaction**: Integrated with a native **Date Picker (Calendar)**.
* **Responsive Fixes**: 
    * Entire field acts as a trigger to open the calendar for better mobile UX.
    * Past dates are disabled (Min date = Today).
    * Fixed mobile zooming issues on tap (16px font fix).

#### 3. Estimated Door Count
* **Purpose**: Capture the total volume of potential work.
* **Validation**: Numeric only.

### Logic & Flow
* The timeline selection helps the Admin prioritize the lead (Hot/Warm/Cold).
* Data captured here is used to generate the "Project Analysis" section in the Summary review.

---

<a name="field-step3"></a>
## 3.4 Field Surveyor - Step 03: Stakeholder Details (Influencer Tracking)

### 1. Introduction
The **Stakeholder Details** step is designed to identify and record the key decision-makers and influencers involved in the construction project. In the construction industry, carpenters and contractors often have the final say in material selection, making their information vital for business growth.

### 2. Key Stakeholder Roles
The surveyor can record details for multiple types of influencers:
*   **Carpenter (Main Focus)**: The primary person responsible for installing doors.
*   **Contractor**: The person managing the overall construction site.
*   **Architect / Engineer**: The professional who designed the building.
*   **Neighbor / Reference**: Anyone who referred the project to Durkkas.

### 3. Data Capture Fields
For each stakeholder, the following information is collected:
*   **Stakeholder Name**: Used for personalized follow-ups.
*   **Stakeholder Phone Number**: Essential for the sales team to build a relationship with the influencer.
*   **Role Identification**: Selecting the correct role helps in targeted marketing campaigns (e.g., sending festive wishes or incentives to carpenters).

### 4. Business Rationale (Why this is deep)
*   **Referral Network**: By capturing the carpenter's number, the company can build a database of skilled workers across different villages.
*   **Conflict Resolution**: If there is a mismatch in door measurements later, the surveyor can directly consult the onsite carpenter.
*   **Incentive Programs**: This data is used to track which carpenter brings in the most business, allowing the company to reward loyalty.

### 5. UI & UX Features
*   **Responsive Input**: Optimized keyboard configuration for quick phone number entry on mobile devices.
*   **Real-time Storage**: Data is saved to the local form state, ensuring it isn't lost if the app is minimized.
*   **Skip Option**: If no stakeholder is available, the surveyor can proceed, but the interface highlights the importance of filling this data.

### 6. Technical Integrity
*   **State Management**: Updates the `stakeholder_details` object in the global form data.
*   **Validation**: Simple validation ensures that if a name is entered, a valid 10-digit phone number is also provided.

---

<a name="field-step4"></a>
## 3.5 Field Surveyor - Step 04: Door Specifications & Smart Camera Logic

### 1. Introduction
The **Door Specifications** step is the technical core of the survey. This is where the Site Engineer records the actual manufacturing requirements. It combines manual data entry with "Smart Camera" technology to ensure maximum accuracy.

### 2. Multi-Door Categorization
The system divides requirements into four logical tabs for easier management:
*   **Main Door**: The entry point, usually requiring premium wood and larger dimensions.
*   **Interior Door**: Bedroom and living room doors.
*   **Bathroom Door**: Usually requires waterproof materials (PVC/WPC).
*   **Further Details (General)**: Pooja doors, balconies, or fire exits.

### 3. Data Collection per Door
For every category, the engineer records:
*   **Material Selection**: Choosing from predefined options (Wooden, WPC, Flush, FRP, etc.).
*   **Dimensions (Input)**:
    *   **Height**: Vertical measurement.
    *   **Width**: Horizontal measurement.
*   **Quantity**: Total number of doors required with these specific measurements.
*   **Frame Type**: Specifying if it is a Double Frame or Single Frame.

### 4. Smart Camera Integration (The Deep Feature)
Durkkas uses a specialized camera module that does more than just capture an image:

#### A. Automatic Geo-Tagging (Proof of Visit)
When the "Capture Photo" button is clicked, the app automatically triggers the **GPS module**:
*   **Latitude & Longitude**: Captured instantly.
*   **Village Discovery**: The system performs a "Reverse Geocode" to find the exact Village Name.
*   **Tamper Proof**: The Admin will see exactly where the photo was taken, preventing the surveyor from uploading old photos from a different location.

#### B. Intelligent Image Compression
Since site visits often happen in low-signal areas (villages):
*   **Automatic Downscaling**: High-resolution photos are compressed (max 1024px, 60% quality) before upload.
*   **Bandwidth Efficiency**: Reduces a 5MB photo to roughly 200KB without losing critical technical detail.

#### C. Live Preview & Management
*   **Zoom-In functionality**: Allows the surveyor to check if the measurements in the photo are readable.
*   **Easy Deletion**: Photots can be replaced if the first attempt was blurred.

### 5. Technical Workflow
1.  **Selection**: User selects Door Type (e.g., Interior).
2.  **Trigger**: User clicks the "Camera" icon.
3.  **Process**: Location is fetched -> Photo is captured -> Image is compressed.
4.  **State Update**: The data is mapped to the `door_specifications` JSON object in the database.

### 6. Business Value
*   **Elimination of Error**: Photos provide a visual reference that production teams can use if they doubt the manual measurements.
*   **Management Trust**: Geo-tagging ensures that every lead in the system represents a genuine, physical site visit.
*   **Cost Control**: Accurate quantity and frame type data allow for perfect material estimation, reducing wastage.

---

<a name="field-step5"></a>
## 3.6 Field Surveyor - Step 05: Payment & Priority (Customer Intent)

### 1. Introduction
The **Payment & Priority** step focuses on the commercial aspect of the lead. It helps the sales team prioritize follow-ups based on the customer's budget, expected timeline, and urgency.

### 2. Priority Levels
The surveyor gauges how soon the client needs the doors:
*   **High Priority (Urgent)**: The building is nearing completion (painting/flooring stage). Needs immediate attention.
*   **Medium Priority**: Structure is ready, but woodwork can wait for 1-2 months.
*   **Low Priority**: Early construction stage. The lead is for long-term planning.

### 3. Estimated Completion Timeline
The engineer records a specific **Expected Date** or "Requirement Timeframe".
*   **Business Use**: This date triggers automatic notifications in the Admin Dashboard when the project is nearing its "Warm" period.

### 4. Payment Intent & Budget
While not a formal contract, capturing initial budget expectations is crucial:
*   **Customer Budget Range**: Helps the sales team suggest the right materials (e.g., Premium Wood vs. Budget WPC).
*   **Initial Payment Discussion**: Notes on whether the client is ready with an advance or waiting for a home loan approval.

### 5. Technical Data Structure
*   **Stored in**: `payment_details` table.
*   **Fields**: `priority_level`, `expected_completion_date`, `budget_notes`.

### 6. Strategic Importance
*   **Sales Conversion**: High-priority leads are handled by Senior Admins to ensure a quick conversion.
*   **Production Planning**: Helps the factory forecast how many doors are needed in the current month versus next month.
*   **Relationship Management**: The anticipated completion date allows the company to reach out exactly when the customer is ready to buy.

---

<a name="field-step6"></a>
## 3.7 Field Surveyor - Step 06: Review & Final Submission

### 1. Introduction
The **Review & Submission** screen is the final step of the site survey. It provides a comprehensive summary of all the data collected across the five previous stages. This ensures that the surveyor can correct any errors before the data is committed to the central database.

### 2. The Comprehensive Summary (Single View)
The interface groups all data into logical "Accordion" or "Card" sections:
*   **Customer Header**: Name, Mobile, and Email verification.
*   **Project Meta**: Site location and primary purpose.
*   **Stakeholder List**: Names and roles of contractors/carpenters.
*   **Door Inventory**: A grid showing all specific door measurements and the number of photos captured.
*   **Priority Summary**: Urgency level and expected timeline.

### 3. Data Integrity Validation
Before the "Submit" button is enabled, the system performs a final background check:
*   **Mandatory Field Check**: Ensures no critical field (like Customer Mobile or Height/Width) was accidentally left blank.
*   **Photo Check**: Confirms that at least one verification photo has been attached to the lead.

### 4. The Submission Protocol
When the "Finalize & Submit Lead" button is clicked:
1.  **Loading State**: A `Loader2` animation appears to show data is being pushed to Supabase.
2.  **Multistep Push**: The app sends data to multiple tables (`leads`, `customer_details`, `site_visits`, `door_specifications`) in a single transaction sequence.
3.  **Real-time Trigger**: Once the push is successful, an automatic notification is sent to the **Admin Dashboard** announcing a "New Lead Submitted".

### 5. Post-Submission Feedback
Upon success, the surveyor is directed to a **Success Screen**:
*   **Celebration UI**: Vibrant emerald green theme with a success checkmark.
*   **Dual Options**:
    *   "Collect Another Lead" (Resets the form for the next site).
    *   "Back to Dashboard" (Returns to the activity overview).

### 6. Business Impact
*   **Self-Auditing**: Reduces the amount of "Rejected" leads by allowing surveyors to fix their own mistakes at the site.
*   **Professional Output**: Ensures that the data reaching the Admin is clean, structured, and ready for manufacture.

---

<a name="field-dashboard"></a>
## 3.8 Field Surveyor - Personal Activity Dashboard

### 1. Introduction
The **Field Surveyor Dashboard** is the personal mission control for the Site Engineer. It provides a transparent view of their performance, pending tasks, and the lifecycle of every lead they have captured.

### 2. Real-time KPI Metric Cards
The dashboard greets the surveyor with high-visibility stats (specifically for their account):
*   **Total Leads**: Cumulative number of sites visited.
*   **Approved (Won)**: Total number of leads that successfully reached completion.
*   **Pending (Roaming)**: Leads currently being reviewed by the Admin team.
*   **Recent Activity Log**: A quick-glance list of the last 5-10 leads.

### 3. Lead Tracking Interface
The surveyor can monitor their work through a color-coded status system:
*   **🔵 Roaming (Under Construction)**: The lead is in the admin's queue for review.
*   **🟢 Master (Closed Won)**: Success! The commission or credit is assigned.
*   **🟡 Temporarily Closed (Follow-up)**: The site where the client was unavailable.
*   **🔴 Rejected**: The lead has been sent back for correction. Key reasons (e.g., "Retake photo of bathroom door") are displayed directly on the card.

### 4. On-the-Go Search & Filter
*   **Search Bar**: Deep search by Project Name or Village.
*   **Filter Tabs**: Quickly toggle between "Active" and "Completed" projects.

### 5. Navigation & Shortcuts
*   **Floating "Plus" Button**: A prominent CTA (Call to Action) to start a "New Lead Capture" from any screen.
*   **Profile Access**: Simple logout and profile view (Name, Staff ID, Designated Area).

### 6. Business Value (Motivation & Transparency)
*   **Motivation**: Seeing their "Master" (Won) count grow encourages engineers to capture higher-quality leads.
*   **Clarity**: Eliminates the need for engineers to call the office to ask, "Is my site approved yet?".
*   **Accountability**: If a lead is rejected, the engineer knows why immediately (via the Admin's status reason) and can fix it while still in the same village.

### 7. Technical Implementation
*   **Dynamic Data**: Fetches only the leads where `created_by` matches the `logged_in_user_id`.
*   **Real-time Subscriptions**: The dashboard updates instantly when the Admin changes a lead's status in the office.

---

<a name="field-offline"></a>
## 3.9 Field Surveyor - Offline Integrity & Sync Logic

### 1. Introduction
The site visits often take place in remote villages or construction sites with poor network connectivity (Edge/2G). To ensure that a surveyor never loses data, the application implements a robust **Offline-First Mode**.

### 2. In-Progress Storage (Local State)
*   **Volatile Memory**: While filling the 6-step form, the data is held in the React state.
*   **Session Persistence**: (Planned Improvement) Integrating `localStorage` for form drafts, so that if the phone's battery dies or the browser refreshes, the data is not lost.

### 3. Handling Upload Failures
If a surveyor clicks "Submit" and the internet is unstable:
*   **Retry Logic**: The application displays a "Network Error - Retrying" message.
*   **Lead Preservation**: The data remains in the form UI, allowing the surveyor to move to a higher signal area (like a nearby road or terrace) and click submit again without re-entering the data.

### 4. Media Synchronization (Image Handling)
*   **Foreground Upload**: Images are compressed locally (client-side) before they are ever sent to the server.
*   **Optimistic Notifications**: The app informs the user as each photo is successfully staged for upload.

### 5. Background Refresh
Even if the surveyor isn't filling a form, the app keeps the dashboard updated:
*   **Status Sync**: When the phone regains internet, the app fetches the latest approval/rejection statuses from the server in the background.
*   **Subscription Management**: Uses Supabase Realtime channels to listen for updates specific to that surveyor's ID.

### 6. Business Value
*   **Zero Data Loss**: Ensures that a whole day's work isn't lost due to a simple network glitch.
*   **Surveyor Productivity**: Engineers can focus on capturing measurements and photos without worrying about "Are bars (signal) high enough?".
*   **Reliability**: Builds trust in the digital system among a workforce that might be used to traditional paper-based methods.

---

<a name="4-user-dashboard"></a>
# 4. User Dashboard Module (Surveyor Interface)

<a name="user-profile"></a>
## 4.1 User Dashboard - Profile & Identity (Field Survey Person)

### 1. Overview
Field Survey Person login pannona mela theriyura mudhal vishayam ivanga identity dhan. Idhu system-la "Logged-in User" yaaru-nu confirm panradhuku help pannum.

### 2. Personal Identity Display
*   **User Email**: `dkit.system10@gmail.com` - Idhu dhan engineer-oda unique login id.
*   **Role Label**: `Field Survey Person` - System ivangalakku mattum "Lead Capture" permission mattum approve pannum.
*   **Profile Gradient**: Mobile screen top-la oru premium color gradient background-la (Indigo to Purple) engineer oda initial or photo theriyum.

### 3. Business Purpose
*   **Accountability**: Ella lead-um "dkit.system10@gmail.com" kooda link aagi irukum.
*   **Role Mapping**: Idhu Admin illa-nu system-ku theriyum, adhanala Admin features (User Create/Delete) ivangaluku hide aagi irukum.
*   **Security**: Verify panna mudiyaadha account-la irundhu yaarume survey panna mudiyaadhu.

---

<a name="user-nav"></a>
## 4.2 User Dashboard - Navigation Menu (Sidebar structure)

### 1. Introduction
Surveyor app-oda "Left Sidebar" illa "Mobile Bottom Menu" vazhiya dhan engineer oru feature-la irundhu innoru feature-ku jump panna mudiyum. Idhu romba fast-a and easy-a design panni irukom.

### 2. Menu Structure & Icons
Navigation-la irukura 6 mukkiyamaana options:

| Menu Item | Icon | Description (Tanglish) |
| :--- | :---: | :--- |
| **Home** | 🏠 | Main dashboard overview-ku poga. |
| **My Leads** | 📋 | Namba ippo varaikkum edutha ella lead-ayum list-a paaka. |
| **New Entry** | ➕ | Puthiya customer site survey-a start panna. |
| **Under Construction** | 🚜 | Ippo work-la irukura active projects-a track panna. |
| **Closed Won** | 🏆 | Order confirm aagi mudicha success cases-a paaka. |
| **Notifications** | 🔔 | Admin kudukura updates matrum rejction alerts-a paaka. |

### 3. Visual Feedback
*   **Active State**: Engineer entha page-la irukaaro, antha menu item blue color-la highlight aagi irukum.
*   **Touch Friendly**: Ovvoru button-um mobile-la thumb control-ku ethapadikkum perusa and smooth animations-oda irukum.

---

<a name="user-home"></a>
## 4.3 User Dashboard - Home Overview (Performance Snapshot)

### 1. Overview
Field Survey Person login panna udane paarkura "Command Center" idhu dhan. Inga engineer thanoda daily performance matrum summary-a glass-morphism style cards-la paarkala.

### 2. Dynamic Stat Cards (KPIs)
Dashboard-oda top row-la nalu (4) mukkiyamaana cards irukum:
*   **Total Leads**: Engineer ippo varaikkum collect panna motha data counts.
*   **Under Construction**: Innum "Final Stage" (Won/Loss) varaadha active leads.
*   **Closed Won**: Business record-la "Success"-nu mark panna leads.
*   **Follow-ups**: Survey panni mudichuttu, innum pending-la irukura alerts.

### 3. Recent Leads Activity
Home screen-oda keela, engineer latest-a collect panna 5 leads summary card view-la theriyum:
*   **Quick Glance**: Project name, Village, and Lead Number-a scroll pannama ingaye paathukala.
*   **Status Badges**: Oru lead ippo enna stage-la iruiku-nu (Approved/Rejected/Pending) color-coded badges moolama theriyum.

### 4. UI & Performance
*   **Refresh Logic**: Navigation-la ulla "Home" button-a click panna, latest data-va server-la irundhu fetch panni automatic-a refresh aagum.
*   **Visual Aesthetics**: Soft gradients (Blue and Indigo) use panni, high-end professional look-oda design panni irukom.

### 5. Business Value
Engineer-ku thanoda target and status-a ovvoru vaatiyum Admin-kita kekka thevai illa. Ella data-vum real-time-la kaila irukum.

---

<a name="user-leads"></a>
## 4.4 User Dashboard - My Leads Hub (Data Management)

### 1. Introduction
"My Leads" section dhan engineer-oda digital diary. Inga thaan ella leads-ayum detail-a manage panna mudiyum.

### 2. Advanced Search & Filtering
Engineer-ku leads jaasthi aagum podhu, theduradha easypanna specific features iruku:
*   **Smart Search Bar**: Project name, Customer name, illa Lead number vachi instant-a filter panna mudiyum.
*   **Category Filter**: "All Status", "Under Construction", and "Closed Won"-nu status-a vachi leads-a pirichi paakala.

### 3. Lead Cards & Interaction
Ovvoru lead record-um oru detailed card-a theriyum:
*   **Quick Info**: Phone number, Village location, and Lead ID highlights.
*   **View Details**: Card-a click panna, namba Step 1-6 varaikkum feel panna motha data-vum (including photos) refresh panni paathukala.
*   **Critical Alerts (Rejections)**: Oru lead reject aai irundha, antha card red color-la highlight aagi, Admin kudutha "Reason" (Status Reason) theliva theriyum.

### 4. Edit & Fix Logic
Reject aana leads-ku mattum "Edit & Fix" button theriyum. Adha click panna, thappaana data-va maathittu marupadiyum Admin approval-ku anupala.

### 5. UI Layout
Desktop-la 3-grid layout-layum, Mobile-la single column scroll view-layum clean-a design panni irukom.

### 6. Business Value
Data historical tracking moolama surveyor thanoda progress-a year-wise monitor panna mudiyum.

---

<a name="user-wizard"></a>
## 4.5 User Dashboard - New Entry Wizard

### 1. Overview
"New Entry" dhan surveyor app-oda most used feature. Idhu oru **Multi-step Form** structure-la irukum.

### 2. Step-by-Step Flow
New Entry-a click panna indha 6 steps logic trigger aagum:
1.  **Customer Details**: Name, Phone, and Address.
2.  **Project Details**: Site Location and Site Name.
3.  **Stakeholders**: Carpenter and Contractor phone numbers.
4.  **Door Specifications**: Door types, measurements and Photo capture.
5.  **Payment/Priority**: Urgent project-a illa long-term-a-nu mark panradhu.
6.  **Review**: Submit panradhuku munnadi ellam correct-a check panradhu.

### 3. Tech Guards
*   **Step Indicator**: User entha step-la irukaaru-nu top-la bar theriyum.
*   **Auto-save**: Oru step mudiya mudiya data mobile memory-la temporary-a save aagum.
*   **Camera Lock**: Door specs-la photo edukaama submit panna mudiyaadhu.

---

<a name="user-pending"></a>
## 4.6 User Dashboard - Under Construction (Active Tracking)

### 1. Introduction
"Under Construction" section-la ippo present-a work-la irukura active leads mattum dhan theriyum. Surveyor sample-la indha count **"3"** nu iruku.

### 2. Inclusion Logic
Inga entha leads ellam varum?:
*   **Roaming Status**: Lead create panni Admin approval-ku wait panni-ttu irukuvai.
*   **Temporarily Closed**: Admin rejection panno illa follow-up date wait panni-ttu irukura items.

### 3. UI Indicators
*   **Navigation Badge**: Side menu-la indha option-ku pakkathula orange color badge count (e.g., **3**) eppovume theriyum. 
*   **Visual Alert**: Engineer app-a open panna udane, "Ennaikku innum 3 work pending-la iruku"-nu automatic-a puriyum.

### 4. Transition State
Oru lead-a Admin approve panni "Master"-a mathitta, automatic-a andha lead indha list-la irundhu remove aagi "Closed Won" section-ku shift aagidum.

### 5. Business Value
Work-in-progress (WIP) leads-a epvume monitor panna idhu help pannum. Engineer ethuvume miss panna mudiyadhu.

---

<a name="user-won"></a>
## 4.7 User Dashboard - Closed Won (Success History)

### 1. Overview
"Closed Won" section engineer-oda vetri-a (success) celebrate panra area. Engu order confirm aagi mudicha leads ellam store aagi irukum.

### 2. Master Archive (Surveyor Perspective)
*   **Finalized Records**: Admin approve panni, business "Won" aagi mudicha apro leads "Roaming"-la irundhu inga shift aagum.
*   **Motivation**: Engineer thanoda success count-a paathu performance-a boost panna idhu help pannum.
*   **Future Reference**: Oru vela site-la ethavathu repair illa repeat order keta, inga poyi door specs-a instant-a check panna mudiyum.

### 3. UI Presentation
*   **Green Theme**: Master leads ellame green color borders and badges-oda premium card view-la theriyum.
*   **Time-stamping**: Lead eppo collect panna and eppo "Won" aagudhu-nu date and time-oda display aagum.

---

<a name="user-notifications"></a>
## 4.8 User Dashboard - Notifications & Alerts

### 1. Introduction
"Notifications" dhan app-oda live communication channel. Admin-um Engineer-um pesikura oru digital bridge idhu.

### 2. Notification Types
Engineer-ku eppa alert varum?:
*   **Approval Alerts**: "Unga lead #102 approve aagiduchu!"
*   **Rejection Alerts (Critical)**: "Lead #103 reject aairuchu, photo clear-a illa. Marupadiyum upload pannunga."
*   **New Assignments**: Admin ethavathu site-a visit panna solli assign panna notification varum.
*   **Daily Reminders**: "Innaikku panna vendiya 3 follow-up sites list."

### 3. UI Experience
*   **Real-time Push**: Supabase Realtime moolama "Ting" nu sound-oda (Vibration) live-a notification varum.
*   **Unread Badge**: Inbox-la ethana message innum padikala-nu red color dot theriyum.
*   **Quick Action**: Notification-a click panna direct-a antha lead card-ku trigger aagi poga mudiyum.
