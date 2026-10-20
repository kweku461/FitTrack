import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import Logo from './Logo';
import { useLogout } from '../hooks/useLogout';

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const logout = useLogout();
  const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <>
      <div
        className={`sidebar-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="sidebar-brand">
          <Logo size={48} />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>Dashboard</NavLink>
          <NavLink to="/log" className={linkClass} onClick={onClose}>Log Entry</NavLink>
          <NavLink to="/history" className={linkClass} onClick={onClose}>History</NavLink>
          <NavLink to="/goals" className={linkClass} onClick={onClose}>Goals</NavLink>
          <NavLink to="/settings" className={linkClass} onClick={onClose}>Settings</NavLink>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout" onClick={logout}>
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;