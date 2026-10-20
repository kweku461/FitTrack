import { useEffect, useState } from 'react';
import { Droplets, Moon } from 'lucide-react';
import api from '../api/client';
import ActivityModal from '../components/ActivityModal';
import WaterModal from '../components/WaterModal';
import SleepModal from '../components/SleepModal';
import HistoryTable from '../components/HistoryTable';
import RowActions from '../components/RowActions';
import { ACTIVITY_TYPE_INFO } from '../utils/activityTypes';
import {
  toDateKey,
  formatDate,
  formatTime,
  formatDateTime,
  formatHours,
} from '../utils/dates';
import '../styles/History.css';

const TABS = [
  { id: 'activity', label: 'Activity' },
  { id: 'water', label: 'Water' },
  { id: 'sleep', label: 'Sleep' },
];

const RANGES = [
  { id: 'week', label: 'This week' },
  { id: '7days', label: 'Last 7 days' },
  { id: '30days', label: 'Last 30 days' },
  { id: 'all', label: 'All time' },
  { id: 'custom', label: 'Custom range' },
];

const daysAgo = (n) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
};

// Weeks run Monday to Sunday.
const startOfWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};

const getBounds = (range, customFrom, customTo) => {
  const today = toDateKey(new Date());
  switch (range) {
    case 'week':
      return { from: toDateKey(startOfWeek()), to: today };
    case '7days':
      return { from: toDateKey(daysAgo(6)), to: today };
    case '30days':
      return { from: toDateKey(daysAgo(29)), to: today };
    case 'custom':
      return { from: customFrom || null, to: customTo || null };
    default:
      return { from: null, to: null };
  }
};

const inBounds = (timestamp, { from, to }) => {
  const key = toDateKey(new Date(timestamp));
  return (!from || key >= from) && (!to || key <= to);
};

const orDash = (value, format) => (Number(value) > 0 ? format(Number(value)) : '—');

// Sleep belongs to the day you woke up.
const sleepWhen = (sleep) => sleep.wake_time || sleep.logged_at;

const activityColumns = [
  {
    label: 'Type',
    title: true,
    render: (a) => {
      const info = ACTIVITY_TYPE_INFO[a.activity_type];
      const Icon = info?.icon;
      return (
        <span className="history-type">
          {Icon && <Icon size={16} />}
          {info?.label || 'Activity'}
        </span>
      );
    },
  },
  { label: 'Date', render: (a) => formatDate(a.logged_at) },
  { label: 'Duration', render: (a) => orDash(a.active_minutes, (n) => `${n} min`) },
  { label: 'Steps', render: (a) => orDash(a.steps, (n) => n.toLocaleString()) },
  { label: 'Distance', render: (a) => orDash(a.distance_km, (n) => `${n} km`) },
  { label: 'Calories', render: (a) => orDash(a.calories, (n) => `${n} kcal`) },
];

const waterColumns = [
  {
    label: 'Amount',
    title: true,
    render: (w) => (
      <span className="history-type">
        <Droplets size={16} />
        {Number(w.amount_ml).toLocaleString()} ml
      </span>
    ),
  },
  { label: 'Date', render: (w) => formatDate(w.logged_at) },
  { label: 'Time', render: (w) => formatTime(w.logged_at) },
];

const sleepColumns = [
  {
    label: 'Duration',
    title: true,
    render: (s) => (
      <span className="history-type">
        <Moon size={16} />
        {formatHours(s.hours_slept)}
      </span>
    ),
  },
  { label: 'Date', render: (s) => formatDate(sleepWhen(s)) },
  { label: 'Bedtime', render: (s) => (s.bedtime ? formatDateTime(s.bedtime) : '—') },
  { label: 'Wake time', render: (s) => (s.wake_time ? formatDateTime(s.wake_time) : '—') },
];

function useList(path, errorMessage) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(path)
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.response?.data?.message || errorMessage));
  }, [path, errorMessage]);

  return [items, setItems, error];
}

function History() {
  const [tab, setTab] = useState('activity');
  const [range, setRange] = useState('week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [editing, setEditing] = useState(null); // { kind, item }
  const [actionError, setActionError] = useState('');

  const [activities, setActivities, activitiesError] = useList(
    '/activities',
    'Could not load your activities'
  );
  const [waterLogs, setWaterLogs, waterError] = useList(
    '/water',
    'Could not load your water entries'
  );
  const [sleepLogs, setSleepLogs, sleepError] = useList(
    '/sleep',
    'Could not load your sleep entries'
  );

  const lists = {
    activity: {
      items: activities,
      setItems: setActivities,
      error: activitiesError,
      path: '/activities',
      noun: 'activity',
      emptyText: 'No activities in this date range.',
      columns: activityColumns,
      when: (a) => a.logged_at,
    },
    water: {
      items: waterLogs,
      setItems: setWaterLogs,
      error: waterError,
      path: '/water',
      noun: 'water entry',
      emptyText: 'No water entries in this date range.',
      columns: waterColumns,
      when: (w) => w.logged_at,
    },
    sleep: {
      items: sleepLogs,
      setItems: setSleepLogs,
      error: sleepError,
      path: '/sleep',
      noun: 'sleep entry',
      emptyText: 'No sleep entries in this date range.',
      columns: sleepColumns,
      when: sleepWhen,
    },
  };

  const current = lists[tab];
  const bounds = getBounds(range, customFrom, customTo);
  const rows = (current.items || []).filter((item) => inBounds(current.when(item), bounds));
  const error = current.error || actionError;

  const handleDelete = async (item) => {
    setActionError('');
    try {
      await api.delete(`${current.path}/${item.id}`);
      current.setItems((previous) => previous.filter((x) => x.id !== item.id));
    } catch (err) {
      setActionError(err.response?.data?.message || `Failed to delete ${current.noun}`);
    }
  };

  const handleSaved = (updated) => {
    const list = lists[editing.kind];
    list.setItems((previous) =>
      previous
        .map((x) => (x.id === updated.id ? updated : x))
        .sort((a, b) => new Date(list.when(b)) - new Date(list.when(a)))
    );
    setEditing(null);
  };

  const closeEditor = () => setEditing(null);

  return (
    <div className="history-page">
      <h1>History</h1>
      <p className="history-subtitle">Everything you've logged</p>

      <div className="history-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`history-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => {
              setTab(t.id);
              setActionError('');
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="history-filters">
        <label>
          Show
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        {range === 'custom' && (
          <>
            <label>
              From
              <input
                type="date"
                value={customFrom}
                max={customTo || undefined}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={customTo}
                min={customFrom || undefined}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {error && <p className="history-error">{error}</p>}

      <div className="card history-card">
        {!current.items && !current.error && <p className="history-empty">Loading...</p>}

        {current.items && rows.length === 0 && (
          <p className="history-empty">{current.emptyText}</p>
        )}

        {current.items && rows.length > 0 && (
          <HistoryTable
            columns={current.columns}
            rows={rows}
            renderActions={(item) => (
              <RowActions
                label={current.noun}
                onEdit={() => setEditing({ kind: tab, item })}
                onDelete={() => handleDelete(item)}
              />
            )}
          />
        )}
      </div>

      {editing?.kind === 'activity' && (
        <ActivityModal activity={editing.item} onClose={closeEditor} onSaved={handleSaved} />
      )}
      {editing?.kind === 'water' && (
        <WaterModal water={editing.item} onClose={closeEditor} onSaved={handleSaved} />
      )}
      {editing?.kind === 'sleep' && (
        <SleepModal sleep={editing.item} onClose={closeEditor} onSaved={handleSaved} />
      )}
    </div>
  );
}

export default History;