import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './css/Deviations.css'

function Deviations() {
  const [deviationData, setDeviationData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasFetched = useRef(false); // Prevent duplicate fetches

  useEffect(() => {
    const fetchDeviationData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;

      try {
        console.log('Fetching deviation data...');
        const deviationData = await axios.get('http://localhost:3001/api/compliance-ar/deviationsData');
        console.log(deviationData.data.results);
        setDeviationData(deviationData.data.results);
      } catch (error) {
        console.error('Error fetching deviation data:', error);
        setErrorMessage('Unable to load deviation data. Please try again later.');
      }
    };

    fetchDeviationData();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div>
      <h2>Deviated Flights and Historical Records</h2>
      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : deviationData.length > 0 ? (
        deviationData.map((flight) => (
          // In your Deviations.jsx component
          <div key={flight.flight_id} className="flight-record">
            {flight.deviation_percentage !== undefined ? (
              <div className="deviation-item">
                <div className="flight-details">
                  <div className="flight-info">
                    <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                    <p><strong>Estimated Emission:</strong> {flight.estimated_emission} kg</p>
                    <p><strong>Actual Emission:</strong> {flight.actual_emission} kg</p>
                    <p><strong>Deviation (%):</strong> {flight.deviation_percentage.toFixed(2)}%</p>
                  </div>
                  <div className="flight-schedule">
                    <p><strong>Departure:</strong> {flight.depart_airport_id}</p>
                    <p><strong>Departure Time:</strong> {flight.scheduled_departure_time}</p>
                    <p><strong>Arrival:</strong> {flight.arrival_airport_id}</p>
                    <p><strong>Arrival Time:</strong> {flight.scheduled_arrival_time}</p>
                  </div>
                </div>
                <hr />
              </div>
            ) : (
              <p>No deviations found for this flight.</p>
            )}
          </div>

        ))
      ) : (
        <p>No deviated flights found.</p>
      )}
    </div>
  );
}

export default Deviations;