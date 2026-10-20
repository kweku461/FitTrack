import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footprints } from 'lucide-react';
import api from '../api/client';
import './RecentActivity.css';

const MAX_ITEMS = 5;

const formatWhen = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day} · ${time}`;
};

const describe = (activity) => {
  const parts = [];
  if (activity.steps > 0) parts.push(`${Number(activity.steps).toLocaleString()} steps`);
  if (activity.active_minutes > 0) parts.push(`${activity.active_minutes} min`);
  if (activity.calories > 0) parts.push(`${activity.calories} kcal`);
  return parts.join(' — ') || 'Activity logged';
};

function RecentActivity() {
  const [activities, setActivities] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/activities')
      .then((res) => setActivities(res.data.slice(0, MAX_ITEMS)))
      .catch((err) =>
        setError(err.response?.data?.message || 'Could not load recent activity')
      );
  }, []);

  return (
    <div className="card recent-card">
      <div className="recent-header">
        <h2>Recent Activity</h2>
        <Link to="/history" className="recent-link">
          View all
        </Link>
      </div>

      {error && <p className="recent-empty">{error}</p>}
      {!error && !activities && <p className="recent-empty">Loading...</p>}
      {!error && activities && activities.length === 0 && (
        <p className="recent-empty">
          No activity logged yet. <Link to="/log">Log your first one</Link>.
        </p>
      )}

      {activities && activities.length > 0 && (
        <ul className="recent-list">
          {activities.map((activity) => (
            <li className="recent-item" key={activity.id}>
              <span className="recent-icon">
                <Footprints size={20} />
              </span>
              <div className="recent-text">
                <span className="recent-title">{describe(activity)}</span>
                <span className="recent-when">{formatWhen(activity.logged_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;