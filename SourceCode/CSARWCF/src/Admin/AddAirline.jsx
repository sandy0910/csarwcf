import React, { useState } from 'react';
import axios from 'axios';
import SHA1 from 'crypto-js/sha1';
import { fireauth } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './css/AddAirline.css';

function AddAirline() {
  const [airlineData, setAirlineData] = useState({
    id: '',
    name: '',
    location: '',
    operatingStatus: '',
    fleetSize: '',
    logo: ''
  });
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form input changes for both user data and airline data
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in airlineData) {
      setAirlineData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle logo file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Extract base64 string without prefix
      setAirlineData((prevData) => ({
        ...prevData,
        logo: base64String, // Store base64 string in state
      }));
    };
  
    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user details
    if (!userData.username || !userData.email || !userData.password) {
      setError('Please fill in all user details.');
      return;
    }

    // Validate airline details
    if (!airlineData.id || !airlineData.name || !airlineData.location || !airlineData.operatingStatus || !airlineData.fleetSize || !airlineData.logo) {
      setError('Please fill in all airline details.');
      return;
    }

    // Hash the password before sending it
    const hashedPassword = SHA1(userData.password).toString(); // Hash the password using SHA-1

    // Replace the plain password with the hashed password
    const userDataWithHashedPassword = { ...userData, password: hashedPassword };

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        // First, send user data to Firebase for signup
        await createUserWithEmailAndPassword(fireauth, userData.email, userData.password);

        // After successful signup, send user data to the backend
        const loginResponse = await axios.post('http://localhost:3001/api/login-endpoint/signup-airline', userDataWithHashedPassword, {
        headers: {
            'Content-Type': 'application/json',
        },
        });

        console.log(loginResponse.status);
        // After successful login, send airline data
        const response = await axios.post('http://localhost:3001/api/admin-airlines/add-airline', airlineData, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        setSuccess(true);
        setAirlineData({
            id: '',
            name: '',
            location: '',
            operatingStatus: '',
            fleetSize: '',
            logo: '',
        });
        setUserData({
            username: '',
            email: '',
            password: ''
        });

        alert("User Created.");
    }catch (err) {
      setError('Error adding airline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add a New Airline</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Airline added successfully!</div>}

      <form onSubmit={handleSubmit}>
        <h3>User Details</h3>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <h3>Airline Details</h3>

        <div className="form-group">
          <label>Airline ID</label>
          <input
            type="text"
            name="id"
            value={airlineData.id}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Airline Name</label>
          <input
            type="text"
            name="name"
            value={airlineData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={airlineData.location}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Operating Status</label>
          <input
            type="number"
            name="operatingStatus"
            value={airlineData.operatingStatus}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Fleet Size</label>
          <input
            type="number"
            name="fleetSize"
            value={airlineData.fleetSize}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="input-file"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Airline'}
        </button>
      </form>
    </div>
  );
}

export default AddAirline;
