import { useEffect, useState } from 'react';
import api from '../api/client';

function Goals() {
  const [goals, setGoals] = useState(null);
  const [form, setForm] = useState({
    daily_steps_target: '',
    daily_water_target_ml: '',
    daily_sleep_target_hours: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/goals').then((res) => {
      setGoals(res.data);
      setForm({
        daily_steps_target: res.data.daily_steps_target,
        daily_water_target_ml: res.data.daily_water_target_ml,
        daily_sleep_target_hours: res.data.daily_sleep_target_hours,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/goals', {
        daily_steps_target: Number(form.daily_steps_target),
        daily_water_target_ml: Number(form.daily_water_target_ml),
        daily_sleep_target_hours: Number(form.daily_sleep_target_hours),
      });
      setGoals(res.data);
      setMessage('Goals updated!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update goals');
    }
  };

  if (!goals) return <p>Loading...</p>;

  return (
    <div className="goals-page">
      <h1>Your Goals</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Daily steps target
          <input
            type="number"
            value={form.daily_steps_target}
            onChange={(e) => setForm({ ...form, daily_steps_target: e.target.value })}
          />
        </label>
        <label>
          Daily water target (ml)
          <input
            type="number"
            value={form.daily_water_target_ml}
            onChange={(e) => setForm({ ...form, daily_water_target_ml: e.target.value })}
          />
        </label>
        <label>
          Daily sleep target (hours)
          <input
            type="number"
            step="0.5"
            value={form.daily_sleep_target_hours}
            onChange={(e) => setForm({ ...form, daily_sleep_target_hours: e.target.value })}
          />
        </label>
        <button type="submit">Save Goals</button>
      </form>
    </div>
  );
}

export default Goals;