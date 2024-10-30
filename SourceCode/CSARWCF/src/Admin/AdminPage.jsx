import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';

const AdminPage = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
  );
};

export default AdminPage;
