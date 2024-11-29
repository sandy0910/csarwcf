const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Setup your database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'simcsarwcf'
});

// Ensure the database connection is established
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Function to calculate estimated CO2 emission (you might already have this logic)
async function calculateEstimatedEmission(flights) {
  // Function to calculate total occupied Y-seats across all cabin classes for a flight
  const allCabinYseat = async (flightID, from, to, classID) => {
    let totalOccupiedYSeats = 0;

    // Fetch all cabin classes for the flight
    const [cabinClasses] = await db.promise().query(
      `SELECT * FROM cabinclass WHERE flight_id = ?`, 
      [flightID]
    );

    // Loop through each cabin class and calculate occupied Y-seats
    for (const cabinClass of cabinClasses) {
      const classID = cabinClass.class_id;

      // Fetch the y_seat factor from the `y_seat` table
      const [ySeatFactorResult] = await db.promise().query(
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
      const [paxFactorResult] = await db.promise().query(
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
        const [cClasses] = await db.promise().query(
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
            const [ySeatFactorResult] = await db.promise().query(
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
            const [paxFactorResult] = await db.promise().query(
              `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
              [flight.depart_airport_id, flight.arrival_airport_id]
            );
            const paxFactor = paxFactorResult[0]?.passenger_load_factor;
            const ptocFactor = paxFactorResult[0]?.cargo_load_factor;

            if (!paxFactor) {
              return { error: 'Pax load factor not found for the specified route and class' };
            }

            const [fuelConRes] = await db.promise().query(
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
          passengers_travelled: passengerCount,
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

// Function to calculate actual CO2 emission (with variation from estimate)
function calculateActualEmission(estimatedEmission, flightID) {
  // Generate a deviation factor for the general case
  const minFactor = 0.9; // 90% of the estimated value
  const maxFactor = 1.1; // 110% of the estimated value
  
  const deviationFactor = Math.random() * (maxFactor - minFactor) + minFactor;

  return estimatedEmission * deviationFactor; // Adjust the estimated emission by the deviation factor
}


// Function to update emissions for flights that have arrived
app.post('/api/emissions/update', async (req, res) => {
  try {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query('SELECT * FROM flight_schedule WHERE scheduled_arrival_time <= ?', [currentTime], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      const estimatedEmissions = await calculateEstimatedEmission(results); 
      const emissionsUpdatePromises = results.map((flight, i) => {
        const estimatedEmission = estimatedEmissions[i]?.totalCO2 || 0;
        const passengers_travelled = estimatedEmissions[i]?.passengers_travelled || 0;
        const passengers_weight = estimatedEmissions[i]?.totalPassengerWeight || 0;
        const baggage_weight = estimatedEmissions[i]?.totalBaggageWeight || 0;

      // const estimatedEmissions = await calculateEstimatedEmission(results);
      // const emissionsUpdatePromises = results.map((flight, i) => {
      //   const estimatedEmission = estimatedEmissions[i]?.totalCO2 || 0;
      //   const passengers_travelled = estimatedEmissions[i]?.passengerCount || 0;
        const actualEmission = calculateActualEmission(estimatedEmission, flight.flight_id);

        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO emissions (flight_schedule_id, passengers_travelled, passengers_weight, baggage_weight, act_emission, estimated_emission) 
              VALUES (?, ?, ?, ?, ?, ?) 
              ON DUPLICATE KEY UPDATE 
                passengers_travelled = VALUES(passengers_travelled),
                passengers_weight = VALUES(passengers_weight),
                baggage_weight = VALUES(baggage_weight),
                act_emission = VALUES(act_emission), 
                estimated_emission = VALUES(estimated_emission);
              `,
            [flight.schedule_id, passengers_travelled, passengers_weight, baggage_weight, actualEmission, estimatedEmission],
            (err, result) => {
              if (err) reject(err);
              resolve({
                flight_id: flight.flight_id,
                schedule_id: flight.schedule_id,
                passengers_travelled,
                passengers_weight,
                baggage_weight,
                estimated_emission: estimatedEmission,
                actual_emission: actualEmission
              });

            // `INSERT INTO emissions (flight_schedule_id, passengers_travelled, act_emission, estimated_emission) 
            //   VALUES (?, ?, ?, ?) 
            //   ON DUPLICATE KEY UPDATE 
            //     act_emission = VALUES(act_emission), 
            //     passengers_travelled = VALUES(passengers_travelled),
            //     estimated_emission = VALUES(estimated_emission);
            //   `,
            // [flight.schedule_id, passengers_travelled, actualEmission, estimatedEmission, actualEmission, passengers_travelled],
            // (err, result) => {
            //   if (err) reject(err);
              resolve(`Updated emissions for flight ${flight.flight_id}`);
            }
          );
        });
      });

      const result = await Promise.all(emissionsUpdatePromises);
      res.json({ message: 'Emissions updated successfully', details: result });
    });
  } catch (error) {
    console.error('Error updating emissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
