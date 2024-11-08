// src/AirlineRoute.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import AirlineLogin from './AirlineLogin';

const AirlineRoute = () => {
  return (
      <Routes>
        <Route path="/" element={<DashboardContent />} /> {/* Default dashboard page */}
        <Route path="/dashboard" element={<DashboardContent />} />
        <Route path='/air-login' element={<AirlineLogin />} />
      </Routes>
  );
};

export default AirlineRoute;
