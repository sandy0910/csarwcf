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
router.get("all-details/:userId", (req, res) => {
    const userId = req.params.userId;
  
    // Query the database for the user details by userId
    const query = "SELECT * FROM users WHERE id = ?";
    
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

module.exports = router;