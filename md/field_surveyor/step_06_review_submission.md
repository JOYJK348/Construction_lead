# Field Surveyor - Step 06: Review & Final Submission

## 1. Introduction
The **Review & Submission** screen is the final step of the site survey. It provides a comprehensive summary of all the data collected across the five previous stages. This ensures that the surveyor can correct any errors before the data is committed to the central database.

## 2. The Comprehensive Summary (Single View)
The interface groups all data into logical "Accordion" or "Card" sections:
*   **Customer Header**: Name, Mobile, and Email verification.
*   **Project Meta**: Site location and primary purpose.
*   **Stakeholder List**: Names and roles of contractors/carpenters.
*   **Door Inventory**: A grid showing all specific door measurements and the number of photos captured.
*   **Priority Summary**: Urgency level and expected timeline.

## 3. Data Integrity Validation
Before the "Submit" button is enabled, the system performs a final background check:
*   **Mandatory Field Check**: Ensures no critical field (like Customer Mobile or Height/Width) was accidentally left blank.
*   **Photo Check**: Confirms that at least one verification photo has been attached to the lead.

## 4. The Submission Protocol
When the "Finalize & Submit Lead" button is clicked:
1.  **Loading State**: A `Loader2` animation appears to show data is being pushed to Supabase.
2.  **Multistep Push**: The app sends data to multiple tables (`leads`, `customer_details`, `site_visits`, `door_specifications`) in a single transaction sequence.
3.  **Real-time Trigger**: Once the push is successful, an automatic notification is sent to the **Admin Dashboard** announcing a "New Lead Submitted".

## 5. Post-Submission Feedback
Upon success, the surveyor is directed to a **Success Screen**:
*   **Celebration UI**: Vibrant emerald green theme with a success checkmark.
*   **Dual Options**:
    *   "Collect Another Lead" (Resets the form for the next site).
    *   "Back to Dashboard" (Returns to the activity overview).

## 6. Business Impact
*   **Self-Auditing**: Reduces the amount of "Rejected" leads by allowing surveyors to fix their own mistakes at the site.
*   **Professional Output**: Ensures that the data reaching the Admin is clean, structured, and ready for manufacture.
