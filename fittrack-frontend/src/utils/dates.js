// Local date as YYYY-MM-DD (avoids UTC shifting the day).
export const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Value for <input type="datetime-local"> (local time, no seconds).
export const toDateTimeLocal = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${toDateKey(date)}T${hours}:${minutes}`;
};

export const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateTime = (timestamp) =>
  `${new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })}, ${formatTime(timestamp)}`;

export const formatHours = (hours) => {
  const totalMinutes = Math.round((Number(hours) || 0) * 60);
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
};