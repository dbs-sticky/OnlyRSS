/**
 * 
 * @param {string} elementType The element type to enumerate and create and outline of. eg: `h2`, `figure`
 * @param {string} targetId The element ID into which the generated list of links will be added.
 */
function createOutline(elementType, targetId) {
  // Get all the items (eg, h2, figure) in the document
  let elements = document.querySelectorAll(elementType);

  // Create an empty array to store the outline items
  let outline = [];

  // Process each item and add to the outline array
  elements.forEach((element, index) => {
      // Check if the element type is figure
      if (elementType === "figure") {
          // Get the figcaption element inside the figure
          let figcaption = element.querySelector("figcaption");
          // Use the figcaption text as the link text
          text = figcaption.textContent;
      } else {
          // Use the element text as the link text
          text = element.textContent;
      }
      id = `${elementType}-${index}`;
      // Set an ID for each item
      element.setAttribute("id", id);
      outline.push({text, id});
  });
  
  
  // Create a link to each item inside an unordered list
  let contentList = document.createElement("ul");
  outline.forEach( o => { 
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.setAttribute("href", `#${o.id}`);
      // Set title attribute, to help with long text
      a.setAttribute("title", o.text.trim());
      a.textContent = o.text;
      li.appendChild(a);
      contentList.appendChild(li);
  });

// Append the generated links to the outline div
document.getElementById(targetId).appendChild(contentList);

}

/**
* Creates an outline from `h2` elements in the document and writes to `doc_outline`
*/
function createHeadingsOutline(){
createOutline("h2", "doc_outline");
}

/**
* Creates an outline from `figure` elements in the document and writes to `doc_figures`
*/
function createFiguresOutline(){
createOutline("figure", "doc_figures")
}
