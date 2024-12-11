import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './css/Carpool.css'; // Include CSS for styling

function Carpool() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { reserve_id, reservationData } = location.state || {}; 

  // Handle Offer Service button click
  const handleOfferService = () => {
    navigate("/offer-service",  { state: { reserve_id, reservationData } });
  };

  // Handle Request Service button click
  const handleRequestService = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3001/api/carpool/request-service");
      setServiceDetails(response.data);
    } catch (err) {
      setError("Failed to fetch carpool details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to profile page
  const handleGoToProfile = () => {
    navigate("/profile");
  };

  console.log("Reservation Data:", reservationData);

  return (
    <div className="carpool-container">
      <h1>Carpool Options</h1>
      <p>Do you have a car? Or want to request for a car ride to the airport?</p>
      <div className="options">
        <button className="offer-btn" onClick={handleOfferService}>
          Offer Service
        </button>
        <button className="request-btn" onClick={handleRequestService}>
          Request Service
        </button>
      </div>

      {/* Display carpool details */}
      {loading && <div>Loading carpool details...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && serviceDetails.length > 0 && (
        <div className="service-details">
          <h2>Available Services</h2>
          <ul>
            {serviceDetails.map((service, index) => (
              <li key={index} className="service-item">
                <p><strong>Driver:</strong> {service.driver_name}</p>
                <p><strong>Contact:</strong> {service.driver_contact}</p>
                <p><strong>From:</strong> {service.start_location}</p>
                <p><strong>To:</strong> {service.end_location}</p>
                <p><strong>Time:</strong> {service.departure_time}</p>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Go to Profile Page */}
      <div className="profile-navigation">
        <button className="profile-btn" onClick={handleGoToProfile}>
          Not interested
        </button>
      </div>
    </div>
  );
}

export default Carpool;
