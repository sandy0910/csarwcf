import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SHA1 from 'crypto-js/sha1'; // Import SHA1 for hashing
import './css/Login.css'; // Import your CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Hash the password using SHA-1
      const hashedPassword = SHA1(password).toString(); // Convert to string

      const response = await axios.post('http://localhost:3001/api/login-endpoint/login', {
        email,
        password: hashedPassword, // Send the hashed password
      });

      // Assuming your API responds with a success message and user data
      if (response.data.success) {
        // Save user data in local storage or context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/'); // Redirect to home page or dashboard
      } else {
        setError(response.data.message); // Display error message from the server
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLoginSubmit} className="login-form">
        <div className="login-input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="login-footer">
        <p>
          Don't have an account? 
          <a href="/signup" className="signup-link"> Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
