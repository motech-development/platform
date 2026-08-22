/** Media query used by Breeze's compact variants below the small breakpoint. */
export const breezeSmallBreakpointQuery = '(width < 42.5625rem)';

/** Returns whether the viewport currently matches Breeze's compact range. */
export default function isBreezeSmallViewport(
  view: Pick<Window, 'matchMedia'>,
): boolean {
  return (
    typeof view.matchMedia === 'function' &&
    view.matchMedia(breezeSmallBreakpointQuery).matches
  );
}
