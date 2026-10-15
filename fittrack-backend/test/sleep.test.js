const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseSleep } = require('../utils/sleep');

describe('parseSleep', () => {
  it('calculates hours for normal overnight sleep', () => {
    assert.deepEqual(
      parseSleep('2026-09-14T23:00:00', '2026-09-15T07:00:00'),
      { hours: 8 }
    );
  });

  it('handles fractional hours', () => {
    assert.deepEqual(
      parseSleep('2026-09-14T23:30:00', '2026-09-15T06:45:00'),
      { hours: 7.25 }
    );
  });

  it('accepts exactly 24 hours', () => {
    assert.deepEqual(
      parseSleep('2026-09-14T07:00:00', '2026-09-15T07:00:00'),
      { hours: 24 }
    );
  });

  it('rejects a wake time before bedtime (the old same-date bug)', () => {
    const result = parseSleep('2026-09-14T23:00:00', '2026-09-14T07:00:00');
    assert.match(result.error, /after bedtime/);
    assert.equal(result.hours, undefined);
  });

  it('rejects identical bedtime and wake time', () => {
    const result = parseSleep('2026-09-14T23:00:00', '2026-09-14T23:00:00');
    assert.match(result.error, /after bedtime/);
  });

  it('rejects durations over 24 hours', () => {
    const result = parseSleep('2026-09-14T23:00:00', '2026-09-16T07:00:00');
    assert.match(result.error, /24 hours/);
  });

  it('rejects invalid or non-string input', () => {
    assert.match(parseSleep('not a date', '2026-09-15T07:00:00').error, /valid date-times/);
    assert.match(parseSleep(12345, '2026-09-15T07:00:00').error, /strings/);
    assert.match(parseSleep(undefined, undefined).error, /strings/);
  });
});