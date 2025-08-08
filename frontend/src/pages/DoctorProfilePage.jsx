import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createOrUpdateProfile } from '../api/doctorApi';
import { Plus, Trash2 } from 'lucide-react';

const DoctorProfilePage = () => {
  const { userInfo } = useAuth();
  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    consultationFee: '',
    location: '',
    bio: '',
    languages: '',
    qualifications: [{ degree: '', university: '', year: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualificationChange = (index, e) => {
    const { name, value } = e.target;
    const newQualifications = [...formData.qualifications];
    newQualifications[index][name] = value;
    setFormData(prev => ({ ...prev, qualifications: newQualifications }));
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', university: '', year: '' }],
    }));
  };

  const removeQualification = (index) => {
    const newQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, qualifications: newQualifications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      // Convert comma-separated languages string to an array
      const profileData = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()),
      };
      const data = await createOrUpdateProfile(profileData, userInfo.token);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Profile</h1>
        <p className="text-gray-500 mb-8">Keep your professional information up to date.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
              <input type="text" name="specialty" id="specialty" value={formData.specialty} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input type="number" name="experience" id="experience" value={formData.experience} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">Consultation Fee (INR)</label>
              <input type="number" name="consultationFee" id="consultationFee" value={formData.consultationFee} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Clinic/City Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages Spoken (comma-separated)</label>
            <input type="text" name="languages" id="languages" value={formData.languages} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., English, Hindi, Bengali" />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Short Bio</label>
            <textarea name="bio" id="bio" rows="3" value={formData.bio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Tell patients a little about yourself..."></textarea>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Qualifications</h3>
            {formData.qualifications.map((qual, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                <input type="text" name="degree" placeholder="Degree (e.g., MBBS)" value={qual.degree} onChange={e => handleQualificationChange(index, e)} required className="md:col-span-1 block w-full px-3 py-2 border-gray-300 rounded-md" />
                <input type="text" name="university" placeholder="University" value={qual.university} onChange={e => handleQualificationChange(index, e)} required className="md:col-span-2 block w-full px-3 py-2 border-gray-300 rounded-md" />
                <input type="number" name="year" placeholder="Year" value={qual.year} onChange={e => handleQualificationChange(index, e)} required className="block w-full px-3 py-2 border-gray-300 rounded-md" />
                {formData.qualifications.length > 1 && (
                  <button type="button" onClick={() => removeQualification(index)} className="md:col-span-4 text-red-500 hover:text-red-700 flex items-center justify-end text-sm">
                    <Trash2 size={16} className="mr-1" /> Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addQualification} className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              <Plus size={16} className="mr-1" /> Add Qualification
            </button>
          </div>

          {/* Messages and Submit Button */}
          <div className="pt-4">
            {message && <p className="text-blue-600 bg-blue-50 p-3 rounded-md mb-4">{message}</p>}
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfilePage;