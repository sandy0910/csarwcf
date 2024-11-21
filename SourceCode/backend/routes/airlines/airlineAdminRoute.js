const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql2');
const app = express();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

router.use(express.json({ limit: '50mb' }));
router.use(cors());


router.get('/flightData', (req, res) => {
  const airline = req.query.airline;

  // Validate that the airline parameter is provided
  if (!airline) {
    return res.status(400).json({ error: 'Airline parameter is required' });
  }

  // SQL query to fetch flights for the specified airline
  const query = `
    SELECT fs.flight_id, f.flight_number, fs.airline_id, fs.depart_airport_id, fs.arrival_airport_id, 
           fs.scheduled_departure_time, fs.scheduled_arrival_time, fs.capacity, fs.status
    FROM flight_schedule fs
    JOIN airline a ON fs.airline_id = a.airline_id
    JOIN user u ON u.username = a.name
    JOIN flight f ON fs.flight_id = f.flight_id
    WHERE u.username = ?;
  `;

  // Execute the query
  connection.query(query, [airline], (err, results) => {
    if (err) {
      console.error('Error fetching flights from the database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Filter out duplicate flight entries based on flight_id
    const uniqueFlights = [];
    const flightIds = new Set();

    results.forEach((flight) => {
      if (!flightIds.has(flight.flight_id)) {
        uniqueFlights.push(flight);
        flightIds.add(flight.flight_id); // Track flight_id to avoid duplicates
      }
    });

    // Check if unique flights are available for the airline
    if (uniqueFlights.length > 0) {
      res.status(200).json(uniqueFlights);
    } else {
      res.status(404).json({ message: `No flights available for airline: ${airline}` });
    }
  });
});

// Route to update flight details
router.put('/updateFlight', (req, res) => {
  const {
    flight_id,
    depart_airport_id,
    arrival_airport_id,
    scheduled_departure_time,
    scheduled_arrival_time,
  } = req.body;

  if (!flight_id) {
    return res.status(400).json({ error: 'Flight ID is required for updating flight details' });
  }

  const query = `
    UPDATE flight_schedule
    SET depart_airport_id = ?, arrival_airport_id = ?,
        scheduled_departure_time = ?, scheduled_arrival_time = ?
    WHERE flight_id = ?;
  `;

  const values = [
    depart_airport_id,
    arrival_airport_id,
    scheduled_departure_time,
    scheduled_arrival_time,
    flight_id
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating flight details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Flight details updated successfully' });
    } else {
      res.status(404).json({ error: 'Flight not found' });
    }
  });
});

// Route to delete a flight
router.delete('/deleteFlight', (req, res) => {
  const { flight_id } = req.body;

  if (!flight_id) {
    return res.status(400).json({ error: 'Flight ID is required for deletion' });
  }

  const query = `DELETE FROM flight_schedule WHERE flight_id = ?;`;

  connection.query(query, [flight_id], (err, result) => {
    if (err) {
      console.error('Error deleting flight:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Flight deleted successfully' });
    } else {
      res.status(404).json({ error: 'Flight not found' });
    }
  });
});


module.exports = router;