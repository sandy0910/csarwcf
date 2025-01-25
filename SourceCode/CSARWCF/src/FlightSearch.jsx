import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/FlightSearch.css';

function FlightSearch() {
  const location = useLocation();
  const { searchParams } = location.state || {};
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams) {
      axios
        .get('http://localhost:3001/api/flights/flight-search', { params: searchParams })
        .then((response) => {
          setFlights(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching flights:', error);
          setError('Failed to fetch flight data.');
          setLoading(false);
        });
    }

    // Fetch airport data
    axios
      .get('http://localhost:3001/api/flights/fetch-airport')
      .then((response) => {
        setAirports(response.data);
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });
  }, [searchParams]);  // Depend on searchParams so it updates when the params change

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const finalHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${finalHours}:${String(minutes).padStart(2, '0')} ${amPm}`;
  };

  const getCityByAirportId = (id) => {
    const airport = airports.find((airport) => airport.airport_id === id);
    return airport ? airport.city : 'Unknown Airport';
  };

  const handleBookNow = (flight) => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData != null) {
      navigate('/passenger-weight', { state: { flight, searchParams } });
    } else {
      alert('Login before booking');
      // Pass the current location and searchParams to the login page
      navigate('/login', { state: { from: location, searchParams } });
    }
  };

  if (loading) {
    return <div className="flight-search__loading">Loading flights...</div>;
  }

  if (error) {
    return <div className="flight-search__error">{error}</div>;
  }

  return (
    <div className="flight-search__container">
      <h2 className="flight-search__title">Available Flights</h2>
      {flights.length > 0 ? (
        <div className="flight-search__list">
          {flights.map((flight, index) => (
            <div
              key={`${flight.id || index}-${flight.departure_dt || index}`}
              className="flight-search__list-item"
            >
              <div className="flight-search__list-item-header">
                <img
                  src={`data:image/jpeg;base64,${flight.LOGO}`} // Render the airline logo
                  alt="Airline Logo"
                  className="flight-search__logo"
                />
                <h3>{flight.flight_number}</h3>
                <p className="flight-search__price">₹{flight.price_per_seat}/seat</p>
              </div>
              <div className="flight-search__list-item-details">
                <div className="flight-search__details-row">
                  <p><strong>From:</strong> {getCityByAirportId(flight.depart_airport_id)}</p>
                  <p><strong>To:</strong> {getCityByAirportId(flight.arrival_airport_id)}</p>
                  <p><strong>Departure:</strong> {convertTo12HourFormat(flight.scheduled_departure_time)}</p>
                  <p><strong>Arrival:</strong> {convertTo12HourFormat(flight.scheduled_arrival_time)}</p>
                </div>
              </div>
              <div className="flight-search__list-item-cta">
                <button className="flight-search__book-btn" onClick={() => handleBookNow(flight)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="flight-search__no-results">No flights available for the selected criteria.</p>
      )}
    </div>
  );
}

export default FlightSearch;
