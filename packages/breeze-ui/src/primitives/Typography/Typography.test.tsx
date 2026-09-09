import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Typography, type TypographyProps } from './Typography';

expectTypeOf<TypographyProps>().not.toHaveProperty('className');
expectTypeOf<TypographyProps>().not.toHaveProperty('style');

describe('Typography', () => {
  it('renders semantic interface text', () => {
    renderBreeze(
      <Typography element="h1" variant="heading">
        Accounts
      </Typography>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Accounts' }),
    ).toBeInTheDocument();
  });

  it('formats currency in the provider locale with a real separate sign', () => {
    renderBreeze(
      <Typography
        currency="GBP"
        format="currency"
        sign="always"
        value={-1234.5}
        variant="money"
      />,
    );

    expect(screen.getByText('−£1,234.50')).toHaveAttribute('lang', 'en-GB');
  });

  it('can omit a currency sign when the surrounding content owns direction', () => {
    renderBreeze(
      <Typography
        currency="GBP"
        format="currency"
        sign="never"
        value={-10}
        variant="money"
      />,
    );

    expect(screen.getByText('£10.00')).toBeInTheDocument();
  });

  it('formats calendar dates without shifting an ISO date', () => {
    renderBreeze(
      <Typography format="date" value="2026-09-03" variant="body" />,
    );

    expect(screen.getByText('3 September 2026')).toHaveAttribute(
      'lang',
      'en-GB',
    );
  });

  it('honours the provider locale for money and dates', () => {
    render(
      <BreezeProvider locale="fr-FR">
        <Typography
          currency="EUR"
          format="currency"
          value={1234.5}
          variant="money"
        />
        <Typography format="date" value="2026-09-03" variant="caption" />
      </BreezeProvider>,
    );

    expect(screen.getByText('1 234,50 €')).toHaveAttribute('lang', 'fr-FR');
    expect(screen.getByText('3 septembre 2026')).toHaveAttribute(
      'lang',
      'fr-FR',
    );
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Typography loading>Typography content</Typography>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Typography content')).not.toBeInTheDocument();
  });
});
