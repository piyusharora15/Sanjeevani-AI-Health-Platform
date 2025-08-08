import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/authApi';
import AuthLayout from '../components/auth/AuthLayout';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- THIS LOGIC WAS MISSING ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, password, confirmPassword, role } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      const userData = await registerUser({ name, email, password, role });
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------

  return (
    <AuthLayout title="Create Your Account" subtitle="Join Sanjeevani today for better health management.">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
          <input name="name" type="text" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Full name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
          <input name="email" type="email" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
          <input name="password" type="password" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
          <input name="confirmPassword" type="password" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} />
        </div>
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center p-3 w-1/2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
              <input type="radio" name="role" value="patient" checked={formData.role === 'patient'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <User className="w-5 h-5 ml-3 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-700">Patient</span>
            </label>
            <label className="flex items-center p-3 w-1/2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
              <input type="radio" name="role" value="doctor" checked={formData.role === 'doctor'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <Stethoscope className="w-5 h-5 ml-3 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-700">Doctor</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;