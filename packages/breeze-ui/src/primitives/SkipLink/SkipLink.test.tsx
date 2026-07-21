import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders an accessible native fragment destination', () => {
    renderBreeze(<SkipLink targetId="main-content">Skip to content</SkipLink>);

    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main-content');
  });
});
