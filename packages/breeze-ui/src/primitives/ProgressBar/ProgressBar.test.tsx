import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { ProgressBar, type ProgressBarProps } from './ProgressBar';

expectTypeOf<ProgressBarProps>().not.toHaveProperty('className');
expectTypeOf<ProgressBarProps>().not.toHaveProperty('loading');
expectTypeOf<ProgressBarProps>().not.toHaveProperty('style');

describe('ProgressBar', () => {
  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <ProgressBar
          aria-label="Paperwork"
          value={3}
          valueLabel="3 of 7 done"
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });

  it('announces a value out of its total with the visible value text', () => {
    renderBreeze(
      <ProgressBar
        aria-label="Paperwork"
        maxValue={7}
        value={3}
        valueLabel="3 of 7 done"
      />,
    );

    const progress = screen.getByRole('progressbar', { name: 'Paperwork' });

    expect(progress).toHaveAttribute('aria-valuenow', '3');
    expect(progress).toHaveAttribute('aria-valuemax', '7');
    expect(progress).toHaveAttribute('aria-valuetext', '3 of 7 done');
    expect(progress).toHaveTextContent('3 of 7 done');
  });

  it('leaves the bar empty when the total is zero', () => {
    renderBreeze(
      <ProgressBar
        aria-label="Paperwork"
        maxValue={0}
        value={0}
        valueLabel="Nothing to do"
      />,
    );

    const fill = screen.getByRole('progressbar').lastElementChild
      ?.firstElementChild as HTMLElement;

    expect(fill.style.inlineSize).toBe('0%');
  });
});
