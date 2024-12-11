const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit"); // For generating PDFs

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});


//Ticket Generation
router.get('/reserve-details/:reserve_id', async (req, res) => {
    const reserve_id = req.params.reserve_id;
    const reserveQuery = `SELECT 
        r.reserve_id, 
        r.passenger_id, 
        r.flight_id, 
        r.flight_schedule_id, 
        r.reserve_date, 
        
        pr.name AS passenger_name, 
        pr.gender AS passenger_gender, 
        pr.dob AS passenger_dob, 
        pr.email AS passenger_email, 
        pr.mobile AS passenger_mobile, 
        pr.house_no, 
        pr.street, 
        pr.city, 
        pr.pincode, 
        pr.country, 
        
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
        airline a
    WHERE 
        r.reserve_id = t.reserve_id AND
        p.reserve_id = r.reserve_id AND 
        pr.passenger_id = r.passenger_id AND 
        f.flight_id = r.flight_id AND
        fs.schedule_id = r.flight_schedule_id AND
        fs.depart_airport_id = a1.airport_id AND 
        fs.arrival_airport_id = a2.airport_id AND
        fs.airline_id = a.airline_id AND
        t.status = 1 AND r.status = 1 AND p.status AND fs.status = 1 AND
        r.reserve_id = ?`;

    connection.query(reserveQuery, [reserve_id], (err, reserveResults) => {
        if(err) console.error("Error in fetching the details for the ticket");
        res.status(200).send(reserveResults);
    });
});


router.post("/send-ticket", async (req, res) => {
  const {reservationData, reserve_id}  = req.body;
  console.log(reservationData);

  try {
    // Ensure tickets directory exists
    const ticketsDir = path.join(__dirname, "tickets");
    if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir);
    }

    // Generate the ticket
    const filePath = path.join(ticketsDir, `ticket_${reserve_id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(16).text("Flight Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${reserve_id}`);
    doc.text(`Name: ${reservationData.passenger_name}`);
    doc.text(`Email: ${reservationData.passenger_email}`);
    doc.text(`Phone: ${reservationData.passenger_mobile}`);
    doc.text(`Flight: ${reservationData.flight_number} (${reservationData.airline_name})`);
    doc.text(`From: ${reservationData.depart_airport_city}`);
    doc.text(`To: ${reservationData.arrival_airport_city}`);
    doc.text(`Travel Date: ${reservationData.departureDate}`);
    doc.text(`Departure: ${reservationData.scheduled_departure_time}`);
    doc.text(`Arrival: ${reservationData.scheduled_arrival_time}`);
    doc.text(`Cabin Baggage: 7 Kgs`);
    doc.text(`Check-in Baggage: 15 Kgs`);
    doc.text(`Total Paid: ₹${reservationData.totalAmount}`);
    doc.end();

    // Wait for the PDF to finish writing
    stream.on("finish", async () => {
      // Step 2: Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service
        host: 'smtp.gmail.com',
        port : 587,
        secure: false,
        auth: {
          user: "santhoshsantho024@gmail.com",
          pass: "zpqm gcjg iucn fmhd", // Use app-specific password or environment variables
        },
      });

      const mailOptions = {
        from: "santhoshsantho024@gmail.com",
        to: "ksantosh@ptuniv.edu.in",
        subject: "Your Flight Ticket",
        text: "Please find your flight ticket attached.",
        attachments: [{ filename: `ticket_${reserve_id}.pdf`, path: filePath }],
      };

      await transporter.sendMail(mailOptions);

      // Step 3: Cleanup
      fs.unlinkSync(filePath); // Delete the temporary file
      res.status(200).send({ message: "Ticket sent successfully!" });
    });
  } catch (error) {
    console.error("Error sending ticket:", error);
    res.status(500).send({ error: "Failed to send ticket" });
  }
});


module.exports = router;