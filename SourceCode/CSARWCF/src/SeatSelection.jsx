import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./css/SeatSelection.css";

function SeatSelection() {
    const [seatLayout, setSeatLayout] = useState({});
    const [error, setError] = useState("");
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [emissionData, setEmissionData] = useState([]);
    const [seatAllocation, setSeatAllocation] = useState([]);
    const [originalAllocations, setOriginalAllocations] = useState({});
    const [extraCharges, setExtraCharges] = useState(null);
    const [previousUpdatedData, setPreviousUpdatedData] = useState([]);
    const location = useLocation();
    
    const { flight, emissionData: initialEmissionData, searchParams, cabinClassName, seatAllocation: initialSeatAllocation } =
        location.state || {};

        useEffect(() => {
            // Only set originalAllocations once when seatAllocation is first initialized
            if (initialSeatAllocation && Object.keys(originalAllocations).length === 0) {
                setOriginalAllocations(initialSeatAllocation);
            }
        }, [initialSeatAllocation, originalAllocations]);

    useEffect(() => {
        const fetchSeatLayout = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/aircraft/seats");
                setSeatLayout(response.data);
            } catch (err) {
                setError("Failed to load seat layout.");
                console.error(err);
            }
        };

        fetchSeatLayout();
        setEmissionData(initialEmissionData || []);
        setSeatAllocation(initialSeatAllocation || []);
    }, [initialEmissionData, initialSeatAllocation]);

    const [totalFine, setTotalFine] = useState(0);  // State for storing total fine

    useEffect(() => {
        // Calculate total fine when previousUpdatedData changes
        const calculatedTotalFine = previousUpdatedData.reduce(
            (total, travelerData) => total + travelerData.fine, 0
        );
        setTotalFine(calculatedTotalFine);  // Update total fine state
    }, [previousUpdatedData]);


    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const [scale, setScale] = useState(false);

    // Set up interval to trigger scale effect every 30 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setScale((prev) => !prev); // Toggle scale state every 30 seconds
      }, 10000); // 30 seconds
  
      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }, []);
  
  

    const handleProceed = () => {
        // Store necessary state (like emissionData, seatAllocation) if needed
        navigate('/nextPage', {
          state: {
            emissionData: emissionData,
            seatAllocation: seatAllocation,
          },
        });
      };
    
    const handleSeatClick = (seat) => {
        const isAllocatedSeat = seatAllocation.some((allocation) => allocation.seatId === seat.id);
        if (!isAllocatedSeat) {
            setSelectedSeat(seat);
            setShowOverlay(true);
        }
    };

    const handleTravelerSelection = async (traveler) => {

        const originalAllocation = originalAllocations.find(
            (allocation) => allocation.traveler_id === traveler.traveler_id
        );
        
        if (!originalAllocation) {
            console.error("Original seat not found for traveler");
            return;
        }
        
        const updatedSeatAllocation = seatAllocation.map((allocation) => 
            allocation.traveler_id === originalAllocation.traveler_id
            ? {...allocation, seatId: originalAllocation.seatId}
            : allocation
        );

        const updatedAllocation = updatedSeatAllocation.map((allocation) =>
            allocation.traveler === traveler.name
                ? { ...allocation, seatId: selectedSeat.id }
                : allocation
        );

        const updatedEmissionData = emissionData.map((trav) =>
            trav.name === traveler.name ? { ...trav, allocatedSeat: selectedSeat.id } : trav
        );

        const calculatedAllocation = updatedSeatAllocation;
        const calculatedEmissionData = emissionData;

        try {

            const response = await axios.post("http://localhost:3001/api/aircraft/price-calculate", {
                updatedAllocation,
                updatedEmissionData,
                calculatedAllocation,
                calculatedEmissionData
            });

            
            if (response.status === 200) {
                const { updatedData } = response.data;
                console.log(updatedData);
        
                setPreviousUpdatedData((prevData) => {
                    // Make a copy of the previous data
                    const updatedList = [...prevData];
                
                    // Iterate through updatedData
                    updatedData.forEach((newEntry) => {
                        // Check if the newEntry's traveler_id matches the provided traveler's traveler_id
                        if (traveler.traveler_id === newEntry.traveler_id) {
                            // Find the existing entry in updatedList
                            const existingEntryIndex = updatedList.findIndex(
                                (entry) => entry.traveler_id === newEntry.traveler_id
                            );
                
                            if (existingEntryIndex !== -1) {
                                // Update the existing entry
                                updatedList[existingEntryIndex] = {
                                    ...updatedList[existingEntryIndex],
                                    fine: newEntry.fine,
                                    emissionContribution: newEntry.emissionContribution,
                                    weightFactor: newEntry.weightFactor,
                                    seatId: newEntry.seatId
                                };
                            } else {
                                // Add the new entry to the list
                                updatedList.push(newEntry);
                            }
                        }
                    });
                
                    return updatedList; // Return the updated list
                });
            }
        } catch (err) {
            console.error(err);
        }

        setSeatAllocation(updatedAllocation);
        setEmissionData(updatedEmissionData);

        setShowOverlay(false);
        setSelectedSeat(null);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!seatLayout || Object.keys(seatLayout).length === 0) {
        return <p>Loading seat layout...</p>;
    }

    console.log(totalFine);

    return (
        <div className="seat-selection-container">
            <h2>Select Your Seat</h2>
            <div className="seat-map">
                {/* Pilot Seats Section */}
                <div className="pilot-seats">
                    <h3>Pilot Seats</h3>
                    <div className="pilot-seat">
                        <button className="seat available">P</button>
                    </div>
                </div>

                {/* Facilities Section */}
                <div className="facilities">
                    <div className="facility">
                        <span className="facility-icon">🚻</span>
                    </div>
                    <div className="facility">
                        <span className="facility-icon">🧳</span>
                    </div>
                    <div className="facility">
                        <span className="facility-icon">🍽️</span>
                    </div>
                </div>

                {/* Doors Section */}
                <div className="doors">
                    <div className="door left-door">🚪D1</div>
                    <div className="door right-door">🚪D2</div>
                </div>

                {/* Crew Seats */}
                <div className="crew-seats">
                    <button className="seat crew-seat">C</button>
                    <button className="seat crew-seat">C</button>
                </div>

                {/* Passenger Seat Layout */}
                {Object.keys(seatLayout).map((row, index) => {
                    const { cabinClass, columns, seats, facilities } = seatLayout[row] || {};

                    if (!columns || !seats) {
                        return <p key={row}>Invalid data for row {row}</p>;
                    }

                    const columnSeats = Array.from({ length: columns }, () => []);
                    seats.forEach((seat) => {
                        if (seat && seat.column) {
                            columnSeats[seat.column - 1].push(seat);
                        }
                    });

                    return (
                        <div key={row} className="row">
                            <h4 className="row-label">
                                Row {row} ({cabinClass})
                            </h4>

                            {/* Render Facilities if any */}
                            {facilities && Object.keys(facilities).length > 0 && facilities.column === "all" && (
                                <div className="row-facilities">
                                    {Object.keys(facilities)
                                        .filter(
                                            (facilityKey) =>
                                                facilityKey !== "column" && facilityKey !== "position"
                                        )
                                        .map((facilityKey, idx) => {
                                            const facilityCount = facilities[facilityKey];
                                            return (
                                                <div key={idx} className="facility">
                                                    {Array.from({ length: facilityCount }).map((_, index) => (
                                                        <span key={index} className="facility-image">
                                                            {getFacilityImage(facilityKey)}
                                                        </span>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}

                            {/* Render Columns (Seats and Facilities) */}
                            <div className="columns">
                                {columnSeats.map((column, columnIndex) => (
                                    <div key={columnIndex} className="column">
                                        {/* Render the seats in the column */}
                                        {column.map((seat) => {
                                            const isAllocatedSeat = seatAllocation.some(
                                                (allocation) => allocation.seatId === seat.id
                                            );

                                            return (
                                                <button
                                                    key={seat.id}
                                                    className={`seat ${seat.status} ${seat.seatType
                                                        .replace(" ", "-")
                                                        .toLowerCase()} ${isAllocatedSeat ? "allocated-seat" : ""}`}
                                                    onClick={() => handleSeatClick(seat)}
                                                >
                                                    {seat.id}
                                                </button>
                                            );
                                        })}

                                        {/* Place facility in the specified column at the same level */}
                                        {facilities &&
                                            (facilities.position === null || facilities.position === undefined) &&
                                            parseInt(facilities.column) === columnIndex + 1 && (
                                                <div className="facility" style={{ marginTop: 10 }}>
                                                    {Object.keys(facilities)
                                                        .filter(
                                                            (facilityKey) =>
                                                                facilityKey !== "column" && facilityKey !== "position"
                                                        )
                                                        .map((facilityKey, idx) => {
                                                            const count = facilities[facilityKey];
                                                            return [...Array(count)].map((_, i) => (
                                                                <span key={i} className="facility-image">
                                                                    {getFacilityImage(facilityKey)}
                                                                </span>
                                                            ));
                                                        })}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="relative">
      {/* Traveler Details Section */}
      {emissionData && (
        <div className="traveler-details-container p-4 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">Traveler Details</h2>
          <div className="traveler-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {emissionData.map((traveler, index) => (
              <div key={index} className="traveler-card bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                <h4 className="traveler-name text-lg font-bold mb-2">Name: {traveler.name}</h4>
                <p className="text-gray-700">Emission Contribution: {traveler.emissionContribution.toFixed(2)} kg CO₂</p>
                <p className="text-gray-700">
                  Allocated Seat:{" "}
                  {seatAllocation.find(
                    (allocation) => allocation.traveler === traveler.name
                  )?.seatId || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Proceed Button */}
      <button
        onClick={handleProceed}
        className={`fixed bottom-8 right-0 m-4 bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform ${
          scale ? 'scale-130' : 'scale-100'
        }`}
      >
        Proceed
      </button>
    </div>

        {/* Floating Message for Extra Charges */}
        {previousUpdatedData.length > 0 && (
            <div className="fixed top-5 right-5 bg-black text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100 hover:scale-105 hover:opacity-90">
                <h3 className="text-lg font-semibold">Seat preference charges</h3>
                <p>Base amount: ₹ {flight.price_per_seat}</p>
                {previousUpdatedData.map((travelerData) => (
                    <p key={travelerData.traveler_id} className="font-bold">
                        {travelerData.name}: ₹ {travelerData.fine}
                    </p>
                ))}
                <p>Total Charged amount: ₹ {totalFine}</p>
            </div>
        )}

        <div className="fixed top-5 left-5 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100 hover:scale-105 hover:opacity-90 border-2 border-white">
            {/* Icon Button to Toggle Seat Map Key */}
            <div className="flex justify-end">
                <button onClick={togglePanel} className="bg-white text-blue-500 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.93 4.58c0-.35.1-.66.29-.93.19-.28.46-.43.76-.43s.57.15.76.43c.19.27.29.58.29.93s-.1.66-.29.93c-.19.28-.46.43-.76.43s-.57-.15-.76-.43a1.33 1.33 0 0 1-.29-.93zm-.24 3.88h1.7V9.4H7.69v-.98c0-.19.04-.35.12-.47.08-.12.2-.19.34-.19s.27.07.34.19c.08.12.12.28.12.47v.98h1.7v-.98c0-.66-.19-1.21-.56-1.58-.37-.37-.87-.56-1.44-.56-.57 0-1.07.19-1.45.56-.37.37-.56.92-.56 1.58v.98z"/>
                    </svg>
                </button>
            </div>

            {/* Seat Map Key Panel */}
            {isPanelOpen && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-4">Seat Map Key</h3>

                    {/* Display color codes with proper gaps */}
                    <div className="mt-4">
                        <p className="font-medium text-sm mb-3">
                            <span className="inline-block w-4 h-4" style={{ backgroundColor: '#ff3232' }}></span> BAD SEAT
                        </p>
                        <p className="font-medium text-sm mb-3">
                            <span className="inline-block w-4 h-4" style={{ backgroundColor: '#b9f5ab' }}></span> MIXED REVIEW
                        </p>
                        <p className="font-medium text-sm mb-3">
                            <span className="inline-block w-4 h-4" style={{ backgroundColor: '#ffff8e' }}></span> BE AWARE
                        </p>
                        <p className="font-medium text-sm mb-3">
                            <span className="inline-block w-4 h-4" style={{ backgroundColor: '#ffe9f5' }}></span> STANDARD SEAT
                        </p>
                    </div>

                    {/* Display facilities with images */}
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">Facilities Available</h4>
                        <div className="flex flex-wrap justify-start mt-2 space-x-4">
                            {['Lavatory', 'Galley', 'Closet', 'bassinet', 'crew'].map((facilityKey, i) => (
                                <span key={i} className="flex flex-col items-center mb-4 sm:mb-0">
                                    {getFacilityImage(facilityKey)}
                                    <span className="text-xs mt-2">{facilityKey}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Overlay Pop-Up */}
        {showOverlay && selectedSeat && (
            <div className="seat-overlay">
                <div className="seat-overlay-content">
                    <h3>Select a Traveler for Seat {selectedSeat.id}</h3>
                    {emissionData.map((traveler) => (
                        <button
                            key={traveler.name}
                            className="overlay-traveler-button"
                            onClick={() => handleTravelerSelection(traveler)}
                        >
                            {traveler.name}
                        </button>
                    ))}
                    <button className="close-overlay" onClick={() => setShowOverlay(false)}>
                        Close
                    </button>
                </div>
            </div>
        )}
        </div>
    );
}

function getFacilityImage(facilityKey) {
    const facilityImages = {
        Lavatory: "/facilities/lavatory.png",
        Galley: "/facilities/galley.png",
        Closet: "/facilities/closet.png",
        bassinet: "/facilities/bassinet.png",
        crew: "/facilities/crew.png"

    };

    return facilityImages[facilityKey] ? (
        <img
            src={facilityImages[facilityKey]}
            alt={facilityKey}
            className="w-8 h-8 object-contain" 
        />
    ) : null;
}

export default SeatSelection;
