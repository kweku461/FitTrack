const pool = require('../db');
const {
  LIMITS,
  ACTIVITY_TYPES,
  checkNumber,
  checkOption,
  checkDate,
  parseId,
  firstError,
  toNumberOrNull,
} = require('../utils/validate');

function validateActivityBody(body) {
  const { steps, calories, active_minutes, distance_km, activity_type, logged_at } = body;
  return firstError(
    checkNumber('steps', steps, { ...LIMITS.steps, integer: true }),
    checkNumber('calories', calories, { ...LIMITS.calories, integer: true }),
    checkNumber('active_minutes', active_minutes, { ...LIMITS.active_minutes, integer: true }),
    checkNumber('distance_km', distance_km, LIMITS.distance_km),
    checkOption('activity_type', activity_type, ACTIVITY_TYPES),
    checkDate('logged_at', logged_at)
  );
}

async function createActivity(req, res) {
  const { steps, calories, active_minutes, distance_km, activity_type, logged_at } = req.body;

  const error = validateActivityBody(req.body);
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
      `INSERT INTO activities
         (user_id, steps, calories, active_minutes, distance_km, activity_type, logged_at)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::date + LOCALTIME, LOCALTIMESTAMP))
       RETURNING *`,
      [req.userId, ...values, hasDistance ? distance : null, type, logged_at || null]
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

async function updateActivity(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid activity id' });

  const { steps, calories, active_minutes, distance_km, activity_type, logged_at } = req.body;

  const error = validateActivityBody(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const existing = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    const current = existing.rows[0];

    // Fields that aren't sent keep their current value.
    const next = {
      steps: steps === undefined ? current.steps : Number(steps) || 0,
      calories: calories === undefined ? current.calories : Number(calories) || 0,
      active_minutes:
        active_minutes === undefined ? current.active_minutes : Number(active_minutes) || 0,
      distance_km:
        distance_km === undefined
          ? current.distance_km
          : Number(distance_km) > 0
            ? Number(distance_km)
            : null,
      activity_type: activity_type || current.activity_type,
    };

    const hasValue =
      next.steps > 0 ||
      next.calories > 0 ||
      next.active_minutes > 0 ||
      Number(next.distance_km) > 0;
    if (!hasValue) {
      return res.status(400).json({ message: 'Enter at least one value greater than 0' });
    }

    // A new date keeps the entry's original time of day.
    const result = await pool.query(
      `UPDATE activities
       SET steps = $1,
           calories = $2,
           active_minutes = $3,
           distance_km = $4,
           activity_type = $5,
           logged_at = CASE
             WHEN $6::date IS NULL THEN logged_at
             ELSE ($6::date + logged_at::time)
           END
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        next.steps,
        next.calories,
        next.active_minutes,
        next.distance_km,
        next.activity_type,
        logged_at || null,
        id,
        req.userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating activity' });
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

module.exports = { createActivity, getActivities, updateActivity, deleteActivity };