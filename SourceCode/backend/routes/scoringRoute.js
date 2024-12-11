const mysql = require('mysql2');
const axios = require('axios');

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf'
});

// Function to normalize values
function normalize(value, maxValue, isDeviation = false) {
    if (isDeviation) {
        return (1 - Math.min(value, 1)) * 100; // Reverse scale for deviation (lower is better)
    }
    return ((maxValue - value) / maxValue) * 100; // Normalization for other values
}

// Function to calculate the score using MCDA methodology
function calculateFlightScore(deviation, distance, passengers, maxValues) {
    const { maxDistance, maxPassengers } = maxValues;

    const normalizedDeviation = normalize(deviation, 100, true);
    const normalizedDistance = normalize(distance, maxDistance);
    const normalizedPassengers = normalize(passengers, maxPassengers);

    const w1 = 0.5; // Weight for deviation
    const w2 = 0.3; // Weight for distance
    const w3 = 0.2; // Weight for passengers

    const score = (w1 * normalizedDeviation) +
                  (w2 * normalizedDistance) +
                  (w3 * normalizedPassengers);

    return Math.round(score); // Return rounded score
}

// Function to fetch, compute, and save scores
async function computeAndSaveScores() {
    try {
        // Fetch data from localhost:3000/api
        const response = await axios.get('http://localhost:3000/api/emissions/scoring-data');
        const emissionData = response.data; // Assuming an array of flights

        if (!Array.isArray(emissionData) || emissionData.length === 0) {
            console.warn('No emission data available to process.');
            return;
        }

        // Use a Map to ensure unique schedule_id
        const uniqueFlights = new Map();

        for (const flight of emissionData) {
            const { schedule_id } = flight;

            // Keep only the first occurrence of each schedule_id
            if (!uniqueFlights.has(schedule_id)) {
                uniqueFlights.set(schedule_id, flight);
            }
        }

        // Check if the date in the scores table is equal to the current date
        const checkDateQuery = `SELECT COUNT(*) AS count FROM scores WHERE DATE(s_timestamp) = CURDATE();`;
        const [rows] = await new Promise((resolve, reject) => {
            connection.query(checkDateQuery, (err, results) => {
                if (err) {
                    console.error('Error checking date in scores table:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        console.log("ROWS : ",rows.count);

        if(rows.count > 0){
            console.log('Scores data already exists for today, skipping backup and insertion.');
            return;
        }

        // Backup the data before truncating the scores table
        const backupQuery = `
            INSERT INTO backup_scores (flight_schedule_id, deviation_percentage, s_timestamp, passenger_count, final_score)
            SELECT flight_schedule_id, deviation_percentage, s_timestamp, passenger_count, final_score
            FROM scores;
        `;
        await new Promise((resolve, reject) => {
            connection.query(backupQuery, (err, results) => {
                if (err) {
                    console.error('Error backing up scores data:', err);
                    return reject(err);
                }
                console.log('Scores data backed up successfully.');
                resolve(results);
            });
        });

        // Truncate the scores table
        const truncateQuery = `TRUNCATE TABLE scores;`;
        await new Promise((resolve, reject) => {
            connection.query(truncateQuery, (err, results) => {
                if (err) {
                    console.error('Error truncating scores table:', err);
                    return reject(err);
                }
                console.log('Scores table truncated successfully.');
                resolve(results);
            });
        });

        // Process each unique flight
        for (const [schedule_id, flight] of uniqueFlights) {
            const { gcd, passengers_travelled, act_emission, estimated_emission, capacity } = flight;

            const deviation = act_emission - estimated_emission;
            const deviationPercentage = (deviation / estimated_emission) * 100;

            const maxValues = {
                maxDistance: gcd * 2, // Assuming gcd is half the max distance
                maxPassengers: capacity
            };

            const score = calculateFlightScore(deviationPercentage, gcd, passengers_travelled, maxValues);

            console.log(`Schedule ID: ${schedule_id}, Score: ${score}`);

            // Insert the score into the database
            const insertQuery = `
                INSERT INTO scores(flight_schedule_id, deviation_percentage, s_timestamp, passenger_count, final_score)
                VALUES (?, ?, NOW(), ?, ?);
            `;
            await new Promise((resolve, reject) => {
                connection.query(insertQuery, [schedule_id, deviationPercentage, passengers_travelled, score], (err, results) => {
                    if (err) {
                        console.error(`Error inserting data for schedule_id ${schedule_id}:`, err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        }
    } catch (error) {
        console.error('Error during score computation:', error);
    } finally {
        // Close the database connection
        connection.end(err => {
            if (err) {
                console.error('Error closing the database connection:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}

// Export the function directly
module.exports = computeAndSaveScores;
