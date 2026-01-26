# DJI Flight Path 3D Visualizer

A clean, modern web application to visualize DJI drone flight paths in interactive 3D from SRT telemetry files.

## Features

- 🌐 **Web-Based Interface** - Upload and visualize SRT files directly in your browser
- 📊 **Interactive 3D Flight Path** - Explore your flight with smooth 3D visualization and altitude color coding
- 🗺️ **Google Earth Export** - Download KML files for viewing in Google Earth with semi-transparent curtains
- 📈 **Flight Statistics** - Duration, max altitude, average altitude, and data point count
- 🎨 **Modern UI** - Clean interface using Simple.css with automatic dark/light mode support
- 🚀 **Client-Side Processing** - All file processing happens in your browser (no server uploads)

## Quick Start

### Option 1: Use the Web App (Recommended)

1. Open `index.html` in your browser
2. Click "Choose SRT File" and select your DJI SRT file
3. View the interactive 3D flight path and statistics
4. Export to Google Earth if desired

### Option 2: Regenerate Web Interface

If you need to regenerate `index.html`:

1. **Activate the virtual environment:**
   ```powershell
   .venv\Scripts\Activate.ps1
   ```

2. **Regenerate the web interface:**
   ```powershell
   python visualize_flight.py
   ```

3. **Open `index.html`** in your browser

Note: Dependencies (plotly, pandas) are already installed in the `.venv` virtual environment.

## How to Use

1. **Upload Your SRT File**: Click the "Choose SRT File" button and select your DJI SRT file
2. **View Flight Statistics**: See duration, max altitude, average altitude, and data points
3. **Explore 3D Visualization**: 
   - Click and drag to rotate the 3D view
   - Scroll to zoom in/out
   - Hover over the path for detailed information
   - Legend shows altitude color scale (dark = high altitude)
4. **Export to Google Earth**:
   - Click "Download KML for Google Earth"
   - Click "Open Google Earth Web"
   - Import the KML file using File → Open local KML file

## Data Extracted from SRT Files

- GPS Coordinates (latitude, longitude)
- Relative Altitude (height above takeoff point)
- Absolute Altitude (height above sea level)
- Timestamp for each telemetry frame

## File Structure

```
dji-path/
├── .venv/                  # Virtual environment with dependencies (gitignored)
├── .gitignore              # Excludes SRT files, KML exports, and generated HTML
├── index.html              # Main web application (generated, gitignored)
├── visualize_flight.py     # Python script to regenerate index.html
├── requirements.txt        # Python dependencies (plotly, pandas)
└── README.md              # This file
```

Note: SRT and KML files are excluded from Git to protect GPS/location data.

## Hosting

To host this app on a static hosting service (GitHub Pages, Netlify, Vercel, etc.):

1. Regenerate `index.html` using `python visualize_flight.py` (if needed)
2. Upload `index.html` to your hosting provider
3. That's it! The app runs entirely in the browser

Note: `index.html` is gitignored by default. Commit it separately if deploying to GitHub Pages.

## KML Export Features

- Semi-transparent flight path curtains (20% opacity)
- Optimized point density to reduce file size
- Green start marker and red end marker
- Absolute altitude mode for accurate 3D terrain visualization

Note: Exported KML files are gitignored to protect GPS/location data.

## Technology Stack

- **Plotly.js** - Interactive 3D visualization
- **Simple.css** - Minimal, modern CSS framework
- **Vanilla JavaScript** - No frameworks, just clean client-side code
- **Python** (optional) - For regenerating the web interface

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

MIT License - feel free to use and modify!
