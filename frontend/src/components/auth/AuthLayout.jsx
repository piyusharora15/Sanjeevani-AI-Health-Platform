import React from 'react';
import { Link } from 'react-router-dom';
import authImage from '../../assets/images/auth-image.jpg'; // Make sure you have this image

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Form Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <Link to="/" className="font-bold text-xl text-gray-800">Sanjeevani</Link>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          {children}
        </div>
        {/* Right Side: Image Panel */}
        <div className="hidden md:block md:w-1/2">
          <img src={authImage} alt="Healthcare professionals" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;