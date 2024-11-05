// src/ComplianceRoute.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardContent from './DashboardContent'; // Ensure you have this component
import Regulations from './Regulations'; // Ensure you have this component
import Airlines from './Airlines';


const ComplianceRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardContent />} /> {/* Default dashboard page */}
      <Route path="/dashboard" element={<DashboardContent />} />
      <Route path="/airlines" element={<Airlines />} />
      <Route path="/regulations" element={<Regulations />} />
    </Routes>
  );
};

export default ComplianceRoute;
