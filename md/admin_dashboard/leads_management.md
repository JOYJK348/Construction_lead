# Admin Dashboard - Leads Management & Approval Workflow

## 1. Introduction
The **Leads Management** module is the operational core of the Durkkas application. This is where raw data captured from the field is transformed into verified business opportunities through a structured approval process.

## 2. Dynamic Search & Intelligent Filtering
To handle large volumes of construction projects, the system provides a robust search and filtering engine:
*   **Universal Search**: A real-time search bar that scans through Lead Numbers, Customer Names, Project Names, and assigned Survey Persons.
*   **Multi-Criteria Filters**:
    *   **Status Filter**: View leads by their lifecycle stage (Roaming, Pending, Won, or Loss).
    *   **Village/Location Filter**: Aggregates unique site locations to help plan logistics.
    *   **Survey Person Filter**: Monitor work assigned to specific field engineers.
*   **Advanced Sorting**: Sort leads by "Newest Arrival," "Customer Name (A-Z)," or "Priority" to ensure no urgent project is missed.

## 3. The Lead Lifecycle States
Managing a construction lead involves several critical statuses:
1.  **Roaming (Active)**: The primary state for leads under construction or active review. These are "Work in Progress."
2.  **Temporarily Closed (Pending)**: Leads where the client was unavailable. These require future follow-ups.
3.  **Waiting**: A transitional state for leads that have missing or incomplete documentation.
4.  **Master (Closed Won)**: The final successful state for projects that have converted into orders.
5.  **Closed Permanently (Closed Loss)**: Projects that are no longer viable.

## 4. The Approval Workflow (Governance)
The Admin acts as the quality controller. Every lead must pass through this gate:

### A. Approval Process
*   **Action**: Clicking the "Approve" button.
*   **Result**: The lead is verified and moved forward in the sales pipeline.

### B. Rejection & Correction Logic
*   **Action**: Clicking the "Reject / Needs Update" button.
*   **The Modal**: Opens a mandatory "Rejection Reason" text area.
*   **Feedback Loop**: The reason (e.g., "Invalid site photo," "Incorrect door count") is logged and sent back to the Field Surveyor's notification center for correction.

### C. Close as Loss Procedure
*   **Action**: Used for non-viable leads.
*   **Mandatory Requirement**: The Admin must select/enter a "Reason for Loss" (e.g., Budget issues, Client opted for a local carpenter).
*   **Data Integrity**: Removing the lead from the active list while preserving the history for future strategy analysis.

## 5. User Interface Features (Mobile & Desktop)
*   **Interactive Cards**: Each lead is presented as a "Lead Card" containing:
    *   **Badges**: Color-coded status labels.
    *   **Quick Metadata**: Assigned engineer, village name, and date of logging.
    *   **Pulse Indicators**: Showing the lead is currently being tracked.
*   **Action Drawer**: Buttons for "View," "Approve," "Reject," and "Archive" are strategically placed for high-speed processing on both touchscreens and mouse-based devices.

## 6. Technical Integration
*   **Supabase Direct**: Actions like `approveLead` and `rejectLead` trigger direct updates to the PostgreSQL database.
*   **Optimistic UI**: The dashboard updates immediately when an action is taken, providing a smooth, lag-free experience for the manager.

## 7. Business Impact
*   **Quality Control**: Prevents bad data from entering the final production sheets.
*   **Accountability**: Every decision (Approve/Reject/Loss) is logged with the Admin's timestamp.
*   **Transparency**: The entire team knows the exact status of every construction project in the territory.
