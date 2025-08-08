import React, { useState, useEffect } from 'react';
import { getAllDoctors } from '../api/doctorApi';
import DoctorCard from '../components/doctor/DoctorCard';
import BookingModal from '../components/doctor/BookingModal';

const FindDoctorPage = () => {
  const [allDoctors, setAllDoctors] = useState([]); // Store the original list
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Store the list to display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW: State for filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

// --- NEW: State for managing the booking modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setAllDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

// --- NEW: useEffect to apply filters whenever they change ---
  const applyFilters = useCallback(() => {
    let doctors = [...allDoctors];

    if (searchTerm) {
      doctors = doctors.filter(doc =>
        doc.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (location) {
      doctors = doctors.filter(doc =>
        doc.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (language) {
      doctors = doctors.filter(doc =>
        doc.languages.some(lang => lang.toLowerCase() === language.toLowerCase())
      );
    }
    setFilteredDoctors(doctors);
  }, [allDoctors, searchTerm, location, language]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


// --- NEW: Functions to handle the modal ---
  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setBookingSuccess(false); // Reset success state
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleBookingSuccess = (appointment) => {
    console.log('Booking successful!', appointment);
    setBookingSuccess(true);
    setTimeout(() => {
        handleCloseModal();
    }, 3000); // Close modal after 3 seconds
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Find Your Doctor</h1>
          <p className="text-gray-600 mt-2">Search for top specialists near you.</p>
        </div>

        {/* Search and Filter Bar - We will make this functional later */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Search by name or specialty..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <input type="text" placeholder="Location..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Search</button>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map(doctor => (
              <DoctorCard key={doctor._id} doctor={doctor} onBookAppointment={() => handleOpenModal(doctor)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No doctors have registered yet.</p>
          </div>
        )}
      </div>
      {/* Render the modal conditionally */}
      {isModalOpen && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
      
      {/* Booking Success Notification */}
      {bookingSuccess && (
        <div className="fixed bottom-5 right-5 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg">
          Appointment booked successfully!
        </div>
      )}
    </div>
  );
};

export default FindDoctorPage;