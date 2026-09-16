import { useState } from 'react';
import api from '../api/client';

function LogEntry() {
  const [activity, setActivity] = useState({ steps: '', calories: '', active_minutes: '' });
  const [water, setWater] = useState('');
  const [sleep, setSleep] = useState({ bedtime: '', wake_time: '' });
  const [message, setMessage] = useState('');

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', {
        steps: Number(activity.steps) || 0,
        calories: Number(activity.calories) || 0,
        active_minutes: Number(activity.active_minutes) || 0,
      });
      setMessage('Activity logged!');
      setActivity({ steps: '', calories: '', active_minutes: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to log activity');
    }
  };

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/water', { amount_ml: Number(water) });
      setMessage('Water logged!');
      setWater('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to log water');
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sleep', {
        bedtime: sleep.bedtime,
        wake_time: sleep.wake_time,
      });
      setMessage('Sleep logged!');
      setSleep({ bedtime: '', wake_time: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to log sleep');
    }
  };

  return (
    <div className="log-entry-page">
      <h1>Log Today</h1>
      {message && <p className="message">{message}</p>}

      <section>
        <h2>Activity</h2>
        <form onSubmit={handleActivitySubmit}>
          <input
            type="number"
            placeholder="Steps"
            value={activity.steps}
            onChange={(e) => setActivity({ ...activity, steps: e.target.value })}
          />
          <input
            type="number"
            placeholder="Calories"
            value={activity.calories}
            onChange={(e) => setActivity({ ...activity, calories: e.target.value })}
          />
          <input
            type="number"
            placeholder="Active minutes"
            value={activity.active_minutes}
            onChange={(e) => setActivity({ ...activity, active_minutes: e.target.value })}
          />
          <button type="submit">Log Activity</button>
        </form>
      </section>

      <section>
        <h2>Water</h2>
        <form onSubmit={handleWaterSubmit}>
          <input
            type="number"
            placeholder="Amount (ml)"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            required
          />
          <button type="submit">Log Water</button>
        </form>
      </section>

      <section>
        <h2>Sleep</h2>
        <form onSubmit={handleSleepSubmit}>
          <label>
            Bedtime
            <input
              type="datetime-local"
              value={sleep.bedtime}
              onChange={(e) => setSleep({ ...sleep, bedtime: e.target.value })}
              required
            />
          </label>
          <label>
            Wake time
            <input
              type="datetime-local"
              value={sleep.wake_time}
              onChange={(e) => setSleep({ ...sleep, wake_time: e.target.value })}
              required
            />
          </label>
          <button type="submit">Log Sleep</button>
        </form>
      </section>
    </div>
  );
}

export default LogEntry;