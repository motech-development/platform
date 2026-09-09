import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Inline, type InlineProps } from './Inline';

expectTypeOf<InlineProps>().not.toHaveProperty('className');
expectTypeOf<InlineProps>().not.toHaveProperty('style');
expectTypeOf<InlineProps['gap']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Inline', () => {
  it('groups content in the requested semantic element', () => {
    renderBreeze(
      <Inline element="nav" gap={2} aria-label="Actions">
        <span>Cancel</span>
        <span>Save</span>
      </Inline>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Actions' }),
    ).toHaveTextContent('CancelSave');
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Inline loading>Inline content</Inline>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Inline content')).not.toBeInTheDocument();
  });
});
