// test/password.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword } from '../utils/password.js';

test('accepts a valid password', () => {
  assert.equal(validatePassword('fittrack123'), null);
});

test('rejects missing or non-string values', () => {
  assert.ok(validatePassword(undefined));
  assert.ok(validatePassword(''));
  assert.ok(validatePassword(12345678));
});

test('rejects short passwords', () => {
  assert.match(validatePassword('abc123'), /at least 8/);
});

test('rejects passwords over 72 bytes', () => {
  assert.match(validatePassword('a1'.repeat(40)), /too long/);
});

test('requires a letter and a number', () => {
  assert.match(validatePassword('12345678'), /letter/);
  assert.match(validatePassword('abcdefgh'), /number/);
});