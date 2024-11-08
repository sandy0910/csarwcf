import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ViewAirlines from './ViewAirlines';
import AddAirlines from './AddAirline';

const AdminPage = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* The Dashboard will render in the Layout component */}
          <Route index element={<Dashboard />} /> {/* Default to Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="airlines" element={<ViewAirlines />} />
          <Route path='airlines/add' element={<AddAirlines />} />
        </Route>
      </Routes>
  );
};

export default AdminPage;
