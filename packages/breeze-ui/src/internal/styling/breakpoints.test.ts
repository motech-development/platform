import { describe, expect, it, vi } from 'vitest';
import isBreezeSmallViewport, {
  breezeSmallBreakpointQuery,
} from './breakpoints';

describe('Breeze breakpoints', () => {
  it('uses the rem-based compact media query as the source of truth', () => {
    const matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);

    expect(isBreezeSmallViewport({ matchMedia })).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith(breezeSmallBreakpointQuery);
    expect(breezeSmallBreakpointQuery).toBe('(width < 42.5625rem)');
  });
});
