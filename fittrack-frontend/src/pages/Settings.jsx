import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Pencil, KeyRound, Sun, Moon } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../hooks/useTheme';
import { initialsOf } from '../utils/initials';
import EditNameForm from '../components/EditNameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

function Settings() {
  const { user, setUser, error, reload } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(null); // null | 'name' | 'password'
  const [notice, setNotice] = useState('');
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  // Arriving from the avatar menu's "Change password" opens that form directly
  useEffect(() => {
    if (location.state?.section === 'password') {
      setEditing('password');
      setNotice('');
      // clear the state so a page refresh doesn't reopen the form
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const openForm = (which) => {
    setNotice('');
    setEditing(which);
  };

  const handleNameUpdated = (updatedUser) => {
    setUser(updatedUser);
    setEditing(null);
    setNotice('Name updated');
  };

  const handlePasswordChanged = () => {
    setEditing(null);
    setNotice('Password updated');
  };

  if (error) {
    return (
      <div className="profile-page">
        <h1>Settings</h1>
        <p className="error">{error}</p>
        <button className="profile-retry" onClick={reload}>Try again</button>
      </div>
    );
  }

  if (!user) return <p>Loading...</p>;

  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="profile-page">
      <h1>Settings</h1>

      {notice && <p className="profile-notice">{notice}</p>}

      <div className="card profile-card">
        <div className="profile-avatar" aria-hidden="true">
          {initialsOf(user.name, user.email)}
        </div>
        <div className="profile-info">
          <h2>{user.name || 'No name set'}</h2>
          <p className="subtitle">{user.email}</p>
        </div>
        {editing !== 'name' && (
          <button className="profile-edit" onClick={() => openForm('name')}>
            <Pencil size={16} /> Edit name
          </button>
        )}
      </div>

      {editing === 'name' && (
        <EditNameForm
          user={user}
          onUpdated={handleNameUpdated}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="card profile-details">
        <div className="profile-row">
          <span>Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <span>Member since</span>
          <span>{memberSince}</span>
        </div>
      </div>

      <div className="card settings-appearance">
        <div>
          <h3>Appearance</h3>
          <p className="subtitle">{theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}</p>
        </div>
        <button className="profile-edit" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {editing === 'password' ? (
        <ChangePasswordForm
          onChanged={handlePasswordChanged}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button className="profile-edit profile-password-btn" onClick={() => openForm('password')}>
          <KeyRound size={16} /> Change password
        </button>
      )}

      <button className="profile-logout" onClick={logout}>
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}

export default Settings;