import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { VisuallyHidden, type VisuallyHiddenProps } from './VisuallyHidden';

expectTypeOf<VisuallyHiddenProps>().not.toHaveProperty('className');
expectTypeOf<VisuallyHiddenProps>().not.toHaveProperty('style');

describe('VisuallyHidden', () => {
  it('keeps its content available to accessible queries', () => {
    renderBreeze(
      <button type="button">
        <span aria-hidden="true">+</span>
        <VisuallyHidden>Add transaction</VisuallyHidden>
      </button>,
    );

    expect(
      screen.getByRole('button', { name: 'Add transaction' }),
    ).toBeInTheDocument();
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<VisuallyHidden loading>Hidden content</VisuallyHidden>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
