import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Inline } from '../Inline/Inline';
import { Separator, type SeparatorProps } from './Separator';

expectTypeOf<SeparatorProps>().not.toHaveProperty('className');
expectTypeOf<SeparatorProps>().not.toHaveProperty('loading');
expectTypeOf<SeparatorProps>().not.toHaveProperty('style');

describe('Separator', () => {
  it('requires a BreezeProvider', () => {
    expect(() => render(<Separator />)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('exposes its orientation to assistive technology', () => {
    renderBreeze(<Separator orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  // jsdom has no layout; the Vertical story measures the rendered height.
  it('stretches a vertical divider across a centred Inline row', () => {
    renderBreeze(
      <Inline>
        <span>Balance</span>
        <Separator orientation="vertical" />
        <span>VAT owed</span>
      </Inline>,
    );

    const separator = screen.getByRole('separator');

    expect(separator.parentElement).toHaveClass(
      'breeze:flex',
      'breeze:items-center',
    );
    expect(separator).toHaveClass('breeze:self-stretch');
    expect(separator).not.toHaveClass('breeze:block-full');
  });
});
