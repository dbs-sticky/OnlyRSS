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
		<p>
		<img src="${fullImageLink}" loading="lazy">
		</p>
    <p>${description}</p>
		<p style="text-align:center">
    <button type="submit">Close</button>
		</p>
  </form>
		`;
		parent.parentNode.insertBefore(dialog, parent.nextSibling);

		img.addEventListener('click', e => {
			e.preventDefault();
			dialog.showModal();
		});
		
	}

}

if(!customElements.get('dialog-image')) customElements.define('dialog-image', DialogImage);