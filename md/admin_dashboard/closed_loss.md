# Admin Dashboard - Closed Loss (Permanent Archive)

## 1. Introduction
The **Closed Loss** module is a strategic database of projects that did not lead to a successful outcome. Rather than simply deleting lost projects, the system archives them to provide data-driven insights into why business opportunities are being missed.

## 2. The Core Logic: "Why We Lost"
A lead is transitioned to the Closed Loss archive only when an Administrator manually marks it as `Closed Permanently`. 
*   **The Mandate**: The Admin must provide a **Loss Reason** (e.g., Client cancelled, Price mismatch, Competitor selection).
*   **The Purpose**: To ensure that every failed lead serves as a learning opportunity for the organization.

## 3. UI/UX: The Loss Card Philosophy
To differentiate from successful projects, the Closed Loss archive uses a distinct visual language:
*   **Alert Aesthetic**: Uses red highlights (`bg-red-50`), red borders, and `XCircle` icons to signify a non-converted state.
*   **Reason Highlight**: A specialized box (Reason for Loss) is prominently displayed on the card, showing the Admin's comments in an italicized format for immediate clarity.
*   **Historical Accuracy**: Displays the exact date the lead was moved to the loss state (`Closed On`).

## 4. Exploration & Analysis Tools
*   **Location Filtering**: Identify if a specific village or area has a higher rate of lost projects.
*   **Performance Tracking**: See which Field Survey Persons are associated with high-attrition leads.
*   **Chronological Sorting**: Evaluate if losses occur more frequently during specific seasons or time periods.

## 5. Technical Specification
*   **State Management**: Filters data using `leads.filter(l => l.status === 'Closed Permanently')`.
*   **Data Integrity**: Even though the project is "Lost," all captured site data, photos, and door specifications are preserved in the database for up to 5 years (audit-ready).
*   **Dynamic Layout**: Uses a multi-column responsive grid powered by `framer-motion` for a premium feel, even in the archive.

## 6. Business Value
*   **Competitive Intelligence**: Aggregating loss reasons helps identify if competitors are beating the company on price or service speed.
*   **Operational Transparency**: Prevents surveyors from being penalized for lost leads if the cancellation reason was beyond their control (e.g., project shelved by client).
*   **Future Recovery**: If a client reappears after 6 months for the same site, the Admin can quickly retrieve the old "Lost" lead to resume the conversation with full context.

## 7. Workflow
1.  **Lead Identification**: Admin identifies a non-viable lead in the management view.
2.  **Archival Action**: Admin clicks "Close as Loss" and enters the mandatory reason.
3.  **Final Move**: The lead disappears from the active dashboard and is permanently stored in the **Closed Loss Archive**.
