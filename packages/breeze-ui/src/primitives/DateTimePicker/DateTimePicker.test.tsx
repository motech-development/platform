import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { DateTimePicker } from './DateTimePicker';

describe('DateTimePicker', () => {
  it('emits explicit provider-zone offsets from segmented edits', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = renderBreeze(
      <DateTimePicker.Root
        defaultValue="2026-07-13T12:30:00+00:00"
        onChange={onChange}
      >
        <DateTimePicker.Label>Date and time</DateTimePicker.Label>
        <DateTimePicker.Group>
          <DateTimePicker.Input />
          <DateTimePicker.Trigger />
        </DateTimePicker.Group>
        <DateTimePicker.Popover>
          <DateTimePicker.Calendar />
        </DateTimePicker.Popover>
      </DateTimePicker.Root>,
      { timeZone: 'Europe/London' },
    );

    const trigger = screen.getByRole('button', {
      name: /Calendar Date and time/,
    });
    const group = trigger.parentElement;
    const minute = screen.getByRole('spinbutton', { name: /minute/i });
    const input = minute.parentElement;

    expect(trigger.querySelector('svg')).toHaveClass('lucide-calendar');
    expect(trigger.querySelector('svg')).toHaveAttribute('height', '1.25rem');
    expect(group).toHaveClass(
      'w-full',
      'min-h-11',
      'border',
      'data-[focus-within]:outline-2',
    );
    expect(input).toHaveClass(
      'min-w-0',
      'flex-1',
      'border-0',
      'bg-transparent',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
    );
    expect(trigger).toHaveClass('border-0', 'text-[var(--breeze-primary)]');
    expect(trigger).not.toHaveClass('border-s', 'border-l');
    const timeZone = container.querySelector('[data-type="timeZoneName"]');

    expect(timeZone).toHaveTextContent('BST');
    expect(timeZone).toHaveClass('cursor-default', 'select-none');
    expect(timeZone).not.toHaveAttribute('role');
    expect(timeZone).not.toHaveAttribute('tabindex');
    expect(timeZone).not.toHaveAttribute('contenteditable');
    expect(timeZone).not.toHaveAttribute('data-focused');
    await user.click(timeZone as HTMLElement);
    expect(document.activeElement).not.toBe(timeZone);
    minute.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('2026-07-13T13:31:00+01:00');
  });

  it('provides a localized calendar and segmented time surface backed by the picker value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const calendarRef = createRef<HTMLDivElement>();

    renderBreeze(
      <DateTimePicker.Root
        defaultValue="2026-07-13T12:30:00+00:00"
        onChange={onChange}
      >
        <DateTimePicker.Label>Date and time</DateTimePicker.Label>
        <DateTimePicker.Group>
          <DateTimePicker.Input />
          <DateTimePicker.Trigger />
        </DateTimePicker.Group>
        <DateTimePicker.Popover>
          <DateTimePicker.Calendar className="max-w-sm" ref={calendarRef} />
        </DateTimePicker.Popover>
      </DateTimePicker.Root>,
      {
        messages: {
          selectDateTime: 'Choose date and time',
          selectTime: 'Choose time',
        },
        timeZone: 'Europe/London',
      },
    );

    await user.click(
      screen.getByRole('button', { name: /Calendar Date and time/ }),
    );

    expect(calendarRef.current).toHaveClass('max-w-sm');
    expect(screen.getByRole('dialog')).toHaveAccessibleName(
      'Choose date and time',
    );
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'data-placement',
      'bottom',
    );
    expect(screen.getByText('Choose time')).toBeVisible();
    expect(screen.getByRole('application')).toBeVisible();
    const popoverMinute = screen.getByRole('spinbutton', {
      name: /minute.*Choose time/i,
    });
    const popoverTimeZone = calendarRef.current?.querySelector(
      '[data-type="timeZoneName"]',
    );

    expect(popoverMinute.parentElement).toHaveClass(
      'w-full',
      'min-h-11',
      'text-base',
    );
    expect(popoverTimeZone).toHaveTextContent('BST');
    expect(popoverTimeZone).not.toHaveAttribute('role');
    expect(popoverTimeZone).not.toHaveAttribute('tabindex');
    popoverMinute.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('2026-07-13T13:31:00+01:00');
  });

  it('allows callers to override the logical calendar placement', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
        <DateTimePicker.Label>Date and time</DateTimePicker.Label>
        <DateTimePicker.Group>
          <DateTimePicker.Input />
          <DateTimePicker.Trigger />
        </DateTimePicker.Group>
        <DateTimePicker.Popover placement="top start">
          <DateTimePicker.Calendar />
        </DateTimePicker.Popover>
      </DateTimePicker.Root>,
      { timeZone: 'Europe/London' },
    );

    await user.click(
      screen.getByRole('button', { name: /Calendar Date and time/ }),
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'top');
  });

  it('preserves the selected time when choosing a new calendar date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <DateTimePicker.Root
        defaultValue="2026-07-13T12:30:00+00:00"
        onChange={onChange}
      >
        <DateTimePicker.Label>Date and time</DateTimePicker.Label>
        <DateTimePicker.Group>
          <DateTimePicker.Input />
          <DateTimePicker.Trigger />
        </DateTimePicker.Group>
        <DateTimePicker.Popover>
          <DateTimePicker.Calendar />
        </DateTimePicker.Popover>
      </DateTimePicker.Root>,
      { timeZone: 'Europe/London' },
    );

    await user.click(
      screen.getByRole('button', { name: /Calendar Date and time/ }),
    );
    await user.click(screen.getByRole('button', { name: /14.*July.*2026/i }));

    expect(onChange).toHaveBeenLastCalledWith('2026-07-14T13:30:00+01:00');
  });

  it('recalculates the explicit offset across daylight-saving boundaries', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <DateTimePicker.Root
        defaultValue="2026-03-29T00:30:00+00:00"
        onChange={onChange}
      >
        <DateTimePicker.Label>Date and time</DateTimePicker.Label>
        <DateTimePicker.Group>
          <DateTimePicker.Input />
          <DateTimePicker.Trigger />
        </DateTimePicker.Group>
        <DateTimePicker.Popover>
          <DateTimePicker.Calendar />
        </DateTimePicker.Popover>
      </DateTimePicker.Root>,
      { timeZone: 'Europe/London' },
    );

    await user.click(
      screen.getByRole('button', { name: /Calendar Date and time/ }),
    );
    await user.click(screen.getByRole('button', { name: /30.*March.*2026/i }));

    expect(onChange).toHaveBeenLastCalledWith('2026-03-30T00:30:00+01:00');
  });

  it('localizes the popover time field and protects disabled and read-only time values', async () => {
    const user = userEvent.setup();
    const onDisabledChange = vi.fn();

    renderBreeze(
      <div className="grid gap-4">
        <DateTimePicker.Root
          defaultValue="2026-07-13T12:30:00-04:00"
          disabled
          onChange={onDisabledChange}
        >
          <DateTimePicker.Label>Disabled instant</DateTimePicker.Label>
          <DateTimePicker.Calendar />
        </DateTimePicker.Root>
        <DateTimePicker.Root readOnly value="2026-07-13T12:30:00-04:00">
          <DateTimePicker.Label>Read-only instant</DateTimePicker.Label>
          <DateTimePicker.Calendar />
        </DateTimePicker.Root>
      </div>,
      { locale: 'en-US', timeZone: 'America/New_York' },
    );

    const dayPeriods = screen.getAllByRole('spinbutton', { name: /AM\/PM/i });
    const minutes = screen.getAllByRole('spinbutton', { name: /minute/i });

    expect(dayPeriods).toHaveLength(2);
    expect(minutes[0]).toHaveAttribute('aria-disabled', 'true');
    expect(minutes[1]).toHaveAttribute('aria-readonly', 'true');
    const disabledMinute = minutes[0]?.textContent;
    const readOnlyMinute = minutes[1]?.textContent;

    minutes[0]?.focus();
    await user.keyboard('{ArrowUp}');
    minutes[1]?.focus();
    await user.keyboard('{ArrowUp}');
    expect(minutes[0]).toHaveTextContent(disabledMinute ?? '');
    expect(minutes[1]).toHaveTextContent(readOnlyMinute ?? '');
    expect(onDisabledChange).not.toHaveBeenCalled();
  });

  it('preserves full-width class overrides, refs, and shared picker states', () => {
    const rootRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();

    renderBreeze(
      <div className="grid gap-4">
        <DateTimePicker.Root invalid ref={rootRef} required>
          <DateTimePicker.Label>Invalid instant</DateTimePicker.Label>
          <DateTimePicker.Group className="max-w-xl">
            <DateTimePicker.Input className="px-4" ref={inputRef} />
            <DateTimePicker.Trigger className="px-4" ref={triggerRef} />
          </DateTimePicker.Group>
        </DateTimePicker.Root>
        <DateTimePicker.Root disabled>
          <DateTimePicker.Label>Disabled instant</DateTimePicker.Label>
          <DateTimePicker.Group>
            <DateTimePicker.Input />
            <DateTimePicker.Trigger />
          </DateTimePicker.Group>
        </DateTimePicker.Root>
        <DateTimePicker.Root readOnly value="2026-07-13T13:30:00+01:00">
          <DateTimePicker.Label>Read-only instant</DateTimePicker.Label>
          <DateTimePicker.Group>
            <DateTimePicker.Input />
            <DateTimePicker.Trigger />
          </DateTimePicker.Group>
        </DateTimePicker.Root>
      </div>,
      { timeZone: 'Europe/London' },
    );

    const invalidGroup = triggerRef.current?.parentElement;
    const disabledTrigger = screen.getByRole('button', {
      name: /Calendar Disabled instant/,
    });
    const disabledGroup = disabledTrigger.parentElement;
    const readOnlyTrigger = screen.getByRole('button', {
      name: /Calendar Read-only instant/,
    });
    const readOnlyGroup = readOnlyTrigger.parentElement;
    const readOnlyRoot = readOnlyTrigger.parentElement?.parentElement;

    expect(rootRef.current).toHaveClass('w-full');
    expect(rootRef.current).toHaveAttribute('data-invalid');
    expect(invalidGroup).toHaveAttribute('data-invalid');
    expect(invalidGroup).toHaveClass(
      'max-w-xl',
      'data-[invalid]:!border-[var(--breeze-danger)]',
    );
    expect(inputRef.current).toHaveClass('px-4');
    expect(triggerRef.current).toHaveClass('px-4');
    expect(disabledGroup).toHaveClass(
      'data-[disabled]:bg-[var(--breeze-surface-subtle)]',
    );
    expect(disabledTrigger).toBeDisabled();
    expect(readOnlyRoot).toHaveAttribute('data-readonly');
    expect(readOnlyGroup).toHaveClass(
      'group-data-[readonly]/picker-field:bg-[var(--breeze-surface-subtle)]',
      'group-data-[readonly]/picker-field:opacity-70',
    );
    expect(readOnlyTrigger).not.toHaveClass('opacity-70');
    expect(readOnlyTrigger).toBeDisabled();
  });
});
