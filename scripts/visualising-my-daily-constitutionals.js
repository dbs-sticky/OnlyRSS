// Get the JSON data
const dataScript = document.getElementById('data-script');
const data = JSON.parse(dataScript.textContent);

// Get all grid cells
const gridCells = document.querySelectorAll('grid-cell');

// Find the max distance for normalization
const distances = Object.values(data).map(Number);
const maxDistance = Math.max(...distances);

// calculate statistics
const totalDistance = Math.round(distances.reduce((a, b) => a + b, 0));
const averageDistance = Math.round(totalDistance / distances.length);
const longestWalk = Math.round(Math.max(...distances));
const averageWeek = Math.round(totalDistance / 52);
document.getElementById('total-distance').textContent = `Total distance: ${totalDistance} km`;
document.getElementById('average-distance').textContent = `Average distance: ${averageDistance} km`;
document.getElementById('longest').textContent = `Longest walk: ${longestWalk} km`;
document.getElementById('average-week').textContent = `Average week: ${averageWeek} km`;


// Function to get color based on distance walked using oklch color space
function getColor(distance) {
    const lightness = Math.round((100 * (Math.log(distance + 1) / Math.log(maxDistance + 1))));
    const chroma = 0.37;
    const hue = 142;
    return `oklch(${lightness}% ${chroma} ${hue})`;
}


// Create tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = '#333';
tooltip.style.color = '#fff';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.style.pointerEvents = 'none';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

// Apply colors to grid cells and add hover event
gridCells.forEach((cell, index) => {
    const day = index + 1;
    if (data[day]) {
        const distance = parseFloat(data[day]);
        const cellColor = getColor(distance);
        cell.style.backgroundColor = cellColor;
        cell.style.boxShadow = `0px 0px 8px ${distance/10}px ${cellColor}`;
        cell.style.zIndex = Math.round(distance);


        // Add hover event
        cell.addEventListener('mouseenter', (e) => {
            tooltip.textContent = `Distance: ${distance} km`;
            tooltip.style.display = 'block';
            tooltip.style.zIndex = 101;
            // tooltip.style.left = `${e.pageX + 10}px`;
            // tooltip.style.top = `${e.pageY + 10}px`;
        });

        cell.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        cell.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
    }
});
