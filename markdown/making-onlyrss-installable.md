# Making OnlyRSS.org installable

A good description of what I'm trying to do is here: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen#manifest

To enable your app to be added to a Home screen, it needs the following:

* To be served over HTTPs — the web is increasingly being moved in a more secure direction, and many modern web technologies (A2HS included) will work only on secure contexts.
* To have a manifest file with the correct fields filled in, linked from the HTML head.
* To have an appropriate icon available for displaying on the Home screen.
* Chrome additionally requires the app to have a **service worker registered** (e.g., so it can function when offline).

## Creating the manifest file
Followed the instructions here to create the basic manifest: https://web.dev/add-manifest/. Added it to the root directory of OnlyRSS.org

## Creating the required icons
Created a 512px frame in Figma and exported as a png. Then used this page to create an array of icons sizes for various platforms: https://www.pwabuilder.com/imageGenerator. Copied the icon.JSON output (for all the icon paths etc.) into the Manifest file.

## Adding the manifest
* Added the following to all blog post headers: `<link rel="manifest" href="../manifest.json">`

* Added the following to the index.html header: `<link rel="manifest" href="/manifest.json">`

## Making and adding the basic service worker
Created a basic service worker that cached the homepage only. Added this to the root director, then added the following script to the header of the homepage
```
<script>
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
  });
}
  </script>
  ```