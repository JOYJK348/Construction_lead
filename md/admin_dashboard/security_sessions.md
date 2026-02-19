# Admin Dashboard - Security & Session Management

## 1. Introduction
The **Security & Session Management** module ensures that the Admin Dashboard remains protected from unauthorized access. It governs how administrators log in, how their active sessions are maintained, and how they manage their professional profile.

## 2. Authentication Protocol
*   **Role-Based Access**: Only users with the `Admin` role in the database can access the dashboard. If a surveyor attempts to access `/admin`, the system automatically redirects them to the Surveyor portal.
*   **Secure Login**: Credentials are verified via Supabase Auth, ensuring industry-standard encryption for passwords.

## 3. Session Lifecycle (Duration & Security)
The application implements an active session monitoring system to prevent data leaks on shared computers:
*   **Auto-Expiry**: If the Admin is inactive or the authentication token expires, the system triggers the `SessionExpired` state.
*   **Token Refresh**: The application automatically attempts to refresh the secure token in the background to ensure smooth work without frequent re-logins.
*   **Manual Logout**: A prominent "Logout" button in the menu immediately clears all local credentials and redirects the user to the login screen.

## 4. Protected Routes
*   **URL Guarding**: Every admin route (e.g., `/admin/users`, `/admin/reports`) is guarded. 
*   **Logic**: Before rendering any admin component, the system checks:
    1.  Is the user logged in?
    2.  Is the role `admin`?
    If any check fails, the dashboard content is blocked.

## 5. Profile Management
From the **Profile Menu (Top-Right Sidebar)**, the Admin can:
*   **Identity Snapshot**: View their Full Name, Email, and Role.
*   **Credential Update**: (Planned) Update their password or login username.
*   **Navigation Shortcuts**: Quickly jump between different sectors of the dashboard without using the main sidebar.

## 6. Real-time Security Sync
*   **Account Deactivation**: If an Admin's account is deactivated by the "Super Admin," their session will be invalidated in the next data sync, forcing them out of the system.
*   **Device History**: (Future) Tracking the IP and device from which the dashboard was accessed.

## 7. Operational Standards for Admins
*   **Session Best Practice**: Admins are encouraged to manually logout once their verification/reporting tasks for the day are complete.
*   **Password Integrity**: Passwords are never stored in plain text; they are hashed before being stored in the database.
