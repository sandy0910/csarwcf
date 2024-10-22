const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;
const crypto=require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Middleware 
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'csarwcf' // Change this to your actual database name
});

const query = util.promisify(connection.query).bind(connection);

const guestRoute = require('./routes/guestRoute');
app.use('/api/airlines', guestRoute);
app.use('/api/flights', guestRoute);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

