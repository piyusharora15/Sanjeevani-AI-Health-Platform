// src/pages/FindDoctorPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllDoctors } from '../api/doctorApi';
import DoctorCard from '../components/doctor/DoctorCard';
import BookingModal from '../components/doctor/BookingModal';
import { Search } from 'lucide-react';
import useDebounce from '../hooks/useDebounce'; // Assumes useDebounce.js is in src/hooks/

const FindDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

  // Debounce the text inputs to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedLocation = useDebounce(location, 500);

  // State for booking modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // useEffect to fetch doctors whenever a debounced filter changes
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const filters = {
          search: debouncedSearchTerm,
          location: debouncedLocation,
          language: language,
        };
        const data = await getAllDoctors(filters);
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [debouncedSearchTerm, debouncedLocation, language]); // Dependency array for server-side filtering

  // Handlers for the booking modal
  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleBookingSuccess = (appointment) => {
    setBookingSuccess(true);
    setTimeout(() => {
      handleCloseModal();
      setBookingSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Find Your Doctor</h1>
          <p className="text-gray-600 mt-2">Search for top specialists near you.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Name or Specialty</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                <input type="text" id="search" placeholder="e.g., Dr. Sharma or Cardiologist" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" id="location" placeholder="e.g., Kolkata" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select id="language" value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">Any</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <p className="text-center py-10">Searching for doctors...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Error: {error}</p>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map(doctor => (
              <DoctorCard key={doctor._id} doctor={doctor} onBookAppointment={() => handleOpenModal(doctor)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 font-semibold">No doctors found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
      {bookingSuccess && (
        <div className="fixed bottom-5 right-5 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg animate-slideInUp">
          Appointment booked successfully!
        </div>
      )}
    </div>
  );
};

export default FindDoctorPage;