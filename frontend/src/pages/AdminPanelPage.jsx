import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDoctorsForAdmin, verifyDoctor } from '../api/adminApi';
import { ShieldCheck, ShieldOff } from 'lucide-react';

const AdminPanelPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctorsForAdmin(userInfo.token);
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [userInfo.token]);

  const handleVerify = async (doctorId) => {
    try {
      // Optimistically update the UI
      setDoctors(prevDoctors =>
        prevDoctors.map(doc =>
          doc._id === doctorId ? { ...doc, isVerified: true } : doc
        )
      );
      // Make the API call
      await verifyDoctor(doctorId, userInfo.token);
    } catch (err) {
      setError(err.message);
      // Revert UI on error if needed
      fetchDoctors();
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading admin panel...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Admin Panel</h1>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
            <p className="text-gray-500">Verify new doctor profiles to make them visible to patients.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.filter(doctor => doctor.user).map(doctor => (
                  <tr key={doctor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{doctor.user.name}</div>
                      <div className="text-sm text-gray-500">{doctor.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.specialty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doctor.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ShieldCheck size={14} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ShieldOff size={14} className="mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!doctor.isVerified && (
                        <button onClick={() => handleVerify(doctor._id)} className="text-blue-600 hover:text-blue-900">
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;