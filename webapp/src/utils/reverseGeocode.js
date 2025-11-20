
export async function getLocationName(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    return data.display_name || "";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "";
  }
}
