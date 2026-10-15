const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const waterRoutes = require('./routes/water');
const sleepRoutes = require('./routes/sleep')
const goalsRoutes = require('./routes/goals');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/water', waterRoutes);
app.use('/sleep', sleepRoutes);
app.use('/goals', goalsRoutes);
app.use('/dashboard', dashboardRoutes);


app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({ status: 'error', message: 'Service unavailable' });
  }
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
