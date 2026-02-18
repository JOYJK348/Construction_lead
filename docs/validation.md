Context

We are building a mobile-first, responsive registration form for a Construction Site Lead Collection system.

This form will be used by field users on mobile devices, so strict input validation is mandatory to avoid wrong data entry.

🔒 Validation Expectations (Very Important)
1. Input Type Restrictions (Key Requirement)

Each input field must allow only valid characters at typing level, not just on submit.

🔹 Mobile Number / Phone Fields

Allow ONLY numbers (0–9)

Do NOT allow:

Alphabets

Spaces

Special characters (+, -, ., @, etc.)

Length must be exactly 10 digits

User should not be able to type more than 10 digits

Copy-paste with invalid characters must be blocked

👉 If invalid:

“Mobile number must contain exactly 10 digits”

🔹 Numeric Fields (Counts, Size, Floors, Units)

Examples:

Total Floors

Estimated Door Count

Door Width / Height

Rules:

Allow numbers only

No decimals (unless explicitly needed)

No negative values

No special characters

Min value = 1

🔹 Email Field

Optional field

If user types:

Must follow valid email format

Block spaces and invalid characters

🔹 Name Fields (Customer, Architect, Contractor)

Allow:

Alphabets

Space

Do NOT allow:

Numbers

Special characters

Trim extra spaces automatically

🔹 Address / Remarks

Allow text + numbers

Allow basic characters (, . -)

Block emojis and unsupported symbols