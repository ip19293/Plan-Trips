
import React, { useState } from "react";
import LocationPickerModal from "../dialog/LocationPickerModal";
import {getLocationName} from "../utils/reverseGeocode";


export default function TripFormForLocation({

  onTripSaved, // <-- ajouter ici
}){
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [origin, setOrigin] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
const [startDatetime, setStartDatetime] = useState(
  new Date().toISOString().slice(0, 16) // format "YYYY-MM-DDTHH:MM" pour input
);
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
        start_datetime: new Date(startDatetime).toISOString(), // conversion en ISO
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
         end_datetime: new Date(startDatetime).toISOString(), // conversion en ISO
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
   // alert("Trip saved! Check console for details.");

  } catch (error) {
    console.error("Error saving trip:", error);
    alert("Error saving trip! See console.");
  }
};


return (
  <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
<div className="flex flex-col mb-3">
  <label className="mb-1 font-semibold">Start Date & Time</label>
  <input
    type="datetime-local"
    className="form-control p-2 border rounded"
    value={startDatetime}
    onChange={(e) => setStartDatetime(e.target.value)}
  />
</div>


<div className="flex flex-col mb-3">
  <label className="mb-1 font-semibold">End Date & Time</label>
  <input
    type="datetime-local"
    className="form-control p-2 border rounded"
    value={endDatetime}
    onChange={(e) => setEndDatetime(e.target.value)}
  />
</div>
    {/* Origin */}
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">Start locotion</label>
      <input
        readOnly
        placeholder="Select origin..."
        value={origin ? `${origin.name}` : ""}
        className="form-control p-2 border rounded"
        onClick={() => handleOpenModal("origin")}
      />
    </div>

    {/* Pickup */}
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">Pickup location</label>
      <input
        readOnly
        placeholder="Select pickup..."
        value={pickup ? `${pickup.name}` : ""}
        className="form-control p-2 border rounded"
        onClick={() => handleOpenModal("pickup")}
      />
    </div>

    {/* Dropoff */}
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">Dropoff location</label>
      <input
        readOnly
        placeholder="Select dropoff..."
        value={dropoff ? `${dropoff.name}` : ""}
        className="form-control p-2 border rounded"
        onClick={() => handleOpenModal("dropoff")}
      />
    </div>

    {/* Save button */}
    <button
      className="px-4 py-2 bg-green-500 text-white rounded mt-4"
      onClick={handleSaveTrip}
    >
      Save Trip
    </button>

    {/* Modal */}
    <LocationPickerModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      onSelect={handleSelect}
    />
  </div>
);

}
