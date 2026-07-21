import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import type { DateRangeValue } from '../../internal/types/date';
import { DateRangePicker } from './DateRangePicker';

function Parts() {
  return (
    <>
      <DateRangePicker.Label>Dates</DateRangePicker.Label>
      <DateRangePicker.Group>
        <DateRangePicker.StartInput />
        <DateRangePicker.Separator />
        <DateRangePicker.EndInput />
        <DateRangePicker.Trigger />
      </DateRangePicker.Group>
      <DateRangePicker.Popover>
        <DateRangePicker.Calendar />
      </DateRangePicker.Popover>
    </>
  );
}

function getFormEntries(form: HTMLElement) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('Expected a form element.');
  }

  return Object.fromEntries(new FormData(form).entries());
}

function ControlledRange() {
  const [value, setValue] = useState<DateRangeValue | null>({
    end: '2026-07-17',
    start: '2026-07-13',
  });

  return (
    <>
      <form aria-label="Controlled booking" id="controlled-booking" />
      <button
        onClick={() => setValue({ end: '2026-08-02', start: '2026-07-28' })}
        type="button"
      >
        Change controlled range
      </button>
      <DateRangePicker.Root
        endName="periodEnd"
        form="controlled-booking"
        onChange={setValue}
        startName="periodStart"
        value={value}
      >
        <Parts />
      </DateRangePicker.Root>
    </>
  );
}

describe('DateRangePicker', () => {
  it('opens its calendar, reports stable ranges, and submits live values to an external form', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <>
        <form aria-label="Booking" id="booking" />
        <DateRangePicker.Root
          defaultValue={{ end: '2026-07-14', start: '2026-07-13' }}
          endName="periodEnd"
          form="booking"
          onChange={onChange}
          startName="periodStart"
        >
          <Parts />
        </DateRangePicker.Root>
      </>,
    );

    const form = screen.getByRole('form', { name: 'Booking' });
    const trigger = screen.getByRole('button', { name: /Calendar Dates/ });

    expect(getFormEntries(form)).toEqual({
      periodEnd: '2026-07-14',
      periodStart: '2026-07-13',
    });
    expect(trigger.querySelector('svg')).toHaveClass('lucide-calendar');
    await user.click(trigger);
    expect(screen.getByRole('application')).toHaveClass('w-full');
    await user.click(screen.getByRole('button', { name: /15.*July.*2026/i }));
    await user.click(screen.getByRole('button', { name: /17.*July.*2026/i }));
    expect(onChange).toHaveBeenLastCalledWith({
      end: '2026-07-17',
      start: '2026-07-15',
    });
    expect(getFormEntries(form)).toEqual({
      periodEnd: '2026-07-17',
      periodStart: '2026-07-15',
    });
  });

  it('restores uncontrolled range values when the associated form resets', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form aria-label="Reset booking">
        <DateRangePicker.Root
          defaultValue={{ end: '2026-07-14', start: '2026-07-13' }}
          endName="periodEnd"
          startName="periodStart"
        >
          <Parts />
        </DateRangePicker.Root>
        <input type="reset" value="Reset dates" />
      </form>,
    );

    const form = screen.getByRole('form', { name: 'Reset booking' });

    await user.click(screen.getByRole('button', { name: /Calendar Dates/ }));
    await user.click(screen.getByRole('button', { name: /15.*July.*2026/i }));
    await user.click(screen.getByRole('button', { name: /17.*July.*2026/i }));
    expect(getFormEntries(form)).toEqual({
      periodEnd: '2026-07-17',
      periodStart: '2026-07-15',
    });

    await user.click(screen.getByRole('button', { name: 'Reset dates' }));
    await waitFor(() =>
      expect(getFormEntries(form)).toEqual({
        periodEnd: '2026-07-14',
        periodStart: '2026-07-13',
      }),
    );
  });

  it('synchronizes controlled values and excludes disabled names from FormData', async () => {
    const user = userEvent.setup();
    const { unmount } = renderBreeze(<ControlledRange />);
    const controlledForm = screen.getByRole('form', {
      name: 'Controlled booking',
    });

    expect(getFormEntries(controlledForm)).toEqual({
      periodEnd: '2026-07-17',
      periodStart: '2026-07-13',
    });
    await user.click(
      screen.getByRole('button', { name: 'Change controlled range' }),
    );
    expect(getFormEntries(controlledForm)).toEqual({
      periodEnd: '2026-08-02',
      periodStart: '2026-07-28',
    });

    unmount();
    renderBreeze(
      <form aria-label="Disabled booking">
        <DateRangePicker.Root
          defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
          disabled
          endName="periodEnd"
          startName="periodStart"
        >
          <Parts />
        </DateRangePicker.Root>
      </form>,
    );

    expect(
      getFormEntries(screen.getByRole('form', { name: 'Disabled booking' })),
    ).toEqual({});
  });

  it('renders one full-width field surface with integrated parts, states, and refs', () => {
    const rootRef = createRef<HTMLDivElement>();
    const groupRef = createRef<HTMLDivElement>();
    const startRef = createRef<HTMLDivElement>();
    const separatorRef = createRef<HTMLSpanElement>();
    const endRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const { container } = renderBreeze(
      <DateRangePicker.Root invalid ref={rootRef} required>
        <DateRangePicker.Label>Dates</DateRangePicker.Label>
        <DateRangePicker.Group ref={groupRef}>
          <DateRangePicker.StartInput ref={startRef} />
          <DateRangePicker.Separator ref={separatorRef} />
          <DateRangePicker.EndInput ref={endRef} />
          <DateRangePicker.Trigger ref={triggerRef} />
        </DateRangePicker.Group>
        <DateRangePicker.Error>Select a range.</DateRangePicker.Error>
      </DateRangePicker.Root>,
    );

    expect(rootRef.current).toHaveClass('w-full');
    expect(rootRef.current).toHaveAttribute('data-invalid');
    expect(groupRef.current).toHaveAttribute('data-invalid');
    expect(groupRef.current).toHaveClass(
      'w-full',
      'min-h-11',
      'min-w-0',
      'border',
      'data-[focus-within]:outline-2',
      'data-[invalid]:!border-[var(--breeze-danger)]',
    );
    expect(startRef.current).toHaveClass(
      'min-w-0',
      'flex-1',
      'border-0',
      'bg-transparent',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
    );
    expect(endRef.current).toHaveClass('min-w-0', 'flex-1', 'border-0');
    expect(separatorRef.current).toHaveAttribute('aria-hidden', 'true');
    expect(separatorRef.current?.querySelector('svg')).toHaveClass(
      'lucide-arrow-right',
      'rtl:rotate-180',
    );
    expect(triggerRef.current).toHaveClass(
      'shrink-0',
      'border-0',
      'text-[var(--breeze-primary)]',
    );
    expect(triggerRef.current).not.toHaveClass('border-s');
    expect(triggerRef.current?.querySelector('svg')).toHaveAttribute(
      'height',
      '1.25rem',
    );
    expect(
      container.querySelectorAll('[data-breeze-range-input]'),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('input:not([data-breeze-range-input])'),
    ).toHaveLength(2);
  });

  it('preserves class overrides plus disabled and read-only state surfaces', () => {
    renderBreeze(
      <div className="grid gap-4">
        <DateRangePicker.Root disabled>
          <DateRangePicker.Label>Disabled dates</DateRangePicker.Label>
          <DateRangePicker.Group className="max-w-xl">
            <DateRangePicker.StartInput className="px-4" />
            <DateRangePicker.Separator className="text-current" />
            <DateRangePicker.EndInput />
            <DateRangePicker.Trigger className="px-4" />
          </DateRangePicker.Group>
        </DateRangePicker.Root>
        <DateRangePicker.Root
          readOnly
          value={{ end: '2026-07-17', start: '2026-07-13' }}
        >
          <DateRangePicker.Label>Read-only dates</DateRangePicker.Label>
          <DateRangePicker.Group>
            <DateRangePicker.StartInput />
            <DateRangePicker.Separator />
            <DateRangePicker.EndInput />
            <DateRangePicker.Trigger />
          </DateRangePicker.Group>
        </DateRangePicker.Root>
      </div>,
    );

    const disabledTrigger = screen.getByRole('button', {
      name: /Calendar Disabled dates/,
    });
    const disabledGroup = disabledTrigger.parentElement;
    const readOnlyTrigger = screen.getByRole('button', {
      name: /Calendar Read-only dates/,
    });
    const readOnlyGroup = readOnlyTrigger.parentElement;
    const readOnlyRoot = readOnlyTrigger.parentElement?.parentElement;

    expect(disabledGroup).toHaveAttribute('data-disabled');
    expect(disabledGroup).toHaveClass(
      'max-w-xl',
      'data-[disabled]:bg-[var(--breeze-surface-subtle)]',
    );
    expect(disabledTrigger).toBeDisabled();
    expect(disabledTrigger).toHaveClass('px-4');
    expect(disabledGroup?.querySelector('[slot="start"]')).toHaveClass('px-4');
    expect(readOnlyRoot).toHaveAttribute('data-readonly');
    expect(readOnlyGroup).toHaveClass(
      'group-data-[readonly]/picker-field:bg-[var(--breeze-surface-subtle)]',
      'group-data-[readonly]/picker-field:opacity-70',
    );
    expect(readOnlyTrigger).not.toHaveClass('opacity-70');
    expect(readOnlyTrigger).toBeDisabled();
  });
});
