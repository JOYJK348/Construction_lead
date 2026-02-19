# Admin Dashboard - Closed Won (Master Archive)

## 1. Introduction
The **Closed Won** module, also known as the **Master Archive**, is the final sanctuary for all successfully converted leads. Once a construction project is verified, completed, and finalized by the Admin, it is transitioned to this high-authority status.

## 2. The Definition of "Master" Status
A lead enters the Master Archive only when:
*   The field survey is complete.
*   The Admin has reviewed and approved the technical specifications.
*   The project has reached its final successful conclusion (Order Finalized).
*   **Result**: The lead is moved from the active `Roaming` list to the `Master` table.

## 3. Archive Exploration & Filtering
Since the Master Archive houses the history of the company's success, the interface is optimized for high-speed retrieval:
*   **Village-Based Discovery**: A horizontal scrolling selector allows the Admin to quickly filter successful projects by village (e.g., "See all Master leads in Village X").
*   **Advanced Sorting**: 
    *   **Latest First**: Shows recently won projects.
    *   **Oldest First**: For historical data review.
    *   **Alphabetical (A-Z / Z-A)**: Sorted by Customer Name.
*   **Success Metrics**: A real-time counter displays exactly how many "Records of Success" are currently stored in the archive.

## 4. Master Record Card Interface
Every archived lead is presented as a premium "Master Card" with specific visual cues:
*   **Green Theme**: Uses a distinct emerald border (`border-emerald-200`) and background to signify a positive outcome.
*   **Won Badge**: A persistent "Won" label with a `CheckCircle` icon.
*   **Metadata Density**:
    *   **Lead ID**: The permanent unique identifier.
    *   **Project & Customer**: High-visibility titles.
    *   **Staff Credit**: Displays the name of the Field Survey Person who captured the lead.
    *   **Completion Date**: A precise date showing when the lead was moved to the Master state.

## 5. Data Permanence & Access
*   **View-Only Integrity**: Leads in the Master Archive are generally preserved in their final state. The Admin can click "View Details" to see the full technical specifications (door counts, dimensions, site photos) for future reference or repeat orders.
*   **Operational Cleanliness**: Moving leads here ensures the main "Leads Management" screen only contains active, actionable items, reducing cognitive load for the manager.

## 6. Business Value & Analytics
*   **Conversion Insights**: Helps calculate the "Win Rate" of the field force.
*   **Portfolio Showcase**: Acts as a digital portfolio of completed work.
*   **Long-Term Relationships**: Makes it easy to find old customer data if they return for a new project years later.

## 7. Technical Implementation
*   **State Filtering**: Uses the logic `leads.filter(l => l.status === 'Master')`.
*   **Responsive Grid**: Implements a responsive layout that scales from a single column on mobile to a 3-column grid on desktop monitors.
*   **Animations**: Uses `framer-motion` for smooth entry animations when a lead is first viewed in the archive.
