import { fireEvent, screen } from '@testing-library/react';
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
  it('steps with the arrow keys, renders no stepper buttons and retains tabular figures', async () => {
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

    expect(input).toHaveClass('breeze:tabular-nums');
    expect(screen.queryByRole('button', { hidden: true })).toBeNull();
    expect(input).toHaveValue('1');

    await user.click(input);
    await user.keyboard('{ArrowUp}');

    expect(onChange).toHaveBeenLastCalledWith(1.5);
    expect(input).toHaveValue('1.5');

    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(onChange).toHaveBeenLastCalledWith(0.5);
  });

  it('uses the standard control size by default and the large amount size on request', () => {
    renderBreeze(
      <>
        <NumberField label="Quantity" />
        <NumberField label="Amount, including VAT" size="lg" />
      </>,
    );

    const standard = screen.getByRole('textbox', { name: 'Quantity' });
    const large = screen.getByRole('textbox', {
      name: 'Amount, including VAT',
    });

    expect(standard).toHaveClass(
      'breeze:min-block-breeze-md',
      'breeze:any-pointer-coarse:min-block-breeze-tap',
      'breeze:text-breeze-sm',
      'breeze:leading-breeze-snug',
    );
    expect(large).not.toHaveClass('breeze:min-block-breeze-md');
    expect(large).toHaveClass(
      'breeze:min-block-breeze-lg',
      'breeze:text-breeze-xl',
      'breeze:font-semibold',
      'breeze:tabular-nums',
    );
    expect(large).not.toHaveClass('breeze:text-breeze-sm');
  });

  it('marks focus with the brand border and ring', async () => {
    const user = userEvent.setup();

    renderBreeze(<NumberField label="Amount" />);

    const input = screen.getByRole('textbox', { name: 'Amount' });

    await user.click(input);

    expect(input).toHaveAttribute('data-focused', 'true');
    expect(input).toHaveClass(
      'breeze:data-[focused]:border-breeze-brand',
      'breeze:data-[focused]:ring-3',
      'breeze:data-[focused]:ring-breeze-brand/15',
    );
  });

  it('keeps the large control height while loading', () => {
    renderBreeze(<NumberField label="Amount" loading size="lg" />);

    const input = screen.getByRole('textbox', { name: 'Amount' });

    expect(input).toHaveClass(
      'breeze:min-block-breeze-lg',
      'breeze:!opacity-0',
    );
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();
  });

  it('ignores the mouse wheel while focused', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <NumberField defaultValue={5} label="Amount" onChange={onChange} />,
    );

    const input = screen.getByRole('textbox', { name: 'Amount' });

    await user.click(input);
    fireEvent.wheel(input, { deltaY: -100 });

    expect(input).toHaveValue('5');
    expect(onChange).not.toHaveBeenCalled();
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

  it('keeps disabled and read-only surfaces distinct', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <>
        <NumberField
          defaultValue={1}
          disabled
          label="Disabled amount"
          onChange={onChange}
        />
        <NumberField
          defaultValue={2}
          label="Read-only amount"
          onChange={onChange}
          readOnly
        />
      </>,
    );

    const disabledInput = screen.getByRole('textbox', {
      name: 'Disabled amount',
    });
    const readOnlyInput = screen.getByRole('textbox', {
      name: 'Read-only amount',
    });

    expect(disabledInput).toBeDisabled();
    expect(disabledInput).toHaveClass('breeze:disabled:opacity-60');
    expect(readOnlyInput).not.toBeDisabled();
    expect(readOnlyInput).toHaveAttribute('aria-readonly', 'true');
    expect(readOnlyInput).toHaveClass(
      'breeze:read-only:bg-breeze-sunken',
      'breeze:read-only:text-breeze-ink-2',
    );

    await user.click(readOnlyInput);
    await user.type(readOnlyInput, '3');
    await user.keyboard('{ArrowUp}');

    expect(readOnlyInput).toHaveFocus();
    expect(readOnlyInput).toHaveValue('2');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the native input ref and prevents interaction while loading', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const onChange = vi.fn<(value: number) => void>();

    renderBreeze(
      <NumberField
        defaultValue={2}
        description="Shown beneath the amount."
        error="The amount could not be loaded."
        label="Amount"
        loading
        onChange={onChange}
        ref={inputRef}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Amount' });

    expect(inputRef.current).toBe(input);
    expect(input).toHaveAccessibleName('Amount');
    expect(input).toBeDisabled();
    expect(input).not.toBeInvalid();
    expect(screen.queryByText('Amount')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Shown beneath the amount.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('The amount could not be loaded.'),
    ).not.toBeInTheDocument();
    expect(input).toHaveClass('breeze:!opacity-0');
    expect(input).not.toHaveClass('breeze:invisible');
    expect(input).toHaveAttribute('aria-busy', 'true');
    const loadingPlaceholder = screen.getByRole('progressbar', {
      name: 'Loading',
    });

    expect(loadingPlaceholder).toHaveClass('breeze:rounded-breeze-sm');
    expect(loadingPlaceholder.parentElement).not.toHaveClass(
      'breeze:rounded-breeze-ctl',
    );
    const allSkeletons = screen.getAllByRole('progressbar', { hidden: true });

    expect(allSkeletons).toHaveLength(4);
    expect(
      allSkeletons.filter(
        (element) => element.getAttribute('aria-hidden') === 'true',
      ),
    ).toHaveLength(3);
    allSkeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('breeze:rounded-breeze-sm');
    });

    await user.type(input, '{ArrowUp}3');

    expect(onChange).not.toHaveBeenCalled();
  });
});
