import type { MouseEvent } from 'react';
import type { ViewTransitionType } from '../../motion/view-transitions';
import type { BreezeRouter } from '../../provider/BreezeContext';

function shouldRoute(
  event: MouseEvent<HTMLAnchorElement>,
  download: string | boolean | undefined,
): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    (download !== undefined && download !== false)
  ) {
    return false;
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
    return false;
  }

  const destination = new URL(anchor.href, document.baseURI);
  if (
    (destination.protocol !== 'http:' && destination.protocol !== 'https:') ||
    destination.origin !== window.location.origin ||
    destination.hash !== '' ||
    anchor.getAttribute('href')?.includes('#')
  ) {
    return false;
  }

  return true;
}

/** Routes eligible same-document anchor clicks while preserving browser behavior. */
export default function routeAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  router: BreezeRouter | undefined,
  transitionTypes: readonly ViewTransitionType[],
  download?: string | boolean,
) {
  if (router === undefined || !shouldRoute(event, download)) return;

  event.preventDefault();
  router.navigate(href, { transitionTypes });
}
