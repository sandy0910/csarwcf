import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'; // Import your Home component
import AirlinesPage from './AirlinesPage';
import FlightSearch from './FlightSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home page */}
        <Route path="/airlines" element={<AirlinesPage />} />  {/* AirlinesPage route */}
        <Route path="/search-results" element={<FlightSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
