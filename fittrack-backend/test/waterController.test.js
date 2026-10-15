const { describe, it, mock, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const pool = require('../db');
const { createWaterLog } = require('../controllers/waterController');

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('createWaterLog', () => {
  afterEach(() => mock.restoreAll());

  for (const bad of [-250, 0, 'abc', undefined, 5001, 1.5]) {
    it(`rejects amount_ml = ${String(bad)} without touching the database`, async () => {
      const query = mock.method(pool, 'query', async () => ({ rows: [] }));
      const res = fakeRes();

      await createWaterLog({ userId: 1, body: { amount_ml: bad } }, res);

      assert.equal(res.statusCode, 400);
      assert.equal(query.mock.callCount(), 0);
    });
  }

  it('saves a valid amount as a number', async () => {
    const query = mock.method(pool, 'query', async () => ({
      rows: [{ id: 1, amount_ml: 250 }],
    }));
    const res = fakeRes();

    await createWaterLog({ userId: 1, body: { amount_ml: '250' } }, res);

    assert.equal(res.statusCode, 201);
    assert.equal(query.mock.callCount(), 1);
    assert.deepEqual(query.mock.calls[0].arguments[1], [1, 250]);
  });
});