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

router.get('/load-factors', (req, res) => {
    const query = `SELECT 
    l.origin AS origin_id, 
    a1.city AS origin_city, 
    l.destination AS destination_id, 
    a2.city AS destination_city,
    passenger_load_factor, cargo_load_factor
    FROM 
        load_factors l
    JOIN 
        airport a1 ON l.origin = a1.airport_id
    JOIN 
        airport a2 ON l.destination = a2.airport_id;`;
    connection.query(query, (err, results) => {
        if (err) {
        return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send results back as JSON
    });
});

module.exports = router;