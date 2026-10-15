import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      </main>
    </div>
  );
}

export default ProtectedRoute;