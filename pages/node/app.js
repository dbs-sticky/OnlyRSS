const fs = require('fs');
const path = require('path');

// Function to generate a random number between 1 and 1000
function generateRandomNumber() {
    return Math.floor(Math.random() * 1000) + 1;
}

// Function to create HTML content
function generateHtmlContent(randomNumber) {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Number Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .number {
            font-size: 72px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .timestamp {
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Random Number Generator</h1>
    <div class="number">${randomNumber}</div>
    <p class="timestamp">Last updated: ${timestamp}</p>
</body>
</html>
    `;
}

// Function to write the random number to an HTML file
function updateRandomNumberFile() {
    const randomNumber = generateRandomNumber();
    const htmlContent = generateHtmlContent(randomNumber);
    const filePath = path.join(__dirname, 'random-number.html');
    
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log(`Random number ${randomNumber} generated at ${new Date().toLocaleString()}`);
        console.log(`File updated: ${filePath}`);
    });
}

// Generate a number immediately on startup
updateRandomNumberFile();

// Set up interval to generate a new number every 5 minutes
const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
setInterval(updateRandomNumberFile, FIVE_MINUTES);

console.log('Random number generator started. Press Ctrl+C to exit.');