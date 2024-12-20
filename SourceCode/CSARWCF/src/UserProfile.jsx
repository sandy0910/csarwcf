import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import './css/UserProfile.css'; // Include CSS for styling

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [reservationData, setReservationData] = useState([]);
  const [carpoolOfferData, setCarpoolOfferData] = useState([]);
  const [carpoolRequestData, setCarpoolRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayContent, setOverlayContent] = useState(null);
  const isFetched = useRef(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const sessionUserData = JSON.parse(sessionStorage.getItem("user"));

    if (!sessionUserData) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    if (isFetched.current) return; // Prevent second call
    isFetched.current = true;

    const fetchUserData = async () => {
      try {
        const [userResponse, reservationResponse, carpoolOfferResponse, carpoolRequestResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/user-profile/user-details/${sessionUserData.uid}`),
          axios.get(`http://localhost:3001/api/user-profile/reservation-details/${sessionUserData.uid}`),
          axios.get(`http://localhost:3001/api/user-profile/carpool-offer-details/${sessionUserData.uid}`),
          axios.get(`http://localhost:3001/api/user-profile/carpool-request-details/${sessionUserData.uid}`)
        ]);

        setUserData(userResponse.data);
        setReservationData(reservationResponse.data);
        setCarpoolOfferData(carpoolOfferResponse.data || []);
        
        if (carpoolRequestResponse.data.success === false) {
          setCarpoolRequestData([]);
        } else {
          setCarpoolRequestData(carpoolRequestResponse.data);
        }

      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const openOverlay = (content) => {
    setOverlayContent(content);
  };

  const closeOverlay = () => {
    setOverlayContent(null);
  };

  const handleCarpoolAction = (actionType) => {
    openOverlay(
      <div>
        <h3>Select a Reservation</h3>
        {reservationData.length > 0 ? (
          reservationData.map((reservation, index) => (
            <div key={index} className="card" onClick={() => {
              navigate(`/carpool`, { state: { reservation, userData } });
            }}>
              <p><strong>Reservation ID:</strong> {reservation.reserve_id}</p>
              <p><strong>Flight:</strong> {reservation.flight_number}</p>
              <p><strong>Status:</strong> {reservation.reserve_status === 1 ? "Current" : reservation.reserve_status === 0 ? "Expired" : reservation.reserve_status === 2 ? "Cancelled" : "Unknown"}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No reservations available for carpooling.</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>

      {overlayContent && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-button" onClick={closeOverlay}>X</button>
            {overlayContent}
          </div>
        </div>
      )}

      {/* Carpool Action Buttons */}
      <div className="carpool-action-buttons">
        <button onClick={() => handleCarpoolAction("offer")}>Offer Carpool</button>
        <button onClick={() => handleCarpoolAction("request")}>Request Carpool</button>
      </div>

      {/* User Details Section */}
      <section className="user-details-section">
        <h2>Personal Details</h2>
        {userData && (
          <div className="user-info">
            <p><strong>Name:</strong> {userData.passenger_name}</p>
            <p><strong>Email:</strong> {userData.passenger_email}</p>
            <p><strong>Phone:</strong> {userData.passenger_mobile}</p>
            <p><strong>Address:</strong> {userData.house_no}, {userData.street}, {userData.city}, {userData.pincode}, {userData.country}</p>
          </div>
        )}
      </section>

      {/* Reservation Details Section */}
      <section className="reservation-details-section">
        <h2>Reservation Details</h2>
        {reservationData.length > 0 ? (
          reservationData.map((reservation, index) => (
            <div key={index} className="card">
              <p><strong>Flight:</strong> {reservation.flight_number}</p>
              <p><strong>Status:</strong> {reservation.reserve_status === 1 ? "Current" : reservation.reserve_status === 0 ? "Expired" : reservation.reserve_status === 2 ? "Cancelled" : "Unknown"}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No reservations found.</p>
          </div>
        )}
      </section>

      {/* Carpool Offer Details Section with Card and Overlay */}
      <section className="carpool-offer-details-section">
        <h2>Carpool Offers</h2>
        {carpoolOfferData.length > 0 ? (
          carpoolOfferData.map((offer, index) => (
            <div key={index} className="card" onClick={() => openOverlay(
              <div>
                <p><strong>Driver:</strong> {offer.name}</p>
                <p><strong>Pickup Location:</strong> {offer.pickup_loc}</p>
                <p><strong>Airport:</strong> {offer.airport_name}</p>
                <p><strong>Status:</strong> {offer.status}</p>
              </div>
            )}>
              <p><strong>Pickup Location:</strong> {offer.pickup_loc}</p>
              <p><strong>Status:</strong> {offer.status}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No carpool offers found.</p>
          </div>
        )}
      </section>

      {/* Carpool Request Details Section with Card and Overlay */}
      <section className="carpool-request-details-section">
        <h2>Carpool Requests</h2>
        {carpoolRequestData.length > 0 ? (
          carpoolRequestData.map((request, index) => (
            <div key={index} className="card" onClick={() => openOverlay(
              <div>
                <p><strong>Passenger:</strong> {request.passenger_name}</p>
                <p><strong>Pickup Location:</strong> {request.pickup_loc}</p>
                <p><strong>Dropoff Location:</strong> {request.airport_id}</p>
                <p><strong>Status:</strong> {request.accept_status === 1 ? "Accepted" : request.accept_status === 0 ? "Requested" : request.accept_status === 2 ? "Expired" : "Unknown"}</p>
              </div>
            )}>
              <p><strong>Passenger:</strong> {request.passenger_name}</p>
              <p><strong>Pickup Location:</strong> {request.pickup_loc}</p>
              <p><strong>Status:</strong> {request.accept_status === 1 ? "Accepted" : request.accept_status === 0 ? "Requested" : request.accept_status === 2 ? "Expired" : "Unknown"}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No carpool requests found.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserProfile;
