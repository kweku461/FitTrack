// Mirrors the backend rules. The backend stays the source of truth;
// this just gives instant feedback before the request is sent.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX_BYTES = 72;

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters`;
  }
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) {
    return `Password is too long (max ${PASSWORD_MAX_BYTES} bytes)`;
  }
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return null;
}