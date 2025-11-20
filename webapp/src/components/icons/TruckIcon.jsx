// TruckIcon.jsx
import React from "react";

const TruckIcon = ({ width = 50, height = 50, color = "#000" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="30" width="40" height="20" fill={color} />
      <rect x="42" y="36" width="18" height="14" fill={color} />
      <circle cx="12" cy="52" r="4" fill="#555" />
      <circle cx="38" cy="52" r="4" fill="#555" />
      <circle cx="52" cy="52" r="4" fill="#555" />
      <rect x="40" y="28" width="4" height="8" fill="#888" />
    </svg>
  );
};

export default TruckIcon;
