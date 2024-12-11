const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

router.post('/request-service', async (req, res) => {
    //Carpool search
});

router.post('/offers', async (req, res) => {
    //Carpool search
});
module.exports = router;