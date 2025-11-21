
import CopyImage from '../assets/truck_trip.png';
import { Link } from "react-router-dom";
import {useState} from "react";
import TripDetails from "./TripDetails";
function HomePage() {
 const [showTripForm, setShowTripForm] = useState(false);
  return (
 <div className="flex flex-col md:flex-row items-center justify-between  rounded-lg shadow-non overflow-hidden pl-3" >

  {/* Left content */}
  <div className={`md:w-1/2 p-6 transition-all duration-500 ease-in-out
        ${showTripForm ? "opacity-0 translate-x-[-100%] absolute left-0 top-0" : "opacity-100 translate-x-0 relative"}`} style={{ marginLeft: '200px',paddingTop: '100px'  }} >
    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
      Plan Trips & Generate ELD Logs Instantly
    </h3>
    <p className="text-gray-600 mb-6">
      Enter trip details and get route instructions + ELD logs
    </p>
        <button
          onClick={() => setShowTripForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          Start Trip
        </button>

  </div>
 {/* Left content 2 - Trip Details Form */}
      <div className={`md:w-1/2 p-6 transition-all duration-500 ease-in-out
        ${showTripForm ? "opacity-100 translate-x-0 relative" : "opacity-0 translate-x-[100%] absolute left-0 top-0"}`}  style={{ marginLeft: '200px',paddingTop: '100px'  }}>
        <TripDetails />
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
  );
}

export default HomePage;


