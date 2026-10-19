export const initialsOf = (name, email) => {
  const parts = (name || email || '?').trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};