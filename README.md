# Golf Course Crowd Finder

Find golf courses near your location and instantly see pricing and how crowded each course is — so you can pick the least crowded spot at the best price.

## Features

- **Location-based search** — Detect or enter your location to find nearby public golf courses
- **Price per player** — Live tee-time pricing pulled from booking APIs
- **Crowd level indicator** — Estimated crowd score (Low / Medium / High / Very High) based on available tee times
- **Sort & filter** — Sort by least crowded, cheapest, or closest
- **Distance display** — See how far each course is from you
- **Available tee times** — View open slots for the next few hours

## How the Crowd Score Works

The crowd score is calculated from the number of available tee times within the next 2-4 hours:

| Available Slots | Crowd Level | Color |
|---|---|---|
| 8+ open times | Low | Green |
| 5-7 open times | Medium | Yellow |
| 2-4 open times | High | Orange |
| 0-1 open times | Very High | Red |

More open tee times = less crowded. Simple.

## Project Structure

```
golf-course-crowd-finder/
├── README.md
├── .gitignore
├── LICENSE
├── docs/
│   └── product-spec.md
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── api/
│   ├── courses.js
│   ├── pricing.js
│   ├── crowd-score.js
│   └── config.example.json
└── data/
    └── sample-courses.json
```

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework needed for MVP)
- **API Layer:** Node.js modules for course data, pricing, and crowd scoring
- **Location:** Browser Geolocation API + fallback to zip code entry
- **Maps:** Google Maps or Mapbox for distance calculation

## Data Sources

| Need | Source | Notes |
|---|---|---|
| Course list | Golf Course API / Google Places API | Find courses by lat/lng |
| Tee times & prices | GolfNow API / Tee Time Gateway | Real-time pricing and availability |
| Crowd estimation | Derived from tee-time availability | Custom scoring algorithm |

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/Npfaffcp/golf-course-crowd-finder.git
   cd golf-course-crowd-finder
   ```

2. Copy the config template:
   ```bash
   cp api/config.example.json api/config.json
   ```

3. Add your API keys to `api/config.json`

4. Open `frontend/index.html` in your browser (or use a local server):
   ```bash
   npx serve frontend
   ```

## Future Enhancements

- Weather overlay per course
- Interactive map view
- Favorite courses & alerts
- Push notifications for cheap uncrowded tee times
- Mobile-responsive PWA
- User reviews and course ratings

## License

MIT
