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


// GET /api/airlines - Fetch all airlines
router.get('/', async (req, res) => {
    const query =   `SELECT * FROM AIRLINE;`;
    connection.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(result);
      });
});

module.exports = router;