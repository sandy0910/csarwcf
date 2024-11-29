const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');

const router = express.Router();
// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf' 
});

// Function to calculate estimated CO2 emission (you might already have this logic)
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
        let totalPassengerWt = 0;
        let baggageWeight = 0;

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

            // Estimate the range for the random weight of each passenger (e.g., between 50kg and 100kg)
            const minPassengerWeight = 50;
            const maxPassengerWeight = 100;

            // Generate a random weight for each passenger
            const randomPassengerWeight = Math.floor(Math.random() * (maxPassengerWeight - minPassengerWeight + 1)) + minPassengerWeight;

            // Estimate the range for the random weight of each passenger (e.g., between 50kg and 100kg)
            const minBaggageWeight = 50;
            const maxBaggageWeight = 100;

            // Generate a random weight for each passenger
            const randomBaggageWeight = Math.floor(Math.random() * (maxBaggageWeight - minBaggageWeight + 1)) + minBaggageWeight;

            // Calculate the total weight of passengers based on the number of passengers
            const totalBaggageWt = passengers * randomBaggageWeight;
            baggageWeight += totalBaggageWt;
            // Calculate the total weight of passengers based on the number of passengers
            const totalPassengerWtForClass = passengers * randomPassengerWeight;
            totalPassengerWt += totalPassengerWtForClass;

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
          totalPassengerWeight: totalPassengerWt,
          totalBaggageWeight: baggageWeight,
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

function actualEmissions(flightId, emissionsData) {
  const flightData = emissionsData.map((emission) => {
    if(emission.flight_id === flightId){
      // console.log("Flight ID : ", flightId, "Act : ",emission.actual_emission)
      return emission.actual_emission
    }
  });
  return flightData;
}


// Function to check if deviation percentage is ±5% of estimated emission
function isDeviationSignificant(deviationPercentage,flightID) {
  const lowerBound = -5; // -5% threshold
  const upperBound = 5;  // +5% threshold
  if(flightID == "FL001"){
    return -100;   
  }
  if(deviationPercentage < lowerBound){
    return 100 //Low emission
  }else if( deviationPercentage > upperBound ){
    return -100 //High emission deviation
  }else{
    return 200  //In Normal range
  }
}

// Comparison logic with deviation threshold check
router.post('/comparisonEstimate',  (req, res) => {
  const emissionsData = req.body;

  if (!Array.isArray(emissionsData)) {
      return res.status(400).json({ error: 'Expected an array of emissions data' });
  }
  
  try {
    // Query to get flight data
    const query = `SELECT * FROM flight_schedule`;

    connection.query(query, async (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Database query error' });
        }

        // Calculate estimated emissions
        const estimationResults = await calculateEstimatedEmission(results);

        // Compare estimated and actual emissions
        const comparisonResults = await Promise.all(
            results.map(async (estimation, i) => {
                const estimatedEmission = estimationResults[i]?.totalCO2 || 0;
                const actualEmission = actualEmissions(estimation.flight_id, emissionsData);
                const flightID = estimation.flight_id;
                // console.log("Actual Emissions: ", actualEmission, "for flight : ", flightID);

                // Calculate the deviation
                const deviation = actualEmission - estimatedEmission;
                const deviationPercentage = (deviation / estimatedEmission) * 100;

                // Fetch flight details
                const flightDetailsQuery = `
                  SELECT f.flight_number, a.name AS airline_name, 
                  p1.city AS origin, p2.city AS destination, d.deviation_percentage 
                  FROM 
                      flight f
                  JOIN 
                    flight_schedule fs ON f.flight_id = fs.flight_id
                  JOIN 
                      airline a ON f.airline_id = a.airline_id
                  JOIN 
                      airport p1 ON fs.depart_airport_id = p1.airport_id
                  JOIN 
                      airport p2 ON fs.arrival_airport_id = p2.airport_id
                  LEFT JOIN 
                      deviations d ON f.flight_id = d.flight_id
                  WHERE f.flight_id = "FL001" AND d.deviation_percentage IS NOT NULL;`;

                const flightDetails = await new Promise((resolve, reject) => {
                    connection.query(flightDetailsQuery, [flightID], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows[0]);
                    });
                });

                const comparisonResult = {
                    flight_id: flightID,
                    estimated_emission: estimatedEmission,
                    actual_emission: actualEmission,
                    deviation_percentage: deviationPercentage,
                    passengers_travelled: estimation.passengers_travelled,
                };

                // Check if the deviation exceeds the threshold
                const dev = isDeviationSignificant(deviationPercentage, flightID);
                if (dev === -100) {
                    // Handle significant deviations
                    // console.log("HandleDeviaitons : ", comparisonResult);
                    await handleDeviations(flightID, comparisonResult);
                } else if (dev === 100) {
                    // Handle low emissions
                    const lowEmissionRecordQuery = `
                        INSERT INTO low_emissions (flight_id, estimated_emission, actual_emission)
                        VALUES (?, ?, ?)`;
                    await new Promise((resolve, reject) => {
                        connection.query(lowEmissionRecordQuery, [flightID, estimatedEmission, actualEmission], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }

                return comparisonResult;
            })
        );

        // Send the comparison results as the API response
        res.status(200).json({ results: comparisonResults });
    });
} catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
}

// Helper function to handle deviations
async function handleDeviations(flightID, comparisonResult) {
    const { estimated_emission, actual_emission, deviation_percentage } = comparisonResult;
    // console.log(comparisonResult);

    const checkCountQuery = `SELECT d_count FROM deviations WHERE flight_id = ?`;
    const deviationData = await new Promise((resolve, reject) => {
        connection.query(checkCountQuery, [flightID], (err, rows) => {
            if (err) reject(err);
            else resolve(rows[0]);  
        });
    });

    const count = deviationData?.d_count || 0;  
    const updatedCount = count + 1;

    if (count >= 3 && count < 5) {
        // Moderate level: Add fine
        const addFineQuery = `
            INSERT INTO penalty (flight_id, fine_charges, status, timestamp)
            VALUES (?, 5000, 1, NOW())`;
        await new Promise((resolve, reject) => {
            connection.query(addFineQuery, [flightID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    } else if (count === 5) {
        // Exceeded limit: Place under inspection
        const operationalStatusQuery = `
            UPDATE flight_schedule SET status = 0 WHERE flight_id = ?`;
        await new Promise((resolve, reject) => {
            connection.query(operationalStatusQuery, [flightID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        return;
    }

    // Insert or update deviation data
    if (count === 0) {
        const insertQuery = `
            INSERT INTO deviations (flight_id, estimated_emission, actual_emission, deviation_percentage, timestamp, d_count)
            VALUES (?, ?, ?, ?, NOW(), ?)`;
        await new Promise((resolve, reject) => {
            connection.query(insertQuery, [flightID, estimated_emission, actual_emission, deviation_percentage, updatedCount], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    } else {
        const updateCountQuery = `
            UPDATE deviations SET d_count = ?, deviation_percentage = ?, timestamp = NOW()
            WHERE flight_id = ?`;
        await new Promise((resolve, reject) => {
            connection.query(updateCountQuery, [updatedCount, deviation_percentage, flightID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

});

module.exports = router;