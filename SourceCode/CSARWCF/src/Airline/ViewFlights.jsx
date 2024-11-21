  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import './css/ViewFlights.css';
  import { Buffer } from 'buffer'; // Import Buffer from 'buffer' package

  function ViewFlights() {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [airlineLogo, setAirlineLogo] = useState(null); // For the Base64 logo

    // Parse the airline data from sessionStorage
    const airlineData = sessionStorage.getItem('userSession');
    const airline = airlineData ? JSON.parse(airlineData) : null;

    useEffect(() => {
      if (airline) {
        axios.get(`http://localhost:3001/api/airlines-admin/flightData`, {
          params: { airline: airline.username }
        })
        .then((response) => setFlights(response.data))
        .catch((error) => console.error('Error fetching flights:', error));

        // Convert Buffer to Base64 for logo
        if (airline.logo?.data) {
          const base64Logo = Buffer.from(airline.logo.data).toString('base64');
          setAirlineLogo(`data:image/png;base64,${base64Logo}`);
        }
      }
    }, [airline]);

    const handleFlightClick = (flight) => {
      setSelectedFlight(flight);
      setIsEditing(false);
    };

    const closeOverlay = () => {
      setSelectedFlight(null);
    };

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleDeleteClick = () => {
      axios.delete(`http://localhost:3001/api/airlines-admin/deleteFlight`, {
        data: { flight_id: selectedFlight.flight_id }
      })
      .then(() => {
        setFlights(flights.filter(flight => flight.flight_id !== selectedFlight.flight_id));
        closeOverlay();
      })
      .catch((error) => console.error('Error deleting flight:', error));
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSelectedFlight({ ...selectedFlight, [name]: value });
    };

    const handleSaveClick = () => {
      axios.put(`http://localhost:3001/api/airlines-admin/updateFlight`, selectedFlight)
        .then(() => {
          setFlights(flights.map(flight =>
            flight.flight_id === selectedFlight.flight_id ? selectedFlight : flight
          ));
          setIsEditing(false);
        })
        .catch((error) => console.error('Error updating flight:', error));
    };

    return (
      <div className='aa-flight-container'>
        <h2>Flights for Airline: {airline ? airline.username : 'Unknown'}</h2>
        <div className="aa-flight-cards">
          {flights.length > 0 ? (
            flights.map((flight) => (
              <div className="aa-flight-card" key={flight.flight_id} onClick={() => handleFlightClick(flight)}>
                <strong>{flight.flight_number}</strong> 
              </div>
            ))
          ) : (
            <p>No flights available for this airline.</p>
          )}
        </div>

        {selectedFlight && (
          <div
            className="overlay"
            style={{ backgroundImage: `url(${airlineLogo})` }}
          >
            <div className="overlay-content">
              <button className="close-btn" onClick={closeOverlay}>X</button>
              <h3>Flight Details</h3>
              {isEditing ? (
                <div>
                  <label><strong>Flight Number:</strong>
                    <input
                      type="text"
                      name="flight_number"
                      value={selectedFlight.flight_number}
                      readOnly
                    />
                  </label>
                  <label><strong>Departure:</strong>
                    <input
                      type="text"
                      name="depart_airport_id"
                      value={selectedFlight.depart_airport_id}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label><strong>Arrival:</strong>
                    <input
                      type="text"
                      name="arrival_airport_id"
                      value={selectedFlight.arrival_airport_id}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label><strong>Departure Time:</strong>
                    <input
                      type="text"
                      name="scheduled_departure_time"
                      value={selectedFlight.scheduled_departure_time}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label><strong>Arrival Time:</strong>
                    <input
                      type="text"
                      name="scheduled_arrival_time"
                      value={selectedFlight.scheduled_arrival_time}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button className="save-btn" onClick={handleSaveClick}>Save</button>
                </div>
              ) : (
                <div>
                  <p><strong>Flight Number:</strong> {selectedFlight.flight_number}</p>
                  <p><strong>Departure:</strong> {selectedFlight.depart_airport_id}</p>
                  <p><strong>Arrival:</strong> {selectedFlight.arrival_airport_id}</p>
                  <p><strong>Departure Time:</strong> {selectedFlight.scheduled_departure_time}</p>
                  <p><strong>Arrival Time:</strong> {selectedFlight.scheduled_arrival_time}</p>
                  <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                  <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default ViewFlights;
