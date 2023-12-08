// Function to create an outline based on the specified element type and target ID
function createOutline(elementType, targetId) {
  // Get all elements of the specified type
  const elements = document.querySelectorAll(elementType);
  // Initialize an empty array to store the outline
  const outline = [];

  // Iterate over each element
  elements.forEach((element, index) => {
    let text;
    // If the element type is "figure", get the text content of the figcaption element
    if (elementType === "figure") {
      const figcaption = element.querySelector("figcaption");
      text = figcaption ? figcaption.textContent : '';
    } else {
      // For other element types, get the text content of the element
      text = element.textContent;
    }
    // Generate a unique ID for the element
    const id = `${elementType}-${index}`;
    // Set the ID of the element
    element.id = id;
    // Add the text and ID to the outline array
    outline.push({text, id});
  });

  // Create a new unordered list element to hold the outline
  const contentList = document.createElement("ul");
  // Iterate over each item in the outline array
  outline.forEach( o => { 
    // Create a new list item element
    const li = document.createElement("li");
    // Create a new anchor element
    const a = document.createElement("a");
    // Set the href attribute of the anchor element to link to the corresponding element ID
    a.href = `#${o.id}`;
    // Set the title attribute of the anchor element to the trimmed text content
    a.title = o.text.trim();
    // Set the text content of the anchor element
    a.textContent = o.text;
    // Append the anchor element to the list item element
    li.appendChild(a);
    // Append the list item element to the content list
    contentList.appendChild(li);
  });

  // Get the target element by its ID
  const targetElement = document.getElementById(targetId);
  // If the target element exists, append the content list to it
  if (targetElement) {
    targetElement.appendChild(contentList);
  } else {
    // If the target element does not exist, log an error message
    console.error(`Element with id "${targetId}" not found.`);
  }
}

// Function to create an outline for headings
function createHeadingsOutline() {
  createOutline("h2", "doc_outline");
}

// Function to create an outline for figures
function createFiguresOutline() {
  createOutline("figure", "doc_figures");
}