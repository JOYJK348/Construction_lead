Construction Site Lead Collection
Registration Form – System Requirement Document (Phase 1)
1. Document Purpose

This document explains the Phase-1 scope of the Construction Site Lead Collection & Building Requirement System.

👉 Phase-1 focus:
Only Registration Form Module (Lead Creation)
No quotation, no costing, no approval workflow in this phase.

This document is intended for:

Tech Team Lead

Frontend & Backend Developers

Product / Operations Team

2. Business Objective (Phase-1)

The goal of this phase is to build a structured, step-by-step registration form that allows field users to capture complete construction site details in a single visit, avoiding missing data and re-visits.

3. User Roles (Phase-1)
3.1 Field User

Visits construction site

Fills registration form

Uploads photos

Submits lead

3.2 Manager (View Only – Later Phase)

Will verify data in next phase

Not part of current development scope

4. Scope of Phase-1 (IMPORTANT)
✅ Included

Multi-step Registration Form (Wizard)

Data validation

Image upload

Lead submission

Data storage (DB)

❌ Not Included

Login / Role Management (optional basic login only)

Lead approval

Quotation

Pricing

Reports / Dashboard

5. Application Flow (High Level)

Field user opens registration form

Enters customer details

Enters project & building information

Adds stakeholder details

Selects door requirements + uploads photos

Adds payment & priority details

Reviews and submits lead

System generates Lead ID and stores data

6. Registration Form – Detailed Breakdown
STEP 1: Customer Contact Details

Fields

Customer / Owner Name (Required)

Mobile Number (Required)

Alternate Contact Number (Optional)

Email Address (Optional)

Address / Site Location (Required)

Landmark (Optional)

GPS Location (Auto capture – Button)

Remarks (Textarea)

Validation

Mobile number → 10 digits

Name & Address → mandatory

STEP 2: Project / Building Information

Fields

Project Name (Optional)

Building Type (Single Select)

Independent House / Villa

Apartment / Residential Complex

Commercial

Office Space

Other

Construction Stage (Single Select)

Foundation

Walls

Roofing / Slab

Plastering

Ready for Door Work

Total Floors / Units (Numeric)

Estimated Door Requirement Timeline (Month/Year or Months)

Estimated Total Door Count (Numeric)

STEP 3: Stakeholder Details

Fields

Architect / Engineer Name

Architect / Engineer Contact Number

Contractor Name

Contractor Contact Number

(All optional, but recommended)

STEP 4: Door Specifications (Reusable Component)

Each door type follows the same structure:

Common Fields

Door Type (Multi-select)

Upload Photo(s)

Size (Width x Height)

Notes (Optional)

Door Categories

Main Door

Interior Door

Bathroom Door

Pooja Door

Balcony Door

Kitchen Utility Door

Glass Door

Fire Exit Door

Special / Sliding / Folding Door (Custom text + photo)

📌 Rule:
If door type is selected → at least one photo is mandatory

STEP 5: Payment & Priority

Fields

Payment Method

Cash

Bank Transfer

Advance

Lead Source

Project Priority

High / Medium / Low

Expected Completion Date

STEP 6: Review & Submit

Show summary of all entered data (read-only)

Submit button

Success confirmation message

Auto-generated Lead ID

7. Lead ID Logic

On successful submission:

CL-YYYY-RunningNumber
Example: CL-2025-00045

8. Technical Expectations (High Level)
Frontend

Mobile-first UI

Multi-step form (Wizard)

Field-level validation

Image compression before upload

Reusable Door Component

Backend

API to save draft & final submit

Structured tables:

Customer

Project

Stakeholders

Door Requirements

Images

Image storage (cloud storage bucket)

9. Data Integrity Rules

Mandatory fields must be enforced

Partial save allowed (optional)

No duplicate lead for same mobile + address (future improvement)

10. Success Criteria for Phase-1

Field user can submit lead without missing key details

All door requirements are captured with photos

Manager can later view complete information

No re-visit needed for missing measurements/photos