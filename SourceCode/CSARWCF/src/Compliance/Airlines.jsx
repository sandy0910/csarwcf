import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Airlines.css';
import { useNavigate } from 'react-router-dom';

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/compliance-air/airline-fetch');
        setAirlines(response.data);
      } catch (error) {
        console.error('Error fetching airlines:', error);
      }
    };
    fetchAirlines();
  }, []);

  useEffect(() => {
    const fetchFlights = async (airlineId) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/compliance-air/flights-fetch/${airlineId}`);
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    if (selectedAirline) {
      fetchFlights(selectedAirline.airline_id);
    }
  }, [selectedAirline]);

  const handleAirlineClick = (airline) => {
    setSelectedAirline(airline);
  };

  const handleCloseCard = () => {
    setSelectedAirline(null);
    setFlights([]);
  };

  const getCarbonRatingClass = (rating) => {
    if (rating <= 3) return 'carbon-rating-low';
    if (rating <= 6) return 'carbon-rating-medium';
    return 'carbon-rating-high';
  };

  const handleCalculatorRedirect = () => {
    navigate('/co2-calculator');
  };

  return (
    <div className="cm-airlines-container">
      <div className="cm-airlines-list">
        <h2>Airlines</h2>
        <ul>
          {airlines.length > 0 ? (
            airlines.map((airline, index) => (
              <li key={index} className="cm-airline-item" onClick={() => handleAirlineClick(airline)}>
                {airline.name}
              </li>
            ))
          ) : (
            <li>Loading airlines...</li>
          )}
        </ul>
      </div>

      {selectedAirline && (
        <div className="cm-airline-card">
          <button className="close-button" onClick={handleCloseCard}>Close</button>

          <div className="cm-airline-details-container">
            <div className="cm-airline-details">
              <div className="cm-airline-info">
                <h3>{selectedAirline.name}</h3>
                <p><strong>Code:</strong> {selectedAirline.airline_id}</p>
                <p><strong>Country:</strong> {selectedAirline.location}</p>
                <p><strong>Fleet Size:</strong> {selectedAirline.fleet}</p>

                <div className="carbon-rating-container">
                  <p><strong>Carbon Rating:</strong> {selectedAirline.carbon_rating}</p>
                  <div className="carbon-rating-bar">
                    <div
                      className={`carbon-rating-fill ${getCarbonRatingClass(selectedAirline.carbon_rating)}`}
                      style={{ width: `${(selectedAirline.carbon_rating / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="cm-airline-logo">
                {selectedAirline.LOGO && (
                  <img src={`data:image/jpeg;base64,${selectedAirline.LOGO}`} alt="LOGO" />
                )}
              </div>
            </div>
          </div>

          <h4>Flights</h4>
          <div className="flights-container">
            {flights.length > 0 ? (
              flights.map((flight, index) => (
                <div
                  key={index}
                  className={`flight-card ${flight.status === 1 ? 'operational' : ''}`}
                >
                  {/* Left side: flight details */}
                  <div className="flight-details">
                    <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                    <p><strong>Origin:</strong> {flight.origin_city}</p>
                    <p><strong>Destination:</strong> {flight.destination_city}</p>
                    <p><strong>Distance (km):</strong> {flight.gcd}</p>
                    <p><strong>Fuel Consumption:</strong> {flight.fuel_consumption} (kg)</p>
                    {flight.status === 1 && <p><strong>Status:</strong> Operational</p>}
                  </div>

                  {/* Right side: earth icon with tooltip */}
                  <div className="calculator-link" onClick={handleCalculatorRedirect}>
                    🌍
                    <span className="tooltip">CO₂ Emissions</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading flights...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Airlines;
