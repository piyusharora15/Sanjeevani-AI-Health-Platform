import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // Default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- Basic Client-Side Validation ---
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
    
    // --- Backend integration will happen here ---
    console.log('Form data submitted:', { name, email, password, role });

    // Simulate API call
    setTimeout(() => {
      console.log('Simulated signup successful');
      setIsLoading(false);
      // On successful signup, you would typically redirect to the login page or a profile setup page
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input name="name" type="text" required className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Full name" value={formData.name} onChange={handleInputChange} />
            </div>
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
            </div>
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input name="password" type="password" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            </div>
            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input name="confirmPassword" type="password" required className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
          </div>

          {/* Role Selector */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center p-3 w-1/2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="role" value="patient" checked={formData.role === 'patient'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <User className="w-5 h-5 ml-3 text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700">Patient</span>
              </label>
              <label className="flex items-center p-3 w-1/2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="role" value="doctor" checked={formData.role === 'doctor'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <Stethoscope className="w-5 h-5 ml-3 text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700">Doctor</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;