const pool = require('../db');

async function getWeeklySummary(req, res) {
  const userId = req.userId;

  try {
    const [days, activities, water, sleep, goals] = await Promise.all([
      pool.query(
        `SELECT to_char(d::date, 'YYYY-MM-DD') AS day
         FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') AS d`
      ),
      pool.query(
        `SELECT to_char(logged_at::date, 'YYYY-MM-DD') AS day,
                SUM(steps) AS steps,
                SUM(calories) AS calories,
                SUM(active_minutes) AS active_minutes
         FROM activities
         WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY logged_at::date`,
        [userId]
      ),
      pool.query(
        `SELECT to_char(logged_at::date, 'YYYY-MM-DD') AS day,
                SUM(amount_ml) AS amount_ml
         FROM water_logs
         WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY logged_at::date`,
        [userId]
      ),
      pool.query(
        `SELECT to_char(wake_time::date, 'YYYY-MM-DD') AS day,
                SUM(hours_slept) AS hours_slept
         FROM sleep_logs
         WHERE user_id = $1
           AND wake_time >= CURRENT_DATE - INTERVAL '6 days'
           AND wake_time < CURRENT_DATE + INTERVAL '1 day'
         GROUP BY wake_time::date`,
        [userId]
      ),
      pool.query('SELECT * FROM goals WHERE user_id = $1', [userId]),
    ]);

    const activityMap = Object.fromEntries(activities.rows.map((r) => [r.day, r]));
    const waterMap = Object.fromEntries(water.rows.map((r) => [r.day, r]));
    const sleepMap = Object.fromEntries(sleep.rows.map((r) => [r.day, r]));

    const week = days.rows.map(({ day }) => {
      const a = activityMap[day];
      const w = waterMap[day];
      const s = sleepMap[day];

      return {
        date: day,
        steps: a ? Number(a.steps) : 0,
        calories: a ? Number(a.calories) : 0,
        active_minutes: a ? Number(a.active_minutes) : 0,
        water_ml: w ? Number(w.amount_ml) : 0,
        sleep_hours: s ? Number(s.hours_slept) : 0,
      };
    });

    res.json({
      week,
      goals: goals.rows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching weekly summary' });
  }
}

module.exports = { getWeeklySummary };