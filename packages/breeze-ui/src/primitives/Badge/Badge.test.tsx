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

  it('exposes an expanded accessible label without naming a generic span', () => {
    renderBreeze(<Badge aria-label="5 unread notifications">5</Badge>);

    expect(screen.getByText('5 unread notifications')).toHaveClass(
      'breeze:sr-only',
    );
    expect(screen.getByText('5')).toHaveAttribute('aria-hidden', 'true');
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Badge loading>Badge content</Badge>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toHaveStyle({
      blockSize: '8px',
      inlineSize: '100%',
    });
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }).parentElement,
    ).toHaveClass('breeze:grid', 'breeze:items-center');
    expect(screen.getByText('Badge content')).toHaveClass('breeze:opacity-0');
    expect(screen.getByText('Badge content')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
