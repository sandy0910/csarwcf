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

router.get('/airline-fetch', (req, res) => {
    const query = ` SELECT airline_id, name, location, carbon_rating, TO_BASE64(logo) as LOGO FROM airline`;
    connection.query(query, (err, results) => {
        if (err) {
        return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send results back as JSON
    });
});

// API endpoint to fetch flights for a specific airline
router.get('/flights-fetch/:airlineId', (req, res) => {
    const airlineId = req.params.airlineId; // Get airline ID from request parameters
    const query = `SELECT f.depart_airport_id AS origin_id,
    a1.city AS origin_city, 
    f.arrival_airport_id AS destination_id, 
    a2.city AS destination_city,
    ff.airline_id, fi.fuel_consumption, fi.gcd, fi.aircraft_type,
    ff.flight_number, ff.flight_id, f.status
    FROM 
        flight_schedule f
    JOIN 
        airport a1 ON f.depart_airport_id = a1.airport_id
    JOIN 
        airport a2 ON f.arrival_airport_id = a2.airport_id
	JOIN 
		flight_icao fi ON fi.flight_schedule_id = f.schedule_id
    JOIN 
      flight ff ON f.flight_id = ff.flight_id
	WHERE ff.airline_id = ? ;`; 
  
    connection.query(query, [airlineId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

module.exports = router;