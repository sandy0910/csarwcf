import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/AircraftConfig.css';

const AircraftConfig = ({ aircraftId }) => {
    const [seatLayout, setSeatLayout] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSeatLayout = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/aircraft/seats`);
                const data = Array.isArray(response.data) ? response.data : Object.values(response.data);
                setSeatLayout(data);
            } catch (err) {
                setError("Failed to load seat layout.");
                console.error(err);
            }
        };

        fetchSeatLayout();
    }, [aircraftId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!Array.isArray(seatLayout) || seatLayout.length === 0) {
        return <p>Loading seat layout...</p>;
    }

    const groupedByCabinClass = seatLayout.reduce((acc, row) => {
        const { cabinClass } = row;
        if (!acc[cabinClass]) {
            acc[cabinClass] = [];
        }
        acc[cabinClass].push(row);
        return acc;
    }, {});

    return (
        <div className="seat-map">
            <div className="fuselage">
                {/* Optional Window Decorations */}
                <div className="window left"></div>
                <div className="window right"></div>

                {Object.keys(groupedByCabinClass).map((cabinClass) => (
                    <div key={cabinClass} className={`cabin-section ${cabinClass.toLowerCase()}`}>
                        <h3 className="cabin-class-label">{cabinClass}</h3>
                        {groupedByCabinClass[cabinClass].map((row) => (
                            <div key={row.rowNumber} className="row">
                                <div className="seats">
                                    {row.seats.map((seat) => (
                                        <button
                                            key={seat.id}
                                            className={`seat ${seat.status} ${seat.seatType.replace(" ", "-").toLowerCase()}`}
                                            onClick={() => console.log(`Selected seat: ${seat.id}`)}
                                        >
                                            {seat.id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AircraftConfig;
