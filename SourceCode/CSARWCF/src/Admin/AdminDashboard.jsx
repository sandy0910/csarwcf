// AdminDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/AdminDashboard.css'; // Import the CSS file for styles

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close state
  };

  return (
    <div className="admin-dashboard">
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? 'Close' : 'Open'} Menu
          </button>
        </div>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/manage-flights">Manage Flights</Link></li>
          <li><Link to="/admin/manage-users">Manage Users</Link></li>
          {/* Add more admin links here */}
        </ul>
      </div>

      <div className={`content ${isOpen ? 'expanded' : ''}`}>
        <h1>Admin Dashboard</h1>
        {/* Add the content specific to each admin page here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
