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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the EJS template
app.get('/boarding-pass', (req, res) => {
  const passengerDetails = {
    airline_name: 'Airline Name',
    passenger_name: 'John Doe',
    depart_airport_city: 'New York',
    arrival_airport_city: 'Los Angeles',
    travel_date: '2024-12-12',
    departure_time: '10:00 AM',
    flight_number: 'AA1234',
    seat: '12A',
    gate: 'G5',
    group: req.query.group || 'B', // Default to 'B' if group is not provided
    barcode_url: 'path_to_barcode_image'
  };

  res.render('boarding-pass', passengerDetails);
});



// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'csarwcf' // Change this to your actual database name
});

const query = util.promisify(connection.query).bind(connection);

const runComparisonLogic  = require('./routes/compliance/comparisonLogic');

runComparisonLogic();

setInterval(() => {
    console.log("Running scheduled comparison logic...");
    runComparisonLogic();
}, 60 * 60 * 1000);

const computeAndSaveScores  = require('./routes/scoringRoute');

computeAndSaveScores();

const guestRoute = require('./routes/guestRoute');
app.use('/api/airlines', guestRoute);
app.use('/api/flights', guestRoute);
app.use('/api/users/', guestRoute);

const paymentRoute = require('./routes/paymentRoute');
app.use('/api/razor-payments/', paymentRoute);

const ticketRoute = require('./routes/ticketRoute');
app.use('/api/ticket-generation', ticketRoute);

const carpoolRoute = require('./routes/carpoolRoute');
app.use('/api/carpool/', carpoolRoute);

const profileRoute = require('./routes/profileRoute');
app.use('/api/user-profile', profileRoute);

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

