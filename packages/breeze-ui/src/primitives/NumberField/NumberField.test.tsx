import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { NumberField, type NumberFieldProps } from './NumberField';

expectTypeOf<NumberFieldProps>().not.toHaveProperty('className');
expectTypeOf<NumberFieldProps>().not.toHaveProperty('style');
expectTypeOf<NumberFieldProps>().not.toHaveProperty('slot');
expectTypeOf<NumberFieldProps>().not.toHaveProperty('render');
expectTypeOf<NumberFieldProps['onChange']>().toEqualTypeOf<
  ((value: number) => void) | undefined
>();

const controlledNumberField = (
  <NumberField label="Quantity" onChange={() => undefined} value={1} />
);
const uncontrolledNumberField = (
  <NumberField defaultValue={1} label="Quantity" />
);

const mixedNumberField = (
  // @ts-expect-error Controlled and uncontrolled value props are exclusive.
  <NumberField
    label="Quantity"
    onChange={() => undefined}
    value={1}
    defaultValue={2}
  />
);

expectTypeOf(controlledNumberField).toBeObject();
expectTypeOf(mixedNumberField).toBeObject();
expectTypeOf(uncontrolledNumberField).toBeObject();

describe('NumberField', () => {
  it('reports semantic numbers from stepper controls and retains tabular figures', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <NumberField
        defaultValue={1}
        label="Quantity"
        onChange={onChange}
        step={0.5}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Quantity' });
    const increment = screen.getByRole('button', { name: /increase/i });

    expect(input).toHaveClass('breeze:tabular-nums');
    expect(input).toHaveValue('1');

    await user.click(increment);

    expect(onChange).toHaveBeenLastCalledWith(1.5);
    expect(input).toHaveValue('1.5');
  });

  it('reports NaN when an uncontrolled numeric input is emptied', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <NumberField
        defaultValue={5}
        label="Optional amount"
        onChange={onChange}
      />,
    );

    await user.clear(screen.getByRole('textbox', { name: 'Optional amount' }));
    await user.tab();

    expect(onChange).toHaveBeenLastCalledWith(expect.any(Number));
    expect(Number.isNaN(onChange.mock.lastCall?.[0])).toBe(true);
  });

  it('associates descriptions and errors with required invalid state', () => {
    renderBreeze(
      <NumberField
        description="Choose a whole number of seats."
        error="At least one seat is required."
        label="Seats"
        required
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Seats' });

    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription(
      'Choose a whole number of seats. At least one seat is required.',
    );
  });

  it('forwards the native input ref and prevents interaction while loading', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <NumberField
        defaultValue={2}
        label="Amount"
        loading
        onChange={onChange}
        ref={inputRef}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Amount' });

    expect(inputRef.current).toBe(input);
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /increase/i }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
