
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

    dialog.innerHTML = `
    <form method="dialog">
      <img id="dialogImage" src="${fullImageLink}" loading="lazy">
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
    <div>
    <p>
    If you have any comments on this article then please get in touch via <a href="https://twitter.com/dbs_sticky" title="My Twitter profile" target="_blank">X</a> or <a href="https://mastodon.social/@DBSSticky#" title="My Mastodon profile" target="_blank">Mastodon</a>.
  </p>
  <div>
  `;
  }
  
}

// register component
if(!customElements.get('feedback-contact')) customElements.define('feedback-contact', Feedback);