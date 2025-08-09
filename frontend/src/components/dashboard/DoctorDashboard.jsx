import React, { useState, useEffect } from 'react';
import { getMyDoctorBookings } from '../../api/appointmentApi';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User } from 'lucide-react';

const DoctorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyDoctorBookings(userInfo.token);
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [userInfo.token]);

  if (isLoading) return <p>Loading your schedule...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Schedule</h2>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map(appt => (
            <div key={appt._id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="font-bold text-lg text-blue-700 flex items-center"><User size={16} className="mr-2" />{appt.patient.name}</p>
                  <p className="text-sm text-gray-600">{appt.patient.email}</p>
                </div>
                <div className="text-sm text-gray-700 space-y-2 mt-4 md:mt-0">
                  <p className="flex items-center"><Calendar size={14} className="mr-2" /> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                  <p className="flex items-center"><Clock size={14} className="mr-2" /> {appt.appointmentTime}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                   <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no appointments scheduled.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;