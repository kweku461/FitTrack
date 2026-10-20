const pool = require('../db');
const {
  LIMITS,
  checkNumber,
  checkDate,
  parseId,
  firstError,
  toNumberOrNull,
} = require('../utils/validate');

async function createWaterLog(req, res) {
  const { amount_ml, logged_at } = req.body;

  const error = firstError(
    checkNumber('amount_ml', amount_ml, {
      ...LIMITS.amount_ml,
      integer: true,
      required: true,
    }),
    checkDate('logged_at', logged_at)
  );
  if (error) return res.status(400).json({ message: error });

  try {
    const result = await pool.query(
      `INSERT INTO water_logs (user_id, amount_ml, logged_at)
       VALUES ($1, $2, COALESCE($3::date + LOCALTIME, LOCALTIMESTAMP))
       RETURNING *`,
      [req.userId, Number(amount_ml), logged_at || null]
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

async function updateWaterLog(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid water log id' });

  const { amount_ml, logged_at } = req.body;

  const error = firstError(
    checkNumber('amount_ml', amount_ml, { ...LIMITS.amount_ml, integer: true }),
    checkDate('logged_at', logged_at)
  );
  if (error) return res.status(400).json({ message: error });

  try {
    // A new date keeps the entry's original time of day.
    const result = await pool.query(
      `UPDATE water_logs
       SET amount_ml = COALESCE($1, amount_ml),
           logged_at = CASE
             WHEN $2::date IS NULL THEN logged_at
             ELSE ($2::date + logged_at::time)
           END
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [toNumberOrNull(amount_ml), logged_at || null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Water log not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating water log' });
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

module.exports = { createWaterLog, getWaterLogs, updateWaterLog, deleteWaterLog };