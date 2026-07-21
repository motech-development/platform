import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('opens its calendar and reports stable selected dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <DatePicker.Root defaultValue="2026-07-13" onChange={onChange}>
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Popover>
          <DatePicker.Calendar />
        </DatePicker.Popover>
      </DatePicker.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Calendar Date/ });
    const group = trigger.parentElement;

    expect(trigger).toHaveTextContent('13 July 2026');
    expect(trigger.querySelector('svg')).toHaveClass('lucide-calendar');
    expect(trigger).toHaveClass(
      'min-h-11',
      'w-full',
      'justify-between',
      'px-3',
      'py-2.5',
      'font-[family-name:var(--breeze-font-body)]',
      'text-base',
      'font-normal',
      'leading-[1.4]',
      'bg-[var(--breeze-surface)]',
      'text-[var(--breeze-ink)]',
      'data-[hovered]:!border-[var(--breeze-primary)]',
      'data-[focus-visible]:outline-2',
      'data-[disabled]:cursor-not-allowed',
    );
    expect(group).toHaveClass('w-full');
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    const calendarElement = screen.getByRole('application');
    const calendar = within(calendarElement);
    const calendarGrid = calendar.getByRole('grid');
    const [previous] = calendar.getAllByRole('button', { name: 'Previous' });
    const [next] = calendar.getAllByRole('button', { name: 'Next' });

    expect(calendarElement.closest('[data-placement]')).toHaveAttribute(
      'data-placement',
      'bottom',
    );
    expect(calendarElement).toHaveClass('w-full');
    expect(calendarGrid).toHaveClass('w-full');
    expect(previous.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(next.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await user.click(next);
    expect(
      calendar.getByRole('heading', { name: 'August 2026' }),
    ).toBeInTheDocument();
    await user.click(previous);
    await user.click(screen.getByRole('button', { name: /14.*July.*2026/i }));
    expect(onChange).toHaveBeenLastCalledWith('2026-07-14');
  });

  it('preserves explicit trigger content and an accessible name override', () => {
    renderBreeze(
      <DatePicker.Root defaultValue="2026-07-13">
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger aria-label="Choose another date">
            Custom calendar
          </DatePicker.Trigger>
        </DatePicker.Group>
      </DatePicker.Root>,
    );

    const trigger = screen.getByRole('button', {
      name: 'Choose another date Date',
    });

    expect(trigger).toHaveAttribute('aria-label', 'Choose another date');
    expect(trigger).toHaveTextContent('Custom calendar');
    expect(trigger.querySelector('svg')).not.toBeInTheDocument();
  });

  it('shows provider-owned guidance when no date is selected', () => {
    renderBreeze(
      <DatePicker.Root defaultValue={null}>
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>,
      {
        messages: {
          selectDate: 'Choose a date',
        },
      },
    );

    expect(
      screen.getByRole('button', { name: /Calendar Date/ }),
    ).toHaveTextContent('Choose a date');
  });

  it('formats its visible value with the provider locale and time zone', () => {
    renderBreeze(
      <DatePicker.Root defaultValue="2026-07-13">
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>,
      {
        locale: 'fr-FR',
        timeZone: 'Europe/Paris',
      },
    );

    expect(
      screen.getByRole('button', { name: /Calendrier Date/ }),
    ).toHaveTextContent('13 juillet 2026');
  });

  it('applies provider direction to its portalled popover', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <DatePicker.Root defaultValue="2026-07-13">
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Popover>
          <DatePicker.Calendar />
        </DatePicker.Popover>
      </DatePicker.Root>,
      { direction: 'rtl', locale: 'en-GB' },
    );

    await user.click(screen.getByRole('button', { name: /Calendar Date/ }));

    const popover = screen.getByRole('dialog');
    const calendar = within(screen.getByRole('application'));
    const previous = calendar.getByRole('button', { name: 'Previous' });
    const next = calendar.getAllByRole('button', { name: 'Next' })[0];

    expect(popover).toHaveAttribute('dir', 'rtl');
    expect(previous.querySelector('svg')).toHaveClass(
      'lucide-arrow-left',
      'rtl:rotate-180',
    );
    expect(next?.querySelector('svg')).toHaveClass(
      'lucide-arrow-right',
      'rtl:rotate-180',
    );
  });

  it('allows an explicit popover direction override', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <DatePicker.Root defaultValue="2026-07-13">
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Popover dir="ltr">
          <DatePicker.Calendar />
        </DatePicker.Popover>
      </DatePicker.Root>,
      { direction: 'rtl', locale: 'en-GB' },
    );

    await user.click(screen.getByRole('button', { name: /Calendar Date/ }));

    expect(screen.getByRole('dialog')).toHaveAttribute('dir', 'ltr');
  });
});
