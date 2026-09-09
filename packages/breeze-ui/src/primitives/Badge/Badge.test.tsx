import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Badge, type BadgeProps, type BadgeVariant } from './Badge';

expectTypeOf<BadgeProps>().not.toHaveProperty('className');
expectTypeOf<BadgeProps>().not.toHaveProperty('style');
expectTypeOf<BadgeVariant>().toEqualTypeOf<
  'brand' | 'danger' | 'neutral' | 'positive' | 'warning'
>();

describe('Badge', () => {
  it('renders its concise status text', () => {
    renderBreeze(<Badge variant="warning">No receipt</Badge>);

    expect(screen.getByText('No receipt')).toBeInTheDocument();
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Badge loading>Badge content</Badge>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Badge content')).not.toBeInTheDocument();
  });
});
