import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status

  // Check if user is already logged in from localStorage when app starts
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('sanjeevaniUserInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUserInfo(userData);
    localStorage.setItem('sanjeevaniUserInfo', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('sanjeevaniUserInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};