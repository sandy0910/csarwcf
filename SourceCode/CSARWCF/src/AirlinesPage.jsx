import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AirlinesPage.css';

function AirlinesPage() {
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/airlines/airDetails');
        setAirlines(response.data);
      } catch (error) {
        console.error('Error fetching airlines:', error);
      }
    };

    fetchAirlines();
  }, []);

  return (
    <div className="airline-list">
      <h2>Airlines</h2>
      {airlines.length > 0 ? (
        <>
          {/* Title row */}
          <div className="airline-header">
            <span>Airline</span>
            <span>Location</span>
            <span>Carbon Rating</span>
            <span></span>
          </div>

          <ul>
            {airlines.map((airline) => (
              <li key={airline.airline_id}>
                <span className="airline-name">{airline.name}</span>
                <span>{airline.location}</span>
                <span>{airline.carbon_rating}</span>
                <div className="airline-logo">
                  {airline.LOGO && (
                    <img src={`data:image/jpeg;base64,${airline.LOGO}`} alt="LOGO" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No airlines available at the moment.</p>
      )}
    </div>
  );
}

export default AirlinesPage;
