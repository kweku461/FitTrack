import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useLogout } from '../hooks/useLogout';
import Logo from './Logo';

function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();

  const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={32} />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/log" className={linkClass}>Log Entry</NavLink>
        <NavLink to="/goals" className={linkClass}>Goals</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
        <button className="logout-btn" onClick={logout}>Log out</button>
      </div>
    </aside>
  );
}

export default Sidebar;