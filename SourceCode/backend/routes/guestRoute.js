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
    SELECT *, TO_BASE64(a.logo) as LOGO FROM cabinclass c, flight_cabin fc, flight_schedule fs, airline a, airport air1, airport air2, flight f WHERE
     fs.depart_airport_id = ?
     AND fs.arrival_airport_id = ?
     AND c.class_id = ?
     AND fs.flight_id = c.flight_id
     AND f.flight_id = fs.flight_id
     AND air1.airport_id = fs.depart_airport_id
     AND air2.airport_id = fs.arrival_airport_id
     AND fs.airline_id = a.airline_id
     AND fc.class_id = c.class_id
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
  const squery = 'SELECT * from airport';
  connection.query(squery, (error, results) => {
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

router.get('/user-details', async (req, res) => {
  const {userId} = req.query;
  const userQuery = `SELECT * from user u, passenger p where u.user_id = p.passenger_id AND u.user_id = ?`;
  connection.query(userQuery, [userId], (err, results) => {
    if(err) console.error("Error in fetching user detials");
    return res.send(results);
  });
});


router.post('/traveller-details', async (req, res) => {
  const { flight, travelers, uid } = req.body;
  if (!flight || !travelers || !uid) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    for (const traveler of travelers) {
      const { name, weight } = traveler;
      const query = `
        INSERT INTO travel_passengers (passenger_id, name, weight)
        VALUES ( ?, ?, ?);
      `;
      const values = [uid, name, weight];

      await connection.execute(query, values); // Execute each query sequentially
    }

    res.status(200).json({ message: "Traveler details saved successfully" });
  } catch (err) {
    console.error("Error inserting traveler details:", err);
    res.status(500).json({ message: "Failed to save traveler details", error: err.message });
  }
});

module.exports = router;
