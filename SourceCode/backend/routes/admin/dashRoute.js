const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const app = express();

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

router.use(express.json({ limit: '50mb' }));

router.get('/counts', (req, res) => {
    const query = `SELECT 
    (SELECT COUNT(*) FROM airline) AS totalAirlines,
    (SELECT COUNT(*) FROM flight) AS totalFlights,
    (SELECT COUNT(*) FROM user) AS totalUsers,
    (SELECT COUNT(*) FROM reservation) AS totalBookings;`;

     // Execute the query to fetch counts from the database
     connection.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(result);
      });
})




module.exports = router;