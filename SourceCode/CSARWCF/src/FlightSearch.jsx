import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function FlightSearch() {
  const location = useLocation();
  const { searchParams } = location.state; // Access searchParams from the previous page
  const [flights, setFlights] = useState([]);

  // Simulate fetching flight data based on search parameters
  useEffect(() => {
    console.log('Searching flights with these parameters:', searchParams);
    axios
      .get('http://localhost:3001/api/flights/flight-search', { params: searchParams })
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error('Error fetching flights:', error);
      });
  }, [searchParams]);

  return (
    <div>
      <h2>Flight Search Results</h2>
      {flights.length > 0 ? (
        <ul>
          {flights.map((flight) => (
            <li key={flight.id}>
              <h3>{flight.name}</h3>
              <p>From: {flight.from}</p>
              <p>To: {flight.to}</p>
              <p>Date: {flight.date}</p>
              <p>Price: ${flight.price}</p>
              <button>Book Now</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights available for the selected criteria.</p>
      )}
    </div>
  );
}

export default FlightSearch;
