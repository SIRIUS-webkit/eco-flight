"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { airportData } from "../../utils/airport";
import Button from "@/components/common/Button";

interface FormInputs {
  departure: string;
  destination: string;
  passengers: number;
  tripType: "direct" | "round";
}

interface Airport {
  Name: string;
  City: string;
  Country: string;
  IATA: string;
}

interface EmissionResult {
  departure: string;
  destination: string;
  passengers: number;
  tripType: string;
  emission: number;
}

const CarbonEmissionPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [focusedField, setFocusedField] = useState<
    "departure" | "destination" | null
  >(null);
  const [result, setResult] = useState<EmissionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchAirports = (
    query: string,
    field: "departure" | "destination"
  ) => {
    if (!query) {
      setFilteredAirports([]);
      return;
    }

    const results = airportData.filter(
      (airport) =>
        airport.Name.toLowerCase().includes(query.toLowerCase()) ||
        airport.City.toLowerCase().includes(query.toLowerCase()) ||
        airport.Country.toLowerCase().includes(query.toLowerCase()) ||
        airport.IATA.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredAirports(results.slice(0, 10)); // Limit results for better UI
    setFocusedField(field);
  };

  const extractIATACode = (airportString: string): string | null => {
    const match = airportString.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  };

  const handleSelectAirport = (
    airport: Airport,
    field: "departure" | "destination"
  ) => {
    setValue(field, `${airport.Name} (${airport.IATA})`);
    setFilteredAirports([]);
    setFocusedField(null);
  };

  const sendEmissionDataToContract = async (
    dpIATA: string,
    desIATA: string,
    passenger: number,
    tripType: string,
    emissionRate: number
  ) => {
    try {
      setLoading(true);

      setResult({
        departure: dpIATA,
        destination: desIATA,
        passengers: passenger,
        tripType,
        emission: emissionRate,
      });
    } catch (error) {
      console.error("Error calculating carbon emission:", error);
    } finally {
      reset({
        departure: "",
        destination: "",
        passengers: undefined,
        tripType: "direct",
      });
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.departure && data.destination) {
      const departureIATA = extractIATACode(data.departure);
      const destinationIATA = extractIATACode(data.destination);

      if (!departureIATA || !destinationIATA) {
        alert("Invalid airport selection. Please choose from the dropdown.");
        return;
      }

      const apiUrl = `https://carbon-emission-nine.vercel.app/api/calculate-emission?departure=${departureIATA}&destination=${destinationIATA}&passengers=${data.passengers}&tripType=${data.tripType}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const emissionData = await response.json();

        await sendEmissionDataToContract(
          departureIATA,
          destinationIATA,
          data.passengers,
          data.tripType,
          emissionData.data.emission
        );
      } catch (error) {
        console.error("Error fetching emission data:", error);
      }
    } else {
      alert("Please select both departure and destination airports.");
    }
  };

  return (
    <div className="max-w-[990px] mx-auto p-4 shadow-md rounded-md my-10">
      <h1 className="text-3xl font-bold mb-6">Calculate Carbon Emission</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Departure Airport Search */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Departure Airport</span>
          </label>
          <input
            type="text"
            {...register("departure", { required: "Departure is required" })}
            onFocus={() => setFocusedField("departure")}
            onChange={(e) => searchAirports(e.target.value, "departure")}
            className="input input-bordered"
            placeholder="Search by name, city, country, or IATA code"
          />
          {errors.departure && (
            <p className="text-red-500 p4">{errors.departure.message}</p>
          )}
          {focusedField === "departure" && (
            <ul className="bg-white shadow rounded">
              {filteredAirports.map((airport) => (
                <li
                  key={airport.IATA}
                  onClick={() => handleSelectAirport(airport, "departure")}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {airport.Name} ({airport.IATA}) - {airport.City},{" "}
                  {airport.Country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Airport Search */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Destination Airport</span>
          </label>
          <input
            type="text"
            {...register("destination", {
              required: "Destination is required",
            })}
            onFocus={() => setFocusedField("destination")}
            onChange={(e) => searchAirports(e.target.value, "destination")}
            className="input input-bordered"
            placeholder="Search by name, city, country, or IATA code"
          />
          {errors.destination && (
            <p className="text-red-500 p4">{errors.destination.message}</p>
          )}
          {focusedField === "destination" && (
            <ul className="bg-white shadow rounded">
              {filteredAirports.map((airport) => (
                <li
                  key={airport.IATA}
                  onClick={() => handleSelectAirport(airport, "destination")}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {airport.Name} ({airport.IATA}) - {airport.City},{" "}
                  {airport.Country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Passengers */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Number of Passengers</span>
          </label>
          <input
            type="number"
            {...register("passengers", {
              required: "Number of passengers is required",
              min: { value: 1, message: "Must be at least 1 passenger" },
            })}
            className="input input-bordered"
            placeholder="Enter number of passengers"
          />
          {errors.passengers && (
            <p className="text-red-500 p4">{errors.passengers.message}</p>
          )}
        </div>

        {/* Trip Type */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Trip Type</span>
          </label>
          <select
            {...register("tripType", { required: "Trip type is required" })}
            className="select select-bordered"
          >
            <option value="direct">Direct</option>
            <option value="round">Round Trip</option>
          </select>
          {errors.tripType && (
            <p className="text-red-500 p4">{errors.tripType.message}</p>
          )}
        </div>
        <div className="form-control justify-end items-end">
          <Button
            type="submit"
            cls="btn btn-primary"
            disabled={loading}
            text={loading ? "Calculating" : "Calculate Emission"}
          />
        </div>
      </form>

      {/* Display Result */}
      {result && (
        <div className="mt-6 p-4 bg-base-100 rounded shadow">
          <h2 className="text-xl font-bold">Emission Result</h2>
          <p>
            From {result.departure} to {result.destination}:
          </p>
          <p className="text-lg">Passengers: {result.passengers}</p>
          <p>Trip Type: {result.tripType}</p>
          <p>Carbon Emission: {(result.emission / 100).toFixed(2)} kg CO₂</p>
        </div>
      )}
    </div>
  );
};

export default CarbonEmissionPage;
