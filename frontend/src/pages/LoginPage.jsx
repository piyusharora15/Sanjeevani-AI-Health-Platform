import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authApi';
import { getMyProfile } from '../api/doctorApi';
import AuthLayout from '../components/auth/AuthLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    try {
      const userData = await loginUser(email, password);
      login(userData);
      if (userData.role === 'doctor') {
        // If the user is a doctor, check if they have a profile
        const profile = await getMyProfile(userData.token);
        if (profile) {
          // If profile exists, go to dashboard
          navigate('/dashboard');
        } else {
          // If profile does NOT exist (returns null), redirect to create it
          navigate('/doctor/profile');
        }
      } else {
        // If user is a patient, go to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to continue your health journey.">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
          <input id="email-address" name="email" type="email" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
          <input id="password" name="password" type="password" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</Link>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">{isLoading ? 'Signing in...' : 'Sign in'}</button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          No account yet?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;