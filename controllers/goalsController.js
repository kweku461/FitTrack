const pool = require('../db');

async function getGoals(req, res) {
  try {
    const result = await pool.query('SELECT * FROM goals WHERE user_id = $1', [req.userId]);

    if (result.rows.length === 0) {
      // create default goals row on first access
      const created = await pool.query(
        `INSERT INTO goals (user_id) VALUES ($1) RETURNING *`,
        [req.userId]
      );
      return res.json(created.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching goals' });
  }
}

async function updateGoals(req, res) {
  const { daily_steps_target, daily_water_target_ml, daily_sleep_target_hours } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, daily_steps_target, daily_water_target_ml, daily_sleep_target_hours)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         daily_steps_target = COALESCE($2, goals.daily_steps_target),
         daily_water_target_ml = COALESCE($3, goals.daily_water_target_ml),
         daily_sleep_target_hours = COALESCE($4, goals.daily_sleep_target_hours),
         updated_at = NOW()
       RETURNING *`,
      [req.userId, daily_steps_target, daily_water_target_ml, daily_sleep_target_hours]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating goals' });
  }
}

module.exports = { getGoals, updateGoals };