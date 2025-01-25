import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

function AllocationPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const { flight, travelers, cabinClass, searchParams } = location.state || {};
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const uid = userData?.uid;
  const [emissionData, setEmissionData] = useState(null);
  const [seatLayout, setSeatLayout] = useState({});
  const [seatAllocation, setSeatAllocation] = useState([]);
  const [error, setError] = useState(null);

  const cabinClassMapping = {
    1: "Economy",
    2: "Premium Economy",
    3: "Business",
    4: "First Class",
    5: "Business Plus",
    6: "Luxury Class",
  };

  const cabinClassName = cabinClassMapping[cabinClass];

  useEffect(() => {
    const fetchSeatLayout = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/aircraft/seats"
        );
        setSeatLayout(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch seat layout.");
      }
    };

    const estimationCalculation = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/estimation/estimated-emission",
          {
            flight,
            travelers,
            uid,
          }
        );
        setEmissionData(response.data); // Save emission data
      } catch (err) {
        console.error(err);
        setError("Failed to calculate emission contribution.");
      }
    };

    if (flight && travelers) {
      estimationCalculation();
      fetchSeatLayout();
    } else {
      setError("Missing flight or traveler data.");
    }
  }, [flight, travelers, uid]);

  useEffect(() => {
    if (
      emissionData &&
      emissionData.travelers &&
      Object.keys(seatLayout).length > 0
    ) {
      const sortedTravelers = [...emissionData.travelers].sort(
        (a, b) => b.emissionContribution - a.emissionContribution
      );

      const availableSeats = [];
      Object.keys(seatLayout).forEach((row) => {
        const rowSeats = seatLayout[row].seats.filter(
          (seat) => seat.status === "available"
        );
        rowSeats.forEach((seat) => {
          availableSeats.push({
            id: seat.id,
            weightFactor: seatLayout[row].weightFactor,
            cabinClass: seatLayout[row].cabinClass,
          });
        });
      });

      const filteredSeats = availableSeats.filter(
        (seat) => seat.cabinClass === cabinClassName
      );

      const sortedSeats = filteredSeats.sort(
        (a, b) => a.weightFactor - b.weightFactor
      );

      const allocations = [];
      let leftPointer = 0;
      let rightPointer = sortedSeats.length - 1;

      sortedTravelers.forEach((traveler, index) => {
        if (index % 2 === 0) {
          allocations.push({
            traveler_id: traveler.traveler_id,
            traveler: traveler.name,
            seatId: sortedSeats[leftPointer]?.id || "N/A",
            contribution: traveler.emissionContribution,
          });
          leftPointer++;
        } else {
          allocations.push({
            traveler_id: traveler.traveler_id,
            traveler: traveler.name,
            seatId: sortedSeats[rightPointer]?.id || "N/A",
            contribution: traveler.emissionContribution,
          });
          rightPointer--;
        }
      });

      setSeatAllocation(allocations);
      console.log("Emission Data: ", emissionData);

      // Navigate to seat-select with parameters after allocation
      navigate("/seat-select", {
        state: {
          flight,
          emissionData : emissionData.travelers,
          searchParams,
          cabinClassName,
          seatAllocation: allocations,
        },
      });
    }
  }, [emissionData, seatLayout, cabinClassName, navigate]); // Add navigate to dependency array

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (!emissionData || Object.keys(seatLayout).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Seat Allocation
      </h1>
      <p className="mb-4">
        Cabin Class:{" "}
        <span className="font-medium text-blue-600">
          {cabinClassMapping[cabinClass] || "Unknown"}
        </span>
      </p>
      <table className="table-auto w-full bg-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2">Traveler</th>
            <th className="px-4 py-2">Emission Contribution</th>
            <th className="px-4 py-2">Allocated Seat</th>
          </tr>
        </thead>
        <tbody>
          {seatAllocation.map((allocation, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}
            >
              <td className="border px-4 py-2">{allocation.traveler}</td>
              <td className="border px-4 py-2">
                {allocation.contribution.toFixed(2)} kg CO₂
              </td>
              <td className="border px-4 py-2">{allocation.seatId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllocationPage;
