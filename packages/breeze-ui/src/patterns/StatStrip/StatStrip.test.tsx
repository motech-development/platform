import { render, screen, within } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import {
  StatStrip,
  type StatStripItemDescriptor,
  type StatStripProps,
} from './StatStrip';

interface Figure {
  amount: number;
  name: string;
  scheme?: string;
}

const figures: Figure[] = [
  {
    amount: 24180.5,
    name: 'Current balance',
  },
  {
    amount: -310,
    name: 'Balance less VAT owed',
  },
  {
    amount: 4120,
    name: 'VAT owed',
    scheme: 'Standard 20%',
  },
];

function getFigure({ amount, name, scheme }: Figure): StatStripItemDescriptor {
  return {
    ...(scheme
      ? {
          badge: {
            children: scheme,
          },
        }
      : {}),
    currency: 'GBP',
    id: name,
    label: name,
    value: amount,
  };
}

expectTypeOf<StatStripProps<Figure>>().not.toHaveProperty('children');
expectTypeOf<StatStripProps<Figure>>().not.toHaveProperty('className');
expectTypeOf<StatStripProps<Figure>>().not.toHaveProperty('style');
expectTypeOf<StatStripItemDescriptor>().not.toHaveProperty('className');
expectTypeOf<StatStripItemDescriptor>().not.toHaveProperty('style');

describe('StatStrip', () => {
  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <StatStrip aria-label="Balance" getItem={getFigure} items={figures} />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });

  it('pairs each label with its locale-formatted figure in a named group', () => {
    renderBreeze(
      <StatStrip aria-label="Balance" getItem={getFigure} items={figures} />,
    );

    const group = screen.getByRole('group', { name: 'Balance' });
    const terms = within(group).getAllByRole('term');
    const definitions = within(group).getAllByRole('definition');

    expect(terms.map((term) => term.textContent)).toEqual([
      'Current balance',
      'Balance less VAT owed',
      'VAT owed Standard 20%',
    ]);
    expect(definitions.map((definition) => definition.textContent)).toEqual([
      '£24,180.50',
      '−£310.00',
      '£4,120.00',
    ]);
  });

  it('reads an expanded badge label after the term', () => {
    renderBreeze(
      <StatStrip
        aria-label="Balance"
        getItem={(figure: Figure) => ({
          ...getFigure(figure),
          badge: {
            'aria-label': 'Standard 20% VAT scheme',
            children: 'Standard 20%',
          },
        })}
        items={figures.slice(2)}
      />,
    );

    const term = screen.getByRole('term');

    expect(within(term).getByText('Standard 20%')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      within(term).getByText('Standard 20% VAT scheme'),
    ).toBeInTheDocument();
  });

  it('formats figures for the provider locale', () => {
    renderBreeze(
      <StatStrip
        aria-label="Balance"
        getItem={getFigure}
        items={figures.slice(0, 1)}
      />,
      'de-DE',
    );

    expect(screen.getByRole('definition')).toHaveTextContent('24.180,50 £');
  });

  it('replaces the figures with a busy, announced placeholder while loading', () => {
    renderBreeze(<StatStrip aria-label="Balance" loading />);

    const group = screen.getByRole('group', { name: 'Balance' });

    expect(within(group).queryByRole('term')).not.toBeInTheDocument();
    expect(within(group).getByRole('progressbar')).toHaveAccessibleName(
      'Loading',
    );
    expect(within(group).getByRole('progressbar').closest('[aria-busy]')).toBe(
      group.firstElementChild,
    );
  });
});
