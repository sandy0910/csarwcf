import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} /> {/* Route for Home page */}
      </Routes>
  );
};

export default AdminPage;
