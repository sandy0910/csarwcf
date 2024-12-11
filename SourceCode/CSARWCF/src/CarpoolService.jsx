import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './css/CarpoolService.css'; // Include CSS for styling

function CarpoolService() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    totalSeats: "",
    availableSeats: "",
    pickupLocation: "",
    arrivalTime: "",
  });

  const location = useLocation();
  const { reserve_id, reservationData } = location.state || {};
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post("http://localhost:3001/api/carpool/offer-service", formData);
      setSuccessMessage("Carpool service offered successfully!");
      setFormData({
        vehicleType: "",
        vehicleNumber: "",
        totalSeats: "",
        availableSeats: "",
        pickupLocation: "",
        arrivalTime: "",
      });
    } catch (err) {
      setErrorMessage("Failed to offer carpool service. Please try again.");
    }
  };

  console.log(reservationData);

  return (
    <div className="carpool-service-container">
      <h1>Offer a Carpool Service</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form className="carpool-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="airportId">Airport ID:</label>
              <input
                type="text"
                id="airportId"
                name="airportId"
                value={reservationData?.airport_id || ""}
                readOnly
              />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type:</label>
          <input
            type="text"
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            placeholder="e.g., Sedan, SUV"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number:</label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="e.g., ABC-1234"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalSeats">Total Seats:</label>
          <input
            type="number"
            id="totalSeats"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            placeholder="e.g., 4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="availableSeats">Available Seats:</label>
          <input
            type="number"
            id="availableSeats"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            placeholder="e.g., 3"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickupLocation">Pickup Location:</label>
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="e.g., City Center"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="arrivalTime">Arrival Time:</label>
          <input
            type="time"
            id="arrivalTime"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default CarpoolService;
