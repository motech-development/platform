import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { SkipLink, type SkipLinkProps } from './SkipLink';

expectTypeOf<SkipLinkProps>().not.toHaveProperty('className');
expectTypeOf<SkipLinkProps>().not.toHaveProperty('style');

describe('SkipLink', () => {
  it('moves focus to the target when activated', () => {
    render(
      <BreezeProvider locale="en-GB">
        <SkipLink targetId="page-content" />
        <main id="page-content" tabIndex={-1}>
          Account activity
        </main>
      </BreezeProvider>,
    );
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const main = screen.getByRole('main');

    expect(fireEvent.click(skipLink)).toBe(false);

    expect(skipLink).toHaveAttribute('href', '#page-content');
    expect(document.activeElement).toBe(main);
  });

  it('preserves native fragment navigation when the target is missing', () => {
    render(
      <BreezeProvider locale="en-GB">
        <SkipLink targetId="missing-content" />
      </BreezeProvider>,
    );
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });

    expect(fireEvent.click(skipLink)).toBe(true);
    expect(skipLink).toHaveAttribute('href', '#missing-content');
  });
});
