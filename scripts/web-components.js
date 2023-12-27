
// —————————————————————————image dialog modal Web Component—————————————————————————


class DialogImage extends HTMLElement {
	constructor() {
		super();
	}

	
  connectedCallback() {
    // Get my image, should be one only.
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
    let description = (img.getAttribute('title') || '');  // Get the title attribute, if any.
    let altText = (img.getAttribute('alt') || '');  // Get the alt text attribute, if any.

    dialog.innerHTML = `
    <form method="dialog">
      <img id="dialogImage" src="${fullImageLink}" alt="${altText}" loading="lazy">
      <p id="dialogDescription">${description}</p>
      <footer>
        <button type="submit">Close</button>
      </footer>
    </form>
    `;
    parent.parentNode.insertBefore(dialog, parent.nextSibling);

    img.addEventListener('click', e => {
        e.preventDefault();
        dialog.showModal();

        // Get the naturalWidth of the linked image and set it to the width of the <p>
        let dialogImage = dialog.querySelector('#dialogImage');
        let dialogDescription = dialog.querySelector('#dialogDescription');
        dialogImage.onload = function() {
            dialogDescription.style.maxWidth = this.naturalWidth + 'px';
        };
    });
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
        <img class="byline-avatar" src="/images/avatar.webp" Alt="The article author's avatar" height="50" width="50">
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
      // Get all elements of the specified type
      const elements = document.querySelectorAll(elementType);
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