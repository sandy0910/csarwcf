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
    from: '',
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
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const isLoggedIn = userData !== null;

  useEffect(() => {
    axios.get('http://localhost:3001/api/flights/fetch-airport')
      .then((response) => setAirports(response.data))
      .catch((error) => console.error('Error fetching airports:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/api/flights/fetch-cabin-classes')
      .then((response) => setCabinClasses(response.data))
      .catch((error) => console.error('Error fetching cabin classes:', error));
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: name === 'classID' && value ? parseInt(value) : value,
      ...(name === 'tripType' && value !== 'round-trip' ? { returnDate: '' } : {}),
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
    setSearchParams((prevParams) => ({ ...prevParams, [field]: airport.airport_id }));
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/search-results', { state: { searchParams } });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Clear user data from session storage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/airlines">Airlines</Link></li>
          <li><Link to="/scoreboard">Scoreboard</Link></li>
        </ul>
        <ul className="nav-links">
          {!isLoggedIn ? (
            <li><Link to="/login">Login</Link></li>
          ) : (
            <ul>
              <li>Welcome {userData.uname}</li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout} className="home-logout-button">Logout</button></li>
            </ul>
          )}
        </ul>
      </nav>

      <header className="header-banner">
        <Carousel autoPlay infiniteLoop showThumbs={false}>
          <div><img src="chi4.jpg" alt="Flight 1" /></div>
          <div><img src="chi2.jpg" alt="Flight 2" /></div>
          <div><img src="chi3.jpg" alt="Flight 3" /></div>
          <div><img src="chi1.jpg" alt="Flight 3" /></div>
        </Carousel>
      </header>

      <div className="relative p-5">
        {/* <!-- Overlay --> */}
        <div className="absolute inset-0 bg-[#212121fd] bg-opacity-70 z-0"></div>
        
        {/* <!-- Content --> */}
        <div className="relative z-10 text-[#dedcdc]">
          <h3 className="text-white mb-4 text-3xl font-semibold">Find Your Next Adventure</h3>
          <p className="text-lg">Book flights, discover destinations, and explore new places.</p>
        </div>
      </div>


      {/* Flight Search Section */}
      <div className="search-section">
        <div className="related-content">
          <h2>Discover the Best Flight Deals</h2>
          <p>Find the best prices on flights to popular destinations worldwide. Search and compare flights from top airlines to make your journey affordable and comfortable.</p>
          <div className="info-cards">
            <div className="info-card">
              <h3>Special Discounts</h3>
              <p>Get exclusive discounts on select destinations every month. Book early and save more!</p>
            </div>
            <div className="info-card">
              <h3>Travel Tips</h3>
              <p>Explore travel tips to make your journey smoother and more enjoyable. From packing hacks to airport guides.</p>
            </div>
            <div className="info-card">
              <h3>Popular Destinations</h3>
              <p>Check out our list of trending destinations and top-rated airlines.</p>
            </div>
          </div>
        </div>
          <div className='form-container'>
            <form onSubmit={handleSearchSubmit} className="h-search-form">
              <div className="h-trip-type">
                <label>
                  <input type="radio" name="tripType" value="one-way" onChange={handleSearchChange} checked={searchParams.tripType === 'one-way'} /> One Way
                </label>
                {/* <label>
                  <input type="radio" name="tripType" value="round-trip" onChange={handleSearchChange} checked={searchParams.tripType === 'round-trip'} /> Round Trip
                </label> */}  
              </div>

              <div className="h-input-group" ref={fromInputRef}>
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
                  <div className="h-suggestions">
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

              <div className="h-input-group" ref={toInputRef}>
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
                  <div className="h-suggestions">
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

              <div className="h-input-group">
                <label>Departure Date</label>
                <input type="date" name="departureDate" value={searchParams.departureDate} onChange={handleSearchChange} required />
              </div>

              <div className="h-input-group">
                <label>Return Date</label>
                <input type="date" name="returnDate" value={searchParams.returnDate} onChange={handleSearchChange} disabled={searchParams.tripType !== 'round-trip'} />
              </div>

              <div className="h-input-group">
                <label>Travellers</label>
                <input type="number" name="travellers" value={searchParams.travellers} onChange={handleSearchChange} min="1" max="10" required />
              </div>

              <div className="h-input-group">
                <label>Class</label>
                <select name="classID" value={searchParams.classID} onChange={handleSearchChange}>
                  <option value="">Select Cabin Class</option>
                  {cabinClasses.map((cabin) => (
                    <option key={cabin.class_id} value={cabin.class_id}>{cabin.class_name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="h-search-button">Search</button>
            </form>
          </div>
        </div>

      {/* New Content Sections */}
      <section className="features">
        <div className="feature-card">
          <img src="feature1.jpg" alt="Affordable Prices" />
          <h3>Affordable Prices</h3>
          <p>Discover the best deals on flights around the world. Affordable options for every budget.</p>
        </div>
        <div className="feature-card">
          <img src="feature2.jpg" alt="Wide Coverage" />
          <h3>Wide Coverage</h3>
          <p>Book flights to over 500 destinations worldwide with top airlines.</p>
        </div>
        <div className="feature-card">
          <img src="feature3.jpg" alt="Easy Booking" />
          <h3>Easy Booking</h3>
          <p>Enjoy a seamless booking experience, from selecting flights to choosing your seat.</p>
        </div>
      </section>

      <section className="h-popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="h-destination-gallery">
          <div className="h-destination-item">
            <img src="destination1.jpg" alt="Paris" />
            <h4>Paris</h4>
            <Link to="/destination/paris">Explore Flights</Link>
          </div>
          <div className="h-destination-item">
            <img src="destination2.jpg" alt="New York" />
            <h4>New York</h4>
            <Link to="/destination/new-york">Explore Flights</Link>
          </div>
          <div className="h-destination-item">
            <img src="destination3.jpg" alt="Tokyo" />
            <h4>Tokyo</h4>
            <Link to="/destination/tokyo">Explore Flights</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Flight Booking. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
