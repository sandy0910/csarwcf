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


router.get('/airDetails', (req, res) => {
    const query = 'SELECT airline_id, name, location, carbon_rating, TO_BASE64(logo) as LOGO FROM airline';
  
    // Execute the query to fetch airlines from the database
    connection.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
});

// Flight Search API
router.get('/flight-search', (req, res) => {
  const { from, to, classID } = req.query;

  // Prepare SQL query
  const sql = `
    SELECT * FROM cabinclass c, flight_schedule fs WHERE
     fs.depart_airport_id = ?
     AND fs.arrival_airport_id = ?
     AND c.class_id = ?
     AND fs.flight_id = c.flight_id
     AND fs.status = 1;
  `;

  // Execute SQL query
  connection.query(sql, [from, to, classID], (error, results) => {
    if (error) {
      console.error('Error fetching flights:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: 'No flights found for the selected criteria.' });
    }
  });
});

//Fetch Airport Details
router.get('/fetch-airport', (req, res) =>{
  const query = 'SELECT * from airport';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching flights:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: 'No destination found for the selected criteria.' });
    }
  });
});

//Fetch Cabin Class
router.get('/fetch-cabin-classes', (req, res) => {
  const query = 'SELECT * FROM flight_cabin';
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred' });
    }
    res.json(results);
  });
});

module.exports = router;
