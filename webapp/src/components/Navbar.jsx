import {useState} from "react";
// Heroicons v2
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AppLogo from "../assets/truck_illustration.svg";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + title */}
          <div className="flex items-center">
            <img src={AppLogo} alt="App Logo" className="h-8 w-8 mr-2" />
            <Link to="/" className="text-xl font-bold text-gray-800">
              MyELDApp
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/trip-details" className="text-gray-700 hover:text-blue-600">
             Add Trip
            </Link>
            <Link to="/trip-summary/1" className="text-gray-700 hover:text-blue-600">
              Trip Summary
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}

            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/trip-details"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Add Trip
          </Link>
          <Link
            to="/trip-summary/1"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Trip Summary
          </Link>
        </div>
      )}
    </nav>
  );
}
