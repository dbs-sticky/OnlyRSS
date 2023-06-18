function createOutline() {
    // Get all the headings in the document
    let headings = document.querySelectorAll("h2");

    // Create an empty array to store the outline items
    let outline = [];

    // Process each heading and add to the outline array
    headings.forEach((heading, idx) => {
        text = heading.textContent;
        id = `heading-${idx}`;
        // Set an ID for each heading
        heading.setAttribute("id", id);
        outline.push({text, id});
    });
    
    
		// Create a link to each heading inside an unordered list
		let contentList = document.createElement("ul");
		outline.forEach( o => { 
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.setAttribute("href", `#${o.id}`);
        a.textContent = o.text;
        li.appendChild(a);
        contentList.appendChild(li);
    });
  
  // Append the generated links to the outline div
	document.getElementById("doc_outline").appendChild(contentList);
  
}
