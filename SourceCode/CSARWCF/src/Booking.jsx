import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './css/Booking.css'; // Include CSS for styling

function Booking() {
  const location = useLocation();
  const navigate = useNavigate(); // Make sure to add this for navigation
  const { flight, searchParams, totalFine, seatAllocation } = location.state;

  const [userDetails, setUserDetails] = useState(null);
  const [reservationData, setReservationData] = useState(null); // Corrected useState
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const userId = userData.uid;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePromoCodeApply = () => {
    // Add logic to handle promo code application
    alert('Promo code applied!');
  };

  useEffect(() => {
    // Fetch user details from an API or another source
    const fetchUserDetails = async () => {
      try {
        // Example API call (replace with your actual endpoint)
        const response = await axios.get(`http://localhost:3001/api/users/user-details?userId=${userId}`);
        // Set the user details
        setUserDetails(response.data);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]); // Ensure useEffect runs only when userId changes

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    const totalAmount = (flight.price_per_seat * searchParams.travellers) + 1258 + totalFine;

    const options = {
      key: "rzp_test_McwSUcwNGFPUuj",
      key_secret: "tMiEVgXMLywBs8e2EzN5cv0F",
      amount: totalAmount * 100,
      currency: "INR",
      name: "STARTUP PROJECTS",
      description: "For testing purpose",
      handler: async (paymentResponse) => {
        try {
          const paymentData = await axios.get(`http://localhost:3001/api/razor-payments/payments/${paymentResponse.razorpay_payment_id}`);
          const reservationResponse = await axios.post(`http://localhost:3001/api/razor-payments/reservation`, {
            flight,
            searchParams,
            paymentDetails: paymentData.data,
            userData
          });
          setReservationData(reservationResponse.data); // Corrected to handle reservation response
          const reserve_id = reservationResponse.data.reservation_id;
          const pay = await axios.post(`http://localhost:3001/api/razor-payments/payment-details?userId=${userId}&reserve_id=${reserve_id}`,paymentData);

          if(pay.status===200){
            //Update the reservation status and the seat availability
            const response = await axios.post(`http://localhost:3001/api/aircraft/updateStatus`,{
             seatAllocation, 
             reserve_id,
             userId
            });
            if(response.status === 200){
              navigate('/ticket-generation', { state: { reserve_id, searchParams, seatAllocation } });
            }
          }
        } catch (error) {
          console.error('Error sending payment details:', error);
        }
      },
      prefill: {
        name: userData.uname,
        email: userData.email
      },
      notes: {
        address: "RazorPay Corporate Office"
      },
      theme: {
        color: "#3399cc"
      }
    };

    var razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="booking-page">
      <h1 className="booking-header">Complete Your Booking</h1>

      <div className="flight-summary">
        <div className="flight-details">
          <h2>{searchParams.from} → {searchParams.to}</h2>
          <p>
            <strong>Flight:</strong> {flight.flight_number} ({flight.name})
          </p>
          <p><strong>Travel Date:</strong> {searchParams.departureDate}</p>
          <p><strong>Departure:</strong> {flight.scheduled_departure_time}</p>
          <p><strong>Arrival:</strong> {flight.scheduled_arrival_time}</p>
        </div>

        <div className="baggage-info">
          <p><strong>Cabin Baggage:</strong> 7 Kgs (1 piece only per adult)</p>
          <p><strong>Check-in Baggage:</strong> 15 Kgs (1 piece only per adult)</p>
        </div>
      </div>

      <div className="fare-summary">
        <h3>Fare Summary</h3>
        <div className="fare-item">
          <span>Base Fare:</span>
          <span>₹{flight.price_per_seat * searchParams.travellers}</span>
        </div>
        <div className="fare-item">
          <span>Taxes & Surcharges:</span>
          <span>₹1258</span>
        </div>
        <div className="fare-item">
          <span>Preference Charges:</span>
          <span>₹{totalFine}</span>
        </div>
        <hr />
        <div className="fare-total">
          <span>Total Amount:</span>
          <span>₹{flight.price_per_seat * searchParams.travellers + 1258 + totalFine}</span>
        </div>
      </div>

      <button className="proceed-btn" onClick={handleProceedToPayment}>
        Proceed to Payment
      </button>
    </div>
  );
}

export default Booking;
