import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import UserMenu from './UserMenu';
import { UserProvider } from '../context/UserContext';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <UserProvider>
      <div className="app-layout">
        <Sidebar />
        <MobileHeader />
        <main className="main-content">
          <div className="topbar">
            <UserMenu />
          </div>
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