const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// MySQL Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csarwcf',
};

// Middleware to parse JSON
router.use(express.json({ limit: '50mb' }));

// Get Seat Layout by Aircraft ID
router.get('/seats', async (req, res) => {
    // const aircraftId = req.params.id;

    try {
        // Establish a connection with the MySQL database
        const db = await mysql.createConnection(dbConfig);

        // Query to fetch the seat layout for the specified aircraft
        const [rows] = await db.execute(
            'SELECT seat_layout FROM aircrafts WHERE aircraft_id = 1;'
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aircraft not found' });
        }
        let seatLayout = rows[0].seat_layout;

        // Check if seat_layout is already a JSON object
        if (typeof seatLayout === 'string') {
            seatLayout = JSON.parse(seatLayout); // Parse JSON string
        }
        res.json(seatLayout);

        // Close the database connection
        await db.end();
    } catch (error) {
        console.error('Error fetching seat layout:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/price-calculate', async (req, res) => {
    try {
        const { updatedAllocation, updatedEmissionData, calculatedAllocation, calculatedEmissionData } = req.body;
    
        if (!updatedAllocation || !updatedEmissionData || !calculatedAllocation || !calculatedEmissionData) {
            return res.status(400).json({ error: 'Missing required data in the request body' });
        }
    
        const db = await mysql.createConnection(dbConfig);
    
        const [rows] = await db.execute('SELECT seat_layout FROM aircrafts WHERE aircraft_id = 1;');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aircraft not found' });
        }
    
        let seatLayout = rows[0].seat_layout;
    
        if (typeof seatLayout === 'string') {
            seatLayout = JSON.parse(seatLayout);
        }
    
        await db.end();
    
        let totalFine = 0;
    
        // Arrays to store results
        const updatedData = [];
        const calculatedData = [];
    
        // Process updatedAllocation
        for (const updatedSeat of updatedAllocation) {
            const seatId = updatedSeat.seatId;
    
            let updatedRow = null;
            let updatedSeatInfo = null;
    
            for (const rowKey in seatLayout) {
                const currentRow = seatLayout[rowKey];
                updatedSeatInfo = currentRow.seats.find((s) => s.id === seatId);
                if (updatedSeatInfo) {
                    updatedRow = currentRow;
                    break;
                }
            }
    
            if (updatedRow && updatedSeatInfo) {
                const updatedWeightFactor = updatedRow.weightFactor || 1; // Default to 1 if not defined
                // Find the matching entry in updatedEmissionData using traveller_id
                const updatedEmissionEntry = updatedEmissionData.find((entry) => entry.traveler_id === updatedSeat.traveler_id);
        
                if (updatedEmissionEntry) {
                    const updatedContribution = updatedEmissionEntry.emissionContribution * updatedWeightFactor;   
        
                    // Store the data
                    updatedData.push({
                        seatId,
                        weightFactor: updatedWeightFactor,
                        traveler_id: updatedEmissionEntry.traveler_id,
                        emissionContribution: updatedContribution,
                        name:updatedSeat.traveler,
                        fine: 0
                    });
                }   
            }
        }
    
        // Process calculatedAllocation
        for (const calculatedSeat of calculatedAllocation) {
            const seatId = calculatedSeat.seatId;
    
            let calculatedRow = null;
            let calculatedSeatInfo = null;
    
            for (const rowKey in seatLayout) {
                const currentRow = seatLayout[rowKey];
                calculatedSeatInfo = currentRow.seats.find((s) => s.id === seatId);
                if (calculatedSeatInfo) {
                    calculatedRow = currentRow;
                    break;
                }
            }
    
            if (calculatedRow && calculatedSeatInfo) {
                const calculatedWeightFactor = calculatedRow.weightFactor || 1; // Default to 1 if not defined
                // Find the matching entry in calculatedEmissionData using traveller_id
                const calculatedEmissionEntry = calculatedEmissionData.find(
                    (entry) => entry.traveler_id === calculatedSeat.traveler_id
                );

                if (calculatedEmissionEntry) {
                    const calculatedContribution = calculatedEmissionEntry.emissionContribution * calculatedWeightFactor;
    
                    // Store the data
                    calculatedData.push({
                        seatId,
                        weightFactor: calculatedWeightFactor,
                        traveler_id: calculatedEmissionEntry.traveler_id,
                        emissionContribution: calculatedContribution,
                    });
                }
            }
        }
        // Calculate the fine by comparing both arrays
        for (let i = 0; i < updatedData.length; i++) {
            const updated = updatedData[i];
            const calculated = calculatedData.find((data) => data.traveler_id === updated.traveler_id);
        
            if (calculated) {
                const difference = updated.emissionContribution - calculated.emissionContribution;
                const finePerUnit = 50; // Fine rate per unit difference
                const seatFine = Math.abs(difference) * finePerUnit;
                // Append the fine to the updatedData array
                updated.fine = Math.round(seatFine);
        
                totalFine += seatFine;
            }
        }
        const roundedTotalFine = Math.round(totalFine);
    
        // Return the total fine
        res.status(200).json({
            success: true,
            totalFine:roundedTotalFine,
            updatedData,
            calculatedData,
        });
    } catch (error) {
        console.error('Error calculating fine:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while calculating the fine',
        });
    }    
});

router.post('/updateStatus', async (req, res) => {
    const { seatAllocation, reserve_id, userId } = req.body;  // Extract seatId and new status from the request body
    const status = "Booked";  // The status we want to set for the selected seats
    console.log(userId);

    try {
        // Establish a connection with the MySQL database
        const db = await mysql.createConnection(dbConfig);

        // Query to fetch the current seat layout from the database
        const [results] = await db.execute(
            'SELECT seat_layout FROM aircrafts WHERE aircraft_id = ?',
            [1]  // Replace 1 with the actual ID of the record you want to fetch
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Aircraft not found' });
        }

        let seatLayout = results[0].seat_layout;  // Assuming you're using a column `seat_layout` in `aircrafts`
        let updatedLayout = { ...seatLayout };  // Copy the seat layout for updating
        let updatedSeats = [];  // To track which seats were updated

        // Iterate over the seatAllocation array and find each seat by seatId
        for (const allocation of seatAllocation) {
            const seatId = allocation.seatId;

            let seatUpdated = false;
            // Iterate over the rows and find the seat by seatId
            for (const rowKey in updatedLayout) {
                const row = updatedLayout[rowKey];
                const seatIndex = row.seats.findIndex(seat => seat.id === seatId);

                if (seatIndex !== -1) {
                    // Seat found, update its status
                    updatedLayout[rowKey].seats[seatIndex].status = status;
                    updatedSeats.push(seatId);  // Add to the updated seats list
                    seatUpdated = true;
                    break;  // Exit the loop once the seat is updated
                }
            }

            // If the seat wasn't found, add it to the errors list
            if (!seatUpdated) {
                return res.status(404).json({ message: `Seat ${seatId} not found` });
            }
        }

        // Query to update the seat layout in the database
        await db.execute(
            'UPDATE aircrafts SET seat_layout = ? WHERE aircraft_id = ?',
            [JSON.stringify(updatedLayout), 1]  // Replace 1 with the actual aircraft ID
        );

        // Additional query to update reservation_id in travel_passenger table
        await db.execute(
            'UPDATE travel_passengers SET reservation_id = ? WHERE passenger_id = ?',
            [reserve_id, userId] // Pass the reserve_id and updated seat IDs
        );

        res.status(200).json({ message: 'Seat status updated successfully', updatedSeats });

        // Close the database connection
        await db.end();
    } catch (error) {
        console.error('Error in updateStatus route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
