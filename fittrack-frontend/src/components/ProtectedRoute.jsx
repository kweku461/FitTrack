import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <MobileHeader />
      <main className="main-content">
        <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      </main>
      <BottomNav />
    </div>
  );
}

export default ProtectedRoute;