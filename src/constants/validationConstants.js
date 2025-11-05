// Validation Regex Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/, // Indian phone numbers
  PIN_CODE: /^\d{6}$/,
  PAN_CARD: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR: /^\d{12}$/,
  ALPHA_ONLY: /^[A-Za-z\s]+$/,
  ALPHA_NUMERIC: /^[A-Za-z0-9\s]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid 10-digit phone number',
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
  PASSWORD: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
};

// Field Length Limits
export const FIELD_LIMITS = {
  NAME: { min: 2, max: 50 },
  EMAIL: { max: 100 },
  PHONE: { min: 10, max: 10 },
  ADDRESS: { max: 255 },
  DESCRIPTION: { max: 500 },
};