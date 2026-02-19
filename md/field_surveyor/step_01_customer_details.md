# Step 1: Customer Details

## Feature Description
The first step of the lead capture process focuses on identifying the customer and the site location. It adapts dynamically based on whether the client is physically present.

## Key Sub-Features

### 1. Client Availability Toggle
* **Client Available (Yes)**: Standard KYC collection (Name, Mobile, Email, Address).
* **Client Not Available (No)**: A specialized mode for "Missed Visits".

### 2. Client Name / Site Name (Required)
* **Status**: Mandatory in both modes.
* **Purpose**: Even if the client is not found, a site name (e.g., "Dream Villa") must be entered.
* **Language Support**: Supports English and Tamil characters.
* **Validation**: Numbers are allowed (e.g., "Site 101").

### 3. Smart Address Collection
* **Auto-Fetch**: Integration with OpenStreetMap to fetch address using current GPS coordinates.
* **Manual Edit**: Allows users to refine the fetched address.

### 4. Communication Details
* **Mobile Number**: Strict 10-digit validation.
* **Email**: Optional with format validation.
* **Secondary Contact**: Fields for alternate persons (Contractors/Spouses).

## Logic & Flow
* If "Not Available" is selected, the "Follow-up Date" and "Estimated Door Count" become mandatory.
* Notifications sent to Admin will include the captured Site Name as the primary identifier.
