import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default CustomerLayout;