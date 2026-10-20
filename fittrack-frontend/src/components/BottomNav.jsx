import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, History, Target, User } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/log', label: 'Log', Icon: Plus },
  { to: '/history', label: 'History', Icon: History },
  { to: '/goals', label: 'Goals', Icon: Target },
  { to: '/profile', label: 'Profile', Icon: User },
];

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;