# Product Spec: Golf Course Crowd Finder

## Problem
Golfers want to play at courses that are not overcrowded, but there is no easy way to check how busy a course is before driving there. Existing booking sites show tee times but do not surface a clear crowd indicator or let you compare busyness across multiple nearby courses at a glance.

## Solution
A web app that shows all golf courses near the user, with real-time pricing per player and an estimated crowd level for each course. Users can sort by least crowded, cheapest, or closest to quickly find the best option.

## Target User
- Casual and regular golfers in the St. Louis metro area (MVP)
- Golfers who prefer to avoid peak crowds
- Price-sensitive players looking for deals

## MVP Features

### 1. Location Detection
- Browser geolocation API (one-click)
- Manual zip code entry as fallback
- Default radius: 25 miles (configurable: 10, 25, 50)

### 2. Course List
- Course name, distance, hole count, type (public/semi-private)
- Price per player (from tee-time API)
- Crowd level badge (Low / Medium / High / Very High)
- Next available tee times

### 3. Crowd Score Algorithm
- Based on available tee time slots in next 2-4 hours
- 8+ slots = Low, 5-7 = Medium, 2-4 = High, 0-1 = Very High
- Weekend morning adjustment (bump score up during peak)

### 4. Sorting & Filtering
- Sort by: Least Crowded, Lowest Price, Closest
- Filter by radius

## Data Sources

| Data | Source | Fallback |
|---|---|---|
| Course discovery | Google Places API | Sample JSON |
| Tee times & pricing | GolfNow / Tee Time Gateway | Sample JSON |
| Crowd estimation | Calculated from availability | Sample JSON |

## Tech Stack
- Frontend: Vanilla HTML/CSS/JS
- API layer: Node.js modules
- Geolocation: Browser API + zippopotam.us for zip lookup
- Hosting: GitHub Pages (frontend) or Vercel

## Future Roadmap
1. Weather overlay per course (OpenWeatherMap API)
2. Interactive map view (Mapbox or Google Maps)
3. User accounts with favorite courses
4. Push notifications for cheap uncrowded tee times
5. Mobile PWA with offline support
6. User reviews and course ratings
7. Historical crowd patterns (time-of-day heatmap)
8. Group booking support

## Success Metrics
- Users can find a less-crowded course in under 30 seconds
- Price comparison across 5+ courses in a single view
- Crowd score accuracy validated against actual course conditions
