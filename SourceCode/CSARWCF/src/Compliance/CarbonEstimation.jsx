import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './css/CarbonEstimation.css';

function CarbonEstimation({ externalParams }) {
  const [airports, setAirports] = useState([]);
  const [filteredFromAirports, setFilteredFromAirports] = useState([]);
  const [filteredToAirports, setFilteredToAirports] = useState([]);
  const [cabinClasses, setCabinClasses] = useState([]);
  const [result, setResult] = useState(null);

  // Use externalParams if provided; otherwise, default to internal state
  const [estimationParams, setEstimationParams] = useState({
    from: externalParams?.from || '',
    to: externalParams?.to || '',
    passengers: externalParams?.passengers || 1,
    classID: externalParams?.classID || '',
  });

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/flights/fetch-airport')
      .then((response) => setAirports(response.data))
      .catch((error) => console.error('Error fetching airports:', error));

    axios.get('http://localhost:3001/api/flights/fetch-cabin-classes')
      .then((response) => setCabinClasses(response.data))
      .catch((error) => console.error('Error fetching cabin classes:', error));
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setEstimationParams((prevParams) => ({
      ...prevParams,
      [name]: name === 'classID' && value ? parseInt(value) : value,
    }));

    const filterAirports = (query) =>
      airports.filter((airport) =>
        airport.airport_name.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.country.toLowerCase().includes(query.toLowerCase())
      );

    if (name === 'from') setFilteredFromAirports(filterAirports(value));
    if (name === 'to') setFilteredToAirports(filterAirports(value));
  };

  const handleAirportSelect = (field, airport) => {
    setEstimationParams((prevParams) => ({ ...prevParams, [field]: airport.airport_id }));
    setFilteredFromAirports([]);
    setFilteredToAirports([]);
  };

  const handleClickOutside = (event) => {
    if (!fromInputRef.current.contains(event.target) && !toInputRef.current.contains(event.target)) {
      setFilteredFromAirports([]);
      setFilteredToAirports([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEstimationSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/compliance/estimate-carbon', estimationParams)
      .then((response) => {
        setResult(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error('Error fetching estimation result:', error));
  };

  return (
    <div className="carbon-estimation-container">
      <h2>Estimate CO₂ Emissions for Your Flight</h2>
      <form onSubmit={handleEstimationSubmit} className="estimation-form">

        <div className="input-group" ref={fromInputRef}>
          <label>From</label>
          <input
            type="text"
            name="from"
            value={estimationParams.from}
            onChange={handleSearchChange}
            placeholder="Search by airport, city, or country"
            autoComplete="off"
            required
          />
          {filteredFromAirports.length > 0 && (
            <div className="suggestions">
              {filteredFromAirports.map((airport) => (
                <div
                  key={airport.airport_id}
                  onClick={() => handleAirportSelect('from', airport)}
                  className="suggestion"
                >
                  <strong>{airport.airport_name}</strong> - {airport.city}, {airport.country}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group" ref={toInputRef}>
          <label>To</label>
          <input
            type="text"
            name="to"
            value={estimationParams.to}
            onChange={handleSearchChange}
            placeholder="Search by airport, city, or country"
            autoComplete="off"
            required
          />
          {filteredToAirports.length > 0 && (
            <div className="suggestions">
              {filteredToAirports.map((airport) => (
                <div
                  key={airport.airport_id}
                  onClick={() => handleAirportSelect('to', airport)}
                  className="suggestion"
                >
                  <strong>{airport.airport_name}</strong> - {airport.city}, {airport.country}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Number of Passengers</label>
          <input
            type="number"
            name="passengers"
            value={estimationParams.passengers || ''}
            onChange={(e) =>
              setEstimationParams((prevParams) => ({
                ...prevParams,
                passengers: parseInt(e.target.value, 10) || 1,
              }))
            }
            min="1"
            placeholder="Enter number of passengers"
            required
          />
        </div>

        <div className="input-group">
          <label>Cabin Class</label>
          <select name="classID" value={estimationParams.classID} onChange={handleSearchChange}>
            <option value="">Select Cabin Class</option>
            {cabinClasses.map((cabin) => (
              <option key={cabin.class_id} value={cabin.class_id}>{cabin.class_name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="estimation-button">Estimate CO₂</button>
      </form>

      {result && result.length > 0 && (
        <div className="carbon-estimation-result">
          <h3>CO₂ Emission Estimation Results</h3>
          {result.map((item, index) => (
            <div key={index} className="result-card">
              <p><strong>From:</strong>{item.from}</p>
              <p><strong>To:</strong>{item.to}</p>
              <p><strong>Cabin Class:</strong> {item.cabinClass}</p>
              <p><strong>Passengers:</strong> {item.passengers}</p>
              <p><strong>Estimated CO₂ Emissions:</strong> {item.co2Estimate} kg</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default CarbonEstimation;
