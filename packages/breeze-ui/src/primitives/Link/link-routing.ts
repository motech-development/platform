import type { MouseEvent } from 'react';
import type { ViewTransitionType } from '../../motion/view-transitions';
import type { BreezeRouter } from '../../provider/BreezeContext';

/** Returns the browser-resolved same-document destination, or null to stay native. */
function routableDestination(
  event: MouseEvent<HTMLAnchorElement>,
  download: string | boolean | undefined,
): string | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    (download !== undefined && download !== false)
  ) {
    return null;
  }

  const anchor = event.currentTarget;
  const explicitTarget = anchor.getAttribute('target');
  const documentTarget = document
    .querySelector('base[target]')
    ?.getAttribute('target');
  const effectiveTarget = explicitTarget || documentTarget || '';

  if (
    effectiveTarget.toLowerCase() !== '' &&
    effectiveTarget.toLowerCase() !== '_self'
  ) {
    return null;
  }

  const destination = new URL(anchor.href, document.baseURI);
  if (
    (destination.protocol !== 'http:' && destination.protocol !== 'https:') ||
    destination.origin !== window.location.origin ||
    destination.hash !== '' ||
    anchor.getAttribute('href')?.includes('#')
  ) {
    return null;
  }

  // The router receives what the browser would navigate to, so relative
  // destinations such as `accounts`, `../x` or `?page=2` keep their meaning.
  // Fragment links have already returned, so there is no hash to carry.
  return `${destination.pathname}${destination.search}`;
}

/** Routes eligible same-document anchor clicks while preserving browser behavior. */
export default function routeAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  router: BreezeRouter | undefined,
  transitionTypes: readonly ViewTransitionType[],
  download?: string | boolean,
) {
  if (router === undefined) return;

  const destination = routableDestination(event, download);

  if (destination === null) return;

  event.preventDefault();
  router.navigate(destination, { transitionTypes });
}
