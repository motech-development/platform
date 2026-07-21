import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Meter } from './Meter';

function getMeterFill(meter: HTMLElement): HTMLElement {
  const fill = meter.lastElementChild?.firstElementChild;

  if (!(fill instanceof HTMLElement)) {
    throw new Error('Expected Meter to render a track fill.');
  }

  return fill;
}

describe('Meter', () => {
  it('exposes the configured range and translated value text', () => {
    renderBreeze(
      <Meter
        label="Storage used"
        maximum={100}
        minimum={0}
        value={72}
        valueText="72 gigabytes used"
        variant="warning"
      />,
    );

    const meter = screen.getByRole('meter', { name: 'Storage used' });

    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-valuenow', '72');
    expect(meter).toHaveAttribute('aria-valuetext', '72 gigabytes used');
    expect(meter).toHaveAttribute('data-variant', 'warning');
    expect(meter).toHaveAttribute('role', 'meter');
  });

  it('uses the canonical range and numeric value when optional formatting is omitted', () => {
    renderBreeze(<Meter label="Capacity" value={40} />);

    const meter = screen.getByRole('meter', { name: 'Capacity' });

    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-valuenow', '40');
    expect(meter).toHaveTextContent('40');
  });

  it('clamps finite values before exposing and rendering the measurement', () => {
    renderBreeze(
      <>
        <Meter label="Below range" maximum={20} minimum={10} value={5} />
        <Meter
          label="Above range"
          maximum={20}
          minimum={10}
          value={25}
          valueText="At capacity"
        />
      </>,
    );

    const belowRange = screen.getByRole('meter', { name: 'Below range' });
    const aboveRange = screen.getByRole('meter', { name: 'Above range' });

    expect(belowRange).toHaveAttribute('aria-valuenow', '10');
    expect(belowRange).toHaveTextContent('10');
    expect(getMeterFill(belowRange)).toHaveStyle({ width: '0%' });
    expect(aboveRange).toHaveAttribute('aria-valuenow', '20');
    expect(aboveRange).toHaveAttribute('aria-valuetext', 'At capacity');
    expect(aboveRange).toHaveTextContent('At capacity');
    expect(getMeterFill(aboveRange)).toHaveStyle({ width: '100%' });
  });

  it('renders a collapsed range deterministically and preserves value text', () => {
    renderBreeze(
      <Meter
        label="Fixed threshold"
        maximum={5}
        minimum={5}
        value={10}
        valueText="Fixed at five"
      />,
    );

    const meter = screen.getByRole('meter', { name: 'Fixed threshold' });

    expect(meter).toHaveAttribute('aria-valuenow', '5');
    expect(meter).toHaveAttribute('aria-valuetext', 'Fixed at five');
    expect(getMeterFill(meter)).toHaveStyle({ width: '0%' });
  });

  it.each([
    { maximum: Number.POSITIVE_INFINITY, minimum: 0 },
    { maximum: 100, minimum: Number.NaN },
    { maximum: 5, minimum: 10 },
  ])(
    'rejects invalid bounds before rendering meter semantics',
    ({ maximum, minimum }) => {
      expect(() =>
        renderBreeze(
          <Meter
            label="Invalid range"
            maximum={maximum}
            minimum={minimum}
            value={7}
          />,
        ),
      ).toThrow(RangeError);
    },
  );
});
