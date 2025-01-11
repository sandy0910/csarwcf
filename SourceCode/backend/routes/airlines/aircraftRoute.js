const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// MySQL Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf',
};

// Middleware to parse JSON
router.use(express.json({ limit: '50mb' }));

// Get Seat Layout by Aircraft ID
router.get('/seats', async (req, res) => {
    // const aircraftId = req.params.id;

    try {
        // Establish a connection with the MySQL database
        const db = await mysql.createConnection(dbConfig);

        // Query to fetch the seat layout for the specified aircraft
        const [rows] = await db.execute(
            'SELECT seat_layout FROM aircrafts WHERE aircraft_id = 1;'
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aircraft not found' });
        }
        let seatLayout = rows[0].seat_layout;

        // Check if seat_layout is already a JSON object
        if (typeof seatLayout === 'string') {
            seatLayout = JSON.parse(seatLayout); // Parse JSON string
        }

        console.log('Seat Layout:', JSON.stringify(seatLayout, null, 2));
        res.json(seatLayout);

        // Close the database connection
        await db.end();
    } catch (error) {
        console.error('Error fetching seat layout:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
