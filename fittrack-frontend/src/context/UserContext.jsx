import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { UserContext } from './user-context';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    api.get('/auth/me')
      .then((res) => {
        if (!ignore) setUser(res.data.user);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Could not load your account. Please try again.');
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setError('');
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, error, reload }}>
      {children}
    </UserContext.Provider>
  );
}
