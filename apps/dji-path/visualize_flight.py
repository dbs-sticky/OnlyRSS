"""
DJI Flight Path 3D Visualizer
Parses DJI SRT files and creates interactive 3D visualizations with web interface
"""

import re
import os
from datetime import datetime
import plotly.graph_objects as go
import pandas as pd

def parse_dji_srt(srt_file):
    """
    Parse DJI SRT file and extract GPS coordinates and altitude data
    
    Args:
        srt_file: Path to the SRT file
        
    Returns:
        DataFrame with timestamp, latitude, longitude, relative altitude, absolute altitude
    """
    data = []
    
    with open(srt_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by subtitle entries
    entries = content.strip().split('\n\n')
    
    for entry in entries:
        lines = entry.split('\n')
        if len(lines) >= 4:
            # The structure is:
            # Line 0: subtitle number
            # Line 1: timecode
            # Line 2: <font> tag with frame info
            # Line 3: timestamp
            # Line 4: data with GPS and altitude
            
            # Find the timestamp line (format: YYYY-MM-DD HH:MM:SS.mmm)
            timestamp = None
            data_line = None
            
            for i, line in enumerate(lines):
                if re.match(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}', line):
                    timestamp = line.strip()
                    # Data line should be the next line
                    if i + 1 < len(lines):
                        data_line = lines[i + 1]
                    break
            
            if timestamp and data_line:
                # Extract GPS coordinates
                lat_match = re.search(r'latitude: ([-\d.]+)', data_line)
                lon_match = re.search(r'longitude: ([-\d.]+)', data_line)
                
                # Extract altitudes
                rel_alt_match = re.search(r'rel_alt: ([-\d.]+)', data_line)
                abs_alt_match = re.search(r'abs_alt: ([-\d.]+)', data_line)
                
                if lat_match and lon_match and rel_alt_match and abs_alt_match:
                    data.append({
                        'timestamp': timestamp,
                        'latitude': float(lat_match.group(1)),
                        'longitude': float(lon_match.group(1)),
                        'rel_altitude': float(rel_alt_match.group(1)),
                        'abs_altitude': float(abs_alt_match.group(1))
                    })
    
    df = pd.DataFrame(data)
    
    if len(df) == 0:
        raise ValueError("No valid data found in SRT file. Check file format.")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Calculate distance and speed (if multiple points)
    if len(df) > 1:
        df['time_diff'] = df['timestamp'].diff().dt.total_seconds()
    
    return df

def create_web_interface(output_html='index.html'):
    """
    Create interactive web interface with file upload capability
    """
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DJI Flight Path (.SRT) to Google Earth (.KML)</title>
    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <style>
        .file-input-wrapper {
            position: relative;
            display: inline-block;
        }
        .file-input-wrapper input[type=file] {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            z-index: 10;
        }
        .file-input-wrapper .button {
            pointer-events: none;
            margin: 0;
        }
        button:hover, .button:hover {
            cursor: pointer;
        }
        .spinner {
            border: 3px solid var(--accent-bg);
            border-top: 3px solid var(--accent);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #loading {
            display: none;
            margin-top: 1rem;
        }
        #stats {
            display: none;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: var(--accent-bg);
            border: var(--border-width) solid var(--border);
            border-radius: var(--standard-border-radius);
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--accent);
        }
        .stat-label {
            font-size: 0.85rem;
            color: var(--text-light);
            text-transform: uppercase;
            margin-top: 0.25rem;
        }
        #visualization {
            display: none;
        }
        .chart-container {
            margin-bottom: 2rem;
        }
        #plot3d, #cesiumContainer {
            width: 100%;
            border: var(--border-width) solid var(--border);
            border-radius: var(--standard-border-radius);
            background: var(--bg);
        }
        #plot3d {
            height: 600px;
        }
        #cesiumContainer {
            height: auto;
            padding: 2rem;
            text-align: center;
        }
        .earth-instructions {
            line-height: 1.8;
            margin-top: 1rem;
        }
        .earth-instructions ol {
            text-align: left;
            display: inline-block;
        }
        .hero-image {
            width: 100%;
            max-width: 800px;
            height: auto;
            border-radius: var(--standard-border-radius);
            margin: 1rem auto;
            display: block;
        }
    </style>
</head>
<body>
    <header>
        <img src="flightpath.webp" alt="DJI Flight Path Visualization" class="hero-image">
        <h1>DJI Flight Path (.SRT) to Google Earth (.KML)</h1>
        <p>Upload your DJI drone SRT file and then download a Google Earth KML file that shows flight path (with flight path curtains)</p>
    </header>
    
    <main>
    <main>
        <section>
            <h2>Upload Flight Data</h2>
            <div class="file-input-wrapper">
                <input type="file" id="fileInput" accept=".srt,.SRT">
                <button class="button">Choose SRT File</button>
            </div>
            <p id="fileName"></p>
            <div id="loading">
                <div class="spinner"></div>
                Processing flight data...
            </div>
        </section>
        
        <section id="stats">
            <h2>Flight Statistics</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value" id="duration">--</div>
                    <div class="stat-label">Duration (seconds)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="maxAlt">--</div>
                    <div class="stat-label">Max Altitude (m)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="avgAlt">--</div>
                    <div class="stat-label">Avg Altitude (m)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="points">--</div>
                    <div class="stat-label">Data Points</div>
                </div>
            </div>
        </section>
        
        <div id="visualization">
            <section class="chart-container">
                <h2>Google Earth View</h2>
                <div id="cesiumContainer"></div>
            </section>
            
            <section class="chart-container">
                <h2>Flight Path Preview</h2>
                <div id="plot3d"></div>
            </section>
        </div>
    </main>

    <script>
        const fileInput = document.getElementById('fileInput');
        const fileName = document.getElementById('fileName');
        const loading = document.getElementById('loading');
        const stats = document.getElementById('stats');
        const visualization = document.getElementById('visualization');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = `Selected: ${file.name}`;
                loading.style.display = 'block';
                processFile(file);
            }
        });

        function processFile(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const flightData = parseSRT(content);
                displayVisualization(flightData);
            };
            reader.readAsText(file);
        }

        function parseSRT(content) {
            const entries = content.trim().split('\\n\\n');
            const data = [];

            for (const entry of entries) {
                const lines = entry.split('\\n');
                if (lines.length >= 4) {
                    let timestamp = null;
                    let dataLine = null;

                    for (let i = 0; i < lines.length; i++) {
                        if (/\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}/.test(lines[i])) {
                            timestamp = lines[i].trim();
                            if (i + 1 < lines.length) {
                                dataLine = lines[i + 1];
                            }
                            break;
                        }
                    }

                    if (timestamp && dataLine) {
                        const latMatch = dataLine.match(/latitude: ([\\-\\d.]+)/);
                        const lonMatch = dataLine.match(/longitude: ([\\-\\d.]+)/);
                        const relAltMatch = dataLine.match(/rel_alt: ([\\-\\d.]+)/);
                        const absAltMatch = dataLine.match(/abs_alt: ([\\-\\d.]+)/);

                        if (latMatch && lonMatch && relAltMatch && absAltMatch) {
                            data.push({
                                timestamp: new Date(timestamp),
                                latitude: parseFloat(latMatch[1]),
                                longitude: parseFloat(lonMatch[1]),
                                rel_altitude: parseFloat(relAltMatch[1]),
                                abs_altitude: parseFloat(absAltMatch[1])
                            });
                        }
                    }
                }
            }

            return data;
        }

        function displayVisualization(data) {
            if (data.length === 0) {
                alert('No valid data found in the file!');
                loading.style.display = 'none';
                return;
            }

            // Store data globally for KML export
            window.flightData = data;

            // Calculate statistics
            const duration = (data[data.length - 1].timestamp - data[0].timestamp) / 1000;
            const altitudes = data.map(d => d.rel_altitude);
            const maxAlt = Math.max(...altitudes);
            const avgAlt = altitudes.reduce((a, b) => a + b, 0) / altitudes.length;

            // Update stats
            document.getElementById('duration').textContent = duration.toFixed(1);
            document.getElementById('maxAlt').textContent = maxAlt.toFixed(1);
            document.getElementById('avgAlt').textContent = avgAlt.toFixed(1);
            document.getElementById('points').textContent = data.length;
            stats.style.display = 'block';

            // Calculate elapsed time
            const startTime = data[0].timestamp;
            const elapsedSeconds = data.map(d => (d.timestamp - startTime) / 1000);

            // --- 3D Plot ---
            const trace3d = {
                type: 'scatter3d',
                mode: 'lines+markers',
                x: data.map(d => d.longitude),
                y: data.map(d => d.latitude),
                z: data.map(d => d.rel_altitude),
                marker: {
                    size: 2,
                    color: data.map(d => d.rel_altitude),
                    colorscale: 'Viridis',
                    reversescale: true,
                    showscale: true,
                    colorbar: {
                        title: 'Altitude (m)',
                        x: 1.02,
                        y: 0.5,
                        len: 0.45
                    }
                },
                line: {
                    color: data.map(d => d.rel_altitude),
                    colorscale: 'Viridis',
                    reversescale: true,
                    width: 3
                },
                text: data.map(d => `Time: ${d.timestamp.toLocaleTimeString()}<br>Alt: ${d.rel_altitude.toFixed(1)}m<br>Lat: ${d.latitude.toFixed(6)}<br>Lon: ${d.longitude.toFixed(6)}`),
                hoverinfo: 'text',
                name: 'Flight Path'
            };

            const start3d = {
                type: 'scatter3d',
                mode: 'markers',
                x: [data[0].longitude],
                y: [data[0].latitude],
                z: [data[0].rel_altitude],
                marker: { size: 8, color: 'green', symbol: 'diamond' },
                name: 'Start'
            };

            const end3d = {
                type: 'scatter3d',
                mode: 'markers',
                x: [data[data.length - 1].longitude],
                y: [data[data.length - 1].latitude],
                z: [data[data.length - 1].rel_altitude],
                marker: { size: 8, color: 'red', symbol: 'diamond' },
                name: 'End'
            };

            const layout3d = {
                scene: {
                    xaxis: { title: 'Longitude' },
                    yaxis: { title: 'Latitude' },
                    zaxis: { title: 'Altitude (m)' },
                    camera: { eye: { x: 1.5, y: 1.5, z: 1.3 } },
                    aspectmode: 'manual',
                    aspectratio: { x: 1, y: 1, z: 0.5 }
                },
                showlegend: true,
                hovermode: 'closest',
                margin: { l: 0, r: 0, t: 0, b: 0 }
            };

            Plotly.newPlot('plot3d', [trace3d, start3d, end3d], layout3d, {responsive: true});

            // Calculate center coordinates for map and Google Earth
            const centerLat = data.reduce((sum, d) => sum + d.latitude, 0) / data.length;
            const centerLon = data.reduce((sum, d) => sum + d.longitude, 0) / data.length;

            // --- Google Earth View ---
            // Generate KML for embedding
            const generateKMLForEmbed = () => {
                let kmlCoords = '';
                data.forEach(point => {
                    kmlCoords += `${point.longitude},${point.latitude},${point.abs_altitude} `;
                });

                return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Flight Path</name>
    <Style id="flightPath">
      <LineStyle>
        <color>ff00ffff</color>
        <width>2</width>
      </LineStyle>
    </Style>
    <Style id="startPoint">
      <IconStyle>
        <color>ff00ff00</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="endPoint">
      <IconStyle>
        <color>ff0000ff</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Placemark>
      <name>DJI Flight Path</name>
      <styleUrl>#flightPath</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>${kmlCoords}</coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Start</name>
      <styleUrl>#startPoint</styleUrl>
      <Point>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>${data[0].longitude},${data[0].latitude},${data[0].abs_altitude}</coordinates>
      </Point>
    </Placemark>
    <Placemark>
      <name>End</name>
      <styleUrl>#endPoint</styleUrl>
      <Point>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>${data[data.length-1].longitude},${data[data.length-1].latitude},${data[data.length-1].abs_altitude}</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`;
            };

            // Create Google Earth embed
            try {
                const kmlData = generateKMLForEmbed();
                const kmlBlob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });
                const kmlUrl = URL.createObjectURL(kmlBlob);
                
                // Try to use Google Earth Web
                const earthUrl = `https://earth.google.com/web/@${centerLat},${centerLon},1000a,1000d,35y,0h,45t,0r`;
                
                document.getElementById('cesiumContainer').innerHTML = `
                    <div class="earth-instructions">
                        <p>To view the flight path in 3D with terrain:</p>
                        <button onclick="downloadFlightKML()" class="button">
                            Download KML for Google Earth
                        </button>
                        <a href="${earthUrl}" target="_blank" class="button">
                            Open Google Earth Web
                        </a>
                        <ol class="earth-instructions">
                            <li>Click "Download KML for Google Earth" above</li>
                            <li>Click "Open Google Earth Web" above</li>
                            <li>In Google Earth Web, click "File", then "Open local KML file".</li>
                            <li>Select the downloaded KML file</li>
                        </ol>
                    </div>
                `;
                
                URL.revokeObjectURL(kmlUrl);
            } catch (error) {
                console.error('Error creating Google Earth view:', error);
            }

            loading.style.display = 'none';
            visualization.style.display = 'block';
        }

        // Download KML for Google Earth (separate from export button)
        function downloadFlightKML() {
            if (!window.flightData) {
                alert('No flight data available.');
                return;
            }

            const data = window.flightData;
            const fileName = fileInput.files[0].name.replace('.SRT', '').replace('.srt', '');
            
            // Generate KML content
            let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${fileName} Flight Path</name>
    <description>DJI Drone Flight Path</description>
    <Style id="flightPath">
      <LineStyle>
        <color>ff00ffff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>3300ffff</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <Style id="startPoint">
      <IconStyle>
        <color>ff00ff00</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="endPoint">
      <IconStyle>
        <color>ff0000ff</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Placemark>
      <name>Flight Path</name>
      <styleUrl>#flightPath</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <tessellate>1</tessellate>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>
`;

            // Add coordinates with reduced density (every 50th point)
            data.forEach((point, index) => {
                if (index % 50 === 0 || index === data.length - 1) {
                    kml += `          ${point.longitude},${point.latitude},${point.abs_altitude}\\n`;
                }
            });

            kml += `        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Start</name>
      <styleUrl>#startPoint</styleUrl>
      <Point>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>${data[0].longitude},${data[0].latitude},${data[0].abs_altitude}</coordinates>
      </Point>
    </Placemark>
    <Placemark>
      <name>End</name>
      <styleUrl>#endPoint</styleUrl>
      <Point>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>${data[data.length-1].longitude},${data[data.length-1].latitude},${data[data.length-1].abs_altitude}</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`;

            // Create blob and download
            const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}_GoogleEarth.kml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
"""
    
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✓ Web interface created: {output_html}")
    print(f"  Open {output_html} in your browser to upload and visualize SRT files")

def print_flight_stats(df):
    """Print summary statistics of the flight"""
    print("\n" + "="*60)
    print("FLIGHT STATISTICS")
    print("="*60)
    print(f"Duration: {(df['timestamp'].iloc[-1] - df['timestamp'].iloc[0]).total_seconds():.1f} seconds")
    print(f"Data points: {len(df)}")
    print(f"\nAltitude:")
    print(f"  Max relative altitude: {df['rel_altitude'].max():.1f} m")
    print(f"  Min relative altitude: {df['rel_altitude'].min():.1f} m")
    print(f"  Average altitude: {df['rel_altitude'].mean():.1f} m")
    print(f"\nLocation:")
    print(f"  Start: {df['latitude'].iloc[0]:.6f}, {df['longitude'].iloc[0]:.6f}")
    print(f"  End: {df['latitude'].iloc[-1]:.6f}, {df['longitude'].iloc[-1]:.6f}")
    print(f"  Center: {df['latitude'].mean():.6f}, {df['longitude'].mean():.6f}")
    print("="*60 + "\n")

def export_to_kml(df, output_kml='flight.kml', skip=50):
    """
    Export flight path to Google Earth KML format
    
    Args:
        df: DataFrame with flight data
        output_kml: Output KML file name
        skip: Skip every N points to reduce curtain density (default: 50)
    """
    with open(output_kml, 'w', encoding='utf-8') as f:
        # Writing the kml file.
        f.write("<?xml version='1.0' encoding='UTF-8'?>\n")
        f.write("<kml xmlns='http://earth.google.com/kml/2.2'>\n")
        f.write("<Document>\n")
        f.write("  <name>DJI Drone Flight Path</name>\n")
        f.write("  <description>Flight path exported from DJI SRT file</description>\n")
        
        # Style for the path
        f.write("  <Style id='flightPath'>\n")
        f.write("    <LineStyle>\n")
        f.write("      <color>ff0000ff</color>\n")  # Red line
        f.write("      <width>2</width>\n")
        f.write("    </LineStyle>\n")
        f.write("    <PolyStyle>\n")
        f.write("      <color>330000ff</color>\n")  # Semi-transparent red fill (20% opacity)
        f.write("      <fill>1</fill>\n")
        f.write("      <outline>1</outline>\n")
        f.write("    </PolyStyle>\n")
        f.write("  </Style>\n")
        
        # Style for start point (green)
        f.write("  <Style id='startPoint'>\n")
        f.write("    <IconStyle>\n")
        f.write("      <color>ff00ff00</color>\n")
        f.write("      <scale>1.2</scale>\n")
        f.write("      <Icon>\n")
        f.write("        <href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href>\n")
        f.write("      </Icon>\n")
        f.write("    </IconStyle>\n")
        f.write("  </Style>\n")
        
        # Style for end point (red)
        f.write("  <Style id='endPoint'>\n")
        f.write("    <IconStyle>\n")
        f.write("      <color>ff0000ff</color>\n")
        f.write("      <scale>1.2</scale>\n")
        f.write("      <Icon>\n")
        f.write("        <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>\n")
        f.write("      </Icon>\n")
        f.write("    </IconStyle>\n")
        f.write("  </Style>\n")
        
        # Flight path
        f.write("  <Placemark>\n")
        f.write("    <name>Flight Path</name>\n")
        f.write("    <styleUrl>#flightPath</styleUrl>\n")
        f.write("    <LineString>\n")
        f.write("      <extrude>1</extrude>\n")
        f.write("      <tessellate>1</tessellate>\n")
        f.write("      <altitudeMode>absolute</altitudeMode>\n")
        f.write("      <coordinates>\n")
        
        # Write coordinates (skip points to reduce file size)
        for i in range(0, len(df), skip):
            lon = df['longitude'].iloc[i]
            lat = df['latitude'].iloc[i]
            alt = df['abs_altitude'].iloc[i]  # Use absolute altitude for Google Earth
            f.write(f"        {lon},{lat},{alt}\n")
        
        f.write("      </coordinates>\n")
        f.write("    </LineString>\n")
        f.write("  </Placemark>\n")
        
        # Start point marker
        f.write("  <Placemark>\n")
        f.write("    <name>Start</name>\n")
        f.write("    <description>Flight start point</description>\n")
        f.write("    <styleUrl>#startPoint</styleUrl>\n")
        f.write("    <Point>\n")
        f.write("      <altitudeMode>absolute</altitudeMode>\n")
        f.write(f"      <coordinates>{df['longitude'].iloc[0]},{df['latitude'].iloc[0]},{df['abs_altitude'].iloc[0]}</coordinates>\n")
        f.write("    </Point>\n")
        f.write("  </Placemark>\n")
        
        # End point marker
        f.write("  <Placemark>\n")
        f.write("    <name>End</name>\n")
        f.write("    <description>Flight end point</description>\n")
        f.write("    <styleUrl>#endPoint</styleUrl>\n")
        f.write("    <Point>\n")
        f.write("      <altitudeMode>absolute</altitudeMode>\n")
        f.write(f"      <coordinates>{df['longitude'].iloc[-1]},{df['latitude'].iloc[-1]},{df['abs_altitude'].iloc[-1]}</coordinates>\n")
        f.write("    </Point>\n")
        f.write("  </Placemark>\n")
        
        f.write("</Document>\n")
        f.write("</kml>\n")
    
    print(f"✓ KML file exported to: {output_kml}")

if __name__ == "__main__":
    import sys
    
    # Check if file is provided as argument
    if len(sys.argv) > 1:
        srt_file = sys.argv[1]
        print(f"Parsing {srt_file}...")
        df = parse_dji_srt(srt_file)
        
        print(f"✓ Parsed {len(df)} data points")
        
        # Print statistics
        print_flight_stats(df)
        
        # Export to KML
        print("Exporting to KML...")
        export_to_kml(df, 'flight.kml')
        
        print("\n✅ Flight data processed successfully!")
        print("\nOpen flight.kml in Google Earth to view the 3D flight path")
    else:
        # Create web interface in the same directory as the script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, 'index.html')
        print("Creating web interface...")
        create_web_interface(output_path)
        
        print("\n✅ Web interface created!")
        print("\n🌐 Open index.html in your browser to:")
        print("  • Upload any DJI SRT file")
        print("  • View interactive 3D flight path visualization")
        print("  • Export to Google Earth (KML format)")
        print("  • See flight statistics")
