
//  ======================
//  MARK: img dialog
//  ======================


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


    // Add event listeners to the Next and Previous buttons to open the next/previous dialog and close the current dialog, but only if there is a next/previous dialog-image sibling and it's not been hidden by a filter
    nextButton.addEventListener('click', () => {
      if (nextDialogImage instanceof DialogImage && !nextDialogImage.hidden) {
        dialog.close();
        nextDialogImage.showDialog();
      }
    });

    prevButton.addEventListener('click', () => {
      if (prevDialogImage instanceof DialogImage && !prevDialogImage.hidden) {
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

      // Check if there is a next image and it's not been hidden by a filter
      if (nextDialogImage instanceof DialogImage && !nextDialogImage.hidden) {
        nextButton.disabled = false;
      } else {
        nextButton.disabled = true;
        nextButton.title = "Sorry, you've reached the end of the gallery";
      }

      // Check if there is a previous image and it's not been hidden by a filter
      if (prevDialogImage instanceof DialogImage && !prevDialogImage.hidden) {
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


//  ======================
//  MARK: feedback footer
//  ======================
	

class Feedback extends HTMLElement {
  
  // connect component
  connectedCallback() {
    this.innerHTML = `
    
    <div>
    <img alt="The article author's avatar" src="data:image/webp;base64,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">
    <p>
      Have a question? Get in touch via <a href="https://bsky.app/profile/onlyrss.org" title="My Bluesky profile" target="_blank">Bluesky</a> or <a href="https://mastodon.social/@DBSSticky" title="My Mastodon profile" target="_blank">Mastodon</a>.
      </p>
    </div>
    <a href="https://notbyai.fyi">    
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 131 42">
        <path fill="#fff" stroke="#000" d="M.5.5H116c8 0 14.5 6.5 14.5 14.5v26.5H15C7 41.5.5 35 .5 27z"/>
        <path fill="#000" d="M17.96 24.16a9.45 9.45 0 0 0 11.89 0l-1.34-1.66a7.32 7.32 0 0 1-9.21 0zm1.44-3.65v-2.87h2.13v2.87zm6.61-2.87v2.87h2.13v-2.87z"/>
        <path fill="#000" fill-rule="evenodd" d="M35 21.5a11.5 11.5 0 1 1-23 0 11.5 11.5 0 0 1 23 0m-2.13 0a9.37 9.37 0 1 1-18.74 0 9.37 9.37 0 0 1 18.74 0" clip-rule="evenodd"/>
        <path fill="#000" d="M48.29 22.18q1.49 0 2.42.79.95.78.95 2.6v6.51H49.1V26.2q0-.76-.2-1.17-.37-.75-1.41-.75-1.27 0-1.75 1.1-.24.57-.25 1.47v5.23H43v-9.65h2.42v1.4q.48-.74.91-1.07.77-.58 1.96-.58m9.27 8.12q1.1 0 1.69-.79.59-.79.59-2.25t-.6-2.23q-.58-.8-1.68-.8t-1.7.8q-.58.78-.58 2.23 0 1.46.58 2.25.6.8 1.7.8m4.9-3.04q0 2.13-1.2 3.64-1.22 1.51-3.7 1.51t-3.67-1.5q-1.22-1.52-1.22-3.65 0-2.1 1.22-3.64 1.21-1.53 3.68-1.53t3.68 1.53 1.21 3.63m.1-2.96v-1.8h1.34v-2.7h2.47v2.7h1.56v1.8h-1.56v5.11q0 .6.15.75.15.14.92.14h.23l.26-.02v1.9l-1.19.04q-1.77.06-2.42-.62-.42-.44-.42-1.34V24.3zm15.04-2.1q1.9 0 2.95 1.37 1.08 1.38 1.08 3.55 0 2.26-1.06 3.74t-2.94 1.48q-1.19 0-1.9-.48-.44-.28-.94-1v1.22h-2.45V19.02h2.5v4.65q.47-.68 1.04-1.03.68-.44 1.72-.44m-.64 8.06q.97 0 1.5-.8.54-.78.54-2.07 0-1.03-.26-1.7-.5-1.28-1.85-1.28-1.36 0-1.87 1.25-.26.66-.26 1.72 0 1.24.54 2.06.55.82 1.66.82m6.13 3.68.32.02a4 4 0 0 0 .7-.03q.34-.04.57-.2.22-.15.4-.63.2-.48.16-.59l-3.52-10.1h2.79l2.09 7.14 1.98-7.14h2.66l-3.29 9.52q-.95 2.75-1.5 3.4-.55.67-2.21.67h-.54l-.6-.03zm14.7-6.8h3.28l-1.62-5.15zm.16-8.14h3.06l4.58 13.09h-2.93l-.83-2.7h-4.78l-.9 2.7h-2.82zm12.64 13.09h-2.69V19h2.69z"/>
        <path fill="#000" d="M106.3 19h5.7v2.23h-5.7zm0 10.86h5.7v2.23h-5.7zM42.99 9.9 44 13.87l1.03-3.97h1l1.04 3.94 1.08-3.94h.9l-1.54 5.04h-.93l-1.08-3.9-1.04 3.9h-.93L42 9.9zm6.84 0h.84v.87q.1-.26.51-.62a1.35 1.35 0 0 1 1.02-.36l.2.02v.89a1.4 1.4 0 0 0-.29-.02q-.67 0-1.03.41t-.36.95v2.9h-.9zm3.25.02h.9v5.01h-.9zm0-1.9h.9v.96h-.9zm2.33.47h.9v1.4h.85v.7h-.85v3.29q0 .26.19.35.1.05.35.05h.14l.17-.01v.67l-.32.06a3 3 0 0 1-.36.02q-.62 0-.85-.3-.22-.31-.22-.8V10.6h-.72v-.7h.72zm2.72 0h.9v1.4h.85v.7h-.85v3.29q0 .26.2.35.1.05.34.05h.14l.17-.01v.67q-.15.04-.32.06a3 3 0 0 1-.36.02q-.62 0-.85-.3-.22-.31-.22-.8V10.6h-.72v-.7h.72zm4.75 1.3q.57 0 1.1.25.53.25.8.65.27.38.36.89.08.34.08 1.1h-3.89q.03.77.38 1.24.36.46 1.1.46.7 0 1.12-.44.24-.25.34-.59h.87q-.03.28-.23.62-.2.34-.43.56-.41.38-1 .5a3.2 3.2 0 0 1-.74.08q-.99 0-1.68-.68-.68-.69-.68-1.92 0-1.21.69-1.97t1.81-.76m1.42 2.23q-.05-.55-.25-.88-.37-.6-1.22-.6-.62 0-1.03.41-.42.42-.44 1.07zm1.92-2.11h.84v.71q.38-.44.8-.63a2.2 2.2 0 0 1 .94-.2q1.12 0 1.52.75.22.41.22 1.17v3.23h-.9v-3.17q0-.46-.15-.74-.24-.47-.86-.47-.32 0-.52.06a1.34 1.34 0 0 0-.64.41 1.25 1.25 0 0 0-.3.52 3.4 3.4 0 0 0-.06.75v2.64h-.9zM74.4 8h.86v2.5q.29-.36.7-.54.4-.2.88-.2.99 0 1.6.65.62.65.62 1.9 0 1.2-.6 2-.62.78-1.7.78-.6 0-1.02-.27-.24-.17-.53-.53v.65h-.82zm2.3 6.35q.73 0 1.09-.55.36-.54.36-1.44 0-.8-.36-1.32t-1.06-.52q-.6 0-1.07.43-.45.43-.45 1.41 0 .71.19 1.15.35.84 1.3.84m6.62-4.45h.98l-.84 2.2-.8 2.12q-.78 1.93-1.1 2.36-.31.42-1.09.42l-.29-.01a3 3 0 0 1-.25-.06v-.77l.34.08q.1.02.18.01.25 0 .37-.08a.7.7 0 0 0 .2-.19l.17-.38q.16-.35.22-.52L79.46 9.9h1.01L81.9 14zM87.7 8h.9v2.58q.31-.38.56-.54.43-.27 1.08-.27 1.15 0 1.56.77.23.42.23 1.16v3.24h-.92v-3.18q0-.56-.15-.82-.24-.4-.9-.4-.57 0-1.02.35-.45.37-.45 1.37v2.67h-.89zm6.44 1.9v3.34q0 .39.13.63.23.45.88.45.93 0 1.27-.79.18-.42.18-1.16V9.9h.9v5.04h-.85l.01-.75q-.17.29-.43.49-.5.4-1.24.4-1.13 0-1.54-.73-.22-.38-.22-1.03V9.9zm4.65 0h.88v.71q.32-.37.57-.54a1.8 1.8 0 0 1 1-.29q.64 0 1.03.3.21.17.4.5.29-.4.69-.6.4-.2.9-.2 1.07 0 1.46.74.2.4.2 1.06v3.35H105v-3.5q0-.5-.27-.69a1.08 1.08 0 0 0-.64-.18q-.53 0-.9.33-.39.33-.39 1.11v2.93h-.9v-3.28q0-.52-.13-.75-.2-.36-.76-.36-.5 0-.92.38-.4.37-.4 1.34v2.68h-.9zm9.03 3.7q0 .36.28.57.28.21.67.21.47 0 .91-.2.74-.35.74-1.13v-.68q-.16.1-.42.17-.26.06-.5.09l-.54.06q-.49.07-.73.2-.41.22-.41.7m2.16-1.7q.3-.05.4-.25a.7.7 0 0 0 .07-.33q0-.43-.33-.62-.32-.2-.93-.2-.7 0-.99.36-.16.2-.2.58h-.84q.02-.93.63-1.29.62-.37 1.42-.37.94 0 1.52.34.58.34.58 1.06v2.9q0 .13.06.21.06.08.24.08h.13l.16-.03v.63a3 3 0 0 1-.31.07l-.3.01q-.46 0-.67-.3a1.2 1.2 0 0 1-.15-.47q-.28.33-.79.59-.5.24-1.12.24-.74 0-1.2-.42a1.4 1.4 0 0 1-.47-1.07q0-.7.46-1.08.46-.39 1.2-.48zm2.7-2h.84v.72q.38-.44.8-.63.42-.2.94-.2 1.13 0 1.52.75.22.41.22 1.17v3.24h-.9v-3.18q0-.46-.15-.74-.24-.47-.86-.47-.32 0-.52.06a1.35 1.35 0 0 0-.64.41 1.25 1.25 0 0 0-.3.52q-.06.26-.06.76v2.64h-.9z"/>
      </svg>

    </a>
  `;
  }
}

// register component
if(!customElements.get('feedback-contact')) customElements.define('feedback-contact', Feedback);



//  ======================
//  MARK: social links
//  ======================

class Social extends HTMLElement {

  // connect component
  connectedCallback() {

    // Get the title and URL from the Open Graph tags.
    let ogTitleTag = document.querySelector("meta[property=\"og:title\"]");
    let ogUrlTag = document.querySelector("meta[property=\"og:url\"]");
    
    // If the Open Graph tags are present, use them. Otherwise, use the document title and URL.
    let ogTitle = ogTitleTag ? ogTitleTag.content : document.title;
    let ogUrl = ogUrlTag ? ogUrlTag.content : window.location.href;

    // Convert the title and URL to URIs, encoding single quotes as well.
    let titleUri = encodeURIComponent(ogTitle).replace(/'/g, '%27');
    let urlUri = encodeURIComponent(ogUrl)

    const style = `
      <style>
        social-icons a {
        all: unset;
        }
        social-icons div {
        height: 35px;
        }
        social-icons div svg {
        cursor: pointer;
        transition: all 0.4s ease-in-out;
        width: 35px;
        fill: var(--accent);
        }
        social-icons div svg:hover {
        transform: scale(1.3);
        }
      </style>
      `;

    // Concatenate the titleURI and UrlUri together into the intent links for each network.
    const template = `
    <div>

      <a href='https://bsky.app/intent/compose?text=${titleUri}%20${urlUri}' target='_blank' title='Share this article on BlueSky'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 9.12a16.6 16.6 0 0 0-3.83-5.04c-1.12-.89-2.94-1.57-2.94.61a45 45 0 0 0 .38 4.17c.48 1.81 2.24 2.28 3.81 2-2.73.49-3.43 2.11-1.93 3.73 2.85 3.08 4.1-.77 4.42-1.76.06-.18.09-.27.09-.2 0-.07.03.02.09.2.32.99 1.57 4.84 4.42 1.76 1.5-1.63.81-3.24-1.92-3.73 1.56.28 3.32-.19 3.8-2 .14-.52.38-3.74.38-4.18 0-2.17-1.82-1.48-2.94-.6A16.6 16.6 0 0 0 12 12.12" />
        </svg>
      </a>

      <a href='http://reddit.com/submit?url=${urlUri}&title=${titleUri}' target='_blank' title='Share this article on Reddit'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.919 14.87a.184.184 0 0 1 0 .262c-.399.397-1.024.59-1.912.59L12 15.72l-.007.002c-.889 0-1.513-.193-1.912-.59a.184.184 0 0 1 0-.262.187.187 0 0 1 .264 0c.324.324.864.481 1.649.481l.007.001.007-.001c.784 0 1.323-.158 1.649-.48a.184.184 0 0 1 .261 0m-.095-2.86a.79.79 0 0 0-.79.787.79.79 0 0 0 1.581 0 .79.79 0 0 0-.791-.787m-2.854.787a.79.79 0 0 0-1.582 0 .79.79 0 0 0 .791.787c.436 0 .79-.352.79-.787M21 5v14c0 1-1 2-2 2H5c-1 0-2-1-2-2V5c0-1 1-2 2-2h14c1 0 2 1 2 2m-3 6.89a1.328 1.328 0 0 0-2.25-.95c-.905-.596-2.13-.975-3.485-1.024l.742-2.334 2.008.47-.003.03a1.086 1.086 0 0 0 2.173 0 1.085 1.085 0 0 0-2.096-.392l-2.165-.507a.184.184 0 0 0-.22.124l-.827 2.604c-1.419.017-2.705.399-3.65 1.012A1.322 1.322 0 0 0 6 11.89c0 .485.266.905.659 1.135a2.4 2.4 0 0 0-.043.43c0 1.954 2.404 3.545 5.36 3.545 2.955 0 5.359-1.59 5.359-3.546q-.002-.205-.038-.405a1.32 1.32 0 0 0 .703-1.16" />
        </svg>
      </a>

      <a href='https://www.facebook.com/sharer/sharer.php?u=${urlUri}' target='_blank' title='Share this article on Facebook'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C4 3 3 4 3 5v14c0 1 1 2 2 2h7.615v-6.97h-2.346v-2.717h2.346V9.31c0-2.325 1.42-3.591 3.494-3.591.994 0 1.847.074 2.096.107v2.43h-1.438c-1.128 0-1.346.537-1.346 1.323v1.735h2.69l-.35 2.716h-2.34V21H19c1 0 2-1 2-2V5c0-1-1-2-2-2" />
        </svg>
      </a>

      <a href='https://x.com/intent/tweet?url=${urlUri}&text=${titleUri}' target='_blank' title='Share this article on X'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.099 21h13.803A2.1 2.1 0 0 0 21 18.901V5.1c0-1.161-.94-2.1-2.099-2.1H5.1C3.939 3 3 3.94 3 5.099v13.803A2.1 2.1 0 0 0 5.099 21m5.504-8.395L5.765 6.136h3.729l3.172 4.24 3.925-4.24h1.096l-4.532 4.896 5.11 6.832h-3.728l-3.444-4.605-4.262 4.605H5.735zM9.09 6.943H7.377l7.564 10.114h1.713z" />
        </svg>
      </a>

      <a href='http://www.linkedin.com/shareArticle?mini=true&url=${urlUri}&title=${titleUri}' target='_blank' title='Share this article on LinkedIn'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M9 17H6.5v-7H9zM7.7 8.7c-.8 0-1.3-.5-1.3-1.2S7 6.3 7.8 6.3s1.3.5 1.3 1.2-.5 1.2-1.4 1.2M18 17h-2.4v-3.8c0-1-.7-1.3-1-1.3s-1 .1-1 1.3V17h-2.5v-7h2.5v1c.3-.6 1-1 2.2-1s2.2 1 2.2 3.2z" />
        </svg>
      </a>

      <a href='mailto:?subject=${titleUri}&body=${urlUri}' target='_blank' title='Share this article on Email'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7.488v11.49c0 1.135.921 2.056 2.057 2.056h13.92a2.057 2.057 0 0 0 2.057-2.057v-11.3l-8.892 6.73zm18.034-2.404L12 11.92 3 5.11v-.052C3 3.921 3.921 3 5.057 3h13.92c1.136 0 2.057.921 2.057 2.057z"/>
        </svg>
      </a>

      <a id="share-icon" title='Open native sharing menu'>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm9.4 3.422c.272-.226.616-.373.98-.417.096-.01.367-.003.47.013.524.085.965.371 1.235.799a1.624 1.624 0 0 1-.196 1.977 1.85 1.85 0 0 1-.99.534 1.4 1.4 0 0 1-.33.021c-.188 0-.23-.002-.322-.021a1.85 1.85 0 0 1-.773-.34c-.082-.064-.098-.072-.115-.064-.053.028-4.863 2.676-4.871 2.682-.006.005-.002.044.009.1.025.134.03.392.01.518l-.012.074-.01.059-.005.032 2.404 1.324 2.45 1.348.044.023.06-.047c.222-.177.51-.307.806-.366.094-.02.138-.022.325-.022s.231.003.328.022c.559.107 1.014.439 1.257.915.226.443.239.94.036 1.396a1.74 1.74 0 0 1-1.176.965 1.84 1.84 0 0 1-1.614-.37 1.72 1.72 0 0 1-.56-.94 1.2 1.2 0 0 1-.022-.314c0-.179.004-.226.022-.31a.4.4 0 0 0 .014-.104c-.004-.004-1.09-.602-2.413-1.33l-1.232-.678c-.71-.39-1.194-.657-1.204-.664l-.03-.018-.069.057a1.82 1.82 0 0 1-1.151.398 1.4 1.4 0 0 1-.31-.022c-.566-.109-1.02-.438-1.265-.916a1.6 1.6 0 0 1 .121-1.675 1.8 1.8 0 0 1 1.144-.715c.096-.017.143-.021.315-.021.171 0 .218.004.315.021.309.06.59.187.82.371.06.047.082.06.094.053l.526-.29 1.916-1.054c1.923-1.059 2.426-1.34 2.425-1.353l-.02-.107a1.4 1.4 0 0 1-.019-.296c0-.18.003-.22.023-.308.082-.37.284-.71.56-.94"/>
        </svg>
      </a>

    </div>
    `;

    // Set the innerHTML of the component to the style and template
    this.innerHTML = style + template;

    // Check if the browser supports the Web Share API, and hide the native sharing icon if not supported
    if (!navigator.canShare) {
      this.querySelector('#share-icon').style.display = 'none';
    } else {
    // Add event listener to share icon to trigger native sharing
    let shareButton = this.querySelector('#share-icon');
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.share({ title: ogTitle, url: ogUrl });
        console.log("Data was shared successfully");
      } catch (err) {
        console.error("Share failed:", err.message);
      }
    });
    }

  }
}
  
// register component
if(!customElements.get('social-icons')) customElements.define('social-icons', Social);


//  ======================
//  MARK: byline
//  ======================
	

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

    // If the reading time is just 1 minute, then state "min", else "mins"
    let units = readingTime === 1 ? 'min' : 'mins';
  
    this.innerHTML = `

      <card-footer>
        <time datetime="${ogDate}">${formattedDate}</time>
        <article-duration> • ${readingTime} ${units} • </article-duration>
      </card-footer>
    `;
  }
}
  
// register component
if(!customElements.get('by-line')) customElements.define('by-line', byline);


//  ======================
//  MARK: ToC
//  ======================


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


//  ======================
//  MARK: Navigation
//  ======================
	

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