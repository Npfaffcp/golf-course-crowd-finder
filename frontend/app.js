/**
 * Golf Course Crowd Finder - Frontend App
 * Handles location detection, API calls, and rendering course cards.
 */

// --- DOM Elements ---
const detectBtn = document.getElementById('detect-location');
const searchBtn = document.getElementById('search-btn');
const zipInput = document.getElementById('zip-input');
const dateInput = document.getElementById('date-input');
const sortSelect = document.getElementById('sort-select');
const radiusSelect = document.getElementById('radius-select');
const courseList = document.getElementById('course-list');
const statusBar = document.getElementById('status-bar');
const statusMessage = document.getElementById('status-message');

// --- State ---
let userLat = null;
let userLng = null;
let courses = [];

// --- Initialize date input to today ---
function initDateInput() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  dateInput.min = `${yyyy}-${mm}-${dd}`;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);
  const maxYyyy = maxDate.getFullYear();
  const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
  const maxDd = String(maxDate.getDate()).padStart(2, '0');
  dateInput.max = `${maxYyyy}-${maxMm}-${maxDd}`;
}
initDateInput();

// --- Event Listeners ---
detectBtn.addEventListener('click', detectLocation);
searchBtn.addEventListener('click', searchByZip);
sortSelect.addEventListener('change', () => renderCourses(courses));
dateInput.addEventListener('change', () => {
  if (userLat && userLng) {
    fetchCourses(userLat, userLng);
  }
});

function getSelectedDate() {
  return dateInput.value;
}

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

async function searchByZip() {
  const zip = zipInput.value.trim();
  if (zip.length !== 5 || isNaN(zip)) {
    showStatus('Please enter a valid 5-digit zip code.');
    return;
  }
  showStatus('Looking up zip code...');
  try {
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

async function fetchCourses(lat, lng) {
  const radius = radiusSelect.value;
  const selectedDate = getSelectedDate();
  showStatus(`Finding golf courses within ${radius} miles for ${selectedDate}...`);
  try {
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

function renderCourses(courseData) {
  const sortBy = sortSelect.value;
  const sorted = sortCourses([...courseData], sortBy);

  courseList.innerHTML = sorted.map(course => {
    const crowdClass = getCrowdClass(course.crowdLevel);
    const badgeClass = course.crowdLevel.toLowerCase().replace(' ', '-');
    const bookingUrl = course.bookingUrl || '#';

    return `
      <div class="course-card ${crowdClass}">
        <div class="course-info">
          <h2><a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="course-link">${course.name}</a></h2>
          <div class="course-meta">
            <span>${course.distance} mi away</span>
            <span>${course.holes} holes</span>
            <span>${course.type}</span>
          </div>
          <div class="tee-times">Next tee times: ${course.nextTeeTimes.join(', ')}</div>
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

function getCrowdClass(level) {
  switch (level) {
    case 'Low': return 'crowd-low';
    case 'Medium': return 'crowd-medium';
    case 'High': return 'crowd-high';
    case 'Very High': return 'crowd-very-high';
    default: return 'crowd-low';
  }
}

function showStatus(message) {
  statusBar.classList.remove('hidden');
  statusMessage.textContent = message;
}
