import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/UserProfile.css'; // Include CSS for styling

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user data from session storage
  useEffect(() => {
    const sessionUserData = JSON.parse(sessionStorage.getItem("user"));
    console.log(sessionUserData);

    if (!sessionUserData) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    // Fetch user profile data using the user ID from session storage
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user-profile/all-details/${sessionUserData.uid}`);
        setUserData(response.data);
        setFormData(response.data); // Set initial form data
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const sessionUserData = JSON.parse(sessionStorage.getItem("userData"));
    if (!sessionUserData) {
      setError("User is not logged in.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/user-profile/${sessionUserData.id}`, formData);
      setUserData(response.data);
      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      {success && <div className="success">{success}</div>}

      {!editing ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <p><strong>Address:</strong> {userData.address}</p>
          <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserProfile;
