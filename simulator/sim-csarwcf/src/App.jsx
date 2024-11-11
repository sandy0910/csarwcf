import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CO2Emissions from './CO2Emissions';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CO2Emissions />} /> {/* Route for Home page */}
      </Routes>
    </Router>
  );
}

export default App;
