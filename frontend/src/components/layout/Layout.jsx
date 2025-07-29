import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      {/* The Outlet component will render the matched child route component (e.g., HomePage, LoginPage) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;