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
  const { from, to, date } = req.query;

  // Prepare SQL query
  const sql = `
    SELECT * FROM flight
    WHERE from = ?, to = ?, DATE(departure_dt) = ?
  `;

  // Execute SQL query
  connection.query(sql, [from, to, date], (error, results) => {
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
  const query = 'SELECT city from airport';
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

module.exports = router;
