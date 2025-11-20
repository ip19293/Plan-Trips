import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Création d'icônes colorées
const createColoredIcon = (color) => {
  return new L.DivIcon({
    className: "custom-div-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path d="M12.5,0 C19.4035598,0 25,12.5 25,20.5 C25,28.5 12.5,41 12.5,41 C12.5,41 0,28.5 0,20.5 C0,12.5 5.59644018,0 12.5,0 Z" fill="${color}" stroke="#000" stroke-width="1"/>
      <circle cx="12.5" cy="20.5" r="5" fill="white"/>
    </svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  });
};

// Hook pour centrer la carte sur un segment
const FitSegmentBounds = ({ segmentPoints }) => {
  const map = useMap();

  useEffect(() => {
    if (segmentPoints.length > 0) {
      const bounds = L.latLngBounds(segmentPoints);
      map.fitBounds(bounds, { padding: [60, 60] }); // marge autour
    }
  }, [map, segmentPoints]);

  return null;
};

const TripMap = ({ origin, pickup, dropoff, stops }) => {
  if (!origin || !pickup || !dropoff) return null;
  const routeCoords = [
    [origin.lat, origin.lon],
    [pickup.lat, pickup.lon],
    [dropoff.lat, dropoff.lon],
  ];

  // Tous les points pour fitBounds, y compris les stops si présents
  const segmentPoints = [
    [origin.lat, origin.lon],
    [pickup.lat, pickup.lon],
    [dropoff.lat, dropoff.lon],
   ...(stops ? stops.map((s) => [s.location.lat, s.location.lon]) : []),
  ];

  return (
    <MapContainer
      center={[origin.lat, origin.lon]}
      zoom={12} // zoom initial, sera ajusté automatiquement
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route */}
      <Polyline positions={routeCoords} color="blue" />

      {/* Markers colorés */}
      <Marker position={[origin.lat, origin.lon]} icon={createColoredIcon("blue")}>
        <Popup>Origin: {origin.name}</Popup>
      </Marker>
      <Marker position={[pickup.lat, pickup.lon]} icon={createColoredIcon("green")}>
        <Popup>Pickup: {pickup.name}</Popup>
      </Marker>
      <Marker position={[dropoff.lat, dropoff.lon]} icon={createColoredIcon("red")}>
        <Popup>Dropoff: {dropoff.name}</Popup>
      </Marker>

      {/* Stops */}
      {stops &&
        stops.map((stop, idx) => (
          <Marker key={idx} position={[stop.location.lat, stop.location.lon]}>
            {/*<Popup>*/}
            {/*  Stop {idx + 1}: {stop.name} <br />*/}
            {/*  Duration: {stop.duration} min*/}
            {/*</Popup>*/}
          </Marker>
        ))}

      {/* Ajuste automatique sur le segment */}
      <FitSegmentBounds segmentPoints={segmentPoints} />
    </MapContainer>
  );
};

export default TripMap;
