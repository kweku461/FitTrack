import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Footprints, Flame, Droplets, Moon, Timer, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useUser } from '../hooks/useUser';
import RecentActivity from '../components/RecentActivity';

const formatDay = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short' });

const formatFullDay = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatHours = (hours) => {
  const totalMinutes = Math.round((hours || 0) * 60);
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
};

const pct = (value, target) =>
  target ? Math.min(100, Math.round((value / target) * 100)) : 0;

function MetricCard({ label, value, sub, icon: Icon, tone, percent }) {
  return (
    <div className="card metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={20} />
        </span>
      </div>
      <span className="metric-value">{value}</span>
      <span className="metric-sub">{sub}</span>
      {percent !== null && (
        <>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="metric-sub">{percent}% of target</span>
        </>
      )}
    </div>
  );
}

function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/weekly')
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load dashboard')
      );
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { week, goals } = data;
  const today = week[week.length - 1];
  const firstName = user?.name?.trim().split(' ')[0];

  const stepsGoal = goals?.daily_steps_target;
  const waterGoal = goals?.daily_water_target_ml;
  const sleepGoal = goals?.daily_sleep_target_hours;

  const totalSteps = week.reduce((sum, d) => sum + d.steps, 0);
  const totalWater = week.reduce((sum, d) => sum + d.water_ml, 0);
  const totalCalories = week.reduce((sum, d) => sum + d.calories, 0);
  const totalActiveMin = week.reduce((sum, d) => sum + d.active_minutes, 0);
  const sleepDays = week.filter((d) => d.sleep_hours > 0);
  const avgSleep = sleepDays.length
    ? sleepDays.reduce((sum, d) => sum + d.sleep_hours, 0) / sleepDays.length
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>
          {getGreeting()}
          {firstName ? `, ${firstName}` : ''} 👋
        </h1>
        <p className="subtitle">Here's your fitness progress for the last 7 days.</p>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Steps"
          icon={Footprints}
          tone="tone-accent"
          value={today.steps.toLocaleString()}
          sub={stepsGoal ? `of ${stepsGoal.toLocaleString()} today` : 'No goal set'}
          percent={pct(today.steps, stepsGoal)}
        />

        <MetricCard
          label="Calories burned"
          icon={Flame}
          tone="tone-orange"
          value={`${Math.round(today.calories)} kcal`}
          sub="burned today"
          percent={null}
        />

        <MetricCard
          label="Water intake"
          icon={Droplets}
          tone="tone-blue"
          value={`${(today.water_ml / 1000).toFixed(2)} L`}
          sub={waterGoal ? `of ${(waterGoal / 1000).toFixed(1)} L today` : 'No goal set'}
          percent={pct(today.water_ml, waterGoal)}
        />

        <MetricCard
          label="Sleep"
          icon={Moon}
          tone="tone-accent"
          value={today.sleep_hours > 0 ? formatHours(today.sleep_hours) : 'No log'}
          sub={sleepGoal ? `of ${sleepGoal}h goal` : 'No goal set'}
          percent={pct(today.sleep_hours, sleepGoal)}
        />

        <MetricCard
          label="Active minutes"
          icon={Timer}
          tone="tone-accent"
          value={`${Math.round(today.active_minutes)} min`}
          sub="active today"
          percent={null}
        />

        <div className="card metric-card review-card">
          <div className="review-title">
            <Sparkles size={18} />
            <span>Your Week in Review</span>
          </div>
          <div className="review-row">
            <span>Total steps</span>
            <strong>{totalSteps.toLocaleString()}</strong>
          </div>
          <div className="review-row">
            <span>Active minutes</span>
            <strong>{Math.round(totalActiveMin)} min</strong>
          </div>
          <div className="review-row">
            <span>Calories burned</span>
            <strong>{Math.round(totalCalories)} kcal</strong>
          </div>
          <div className="review-row">
            <span>Average sleep</span>
            <strong>{formatHours(avgSleep)}</strong>
          </div>
          <div className="review-row">
            <span>Water</span>
            <strong>{(totalWater / 1000).toFixed(2)} L</strong>
          </div>
        </div>
      </div>

      <div className="card chart-card">
        <h2>Weekly Progress</h2>
        <p className="subtitle">
          Steps per day{stepsGoal ? ' · dashed line is your daily goal' : ''}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={week} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--text-secondary)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatDay}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              tick={{ fontSize: 12 }}
              width={48}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-hover)' }}
              labelFormatter={formatFullDay}
              formatter={(value) => [value.toLocaleString(), 'Steps']}
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-primary)',
              }}
            />
            {stepsGoal && (
              <ReferenceLine
                y={stepsGoal}
                stroke="var(--text-secondary)"
                strokeDasharray="5 5"
                ifOverflow="extendDomain"
              />
            )}
            <Bar dataKey="steps" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <RecentActivity />
    </div>
  );
}

export default Dashboard;