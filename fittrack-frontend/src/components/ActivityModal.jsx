import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/client';
import { ACTIVITY_TYPE_INFO } from '../utils/activityTypes';
import { toDateKey } from '../utils/dates';
import './ActivityModal.css';

const numberOrEmpty = (value) => (Number(value) > 0 ? String(Number(value)) : '');

function ActivityModal({ activity, onClose, onSaved }) {
  const initialDate = toDateKey(new Date(activity.logged_at));

  const [form, setForm] = useState({
    activity_type: activity.activity_type,
    date: initialDate,
    active_minutes: numberOrEmpty(activity.active_minutes),
    calories: numberOrEmpty(activity.calories),
    distance_km: numberOrEmpty(activity.distance_km),
    steps: numberOrEmpty(activity.steps),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const setField = (name) => (event) =>
    setForm((previous) => ({ ...previous, [name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      activity_type: form.activity_type,
      steps: Number(form.steps) || 0,
      calories: Number(form.calories) || 0,
      active_minutes: Number(form.active_minutes) || 0,
      distance_km: Number(form.distance_km) || 0,
    };

    if (
      !payload.steps &&
      !payload.calories &&
      !payload.active_minutes &&
      !payload.distance_km
    ) {
      setError('Enter at least one value greater than 0');
      return;
    }

    // Only send the date if it was changed, so the original day is never shifted by accident.
    if (form.date && form.date !== initialDate) payload.logged_at = form.date;

    setSaving(true);
    try {
      const res = await api.put(`/activities/${activity.id}`, payload);
      onSaved(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-activity-title"
      >
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 id="edit-activity-title">Edit activity</h2>
        <p className="modal-subtitle">
          Update any value, then save. At least one value is required.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <label>
              Activity type
              <select value={form.activity_type} onChange={setField('activity_type')}>
                {Object.entries(ACTIVITY_TYPE_INFO).map(([value, info]) => (
                  <option key={value} value={value}>
                    {info.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                max={toDateKey(new Date())}
                onChange={setField('date')}
                required
              />
            </label>

            <label>
              Duration (minutes)
              <input
                type="number"
                min="0"
                step="1"
                value={form.active_minutes}
                onChange={setField('active_minutes')}
              />
            </label>

            <label>
              Calories burned
              <input
                type="number"
                min="0"
                step="1"
                value={form.calories}
                onChange={setField('calories')}
              />
            </label>

            <label>
              Distance (km, optional)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.distance_km}
                onChange={setField('distance_km')}
              />
            </label>

            <label>
              Steps (optional)
              <input
                type="number"
                min="0"
                step="1"
                value={form.steps}
                onChange={setField('steps')}
              />
            </label>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityModal;