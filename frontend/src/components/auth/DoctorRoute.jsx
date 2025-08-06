import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This component protects routes that should only be accessible to doctors
const DoctorRoute = () => {
  const { userInfo, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // Check if user is logged in AND their role is 'doctor'
  if (userInfo && userInfo.role === 'doctor') {
    return <Outlet />; // If yes, render the child component (e.g., DoctorProfilePage)
  } else {
    // If not, redirect them to the homepage or a 'not authorized' page
    return <Navigate to="/" replace />;
  }
};

export default DoctorRoute;

// This component can be used in your routing setup to protect doctor-specific routes.