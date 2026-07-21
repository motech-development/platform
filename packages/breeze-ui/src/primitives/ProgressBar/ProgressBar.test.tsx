import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes determinate range semantics and translated value text', () => {
    renderBreeze(
      <ProgressBar
        label="Import progress"
        maximum={20}
        minimum={10}
        value={15}
        valueText="15 of 20 items"
        variant="success"
      />,
    );

    const progress = screen.getByRole('progressbar', {
      name: 'Import progress',
    });

    expect(progress).toHaveAttribute('aria-valuemin', '10');
    expect(progress).toHaveAttribute('aria-valuemax', '20');
    expect(progress).toHaveAttribute('aria-valuenow', '15');
    expect(progress).toHaveAttribute('aria-valuetext', '15 of 20 items');
    expect(progress).toHaveAttribute('data-variant', 'success');
  });

  it('omits current-value semantics for indeterminate progress', () => {
    renderBreeze(<ProgressBar indeterminate label="Connecting" />);

    const progress = screen.getByRole('progressbar', { name: 'Connecting' });

    expect(progress).not.toHaveAttribute('aria-valuenow');
    expect(progress).not.toHaveAttribute('aria-valuetext');
  });
});
