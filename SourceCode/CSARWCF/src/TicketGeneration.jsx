import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import './css/TicketGeneration.css'; // Include CSS for styling

function TicketGeneration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reserve_id, searchParams, seatAllocation } = location.state; // Fetch reserve_id from state

  // State to hold reservation details
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservation data from the server
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        console.log("Fetching data for reserve_id:", reserve_id);
        const response = await axios.get(`http://localhost:3001/api/ticket-generation/reserve-details/${reserve_id}`);
        console.log(response.data);
        setReservationData(response.data[0]);
      } catch (err) {
        setError("Failed to load reservation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [reserve_id]);


  // Send ticket to email
  const sendTicketToEmail = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/ticket-generation/send-ticket",{
        reservationData,
        reserve_id, 
        searchParams,
        seatAllocation
      });

      alert("Ticket sent successfully!");
      navigate('/');
    } catch (err) {
      console.error("Error sending ticket:", err);
      alert("Failed to send ticket.");
    }
  };

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ticket-page">
      <h1 className="ticket-header">Your Flight Ticket</h1>

      {/* Printable Ticket Section */}
      <div className="ticket-container">
        <h2 className="ticket-title">Flight Ticket</h2>

        {/* Airline Logo */}
        <div className="airline-logo-container">
          <img
            src={`data:image/jpeg;base64,${reservationData.airline_logo}`}
            alt={`${reservationData.airline_name} Logo`}
            className="airline-logo"
          />
        </div>

        {/* Ticket Details */}
        <div className="ticket-details">
          <p><strong>Booking ID:</strong> {reserve_id}</p>
          <p><strong>Name:</strong> {reservationData.passenger_name}</p>
          <p><strong>Email:</strong> {reservationData.passenger_email}</p>
          <p><strong>Phone:</strong> {reservationData.passenger_mobile}</p>
          <hr />
          <p><strong>Flight:</strong> {reservationData.flight_number} ({reservationData.airline_name})</p>
          <p><strong>From:</strong> {reservationData.depart_airport_city}</p>
          <p><strong>To:</strong> {reservationData.arrival_airport_city}</p>
          <p><strong>Travel Date:</strong> {reservationData.departureDate}</p>
          <p><strong>Departure:</strong> {reservationData.scheduled_departure_time}</p>
          <p><strong>Arrival:</strong> {reservationData.scheduled_arrival_time}</p>
          <p><strong>Cabin Baggage:</strong> 7 Kgs</p>
          <p><strong>Check-in Baggage:</strong> 15 Kgs</p>
          <hr />
          <p><strong>Total Paid:</strong> ₹{reservationData.amount}</p>
        </div>
      </div>

      {/* Download Button */}
      <button className="download-btn" onClick={sendTicketToEmail} disabled={!reservationData}>
        Get the Ticket in your Mail
      </button>
    </div>
  );
}

export default TicketGeneration;