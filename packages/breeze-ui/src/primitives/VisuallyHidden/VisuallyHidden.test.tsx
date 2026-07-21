import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('contributes an accessible name to a control', () => {
    renderBreeze(
      <button type="button">
        <VisuallyHidden>Open menu</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });
});
