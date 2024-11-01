import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';

const AdminPage = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* The Dashboard will render in the Layout component */}
          <Route index element={<Dashboard />} /> {/* Default to Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
  );
};

export default AdminPage;
