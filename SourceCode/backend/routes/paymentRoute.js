const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { connect } = require('http2');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

// Fetch payment details from Razorpay API
router.get('/payments/:paymentId', async (req, res) => {
const paymentId = req.params.paymentId;
    console.log(paymentId);
    try {
        const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        auth: {
            username: 'rzp_test_McwSUcwNGFPUuj',
            password: 'tMiEVgXMLywBs8e2EzN5cv0F'
        }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

//Inserting into the reservation database
router.post('/reservation', async(req, res) => {
  try {
    const {
      flight,
      searchParams,
      paymentDetails,
      userData
    } = req.body;

    // Extract relevant fields from the request
    const { flight_id, price_per_seat, schedule_id, class_id } = flight;
    const { departureDate, travellers } = searchParams;
    const { id, amount } = paymentDetails;
    const user_id = userData.uid;
    console.log(" User ID: ", user_id);

    const total_amount = price_per_seat * travellers + 1258; // Calculate total amount

    // Generate a unique reservation ID
    const reservation_id = uuidv4();

    // Insert reservation data into the database
    const query = `
      INSERT INTO reservation (reserve_id, passenger_id, flight_id, flight_schedule_id, cabin_class, date_of_flight, reserve_date, price, status)
      VALUES (?, ?, ?, ?, ?, ?, curdate(), ?, 1)
    `;

    // Execute the query
    connection.query(query, [reservation_id, user_id, flight_id, schedule_id, class_id, departureDate, total_amount], (err, results) => {
      if(err) console.error("Error in reservation data", err);
      res.status(200).json({
        message: 'Reservation created successfully!',
        reservation_id,
        total_amount,
      });
    })
  } catch (error) {
    console.error('Error while creating reservation:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

//Inserting fee payment details into database
router.post('/payment-details', async (req, res) => {
    const { userId, reserve_id } = req.query;
    const { id, amount, created_at, method } = req.body.data;
    const date = new Date(created_at * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const amt = amount/100;
  
      // Insert payment details into the payment table
      const insertQuery = 'INSERT INTO payment(transaction_id, reserve_id, amount, payment_method, pay_date, status, carpool_status, user_id) VALUES (?, ?, ?, ?, ?, 1, 0, ?)';
      connection.query(insertQuery, [id, reserve_id, amt, method, date, userId], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error inserting payment details:', insertError);
          res.status(500).send('Error inserting payment details');
        } else {
          console.log('Payment details inserted successfully');
          const ticketQuery = `INSERT INTO ticket(reserve_id, status) VALUES(?, 1);`;
          connection.query(ticketQuery, [reserve_id], (err) => {
            if(err) console.error("Error in updting ticket details", err);
            res.status(200).send('success');
          });
        }
      });
  
});

module.exports = router;