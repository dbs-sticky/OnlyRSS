document.addEventListener('DOMContentLoaded', () => {
  // Dark mode functionality
  const darkModeToggle = document.getElementById('darkModeToggle');
  const DARK_MODE_KEY = 'fitCompare_darkMode';
  
  // Check for saved dark mode preference or default to light mode
  const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    updateToggleIcon(true);
  }
  
  // Dark mode toggle handler
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isCurrentlyDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem(DARK_MODE_KEY, isCurrentlyDark.toString());
      updateToggleIcon(isCurrentlyDark);
      updateMapTiles(isCurrentlyDark);
    });
  }
  
  function updateToggleIcon(isDark) {
    const icon = darkModeToggle.querySelector('.toggle-icon');
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
  }
  
  function updateMapTiles(isDark) {
    if (window.mapTileLayer && window.map) {
      window.map.removeLayer(window.mapTileLayer);
      
      if (isDark) {
        // Dark Matter tiles for dark mode
        window.mapTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(window.map);
      } else {
        // Standard OpenStreetMap tiles for light mode
        window.mapTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.map);
      }
    }
  }

  const fileInput1 = document.getElementById('file1');
  const fileInput2 = document.getElementById('file2');
  const fileInput3 = document.getElementById('file3');
  const compareBtn = document.getElementById('compareBtn');

  let files = { file1: null, file2: null, file3: null };
  let charts = {};
  let map;
  let mapMarkers = { marker1: null, marker2: null, marker3: null };
  let cachedRecords = { records1: [], records2: [], records3: [] };
  
  // Color scheme for up to 3 files
  const colors = [
    { border: 'rgba(75, 192, 192, 1)', bg: 'rgba(75, 192, 192, 0.2)', fill: 'rgba(75, 192, 192, 0.8)' }, // Teal
    { border: 'rgba(255, 99, 132, 1)', bg: 'rgba(255, 99, 132, 0.2)', fill: 'rgba(255, 99, 132, 0.8)' }, // Red
    { border: 'rgba(153, 102, 255, 1)', bg: 'rgba(153, 102, 255, 0.2)', fill: 'rgba(153, 102, 255, 0.8)' }  // Purple
  ];

  // Chart.js crosshair plugin
  const crosshairPlugin = {
    id: 'crosshair',
    afterDatasetsDraw(chart, args, options) {
      if (chart.crosshair && chart.crosshair.x) {
        const { ctx, chartArea: { top, bottom } } = chart;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(chart.crosshair.x, top);
        ctx.lineTo(chart.crosshair.x, bottom);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  // Register the plugin
  if (typeof Chart !== 'undefined') {
    Chart.register(crosshairPlugin);
  }

  // Storage keys
  const STORAGE_KEY_FILE1 = 'fitCompare_file1';
  const STORAGE_KEY_FILE2 = 'fitCompare_file2';
  const STORAGE_KEY_FILE3 = 'fitCompare_file3';
  const STORAGE_KEY_FILE1_NAME = 'fitCompare_file1_name';
  const STORAGE_KEY_FILE2_NAME = 'fitCompare_file2_name';
  const STORAGE_KEY_FILE3_NAME = 'fitCompare_file3_name';
  function checkFiles() {
    files.file1 = fileInput1.files[0];
    files.file2 = fileInput2.files[0];
    files.file3 = fileInput3.files[0];
    
    // At least file1 must be selected
    compareBtn.disabled = !files.file1;
    
    // Update button text based on number of files
    if (files.file1) {
      const fileCount = (files.file1 ? 1 : 0) + (files.file2 ? 1 : 0) + (files.file3 ? 1 : 0);
      compareBtn.textContent = fileCount === 1 ? 'View' : 'Compare';
    } else {
      compareBtn.textContent = 'Compare';
    }
  }
  
  fileInput1.addEventListener('change', checkFiles);
  fileInput2.addEventListener('change', checkFiles);
  fileInput3.addEventListener('change', checkFiles);
  compareBtn.addEventListener('click', handleCompare);

  // Clear saved data button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {      if (confirm('Are you sure you want to clear the saved comparison? This will require you to reload files on next visit.')) {
        clearLocalStorage();
        showNotification('Saved data cleared', 'success');
        clearBtn.classList.add('hidden');
        // Optionally reload the page
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }
  // Try to restore previous comparison on load
  restoreFromLocalStorage();
  
  function handleCompare() {
    const loadedFiles = [];
    const fileNames = [];
    const readers = [];
    
    // Prepare readers for each file
    if (files.file1) {
      loadedFiles.push(files.file1);
      fileNames.push(files.file1.name);
    }
    if (files.file2) {
      loadedFiles.push(files.file2);
      fileNames.push(files.file2.name);
    }
    if (files.file3) {
      loadedFiles.push(files.file3);
      fileNames.push(files.file3.name);
    }
    
    // Read all files
    const buffers = [];
    let filesRead = 0;
    
    loadedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        buffers[index] = e.target.result;
        filesRead++;
        
        // When all files are read, process them
        if (filesRead === loadedFiles.length) {
          saveToLocalStorage(buffers, fileNames);
          parseAndVisualize(buffers, fileNames);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
  function saveToLocalStorage(buffers, names) {
    try {
      // Convert ArrayBuffers to base64 for storage
      const storageKeys = [STORAGE_KEY_FILE1, STORAGE_KEY_FILE2, STORAGE_KEY_FILE3];
      const nameKeys = [STORAGE_KEY_FILE1_NAME, STORAGE_KEY_FILE2_NAME, STORAGE_KEY_FILE3_NAME];
      
      // Clear all storage first
      storageKeys.forEach(key => localStorage.removeItem(key));
      nameKeys.forEach(key => localStorage.removeItem(key));
      
      // Save each file that exists
      buffers.forEach((buffer, index) => {
        if (buffer && names[index]) {
          const base64 = arrayBufferToBase64(buffer);
          localStorage.setItem(storageKeys[index], base64);
          localStorage.setItem(nameKeys[index], names[index]);
        }
      });
      
      console.log(`Saved ${buffers.length} file(s) to localStorage`);
      
      // Show clear button
      const clearBtn = document.getElementById('clearBtn');
      if (clearBtn) {
        clearBtn.classList.remove('hidden');
      }
    } catch (e) {
      console.warn('Failed to save to localStorage (data may be too large):', e);
      if (e.name === 'QuotaExceededError') {
        clearLocalStorage();
        showNotification('Files too large to save for future sessions', 'error');
      }
    }
  }
  function restoreFromLocalStorage() {
    try {
      const buffers = [];
      const names = [];
      
      // Try to restore all 3 files
      const storageKeys = [STORAGE_KEY_FILE1, STORAGE_KEY_FILE2, STORAGE_KEY_FILE3];
      const nameKeys = [STORAGE_KEY_FILE1_NAME, STORAGE_KEY_FILE2_NAME, STORAGE_KEY_FILE3_NAME];
      
      storageKeys.forEach((key, index) => {
        const base64 = localStorage.getItem(key);
        const name = localStorage.getItem(nameKeys[index]);
        if (base64 && name) {
          buffers.push(base64ToArrayBuffer(base64));
          names.push(name);
        }
      });
      
      if (buffers.length > 0) {
        console.log(`Restored ${buffers.length} file(s) from localStorage`);
        
        // Show loading message
        showNotification('Restoring previous comparison...', 'info');

        // Parse and visualize with a slight delay
        setTimeout(() => {
          parseAndVisualize(buffers, names, () => {
            // Remove all info notifications before showing success
            document.querySelectorAll('.notification-info').forEach(n => n.remove());
            
            showNotification('Previous comparison restored!', 'success');
            
            // Show clear button
            const clearBtn = document.getElementById('clearBtn');
            if (clearBtn) {
              clearBtn.classList.remove('hidden');
            }
          });
        }, 100);
      }
    } catch (e) {
      console.warn('Failed to restore from localStorage:', e);
      clearLocalStorage();
    }
  }

  function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY_FILE1);
    localStorage.removeItem(STORAGE_KEY_FILE2);
    localStorage.removeItem(STORAGE_KEY_FILE3);
    localStorage.removeItem(STORAGE_KEY_FILE1_NAME);
    localStorage.removeItem(STORAGE_KEY_FILE2_NAME);
    localStorage.removeItem(STORAGE_KEY_FILE3_NAME);
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Check if there are existing notifications and adjust position
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length > 0) {
      // Stack notifications with spacing
      let topOffset = 20;
      existingNotifications.forEach(notif => {
        const rect = notif.getBoundingClientRect();
        topOffset = Math.max(topOffset, rect.bottom + 10);
      });
      notification.style.top = `${topOffset}px`;
    }
    
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }function parseAndVisualize(buffers, fileNames, onComplete = null) {
    const parsers = buffers.map(() => new FitParser({ force: true }));
    const parsedData = [];
    let filesProcessed = 0;
    
    // Parse all files
    buffers.forEach((buffer, index) => {
      parsers[index].parse(buffer, (err, data) => {
        if (err) {
          console.error(`Error parsing file ${index + 1}:`, err);
          showNotification(`Error parsing File ${index + 1}`, 'error');
          return;
        }
        
        if (!data || !data.records) {
          console.error(`Could not find records for file ${index + 1}`);
          showNotification(`No record data found in File ${index + 1}`, 'error');
          return;
        }
        
        parsedData[index] = data;
        filesProcessed++;
        
        // When all files are parsed, visualize
        if (filesProcessed === buffers.length) {
          const records = parsedData.map(d => d.records);
          visualizeData(records, parsedData, fileNames);
          
          // Call completion callback if provided
          if (onComplete) {
            onComplete();
          }
        }
      });
    });
  }function visualizeData(recordsArray, dataArray, fileNames) {
    // Destroy old charts if they exist
    Object.values(charts).forEach(chart => chart.destroy());

    const deviceNames = dataArray.map(data => getDeviceName(data));
    
    // Extract dates for legend display
    const activityDates = dataArray.map(data => getActivityDate(data));
    
    // Check if all device names are the same
    const allSameDevice = deviceNames.every(name => name === deviceNames[0]);
    const legendLabels = allSameDevice ? activityDates : deviceNames;
    
    // Debug: Check what fields are available
    recordsArray.forEach((records, i) => {
      console.log(`File ${i + 1} sample record:`, records[0]);
    });

    // Cache records for map marker updates
    cachedRecords.records1 = recordsArray[0] || [];
    cachedRecords.records2 = recordsArray[1] || [];
    cachedRecords.records3 = recordsArray[2] || [];

    // Show/hide table columns based on number of files
    updateTableVisibility(recordsArray.length);

    // Display session summary
    displaySessionSummary(dataArray, deviceNames, fileNames);    // Create charts and populate custom legends
    charts.hrChart = createChart('hrChart', 'Heart Rate', recordsArray, 'heart_rate', deviceNames);
    populateChartLegend('hrLegend', legendLabels);
    
    charts.paceChart = createChart('paceChart', 'Pace', recordsArray, ['speed', 'enhanced_speed'], deviceNames);
    populateChartLegend('paceLegend', legendLabels);
    
    charts.elevationChart = createChart('elevationChart', 'Elevation', recordsArray, ['altitude', 'enhanced_altitude'], deviceNames);
    populateChartLegend('elevationLegend', legendLabels);

    // Create map and populate map legend
    createMap(recordsArray, deviceNames);
    populateChartLegend('mapLegend', legendLabels);

    // Set up chart synchronization
    setupChartSync();
  }

  function updateTableVisibility(fileCount) {
    const file2Cols = document.querySelectorAll('.file2-column');
    const file3Cols = document.querySelectorAll('.file3-column');
    
    if (fileCount >= 2) {
      file2Cols.forEach(col => col.classList.remove('hidden'));
    } else {
      file2Cols.forEach(col => col.classList.add('hidden'));
    }
    
    if (fileCount >= 3) {
      file3Cols.forEach(col => col.classList.remove('hidden'));
    } else {
      file3Cols.forEach(col => col.classList.add('hidden'));
    }
  }

  function setupChartSync() {
    Object.values(charts).forEach(chart => {
      const canvas = chart.canvas;
      
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Get the time value at this x position
        const canvasX = chart.scales.x.getValueForPixel(x);
        
        if (canvasX !== undefined && canvasX !== null) {
          // Update crosshair on all charts
          Object.values(charts).forEach(c => {
            const pixelX = c.scales.x.getPixelForValue(canvasX);
            c.crosshair = { x: pixelX };
            c.update('none'); // Update without animation
          });
          
          // Update map markers
          updateMapMarkers(canvasX);
        }
      });
      
      canvas.addEventListener('mouseleave', () => {
        // Clear crosshairs
        Object.values(charts).forEach(c => {
          c.crosshair = null;
          c.update('none');
        });
        
        // Remove map markers
        clearMapMarkers();
      });
    });
  }
  function updateMapMarkers(timeValue) {
    if (!map || !cachedRecords.records1.length) return;
    
    // Find the closest records to this time value for all files
    const records = [
      cachedRecords.records1.length ? findRecordAtTime(cachedRecords.records1, timeValue) : null,
      cachedRecords.records2.length ? findRecordAtTime(cachedRecords.records2, timeValue) : null,
      cachedRecords.records3.length ? findRecordAtTime(cachedRecords.records3, timeValue) : null
    ];
    
    const markerKeys = ['marker1', 'marker2', 'marker3'];
    
    records.forEach((record, index) => {
      const markerKey = markerKeys[index];
      
      if (record && record.position_lat && record.position_long) {
        if (mapMarkers[markerKey]) {
          mapMarkers[markerKey].setLatLng([record.position_lat, record.position_long]);
        } else {
          mapMarkers[markerKey] = L.circleMarker([record.position_lat, record.position_long], {
            color: colors[index].border,
            fillColor: colors[index].fill,
            fillOpacity: 1,
            radius: 6,
            weight: 2
          }).addTo(map);
        }
      }
    });
  }

  function findRecordAtTime(records, timeValue) {
    if (records.length === 0) return null;
    
    const startTime = new Date(records[0].timestamp).getTime();
    const targetTime = startTime + timeValue;
    
    // Binary search for closest record
    let closest = records[0];
    let minDiff = Math.abs(new Date(closest.timestamp).getTime() - targetTime);
    
    for (let i = 0; i < records.length; i++) {
      const recordTime = new Date(records[i].timestamp).getTime();
      const diff = Math.abs(recordTime - targetTime);
      
      if (diff < minDiff) {
        minDiff = diff;
        closest = records[i];
      } else if (diff > minDiff) {
        // Since records are chronological, we can break early
        break;
      }
    }
    
    return closest;
  }
  function clearMapMarkers() {
    if (mapMarkers.marker1) {
      map.removeLayer(mapMarkers.marker1);
      mapMarkers.marker1 = null;
    }
    if (mapMarkers.marker2) {
      map.removeLayer(mapMarkers.marker2);
      mapMarkers.marker2 = null;
    }
    if (mapMarkers.marker3) {
      map.removeLayer(mapMarkers.marker3);
      mapMarkers.marker3 = null;
    }
  }  function displaySessionSummary(dataArray, deviceNames, fileNames) {
    const summarySection = document.getElementById('summarySection');
    const summaryBody = document.getElementById('summaryBody');
    const device1Header = document.getElementById('device1Header');
    const device2Header = document.getElementById('device2Header');
    const device3Header = document.getElementById('device3Header');    // Get session data (use first session if multiple exist)
    const sessions = dataArray.map(data => 
      data.sessions && data.sessions.length > 0 ? data.sessions[0] : {}
    );

    // Get activity dates for each file
    const dates = dataArray.map(getActivityDate);
    
    device1Header.innerHTML = `${deviceNames[0]}<br><small style="font-weight: normal; font-size: 0.85em;">${fileNames[0]}</small>${dates[0] ? `<br><small style="font-weight: normal; font-size: 0.8em; color: #666;">${dates[0]}</small>` : ''}`;
    device1Header.style.borderBottom = `3px solid ${colors[0].border}`;
    
    if (dataArray.length >= 2) {
      device2Header.innerHTML = `${deviceNames[1]}<br><small style="font-weight: normal; font-size: 0.85em;">${fileNames[1]}</small>${dates[1] ? `<br><small style="font-weight: normal; font-size: 0.8em; color: #666;">${dates[1]}</small>` : ''}`;
      device2Header.style.borderBottom = `3px solid ${colors[1].border}`;
    }
    
    if (dataArray.length >= 3) {
      device3Header.innerHTML = `${deviceNames[2]}<br><small style="font-weight: normal; font-size: 0.85em;">${fileNames[2]}</small>${dates[2] ? `<br><small style="font-weight: normal; font-size: 0.8em; color: #666;">${dates[2]}</small>` : ''}`;
      device3Header.style.borderBottom = `3px solid ${colors[2].border}`;
    }

    // Helper function to format time (in seconds) as HH:MM:SS
    const formatTime = (seconds) => {
      if (!seconds) return 'N/A';
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Helper function to format distance (in meters) as km
    const formatDistance = (meters) => {
      if (!meters) return 'N/A';
      return `${(meters / 1000).toFixed(2)} km`;
    };

    // Define metric getters
    const metricConfigs = [
      {
        label: 'Total Time',
        getValue: (session) => session.total_elapsed_time || session.total_timer_time,
        format: formatTime
      },
      {
        label: 'Total Distance',
        getValue: (session) => session.total_distance,
        format: formatDistance
      },
      {
        label: 'Total Calories',
        getValue: (session) => session.total_calories,
        format: (val) => val ? `${val} kcal` : 'N/A'
      },
      {
        label: 'Avg Heart Rate',
        getValue: (session) => session.avg_heart_rate,
        format: (val) => val ? `${val} bpm` : 'N/A'
      },
      {
        label: 'Max Heart Rate',
        getValue: (session) => session.max_heart_rate,
        format: (val) => val ? `${val} bpm` : 'N/A'
      }
    ];

    // Clear existing rows
    summaryBody.innerHTML = '';

    // Add rows for each metric
    metricConfigs.forEach(config => {
      const row = document.createElement('tr');
      const values = sessions.map(session => {
        const rawValue = config.getValue(session);
        return config.format(rawValue);
      });
      
      let rowHtml = `<td><strong>${config.label}</strong></td>`;
      rowHtml += `<td>${values[0] || 'N/A'}</td>`;
      rowHtml += `<td class="file2-column">${values[1] || 'N/A'}</td>`;
      rowHtml += `<td class="file3-column">${values[2] || 'N/A'}</td>`;
      
      row.innerHTML = rowHtml;
      summaryBody.appendChild(row);
    });

    // Show the summary section
    summarySection.classList.remove('hidden');
  }

  function getDeviceName(data) {
    if (!data) {
      return 'Unknown Device';
    }
  
    // Check file_ids array first
    if (data.file_ids && data.file_ids.length > 0) {
      const fileId = data.file_ids[0];
      const manufacturer = fileId.manufacturer || 'Unknown';
      const productName = fileId.product_name || (fileId.product ? `Product ${fileId.product}` : '');
      return `${manufacturer} ${productName}`.trim() || 'Unknown Device';
    }
    
    // Check device_infos array as fallback
    if (data.device_infos && data.device_infos.length > 0) {
      const deviceInfo = data.device_infos[0];
      const manufacturer = deviceInfo.manufacturer || 'Unknown';
      const productName = deviceInfo.product_name || (deviceInfo.product ? `Product ${deviceInfo.product}` : '');
      return `${manufacturer} ${productName}`.trim() || 'Unknown Device';
    }
  
    return 'Unknown Device';
  }

  // Helper function to extract activity date from FIT data
  function getActivityDate(data) {
    let timestamp = null;
    
    // Try to get from session first
    if (data.sessions && data.sessions.length > 0 && data.sessions[0].timestamp) {
      timestamp = data.sessions[0].timestamp;
    } 
    // Fallback to first record
    else if (data.records && data.records.length > 0 && data.records[0].timestamp) {
      timestamp = data.records[0].timestamp;
    }
    
    if (timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return '';
  }

  // Helper function to populate custom chart legends
  function populateChartLegend(legendId, deviceNames) {
    const legendDiv = document.getElementById(legendId);
    if (!legendDiv) return;

    legendDiv.innerHTML = '';

    deviceNames.forEach((name, index) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';

      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = colors[index].border;

      const labelSpan = document.createElement('span');
      labelSpan.textContent = name;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(labelSpan);
      legendDiv.appendChild(legendItem);
    });
  }

  function createChart(canvasId, label, recordsArray, field, deviceNames) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Handle multiple possible field names
    const fieldNames = Array.isArray(field) ? field : [field];
    
    // Find which field name exists in the data
    const getFieldValue = (record) => {
      for (const fieldName of fieldNames) {
        if (record[fieldName] != null) {
          return record[fieldName];
        }
      }
      return null;
    };
    
    // Create datasets for all files
    const datasets = recordsArray.map((records, index) => {
      const startTime = records.length > 0 ? new Date(records[0].timestamp).getTime() : 0;
      const data = records
        .map(r => {
          const value = getFieldValue(r);
          if (value != null && r.timestamp != null) {
            return { x: new Date(r.timestamp).getTime() - startTime, y: value };
          }
          return null;
        })
        .filter(d => d != null);

      console.log(`${label} - ${deviceNames[index]}: ${data.length} points`);

      return {
        label: deviceNames[index],
        data: data,
        borderColor: colors[index].border,
        backgroundColor: colors[index].fill + '33', // Add transparency
        tension: 0.1,
        pointRadius: 0,
      };
    });

    return new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 4,
        borderWidth: 1,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        onHover: (event, activeElements, chart) => {
          // This helps trigger canvas mousemove events
          chart.canvas.style.cursor = activeElements.length > 0 ? 'crosshair' : 'default';
        },        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false // Disabled - using custom legend in summary
          },
          tooltip: {
            enabled: false
          },
          crosshair: {
            enabled: true
          }
        },        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Elapsed Time (hr:mins:ss)'
            },
            grid: {
              display: false
            },
            ticks: {
              callback: function(value, index, values) {
                const hours = Math.floor(value / 3600000);
                const minutes = Math.floor((value % 3600000) / 60000);
                const seconds = Math.floor(((value % 360000) % 60000) / 1000);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              }
            }
          },          y: {
            title: {
              display: false
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }  function createMap(recordsArray, deviceNames) {
    if (map) {
      map.remove();
    }
    map = L.map('map');
    
    // Store map reference globally for tile updates
    window.map = map;

    // Use Dark Matter tiles for dark mode, standard OSM for light mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
      window.mapTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
    } else {
      window.mapTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }

    // Create tracks for all files
    const tracks = recordsArray.map(records => 
      records.filter(r => r.position_lat && r.position_long)
             .map(r => [r.position_lat, r.position_long])
    );

    // Add polylines for each track
    const allTrackPoints = [];
    tracks.forEach((track, index) => {
      if (track.length > 0) {
        L.polyline(track, { color: colors[index].border, weight: 2 }).addTo(map);
        allTrackPoints.push(...track);
      }
    });    // Fit bounds to include all tracks
    if (allTrackPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allTrackPoints));
    }

    // Legend is now in the summary header (mapLegend div)
  }
});