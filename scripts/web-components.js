
// —————————————————————————image dialog modal Web Component—————————————————————————


class DialogImage extends HTMLElement {
  connectedCallback() {
    let img = this.querySelector('img');

    if(!img) {
        console.warn('dialog-image: No image found. Exiting.');
        return;
    }

    let parent = img.parentNode;
    if(parent.nodeName !== 'A') {
        console.warn('dialog-image: Image not wrapped in link. Exiting.');
        return;            
    }

    let fullImageLink = parent.href;
    let dialog = document.createElement('dialog');
    let description = (img.getAttribute('title') || '');
    let altText = (img.getAttribute('alt') || '');

    dialog.innerHTML = `
    <form method="dialog">
      <img id="dialogImage" src="${fullImageLink}" alt="${altText}" loading="lazy">
      <p id="dialogDescription">${description}</p>
      <footer>
        <button id="prev" type="button">&lt; Previous</button>
        <button type="submit">Close</button>
        <button id="next" type="button">Next &gt;</button>
      </footer>
    </form>
    `;
    parent.parentNode.insertBefore(dialog, parent.nextSibling);

    let nextButton = dialog.querySelector('#next');
    let prevButton = dialog.querySelector('#prev');

    // Check if there are dialog-image siblings before or after the current one
    let nextDialogImage = this.nextElementSibling;
    let prevDialogImage = this.previousElementSibling;


    // Add event listeners to the Next and Previous buttons to open the next/previous dialog and close the current dialog
    nextButton.addEventListener('click', () => {
      if (nextDialogImage instanceof DialogImage) {
        dialog.close();
        nextDialogImage.showDialog();
      }
    });

    prevButton.addEventListener('click', () => {
      if (prevDialogImage instanceof DialogImage) {
        dialog.close();
        prevDialogImage.showDialog();
      }
    });

    // Add event listener to the Close button to set the width and check for next/previous images
    img.addEventListener('click', e => {
      e.preventDefault();
      dialog.showModal();

      // Check if there are dialog-image siblings before or after the current one
      let nextDialogImage = this.nextElementSibling;
      let prevDialogImage = this.previousElementSibling;

      // Check if there is a next image
      if (nextDialogImage instanceof DialogImage) {
        nextButton.disabled = false;
      } else {
        nextButton.disabled = true;
        nextButton.title = "Sorry, you've reached the end of the gallery";
      }

      // Check if there is a previous image
      if (prevDialogImage instanceof DialogImage) {
        prevButton.disabled = false;
      } else {
        prevButton.disabled = true;
        prevButton.title = "Sorry, you're at the start of the gallery";
      }

      let dialogImage = dialog.querySelector('#dialogImage');
      let dialogDescription = dialog.querySelector('#dialogDescription');
      dialogImage.onload = function() {
          dialogDescription.style.maxWidth = this.naturalWidth + 'px';
      };
  });
  }

  showDialog() {
    let img = this.querySelector('img');
    if (img) img.click();
  }
}

if(!customElements.get('dialog-image')) customElements.define('dialog-image', DialogImage);


// —————————————————————————feedback Web Component—————————————————————————
	

class Feedback extends HTMLElement {
  
  // connect component
  connectedCallback() {
    this.innerHTML = `
    <p>
      If you have any comments on this article then please get in touch via <a href="https://twitter.com/dbs_sticky" title="My Twitter profile" target="_blank">X</a> or <a href="https://mastodon.social/@DBSSticky#" title="My Mastodon profile" target="_blank">Mastodon</a>.
    </p>
  `;
  }
}

// register component
if(!customElements.get('feedback-contact')) customElements.define('feedback-contact', Feedback);


// —————————————————————————social links Web Component—————————————————————————
	

class Social extends HTMLElement {

  // connect component
  connectedCallback() {

    // Get the title and URL from the Open Graph tags.
    let ogTitle = document.querySelector("meta[property=\"og:title\"]").content;
    let ogUrl = document.querySelector("meta[property=\"og:url\"]").content;

    // Convert the title and URL to URIs.
    let titleUri = encodeURIComponent(ogTitle);
    let urlUri = encodeURIComponent(ogUrl)

    // Concatenate the titleURI and UrlUri together into links for each network.
    this.innerHTML = `
      <a href='http://reddit.com/submit?url=${urlUri}&title=${titleUri}' target='_blank' title='Share this article on Reddit'>
        <reddit-icon></reddit-icon>
      </a>
      <a href='https://www.facebook.com/sharer/sharer.php?u=${urlUri}' target='_blank' title='Share this article on Facebook'>
        <fb-icon></fb-icon>
      </a>
      <a href='https://x.com/intent/tweet?url=${urlUri}&text=${titleUri}' target='_blank' title='Share this article on X'>
        <x-icon></x-icon>
      </a>
      <a href='http://www.linkedin.com/shareArticle?mini=true&url=${urlUri}&title=${titleUri}' target='_blank' title='Share this article on LinkedIn'>
        <linkedin-icon></linkedin-icon>
      </a>
      <a href='mailto:?subject=${titleUri}&body=${urlUri}' target='_blank' title='Share this article on Email'>
        <email-icon></email-icon>
      </a>
    `;
  }
}
  
// register component
if(!customElements.get('social-icons')) customElements.define('social-icons', Social);


// —————————————————————————byline Web Component—————————————————————————
	

class byline extends HTMLElement {

  connectedCallback() {
    // Get the date and change the formet.
    let ogDate = document.querySelector("meta[property=\"article:published_time\"]").content;
    let date = new Date(ogDate);
    let day = String(date.getDate()).padStart(2, '0');
    let month = date.toLocaleString('default', { month: 'short' });
    let year = date.getFullYear();
    let formattedDate = `${day} ${month} ${year}`;
  
    // calculate the reading time
    // Select all the <p> tags in the document.
    let pTags = document.querySelectorAll('p');
  
    // Calculate the total number of characters in these tags.
    let totalChars = 0;
    pTags.forEach(pTag => {
      totalChars += pTag.textContent.length;
    });
  
    // Assume an average reading speed of 1250 characters per minute.
    let readingSpeed = 1250;
  
    // Calculate the reading time in minutes.
    let readingTime = Math.ceil(totalChars / readingSpeed);
  
    this.innerHTML = `
      <div>
        <img class="byline-avatar"  Alt="The article author's avatar" src="data:image/webp;base64,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"/>
      </div>
      <div class="byline-copy">
        <time datetime="${ogDate}">${formattedDate}</time> · <span>${readingTime} min</span> · <a href="/pages/about.html" title="About me, and about this website">Mark Evans</a>
      </div>
    `;
  }
}
  
// register component
if(!customElements.get('by-line')) customElements.define('by-line', byline);


// —————————————————————————Table of Contents Web Component—————————————————————————


class ToC extends HTMLElement {

  // connect component
  connectedCallback() {

    // Function to create an outline based on the specified element type
    function createOutline(elementType) {
      // Get all article elements
      const articles = document.querySelectorAll('article');
      // Initialize an empty array to store the elements of the specified type
      let elements = [];
      // Iterate over each article
      articles.forEach(article => {
        // Get all elements of the specified type within the current article
        const articleElements = article.querySelectorAll(elementType);
        // Add the elements to the elements array
        elements = [...elements, ...articleElements];
      });
      // If there are no elements of the specified type, return an empty string
      if (elements.length === 0) {
        return '';
      }
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

      // Return the content list
      return contentList.outerHTML;
    }

    // Function to create an outline for headings
    function createHeadingsOutline() {
      // Get the content list for headings
      const contentList = createOutline.call(this, "h2");
      // If the content list is not empty, set the innerHTML of the <table-of-contents> element
      if (contentList !== '') {
        this.innerHTML = '<div>Sections</div>' + contentList;
      }
    }

    // Function to create an outline for figures
    function createFiguresOutline() {
      // Get the content list for figures
      const contentList = createOutline.call(this, "figure");
      // If the content list is not empty, set the innerHTML of the <table-of-contents> element
      if (contentList !== '') {
        this.innerHTML += '<div>Figures</div>' + contentList;
      }
    }

    createHeadingsOutline.call(this);
    createFiguresOutline.call(this);
  }
}

// register component
if(!customElements.get('table-of-contents')) customElements.define('table-of-contents', ToC);


// —————————————————————————global nav Web Component—————————————————————————
	

class Nav extends HTMLElement {
  
  // connect component
  connectedCallback() {
    this.innerHTML = `
  <ul>
    <li><a href="../index.html" title="Homepage">home</a></li>
    <li><a href="../pages/subscribe.html" title="Subscribe via RSS">rss</a></li>
    <li><a href="../pages/changelog.html" title="View all website updates">changelog</a></li>
    <li><a href="../pages/about.html" title="Who made this site, and why?">about</a></li>
  </ul>
  `;
  }
}
// register component
if(!customElements.get('global-nav')) customElements.define('global-nav', Nav);