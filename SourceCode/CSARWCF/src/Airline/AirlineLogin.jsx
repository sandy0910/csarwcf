import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './css/AirlineLogin.css';
import SHA1 from 'crypto-js/sha1';

const AirlineLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch airlines from the database using axios
    axios.get('http://localhost:3001/api/airlines/airDetails') // replace with your actual API endpoint
      .then((response) => {
        setAirlines(response.data);
      })
      .catch((error) => console.error('Error fetching airlines:', error));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const hashedPassword = SHA1(password).toString();
      // Send login credentials to API
      const response = await axios.post('http://localhost:3001/api/login-endpoint/login', {
        email,
        password: hashedPassword,
        airlineId: selectedAirline.id
      });

      console.log(response.data);

      if (response.data) {
        sessionStorage.setItem('userSession', JSON.stringify(response.data));
        navigate('/airline/dashboard'); // Redirect to AirlineAdmin dashboard
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="login-page">
      <video className="background-video" autoPlay loop muted>
        <source src="view.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!selectedAirline ? (
        <div className="airline-selection">
          <h2>Select an Airline</h2>
          <div className="airline-grid">
            {airlines.map((airline) => (
              <div
                key={airline.id}
                className="airline-card"
                onClick={() => setSelectedAirline(airline)}
              >
                <img src={`data:image/jpeg;base64,${airline.LOGO}`} alt={`${airline.name} logo`} className="airline-logo" />
                <p>{airline.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <img src={`data:image/jpeg;base64,${selectedAirline.LOGO}`} alt={`${selectedAirline.name} logo`} className="selected-airline-logo" />
            <h2>{selectedAirline.name} Admin Login</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AirlineLogin;
