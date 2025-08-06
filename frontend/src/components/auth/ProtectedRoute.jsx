import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { userInfo, isLoading } = useAuth();

  // This is to handle the initial loading state where we are checking for user info
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div> {/* Or a spinner component */}
      </div>
    );
  }

  // If user info exists (i.e., user is logged in), render the child route using <Outlet />.
  // <Outlet /> is a placeholder for the actual page component (e.g., AssistantPage).
  // If not logged in, redirect them to the /login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// This component is used to protect routes that require authentication.
// It checks if the user is logged in by looking for userInfo in the AuthContext.