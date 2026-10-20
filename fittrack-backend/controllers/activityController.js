const pool = require('../db');
const {
  LIMITS,
  ACTIVITY_TYPES,
  checkNumber,
  checkOption,
  firstError,
  toNumberOrNull,
} = require('../utils/validate');

async function createActivity(req, res) {
  const { steps, calories, active_minutes, distance_km, activity_type } = req.body;

  const error = firstError(
    checkNumber('steps', steps, { ...LIMITS.steps, integer: true }),
    checkNumber('calories', calories, { ...LIMITS.calories, integer: true }),
    checkNumber('active_minutes', active_minutes, { ...LIMITS.active_minutes, integer: true }),
    checkNumber('distance_km', distance_km, LIMITS.distance_km),
    checkOption('activity_type', activity_type, ACTIVITY_TYPES)
  );
  if (error) return res.status(400).json({ message: error });

  const values = [steps, calories, active_minutes].map((v) => Number(v) || 0);
  const distance = toNumberOrNull(distance_km);
  const hasDistance = distance !== null && distance > 0;

  if (values.every((v) => v === 0) && !hasDistance) {
    return res.status(400).json({ message: 'Enter at least one value greater than 0' });
  }

  const type = activity_type || 'walking';

  try {
    const result = await pool.query(
      `INSERT INTO activities (user_id, steps, calories, active_minutes, distance_km, activity_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, ...values, hasDistance ? distance : null, type]
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