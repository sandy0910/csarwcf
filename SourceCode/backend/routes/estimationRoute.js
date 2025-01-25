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

// Function to calculate estimated CO2 emission for a single flight
async function calculateEstimatedEmission(flight) {
  // Helper function to calculate total occupied Y-seats across all cabin classes for a flight
  const allCabinYseat = async (flightID, from, to) => {
    let totalOccupiedYSeats = 0;

    try {
      // Fetch all cabin classes for the flight
      const [cabinClasses] = await connection.promise().query(
        `SELECT * FROM cabinclass WHERE flight_id = ?`,
        [flightID]
      );

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

        // Fetch Pax load factor for the route
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
    } catch (error) {
      console.error("Error in allCabinYseat:", error);
      throw error;
    }
  };

  try {
    if (!flight) {
      return { error: "Flight data is missing" };
    }

    const flightID = flight.flight_id;
    const { depart_airport_id, arrival_airport_id } = flight;

    let totalCO2 = 0;

    // Fetch cabin classes for the flight
    const [cabinClasses] = await connection.promise().query(
      `SELECT * FROM cabinclass WHERE flight_id = ?`,
      [flightID]
    );

    for (const cabinClass of cabinClasses) {
      const classID = cabinClass.class_id;

      // Calculate total occupied Y-seats
      const totalOccupiedYSeats = await allCabinYseat(
        flightID,
        depart_airport_id,
        arrival_airport_id
      );

      // Get Y-seat factor
      const [ySeatFactorResult] = await connection.promise().query(
        `SELECT factor FROM y_seat WHERE cabin_class_id = ?`,
        [classID]
      );
      const ySeatFactor = ySeatFactorResult[0]?.factor;
      if (!ySeatFactor) {
        console.warn(`Y-seat factor not found for cabin class ID: ${classID}`);
        continue;
      }

      // Get Pax load factor for the route
      const [paxFactorResult] = await connection.promise().query(
        `SELECT * FROM load_factors WHERE origin = ? AND destination = ?`,
        [depart_airport_id, arrival_airport_id]
      );
      const paxFactor = paxFactorResult[0]?.passenger_load_factor;
      const cargoLoadFactor = paxFactorResult[0]?.cargo_load_factor;
      if (!paxFactor || !cargoLoadFactor) {
        console.warn(
          `Load factor not found for route ${depart_airport_id} to ${arrival_airport_id}`
        );
        continue;
      }

      // Fetch fuel consumption for the flight
      const [fuelConsumptionResult] = await connection.promise().query(
        `SELECT fuel_consumption FROM flight_icao WHERE flight_schedule_id = ?`,
        [flight.schedule_id]
      );
      const fuelConsumption = fuelConsumptionResult[0]?.fuel_consumption; // Total fuel consumption in kg
      if (!fuelConsumption) {
        console.warn(`Fuel consumption not found for flight ID: ${flightID}`);
        continue;
      }

      // Calculate CO2 per passenger
      const estimatedCO2pp =
        (fuelConsumption * cargoLoadFactor * ySeatFactor) /
        totalOccupiedYSeats *
        3.16;

      // Add the CO2 for this class to the total
      totalCO2 += estimatedCO2pp;
    }

    return {
      flight_schedule_id: flight.schedule_id,
      flight_id: flightID,
      totalCO2,
    };
  } catch (error) {
    console.error("Error estimating CO₂ emissions:", error);
    return { error: "Server error" };
  }
}

router.post('/estimated-emission', async (req, res) => {
  const { flight, travelers, uid } = req.body;

  // Validate input fields
  if (!flight || !travelers || !uid) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Calculate the estimated emissions for the flight
    const estimatedEmissions = await calculateEstimatedEmission(flight);
    const emissions = estimatedEmissions.totalCO2;

    // Calculate total weight of all passengers
    const totalWeight = travelers.reduce((sum, passenger) => sum + passenger.weight, 0);

    if (totalWeight === 0) {
      return res.status(400).json({ message: "Total weight cannot be zero" });
    }

    // Prepare database connection for updating each traveler
    const query = `
      UPDATE travel_passengers 
      SET emissionContribution = ? 
      WHERE passenger_id = ? AND name = ?
    `;

    // Loop through travelers and update the database
    travelers.forEach((passenger) => {
      const emissionContribution = (passenger.weight * emissions) / totalWeight;
      passenger.emissionContribution = emissionContribution;

      connection.query(
        query,
        [emissionContribution, uid, passenger.name],
        (err, result) => {
          if (err) {
            console.error("Error updating database for passenger:", passenger.name, err);
          } else if (result.affectedRows === 0) {
            console.warn(
              `No record found for passenger ID: ${passenger.id}, Name: ${passenger.name}`
            );
          }
        }
      );
    });

    // Respond once the loop has been processed (database updates are asynchronous but initiated sequentially)
    res.status(200).json({
      message: "Emissions calculated and updates initiated successfully",
      travelers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


  
module.exports = router;