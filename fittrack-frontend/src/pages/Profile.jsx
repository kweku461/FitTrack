import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import api from '../api/client';
import { useLogout } from '../hooks/useLogout';

const initialsOf = (name, email) => {
  const parts = (name || email || '?').trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const logout = useLogout();

  useEffect(() => {
    let ignore = false;

    api.get('/auth/me')
      .then((res) => {
        if (!ignore) setUser(res.data.user);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Could not load your profile. Please try again.');
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setError('');
    setReloadKey((k) => k + 1);
  };

  if (error) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p className="error">{error}</p>
        <button className="profile-retry" onClick={handleRetry}>Try again</button>
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
      <h1>Profile</h1>

      <div className="card profile-card">
        <div className="profile-avatar" aria-hidden="true">
          {initialsOf(user.name, user.email)}
        </div>
        <div className="profile-info">
          <h2>{user.name || 'No name set'}</h2>
          <p className="subtitle">{user.email}</p>
        </div>
      </div>

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

      <button className="profile-logout" onClick={logout}>
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}

export default Profile;