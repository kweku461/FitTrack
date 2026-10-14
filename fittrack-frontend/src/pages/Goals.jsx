import { useEffect, useState } from 'react';
import api from '../api/client';

const toForm = (data) => ({
  daily_steps_target: data.daily_steps_target,
  daily_water_target_ml: data.daily_water_target_ml,
  daily_sleep_target_hours: data.daily_sleep_target_hours,
});

function Goals() {
  const [form, setForm] = useState({
    daily_steps_target: '',
    daily_water_target_ml: '',
    daily_sleep_target_hours: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    let ignore = false;

    api.get('/goals')
      .then((res) => {
        if (!ignore) setForm(toForm(res.data));
      })
      .catch((err) => {
        if (!ignore) {
          setLoadError(
            err.response?.data?.message || 'Could not load your goals. Please try again.'
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoadError('');
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await api.put('/goals', {
        daily_steps_target: Number(form.daily_steps_target),
        daily_water_target_ml: Number(form.daily_water_target_ml),
        daily_sleep_target_hours: Number(form.daily_sleep_target_hours),
      });
      setForm(toForm(res.data));
      setStatus({ type: 'success', text: 'Goals updated!' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update goals',
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  if (loadError) {
    return (
      <div className="goals-page">
        <h1>Your Goals</h1>
        <p className="error">{loadError}</p>
        <button onClick={handleRetry}>Try again</button>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <h1>Your Goals</h1>
      {status && (
        <p className={status.type === 'error' ? 'error' : 'message'}>{status.text}</p>
      )}
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