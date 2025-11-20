
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TripDetails from "./pages/TripDetails";
import HomePage from "./pages/HomePage";
import TripMap from "./components/TripMap";
import TripSummary from "./pages/TripSummary";
import Navbar from "./components/Navbar";
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
       <BrowserRouter>
            <Navbar />
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<HomePage />} />

        {/* Nouvelle page */}
        <Route path="/trip-details" element={<TripDetails />} />
           <Route path="/trip-summary/:id" element={<TripSummary/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
