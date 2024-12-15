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


//Ticket Generation
router.get('/reserve-details/:reserve_id', async (req, res) => {
    const reserve_id = req.params.reserve_id;
    const reserveQuery = `SELECT 
        r.reserve_id, 
        r.passenger_id, 
        r.flight_id, 
        r.flight_schedule_id, 
        r.reserve_date,
        r.date_of_flight, 
        
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

// Load and compile the HTML template with Handlebars
const loadEmailTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent); // Compile the template
    return template(data); // Populate the template with dynamic data
};

// Function to generate PDF
const generateTicketPDF = async (reservationData) => {
    const {
        airline_name,
        passenger_name,
        flight_number,
        scheduled_departure_time,
        scheduled_arrival_time,
        depart_airport_name,
        depart_airport_city,
        arrival_airport_name,
        arrival_airport_city,
        amount,
        transaction_id,
    } = reservationData;

    // Render the HTML template
    const htmlContent = loadEmailTemplate('ticketTemplate', {
        user_name: passenger_name,
        flight_number: flight_number,
        departure: `${depart_airport_name}, ${depart_airport_city}`,
        arrival: `${arrival_airport_name}, ${arrival_airport_city}`,
        departure_time: scheduled_departure_time,
        arrival_time: scheduled_arrival_time,
        amount: amount,
        transaction_id: transaction_id,
        airline_name: airline_name
    });

    // Generate the PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;
};


// Function to send the PDF as email attachment
const sendEmailWithPDF = async (reservationData, subject) => {
    const { 
        passenger_name, 
        passenger_email, 
        flight_number, 
        scheduled_departure_time, 
        scheduled_arrival_time, 
        depart_airport_name, 
        arrival_airport_name, 
        amount, 
        transaction_id, 
        reserve_date 
    } = reservationData;

    // Generate the PDF with dynamic data
    const pdfBuffer = await generateTicketPDF(reservationData);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'santhoshsantho024@gmail.com',
            pass: 'zpqm gcjg iucn fmhd', // Ensure you use a valid app password
        },
    });

    const mailOptions = {
        from: 'madeyours@example.com',
        to: passenger_email,
        subject: subject,
        text: `Hello ${passenger_name},

Attached is your flight ticket. Here are your reservation details:
- Flight Number: ${flight_number}
- Departure: ${depart_airport_name} at ${scheduled_departure_time}
- Arrival: ${arrival_airport_name} at ${scheduled_arrival_time}
- Transaction ID: ${transaction_id}
- Amount Paid: ₹${amount}
- Reservation Date: ${new Date(reserve_date).toLocaleString()}

Thank you for choosing our airline!`,
        attachments: [
            {
                filename: 'flight_ticket.pdf',
                content: pdfBuffer,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${passenger_email}`);
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
    }
};


// Route to send ticket PDF
router.post('/send-ticket', (req, res) => {
  const { reservationData, reserve_id } = req.body;
  sendEmailWithPDF(reservationData, 'Your Flight Ticket');

  res.json({ message: 'Ticket PDF sent via email.' });
});


module.exports = router;