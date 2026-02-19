# Admin Dashboard - User Control (Staff Management)

## 1. Introduction
The **User Control** module is the security and administrative backbone of the application. It allows the Super Admin to manage the internal team, including other Administrators and Field Survey Persons, ensuring that only authorized personnel can access sensitive construction data.

## 2. Dynamic User Directory
The interface provides a high-visibility list of all registered team members:
*   **Search & Discovery**: Real-time search functionality by Full Name, Username, Email, or User ID.
*   **Live Metrics**: 
    *   **Total Count**: Overall team size.
    *   **Active Count**: Number of currently authorized users.
    *   **Role Split**: Separate breakdown of Admins vs. Field Surveyors.
*   **Dual View System**:
    *   **Desktop View**: A comprehensive table showing detailed logs and contact info.
    *   **Mobile View**: Optimized "User Cards" for quick on-the-go management.

## 3. Account Roles & Permissions
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

## 4. Account Lifecycle Management
Establishing and maintaining a secure team involves:

### A. Professional Onboarding (Create User)
*   **Unique Credentials**: Every user is assigned a unique system ID (e.g., USR-001) for accountability.
*   **Personal Data**: Collection of Full Name, Email, Phone, and Residential Address.
*   **Auth Setup**: Mandatory Username and secure Password Hash generation.

### B. Dynamic Policy Control (Edit & Update)
*   **Profile Updates**: Admins can update contact info or change a staff member's role if they are promoted.
*   **Password Resets**: Managers can manually reset passwords if a field surveyor forgets their credentials.

### C. Kill-Switch (Activation & Deactivation)
*   **Toggle Switch**: A dedicated "Account Access" toggle allows the Admin to instantly disable a user's account without deleting their historical data.
*   **Use Case**: Essential for temporary staff or immediately barring access if an employee leaves the company.

### D. Permanent Removal (Delete)
*   **Process**: A 2-step confirmation process to prevent accidental deletion.
*   **Impact**: Removes the credentials but preserves the leads already logged by that user (linked via ID) for database integrity.

## 5. Security & Technical Standards
*   **Data Integrity**: Managed via `authService`, interacting with the Supabase `users` table.
*   **Feedback Loop**: The UI provides loader animations (`Loader2`) and toast alerts for all success/fail operations.
*   **Responsive Input**: Modals are "Bottom-Sheet" style on mobile for better ergonomics.

## 6. Business Value
*   **Fraud Prevention**: Ensures that only legitimate company staff can log site visits.
*   **Team Scalability**: Allows the owner to scale the field force from 1 to 100+ engineers with ease.
*   **Accountability**: Every lead in the system is linked to a specific user, making it clear who captured which site data.
