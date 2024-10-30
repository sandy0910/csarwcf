import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel'; 
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './css/Home.css';

function Home() {
  const [airports, setAirports] = useState([]);  // State to hold the airport list
  const [cabinClasses, setCabinClasses] = useState([]);  // State to hold cabin classes
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    travellers: '1',
    tripType: 'one-way',
    specialFare: 'regular',
    classID: '', // initially empty
  });

  const navigate = useNavigate();

  // Fetch airport data when component mounts
  useEffect(() => {
    // Fetch airports
    axios.get('http://localhost:3001/api/flights/fetch-airport')
      .then((response) => {
        setAirports(response.data);
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/api/flights/fetch-cabin-classes')
      .then((response) => {
        setCabinClasses(response.data); // Assuming response.data contains the cabin classes
      })
      .catch((error) => {
        console.error('Error fetching cabin classes:', error);
      });
  }, []);
  

  // Handle search inputs
  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchParams((prevParams) => {
      const updatedParams = {
        ...prevParams,
        [name]: value,
        [name]: name === 'classID' ? parseInt(value, 10) : value, 
      };

      // If trip type is not "round-trip", reset returnDate
      if (name === 'tripType' && value !== 'round-trip') {
        updatedParams.returnDate = '';
      }

      return updatedParams;
    });
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to the search results page with the search parameters
    navigate('/search-results', { state: { searchParams } });
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/airlines">Airlines</Link></li>
          <li><Link to="/scoreboard">Scoreboard</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Carousel Section */}
      <div className="carousel-container">
        <Carousel autoPlay infiniteLoop showThumbs={false}>
          <div>
            <img src="./chi1.jpg" alt="Flight 1" />
          </div>
          <div>
            <img src="./chi3.jpg" alt="Flight 2" />
          </div>
          <div>
            <img src="./chi2.jpg" alt="Flight 2" />
          </div>
          <div>
            <img src="./chi4.jpg" alt="Flight 2" />
          </div>
        </Carousel>

        {/* Search Bar Overlay */}
        <div className="search-bar-overlay">
          <form onSubmit={handleSearchSubmit}>

            <div className="trip-type">
              <input type="radio" name="tripType" value="one-way" onChange={handleSearchChange} checked={searchParams.tripType === 'one-way'} /> One Way
              <input type="radio" name="tripType" value="round-trip" onChange={handleSearchChange} checked={searchParams.tripType === 'round-trip'} /> Round Trip
              <input type="radio" name="tripType" value="multi-city" onChange={handleSearchChange} /> Multi City
            </div>

            <div className="input-group">
              <div>
                <span>From</span>
                <select
                  name="from"
                  value={searchParams.from}
                  onChange={handleSearchChange}
                  required
                >
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.airport_id} value={airport.airport_id}>
                      {airport.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span>To</span>
                <select
                  name="to"
                  value={searchParams.to}
                  onChange={handleSearchChange}
                  required
                >
                  <option value="">Select Arrival Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.airport_id} value={airport.airport_id}>
                      {airport.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <div>
                <span>Departure Date</span>
                <input
                  type="date"
                  name="departureDate"
                  value={searchParams.departureDate}
                  onChange={handleSearchChange}
                  required
                />
              </div>

              <div>
                <span>Return Date</span>
                <input
                  type="date"
                  name="returnDate"
                  value={searchParams.returnDate}
                  onChange={handleSearchChange}
                  disabled={searchParams.tripType !== 'round-trip'}
                />
              </div>
            </div>

            <div className="input-group">
              <div>
                <span>Travellers</span>
                <input
                  type="number"
                  name="travellers"
                  value={searchParams.travellers}
                  onChange={handleSearchChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div>
                <span>Class</span>
                <select
                  name="classID"
                  value={searchParams.classID}
                  onChange={handleSearchChange}
                >
                  <option value="">Select Cabin Class</option>
                  {cabinClasses.map((cabin) => (
                    <option key={cabin.class_id} value={cabin.class_id}>
                      {cabin.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
