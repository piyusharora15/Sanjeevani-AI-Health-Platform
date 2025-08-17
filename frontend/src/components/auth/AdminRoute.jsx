import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This component protects routes that should only be accessible to admins
const AdminRoute = () => {
  const { userInfo, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user is logged in AND their role is 'admin'
  if (userInfo && userInfo.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />; // Redirect non-admins to the homepage
  }
};

export default AdminRoute;