// src/ComplianceRoute.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardContent from './DashboardContent'; // Ensure you have this component
import Regulations from './Regulations'; // Ensure you have this component
import Airlines from './Airlines';
import CarbonEstimation from './CarbonEstimation';
import Deviations from './Deviations';


const ComplianceRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardContent />} /> {/* Default dashboard page */}
      <Route path="/dashboard" element={<DashboardContent />} />
      <Route path="/airlines" element={<Airlines />} />
      <Route path="/regulations" element={<Regulations />} />
      <Route path="/estimation" element={<CarbonEstimation />} />
      <Route path='/deviations' element={<Deviations />} />
    </Routes>
  );
};

export default ComplianceRoute;
