# Admin Dashboard - Home Overview (Detailed Specification)

## 1. Executive Summary
The **Home Overview** serves as the cockpit of the Durkkas Lead Management System. It is designed to minimize the time an administrator spends searching for information by presenting the most critical business metrics immediately upon login.

## 2. Visual Architecture & Design Philosophy
*   **Aesthetics**: Follows a premium "Glassmorphism" design with subtle shadows (`shadow-sm`) and rounded corners (`rounded-3xl`).
*   **Responsiveness**: 
    *   **Desktop**: Displays stats in a wide grid for at-a-glance monitoring.
    *   **Mobile**: Adjusts to a compact layout with an "Instagram-style" bottom navigation bar for easy thumb access.
*   **Real-time Synchronization**: Powered by **Supabase Realtime**, any lead submitted by a surveyor in the field appears on the Admin's dashboard within milliseconds without needing a page refresh.

## 3. Core Functional Components

### A. Dynamic KPI Cards (The "Big Numbers")
Each card is color-coded to represent the psychological state of the lead:
1.  **Total Leads (Indigo)**: Represents the overall brand reach. 
    *   *Interaction*: Clicking this reveals the full database.
2.  **Active Leads / Roaming (Emerald)**: Represents current construction projects.
    *   *Visual Feature*: Includes a "Pulse Animation" (Green dot) to signify live activity.
3.  **Pending / Reminders (Amber)**: Represents "Missed Visits" (Temporarily Closed).
    *   *Criticality*: Displays a badge if the follow-up date is today.
4.  **Closed Won / Master (Blue)**: Represents finalized business orders.
5.  **Closed Loss (Slate)**: Represents archived projects with a documented "Loss Reason".

### B. Field Force Analytics (Survey Person Activity)
This section provides transparency into the field operations:
*   **Activity Ranking**: Lists all Field Survey Persons (Engineers) sorted by the volume of leads they have generated.
*   **Individual Drill-down**: Clicking a staff member's name filters the dashboard to show only their specific leads.
*   **Engagement Tracking**: Helps management identify high performers and team members who may need additional training.

### C. Quick Action Portal
To speed up high-frequency tasks, the Home Overview includes direct action triggers:
*   **Create New Lead**: A primary gradient button (Indigo to Purple) to manually log a lead if necessary.
*   **Jump to Reports**: A secondary link to the Analytics module for deep-dive exports.

## 4. Technical Data Flow
1.  **Initialization**: On component mount, a `fetchLeads` call retrieves the latest snapshot from the `leads` table.
2.  **Subscription**: The system opens a WebSocket channel to listen for `INSERT`, `UPDATE`, and `DELETE` events.
3.  **State Update**: The `stats` object is recalculated instantly whenever a change occurs in the database.

## 5. Business Value
*   **Operational Efficiency**: Reduces the need for phone calls between office and field staff.
*   **Strategic Planning**: Allows the owner to see volume-based trends (e.g., "Why are we getting more leads in Village X?") in real-time.
*   **Motivation**: Real-time staff tracking encourages healthy competition among field engineers.
