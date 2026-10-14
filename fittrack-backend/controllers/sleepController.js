const pool = require('../db');
const { parseSleep } = require('../utils/sleep');

async function createSleepLog(req, res) {
  const { bedtime, wake_time } = req.body;

  if (!bedtime || !wake_time) {
    return res.status(400).json({ message: 'bedtime and wake_time are required' });
  }

  const { hours, error } = parseSleep(bedtime, wake_time);
  if (error) return res.status(400).json({ message: error });

  try {
    const result = await pool.query(
      `INSERT INTO sleep_logs (user_id, bedtime, wake_time, hours_slept)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.userId, bedtime, wake_time, hours]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating sleep log' });
  }
}

async function getSleepLogs(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM sleep_logs WHERE user_id = $1 ORDER BY logged_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching sleep logs' });
  }
}

async function deleteSleepLog(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM sleep_logs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sleep log not found' });
    }

    res.json({ message: 'Sleep log deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting sleep log' });
  }
}

module.exports = { createSleepLog, getSleepLogs, deleteSleepLog };