function getShareLink(ogTitle, ogUrl) {
  // Convert the title and URL to URIs.
  let titleUri = encodeURIComponent(ogTitle);
  let urlUri = encodeURIComponent(ogUrl)

  // Concatenate the titleURI and UrlUri together into a sharing link for each social network.
  let Link = `
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
  return Link; 
}

// Get the title and URL from the Open Graph tags.
let ogTitle = document.querySelector("meta[property=\"og:title\"]").content;
let ogUrl = document.querySelector("meta[property=\"og:url\"]").content;