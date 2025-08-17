// src/components/dashboard/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPatientBookings } from '../../api/appointmentApi';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Stethoscope, IndianRupee, Video, MessageSquare } from 'lucide-react';

const PatientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyPatientBookings(userInfo.token);
        // Sort appointments to show upcoming ones first
        data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [userInfo.token]);

  if (isLoading) return <p className="text-center py-10">Loading your appointments...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  const upcomingAppointments = bookings.filter(appt => new Date(appt.appointmentDate) >= new Date());
  const pastAppointments = bookings.filter(appt => new Date(appt.appointmentDate) < new Date());

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>
      
      {/* Upcoming Appointments Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming</h3>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAppointments.map(appt => (
              <div key={appt._id} className="bg-white p-6 rounded-2xl shadow-lg border border-transparent hover:border-blue-500 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${appt.doctor.user.name.charAt(0)}`} alt="Doctor" className="w-14 h-14 rounded-full" />
                  <div className="ml-4">
                    <p className="font-bold text-lg text-gray-900">Dr. {appt.doctor.user.name}</p>
                    <p className="text-sm text-gray-600 flex items-center"><Stethoscope size={14} className="mr-1.5" />{appt.doctor.specialty}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 my-4"></div>
                <div className="text-sm text-gray-700 space-y-3">
                  <p className="flex items-center"><Calendar size={14} className="mr-2 text-gray-500" /> <span className="font-medium">{new Date(appt.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                  <p className="flex items-center"><Clock size={14} className="mr-2 text-gray-500" /> <span className="font-medium">{appt.appointmentTime}</span></p>
                  <p className="flex items-center"><IndianRupee size={14} className="mr-2 text-gray-500" /> <span className="font-medium">{appt.consultationFee} (Paid)</span></p>
                </div>
                                <div className="mt-6 flex space-x-2">
                  <a 
                    href={`https://meet.jit.si/${appt.videoCallRoomId}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                  >
                    <Video size={16} className="mr-2" /> Join Call
                  </a>
                  <Link 
                    to={`/chat/${appt._id}`}
                    className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                  >
                    <MessageSquare size={16} className="mr-2" /> Chat
                  </Link>
                </div>
                </div>
            ))}
            </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">You have no upcoming appointments.</p>
          </div>
        )}
      </div>

      {/* Past Appointments Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Past</h3>
        {pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.map(appt => (
              <div key={appt._id} className="bg-white p-4 rounded-lg shadow-sm border opacity-70">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-700">Dr. {appt.doctor.user.name}</p>
                    <p className="text-sm text-gray-500">{appt.doctor.specialty}</p>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 md:mt-0">
                    <span>{new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">You have no past appointments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;