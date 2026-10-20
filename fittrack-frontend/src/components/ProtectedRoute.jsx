import { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
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

  if (!token) return <Navigate to="/login" />;

  const header = PAGE_HEADERS[pathname];

  return (
    <UserProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {header && (
            <div className="topbar">
              <div className="topbar-title">
                <span className="topbar-heading">{header.title}</span>
                <span className="topbar-subheading">{header.subtitle}</span>
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