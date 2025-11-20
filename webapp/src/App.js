// src/App.jsx
// import React, { useState } from "react";
import CopyImage from './assets/truck_trip.png';

function App() {
//   const [origin, setOrigin] = useState(null);
//   const [pickup, setPickup] = useState(null);
//   const [dropoff, setDropoff] = useState(null);
// const [trip, setTrip] = useState(null);
// const [driver, setDriver] = useState({ name: "Salem", license: "12345" });
// const [vehicle, setVehicle] = useState({ number: "AB-123", vin: "VIN123456" });
//
//   const [tripSaved, setTripSaved] = useState(false); // pour afficher TripMap après save
//
//   // Callback à passer au TripForm
//   const handleTripSaved = (savedTrip) => {
//     // Mettre à jour les locations avec les données retournées par l'API
//     setOrigin(savedTrip.origin);
//     setPickup(savedTrip.pickup);
//     setDropoff(savedTrip.dropoff);
//     setTripSaved(true); // afficher la carte
//   };

  return (
 <div className="flex flex-col md:flex-row items-center justify-between  rounded-lg shadow-md overflow-hidden pl-3" >

  {/* Left content */}
  <div className="md:w-1/4 mb-6 md:mb-0 p-6 " style={{ marginLeft: '200px',paddingTop: '100px'  }} >
    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
      Plan Trips & Generate ELD Logs Instantly
    </h3>
    <p className="text-gray-600 mb-6">
      Enter trip details and get route instructions + ELD logs
    </p>
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition">
      Start Trip
    </button>
  </div>

  {/* Right content */}
  <div className="md:w-2/4 flex justify-center items-center max-h-[600px] " style={{ marginRight: '400px' }}>
    <img
      src={CopyImage}
      alt="Truck illustration"
      className="w-full h-1/2 object-cover"
    />
  </div>
</div>
 //    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
 //      <h1 className="text-2xl font-bold mb-6">Location Input Test</h1>
 //
 //      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
 //        <TripFormForLocation onTripSaved={handleTripSaved} />
 //      </div>
 //
 //      {/* Affichage conditionnel de la map après sauvegarde */}
 //      {tripSaved && origin && pickup && dropoff && (
 //        <div className="w-full max-w-4xl mt-6">
 //          <TripMap
 //            origin={origin}
 //            pickup={pickup}
 //            dropoff={dropoff}
 //            stops={[
 //              { lat: 40.7128, lon: -74.006, name: "Rest Stop 1", duration: 30 },
 //              { lat: 40.73061, lon: -73.935242, name: "Lunch Break", duration: 60 },
 //            ]}
 //          />
 //        </div>
 //
 //      )}
 //        <div className="w-full max-w-4xl mt-6">
 // <TruckIcon color="blue" width={80} height={80} />
 //
 //        </div>
 //    </div>
  );
}

export default App;
