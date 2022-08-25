'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "fad5fc01d3cf5058a187d1372d72e652",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/images/android.png": "be0666e46b3a67e287786a50ab9da03e",
"assets/images/army.png": "8cbf23e8f09bccfdcd908c9299bf29ae",
"assets/images/call.png": "5ba996c6e27e1384770cf5a22ee57ba7",
"assets/images/chat.png": "818f760650703997860a40e1fce42684",
"assets/images/chat2.png": "af03be5e8c4be290e7109c050860ef64",
"assets/images/dolphin_software.png": "676764ab7303ccd7b87a335807b8c070",
"assets/images/flutter.png": "bc20ac3c833cdfbb9230c8a0dc483d46",
"assets/images/github.gif": "4e2208ae912b222e6affd1edca0460bf",
"assets/images/google_3.gif": "1e9dbde64c897f07aa0c419d75f9ab46",
"assets/images/guitaa.png": "f60ed3eced0bf11cf0cc4d5fa50b8d91",
"assets/images/hi.gif": "82b7314fe96c4a2d8f3088207a4afd8d",
"assets/images/immigration.png": "647c910217d8d01273fae53289ad9ff3",
"assets/images/indian%2520army.png": "a7445964819ea9aa642c85b86dc17a8b",
"assets/images/insta.gif": "3e473d115e974bbba4b30cd01d0e027c",
"assets/images/insta.png": "b17d99ac2b6dfe78563b73a1b12a057b",
"assets/images/java.gif": "3454d96418e0e1bb4714db62d30f9569",
"assets/images/kotlin.png": "dc9cac39b59efefc086138586ffff958",
"assets/images/linkedin.gif": "8fb9196441a8943fb9136392f64ace70",
"assets/images/mysql.png": "c3bc47090dcde2049cfc2d530d6fcb96",
"assets/images/nsut.png": "6229edb9028ca0354e59728112c79625",
"assets/images/personal.png": "501077115bfb9a361667498ed29a1e11",
"assets/images/python.gif": "cbd60ba62775bf6252fdecef9985e93a",
"assets/images/rtu.jpg": "bb28d653808c47bc7d28b29291c08a6d",
"assets/images/sangchalo.jpg": "fd933679e48a2f5f739e6827e29e8e82",
"assets/images/sap.png": "13e381348b8c631a0dc8e2d73a059302",
"assets/images/tcs.png": "d11cf17b8002a334dd9896308e091218",
"assets/images/vaibhavphoto.png": "d2198cf34773a67918315b4aa7a91e5f",
"assets/images/VAIBHAV_PROFILE.png": "49310f133bd11fc7cf38995e3c0d71ff",
"assets/NOTICES": "5832db904e273a6adc229bad9bcff841",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "7c0abb719a5a510eeba5982d454667d6",
"/": "7c0abb719a5a510eeba5982d454667d6",
"main.dart.js": "c7133f03f32f8f296857836c69d9da2e",
"manifest.json": "849629e91dd9ac256873c62688dea41f",
"version.json": "b26266e11536c17cd21916d33fc36d82"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
