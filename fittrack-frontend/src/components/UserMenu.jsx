import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LogOut, Settings } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useLogout } from '../hooks/useLogout';
import { initialsOf } from '../utils/initials';

function UserMenu() {
  const { user } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (!user) return null;

  const initials = initialsOf(user.name, user.email);

  const goToSettings = (state) => {
    setOpen(false);
    navigate('/settings', state ? { state } : undefined);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        type="button"
        aria-label={`Open account menu for ${user.name || user.email}`}
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {initials}
      </button>

      {open && (
        <div className="user-menu-popover">
          <div className="user-menu-header">
            <span className="user-menu-avatar" aria-hidden="true">{initials}</span>
            <div className="user-menu-id">
              <strong>{user.name || 'Your account'}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <button
            className="user-menu-item"
            type="button"
            onClick={() => goToSettings({ section: 'password' })}
          >
            <KeyRound size={16} /> Change password
          </button>
          <button className="user-menu-item" type="button" onClick={() => goToSettings()}>
            <Settings size={16} /> Settings
          </button>
          <button className="user-menu-item danger" type="button" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;