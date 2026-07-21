import { describe, expect, it } from 'vitest';
import { resolveResponsiveClasses } from './responsive';

const classes = {
  base: {
    large: 'gap-8',
    small: 'gap-2',
  },
  lg: {
    large: 'lg:gap-8',
    small: 'lg:gap-2',
  },
  md: {
    large: 'md:gap-8',
    small: 'md:gap-2',
  },
  sm: {
    large: 'sm:gap-8',
    small: 'sm:gap-2',
  },
} as const;

describe('resolveResponsiveClasses', () => {
  it('resolves a scalar value at the base breakpoint', () => {
    expect(resolveResponsiveClasses('small', classes)).toBe('gap-2');
  });

  it('resolves only the supplied responsive overrides', () => {
    expect(
      resolveResponsiveClasses(
        {
          base: 'small',
          lg: 'large',
        },
        classes,
      ),
    ).toBe('gap-2 lg:gap-8');
  });
});
