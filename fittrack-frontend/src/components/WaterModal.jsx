import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/client';
import { toDateKey } from '../utils/dates';
import './ActivityModal.css';

function WaterModal({ water, onClose, onSaved }) {
  const initialDate = toDateKey(new Date(water.logged_at));

  const [form, setForm] = useState({
    amount_ml: String(water.amount_ml),
    date: initialDate,
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

    const amount = Number(form.amount_ml);
    if (!amount || amount <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }

    const payload = { amount_ml: amount };
    // Only send the date if it was changed, so the original day is never shifted by accident.
    if (form.date && form.date !== initialDate) payload.logged_at = form.date;

    setSaving(true);
    try {
      const res = await api.put(`/water/${water.id}`, payload);
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
        aria-labelledby="edit-water-title"
      >
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 id="edit-water-title">Edit water entry</h2>
        <p className="modal-subtitle">Update the amount or the date, then save.</p>

        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <label>
              Amount (ml)
              <input
                type="number"
                min="1"
                max="5000"
                step="1"
                value={form.amount_ml}
                onChange={setField('amount_ml')}
                required
              />
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

export default WaterModal;