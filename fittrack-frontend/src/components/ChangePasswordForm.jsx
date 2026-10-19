import { useState } from 'react';
import api from '../api/client';
import { validatePassword } from '../utils/password';

const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };

function ChangePasswordForm({ onChanged, onCancel }) {
  const [values, setValues] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { currentPassword, newPassword, confirmPassword } = values;

    if (!currentPassword) return setError('Enter your current password');

    const pwError = validatePassword(newPassword);
    if (pwError) return setError(pwError);

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    setSaving(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change your password. Please try again.');
      setSaving(false);
    }
  };

  return (
    <form className="card profile-form" onSubmit={handleSubmit}>
      <h3>Change password</h3>

      <label className="profile-field">
        <span>Current password</span>
        <input
          type="password"
          name="currentPassword"
          value={values.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          autoFocus
        />
      </label>

      <label className="profile-field">
        <span>New password</span>
        <input
          type="password"
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <small>At least 8 characters, with a letter and a number.</small>
      </label>

      <label className="profile-field">
        <span>Confirm new password</span>
        <input
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="profile-form-actions">
        <button className="profile-submit" type="submit" disabled={saving}>
          {saving ? 'Updating...' : 'Update password'}
        </button>
        <button className="profile-cancel" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;