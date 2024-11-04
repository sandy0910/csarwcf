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

router.get('/yseat-factors', (req, res) => {
    const query = 'SELECT * FROM y_seat y, flight_cabin f where y.cabin_class_id = f.class_id;'
    connection.query(query, (err, results) => {
        if (err) {
        return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send results back as JSON
    });
});

module.exports = router;
