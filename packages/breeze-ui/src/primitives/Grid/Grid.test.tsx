import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Grid } from './Grid';

describe('Grid', () => {
  it('keeps data-driven grid content in source order', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Grid aria-label="Metrics" columns={{ base: 1, md: 3 }}>
          <span>Revenue</span>
          <span>Costs</span>
          <span>Balance</span>
        </Grid>
      </BreezeProvider>,
    );

    expect(
      Array.from(screen.getByLabelText('Metrics').children).map(
        (child) => child.textContent,
      ),
    ).toEqual(['Revenue', 'Costs', 'Balance']);
    expect(screen.getByLabelText('Metrics')).toHaveClass('gap-5');
  });

  it('provides canonical field, control, and action tracks', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Grid
          aria-label="Category row"
          gap="control"
          template="field-control-action"
        >
          <span>Category</span>
          <span>Rate</span>
          <button type="button">Remove</button>
        </Grid>
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Category row')).toHaveClass(
      'grid-cols-[minmax(0,1fr)_auto_auto]',
      'gap-2.5',
      '[&>:last-child]:size-11',
    );
    expect(screen.getByLabelText('Category row')).not.toHaveClass(
      'grid-cols-1',
    );
  });
});
