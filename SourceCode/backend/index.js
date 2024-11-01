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
const session = require('express-session');
const FileStore = require('session-file-store')(session);


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

const loginRoute = require('./routes/loginRoute');
app.use('/api/login-endpoint', loginRoute);

//Admin Side
const dashRoute = require('./routes/admin/dashRoute');
app.use('/api/dashboard-stats', dashRoute);

const airRoute = require('./routes/admin/airRoute');
app.use('/api/admin-airlines', airRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

