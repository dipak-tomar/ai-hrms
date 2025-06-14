import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, token } = useAuthStore(state => ({
    user: state.user,
    token: state.token
  }));
  const location = useLocation();
  
  // Authentication check - require both user and token
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access check
  if (requiredRole) {
    const roleHierarchy = { admin: 3, manager: 2, employee: 1 };
    const userRole = user.role.toLowerCase() as keyof typeof roleHierarchy;
    const userLevel = roleHierarchy[userRole] || 1; // Default to lowest level if role not found
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;