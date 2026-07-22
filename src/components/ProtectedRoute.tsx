import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isConnected, userRole } = useAuth();
  const location = useLocation();

  if (!isConnected || userRole === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If student tries to access admin routes, redirect to student dashboard
    if (userRole === 'student') {
      return <Navigate to="/student" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
