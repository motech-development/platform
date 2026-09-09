import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Card, type CardProps } from './Card';

expectTypeOf<CardProps>().not.toHaveProperty('className');
expectTypeOf<CardProps>().not.toHaveProperty('style');
expectTypeOf<CardProps['padding']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Card', () => {
  it('creates a labelled article when requested', () => {
    renderBreeze(
      <Card element="article" aria-label="Current balance">
        £24,180.50
      </Card>,
    );

    expect(
      screen.getByRole('article', { name: 'Current balance' }),
    ).toHaveTextContent('£24,180.50');
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Card loading>Card content</Card>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Card content')).not.toBeInTheDocument();
  });
});
