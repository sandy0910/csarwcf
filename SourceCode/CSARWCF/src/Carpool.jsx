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
  const {reservation, userData } = location.state || {}
  console.log("Reservation" , reservation);
  // Handle Offer Service button click
  const handleOfferService = () => {
    navigate("/offer-service", { state: { reservationData: reservation } });
  };

  // Handle Request Service button click
  const handleRequestService = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/carpool/request-service",
        { reserve_id: reservation.reserve_id, 
          reservationData: reservation,
          userData
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
        // Check if response data is returned and update state
        if (response.data) {
          console.log(response.data);
          setServiceDetails(response.data);
        }

      const statusResponse = await axios.get(`http://localhost:3001/api/carpool/verify-status/${reservation.reserve_id}`);
      
      const updatedStatus = statusResponse.data.map((status) => ({
        ...status,
        carpool_id: parseInt(status.carpool_id, 10),
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
          reserve_id: reservation.reserve_id,
          reservationData: reservation,
          serviceDetails: selectedService,
          userData
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(`Carpool request for service ${serviceId} response:`, response.data);

      setReserveStatus((prevStatus) => ({
        ...prevStatus,
        [serviceId]: 0,
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
      const response = await axios.post(
        `http://localhost:3001/api/carpool/cancel-request`,
        { reserve_id: reservation.reserve_id, serviceId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(`Carpool cancellation for service ${serviceId}:`, response.data);

      setReserveStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus };
        delete updatedStatus[serviceId];
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

  // Handle Go to Home button click
  const handleGoToHome = () => {
    navigate("/"); // Navigate to the home page (assuming root route)
  };

  return (
    <div className="carpool-container">
      <aside className="carpool-sidebar">
        <button className="offer-btn" onClick={handleOfferService}>
          Offer Service
        </button>
        <button className="request-btn" onClick={handleRequestService}>
          Request Service
        </button>
        {/* Button to navigate to the Home page */}
        <button className="home-btn" onClick={handleGoToHome}>
          Go to Home
        </button>
      </aside>
      <main className="carpool-main">
        <h1>Carpool Services</h1>
        <p>Select a carpool option or offer your own service!</p>
        {loading && <div>Loading carpool details...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && serviceDetails.length > 0 && (
          <div className="service-details">
            {serviceDetails.map((service, index) => {
              const matchingStatus = reserveStatus.find(
                status => status.carpool_id === service.carpool_id
              );
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
      </main>
    </div>
  );
}

export default Carpool;
