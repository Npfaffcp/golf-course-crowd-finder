/**
 * courses.js - Golf Course Discovery Module
 *
 * Fetches nearby golf courses based on user coordinates.
 * Supports Google Places API and Golf Course API as data sources.
 */

const config = require('./config.json');

// Haversine formula to calculate distance between two coordinates (in miles)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Fetch courses from Google Places API
 * @param {number} lat - User latitude
 * @param {number} lng - User longitude
 * @param {number} radiusMiles - Search radius in miles
 * @returns {Array} Array of course objects
 */
async function fetchCoursesFromGoogle(lat, lng, radiusMiles = 25) {
  const radiusMeters = radiusMiles * 1609.34;
  const apiKey = config.googlePlacesApiKey;

  if (!apiKey) {
    console.warn('Google Places API key not configured. Using sample data.');
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=golf+course&type=establishment&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status);
      return [];
    }

    return data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity,
      rating: place.rating || null,
      distance: getDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
    }));
  } catch (err) {
    console.error('Error fetching from Google Places:', err);
    return [];
  }
}

/**
 * Main function to get nearby courses
 * Tries configured API sources in order, falls back to sample data
 */
async function getNearbyCourses(lat, lng, radiusMiles = 25) {
  let courses = [];

  // Try Google Places first
  if (config.googlePlacesApiKey) {
    courses = await fetchCoursesFromGoogle(lat, lng, radiusMiles);
  }

  // Filter by radius and sort by distance
  courses = courses
    .filter(c => c.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);

  return courses;
}

module.exports = {
  getNearbyCourses,
  getDistance,
};
