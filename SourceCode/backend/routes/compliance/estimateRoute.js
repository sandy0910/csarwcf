const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// MySQL Connection - use await to initialize the connection
let connection;
async function initializeDatabase() {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'csarwcf'
    });
}

// Call this function to initialize the connection
initializeDatabase().catch(error => console.error('Database connection failed:', error));

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
router.post('/estimate-carbon', async (req, res) => {
  const { from, to, passengers, classID } = req.body;

  if (!from || !to || !passengers || !classID) {
    return res.status(400).json({ error: 'Invalid input parameters' });
  }

  try {
    // Step 1: Get all flights from `flight_schedule` table that match `from` and `to` parameters
    const [flights] = await connection.query(
      `SELECT * FROM flight_schedule WHERE depart_airport_id = ? AND arrival_airport_id = ?`,
      [from, to]
    );

    if (!flights.length) {
      return res.status(404).json({ error: 'No flights found for the specified route' });
    }

    // Step 2: Process each flight to calculate CO₂ emissions based on classID and y_seat factor
    const estimationResults = await Promise.all(
      flights.map(async (flight) => {
        const flightID = flight.flight_id;

        // Calculate total occupied Y-seats across all cabin classes
        const totalOccupiedYSeats = await allCabinYseat(flightID, from, to, classID);

        // Calculate the occupied Y-seats for the specified classID
        const [ySeatFactorResult] = await connection.query(
          `SELECT factor FROM y_seat WHERE cabin_class_id = ?`,
          [classID]
        );
        const ySeatFactor = ySeatFactorResult[0]?.factor;

        if (!ySeatFactor) {
          return { error: 'Y-seat factor not found for the specified class' };
        }

        const [cabinClassResult] = await connection.query(
          `SELECT capacity FROM cabinclass WHERE flight_id = ? AND class_id = ?`,
          [flightID, classID]
        );
        const availableSeats = cabinClassResult[0]?.capacity;

        if (!availableSeats) {
          return { error: 'No available seats found for the specified cabin class' };
        }

        // Calculate total Y-seat for specified classID
        const totalYseat = availableSeats * ySeatFactor;

        // Fetch Pax load factor for the route (using `from` and `to` parameters for route-based load factor)
        const [paxFactorResult] = await connection.query(
          `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
          [from, to]
        );
        const paxFactor = paxFactorResult[0]?.passenger_load_factor;
        const ptocFactor = paxFactorResult[0]?.cargo_load_factor;

        if (!paxFactor) {
          return { error: 'Pax load factor not found for the specified route and class' };
        }

        const occupiedYSeat = totalYseat * paxFactor;

        const [fuelConRes] = await connection.query(
          `SELECT * from flight_icao where flight_schedule_id = ?`, 
          [flight.schedule_id]
        );
        const fuelConsumption = fuelConRes[0]?.fuel_consumption; //Total fuel consumption in kg

        if (!paxFactor) {
          return { error: 'Pax load factor not found for the specified route and class' };
        }

        const estimatedCO2pp = [(fuelConsumption*ptocFactor* ySeatFactor) / totalOccupiedYSeats]*3.16;

        const estimatedCO2 = passengers * estimatedCO2pp;

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

    // Filter out any flights that encountered errors in the mapping step
    const successfulEstimations = estimationResults.filter(
      (result) => !result.error
    );

    res.status(200).json(successfulEstimations);
  } catch (error) {
    console.error('Error estimating CO₂ emissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
