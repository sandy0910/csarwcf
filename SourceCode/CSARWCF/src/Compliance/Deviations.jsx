import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Deviations() {
  const [deviationData, setDeviationData] = useState([]);
  
  useEffect(() => {
    const fetchDeviationData = async () => {
      try {
        // Requesting necessary parameters for the emissions update (you might want to modify this if needed)
        const paramResponse = await axios.post('http://localhost:3000/api/emissions/update');
        const params = paramResponse.data.details;  // This should be the parameters you need for comparison
        
        // Fetch the deviation data using the parameters
        const deviationResponse = await axios.post('http://localhost:3001/api/compliance-ar/comparisonEstimate', params);
        console.log(deviationResponse.data);
        
        // Store the fetched data
        setDeviationData(deviationResponse.data);
      } catch (error) {
        console.error('Error fetching deviation data:', error);
      }
    };

    fetchDeviationData();
  }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div>
      <h2>Deviated Flights and Historical Records</h2>
      {deviationData.length > 0 ? (
        deviationData.map((flight) => (
          <div key={flight.flight_id} className="flight-record">
            <h3>Flight ID: {flight.flight_id}</h3>
            {/* Check if there are deviation records for this flight */}
            {flight.deviations && flight.deviations.length > 0 ? (
              flight.deviations.map((record, index) => {
                const deviationPercent = Math.abs(
                  ((record.actual_emission - record.estimated_emission) / record.estimated_emission) * 100
                ).toFixed(2);  // Calculate the deviation percentage

                return (
                  <div key={index} className="deviation-item">
                    <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                    <p><strong>Estimated Emission:</strong> {record.estimated_emission} kg</p>
                    <p><strong>Actual Emission:</strong> {record.actual_emission} kg</p>
                    <p><strong>Deviation (%):</strong> {deviationPercent}%</p>
                    <p><strong>Score:</strong> {record.score}</p>
                    <hr />
                  </div>
                );
              })
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
