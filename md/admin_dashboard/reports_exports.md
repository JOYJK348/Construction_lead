# Admin Dashboard - Reports & Exports (Business Intelligence)

## 1. Introduction
The **Reports & Exports** module is the data powerhouse of the Durkkas application. It enables the management to aggregate, filter, and export field data into professional formats for auditing, meeting purposes, and long-term business analysis.

## 2. Advanced Multi-Layered Filtering
To extract precise information from thousands of leads, the system offers granular filtering controls:
*   **Search Engine**: Instant lookup by Project Name, Customer Name, Lead ID, or Village.
*   **Date Range Selector**: Filter data by `Start Date` and `End Date`. This is essential for generating monthly or quarterly performance reports.
*   **Territory Analysis (Village)**: Identify which villages are generating the most construction activity.
*   **Field Force Performance**: Filter leads by the assigned **Field Survey Person** to evaluate individual staff productivity.
*   **Lifecycle Stage (Status)**: Segregate data by "Under Construction," "Won," "Pending," or "Loss."

## 3. Real-Time Data Preview
Before committing to an export, the Admin can view a live preview of the filtered data:
*   **Key Metadata**: Displays Date, Lead Number, Customer/Project summary, and Village.
*   **Door Volume Calculation**: Automatically sums up the total number of doors requested in each lead to show the project's scale.
*   **Status Badges**: Visual confirmation of whether the data is active, archived, or waiting.
*   **Drill-Down Access**: An "Eye" icon allows the Admin to quickly open the full details of any lead in the preview list without leaving the report page.

## 4. Professional Export Channels
The system supports two primary export formats, each catering to different business needs:

### A. Excel Export (.xlsx)
*   **Use Case**: Deep data analysis and manual calculations.
*   **Features**: Exports raw data into a spreadsheet format, including all door specifications, contact numbers, and site details.
*   **Benefit**: Easy to import into other accounting or ERP software.

### B. PDF Export (.pdf)
*   **Use Case**: Formal documentation, sharing with stakeholders, or printing.
*   **Professional Branding**: Generates a clean, formatted document with the company's reporting structure.
*   **In-App Preview**: A full-screen PDF viewer allows the Admin to verify the report layout (`pdfPreviewUrl`) before downloading the file.

## 5. Technical Architecture
*   **Export Service**: Uses a dedicated `exportService` to handle complex data mapping.
*   **Blob Handling**: PDF previews are generated as blob URLs to ensure privacy and speed.
*   **Responsiveness**: The reporting table automatically switches to a "Card View" on mobile devices, ensuring that reports can be generated even while on the move.

## 6. Business Impact
*   **Accuracy**: Eliminates human error in totals and door counts by using automated accumulation logic.
*   **Strategic Growth**: Analytical reports help management decide where to focus marketing efforts (based on high-performing villages).
*   **Audit Readiness**: Maintains a professional, timestamped archive of every construction lead captured by the company.
*   **Transparency**: Provides the management with a "Single Source of Truth" for all sales and survey activity.
