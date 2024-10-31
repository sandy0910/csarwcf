import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Signup.css';
import SHA1 from 'crypto-js/sha1';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Hash the password with SHA-1
      const hashedPassword = SHA1(password).toString();

      // Send signup data to the updated API endpoint
      const response = await axios.post(`http://localhost:3001/api/login-endpoint/signup`, {
        username,
        email,
        password: hashedPassword,
      });

      console.log(response.data);

      if (response.data.success) {
        alert("New user created Succuessfully");
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        setError(response.data.message); // Display error message from the server
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSignupSubmit} className="signup-form">
        <div className="signup-input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="signup-error">{error}</div>}
        <button type="submit" disabled={loading} className="signup-button">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="signup-footer">
        <p>
          Already have an account?
          <a href="/login" className="login-link"> Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
