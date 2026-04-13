/**
 * pricing.js - Tee Time Pricing Module
 *
 * Fetches real-time tee time availability and pricing for golf courses.
 * Designed to integrate with GolfNow API, Tee Time Gateway, or similar.
 */

const config = require('./config.json');

/**
 * Fetch tee times and pricing for a specific course
 * @param {string} courseId - The course identifier
 * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
 * @returns {Object} Pricing and availability data
 */
async function getTeeTimes(courseId, date = null) {
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }

  // TODO: Replace with real tee-time API integration
  // Example with GolfNow or Tee Time Gateway:
  // const apiKey = config.teeTimeApiKey;
  // const url = `https://api.teetimegateway.com/v1/courses/${courseId}/times?date=${date}`;
  // const response = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } });
  // return await response.json();

  // For MVP, return structured placeholder
  console.warn(`Pricing API not configured. Returning placeholder for course: ${courseId}`);
  return {
    courseId,
    date,
    teeTimes: [],
    pricePerPlayer: null,
  };
}

/**
 * Get the lowest available price per player for a course today
 * @param {string} courseId
 * @returns {number|null} Lowest price or null if unavailable
 */
async function getLowestPrice(courseId) {
  const data = await getTeeTimes(courseId);

  if (!data.teeTimes || data.teeTimes.length === 0) {
    return data.pricePerPlayer || null;
  }

  const prices = data.teeTimes
    .map(t => t.pricePerPlayer)
    .filter(p => p !== null && p !== undefined);

  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Get available tee time slots for the next N hours
 * @param {string} courseId
 * @param {number} hours - Number of hours to look ahead
 * @returns {Array} Available tee time slots
 */
async function getUpcomingSlots(courseId, hours = 4) {
  const data = await getTeeTimes(courseId);
  const now = new Date();
  const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);

  if (!data.teeTimes) return [];

  return data.teeTimes.filter(slot => {
    const slotTime = new Date(`${data.date}T${slot.time}`);
    return slotTime >= now && slotTime <= cutoff;
  });
}

module.exports = {
  getTeeTimes,
  getLowestPrice,
  getUpcomingSlots,
};
