  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import axios from 'axios';
  import { Carousel } from 'react-responsive-carousel'; 
  import 'react-responsive-carousel/lib/styles/carousel.min.css';
  import './css/Home.css';

  function Home() {
    const [airports, setAirports] = useState([]);
    const [filteredFromAirports, setFilteredFromAirports] = useState([]);
    const [filteredToAirports, setFilteredToAirports] = useState([]);
    const [cabinClasses, setCabinClasses] = useState([]);
    const [searchParams, setSearchParams] = useState({
      from: '', // This will now hold airport_id
      to: '',
      departureDate: '',
      returnDate: '',
      travellers: '1',
      tripType: 'one-way',
      specialFare: 'regular',
      classID: '',
    });

    const navigate = useNavigate();
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
      // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('user'));
    console.log(userData);
    const isLoggedIn = userData !== null;

    useEffect(() => {
      axios.get('http://localhost:3001/api/flights/fetch-airport')
        .then((response) => {
          setAirports(response.data);
        })
        .catch((error) => {
          console.error('Error fetching airports:', error);
        });
    }, []);

    useEffect(() => {
      axios.get('  http://localhost:3001/api/flights/fetch-cabin-classes')
        .then((response) => {
          setCabinClasses(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cabin classes:', error);
        });
    }, []);

    const handleSearchChange = (e) => {
      const { name, value } = e.target;

      setSearchParams((prevParams) => {
        const updatedParams = {
          ...prevParams,
          [name]: name === 'classID' && value ? parseInt(value) : value, // Convert to integer
        };

        if (name === 'tripType' && value !== 'round-trip') {
          updatedParams.returnDate = '';
        }

        return updatedParams;
      });

      // Filter suggestions for "From" and "To" fields
      const filterAirports = (query) => airports.filter((airport) =>
        airport.airport_name.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.country.toLowerCase().includes(query.toLowerCase())
      );

      if (name === 'from') {
        setFilteredFromAirports(filterAirports(value));
      } else if (name === 'to') {
        setFilteredToAirports(filterAirports(value));
      }
    };

    const handleAirportSelect = (field, airport) => {
      // Set the airport_id instead of the airport_name
      setSearchParams((prevParams) => ({ ...prevParams, [field]: airport.airport_id }));
      setFilteredFromAirports([]);
      setFilteredToAirports([]);
    };

    const handleClickOutside = (event) => {
      if (
        fromInputRef.current && !fromInputRef.current.contains(event.target) &&
        toInputRef.current && !toInputRef.current.contains(event.target)
      ) {
        setFilteredFromAirports([]);
        setFilteredToAirports([]);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      navigate('/search-results', { state: { searchParams } });
    };

    return (
      <div className="home-container">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/airlines">Airlines</Link></li>
            <li><Link to="/scoreboard">Scoreboard</Link></li>
          </ul>
          <ul className='nav-links'>
          {!isLoggedIn && 
            <div className='login-btn'>
              <li><Link to="/login">Login</Link></li>
            </div>
          }
          {isLoggedIn && 
            <ul>
            <li>Welcome {userData.uname}</li>
            <li><Link to="/logout">Logout</Link></li>
            </ul>
          }
          </ul>
        </nav>


        <header className="header-banner">
          <Carousel autoPlay infiniteLoop showThumbs={false}>
            <div><img src="chi4.jpg" alt="Flight 1" /></div>
            <div><img src="chi2.jpg" alt="Flight 2" /></div>
            <div><img src="chi3.jpg" alt="Flight 3" /></div>
          </Carousel>
        </header>
        <div className="header-overlay">
          <h1>Find Your Next Adventure</h1>
          <p>Book flights, discover destinations, and explore new places.</p>
        </div>

        <div className="search-section">
          <div className='form-container'>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="trip-type">
                <label>
                  <input type="radio" name="tripType" value="one-way" onChange={handleSearchChange} checked={searchParams.tripType === 'one-way'} /> One Way
                </label>
                <label>
                  <input type="radio" name="tripType" value="round-trip" onChange={handleSearchChange} checked={searchParams.tripType === 'round-trip'} /> Round Trip
                </label>
                <label>
                  <input type="radio" name="tripType" value="multi-city" onChange={handleSearchChange} /> Multi City
                </label>
              </div>

              <div className="input-group" ref={fromInputRef}>
                <label>From</label>
                <input
                  type="text"
                  name="from"
                  value={searchParams.from} // This now holds airport_id
                  onChange={handleSearchChange}
                  placeholder="Search by airport, city, or country"
                  autoComplete="on"
                  required
                />
                {filteredFromAirports.length > 0 && (
                  <div className="suggestions">
                    {filteredFromAirports.map((airport) => (
                      <div
                        key={airport.airport_id}
                        onClick={() => handleAirportSelect('from', airport)} // Pass the entire airport object
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
                  value={searchParams.to} // This now holds airport_id
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
                        onClick={() => handleAirportSelect('to', airport)} // Pass the entire airport object
                        className="suggestion"
                      >
                        <strong>{airport.airport_name}</strong> - {airport.city}, {airport.country}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Departure Date</label>
                <input type="date" name="departureDate" value={searchParams.departureDate} onChange={handleSearchChange} required />
              </div>

              <div className="input-group">
                <label>Return Date</label>
                <input type="date" name="returnDate" value={searchParams.returnDate} onChange={handleSearchChange} disabled={searchParams.tripType !== 'round-trip'} />
              </div>

              <div className="input-group">
                <label>Travellers</label>
                <input type="number" name="travellers" value={searchParams.travellers} onChange={handleSearchChange} min="1" max="10" required />
              </div>

              <div className="input-group">
                <label>Class</label>
                <select name="classID" value={searchParams.classID} onChange={handleSearchChange}>
                  <option value="">Select Cabin Class</option>
                  {cabinClasses.map((cabin) => (
                    <option key={cabin.class_id} value={cabin.class_id}>{cabin.class_name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="search-button">Search</button>
            </form>
          </div>
        </div>

        <footer className="footer">
          <p>&copy; 2024 Flight Booking. All Rights Reserved.</p>
        </footer>
      </div>
    );
  }

  export default Home;
