const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { LIMITS, checkNumber, firstError, toNumberOrNull } = require('../utils/validate');

describe('checkNumber', () => {
  const stepsOpts = { ...LIMITS.steps, integer: true };

  it('accepts valid whole numbers, including numeric strings', () => {
    assert.equal(checkNumber('steps', 5000, stepsOpts), null);
    assert.equal(checkNumber('steps', '5000', stepsOpts), null);
    assert.equal(checkNumber('steps', 0, stepsOpts), null);
  });

  it('rejects negative numbers', () => {
    assert.match(checkNumber('steps', -500, stepsOpts), /between/);
  });

  it('rejects values above the maximum', () => {
    assert.match(checkNumber('steps', 100001, stepsOpts), /between/);
  });

  it('rejects decimals when a whole number is required', () => {
    assert.match(checkNumber('steps', 1.5, stepsOpts), /whole number/);
  });

  it('rejects non-numeric input', () => {
    assert.match(checkNumber('steps', 'abc', stepsOpts), /must be a number/);
    assert.match(checkNumber('steps', true, stepsOpts), /must be a number/);
    assert.match(checkNumber('steps', [], stepsOpts), /must be a number/);
    assert.match(checkNumber('steps', NaN, stepsOpts), /must be a number/);
    assert.match(checkNumber('steps', Infinity, stepsOpts), /must be a number/);
  });

  it('treats missing values as fine when optional and an error when required', () => {
    assert.equal(checkNumber('steps', undefined, stepsOpts), null);
    assert.equal(checkNumber('steps', '', stepsOpts), null);
    assert.equal(checkNumber('steps', '   ', stepsOpts), null);

    const required = { ...LIMITS.amount_ml, integer: true, required: true };
    assert.match(checkNumber('amount_ml', undefined, required), /required/);
  });

  it('enforces the 1 ml minimum for water entries', () => {
    const waterOpts = { ...LIMITS.amount_ml, integer: true, required: true };
    assert.match(checkNumber('amount_ml', 0, waterOpts), /between/);
    assert.match(checkNumber('amount_ml', -250, waterOpts), /between/);
    assert.equal(checkNumber('amount_ml', 250, waterOpts), null);
  });

  it('allows decimals when integer is not required', () => {
    const sleepGoal = LIMITS.daily_sleep_target_hours;
    assert.equal(checkNumber('daily_sleep_target_hours', 7.5, sleepGoal), null);
    assert.match(checkNumber('daily_sleep_target_hours', 30, sleepGoal), /between/);
  });
});

describe('firstError', () => {
  it('returns the first error and ignores nulls', () => {
    assert.equal(firstError(null, 'a', 'b'), 'a');
    assert.equal(firstError(null, null), null);
  });
});

describe('toNumberOrNull', () => {
  it('converts present values and returns null for missing ones', () => {
    assert.equal(toNumberOrNull('8000'), 8000);
    assert.equal(toNumberOrNull(undefined), null);
    assert.equal(toNumberOrNull(''), null);
  });
});