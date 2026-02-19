# Field Surveyor - Step 05: Payment & Priority (Customer Intent)

## 1. Introduction
The **Payment & Priority** step focuses on the commercial aspect of the lead. It helps the sales team prioritize follow-ups based on the customer's budget, expected timeline, and urgency.

## 2. Priority Levels
The surveyor gauges how soon the client needs the doors:
*   **High Priority (Urgent)**: The building is nearing completion (painting/flooring stage). Needs immediate attention.
*   **Medium Priority**: Structure is ready, but woodwork can wait for 1-2 months.
*   **Low Priority**: Early construction stage. The lead is for long-term planning.

## 3. Estimated Completion Timeline
The engineer records a specific **Expected Date** or "Requirement Timeframe".
*   **Business Use**: This date triggers automatic notifications in the Admin Dashboard when the project is nearing its "Warm" period.

## 4. Payment Intent & Budget
While not a formal contract, capturing initial budget expectations is crucial:
*   **Customer Budget Range**: Helps the sales team suggest the right materials (e.g., Premium Wood vs. Budget WPC).
*   **Initial Payment Discussion**: Notes on whether the client is ready with an advance or waiting for a home loan approval.

## 5. Technical Data Structure
*   **Stored in**: `payment_details` table.
*   **Fields**: `priority_level`, `expected_completion_date`, `budget_notes`.

## 6. Strategic Importance
*   **Sales Conversion**: High-priority leads are handled by Senior Admins to ensure a quick conversion.
*   **Production Planning**: Helps the factory forecast how many doors are needed in the current month versus next month.
*   **Relationship Management**: The anticipated completion date allows the company to reach out exactly when the customer is ready to buy.
