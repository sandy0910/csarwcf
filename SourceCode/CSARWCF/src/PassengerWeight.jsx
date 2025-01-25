import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for unique IDs

function PassengerWeight() {
  const location = useLocation();
  const { flight, searchParams } = location.state || {};
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const uid = userData?.uid; // Extract the uid from the session data
  const [travelers, setTravelers] = useState(
    Array.from({ length: searchParams.travellers || 0 }, () => ({
      traveler_id: uuidv4(), // Generate unique ID for each traveler
      name: "",
      weight: "",
    }))
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = field === "weight" ? parseInt(value, 10) : value; // Ensure weight is an integer
    setTravelers(updatedTravelers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/travellers/traveller-details", {
        flight,
        travelers,
        uid,
      });

      if (response.status === 200) {
        navigate("/allocation-page", { state: { flight, travelers, cabinClass: searchParams.classID, searchParams } });
      }
    } catch (err) {
      setError("Failed to submit traveler data.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Enter Travelers' Details
        </h2>
        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {travelers.map((traveler, index) => (
            <div
              key={traveler.traveler_id} // Use traveler_id as the unique key
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div>
                <label
                  htmlFor={`name-${index}`}
                  className="block text-gray-700 font-medium mb-1"
                >
                  Traveler {index + 1} Name
                </label>
                <input
                  id={`name-${index}`}
                  type="text"
                  value={traveler.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label
                  htmlFor={`weight-${index}`}
                  className="block text-gray-700 font-medium mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  id={`weight-${index}`}
                  type="number"
                  value={traveler.weight}
                  onChange={(e) =>
                    handleInputChange(index, "weight", e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter weight"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default PassengerWeight;
