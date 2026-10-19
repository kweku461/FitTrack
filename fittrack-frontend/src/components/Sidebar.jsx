import { NavLink } from 'react-router-dom';
import Logo from './Logo';

function Sidebar() {
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

    </aside>
  );
}

export default Sidebar;