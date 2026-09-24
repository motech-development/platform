import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import type { IsoCalendarDate } from '../Typography/Typography';
import { DatePicker, type DatePickerProps } from './DatePicker';

expectTypeOf<DatePickerProps>().not.toHaveProperty('className');
expectTypeOf<DatePickerProps>().not.toHaveProperty('style');
expectTypeOf<DatePickerProps>().not.toHaveProperty('slot');
expectTypeOf<DatePickerProps['onChange']>().toEqualTypeOf<
  ((value: IsoCalendarDate) => void) | undefined
>();

const controlledDatePicker = (
  <DatePicker label="Date" onChange={() => undefined} value="2026-09-03" />
);
const uncontrolledDatePicker = (
  <DatePicker defaultValue="2026-09-03" label="Date" />
);
const mixedDatePicker = (
  <DatePicker
    defaultValue="2026-09-03"
    label="Date"
    onChange={() => undefined}
    // @ts-expect-error Controlled and uncontrolled values are exclusive.
    value="2026-09-04"
  />
);

expectTypeOf(controlledDatePicker).toBeObject();
expectTypeOf(uncontrolledDatePicker).toBeObject();
expectTypeOf(mixedDatePicker).toBeObject();

describe('DatePicker', () => {
  it('shows a locale-formatted long date and a calendar glyph at the trigger edge', () => {
    const { container } = renderBreeze(
      <DatePicker label="Date" value="2026-09-03" onChange={() => undefined} />,
    );
    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });

    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('3 September 2026');
    expect(trigger.lastElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(
      container.querySelector('input[type="date"]'),
    ).not.toBeInTheDocument();
  });

  it('formats the trigger date using the provider locale', () => {
    renderBreeze(
      <DatePicker label="Date" value="2026-09-03" onChange={() => undefined} />,
      'en-US',
    );

    expect(
      screen.getByRole('button', { name: 'Date September 3, 2026' }),
    ).toBeInTheDocument();
  });

  it('selects ISO dates without offering a clear control', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: IsoCalendarDate) => void>();

    renderBreeze(
      <DatePicker label="Date" onChange={onChange} defaultValue="2026-09-03" />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Date 3 September 2026' }),
    );
    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });
    const dialog = screen.getByRole('dialog', { name: 'Date' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).toBeVisible();
    const calendar = screen.getByRole('application', {
      name: /Date, September 2026/,
    });

    expect(
      within(calendar).queryByRole('button', { name: /clear/i }),
    ).not.toBeInTheDocument();
    await user.click(
      within(calendar).getByRole('button', { name: /12 September 2026/ }),
    );

    expect(onChange).toHaveBeenLastCalledWith('2026-09-12');
    expect(
      screen.getByRole('button', { name: 'Date 12 September 2026' }),
    ).toBeInTheDocument();
  });

  it('reopens at the selected month after browsing elsewhere', async () => {
    const user = userEvent.setup();

    renderBreeze(<DatePicker label="Date" defaultValue="2026-09-03" />);

    await user.click(
      screen.getByRole('button', { name: 'Date 3 September 2026' }),
    );
    const calendar = screen.getByRole('application', {
      name: /Date, September 2026/,
    });
    await user.click(
      within(calendar).getAllByRole('button', { name: 'Next' })[0],
    );
    expect(
      screen
        .getByRole('application', { name: /Date, October 2026/ })
        .querySelector('h2'),
    ).toHaveTextContent('October 2026');

    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Date 3 September 2026' }),
    );

    expect(
      screen
        .getByRole('application', { name: /Date, September 2026/ })
        .querySelector('h2'),
    ).toHaveTextContent('September 2026');
  });

  it('scrolls its opened panel into view and announces required state', async () => {
    const user = userEvent.setup();

    renderBreeze(<DatePicker label="Date" defaultValue="2026-09-03" />);

    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollIntoView',
    );
    const scrollTargets: HTMLElement[] = [];
    const scrollIntoView = vi.fn(function collectScrollTarget(
      this: HTMLElement,
    ) {
      scrollTargets.push(this);
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    try {
      expect(trigger).toHaveAccessibleDescription('Required');
      await user.click(trigger);

      const dialog = screen.getByRole('dialog', { name: 'Date' });
      const panel = dialog.closest<HTMLElement>(
        '[data-breeze-overlay="popover"]',
      );

      await waitFor(() => {
        expect(panel).not.toBeNull();
        expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
        expect(scrollTargets).toContain(panel);
        expect(scrollTargets).not.toContain(trigger);
      });
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(
          HTMLElement.prototype,
          'scrollIntoView',
          originalDescriptor,
        );
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
      }
    }
  });
});
