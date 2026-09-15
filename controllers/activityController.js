const pool = require('../db');

async function createActivity(req, res) {
  const { steps, calories, active_minutes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO activities (user_id, steps, calories, active_minutes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.userId, steps || 0, calories || 0, active_minutes || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating activity' });
  }
}

async function getActivities(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY logged_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
}

async function deleteActivity(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM activities WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
}

module.exports = { createActivity, getActivities, deleteActivity };