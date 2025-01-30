import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [reservationData, setReservationData] = useState([]);
  const [carpoolOfferData, setCarpoolOfferData] = useState([]);
  const [carpoolRequestData, setCarpoolRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayContent, setOverlayContent] = useState(null);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUserData = JSON.parse(sessionStorage.getItem("user"));

    if (!sessionUserData) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    if (isFetched.current) return;
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

  const handleDownloadPass = async (serviceId) => {
    const response = await axios.post('http://localhost:3001/api/carpool/download-pass', { 
      reservationData,
      carpoolRequestData,
      userData
    });

    if(response.status === 200){
      alert("Your pass has been mailed to you");
      window.location.reload();
    }
  
  };  

  const handleCarpoolAction = (actionType) => {
    openOverlay(
      <div>
        <h3 className="text-lg font-bold mb-4">Select a Reservation</h3>
        {reservationData.length > 0 ? (
          reservationData.map((reservation, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-100" onClick={() => {
              navigate(`/carpool`, { state: { reservation, userData } });
            }}>
              <p className="text-sm font-medium"><strong>Reservation ID:</strong> {reservation.reserve_id}</p>
              <p className="text-sm"><strong>Flight:</strong> {reservation.flight_number}</p>
              <p className="text-sm"><strong>Status:</strong> {reservation.reserve_status === 1 ? "Current" : reservation.reserve_status === 0 ? "Expired" : reservation.reserve_status === 2 ? "Cancelled" : "Unknown"}</p>
            </div>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg p-4">
            <p>No reservations available for carpooling.</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-8">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-10xl mx-auto px-6 py-8 bg-gradient-to-r from-profile-blue to-profile-light">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">User Profile</h1>

      {overlayContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={closeOverlay}>X</button>
            {overlayContent}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Details Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Details</h2>
          {userData && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {userData.passenger_name}</p>
              <p><strong>Email:</strong> {userData.passenger_email}</p>
              <p><strong>Phone:</strong> {userData.passenger_mobile}</p>
              <p><strong>Address:</strong> {userData.house_no}, {userData.street}, {userData.city}, {userData.pincode}, {userData.country}</p>
            </div>
          )}
        </section>

        {/* Carpool Action Buttons */}
        <section className="bg-white shadow-lg rounded-lg p-6 text-center flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Carpool Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200" onClick={() => handleCarpoolAction("offer")}>Offer Carpool</button>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200" onClick={() => handleCarpoolAction("request")}  >Request Carpool</button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Reservation Details Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reservation Details</h2>
          {reservationData.length > 0 ? (
            reservationData.map((reservation, index) => (
              <div key={index} className="bg-gray-100 shadow rounded-lg p-4 mb-4">
                <p><strong>Flight:</strong> {reservation.flight_number}</p>
                <p><strong>Status:</strong> {reservation.reserve_status === 1 ? "Current" : reservation.reserve_status === 0 ? "Expired" : reservation.reserve_status === 2 ? "Cancelled" : "Unknown"}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-100 shadow rounded-lg p-4">
              <p>No reservations found.</p>
            </div>
          )}
        </section>

        {/* Carpool Offers Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Carpool Offers</h2>
          {carpoolOfferData.length > 0 ? (
            carpoolOfferData.map((offer, index) => (
              <div key={index} className="bg-gray-100 shadow rounded-lg p-4 mb-4 cursor-pointer" onClick={() => openOverlay(
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
            <div className="bg-gray-100 shadow rounded-lg p-4">
              <p>No carpool offers found.</p>
            </div>
          )}
        </section>

        {/* Carpool Requests Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Carpool Requests</h2>
          {carpoolRequestData.length > 0 ? (
            carpoolRequestData.map((request, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow rounded-lg p-4 mb-4 cursor-pointer"
                onClick={() => openOverlay(
                  <div>
                    <p><strong>Passenger:</strong> {request.passenger_name}</p>
                    <p><strong>Pickup Location:</strong> {request.pickup_loc}</p>
                    <p><strong>Dropoff Location:</strong> {request.airport_id}</p>
                    <p><strong>Status:</strong> {request.accept_status === 1 ? "Accepted" : request.accept_status === 0 ? "Requested" : request.accept_status === 2 ? "Expired" : "Unknown"}</p>
                  </div>
                )}
              >
                <p><strong>Passenger:</strong> {request.passenger_name}</p>
                <p><strong>Pickup Location:</strong> {request.pickup_loc}</p>
                <p><strong>Status:</strong> {request.accept_status === 1 ? "Accepted" : request.accept_status === 0 ? "Requested" : request.accept_status === 2 ? "Expired" : "Unknown"}</p>
                
                {/* Conditionally render the Download Pass button */}
                {request.accept_status === 1 && (
                  <button
                    onClick={() => handleDownloadPass(request.carpool_id)}
                    className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Download Pass
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-100 shadow rounded-lg p-4">
              <p>No carpool requests found.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default UserProfile;
