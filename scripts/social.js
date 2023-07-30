function getShareLink(ogTitle, ogUrl) {
  // Convert the title and URL to URIs.
  var titleUri = encodeURIComponent(ogTitle);
  var urlUri = encodeURIComponent(ogUrl)

  // Concatenate the titleURI and UrlUri together into a sharing link for each social network.
  var Link =
  "<a href='http://reddit.com/submit?url=" + urlUri + "&title=" + titleUri + "' target='_blank'" + " title='Share this article on Reddit'>" + "<div class='reddit-icon'></div></a>" + 
  "<a href='https://www.facebook.com/sharer/sharer.php?u=" + urlUri + "' target='_blank'" + " title='Share this article on Facebook'>" + "<div class='fb-icon'></div></a>" + 
  "<a href='https://x.com/intent/tweet?url=" + urlUri + "&text=" + titleUri + "' target='_blank'" + " title='Share this article on X'>" + "<div class='x-icon'></div></a>" + 
  "<a href='http://www.linkedin.com/shareArticle?mini=true&url=" + urlUri + "&title=" + titleUri + "' target='_blank'" + " title='Share this article on LinkedIn'>" + "<div class='linkedin-icon'></div></a>" + 
  "<a href='mailto:?subject=" + titleUri + "&body=" + urlUri + "' target='_blank'" + " title='Share this article on Email'>" + "<div class='email-icon'></div></a>";

  return Link; 
}

// Get the title and URL from the Open Graph tags.
var ogTitle = document.querySelector("meta[property=\"og:title\"]").content;
var ogUrl = document.querySelector("meta[property=\"og:url\"]").content;

// Create the links.
var Link = getShareLink(ogTitle, ogUrl);
