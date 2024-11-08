// src/AirlineLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AirlineLogin.css';

const AirlineLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock authentication (replace with your real authentication logic)
    if (username === 'admin' && password === 'password') {
      sessionStorage.setItem('userSession', JSON.stringify({ username }));
      navigate('/airline'); // Navigate to AirlineAdmin
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <video className="background-video" autoPlay loop muted>
        <source src="view.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Airline Admin Login</h2>
          {error && <p className="error-message">{error}</p>}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
};

export default AirlineLogin;
