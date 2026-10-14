const LIMITS = {
  steps: { min: 0, max: 100000 },
  calories: { min: 0, max: 20000 },
  active_minutes: { min: 0, max: 1440 },
  amount_ml: { min: 1, max: 5000 }, // a single water entry
  daily_steps_target: { min: 1, max: 100000 },
  daily_water_target_ml: { min: 500, max: 10000 },
  daily_sleep_target_hours: { min: 1, max: 24 },
};

function isMissing(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  );
}

// Returns an error message string, or null if the value is fine.
function checkNumber(name, value, { min, max, integer = false, required = false } = {}) {
  if (isMissing(value)) {
    return required ? `${name} is required` : null;
  }
  if (typeof value !== 'number' && typeof value !== 'string') {
    return `${name} must be a number`;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return `${name} must be a number`;
  if (integer && !Number.isInteger(n)) return `${name} must be a whole number`;
  if (n < min || n > max) return `${name} must be between ${min} and ${max}`;
  return null;
}

function firstError(...errors) {
  return errors.find(Boolean) || null;
}

function toNumberOrNull(value) {
  return isMissing(value) ? null : Number(value);
}

module.exports = { LIMITS, checkNumber, firstError, toNumberOrNull };