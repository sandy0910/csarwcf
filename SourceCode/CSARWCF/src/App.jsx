import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'; // Import your Home component
import AirlinesPage from './AirlinesPage';
import FlightSearch from './FlightSearch';
import Scoreboard from './Scoreboard';
import Login from './Login';
import Signup from './Signup';
import AdminPage from './Admin/AdminPage';
import ComplianceManager from './Compliance/ComplianceManager';
import AirlineAdmin from './Airline/AirlineAdmin';
import AirlineLogin from './Airline/AirlineLogin';
import Booking from './Booking';
import TicketGeneration from './TicketGeneration';
import Carpool from './Carpool';
import UserProfile from './UserProfile';
import CarpoolService from './CarpoolService';
import SeatSelection from './SeatSelection';
import PassengerWeight from './PassengerWeight';
import AllocationPage from './AllocationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home page */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/compliance/*" element={<ComplianceManager />} />
        <Route path="/airline/*" element={<AirlineAdmin />} />
        <Route path='/air-login' element={<AirlineLogin />} />
        <Route path="/airlines" element={<AirlinesPage />} />  {/* AirlinesPage route */}
        <Route path="/search-results" element={<FlightSearch />} />
        <Route path='/scoreboard' element={<Scoreboard />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/ticket-generation' element={<TicketGeneration />} />
        <Route path='/carpool' element={<Carpool />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/offer-service' element={<CarpoolService />} />
        <Route path='/seat-select' element={<SeatSelection />} />
        <Route path='/passenger-weight' element={<PassengerWeight />} />
        <Route path='/allocation-page' element={<AllocationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
