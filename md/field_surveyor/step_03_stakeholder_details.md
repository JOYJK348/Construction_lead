# Field Surveyor - Step 03: Stakeholder Details (Influencer Tracking)

## 1. Introduction
The **Stakeholder Details** step is designed to identify and record the key decision-makers and influencers involved in the construction project. In the construction industry, carpenters and contractors often have the final say in material selection, making their information vital for business growth.

## 2. Key Stakeholder Roles
The surveyor can record details for multiple types of influencers:
*   **Carpenter (Main Focus)**: The primary person responsible for installing doors.
*   **Contractor**: The person managing the overall construction site.
*   **Architect / Engineer**: The professional who designed the building.
*   **Neighbor / Reference**: Anyone who referred the project to Durkkas.

## 3. Data Capture Fields
For each stakeholder, the following information is collected:
*   **Stakeholder Name**: Used for personalized follow-ups.
*   **Stakeholder Phone Number**: Essential for the sales team to build a relationship with the influencer.
*   **Role Identification**: Selecting the correct role helps in targeted marketing campaigns (e.g., sending festive wishes or incentives to carpenters).

## 4. Business Rationale (Why this is deep)
*   **Referral Network**: By capturing the carpenter's number, the company can build a database of skilled workers across different villages.
*   **Conflict Resolution**: If there is a mismatch in door measurements later, the surveyor can directly consult the onsite carpenter.
*   **Incentive Programs**: This data is used to track which carpenter brings in the most business, allowing the company to reward loyalty.

## 5. UI & UX Features
*   **Responsive Input**: Optimized keyboard configuration for quick phone number entry on mobile devices.
*   **Real-time Storage**: Data is saved to the local form state, ensuring it isn't lost if the app is minimized.
*   **Skip Option**: If no stakeholder is available, the surveyor can proceed, but the interface highlights the importance of filling this data.

## 6. Technical Integrity
*   **State Management**: Updates the `stakeholder_details` object in the global form data.
*   **Validation**: Simple validation ensures that if a name is entered, a valid 10-digit phone number is also provided.
