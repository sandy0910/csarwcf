import React, { useState } from 'react';
import axios from 'axios';

function CO2Emissions() {
  const [emissionData, setEmissionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateEmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/emissions/update');
      setEmissionData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Failed to update emissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>CO₂ Emissions Dashboard</h1>
      <button onClick={updateEmissions} disabled={loading}>
        {loading ? 'Updating...' : 'Update Emissions'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {emissionData && (
        <div>
          <h2>Update Results:</h2>
          <ul>
            {emissionData.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CO2Emissions;
