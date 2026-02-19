# Field Surveyor - Personal Activity Dashboard

## 1. Introduction
The **Field Surveyor Dashboard** is the personal mission control for the Site Engineer. It provides a transparent view of their performance, pending tasks, and the lifecycle of every lead they have captured.

## 2. Real-time KPI Metric Cards
The dashboard greets the surveyor with high-visibility stats (specifically for their account):
*   **Total Leads**: Cumulative number of sites visited.
*   **Approved (Won)**: Total number of leads that successfully reached completion.
*   **Pending (Roaming)**: Leads currently being reviewed by the Admin team.
*   **Recent Activity Log**: A quick-glance list of the last 5-10 leads.

## 3. Lead Tracking Interface
The surveyor can monitor their work through a color-coded status system:
*   **🔵 Roaming (Under Construction)**: The lead is in the admin's queue for review.
*   **🟢 Master (Closed Won)**: Success! The commission or credit is assigned.
*   **🟡 Temporarily Closed (Follow-up)**: The site where the client was unavailable.
*   **🔴 Rejected**: The lead has been sent back for correction. Key reasons (e.g., "Retake photo of bathroom door") are displayed directly on the card.

## 4. On-the-Go Search & Filter
*   **Search Bar**: Deep search by Project Name or Village.
*   **Filter Tabs**: Quickly toggle between "Active" and "Completed" projects.

## 5. Navigation & Shortcuts
*   **Floating "Plus" Button**: A prominent CTA (Call to Action) to start a "New Lead Capture" from any screen.
*   **Profile Access**: Simple logout and profile view (Name, Staff ID, Designated Area).

## 6. Business Value (Motivation & Transparency)
*   **Motivation**: Seeing their "Master" (Won) count grow encourages engineers to capture higher-quality leads.
*   **Clarity**: Eliminates the need for engineers to call the office to ask, "Is my site approved yet?".
*   **Accountability**: If a lead is rejected, the engineer knows why immediately (via the Admin's status reason) and can fix it while still in the same village.

## 7. Technical Implementation
*   **Dynamic Data**: Fetches only the leads where `created_by` matches the `logged_in_user_id`.
*   **Real-time Subscriptions**: The dashboard updates instantly when the Admin changes a lead's status in the office.
