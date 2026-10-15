const pool = require('../db');
const { LIMITS, checkNumber } = require('../utils/validate');

async function createWaterLog(req, res) {
  const { amount_ml } = req.body;

  const error = checkNumber('amount_ml', amount_ml, {
    ...LIMITS.amount_ml,
    integer: true,
    required: true,
  });
  if (error) return res.status(400).json({ message: error });

  try {
    const result = await pool.query(
      `INSERT INTO water_logs (user_id, amount_ml) VALUES ($1, $2) RETURNING *`,
      [req.userId, Number(amount_ml)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating water log' });
  }
}

async function getWaterLogs(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM water_logs WHERE user_id = $1 ORDER BY logged_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching water logs' });
  }
}

async function deleteWaterLog(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM water_logs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Water log not found' });
    }

    res.json({ message: 'Water log deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting water log' });
  }
}

module.exports = { createWaterLog, getWaterLogs, deleteWaterLog };