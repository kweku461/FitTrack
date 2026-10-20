import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/client';
import { toDateTimeLocal } from '../utils/dates';
import './ActivityModal.css';

function SleepModal({ sleep, onClose, onSaved }) {
  const [form, setForm] = useState({
    bedtime: sleep.bedtime ? toDateTimeLocal(sleep.bedtime) : '',
    wake_time: sleep.wake_time ? toDateTimeLocal(sleep.wake_time) : '',
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

    if (new Date(form.wake_time) <= new Date(form.bedtime)) {
      setError('Wake time must be after bedtime. For overnight sleep, pick the next day.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/sleep/${sleep.id}`, {
        bedtime: form.bedtime,
        wake_time: form.wake_time,
      });
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
        aria-labelledby="edit-sleep-title"
      >
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 id="edit-sleep-title">Edit sleep entry</h2>
        <p className="modal-subtitle">
          Change your bedtime or wake time. The hours slept are recalculated.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <label>
              Bedtime
              <input
                type="datetime-local"
                value={form.bedtime}
                onChange={setField('bedtime')}
                required
              />
            </label>

            <label>
              Wake time
              <input
                type="datetime-local"
                value={form.wake_time}
                min={form.bedtime || undefined}
                onChange={setField('wake_time')}
                required
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

export default SleepModal;