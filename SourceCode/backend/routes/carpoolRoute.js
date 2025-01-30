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

// API endpoint to fetch carpool services matching the user's address
router.post('/request-service', (req, res) => {
  const { reserve_id, reservationData, userData } = req.body;

  // Check if date_of_flight exists and is a valid date
  const utcDate = new Date(reservationData.date_of_flight);
  
  if (isNaN(utcDate)) {
      return res.status(400).json({ error: 'Invalid date of flight' });
  }

  // Adjust the UTC date to the local timezone (Asia/Kolkata)
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(utcDate);

  // Extract parts and format as YYYY-MM-DD
  const formattedLocalDate = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;

  // SQL query to find carpool services that match the user's address (e.g., start or end location matches)
  const sql = `SELECT * FROM carpool c
      INNER JOIN reservation r ON c.reserve_id = r.reserve_id
      INNER JOIN passenger p ON r.passenger_id = p.passenger_id
      INNER JOIN flight_schedule fs ON fs.schedule_id = r.flight_schedule_id
      INNER JOIN airport a1 ON fs.depart_airport_id = a1.airport_id
      INNER JOIN airport a2 ON fs.depart_airport_id = a2.airport_id
      WHERE p.street LIKE CONCAT('%', ?, '%')
      AND p.city LIKE CONCAT('%', ?, '%')
      AND p.pincode LIKE CONCAT('%', ?, '%')
      AND c.status=1 and 
      fs.depart_airport_id = ? and fs.arrival_airport_id = ? 
      and fs.scheduled_departure_time = ?
      and r.date_of_flight = ?;`;

  connection.query(sql, [userData.street, userData.city, userData.pincode,
      reservationData.depart_airport_id, reservationData.arrival_airport_id, reservationData.scheduled_departure_time,
      formattedLocalDate
  ], (err, results) => {
      if (err) {
          console.error('Error fetching carpool details from the database:', err);
          return res.status(500).json({ error: 'Failed to fetch carpool details.' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No matching carpool services found.' });
      }

      res.status(200).send(results);
  });
});

  

// API endpoint to handle carpool service offering
router.post('/offer-service', (req, res) => {
  const {
    vehicleType,
    vehicleNumber,
    totalSeats,
    availableSeats,
    pickupLocation,
    arrivalTime, 
    reservationData
  } = req.body;

  // Validation
  if (!vehicleType || !vehicleNumber || !totalSeats || !availableSeats || !pickupLocation || !arrivalTime) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // SQL query to insert data into the carpool table
  const sql = `INSERT INTO carpool (reserve_id, user_id, vehicle_type, vehicle_num, airport_id, available_seats, total_seats, 
  pickup_loc, departure_time, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  const values = [reservationData.reserve_id, reservationData.passenger_id, vehicleType, vehicleNumber, reservationData.depart_airport_id,
    availableSeats, totalSeats, pickupLocation, arrivalTime];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ error: 'Failed to offer carpool service.' });
    }

    res.status(200).json({ message: 'Carpool service updated successfully. Appreciate your participation !', id: result });
  });
});

router.post("/crequest", async (req, res) => {
  const { reserve_id, reservationData, serviceDetails, userData } = req.body;
  const serviceId = serviceDetails.carpool_id;
  console.log(serviceDetails);

  // Find the service by ID
  if (!serviceId) {
    return res.status(404).json({ error: "Service not found" });
  }

  const insertQuery = `INSERT INTO carpoolreserve(carpool_id, user_id, reserve_id, accept_status) VALUES(?, ?, ?, 0);`;
  connection.query(insertQuery, [serviceId, reservationData.passenger_id, reserve_id], (err, insertResults) => {
    if(err) console.error("Error inserting the carpool reserve data", err);
  });
  try {
    // Send email to service provider
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "santhoshsantho024@gmail.com", // Replace with your email
        pass: "zpqm gcjg iucn fmhd",   // Replace with your email password or app password
      },
    });

    const verificationLink = `http://localhost:3001/api/carpool/verify-carpool?serviceId=${serviceId}&reserveId=${reserve_id}&email=${userData.passenger_email}`;

    const mailOptions = {
      from: "santhoshsantho024@gmail.com", // Replace with your email
      to: serviceDetails.email,
      subject: "Carpool Verification Request",
      html: `
        <p>Hello ${serviceDetails.name},</p>
        <p>A user has requested a carpool service from you. Please verify the request by clicking the button below:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Request</a>
        <p>Thank you for offering your carpool services!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Verification email sent to ${serviceDetails.email}`);

    return res.status(200).json({ message: "Verification email sent to service provider." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send verification email." });
  }
});


// Define the email transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "santhoshsantho024@gmail.com", // Replace with your email
    pass: "zpqm gcjg iucn fmhd", // Replace with your email password or app password
  },
});

router.get("/verify-carpool", (req, res) => {
  const { serviceId, reserveId, email } = req.query;

  // Update the database first
  const updateQuery = `UPDATE carpoolreserve SET accept_status = 1 WHERE carpool_id = ?;`;
  connection.query(updateQuery, [serviceId], (err, results) => {
    if (err) {
      console.error("Error in updating the acceptance status");
      return res.status(500).send({ status: 0, message: "Failed to verify the carpool service." });
    }

    // Generate email content
    const emailSubject = "Carpool Service Verified!";
    const emailBody = `
      <h2>Your Carpool Service is Verified</h2>
      <p>Service ID: <strong>${serviceId}</strong></p>
      <p>Reservation ID: <strong>${reserveId}</strong></p>
      <p>Thank you for choosing our service. You can now download your pass from your profile.</p>
    `;

    // Send the email
    transporter.sendMail(
      {
        from: '"Carpool Service" santhoshsantho024@gmail.com',
        to: email, // Recipient email
        subject: emailSubject,
        html: emailBody, // HTML email body
      },
      (mailErr, info) => {
        if (mailErr) {
          console.error("Error sending email:", mailErr);
          return res.status(500).send({ status: 0, message: "Carpool verified but failed to send email." });
        }

        console.log(`Email sent: ${info.response}`);
        
        // Log the verification action
        console.log(`Service ID: ${serviceId} verified for Reservation ID: ${reserveId}`);

        // Respond to the request
        return res.status(200).send({ status: 1, message: "Carpool verified and email sent." });
      }
    );
  });
});

router.get("/verify-status/:reserve_id", (req, res) => {
  const reserve_id = req.params.reserve_id;
  console.log(reserve_id);
  const selectQuery = `SELECT * from carpoolreserve where reserve_id = ?;`;
  connection.query(selectQuery, [reserve_id], (err, selectionResults) => {
    if(err) console.error("Error in checking the status", err);
    
    return res.status(200).send(selectionResults);
  });
});


// API to cancel the carpool request
router.post('/cancel-request', async (req, res) => {
  const { reserve_id, serviceId } = req.body;
  console.log(serviceId, reserve_id )
  const carpool_id = serviceId;

  if (!reserve_id || !carpool_id) {
    return res.status(400).json({ message: 'Missing reserve_id or carpool_id' });
  }

    // SQL query to delete the carpool request entry from the database
    const query = `
      DELETE FROM carpoolreserve
      WHERE reserve_id = ? AND carpool_id = ?;
    `;

    connection.query(query, [reserve_id, carpool_id], (err, results) => {
      if(err) console.error(err);
      res.status(200).json({ message: 'Carpool request canceled successfully' });
    });

});

const loadEmailTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent); // Compile the template
    return template(data); // Populate the template with dynamic data
};

const generateCarpoolPassPDF = async (carpoolData) => {
  const {
    passenger_name,
    passenger_email,
    driver_name,
    vehicleNumber,
    vehicleType,
    pickup_location,
    driver_contact,
    dropoff_location, 
    pickup_time,
    flight_number
  } = carpoolData;

  // Render the HTML template for carpool pass
  const htmlContent = loadEmailTemplate('carpoolPassTemplate', {
    passenger_name,
    passenger_email,
    driver_name,
    vehicleNumber,
    vehicleType,
    pickup_location,
    driver_contact,
    dropoff_location, 
    pickup_time,
    flight_number
  });

  // Generate the PDF
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
};

const sendEmailWithCarpoolPass = async (carpoolData) => {
  const {
    passenger_name,
    passenger_email,
    driver_name,
    vehicleNumber,
    vehicleType,
    pickup_location,
    driver_contact,
    dropoff_location, 
    pickup_time,
    flight_number
  } = carpoolData;

  // Generate the PDF with dynamic data
  const pdfBuffer = await generateCarpoolPassPDF(carpoolData);

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'santhoshsantho024@gmail.com',
          pass: 'zpqm gcjg iucn fmhd', // Use an app password here
      },
  });

  const mailOptions = {
      from: 'service@example.com',
      to: passenger_email,
      subject: 'Your Carpool Pass',
      text: `Hello ${passenger_name},

Attached is your carpool pass. Here are your reservation details:
- Pickup Location: ${pickup_location}
- Dropoff Location: ${dropoff_location}
- Pickup Time: ${pickup_time}
- Driver Contact: ${driver_contact}

Thank you for choosing our carpool service!`,
      attachments: [
          {
              filename: `carpool_pass_${passenger_name}.pdf`,
              content: pdfBuffer,
          },
      ],
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`Carpool pass email sent successfully to ${passenger_email}`);
  } catch (error) {
      console.error(`Failed to send carpool pass email to ${passenger_email}: ${error.message}`);
  }
};


router.post('/download-pass', async(req, res) => {
  const {      reservationData,
    carpoolRequestData,
    userData } = req.body;

    console.log("Reseravtrion : ", reservationData);
    console.log("cRD : ", carpoolRequestData);
    console.log("user : ", userData);
  const carpoolReservations = [
    {
        passenger_name: userData.passenger_name,  // Assuming userData contains name
        passenger_email: userData.passenger_email,
        driver_name : carpoolRequestData[0].passenger_name,
        vehicleNumber: carpoolRequestData[0].vehicle_num,
        vehicleType: carpoolRequestData[0].vehicle_type,
        pickup_location: carpoolRequestData[0].pickup_loc,
        driver_contact: carpoolRequestData[0].passenger_contact,
        dropoff_location: reservationData[0].depart_airport_name,
        pickup_time: carpoolRequestData[0].departure_time,
        flight_number: reservationData[0].flight_number // If applicable
    },
];


  if (!Array.isArray(carpoolReservations)) {
      return res.status(400).json({
          message: 'Invalid input. Ensure carpoolReservations is provided and is an array.',
      });
  }

  try {
      const emailPromises = carpoolReservations.map((carpoolData) =>
          sendEmailWithCarpoolPass(carpoolData)
      );

      await Promise.all(emailPromises);

      res.status(200).json({ message: 'Carpool passes sent via email for all reservations.' });
  } catch (error) {
      console.error('Error in /send-carpool-pass route:', error);
      res.status(500).json({ message: 'Failed to send carpool passes via email.' });
  }
});
module.exports = router;