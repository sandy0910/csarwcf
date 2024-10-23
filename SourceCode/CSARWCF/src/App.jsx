import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'; // Import your Home component
import AirlinesPage from './AirlinesPage';
import FlightSearch from './FlightSearch';
import Scoreboard from './Scoreboard';
import Login from './Login';
import Signup from './Signup';
import AdminPage from './Admin/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home page */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/airlines" element={<AirlinesPage />} />  {/* AirlinesPage route */}
        <Route path="/search-results" element={<FlightSearch />} />
        <Route path='/scoreboard' element={<Scoreboard />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
