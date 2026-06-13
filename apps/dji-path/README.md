# DJI Flight Path 3D Visualizer

A clean, modern web application to visualize DJI drone flight paths in interactive 3D from SRT telemetry files, and export them to Google Earth.

## Features

- 🌐 **Web-Based Interface** - Upload up to 10 DJI `.SRT` files directly in your browser
- 📊 **3D Flight Thumbnails** - Each uploaded flight gets a rotating, true-to-scale 3D preview with start/end markers
- 📈 **Flight Metrics** - Per-flight table: duration, distance (horizontal & 3D), max/average altitude, average & max speed, max climb rate, and max distance from home
- 🗺️ **Google Earth Export** - Download a single KML with semi-transparent flight "curtains"; each flight is grouped in its own folder for a tidy Google Earth sidebar
- 🎨 **Modern UI** - Clean interface using Simple.css with automatic dark/light mode support
- 🚀 **Client-Side Processing** - All file processing happens in your browser (no server uploads, no map-tile requests)

## Quick Start

1. Open `index.html` in your browser
2. Click "Choose .SRT Files" and select one or more DJI SRT files
3. Explore the interactive 3D path, altitude profile, ground track and metrics
4. Export to Google Earth if desired

## How to Use

1. **Upload Your SRT File(s)**: Click "Choose .SRT Files (max 10)" and select your DJI SRT file(s)
2. **Review Each Flight**: Each file gets a card with a rotating 3D thumbnail and key stats; click a file name to rename it
3. **Check the Metrics**: Review the per-flight metrics table (duration, distance, altitude, speed, climb rate, distance from home)
4. **Export to Google Earth**:
   - Click "Download KML for Google Earth"
   - Click "Open Google Earth Web"
   - Import the KML file using File → Open local KML file

## File Structure

```text
dji-path/
├── .gitignore              # Excludes SRT files and KML exports
├── index.html              # Main web application (static HTML/CSS/JS)
├── example.kml             # Sample exported KML (for reference)
├── flightpath.webp         # Hero image
├── CLAUDE.md               # Architectural notes (KML altitude mode, etc.)
└── README.md               # This file
```

Note: SRT and KML files are excluded from Git to protect GPS/location data.

## Hosting

To host this app on a static hosting service (GitHub Pages, Netlify, Vercel, etc.):

1. Upload `index.html` to your hosting provider
2. That's it! The app runs entirely in the browser

## KML Export Features

- Semi-transparent flight path "curtains" with explicit vertical altitude lines (these render in Google Earth Web, where `<extrude>` does not)
- Each flight grouped in its own `<Folder>`, and all vertical lines collapsed into a single "Altitude lines" layer, so the Google Earth sidebar stays tidy
- Green start marker, yellow max-altitude marker, and red end marker (with altitude and timestamp)
- Adaptive point density that always retains the max-altitude vertex
- `relativeToGround` altitude mode using DJI `rel_alt` (height above takeoff) — see `CLAUDE.md` for why `absolute`/`abs_alt` is intentionally not used
- All user-supplied names are XML-escaped so custom path names can't produce invalid KML

Note: Exported KML files are gitignored to protect GPS/location data.

## Technology Stack

- **Plotly.js** - Interactive 3D visualization
- **Simple.css** - Minimal, modern CSS framework
- **Vanilla JavaScript** - No frameworks, just clean client-side code

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

MIT License - feel free to use and modify!
