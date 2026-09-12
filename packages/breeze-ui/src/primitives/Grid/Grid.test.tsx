import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Grid, type GridProps } from './Grid';

expectTypeOf<GridProps>().not.toHaveProperty('className');
expectTypeOf<GridProps>().not.toHaveProperty('style');
expectTypeOf<GridProps['columns']>().toEqualTypeOf<1 | 2 | 3 | undefined>();
expectTypeOf<GridProps['gap']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Grid', () => {
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

  it('replaces unavailable content with accessible placeholders', () => {
    const { container } = renderBreeze(
      <Grid columns={3} loading>
        Grid content
      </Grid>,
    );

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    expect(screen.queryByText('Grid content')).not.toBeInTheDocument();
  });
});
