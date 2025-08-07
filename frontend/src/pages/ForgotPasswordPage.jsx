import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { forgotPassword } from '../api/authApi';
import AuthLayout from '../components/auth/AuthLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const data = await forgotPassword({ email });
      setMessage(data.message + " Please check the developer console for the reset link.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email and we'll send you a link to reset your password.">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {message && <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">{message}</p>}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
          <input id="email-address" name="email" type="email" required className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">{isLoading ? 'Sending Link...' : 'Send Reset Link'}</button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;