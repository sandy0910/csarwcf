import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './css/CarbonEstimationResult.css';

function CarbonEstimationResult({ estimationParams }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (estimationParams.from && estimationParams.to && estimationParams.classID && estimationParams.passengers) {
      // Fetch estimation result based on parameters
      axios.post('http://localhost:3001/api/compliance/estimate-carbon', estimationParams)
        .then((response) => {
          setResult(response.data)
        console.log(result.data);
        })
        .catch((error) => console.error('Error fetching estimation result:', error));
    }
  }, [estimationParams]);

  return (
    <div className="carbon-estimation-result">
      <h3>CO₂ Emission Estimation Result</h3>
      {result ? (
        <div className="result-card">
          <p><strong>From:</strong> {result.from}</p>
          <p><strong>To:</strong> {result.to}</p>
          <p><strong>Cabin Class:</strong> {result.cabinClass}</p>
          <p><strong>Passengers:</strong> {result.passengers}</p>
          <p><strong>Estimated CO₂ Emissions:</strong> {result.co2Estimate} kg</p>
        </div>
      ) : (
        <p>Enter flight details to see CO₂ estimation.</p>
      )}
    </div>
  );
}

export default CarbonEstimationResult;
