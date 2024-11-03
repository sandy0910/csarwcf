// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComplianceManager from './ComplianceManager';
import Dashboard from './Dashboard';

const ComplianceRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComplianceManager />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="compliance-reports" element={<ComplianceReports />} />
          <Route path="regulations" element={<Regulations />} />
          <Route path="audits" element={<Audits />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default ComplianceRoute;
