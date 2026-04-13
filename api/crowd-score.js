/**
 * crowd-score.js - Crowd Level Estimation Module
 *
 * Calculates how crowded a golf course is based on available tee times.
 * The fewer open slots in the next 2-4 hours, the more crowded the course.
 */

// Crowd level thresholds (configurable)
const THRESHOLDS = {
  LOW: 8,        // 8+ open slots = Low crowd
  MEDIUM: 5,     // 5-7 open slots = Medium crowd
  HIGH: 2,       // 2-4 open slots = High crowd
  // 0-1 open slots = Very High crowd
};

/**
 * Calculate crowd level based on number of available tee time slots
 * @param {number} availableSlots - Number of open tee time slots in next 2-4 hours
 * @returns {Object} Crowd level data with label, score, and color
 */
function calculateCrowdScore(availableSlots) {
  if (availableSlots >= THRESHOLDS.LOW) {
    return {
      level: 'Low',
      score: 1,
      color: '#2ecc71',
      description: 'Plenty of open tee times available',
    };
  } else if (availableSlots >= THRESHOLDS.MEDIUM) {
    return {
      level: 'Medium',
      score: 2,
      color: '#f1c40f',
      description: 'Moderate availability, some slots open',
    };
  } else if (availableSlots >= THRESHOLDS.HIGH) {
    return {
      level: 'High',
      score: 3,
      color: '#e67e22',
      description: 'Limited availability, filling up fast',
    };
  } else {
    return {
      level: 'Very High',
      score: 4,
      color: '#e74c3c',
      description: 'Almost fully booked, very crowded',
    };
  }
}

/**
 * Enhanced crowd score that factors in time of day and day of week
 * Weekend mornings are typically more crowded
 * @param {number} availableSlots
 * @param {Date} dateTime - Current date/time
 * @returns {Object} Adjusted crowd level data
 */
function calculateAdjustedCrowdScore(availableSlots, dateTime = new Date()) {
  const base = calculateCrowdScore(availableSlots);
  const dayOfWeek = dateTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = dateTime.getHours();

  // Weekend morning boost (courses are typically busier)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isMorning = hour >= 7 && hour <= 11;
  const isPeakTime = isWeekend && isMorning;

  if (isPeakTime && base.score < 4) {
    // Bump up crowd score during peak times if not already at max
    const adjusted = calculateCrowdScore(Math.max(0, availableSlots - 2));
    adjusted.peakTimeAdjusted = true;
    return adjusted;
  }

  base.peakTimeAdjusted = false;
  return base;
}

/**
 * Get crowd scores for multiple courses at once
 * @param {Array} courses - Array of course objects with availableSlots property
 * @returns {Array} Courses enriched with crowd score data
 */
function enrichWithCrowdScores(courses) {
  return courses.map(course => ({
    ...course,
    crowdData: calculateAdjustedCrowdScore(
      course.availableSlots || 0,
      new Date()
    ),
  }));
}

module.exports = {
  calculateCrowdScore,
  calculateAdjustedCrowdScore,
  enrichWithCrowdScores,
  THRESHOLDS,
};
