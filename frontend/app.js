/**
 * Golf Course Crowd Finder - Frontend App
 * Handles location detection, API calls, and rendering course cards.
 */

// --- DOM Elements ---
const detectBtn = document.getElementById('detect-location');
const searchBtn = document.getElementById('search-btn');
const zipInput = document.getElementById('zip-input');
const sortSelect = document.getElementById('sort-select');
const radiusSelect = document.getElementById('radius-select');
const courseList = document.getElementById('course-list');
const statusBar = document.getElementById('status-bar');
const statusMessage = document.getElementById('status-message');

// --- State ---
let userLat = null;
let userLng = null;
let courses = [];

// --- Event Listeners ---
detectBtn.addEventListener('click', detectLocation);
searchBtn.addEventListener('click', searchByZip);
sortSelect.addEventListener('change', () => renderCourses(courses));

/**
 * Detect user location via browser Geolocation API
 */
function detectLocation() {
  showStatus('Detecting your location...');
  if (!navigator.geolocation) {
    showStatus('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      showStatus(`Location found: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}. Searching...`);
      fetchCourses(userLat, userLng);
    },
    (error) => {
      showStatus('Could not detect location. Please enter a zip code.');
      console.error('Geolocation error:', error);
    }
  );
}

/**
 * Search by zip code - convert zip to lat/lng then fetch courses
 */
async function searchByZip() {
  const zip = zipInput.value.trim();
  if (zip.length !== 5 || isNaN(zip)) {
    showStatus('Please enter a valid 5-digit zip code.');
    return;
  }
  showStatus('Looking up zip code...');
  try {
    // Use a geocoding API to convert zip to coordinates
    // For MVP, using a simple free geocoding service
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) throw new Error('Invalid zip code');
    const data = await response.json();
    userLat = parseFloat(data.places[0].latitude);
    userLng = parseFloat(data.places[0].longitude);
    showStatus(`Searching near ${data.places[0]['place name']}, ${data.places[0]['state abbreviation']}...`);
    fetchCourses(userLat, userLng);
  } catch (err) {
    showStatus('Could not find that zip code. Please try again.');
    console.error('Zip lookup error:', err);
  }
}

/**
 * Fetch courses near the given coordinates
 * TODO: Replace with real API call to your backend
 */
async function fetchCourses(lat, lng) {
  const radius = radiusSelect.value;
  showStatus(`Finding golf courses within ${radius} miles...`);

  try {
    // TODO: Replace this with your actual API endpoint
    // const response = await fetch(`/api/courses?lat=${lat}&lng=${lng}&radius=${radius}`);
    // const data = await response.json();

    // For now, load sample data
    const response = await fetch('../data/sample-courses.json');
    const data = await response.json();
    courses = data.courses;

    if (courses.length === 0) {
      showStatus('No golf courses found nearby. Try expanding your search radius.');
      return;
    }

    showStatus(`Found ${courses.length} courses nearby.`);
    renderCourses(courses);
  } catch (err) {
    showStatus('Error loading courses. Please try again.');
    console.error('Fetch error:', err);
  }
}

/**
 * Render course cards to the DOM
 */
function renderCourses(courseData) {
  const sortBy = sortSelect.value;
  const sorted = sortCourses([...courseData], sortBy);

  courseList.innerHTML = sorted.map(course => {
    const crowdClass = getCrowdClass(course.crowdLevel);
    const badgeClass = course.crowdLevel.toLowerCase().replace(' ', '-');
    return `
      <div class="course-card ${crowdClass}">
        <div class="course-info">
          <h2>${course.name}</h2>
          <div class="course-meta">
            <span>${course.distance} mi away</span>
            <span>${course.holes} holes</span>
            <span>${course.type}</span>
          </div>
          <div class="tee-times">
            Next tee times: ${course.nextTeeTimes.join(', ')}
          </div>
        </div>
        <div class="course-stats">
          <div class="price">$${course.pricePerPlayer}</div>
          <div class="price-label">per player</div>
          <span class="crowd-badge ${badgeClass}">${course.crowdLevel}</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Sort courses based on selected criteria
 */
function sortCourses(data, sortBy) {
  switch (sortBy) {
    case 'crowd-low':
      const crowdOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
      return data.sort((a, b) => (crowdOrder[a.crowdLevel] || 5) - (crowdOrder[b.crowdLevel] || 5));
    case 'price-low':
      return data.sort((a, b) => a.pricePerPlayer - b.pricePerPlayer);
    case 'distance':
      return data.sort((a, b) => a.distance - b.distance);
    default:
      return data;
  }
}

/**
 * Get CSS class for crowd level border color
 */
function getCrowdClass(level) {
  switch (level) {
    case 'Low': return 'crowd-low';
    case 'Medium': return 'crowd-medium';
    case 'High': return 'crowd-high';
    case 'Very High': return 'crowd-very-high';
    default: return 'crowd-low';
  }
}

/**
 * Show/hide status bar with a message
 */
function showStatus(message) {
  statusBar.classList.remove('hidden');
  statusMessage.textContent = message;
}
