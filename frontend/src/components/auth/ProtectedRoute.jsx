import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/qtrack/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-3">Access Denied</h2>
          <p className="text-red-600 font-medium">You don't have permission to access this panel. Required role: <strong>{allowedRoles.join(' or ')}</strong></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
