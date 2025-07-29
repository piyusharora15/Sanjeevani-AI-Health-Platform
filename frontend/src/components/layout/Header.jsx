import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link instead of <a>
import { Menu, X } from 'lucide-react';
import sanjeevaniLogo from '../../assets/images/sanjeevani-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update navLinks to use "to" paths instead of "href"
  const navLinks = [
    { to: '/features', label: 'Features' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/find-a-doctor', label: 'Find a Doctor' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={sanjeevaniLogo} alt="Sanjeevani Logo" className="h-10" />
          
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-gray-600 hover:text-blue-500 transition duration-300">{link.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-400 transition duration-300">Login</Link>
          <Link to="/signup" className="bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition duration-300 shadow-sm">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-500 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-gray-600 hover:text-blue-500 transition duration-300" onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
            ))}
            <Link to="/login" className="text-gray-600 hover:text-blue-500 transition duration-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="bg-blue-400 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition duration-300 shadow-sm" onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;