import { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import UserMenu from './UserMenu';
import { UserProvider } from '../context/UserContext';

const PAGE_HEADERS = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Your weekly fitness overview',
  },
};

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  if (!token) return <Navigate to="/login" />;

  const header = PAGE_HEADERS[pathname];
  const closeMenu = () => setMenuOpen(false);

  return (
    <UserProvider>
      <div className="app-layout">
        <Sidebar isOpen={menuOpen} onClose={closeMenu} />
        <main className="main-content">
          {header && (
            <div className="topbar">
              <div className="topbar-left">
                <button
                  type="button"
                  className="menu-toggle"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <Menu size={22} />
                </button>
                <div className="topbar-title">
                  <span className="topbar-heading">{header.title}</span>
                  <span className="topbar-subheading">{header.subtitle}</span>
                </div>
              </div>
              <UserMenu />
            </div>
          )}
          <Suspense fallback={<p>Loading...</p>}>
            <Outlet />
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </UserProvider>
  );
}

export default ProtectedRoute;