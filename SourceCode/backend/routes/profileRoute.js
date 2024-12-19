const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit"); // For generating PDFs
const handlebars = require("handlebars");
const puppeteer = require('puppeteer');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

// Define the route to fetch user details
router.get("/user-details/:userId", (req, res) => {
    const {userId} = req.params;
  
    // Query the database for the user details by userId
    const query = `SELECT 
        pr.name AS passenger_name, 
        pr.gender AS passenger_gender, 
        pr.dob AS passenger_dob, 
        pr.email AS passenger_email, 
        pr.mobile AS passenger_mobile, 
        pr.house_no, 
        pr.street, 
        pr.city, 
        pr.pincode, 
        pr.country
    FROM  
        passenger pr, 
        user u
    WHERE 
    pr.passenger_id = u.user_id
    AND u.user_id = ?;`
    
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
  
      if (result.length === 0) {
        // If no user is found with the given ID
        return res.status(404).json({ message: "User not found" });
      }
  
      // Send the user details as response
      res.json(result[0]); // Return the first match (should only be one result)
    });
});

router.get("/reservation-details/:userId", (req, res) => {
  const {userId} = req.params;

  // Query the database for the user details by userId
  const query = `SELECT 
        r.reserve_id, 
        r.passenger_id, 
        r.flight_id, 
        r.flight_schedule_id, 
        r.reserve_date,
        r.date_of_flight,
        r.status as reserve_status,
        
        p.payment_method,
        p.amount, 
        p.pay_date, 
        p.transaction_id,
        p.user_id,
        p.payment_method,
        
        t.ticket_id,  
        t.status AS ticket_status, 
        
        f.flight_number,
        f.flight_id,

        fs.scheduled_departure_time, 
        fs.scheduled_arrival_time, 
        fs.depart_airport_id, 
        fs.arrival_airport_id, 
        fs.airline_id,
        fs.status,
        
        a1.airport_name AS depart_airport_name, 
        a1.city AS depart_airport_city, 
        a1.country AS depart_airport_country, 
        a1.geolocation AS depart_airport_geolocation, 
        
        a2.airport_name AS arrival_airport_name, 
        a2.city AS arrival_airport_city, 
        a2.country AS arrival_airport_country, 
        a2.geolocation AS arrival_airport_geolocation, 
        
        a.airline_id, 
        a.name AS airline_name, 
        TO_BASE64(a.logo) AS airline_logo
    FROM 
        reservation r, 
        passenger pr, 
        payment p, 
        ticket t, 
        flight f, 
        flight_schedule fs, 
        airport a1, 
        airport a2, 
        airline a,
        user u
    WHERE 
        r.reserve_id = t.reserve_id AND
        p.reserve_id = r.reserve_id AND 
        pr.passenger_id = r.passenger_id AND 
        u.user_id = pr.passenger_id AND
        f.flight_id = r.flight_id AND
        fs.schedule_id = r.flight_schedule_id AND
        fs.depart_airport_id = a1.airport_id AND 
        fs.arrival_airport_id = a2.airport_id AND
        fs.airline_id = a.airline_id AND
        u.user_id = ?`;
  
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      // If no user is found with the given ID
      return res.status(200).json({ message: "No Reservation not found" });
    }

    // Send the user details as response
    res.json(result); // Return the first match (should only be one result)
  });
});

router.get("/carpool-offer-details/:userId", (req, res) => {
  const {userId} = req.params;

  // Query the database for the user details by userId
  const query = `SELECT * 
  FROM  
      passenger pr, 
      user u, carpool c, carpoolreserve cr,
      reservation r, airport a
  WHERE 
  pr.passenger_id = u.user_id AND
  pr.passenger_id = r.passenger_id AND
  c.reserve_id = r.reserve_id AND 
  c.airport_id = a.airport_id
  AND u.user_id = ?;`
  
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      // If no user is found with the given ID
      return res.status(200).json({ message: "Carpooling Service not found" });
    }

    // Send the user details as response
    res.json(result); // Return the first match (should only be one result)
  });
});

router.get("/carpool-request-details/:userId", (req, res) => {
  const {userId} = req.params;

  // Query the database for the user details by userId
  const query = `SELECT c.carpool_id, c.user_id as driver_id,
        c.vehicle_type, c.vehicle_num, c.airport_id, c.available_seats, 
        c.total_seats, c.pickup_loc, 
        c.departure_time, cr.accept_status,
        p.name as passenger_name, p.mobile as passenger_contact, 
        c.status as carpool_status FROM
        user u, carpool c, carpoolreserve cr, passenger p
        where  c.carpool_id = cr.carpool_id
        and u.user_id = cr.user_id and 
        c.user_id = p.passenger_id and
        u.user_id = ?;`
  
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      return res.status(200).json({ 
        success: false, 
        message: `No carpool requests found for user ID ${userId}` 
      });
    }

    // Send the user details as response
    res.json(result); // Return the first match (should only be one result)
  });
});

module.exports = router;