import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from './Logo';
import { useLogout } from '../hooks/useLogout';

function Sidebar() {
  const logout = useLogout();
  const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={48} />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/log" className={linkClass}>Log Entry</NavLink>
        <NavLink to="/goals" className={linkClass}>Goals</NavLink>
        <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={logout}>
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;