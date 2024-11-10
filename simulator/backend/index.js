const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const app = express();

// Setup your database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'simcsarwcf'
});

// Function to calculate estimated CO2 emission (you might already have this logic)
function calculateEstimatedEmission(flightId) {
// Function to calculate total occupied Y-seats across all cabin classes for a flight
const allCabinYseat = async (flightID, from, to, classID) => {
    let totalOccupiedYSeats = 0;
  
    // Fetch all cabin classes for the flight
    const [cabinClasses] = await connection.query(
      `SELECT * FROM cabinclass WHERE flight_id = ?`, 
      [flightID]
    );
  
    // Loop through each cabin class and calculate occupied Y-seats
    for (const cabinClass of cabinClasses) {
      const classID = cabinClass.class_id;
  
      // Fetch the y_seat factor from the `y_seat` table
      const [ySeatFactorResult] = await connection.query(
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
      const [paxFactorResult] = await connection.query(
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
  
  // Endpoint to handle CO₂ estimation requests
  app.post('/estimate-carbon', async (req, res) => {
    try {
      // Step 1: Get all flights from `flight` table
      const [flights] = await connection.query(
        `SELECT * FROM flight, flight_schedule`
      );
  
      if (!flights.length) {
        return res.status(404).json({ error: 'No flights found' });
      }
  
      // Step 2: Process each flight to calculate CO₂ emissions based on classID and y_seat factor
      const estimationResults = await Promise.all(
        flights.map(async (flight) => {
          const flightID = flight.flight_id;
  
          // Fetch cabin classes for the flight
          const [cClasses] = await connection.query(
            `SELECT * from cabinclass where flight_id = ?`,
            [flightID]
          );
  
          let totalCO2 = 0; // To store total CO2 for the flight
  
          const classEstimations = await Promise.all(
            cClasses.map(async (cClass) => {
              const classID = cClass.class_id;
  
              // Calculate total occupied Y-seats across all cabin classes
              const totalOccupiedYSeats = await allCabinYseat(flightID, flight.depart_airport_id, flight.arrival_airport_id, classID);
  
              // Get Y-seat factor
              const [ySeatFactorResult] = await connection.query(
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
              const [paxFactorResult] = await connection.query(
                `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
                [flight.depart_airport_id, flight.arrival_airport_id]
              );
              const paxFactor = paxFactorResult[0]?.passenger_load_factor;
              const ptocFactor = paxFactorResult[0]?.cargo_load_factor;
  
              if (!paxFactor) {
                return { error: 'Pax load factor not found for the specified route and class' };
              }
  
              // Calculate CO2 per passenger
              const estimatedCO2pp = (fuelConsumption * ptocFactor * ySeatFactor) / totalOccupiedYSeats * 3.16;
  
              // Calculate the total CO2 for this class
              const estimatedCO2 = passengers * estimatedCO2pp;
  
              // Add the class's CO2 estimate to the total CO2 for the flight
              totalCO2 += estimatedCO2;
  
              return {
                flight_id: flightID,
                from: flight.depart_airport_id,
                to: flight.arrival_airport_id,
                classID: classID,
                passengers: passengers,
                co2Estimate: estimatedCO2,
                availableSeats: availableSeats
              };
            })
          );
  
          return {
            flight_id: flightID,
            totalCO2: totalCO2,
            classEstimations: classEstimations.filter(result => !result.error) // Filter out any errors
          };
        })
      );
  
    } catch (error) {
      console.error('Error estimating CO₂ emissions:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
}

// Function to calculate actual CO2 emission (with variation from estimate)
function calculateActualEmission(estimatedEmission) {
  const variation = Math.random() * 0.1 + 0.95; // ±5% variation (0.95 to 1.05)
  return estimatedEmission * variation;
}

// Function to update emissions for flights that have arrived
async function updateEmissionsForArrivedFlights() {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss'); // Get current time
  db.query('SELECT * FROM flight_schedule WHERE scheduled_arrival_time <= ? AND arrived = 0', [currentTime], async (err, results) => {
    if (err) throw err;

    for (const flight of results) {
      const flightId = flight.flight_id;
      const estimatedEmission = calculateEstimatedEmission(flightId);
      const actualEmission = calculateActualEmission(estimatedEmission);

      // Insert or update emissions data for this flight
      db.query(
        'INSERT INTO emissions (flight_schedule_id, passengers_travelled, act_emission) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE act_emission = ?, passengers_travelled = ?',
        [flight.flight_schedule_id, flight.passengers_travelled, actualEmission, actualEmission, flight.passengers_travelled],
        (err, result) => {
          if (err) throw err;
          console.log(`Updated emissions for flight ${flightId}: Estimated: ${estimatedEmission}, Actual: ${actualEmission}`);
        }
      );

      // Mark flight as arrived
      db.query('UPDATE flight_schedule SET arrived = 1 WHERE flight_schedule_id = ?', [flight.flight_schedule_id], (err, result) => {
        if (err) throw err;
        console.log(`Flight ${flightId} marked as arrived.`);
      });
    }
  });
}

// Function to start the periodic updates (every 5 minutes)
setInterval(updateEmissionsForArrivedFlights, 5 * 60 * 1000);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
