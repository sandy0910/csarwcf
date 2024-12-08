const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');
const axios = require('axios');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

function actualEmissions(flightID, emissionsData, flight_schedule_id) {
  const emissionRecord = emissionsData.find(record => record.flight_schedule_id === flight_schedule_id);
  if (!emissionRecord) {
      console.warn(`No actual emission data found for flight ID: ${flightID}`);
      return 0;
  }

  return emissionRecord.act_emission;
}


// Function to check if deviation percentage is ±5% of estimated emission
function isDeviationSignificant(estimatedEmission, actual_emission, flightID, flight_schedule_id) {
  const lowerBound = 0.9; // 90% of the estimated value
  const normalBound = 1.0; // 100% of the estimated value
  const upperBound = 1.1; // 110% of the estimated value

  // Calculate how the actual emission deviates from the estimated
  const deviationFactor = actual_emission / estimatedEmission;

  if (flightID === "FL001" && flight_schedule_id == 1) {
    return -100;
  }

  if (deviationFactor < lowerBound) {
      return 100; // Low emission deviation
  } else if (deviationFactor >= lowerBound && deviationFactor < normalBound) {
      return 200; // Slightly low deviation
  } else if (deviationFactor === normalBound) {
      return 200; // Perfect match
  } else if (deviationFactor > normalBound && deviationFactor <= upperBound) {
      return 200; // Slightly high deviation
  } else {
      return -100; // High emission deviation
  }
}


function handleDeviations(flightID, deviation_percentage, estimated_emission, actual_emission, flight_schedule_id) {
    const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Helper function to process count-based logic
    function processCount(count) {
        if (count >= 3 && count < 5) {
            // Moderate level: Add fine
            const addFineQuery = `
                INSERT INTO penalty (flight_id, fine_charges, status, timestamp)
                VALUES (?, 5000, 1, NOW())`;
            connection.query(addFineQuery, [flightID], (err) => {
                if (err) console.error("Cannot add fine charges", err);
                
                //Also add the deviations data
                const insertDeviateQuery =   `INSERT INTO deviations (flight_schedule_id, flight_id, estimated_emission, actual_emission, deviation_percentage, timestamp, d_count)
                VALUES (?, ?, ?, ?, ?, NOW(), 1)`;
                connection.query(insertDeviateQuery, [flight_schedule_id, flightID, estimated_emission, actual_emission, deviation_percentage], (err) => {
                if (err) console.error("Error in inserting deviation data", err);
                });
            });
        } else if (count === 5) {
            // Exceeded limit: Place under inspection
            const operationalStatusQuery = `
                UPDATE flight_schedule SET status = 0 WHERE flight_id = ?`;
            connection.query(operationalStatusQuery, [flightID], (err) => {
                if (err) console.error("Can't update the status", err);

                // Insert into deviations record with timestamp
                const recordDeviationsQuery = `
                    INSERT INTO deviation_record (flight_schedule_id, flight_id, estimated_emission, actual_emission, deviation_percentage, timestamp)
                    SELECT flight_schedule_id, flight_id, estimated_emission, actual_emission, deviation_percentage, NOW()
                    FROM deviations WHERE flight_id = ?`;
                connection.query(recordDeviationsQuery, [flightID], (err) => {
                    if (err) console.error("Error in taking backup for the record", err);
                });

                // Update deviation count
                const updateDeviationQuery = `UPDATE deviations SET d_count = 2 WHERE flight_id = ?`;
                connection.query(updateDeviationQuery, [flightID], (err) => {
                    if (err) console.error("Deviation data not cleared", err);
                });
            });
            return;
        }

        // Insert or update deviation data
        if (count >= 0 && count < 3) {
            const insertQuery = `
                INSERT INTO deviations (flight_schedule_id, flight_id, estimated_emission, actual_emission, deviation_percentage, timestamp, d_count)
                VALUES (?, ?, ?, ?, ?, NOW(), 1)`;
            connection.query(insertQuery, [flight_schedule_id, flightID, estimated_emission, actual_emission, deviation_percentage], (err) => {
                if (err) console.error("Error in inserting deviation data", err);
            });
        }
    }

    // Get count logic
    const checkCountQuery = `
        SELECT DATE(timestamp) as Date FROM deviations 
        WHERE flight_id = ? AND flight_schedule_id = ? AND DATE(timestamp) = ?`;
    connection.query(checkCountQuery, [flightID, flight_schedule_id, currentDate], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        if (results.length > 0) {
            // console.log("Today's Deviations Found:", results);
            processCount(-1); // Count is -1
        } else {
            const selectCountQuery = `SELECT COUNT(*) as count FROM deviations WHERE flight_id = ?`;
            connection.query(selectCountQuery, [flightID], (err, selectCountResults) => {
                if (err) {
                    console.error("Error in fetching the count data", err);
                    return;
                }

                const count = selectCountResults[0].count;
                processCount(count); // Pass the count to the processing function
            });
        }
    });
}


// Comparison logic with deviation threshold check
async function runComparisonLogic(){    
    const response = await axios.get('http://localhost:3000/api/emissions/fetchSimulation');
    const emissionsData = response.data;

    if (!Array.isArray(emissionsData)) {
        return res.status(400).json({ error: 'Expected an array of emissions data' });
    }
    // Query to get flight data
    const query = `SELECT * FROM flight_schedule;`;

    connection.query(query, async (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Database query error' });
        }

        // Array to store the comparison results
        const comparisonResults = [];

        // Process each result sequentially
        for (const estimation of results) {
            const flightID = estimation.flight_id;
            const flight_schedule_id = estimation.schedule_id;
            const estimatedEmission = emissionsData.find(e => e.flight_schedule_id === flight_schedule_id)?.estimated_emission || 0;
            const actual_emission = actualEmissions(flightID, emissionsData, estimation.schedule_id);

            const deviation = actual_emission - estimatedEmission;
            const deviationPercentage = (deviation / estimatedEmission) * 100;

            // Add the result to the comparison array
            comparisonResults.push({
                flight_schedule_id: estimation.schedule_id,
                flight_id: flightID,
                estimated_emission: estimatedEmission,
                actual_emission,
                deviationPercentage
            });

            // Check if the deviation is significant
            const dev = isDeviationSignificant(estimatedEmission, actual_emission, flightID, estimation.schedule_id);

            if (dev === -100) {
                handleDeviations(flightID, deviationPercentage, estimatedEmission, actual_emission, estimation.schedule_id);
            } else if (dev === 100) {
                // Handle low emissions by inserting into the database
                const lowEmissionRecordQuery = `
                    INSERT INTO low_emissions (flight_id, estimated_emission, actual_emission)
                    VALUES (?, ?, ?)`;
                try {
                    await new Promise((resolve, reject) => {
                        connection.query(lowEmissionRecordQuery, [flightID, estimatedEmission, actual_emission], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                } catch (err) {
                    console.error(`Error inserting low emission record for flight ${flightID}:`, err);
                }
            }
        }

            // Send the comparison results as the API response
            res.status(200).json({ results: comparisonResults });
        });
}

router.post('/comparisonEstimate', async (req, res) => {


    if (!Array.isArray(emissionsData)) {
        return res.status(400).json({ error: 'Expected an array of emissions data' });
    }

    try {
        await runComparisonLogic();
        res.status(200).json({ message: 'Comparison logic executed successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/deviationsData', (req, res) => {
  const deviationDataQuery = `SELECT * FROM deviations d, flight_schedule fs,
  flight f where fs.schedule_id = d.flight_schedule_id and f.flight_id = fs.flight_id;`;

  connection.query(deviationDataQuery, (err, results) => {
    if (err) {
      console.error("Error in fetching Deviations data", err);
      return res.status(500).json({ error: "Error fetching deviations data" });
    }

    // Send the results as JSON response
    res.json({results });
  });
});

module.exports = router;