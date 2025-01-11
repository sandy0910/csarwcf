// src/AirlineRoute.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import AirlineLogin from './AirlineLogin';
import ViewFlights from './ViewFlights';
import AircraftConfig from './AircraftConfig';

const AirlineRoute = () => {
  return (
      <Routes>
        <Route path="/" element={<DashboardContent />} /> {/* Default dashboard page */}
        <Route path='/air-login' element={<AirlineLogin />} />
        <Route path='/view-flights' element={<ViewFlights />} />
        <Route path='/aircraft-config' element={<AircraftConfig />} />
      </Routes>
  );
};

export default AirlineRoute;
