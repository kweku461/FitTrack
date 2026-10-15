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
  const totalCalories = week.reduce((sum, d) => sum + d.calories, 0);
  const totalActiveMin = week.reduce((sum, d) => sum + d.active_minutes, 0);

  const avgSteps = totalSteps / 7;
  const avgWater = totalWater / 7;
  const avgSleep = totalSleep / 7;
  const avgCalories = totalCalories / 7;
  const avgActiveMin = totalActiveMin / 7;

  const pct = (value, target) => (target ? Math.min(100, Math.round((value / target) * 100)) : 0);

  const stepsPct = pct(avgSteps, goals?.daily_steps_target);
  const waterPct = pct(avgWater, goals?.daily_water_target_ml);
  const sleepPct = pct(avgSleep, goals?.daily_sleep_target_hours);

  const metrics = [
    { label: 'Steps', value: Math.round(avgSteps).toLocaleString(), goalText: `Goal ${goals?.daily_steps_target?.toLocaleString()}`, pct: stepsPct },
    { label: 'Water', value: `${(avgWater / 1000).toFixed(2)} L`, goalText: `Goal ${(goals?.daily_water_target_ml / 1000).toFixed(1)} L`, pct: waterPct },
    { label: 'Sleep', value: `${avgSleep.toFixed(1)}h`, goalText: `Goal ${goals?.daily_sleep_target_hours}h`, pct: sleepPct },
    { label: 'Calories burned', value: `${Math.round(avgCalories)} kcal`, goalText: `${week.filter(d => d.calories > 0).length} active days`, pct: null },
    { label: 'Active minutes', value: `${Math.round(avgActiveMin)} min`, goalText: 'From all logged activities', pct: null },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Week</h1>
        <p className="subtitle">Here's your fitness overview for the last 7 days.</p>
      </div>

      <div className="metric-grid">
        {metrics.map((m) => (
          <div className="card metric-card" key={m.label}>
            <span className="metric-label">{m.label}</span>
            <span className="metric-value">{m.value}</span>
            {m.pct !== null ? (
              <>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="metric-sub">{m.goalText} · {m.pct}%</span>
              </>
            ) : (
              <span className="metric-sub">{m.goalText}</span>
            )}
          </div>
        ))}
      </div>

      <div className="card chart-card">
        <h2>Activity, last 7 days</h2>
        <p className="subtitle">Daily totals from your logged entries.</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={week}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <Legend />
            <Line type="monotone" dataKey="steps" stroke="var(--accent)" strokeWidth={2} name="Steps" />
            <Line type="monotone" dataKey="water_ml" stroke="#60a5fa" strokeWidth={2} name="Water (ml)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;