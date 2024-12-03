const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL client
const axios = require('axios');
const moment = require('moment');

const router = express.Router();

// MySQL Connection
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Helper to fetch actual emissions
function actualEmissions(flightID, emissionsData, flight_schedule_id) {
    const emissionRecord = emissionsData.find(record => record.flight_schedule_id === flight_schedule_id);
    if (!emissionRecord) {
        console.warn(`No actual emission data found for flight ID: ${flightID}`);
        return 0;
    }
    return emissionRecord.act_emission;
}

// Deviation Calculation Logic
function isDeviationSignificant(estimatedEmission, actual_emission, flightID, flight_schedule_id) {
    const lowerBound = 0.9;
    const normalBound = 1.0;
    const upperBound = 1.1;
    const deviationFactor = actual_emission / estimatedEmission;

    if (flightID === "FL001" && flight_schedule_id == 1) {
        return -100;
    }

    if (deviationFactor < lowerBound) {
        return 100;
    } else if (deviationFactor >= lowerBound && deviationFactor <= upperBound) {
        return 200;
    } else {
        return -100;
    }
}

// Handle Deviations
async function handleDeviations(flightID, deviation_percentage, estimated_emission, actual_emission, flight_schedule_id) {
    const currentDate = moment().format('YYYY-MM-DD');

    try {
        const [results] = await connection.execute(
            `SELECT DATE(timestamp) as Date FROM deviations 
             WHERE flight_id = ? AND flight_schedule_id = ? AND DATE(timestamp) = ?`,
            [flightID, flight_schedule_id, currentDate]
        );

        const [selectCountResults] = await connection.execute(
            `SELECT COUNT(*) as count FROM deviations WHERE flight_id = ?`,
            [flightID]
        );
        const count = selectCountResults[0].count;

        if (count >= 3 && count < 5) {
            await connection.execute(
                `INSERT INTO penalty (flight_id, fine_charges, status, timestamp)
                 VALUES (?, 5000, 1, NOW())`,
                [flightID]
            );
        } else if (count === 5) {
            await connection.execute(
                `UPDATE flight_schedule SET status = 0 WHERE flight_id = ?`,
                [flightID]
            );
        }

        if (count >= 0 && count < 3) {
            await connection.execute(
                `INSERT INTO deviations (flight_schedule_id, flight_id, estimated_emission, actual_emission, deviation_percentage, timestamp, d_count)
                 VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
                [flight_schedule_id, flightID, estimated_emission, actual_emission, deviation_percentage]
            );
        }
    } catch (err) {
        console.error("Error handling deviations:", err);
    }
}

// Comparison Logic
async function runComparisonLogic() {
    try {
        const emissionsData = await axios.get('http://localhost:3000/api/emissions/fetchSimulation');
        console.log(emissionsData);

        const [results] = await connection.execute(`SELECT * FROM flight_schedule`);

        const comparisonResults = [];

        for (const estimation of results) {
            const flightID = estimation.flight_id;
            const flight_schedule_id = estimation.schedule_id;
            const estimatedEmission =
                emissionsData.find(e => e.flight_schedule_id === flight_schedule_id)?.estimated_emission || 0;
            const actual_emission = actualEmissions(flightID, emissionsData, flight_schedule_id);
            const deviation = actual_emission - estimatedEmission;
            const deviationPercentage = (deviation / estimatedEmission) * 100;

            comparisonResults.push({
                flight_schedule_id,
                flight_id: flightID,
                estimated_emission: estimatedEmission,
                actual_emission,
                deviationPercentage,
            });

            const dev = isDeviationSignificant(estimatedEmission, actual_emission, flightID, flight_schedule_id);

            if (dev === -100) {
                await handleDeviations(flightID, deviationPercentage, estimatedEmission, actual_emission, flight_schedule_id);
            } else if (dev === 100) {
                await connection.execute(
                    `INSERT INTO low_emissions (flight_id, estimated_emission, actual_emission)
                     VALUES (?, ?, ?)`,
                    [flightID, estimatedEmission, actual_emission]
                );
            }
        }

        console.log('Comparison Results:', comparisonResults);
    } catch (error) {
        console.error('Error in runComparisonLogic:', error);
    }
}

module.exports = runComparisonLogic;
