import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './css/Carpool.css'; // Include CSS for styling

function Carpool() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reserveStatus, setReserveStatus] = useState({});
  const { reserve_id, reservationData } = location.state || {};

  // Handle Offer Service button click
  const handleOfferService = () => {
    navigate("/offer-service", { state: { reserve_id, reservationData } });
  };

  // Handle Request Service button click
  const handleRequestService = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/carpool/request-service",
        { reserve_id, reservationData },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setServiceDetails(response.data);

      const statusResponse = await axios.get(`http://localhost:3001/api/carpool/verify-status/${reserve_id}`);
      
      // Convert carpool_id to an integer and update the state
      const updatedStatus = statusResponse.data.map((status) => ({
        ...status,
        carpool_id: parseInt(status.carpool_id, 10), // Convert carpool_id to an integer
      }));

      setReserveStatus(updatedStatus);
    } catch (err) {
      setError("Failed to fetch carpool services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Carpool Request button click for a specific service
  const handleCarpoolRequest = async (serviceId) => {
    setLoading(true);
    setError(null);

    try {
      const selectedService = serviceDetails.find(
        (service) => service.carpool_id === serviceId
      );

      if (!selectedService) {
        throw new Error("Service not found.");
      }

      const response = await axios.post(
        `http://localhost:3001/api/carpool/crequest`,
        {
          reserve_id,
          reservationData,
          serviceDetails: selectedService,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(`Carpool request for service ${serviceId} response:`, response.data);

      // Update reserve status after successful request
      setReserveStatus((prevStatus) => ({
        ...prevStatus,
        [serviceId]: 0, // Assume 0 indicates "Requested"
      }));

      window.location.reload();
    } catch (err) {
      setError("Failed to request carpool service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel Carpool Request
  const handleCancelCarpoolRequest = async (serviceId) => {
    setLoading(true);
    setError(null);

    try {
      // Call the API to cancel the carpool request
      const response = await axios.post(
        `http://localhost:3001/api/carpool/cancel-request`,
        { reserve_id, serviceId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(`Carpool cancellation for service ${serviceId}:`, response.data);

      // Update reserveStatus to reflect cancellation
      setReserveStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus };
        delete updatedStatus[serviceId]; // Remove the canceled carpool from the status object
        return updatedStatus;
      });
      window.location.reload();
    } catch (err) {
      setError("Failed to cancel carpool request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to profile page
  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="carpool-container">
      <h1>Carpool Options</h1>
      <p>Do you have a car? Or want to request a car ride to the airport?</p>
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
          {serviceDetails.map((service, index) => {
            // Find the corresponding status for the current service's carpool_id
            const matchingStatus = reserveStatus.find(status => status.carpool_id === service.carpool_id);
            const currentStatus = matchingStatus ? matchingStatus.accept_status : null;

            return (
              <div key={index} className="service-item">
                <p><strong>Driver:</strong> {service.name}</p>
                <p><strong>Contact:</strong> {service.mobile}</p>
                <p><strong>PickUp Location:</strong> {service.pickup_loc}</p>
                <p><strong>To:</strong> {service.airport_name}</p>
                <p><strong>Time:</strong> {service.departure_time}</p>
                <button
                  className="request-carpool-btn"
                  onClick={() => handleCarpoolRequest(service.carpool_id)}
                  disabled={currentStatus === 0 || currentStatus === 1}
                >
                  {currentStatus === 0
                    ? "Requested"
                    : currentStatus === 1
                    ? "Accepted"
                    : "Request Carpooling"}
                </button>
                {/* Display Cancel button if the status is Requested or Accepted */}
                {(currentStatus === 0 || currentStatus === 1) && (
                  <button
                    className="cancel-carpool-btn"
                    onClick={() => handleCancelCarpoolRequest(service.carpool_id)}
                  >
                    Cancel
                  </button>
                )}
                <hr />
              </div>
            );
          })}
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
