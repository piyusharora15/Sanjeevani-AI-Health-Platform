import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  UserCircle,
  Bot,
  FileScan,
  Stethoscope,
  Shield,
} from "lucide-react";
import sanjeevaniLogo from "../../assets/images/sanjeevani-logo.png";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo, logout } = useAuth(); // Get user info and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  const publicNavLinks = [
    { to: "/find-a-doctor", label: "Find a Doctor" },
    { to: "/analyze", label: "Analyze Document" },
  ];

  const privateNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} className="mr-2" /> },
    { to: '/assistant', label: 'AI Assistant', icon: <Bot size={16} className="mr-2" /> },
    // This link will ONLY show if the user's role is 'patient'
    { to: '/find-a-doctor', label: 'Find a Doctor', icon: <Stethoscope size={16} className="mr-2" />, roles: ['patient'] },
    // This link will show for both patients and doctors
    { to: '/analyze', label: 'Analyze Document', icon: <FileScan size={16} className="mr-2" />, roles: ['patient', 'doctor'] },
  ];

  const navLinks = userInfo
    ? privateNavLinks.filter(link => 
        !link.roles || link.roles.includes(userInfo.role)
      )
    : publicNavLinks;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={sanjeevaniLogo} alt="Sanjeevani Logo" className="h-10" />
          <span className="text-2xl font-bold text-gray-800">Sanjeevani</span>
        </Link>

        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-300 flex items-center"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {userInfo ? (
            // If user is logged in, show name and logout button
            <div className="relative group">
              <button className="flex items-center font-medium text-gray-700">
                Hi, {userInfo.name.split(" ")[0]}
                <UserIcon size={20} className="ml-2" />
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-20 opacity-0 pointer-events-none transform scale-95 -translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:translate-y-0 transition-all duration-10000 ease-out">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-800">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userInfo.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard size={16} className="mr-3 text-gray-500" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle size={16} className="mr-3 text-gray-500" />
                    My Profile
                  </Link>
                </div>
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin/panel"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Shield size={16} className="mr-3 text-gray-500" />
                    Admin Panel
                  </Link>
                )}

                <div className="py-1 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // If user is not logged in, show Login and Sign Up
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-500 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-blue-500 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-blue-500 transition duration-300 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            {/* Divider for mobile menu */}
            {!userInfo && <div className="w-3/4 border-t my-2"></div>}
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-500 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-500 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
