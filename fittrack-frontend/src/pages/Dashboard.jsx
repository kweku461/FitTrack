import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/client';

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/weekly')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { week, goals } = data;

  const totalSteps = week.reduce((sum, d) => sum + d.steps, 0);
  const totalWater = week.reduce((sum, d) => sum + d.water_ml, 0);
  const totalSleep = week.reduce((sum, d) => sum + d.sleep_hours, 0);

  const avgSteps = totalSteps / 7;
  const avgWater = totalWater / 7;
  const avgSleep = totalSleep / 7;

  const stepsPct = goals ? Math.min(100, Math.round((avgSteps / goals.daily_steps_target) * 100)) : 0;
  const waterPct = goals ? Math.min(100, Math.round((avgWater / goals.daily_water_target_ml) * 100)) : 0;
  const sleepPct = goals ? Math.min(100, Math.round((avgSleep / goals.daily_sleep_target_hours) * 100)) : 0;

  return (
    <div className="dashboard-page">
      <h1>Your Week</h1>

      <div className="metric-cards">
        <div className="metric-card">
          <h3>Steps</h3>
          <p>{stepsPct}%</p>
          <span>{Math.round(avgSteps)} / {goals?.daily_steps_target} avg</span>
        </div>
        <div className="metric-card">
          <h3>Water</h3>
          <p>{waterPct}%</p>
          <span>{Math.round(avgWater)}ml / {goals?.daily_water_target_ml}ml avg</span>
        </div>
        <div className="metric-card">
          <h3>Sleep</h3>
          <p>{sleepPct}%</p>
          <span>{avgSleep.toFixed(1)}h / {goals?.daily_sleep_target_hours}h avg</span>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={week}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="steps" stroke="#8884d8" name="Steps" />
            <Line type="monotone" dataKey="water_ml" stroke="#82ca9d" name="Water (ml)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;