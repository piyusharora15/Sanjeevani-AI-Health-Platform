import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Sanjeevani</h4>
            <p className="text-gray-400">Your trusted digital health partner.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2"><Link to="/#features" className="hover:text-blue-400">Features</Link></li>
              <li className="mb-2"><Link to="/find-a-doctor" className="hover:text-blue-400">Find a Doctor</Link></li>
              <li className="mb-2"><Link to="/login" className="hover:text-blue-400">Login</Link></li>
              <li className="mb-2"><Link to="/signup" className="hover:text-blue-400">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul>
              <li className="mb-2"><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
              <li className="mb-2"><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
              <li className="mb-2"><Link to="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li className="mb-2"><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">Kolkata, West Bengal, India</p>
            <p className="text-gray-400">contact@sanjeevani.health</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2025 Sanjeevani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;