import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FitTrack</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/log" className={linkClass}>Log Entry</NavLink>
        <NavLink to="/goals" className={linkClass}>Goals</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  );
}

export default Sidebar;