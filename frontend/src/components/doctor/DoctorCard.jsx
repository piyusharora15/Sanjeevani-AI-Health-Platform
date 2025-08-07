import React from 'react';
import { Stethoscope, MapPin, IndianRupee, Star } from 'lucide-react';

// Accept the onBookAppointment prop
const DoctorCard = ({ doctor, onBookAppointment }) => {
  if (!doctor || !doctor.user) {
    return null;
  }
  // The 'user' field is populated from our backend API call
  const { user, specialty, location, consultationFee, ratings } = doctor;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            className="h-16 w-16 rounded-full object-cover" 
            src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${user.name.charAt(0)}`} 
            alt={`Dr. ${user.name}`} 
          />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800">Dr. {user.name}</h3>
            <p className="text-blue-600 font-semibold">{specialty}</p>
          </div>
        </div>
        
        <div className="space-y-3 text-gray-600 text-sm">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <IndianRupee size={16} className="mr-2 text-gray-400" />
            <span>{consultationFee} Consultation Fee</span>
          </div>
          <div className="flex items-center">
            <Star size={16} className="mr-2 text-yellow-500" />
            <span>{ratings.average.toFixed(1)} ({ratings.count} reviews)</span>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={onBookAppointment}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;