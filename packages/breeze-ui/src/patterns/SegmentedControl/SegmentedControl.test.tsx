import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { label: 'Purchase', value: 'purchase' },
  { label: 'Sale', value: 'sale' },
];

describe('SegmentedControl', () => {
  it('reports one semantic selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <SegmentedControl
        aria-label="Record type"
        defaultValue="purchase"
        onChange={onChange}
        options={options}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Sale' }));

    expect(screen.getByRole('radiogroup', { name: 'Record type' })).toHaveClass(
      '[&>button+button]:border-s-0',
    );
    expect(onChange).toHaveBeenCalledWith('sale');
    expect(screen.getByRole('radio', { name: 'Sale' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('supports controlled selection', async () => {
    const user = userEvent.setup();

    function ControlledSegment() {
      const [value, setValue] = useState('purchase');

      return (
        <SegmentedControl
          aria-label="Controlled record type"
          onChange={setValue}
          options={options}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledSegment />);

    await user.click(screen.getByRole('radio', { name: 'Sale' }));
    expect(screen.getByRole('radio', { name: 'Sale' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('preserves read-only selection', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <SegmentedControl
        aria-label="Read-only record type"
        options={options}
        readOnly
        value="purchase"
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Sale' }));
    expect(screen.getByRole('radio', { name: 'Purchase' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
