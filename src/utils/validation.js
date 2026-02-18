/**
 * Logic Separation: Validation & Sanitization Rules
 * Implements strict input validation as per user requirements.
 */

// 1. Mobile Number: Allow ONLY numbers (0–9), Max 10 digits
export const sanitizeMobile = (value) => {
    return value.replace(/\D/g, '').slice(0, 10);
};

export const validateMobile = (value) => {
    if (!value) return 'Mobile Number is required';
    if (value.length !== 10) return 'Mobile number must contain exactly 10 digits';
    return null;
};

// 2. Numeric Fields: Allow numbers only, no negatives, no specials
export const sanitizeNumber = (value) => {
    // Remove non-digits
    const sanitized = value.replace(/\D/g, '');
    // Prevent negative logic inherently by stripping '-'
    return sanitized;
};

// 3. Name Fields: Allow Alphabets + Space, trim extra spaces logic (on blur usually, but here we sanitizing input chars)
export const sanitizeName = (value) => {
    // Allow only letters and spaces
    return value.replace(/[^a-zA-Z\s]/g, '');
};

// 4. Address / Remarks: Allow text + numbers + basic chars (, . -), Block emojis
export const sanitizeAddress = (value) => {
    // Replace emojis and symbols that are not basic punctuation
    // Allow alphanumeric, space, dot, comma, hyphen, slash, newline
    return value.replace(/[^a-zA-Z0-9\s.,\-\/\n]/g, '');
};

// 5. Email: Block spaces
export const sanitizeEmail = (value) => {
    return value.replace(/\s/g, '');
};

export const validateEmail = (value) => {
    if (!value) return null; // Optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
};

// Helper for Door Size (Allowing 'x', 'ft', 'in', numbers, space) since strict "numbers only" breaks "3ft x 7ft"
// If specific "Numbers only" is strictly enforced for dimensions, we'd need split fields.
// Assuming "Numeric Fields" in doc referred to Counts/Floors mainly, but listed "Width/Height".
// We will interpret "Size" as allowed to have 'x' and units for now to keep UI single field.
export const sanitizeDoorSize = (value) => {
    return value.replace(/[^0-9xXa-zA-Z\s.]/g, '');
};
