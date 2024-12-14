// prerequisits:
  //Filter buttons are in a container with class "filter-button-row"
  //Filter buttons have a class "filter-btn"
  //Filter buttons have a data-filter attribute with a value that matches the data-category attribute of the content items they should filter
  //Content items have a data-category attribute with a value that matches the data-filter attribute of the filter buttons that should filter them



const filterList = document.querySelector('.filter-button-row');    // Select the filter button row
const filterButtons = filterList.querySelectorAll('.filter-btn');   // Select all filter buttons
const content = document.querySelectorAll("[data-category]");       // Select all content items with a data-category attribute

filterButtons.forEach((button) => {                                 // For each filter button
  button.addEventListener('click', (e) => {                         // Add a click event listener
    const appliedFilter = e.target.dataset.filter;                  // Get the filter value from the clicked button
    console.log('filter applied: ' + appliedFilter);                // Log the filter value to the console

    if (!document.startViewTransition) {                            // If there's no ongoing view transition
      updateActiveButton(e.target);                                 // Update the active button
      filterContentByCategory(appliedFilter);                       // Filter the content by the selected category
    } else {                                                        // If there's an ongoing view transition
      document.startViewTransition(() => {                          // Start a new view transition
        updateActiveButton(e.target);                               // Update the active button
        filterContentByCategory(appliedFilter);                     // Filter the content by the selected category
      })
    }
  })
})

function updateActiveButton(newButton) {                                     // Function to update the active button
  filterList.querySelector('.active').classList.remove('active');            // Remove the 'active' class from the currently active button
  newButton.classList.add('active');                                         // Add the 'active' class to the new button
}

function filterContentByCategory(appliedFilter) {                           // Function to filter content by category
  content.forEach((contentItem) => {                                        // For each content item
    const contentCategories = contentItem.dataset.category.split(' ');      // Get the categories of the content item and split them into an array
    if (appliedFilter === 'all' || contentCategories.includes(appliedFilter)) { // If the applied filter is 'all' or is included in the content categories
      contentItem.hidden = false;                                           // Show the content item
    } else {                                                                // If the applied filter is not included in the content categories
      contentItem.hidden = true;                                            // Hide the content item
    }
  });
}