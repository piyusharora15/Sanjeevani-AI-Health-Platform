import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile as getMyPatientProfile } from '../api/userApi';
import { getMyProfile as getMyDoctorProfile } from '../api/doctorApi';
import { User, Mail, Briefcase, Calendar, Star, Languages, IndianRupee, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (userInfo.role === 'doctor') {
          data = await getMyDoctorProfile(userInfo.token);
        } else {
          data = await getMyPatientProfile(userInfo.token);
        }
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo]);

  if (isLoading) return <p className="text-center py-10">Loading profile...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="text-center py-10">Could not load profile information.</p>;

  // Render Patient Profile
  const renderPatientProfile = () => (
    <>
      <div className="flex items-center space-x-2">
        <Mail size={18} className="text-gray-500" />
        <span className="text-gray-700">{profile.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar size={18} className="text-gray-500" />
        <span className="text-gray-700">Member since: {new Date(profile.createdAt).toLocaleDateString()}</span>
      </div>
    </>
  );

  // Render Doctor Profile
  const renderDoctorProfile = () => (
    <>
      <div className="flex items-center space-x-2">
        <Mail size={18} className="text-gray-500" />
        <span className="text-gray-700">{profile.user.email}</span>
      </div>
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
        <div className="space-y-3">
          <p className="flex items-center"><Briefcase size={16} className="mr-2 text-blue-600" /> Specialty: <strong>{profile.specialty}</strong></p>
          <p className="flex items-center"><Star size={16} className="mr-2 text-blue-600" /> Experience: <strong>{profile.experience} years</strong></p>
          <p className="flex items-center"><IndianRupee size={16} className="mr-2 text-blue-600" /> Fee: <strong>₹{profile.consultationFee}</strong></p>
          <p className="flex items-center"><MapPin size={16} className="mr-2 text-blue-600" /> Location: <strong>{profile.location}</strong></p>
          <p className="flex items-center"><Languages size={16} className="mr-2 text-blue-600" /> Languages: <strong>{profile.languages.join(', ')}</strong></p>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-6 mb-6">
            <img 
              className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-200"
              src={`https://placehold.co/150x150/E2E8F0/4A5568?text=${profile.name ? profile.name.charAt(0) : profile.user.name.charAt(0)}`}
              alt="Profile"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name || profile.user.name}</h1>
              <p className="text-blue-600 font-semibold capitalize flex items-center">
                <User size={16} className="mr-2" /> {profile.role}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {userInfo.role === 'patient' ? renderPatientProfile() : renderDoctorProfile()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;