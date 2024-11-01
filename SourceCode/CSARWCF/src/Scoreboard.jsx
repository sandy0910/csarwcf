import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Scoreboard.css';

function Scoreboard() {
  const [scores, setScores] = useState([]);  // State to hold the list of flight scores
  const [error, setError] = useState(null);  // State to handle errors

  // Fetch carbon scores when component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/flights/carbon-scores')  // Replace with your API endpoint
      .then((response) => {
        setScores(response.data);  // Set the fetched scores
      })
      .catch((error) => {
        console.error('Error fetching scores:', error);
        setError('Failed to load carbon scores.');  // Handle errors
      });
  }, []);

  return (
    <div className="scoreboard-container">
      <h1>Flight Carbon Scoreboard</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Airline</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>CO2 Emission (kg)</th>
              <th>Carbon Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score.flight_id}>
                <td>{score.flight_number}</td>
                <td>{score.airline}</td>
                <td>{score.departure_city}</td>
                <td>{score.arrival_city}</td>
                <td>{score.co2_emission}</td>
                <td>{score.carbon_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Scoreboard;
