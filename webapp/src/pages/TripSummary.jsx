import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripMap from "../components/TripMap";
import generateFromTemplate from "../components/pdf/generateFromTemplate";

export default function TripSummary() {
  const { id } = useParams(); // trip ID depuis URL
  const [trip, setTrip] = useState(null);
   const [driver, setDriver] = useState(null);
    const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:8000/eld/trips/${id}/`);
      const data = await res.json();
console.warn('trips ...',data);
      // Charger origin, pickup, dropoff (si l’API ne retourne pas les objets)
      const loadLocation = async (locId) => {
        if (!locId) return null;
        const r = await fetch(`http://localhost:8000/eld/locations/${locId.id}/`);
        return await r.json();
      };

      const origin = data.origin;
      const pickup = data.pickup;
      const dropoff = data.dropoff;

      setTrip({
        ...data,
        origin,
        pickup,
        dropoff,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error loading trip:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading trip...</p>;
  if (!trip) return <p className="text-red-500">Trip not found.</p>;

  return (
    <div className="p-6 space-y-4 ">
      <h1 className="text-2xl font-bold">Trip Summary</h1>

      <div className="bg-white shadow-none p-4 rounded-lg ">
        <p>
  <strong>Start:</strong>{" "}
  {trip.start_datetime
    ? new Date(trip.start_datetime).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : ""}
</p>

        <p><strong>Status:</strong> {trip.status}</p>
      </div>

      <TripMap
        origin={trip.origin}
        pickup={trip.pickup}
        dropoff={trip.dropoff}
        stops={trip.stops || []}
      />
<div className="flex space-x-4">
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
    onClick={() => generateFromTemplate(trip, driver, vehicle)}
  >
    Download PDF
  </button>

  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
  >
    Edit Trip
  </button>
</div>

    </div>
  );
}
