// Define a function named createOutline
function createOutline() {
  // Get all the headings in the document
  let headings = document.querySelectorAll("h2, h3, h4");

  // Create an empty array to store the outline items
  let outline = [];

  // Loop through the headings and extract the text and level
  for (let heading of headings) {
    let text = heading.textContent;
    let level = parseInt(heading.tagName.slice(1));
    // Get the index of the heading in the headings array
    let index = Array.prototype.indexOf.call(headings, heading);
    // Generate an id based on the index
    let id = "heading-" + index;
    // Set the id attribute of the heading element
    heading.setAttribute("id", id);
    // Push an object with the text, level and id to the outline array
    outline.push({text, level, id});
  }

  // Create a function to display the outline as a nested list
  function displayOutline(outline) {
    // Create an empty string to store the html output
    let html = "";
    // Keep track of the current level and the previous level
    let currentLevel = 0;
    let previousLevel = 0;
    // Loop through the outline items
    for (let item of outline) {
      // Get the text and level of the item
      let text = item.text;
      let level = item.level;
      // Update the current level
      currentLevel = level;
      // If the current level is greater than the previous level, start a new list
      if (currentLevel > previousLevel) {
        html += "<ul>";
      }
      // If the current level is less than the previous level, close the list
      if (currentLevel < previousLevel) {
        html += "</ul>".repeat(previousLevel - currentLevel);
      }
      // Get the id of the corresponding html element
      let id = item.id;
      // Add a list item with a hyperlink to the html element
      html += "<li><a href='#" + id + "'>" + text + "</a></li>";
      // Update the previous level
      previousLevel = currentLevel;
    }
    // Close any remaining lists
    html += "</ul>".repeat(currentLevel);
    // Return the html output
    return html;
  }

  // Display the outline in the div with id "docoutline"
  document.getElementById("docoutline").innerHTML = displayOutline(outline);
}
