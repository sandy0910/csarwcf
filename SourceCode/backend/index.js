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

//Login
const loginRoute = require('./routes/loginRoute');
app.use('/api/login-endpoint', loginRoute);

//Admin Side
const dashRoute = require('./routes/admin/dashRoute');
app.use('/api/dashboard-stats', dashRoute);

const airRoute = require('./routes/admin/airRoute');
app.use('/api/admin-airlines', airRoute);

//Airline Side
const airlineAdminRoute = require('./routes/airlines/airlineAdminRoute');
app.use('/api/airlines-admin', airlineAdminRoute);


//Compliance Managing
const yseatRoute = require('./routes/compliance/yseatRoute');
app.use('/api/compliance-ys', yseatRoute);

const lfRoute = require('./routes/compliance/lfRoute');
app.use('/api/compliance-lf', lfRoute);

const airlineRoute = require('./routes/compliance/airlineRoute');
app.use('/api/compliance-air', airlineRoute);

const estimateRoute = require('./routes/compliance/estimateRoute');
app.use('/api/compliance/', estimateRoute);

const deviationsRoute = require('./routes/compliance/deviationsRoute');
app.use('/api/compliance-ar/', deviationsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

