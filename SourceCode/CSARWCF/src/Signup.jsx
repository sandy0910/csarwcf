import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Signup.css';
import SHA1 from 'crypto-js/sha1';
import { fireauth } from './Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dob: '',
    gender: '',
    doorNumber: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const {
      username,
      email,
      password,
      confirmPassword,
      name,
      dob,
      gender,
      doorNumber,
      street,
      city,
      postalCode,
      country,
      phoneNumber,
    } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Map gender to a single character
    const genderMap = {
      male: 'M',
      female: 'F',
      other: 'T',
    };
    const genderChar = genderMap[gender] || '';

    if (!genderChar) {
      setError('Invalid gender selected');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase
      await createUserWithEmailAndPassword(fireauth, email, password);

      // Hash the password
      const hashedPassword = SHA1(password).toString();

      // Send data to the server
      const response = await axios.post('http://localhost:3001/api/login-endpoint/signup', {
        username,
        email,
        password: hashedPassword,
        name,
        dob,
        gender: genderChar,
        address: {
          doorNumber,
          street,
          city,
          postalCode,
          country
        },
        phoneNumber,
      });

      if (response.data.success) {
        setSuccess('User signed up successfully');
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to sign up. Please try again.');
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
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="signup-input-group">
          <label htmlFor="doorNumber">Door Number:</label>
          <input
            type="text"
            id="doorNumber"
            value={formData.doorNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="postalCode">Postal Code:</label>
          <input
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="signup-error">{error}</div>}
        {success && <div className="signup-success">{success}</div>}
        <button type="submit" disabled={loading} className="signup-button">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
