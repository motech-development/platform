import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Typography, type TypographyProps } from './Typography';

expectTypeOf<TypographyProps>().not.toHaveProperty('className');
expectTypeOf<TypographyProps>().not.toHaveProperty('style');

const loadingTypographyProps = [
  { currency: 'GBP', format: 'currency', loading: true, variant: 'money' },
  { format: 'date', loading: true },
  { loading: true },
] as const satisfies readonly TypographyProps[];
const readyTypographyProps = [
  { currency: 'GBP', format: 'currency', value: 10, variant: 'money' },
  { format: 'date', value: '2026-09-12' },
  { children: 'Ready' },
] as const satisfies readonly TypographyProps[];

expectTypeOf(loadingTypographyProps).toMatchTypeOf<
  readonly TypographyProps[]
>();
expectTypeOf(readyTypographyProps).toMatchTypeOf<readonly TypographyProps[]>();

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

  it('preserves locale-specific currency sign placement', () => {
    render(
      <BreezeProvider locale="nl-NL">
        <Typography
          currency="EUR"
          format="currency"
          value={-1234.5}
          variant="money"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText(/1\.234,50/)).toHaveTextContent('€ −1.234,50');
  });

  it('falls back to locale-aware number formatting for malformed currency codes', () => {
    renderBreeze(
      <Typography
        currency="US"
        format="currency"
        value={-1234.5}
        variant="money"
      />,
    );

    expect(screen.getByText('−1,234.5')).toBeInTheDocument();
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

  it('does not throw when given a calendar-invalid date', () => {
    renderBreeze(
      <Typography format="date" value="2026-02-30" variant="body" />,
    );

    expect(screen.getByText('2026-02-30')).toBeInTheDocument();
  });

  it('blockifies truncated inline text so ellipsis can apply', () => {
    renderBreeze(
      <Typography truncate variant="caption">
        Long caption
      </Typography>,
    );

    expect(screen.getByText('Long caption')).toHaveClass(
      'breeze:block',
      'breeze:inline-size-full',
    );
  });

  it('provides a full-width box when inline text needs alignment', () => {
    renderBreeze(
      <Typography
        variant="money"
        currency="GBP"
        format="currency"
        value={10}
      />,
    );

    expect(screen.getByText('£10.00')).toHaveClass(
      'breeze:block',
      'breeze:inline-size-full',
      'breeze:text-end',
    );
  });

  it('keeps loading placeholders inline for inline text roles', () => {
    renderBreeze(<Typography loading variant="caption" />);

    expect(
      screen.getByRole('progressbar', { name: 'Loading' }).parentElement,
    ).toHaveClass('breeze:inline-block');
  });

  it('preserves explicitly selected block elements while loading', () => {
    renderBreeze(<Typography element="div" loading variant="caption" />);

    expect(
      screen.getByRole('progressbar', { name: 'Loading' }).parentElement,
    ).not.toHaveClass('breeze:inline-block');
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
