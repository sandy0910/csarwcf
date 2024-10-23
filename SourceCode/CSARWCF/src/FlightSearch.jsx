import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/FlightSearch.css'; // Add this for custom styles

function FlightSearch() {
  const location = useLocation();
  const { searchParams } = location.state; // Access searchParams from the previous page
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]); // State to hold the airport list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flight data based on search parameters
  useEffect(() => {
    console.log('Searching flights with these parameters:', searchParams);
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

    // Fetch airport data to map IDs to cities
    axios
      .get('http://localhost:3001/api/flights/fetch-airport')
      .then((response) => {
        setAirports(response.data); // Store the airport list
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });
  }, [searchParams]);

  // Function to get city name by airport ID
  const getCityByAirportId = (id) => {
    const airport = airports.find((airport) => airport.airport_id === id);
    return airport ? airport.city : 'Unknown Airport';
  };

  if (loading) {
    return <div className="flight-search__loading">Loading flights...</div>;
  }

  if (error) {
    return <div className="flight-search__error">{error}</div>;
  }

  return (
    <>
    <div className="flight-search__container">
      <h2 className="flight-search__title">Available Flights</h2>
      {flights.length > 0 ? (
        <div className="flight-search__results">
          {flights.map((flight) => (
            <div key={`${flight.id}-${flight.departure_dt}`} className="flight-card">
              <div className="flight-card__details">
                <div className="flight-card__header">
                  <h3>{flight.name}</h3>
                  <p className="flight-card__price">Price : ₹{flight.price}</p>
                </div>
                <div className="flight-card__info">
                  <div>
                    <p><strong>From:</strong> {getCityByAirportId(flight.depart_airport_id)}</p>
                    <p><strong>To:</strong> {getCityByAirportId(flight.arrival_airport_id)}</p>
                  </div>
                  <div>
                    <p><strong>Departure:</strong> {new Date(flight.departure_dt).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> {new Date(flight.arrival_dt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flight-card__cta">
                  <button className="flight-card__book-btn">Book Now</button>
                </div>
              </div>
            </div>
          ))}

        </div>
      ) : (
        <p className="flight-search__no-results">No flights available for the selected criteria.</p>
      )}
    </div>
    </>
  );
}

export default FlightSearch;
