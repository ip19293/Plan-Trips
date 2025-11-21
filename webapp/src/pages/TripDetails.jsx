
import React, { useState } from "react";
import LocationPickerModal from "../components/dialog/LocationPickerModal";
import {getLocationName} from "../utils/reverseGeocode";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/outline"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useNavigate } from "react-router-dom";
export default function TripDetails({

  onTripSaved, // <-- ajouter ici
}){
    const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [origin, setOrigin] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);

const [startDatetime, setStartDatetime] = useState(new Date());

// End datetime = start + 24h
const initialEnd = new Date();
initialEnd.setHours(initialEnd.getHours() + 24);

const [endDatetime, setEndDatetime] = useState(
  initialEnd.toISOString().slice(0, 16)
);
  const handleOpenModal = (field) => {
    setCurrentField(field);
    setModalOpen(true);
  };

  const handleSelect =  async (loc) => {
      const name = await getLocationName(loc.lat, loc.lng);
      if (currentField === "origin") setOrigin({...loc, name});
      if (currentField === "pickup") setPickup({...loc, name});
      if (currentField === "dropoff") setDropoff({...loc, name});
      setModalOpen(false);
  };

 const handleSaveTrip = async () => {
  try {
    // Fonction pour créer une location dans le backend
    const saveLocation = async (loc) => {
      if (!loc) return null; // si pas sélectionné
      // Si la location a déjà un id, on suppose qu'elle est déjà sauvegardée
      if (loc.id) return loc;
      const response = await fetch("http://localhost:8000/eld/locations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: loc.name || "",
          lat: loc.lat,
          lon: loc.lng,
          address: loc.name || "",
        }),
      });
      const saved = await response.json();

      return saved;
    };

    // Sauvegarde toutes les locations
    const savedOrigin = await saveLocation(origin);
    const savedPickup = await saveLocation(pickup);
    const savedDropoff = await saveLocation(dropoff);

    // Ensuite tu peux créer le trip avec les IDs des locations
    const tripResponse = await fetch("http://localhost:8000/eld/trips/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver: 1,
        start_datetime: startDatetime.toISOString(),
        // end_datetime: startDatetime.toISOString(),
        origin: savedOrigin?.id || null,
        pickup: savedPickup?.id || null,
        dropoff: savedDropoff?.id || null,
        status: "planned",
        vehicle: 1,
        total_miles_estimate: null,
        assumptions: {},
        is_interstate: true,
        assumed_adverse_conditions: false,
        short_haul_exception_used: null,
        time_base: "UTC",
      }),
    });
 // après avoir récupéré la réponse
const savedTrip = await tripResponse.json();

// Convertir les locations si nécessaire
const formattedTrip = {
  ...savedTrip,
  origin: savedOrigin,  // {id, name, lat, lng, address}
  pickup: savedPickup,
  dropoff: savedDropoff,
};

// Appel de la callback pour le parent
if (onTripSaved) onTripSaved(formattedTrip);
 console.warn("Trip JSON to send:", savedTrip);
    // 🔹 Naviguer vers Trip Summary
      navigate(`/trip-summary/${savedTrip.id}`, { state: { trip: formattedTrip } });

  } catch (error) {
    console.error("Error saving trip:", error);
    alert("Error saving trip! See console.");
  }
};


return (
<div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-none space-y-6">
  {/* Top Title */}
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
    Enter Trip Details
  </h1>

 {/* Date & Time */}
<div className="grid grid-cols-1 gap-4">
  <div className="relative flex flex-col">
    {/* Icone à gauche */}
      <CalendarIcon className="w-5 h-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

      <Flatpickr
           placeholder="Start date time..."
        data-enable-time
        value={startDatetime}
         onChange={(selectedDates) => {
    if (selectedDates.length > 0) setStartDatetime(selectedDates[0]);
  }}
        className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        options={{
          enableTime: true,
          dateFormat: "Y-m-d H:i",
        }}
      />
  </div>
</div>

{/* Locations */}
<div className="grid grid-cols-1 gap-4">
  {/* Origin */}
  <div className="relative flex flex-col">
    <MapPinIcon className="w-5 h-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      readOnly
      placeholder="Select origin..."
      value={origin ? `${origin.name}` : ""}
      className="pl-10 p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => handleOpenModal("origin")}
    />
  </div>

  {/* Pickup */}
  <div className="relative flex flex-col">
    <MapPinIcon className="w-5 h-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      readOnly
      placeholder="Select pickup..."
      value={pickup ? `${pickup.name}` : ""}
      className="pl-10 p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => handleOpenModal("pickup")}
    />
  </div>

  {/* Dropoff */}
  <div className="relative flex flex-col">
    <MapPinIcon className="w-5 h-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      readOnly
      placeholder="Select dropoff..."
      value={dropoff ? `${dropoff.name}` : ""}
      className="pl-10 p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => handleOpenModal("dropoff")}
    />
  </div>
</div>

  {/* Save Button */}
  <div className="flex justify-center">
    <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
      onClick={handleSaveTrip}
    >
      Generate Trip & Logs
    </button>
  </div>

  {/* Modal */}
  <LocationPickerModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    onSelect={handleSelect}
  />
</div>

);

}
