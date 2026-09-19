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
expectTypeOf<NumberFieldProps>().not.toHaveProperty('commitBehavior');
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
    expect(increment).toHaveClass(
      'breeze:any-pointer-coarse:min-block-breeze-tap',
      'breeze:any-pointer-coarse:min-inline-breeze-tap',
      'breeze:outline-offset-[-2px]',
    );
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
    expect(input).toHaveClass('breeze:!opacity-0');
    expect(input).not.toHaveClass('breeze:invisible');
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(input.parentElement).toHaveClass('breeze:!overflow-visible');
    const loadingPlaceholder = screen.getByRole('progressbar', {
      name: 'Loading',
    });

    expect(loadingPlaceholder).toHaveClass('breeze:rounded-breeze-sm');
    expect(loadingPlaceholder.parentElement).not.toHaveClass(
      'breeze:rounded-breeze-ctl',
    );

    const increment = screen
      .getAllByRole('button', { hidden: true })
      .find((button) => button.getAttribute('aria-label') === 'Increase');

    if (!increment) {
      throw new Error('Expected the loading increment button to be rendered.');
    }

    expect(increment).toHaveClass('breeze:!opacity-0');
    expect(increment).not.toHaveClass('breeze:invisible');
    expect(increment).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.queryByRole('button', { name: /increase/i }),
    ).not.toBeInTheDocument();

    await user.click(increment);

    expect(onChange).not.toHaveBeenCalled();
  });
});
