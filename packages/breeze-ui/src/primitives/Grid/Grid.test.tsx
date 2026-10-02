import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Grid, type GridProps } from './Grid';

expectTypeOf<GridProps>().not.toHaveProperty('className');
expectTypeOf<GridProps>().not.toHaveProperty('loading');
expectTypeOf<GridProps>().not.toHaveProperty('style');
expectTypeOf<GridProps['columns']>().toEqualTypeOf<
  1 | 2 | 3 | 'mainAside' | undefined
>();
expectTypeOf<GridProps['gap']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Grid', () => {
  it('requires a BreezeProvider', () => {
    expect(() => render(<Grid>Balance</Grid>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('groups content in the requested semantic element', () => {
    renderBreeze(
      <Grid columns={3} element="section" aria-label="Figures">
        <span>Balance</span>
        <span>VAT owed</span>
        <span>VAT paid</span>
      </Grid>,
    );

    expect(screen.getByRole('region', { name: 'Figures' })).toHaveTextContent(
      'BalanceVAT owedVAT paid',
    );
  });

  it('gives a labelled default container nameable semantics', () => {
    renderBreeze(<Grid aria-label="Figures">Balance</Grid>);

    expect(screen.getByRole('group', { name: 'Figures' })).toHaveTextContent(
      'Balance',
    );
  });

  it('places a growing main column beside a fixed aside until the medium breakpoint', () => {
    renderBreeze(
      <Grid aria-label="Overview" columns="mainAside">
        <span>Main</span>
        <span>Aside</span>
      </Grid>,
    );

    const grid = screen.getByRole('group', { name: 'Overview' });

    expect(grid).toHaveClass(
      'breeze:grid-cols-[minmax(0,1fr)_300px]',
      'breeze:items-start',
      'breeze:max-breeze-md:grid-cols-1',
    );
  });

  it('keeps the main and aside columns side by side when collapse is disabled', () => {
    renderBreeze(
      <Grid aria-label="Overview" collapseBelow="none" columns="mainAside">
        <span>Main</span>
        <span>Aside</span>
      </Grid>,
    );

    const grid = screen.getByRole('group', { name: 'Overview' });

    expect(grid).toHaveClass('breeze:grid-cols-[minmax(0,1fr)_300px]');
    expect(grid.className).not.toMatch(/grid-cols-1/);
  });
});
