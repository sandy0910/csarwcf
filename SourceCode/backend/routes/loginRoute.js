const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const app = express();

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

router.use(express.json({ limit: '50mb' }));

// Function to generate a random alphanumeric string of specified length
const generateUserId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// User signup endpoint
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body; // Extract parameters from the request body

    try {
        // SQL query to check if the user already exists
        const checkUserQuery = 'SELECT * FROM user WHERE email = ? OR username = ?';
        const [results] = await connection.promise().query(checkUserQuery, [email, username]);

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists!' }); // User exists
        }

        let userId;
        let userIdExists = true;

        // Generate a unique user ID
        while (userIdExists) {
            userId = generateUserId(8);

            // SQL query to check if the generated user ID already exists
            const checkUserIdQuery = 'SELECT * FROM user WHERE user_id = ?';
            const [userIdResults] = await connection.promise().query(checkUserIdQuery, [userId]);

            // If the user ID exists, continue the loop to generate a new one
            userIdExists = userIdResults.length > 0;
        }

        // SQL query to insert the new user into the database
        const insertUserQuery = 'INSERT INTO user (user_id, username, email, password, role) VALUES (?, ?, ?, ?, 2)';
        
        // Execute the query to insert the new user
        await connection.promise().query(insertUserQuery, [userId, username, email, password]);

        res.status(201).json({ success: true, message: 'User created successfully!' }); // Send success response

    } catch (err) {
        return res.status(500).json({ error: err.message }); // Send error response
    }
});

//Airline Signup
router.post('/signup-airline', async (req, res) => {
  const { username, email, password } = req.body; // Extract parameters from the request body

  try {
      // SQL query to check if the user already exists
      const checkUserQuery = 'SELECT * FROM user WHERE email = ? OR username = ? AND role = 1';
      const [results] = await connection.promise().query(checkUserQuery, [email, username]);

      if (results.length > 0) {
          return res.status(409).json({ success: false, message: 'User already exists!' }); // User exists
      }

      let userId;
      let userIdExists = true;

      // Generate a unique user ID
      while (userIdExists) {
          userId = generateUserId(8);

          // SQL query to check if the generated user ID already exists
          const checkUserIdQuery = 'SELECT * FROM user WHERE user_id = ?';
          const [userIdResults] = await connection.promise().query(checkUserIdQuery, [userId]);

          // If the user ID exists, continue the loop to generate a new one
          userIdExists = userIdResults.length > 0;
      }

      // SQL query to insert the new user into the database
      const insertUserQuery = 'INSERT INTO user (user_id, username, email, password, role) VALUES (?, ?, ?, ?, 1)';
      
      // Execute the query to insert the new user
      await connection.promise().query(insertUserQuery, [userId, username, email, password]);

      res.status(201).json({ success: true, message: 'User created successfully!' }); // Send success response

  } catch (err) {
      return res.status(500).json({ error: err.message }); // Send error response
  }
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const loginQuery = 'SELECT * FROM user WHERE email = ? AND password = ? and role = 2';
    
    connection.query(loginQuery, [email, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length > 0) {
        return res.json(results[0]);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    });
  });


// Airline Login route
router.post('/airline-vlogin', (req, res) => {
    const { email, password, airlineId } = req.body;
  
    const loginQuery = `SELECT * FROM user u, airline a WHERE u.email = ? AND u.password = ?
    AND u.username = a.name AND a.airline_id = ?`;
    
    connection.query(loginQuery, [email, password, airlineId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length > 0) {
        return res.json(results[0]);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    });
  });
module.exports = router;
