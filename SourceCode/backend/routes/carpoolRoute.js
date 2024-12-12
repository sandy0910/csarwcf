const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

router.post('/request-service', async (req, res) => {
    //Carpool search
});

// API endpoint to handle carpool service offering
router.post('/api/carpool/offer-service', (req, res) => {
  const {
    vehicleType,
    vehicleNumber,
    totalSeats,
    availableSeats,
    pickupLocation,
    arrivalTime, 
    reservationData
  } = req.body;

  // Validation
  if (!vehicleType || !vehicleNumber || !totalSeats || !availableSeats || !pickupLocation || !arrivalTime) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // SQL query to insert data into the carpool table
  const sql = `INSERT INTO carpool (reserve_id, vehicle_type, vehicle_num, airport_id, available_seats, total_seats, 
  pickup_loc, departure_time, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  const values = [reservationData.reserve_id, vehicleType, vehicleNumber, reservationData.depart_airport_id,
    availableSeats, totalSeats, pickupLocation, arrivalTime];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ error: 'Failed to offer carpool service.' });
    }

    res.status(200).json({ message: 'Carpool service offered successfully!', id: result.insertId });
  });
});

module.exports = router;