# Admin Dashboard - Notification Center & Real-time Alerts

## 1. Introduction
The **Notification Center** is the central communication hub of the Durkkas application. It ensures that the right person receives the right information at the right time, preventing delays in project approvals, follow-ups, and field assignments.

## 2. Real-time Infrastructure
The system is built on **Supabase Realtime (WebSockets)**, providing an "Always-On" experience:
*   **Instant Delivery**: When a surveyor submits a lead or an Admin rejects one, the target user receives a notification in milliseconds without refreshing the page.
*   **Haptic & Visual Cues**: Mobile devices receive a subtle vibration (`vibrate` API) and a glowing "Pulse" animation on the bell icon to signify new activity.
*   **Unread Counter**: A vibrant red badge (e.g., "9+") keeps the Admin informed of the total volume of unaddressed updates.

## 3. Notification Types & Intelligence
Notifications are categorized into distinct types, each with its own visual identity (Action Icons and Colors):

| Type | Icon | Meaning | Receiver |
| :--- | :---: | :--- | :--- |
| **Reminder** | ⏰ | Upcoming follow-up or meeting | Admin & Surveyor |
| **Approval** | ✓ | Lead has been verified and approved | Field Surveyor |
| **Rejection** | ✗ | Lead needs correction / photo retake | Field Surveyor |
| **Assignment** | 👤 | A new lead or region has been assigned | Field Surveyor |
| **Completion** | ✅ | Project moved to Master Archive | Admin Team |

## 4. Automated Reminder Engine (`notificationService`)
The system includes a proactive background service that scans for upcoming deadlines:
*   **Follow-up Alerts**: Automatically scans the database for leads with `Temporarily Closed` status.
*   **Tomorrow's Agenda**: Every evening/morning, the engine finds meetings scheduled for the next day and pushes alerts to both the Admin and the respective surveyor.
*   **Dynamic Messaging**: Reminders include the Customer Name and Project Name (e.g., "⏰ Meeting with John Doe (Site A) is scheduled for tomorrow").

## 5. User Interface - The "Center" Experience
*   **The Dropdown Hub**: A quick-access menu from the header with a scrollable list of recent updates.
*   **Full-Page View**: A dedicated dashboard (`/admin/notifications`) for managing large volumes of alerts, categorized by "Today" and "Earlier".
*   **Accountability Features**: 
    *   **Mark All as Read**: Instantly clears the badge once the Admin has reviewed the log.
    *   **Delete Individual**: Allows users to clean up their personal alert history.
    *   **Persistence**: Notifications are stored in the database, ensuring no history is lost if the user logs out.

## 6. Business Value
*   **Reduced Friction**: Eliminates the need for manual check-ins (e.g., "Did you see my lead submission?").
*   **Zero-Miss Follow-ups**: Ensures that clients who were initially "Unavailable" are re-contacted precisely on the agreed date.
*   **Speed of Action**: Notifications drive the Admin to approve leads faster, leading to quicker business conversion.

## 7. Technical Workflow
1.  **Trigger**: Database event (Insert/Update) occurs in `leads` or `notifications` table.
2.  **Broadcast**: Supabase Broadcasts the change to the specific `user_id` channel.
3.  **Reception**: The `NotificationCenter` component receives the payload and updates the local state.
4.  **Action**: The user clicks the notification to jump directly to the relevant lead details.
