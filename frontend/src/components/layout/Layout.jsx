import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    // We make the main container a flex column that takes up the full screen height.
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header />
      {/* The 'flex-grow' class tells this main section to expand and fill all available space, pushing the footer down. */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;