# Admin Dashboard - Lead Verification Checklist

## 1. Introduction
The **Lead Verification** process is the quality control gate of the Durkkas Lead Management System. Before an Admin clicks the "Approve" button, they must perform a 4-point verification check to ensure data accuracy and site feasibility.

## 2. The 4-Point Verification Checklist

### A. Customer & Identity Verification
*   **Name & Contact**: Ensure the customer name is professionally entered (No nicknames or placeholders like "XYZ").
*   **Phone Validation**: Verify the mobile number is reachable.
*   **Duplicate Check**: The system automatically checks for duplicate lead numbers; however, the Admin should manually verify if a customer with the same site address already exists in the archive.

### B. Project & Site Specifications
*   **Door Count Accuracy**: Cross-check the "Total Doors" captured with the individual door specifications.
*   **Dimensions Logic**: Review the height/width measurements. (e.g., If a door height is entered as "2 feet" instead of "7 feet", it must be flagged for correction).
*   **Site Context**: Ensure the village name and project name align with the territory assigned to that specific surveyor.

### C. Visual Evidence (Photo Quality)
This is the most critical part of the verification process. The Admin must verify:
*   **Clarity**: Photos must be clear and not blurred.
*   **Evidence of Measurement**: Photos should ideally show the surveyor taking measurements at the site.
*   **Site Identification**: One photo should capture the overall site/building context to prevent fraudulent submissions.
*   **Decision**: If photos are missing or low-quality, the lead **must be rejected** with the reason: *"Low-quality photos, please re-visit and re-upload."*

### D. Location & Map Integrity
*   **Geotag Alignment**: Access the map location provided by the surveyor.
*   **Address Match**: Check if the physical address entered manually matches the GPS location pinned on the map.
*   **Territory Integrity**: Ensure the site visit didn't happen outside the authorized operations area.

## 3. Decision Matrix
| Outcome | Action | System Result |
| :--- | :--- | :--- |
| **Pass** | Click "Approve" | Lead moves to active pipeline and notified to user. |
| **Fail (Minor)** | Click "Reject" | Reason is sent back for correction (e.g., "Change address"). |
| **Fail (Critical)** | Click "Close as Loss" | If the site is determined to be fake or non-viable. |

## 4. Technical Quality Guardrails
*   **Optimistic UI**: Whenever a verification result is logged, the dashboard updates immediately.
*   **Audit Logger**: The system records which Admin performed the verification and at what time.

## 5. Business Impact
*   **Waste Reduction**: Prevents production teams from manufacturing doors based on incorrect measurements.
*   **Operational Training**: Rejection reasons help in training field surveyors to be more accurate in future visits.
*   **Fraud Prevention**: Strict photo and GPS verification ensures engineers are physically visiting sites.
