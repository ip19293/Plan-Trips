
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return (
    <Marker
      draggable={true}
      position={position}
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  );
}

export default function LocationPickerModal({ open, onClose, onSelect }) {
  const [position, setPosition] = useState({ lat: 48.8566, lng: 2.3522 });

  useEffect(() => {
    if (open) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">Select Location</h2>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
        <div className="flex justify-end mt-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => onSelect(position)}
          >
            Select Location
          </button>
        </div>
      </div>
    </div>
  );
}
