/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';
import { resolveNavigation } from './pwa/navigation';

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{
    revision: string | null;
    url: string;
  }>;
};

const legacyNavigationCache = 'accounts-web-shell';

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
clientsClaim();
self.skipWaiting().catch(() => undefined);

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.delete(legacyNavigationCache));
});

const networkNavigation = new NetworkOnly();
const offlineShell = createHandlerBoundToURL('/_shell.html');

// Only the public application shell document may be available offline.
// GraphQL, Auth0 and presigned object requests never match this navigation route.
registerRoute(
  ({ request, sameOrigin }) => sameOrigin && request.mode === 'navigate',
  (options) =>
    resolveNavigation(
      () => networkNavigation.handle(options),
      () => offlineShell(options),
    ),
);
