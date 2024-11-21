const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { error } = require('console');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

async function calculateEstimatedEmission(flights) {
    // Function to calculate total occupied Y-seats across all cabin classes for a flight
    const allCabinYseat = async (flightID, from, to, classID) => {
      let totalOccupiedYSeats = 0;
  
      // Fetch all cabin classes for the flight
      const [cabinClasses] = await connection.promise().query(
        `SELECT * FROM cabinclass WHERE flight_id = ?`, 
        [flightID]
      );
  
      // Loop through each cabin class and calculate occupied Y-seats
      for (const cabinClass of cabinClasses) {
        const classID = cabinClass.class_id;
  
        // Fetch the y_seat factor from the `y_seat` table
        const [ySeatFactorResult] = await connection.promise().query(
          `SELECT factor FROM y_seat WHERE cabin_class_id = ?`,
          [classID]
        );
        const ySeatFactor = ySeatFactorResult[0]?.factor;
  
        if (!ySeatFactor) continue;
  
        // Get available seats from the cabin class table
        const availableSeats = cabinClass.capacity;
        if (!availableSeats) continue;
  
        // Calculate total Y-seat based on available seats and Y-seat factor
        const totalYseat = availableSeats * ySeatFactor;
  
        // Fetch Pax load factor for the route (assuming it's based on route, not individual flight)
        const [paxFactorResult] = await connection.promise().query(
          `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
          [from, to]
        );
        const paxFactor = paxFactorResult[0]?.passenger_load_factor;
  
        if (!paxFactor) continue;
  
        // Calculate occupied Y-seat for the cabin class
        const occupiedYSeat = totalYseat * paxFactor;
        totalOccupiedYSeats += occupiedYSeat;
      }
  
      return totalOccupiedYSeats;
    };
  
    try {
      if (!flights.length) {
        return { error: 'No flights found' };
      }
  
      // Step 2: Process each flight to calculate CO₂ emissions based on classID and y_seat factor
      const estimationResults = await Promise.all(
        flights.map(async (flight) => {
          const flightID = flight.flight_id;
  
          // Fetch cabin classes for the flight
          const [cClasses] = await connection.promise().query(
            `SELECT * from cabinclass where flight_id = ?`,
            [flightID]
          );
  
          let totalCO2 = 0; // To store total CO2 for the flight
          let passengerCount = 0;
  
          const classEstimations = await Promise.all(
            cClasses.map(async (cClass) => {
              const classID = cClass.class_id;
  
              // Calculate total occupied Y-seats across all cabin classes
              const totalOccupiedYSeats = await allCabinYseat(flightID, flight.depart_airport_id, flight.arrival_airport_id, classID);
  
              // Get Y-seat factor
              const [ySeatFactorResult] = await connection.promise().query(
                `SELECT factor FROM y_seat WHERE cabin_class_id = ?`,
                [classID]
              );
              const ySeatFactor = ySeatFactorResult[0]?.factor;
  
              if (!ySeatFactor) {
                return { error: 'Y-seat factor not found for the specified class' };
              }
  
              // Get available seats for the cabin class
              const availableSeats = cClass.capacity;
  
              if (!availableSeats) {
                return { error: 'No available seats found for the specified cabin class' };
              }
  
              // Generate a random number of passengers not exceeding the available seats
              const passengers = Math.floor(Math.random() * (availableSeats + 1));
  
              // Fetch Pax load factor for the route
              const [paxFactorResult] = await connection.promise().query(
                `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
                [flight.depart_airport_id, flight.arrival_airport_id]
              );
              const paxFactor = paxFactorResult[0]?.passenger_load_factor;
              const ptocFactor = paxFactorResult[0]?.cargo_load_factor;
  
              if (!paxFactor) {
                return { error: 'Pax load factor not found for the specified route and class' };
              }
  
              const [fuelConRes] = await connection.promise().query(
                `SELECT * from flight_icao where flight_id = ?`, 
                [flightID]
              );
              const fuelConsumption = fuelConRes[0]?.fuel_consumption; //Total fuel consumption in kg
  
              // Calculate CO2 per passenger
              const estimatedCO2pp = (fuelConsumption * ptocFactor * ySeatFactor) / totalOccupiedYSeats * 3.16;
  
              // Calculate the total CO2 for this class
              const estimatedCO2 = passengers * estimatedCO2pp;
  
              // Add the class's CO2 estimate to the total CO2 for the flight
              totalCO2 += estimatedCO2;
              passengerCount += passengers;
            })
          );
  
          return {
            flight_id: flightID,
            totalCO2: totalCO2,
            passengers_travelled: passengerCount  
          };
        })
      );
  
      return estimationResults;
    } catch (error) {
      console.error('Error estimating CO₂ emissions:', error);
      return { error: 'Server error' };
    }
}

function calculateActualEmission(estimatedEmission) {
  const variation = Math.random() * 0.1 + 0.95; // ±5% variation (0.95 to 1.05)
  return estimatedEmission * variation;
}

// Define the threshold for deviation percentage and count
const DEVIATION_THRESHOLD_PERCENTAGE = 50; // 50%
const DEVIATION_COUNT_THRESHOLD = 10; // Count threshold

// Comparison logic with deviation threshold check
router.post('/comparisonEstimate', async (req, res) => {
  const emissionsData = req.body; 

  if (!Array.isArray(emissionsData)) {
      return res.status(400).json({ error: 'Expected an array of emissions data' });
  }
  
  try {
      // Query to get flight data
      const query = `SELECT * FROM flight_schedule;`;

      connection.query(query, async (error, results) => {
          if (error) {
              console.error('Error executing query:', error);
              return res.status(500).json({ error: 'Database query error' });
          }

          // Calculate estimated emissions
          const estimationResults = await calculateEstimatedEmission(results);

          // Map each result to allow easy lookup by flight_id
          const emissionsMap = emissionsData.reduce((map, data) => {
              map[data.flight_id] = data;
              return map;
          }, {});

          // Compare estimated and actual emissions
          const comparisonResults = await Promise.all(estimationResults.map(async (estimation) => {
              // Simulate actual emissions based on estimated emissions
              const actualEmission = calculateActualEmission(estimation.totalCO2);

              // Calculate the deviation
              const deviation = actualEmission - estimation.totalCO2;
              const deviationPercentage = (deviation / actualEmission) * 100;

              const comparisonResult = {
                  flight_id: estimation.flight_id,
                  estimated_emission: estimation.totalCO2,
                  actual_emission: actualEmission.toFixed(2), // Simulated actual emission
                  deviation: deviation.toFixed(2),
                  deviation_percentage: deviationPercentage.toFixed(2),
                  passengers_travelled: estimation.passengers_travelled
              };

              // Check if the deviation exceeds the threshold
              if (deviationPercentage > DEVIATION_THRESHOLD_PERCENTAGE) {
                  // Store the deviated data in the deviations table
                  const { flight_id, estimated_emission, actual_emission, deviation, deviation_percentage, passengers_travelled } = comparisonResult;
                  const insertQuery = `
                    INSERT INTO deviations (flight_id, estimated_emission, actual_emission, deviation, deviation_percentage, passengers_travelled, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, NOW())`;

                  connection.query(insertQuery, [flight_id, estimated_emission, actual_emission, deviation, deviation_percentage, passengers_travelled], (err) => {
                      if (err) {
                          console.error('Error inserting deviated data into deviations table:', err);
                      } else {
                          console.log(`Deviation data for flight ${flight_id} inserted into deviations table.`);
                      }
                  });

                  // Update the deviation count for the flight
                  const updateDeviationCountQuery = `UPDATE flight_schedule 
                                                     SET deviation_count = deviation_count + 1 
                                                     WHERE flight_id = ?`;
                  connection.query(updateDeviationCountQuery, [flight_id], (err) => {
                      if (err) {
                          console.error('Error updating deviation count:', err);
                      } else {
                          console.log(`Deviation count for flight ${flight_id} updated.`);
                      }
                  });

                  // Check if deviation count exceeds the threshold
                  const flightQuery = `SELECT deviation_count FROM flight_schedule WHERE flight_id = ?`;
                  connection.query(flightQuery, [flight_id], (err, flightResult) => {
                      if (err) {
                          console.error('Error querying flight_schedule:', err);
                      } else {
                          const deviationCount = flightResult[0]?.deviation_count || 0;

                          if (deviationCount >= DEVIATION_COUNT_THRESHOLD) {
                              // Set operational_status to 0 (flight is no longer operational)
                              const updateStatusQuery = `UPDATE flight_schedule 
                                                        SET operational_status = 0 
                                                        WHERE flight_id = ?`;
                              connection.query(updateStatusQuery, [flight_id], (err) => {
                                  if (err) {
                                      console.error('Error updating operational status:', err);
                                  } else {
                                      console.log(`Flight ${flight_id} set to non-operational.`);
                                  }
                              });
                          }
                      }
                  });
              }

              return comparisonResult;
          }));

          // Send the comparison results as the API response
          res.json(comparisonResults);
      });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;