# Step 2: Project Details

## Feature Description
This step captures technical details about the construction project to help the sales and production teams understand the scope of work.

## Key Sub-Features

### 1. Basic Information
* **Project Name**: The official name of the construction project.
* **Building Type**: Selection from predefined types (Independent House, Apartment, Commercial, etc.).
* **Construction Stage**: Tracks the current progress (Foundation, Walls, Ready for Door Work, etc.).

### 2. Requirement Timeline (Premium Interaction)
* **Status**: Mandatory.
* **Interaction**: Integrated with a native **Date Picker (Calendar)**.
* **Responsive Fixes**: 
    * Entire field acts as a trigger to open the calendar for better mobile UX.
    * Past dates are disabled (Min date = Today).
    * Fixed mobile zooming issues on tap (16px font fix).

### 3. Estimated Door Count
* **Purpose**: Capture the total volume of potential work.
* **Validation**: Numeric only.

## Logic & Flow
* The timeline selection helps the Admin prioritize the lead (Hot/Warm/Cold).
* Data captured here is used to generate the "Project Analysis" section in the Summary review.
