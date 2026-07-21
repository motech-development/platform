import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('reports semantic numbers from stepper and keyboard interactions', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <NumberField.Root defaultValue={1} onChange={onChange} step={0.5}>
        <NumberField.Label>Quantity</NumberField.Label>
        <NumberField.Group>
          <NumberField.DecrementButton aria-label="Decrease">
            −
          </NumberField.DecrementButton>
          <NumberField.Input name="quantity" />
          <NumberField.IncrementButton aria-label="Increase">
            +
          </NumberField.IncrementButton>
        </NumberField.Group>
      </NumberField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Quantity' });

    expect(input).toHaveClass(
      'min-h-11',
      'px-3',
      'py-2.5',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'text-left',
      'font-normal',
      'leading-[1.4]',
      'border-0',
      'bg-transparent',
      'outline-none',
      'group-has-[button]/number-field-control:text-center',
    );
    await user.click(screen.getByRole('button', { name: /Increase/ }));
    expect(onChange).toHaveBeenLastCalledWith(1.5);

    input.focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(input).toHaveAttribute('name', 'quantity');
  });

  it('aligns optional steppers to the standard input height', () => {
    renderBreeze(
      <NumberField.Root defaultValue={1}>
        <NumberField.Label>Quantity</NumberField.Label>
        <NumberField.Group>
          <NumberField.DecrementButton aria-label="Decrease">
            −
          </NumberField.DecrementButton>
          <NumberField.Input />
          <NumberField.IncrementButton aria-label="Increase">
            +
          </NumberField.IncrementButton>
        </NumberField.Group>
      </NumberField.Root>,
    );

    expect(screen.getByRole('button', { name: /Decrease/ })).toHaveClass(
      'size-11',
    );
    expect(screen.getByRole('button', { name: /Increase/ })).toHaveClass(
      'size-11',
    );
  });

  it('enforces range constraints and exposes associated errors', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <NumberField.Root defaultValue={2} invalid max={2} min={0}>
        <NumberField.Label>Seats</NumberField.Label>
        <NumberField.Group>
          <NumberField.DecrementButton aria-label="Decrease">
            −
          </NumberField.DecrementButton>
          <NumberField.Input />
          <NumberField.IncrementButton aria-label="Increase">
            +
          </NumberField.IncrementButton>
        </NumberField.Group>
        <NumberField.Error>
          Choose between zero and two seats.
        </NumberField.Error>
      </NumberField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Seats' });
    const increment = screen.getByRole('button', { name: /Increase/ });

    expect(input).toBeInvalid();
    expect(input.parentElement).toHaveClass(
      'data-[invalid]:after:!border-[var(--breeze-danger)]',
    );
    expect(input).toHaveAccessibleDescription(
      'Choose between zero and two seats.',
    );
    expect(increment).toBeDisabled();
    await user.click(increment);
    expect(input).toHaveValue('2');
  });

  it('formats controlled values using the provider locale and remains immutable when read only', () => {
    renderBreeze(
      <NumberField.Root
        formatOptions={{ maximumFractionDigits: 2 }}
        readOnly
        value={1234.5}
      >
        <NumberField.Label>Amount</NumberField.Label>
        <NumberField.Group>
          <NumberField.Input />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Amount' });

    expect(input).toHaveValue('1,234.5');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('read-only:cursor-default', 'bg-transparent');
  });

  it('reports an empty numeric input as null rather than leaking NaN', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <NumberField.Root defaultValue={5} onChange={onChange}>
        <NumberField.Label>Optional amount</NumberField.Label>
        <NumberField.Group>
          <NumberField.Input />
        </NumberField.Group>
      </NumberField.Root>,
    );

    await user.clear(screen.getByRole('textbox', { name: 'Optional amount' }));
    await user.tab();

    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('owns one group surface without segmented input or stepper borders', () => {
    renderBreeze(
      <div>
        <NumberField.Root>
          <NumberField.Label>Input only</NumberField.Label>
          <NumberField.Group>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Both steppers</NumberField.Label>
          <NumberField.Group>
            <NumberField.DecrementButton aria-label="Decrease both">
              −
            </NumberField.DecrementButton>
            <NumberField.Input />
            <NumberField.IncrementButton aria-label="Increase both">
              +
            </NumberField.IncrementButton>
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Decrement only</NumberField.Label>
          <NumberField.Group>
            <NumberField.DecrementButton aria-label="Decrease only">
              −
            </NumberField.DecrementButton>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
        <NumberField.Root>
          <NumberField.Label>Increment only</NumberField.Label>
          <NumberField.Group>
            <NumberField.Input />
            <NumberField.IncrementButton aria-label="Increase only">
              +
            </NumberField.IncrementButton>
          </NumberField.Group>
        </NumberField.Root>
      </div>,
    );

    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toHaveClass('border-0', 'bg-transparent');
      expect(input.parentElement).toHaveAttribute(
        'data-breeze-number-field-group',
      );
      expect(input.parentElement).toHaveClass(
        'after:border',
        'data-[hovered]:after:border-[var(--breeze-primary)]',
        'data-[invalid]:after:!border-[var(--breeze-danger)]',
      );
    });
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveClass('border-0', 'bg-transparent');
    });
  });
});
