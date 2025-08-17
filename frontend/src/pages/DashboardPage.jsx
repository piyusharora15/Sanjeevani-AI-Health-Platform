import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';

const DashboardPage = () => {
  const { userInfo } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          Welcome back, {userInfo.name.split(' ')[0]}!
        </h1>
        
        {/* Conditionally render the correct dashboard based on user role */}
        {userInfo.role === 'patient' && <PatientDashboard />}
        {userInfo.role === 'doctor' && <DoctorDashboard />}
        
      </div>
    </div>
  );
};

export default DashboardPage;