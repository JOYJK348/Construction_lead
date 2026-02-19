# Admin Dashboard - Follow-ups & Reminders (Missed Visits)

## 1. Introduction
The **Follow-ups & Reminders** system is a specialized workflow designed to recover lost business opportunities. It specifically handles cases where the Field Survey Person visited a site but could not gather full information because the client was unavailable or the site was closed.

## 2. The "Missed Visit" Capture Logic
When an engineer encounters an unavailable client, the system triggers the following protocol:
*   **State Trigger**: The lead is marked as `Temporarily Closed`.
*   **Mandatory Site Identifier**: Instead of the customer name, the engineer captures a "Site Name" (e.g., "Park Avenue Site 3") to uniquely identify the location.
*   **Follow-up Scheduling**: The engineer must select a future **Follow-up Date** based on the client's availability.

## 3. Dedicated Follow-up Hub
The Admin Dashboard features a specialized tab (Reminders) that filters the database to show only active follow-up tasks:
*   **Zero-Noise Interface**: Hides all "Approved" or "Won" leads to keep the team focused only on pending visits.
*   **Time-Sensitive Sorting**: Leads are sorted by their follow-up date, with the most urgent (Today/Overdue) appearing at the top.
*   **Smart Alerts**: A persistent badge in the notification center warns the Admin if there are pending reminders for the current day.

## 4. Requirement Timeline Management
To ensure the project doesn't go cold, the Admin monitors the **Requirement Timeline**:
*   **Calendar Integration**: All follow-up leads display their expected door requirement dates.
*   **Proactive Planning**: If a project requirement is in "1 month" but the client is unavailable, the system flags it as a high-priority follow-up.

## 5. Follow-up Lifecycle
1.  **Stage 1: The Missed Visit**: Engineer logs the site with a "Temporarily Closed" status.
2.  **Stage 2: Automatic Reminder**: On the scheduled date, the Admin receives a notification.
3.  **Stage 3: Assignment/Re-visit**: The Admin instructs the engineer to visit the site again.
4.  **Stage 4: Lead Conversion**: Once the client is met and details are captured, the status is updated to `Roaming`, moving it into the standard approval workflow.

## 6. Business Strategy & Metrics
*   **Recovery Rate**: Measures how many "Temporarily Closed" leads were successfully converted into business.
*   **Churn Prevention**: Ensures that no construction site is forgotten just because the owner wasn't there during the first visit.
*   **Staff Efficiency**: Helps the management plan the engineer's travel routes based on upcoming follow-up dates in the same village/area.

## 7. Technical Implementation
*   **Filtering Logic**: Uses a specific PostgreSQL query: `leads.filter(l => l.status === 'Temporarily Closed')`.
*   **Notification Engine**: A background service (`notificationService`) scans the database daily for leads where the `follow_up_date` matches the current system date.
