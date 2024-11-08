const express = require('express');
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


// GET /api/airline - Fetch all airlines
router.get('/', async (req, res) => {
    const query =   `SELECT * FROM AIRLINE;`;
    connection.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(result);
      });
});


// API route for adding a new airline
router.post('/add-airline', async (req, res) => {
  const { id, name, location, operatingStatus, fleetSize, logo } = req.body;

  // Debugging: Log the received logo
  // console.log('Received logo:', logo);

  try {
    // Convert the base64 logo to buffer
    if (!logo) {
      return res.status(400).json({ error: 'Logo is required and should be base64 encoded.' });
    }

    const photoBuffer = Buffer.from(logo, 'base64');

    // SQL query to insert new airline (or staff) into the database
    const query = `
      INSERT INTO airline (airline_id, name, location, operating_status, fleet, logo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [id, name, location, operatingStatus, fleetSize, photoBuffer], (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Airline added successfully!' });
    });
  } catch (err) {
    console.error('Error processing logo:', err);
    return res.status(500).json({ error: 'Error processing logo image.' });
  }
});


module.exports = router;