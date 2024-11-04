// src/Regulations.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import './css/Regulations.css'; // Import the CSS file

const Regulations = () => {
  const [yseatFactors, setYseatFactors] = useState([]);
  const [loadFactors, setLoadFactors] = useState([]); // State for load factors

  useEffect(() => {
    // Fetch Yseat factors from the Express API using axios
    const fetchYseatFactors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/compliance-ys/yseat-factors');
        setYseatFactors(response.data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching Yseat factors:', error);
      }
    };

    // Fetch Load factors from the Express API using axios
    const fetchLoadFactors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/compliance-lf/load-factors'); // Update with your actual endpoint
        setLoadFactors(response.data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching Load factors:', error);
      }
    };

    fetchYseatFactors();
    fetchLoadFactors();
  }, []);

  return (
    <div className="regulations-container">
      <h2>Load Factors</h2>
      <p>
        Load factors are crucial metrics used to evaluate the efficiency of flight operations.
        They reflect the relationship between the number of passengers and cargo transported against
        the total capacity available. Below is the list of load factors categorized by flight details.
      </p>
      <table className="load-factors-table">
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Passenger Load Factor</th>
            <th>Cargo Factor</th>
          </tr>
        </thead>
        <tbody>
          {loadFactors.length > 0 ? (
            loadFactors.map((factor, index) => (
              <tr key={index}>
                <td>{factor.origin_city}</td>
                <td>{factor.destination_city}</td>
                <td>{factor.passenger_load_factor}</td>
                <td>{factor.cargo_load_factor}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading Load factors...</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Yseat Factors</h2>
      <p>
        Yseat factors are essential metrics used to assess the efficiency and performance of seating arrangements in aviation.
        These factors help airlines optimize cabin layouts and improve passenger experiences. Below is the list of Yseat factors
        categorized by cabin class.
      </p>
      <table className="yseat-factors-table">
        <thead>
          <tr>
            <th>Cabin Name</th>
            <th>Factor</th>
          </tr>
        </thead>
        <tbody>
          {yseatFactors.length > 0 ? (
            yseatFactors.map((factor, index) => (
              <tr key={index}>
                <td>{factor.class_name}</td>
                <td>{factor.factor}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Loading Yseat factors...</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Yseat Calculation Section */}
      <div className="calculation-container">
        <h3>Yseat Calculation</h3>
        <p>
          The total Yseat for each cabin class is calculated using the formula:
        </p>
        <pre>
          Total Yseat<sub>i</sub> = Seat<sub>i</sub> * Yseat factor<sub>i</sub>
        </pre>
        <p>To calculate the number of occupied Yseat, use the following formula:</p>
        <pre>
          Occupied Yseat<sub>i</sub> = Total Yseat<sub>i</sub> * Pax load factor
        </pre>
        <p>Total occupied Yseat is the sum of occupied Yseat across all classes:</p>
        <pre>
          Total occupied Yseat = Σ[Occupied Yseat<sub>i</sub>]
        </pre>
        <p>
          Here, the <strong>Pax load factor</strong> is calculated based on the ratio of the number of passengers transported 
          to the number of available seats in a given route group. This information is critical for airlines to allocate 
          CO2 emissions accurately between all cabin classes.
        </p>
      </div>

      {/* CO2 per Passenger Calculation Section */}
      <div className="calculation-container">
        <h3>CO2 per Passenger Calculation</h3>
        <p>
          The CO2 emissions allocated per passenger is calculated using the formula:
        </p>
        <pre>
          CO<sub>2</sub> per Pax<sub>i</sub> (kg) = 
          [Total fuel (kg) * Passenger to cargo load factor] / Total occupied Yseat
        </pre>
        <p>
          This metric represents the portion of emissions allocated to each passenger based on their cabin class, 
          providing insights into the environmental impact of air travel.
        </p>
      </div>
    </div>
  );
};

export default Regulations;
