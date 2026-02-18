# Business Requirement Document (BRD)
## Project Name: Construction Lead Management System (LeadPro)
**Version:** 1.0  
**Date:** 2026-02-18

---

## 1. Executive Summary
The **Construction Lead Management System (LeadPro)** is a web-based application designed to digitalize and streamline the lead tracking process for a construction business. Currently, lead management relies on manual methods or disparate systems, leading to data loss and inefficient follow-ups. This new system will enable Field Engineers to capture lead data accurately on-site and allow Admins to monitor, approve, and manage these leads centrally.

## 2. Business Objectives
*   **Digital Transformation:** Replace pen-and-paper or spreadsheet-based tracking with a robust digital database.
*   **Data Accuracy:** Ensure all necessary details (Customer, Project, Site, Doors) are captured in a structured format.
*   **Process Efficiency:** Streamline the workflow from Lead Collection -> Verification -> Approval.
*   **Accountability:** Track which engineer visited which site and when (via Geo-tagging).
*   **Conversion Growth:** Improve follow-up timelines to increase lead conversion rates.

## 3. Scope of Project

### 3.1 In-Scope
*   **User Roles:** Two distinct roles - **Admin** and **Field Engineer**.
*   **Lead Collection:** A multi-step form to capture comprehensive lead details (Customer, Project, Stakeholders, Doors, Payment).
*   **Approval Workflow:** Admin capability to Review, Approve, or Reject leads submitted by engineers.
*   **Dashboards:** Dedicated dashboards for Admins (Overview & Actions) and Engineers (My Leads & Entry).
*   **Security:** Secure login and session management with idle timeout.

### 3.2 Out-of-Scope
*   **Payment Gateway Integration:** The system will record payment terms but will not process actual payments.
*   **Inventory Management:** Detailed stock keeping is not part of this phase.
*   **Customer Portal:** Customers will not have a login interface in this version; only internal staff.

## 4. Stakeholders
| Stakeholder | Role / Responsibility |
| :--- | :--- |
| **Business Owner / Admin** | Complete oversight, Lead Approval, Strategic decision making based on reports. |
| **Field Engineer** | Data Entry, Site Visits, Initial Lead Qualification. |
| **Technical Team** | System maintenance, Deployment, and Updates. |
