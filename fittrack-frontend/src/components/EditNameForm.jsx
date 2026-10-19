import { useState } from 'react';
import api from '../api/client';

function EditNameForm({ user, onUpdated, onCancel }) {
  const [name, setName] = useState(user.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const trimmed = name.trim();
  const unchanged = trimmed === (user.name || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!trimmed) return setError('Name is required');
    if (trimmed.length > 100) return setError('Name must be 100 characters or fewer');

    setSaving(true);
    try {
      const res = await api.patch('/auth/me', { name: trimmed });
      onUpdated(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your name. Please try again.');
      setSaving(false);
    }
  };

  return (
    <form className="card profile-form" onSubmit={handleSubmit}>
      <h3>Edit name</h3>

      <label className="profile-field">
        <span>Full name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          maxLength={100}
          autoComplete="name"
          autoFocus
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="profile-form-actions">
        <button className="profile-submit" type="submit" disabled={saving || unchanged}>
          {saving ? 'Saving...' : 'Save name'}
        </button>
        <button className="profile-cancel" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditNameForm;