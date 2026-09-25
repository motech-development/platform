import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
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
const controlledEmptyDatePicker = (
  <DatePicker label="Date" onChange={() => undefined} value={null} />
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
expectTypeOf(controlledEmptyDatePicker).toBeObject();
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

  it('uses the provider required message and language', () => {
    renderBreeze(
      <BreezeProvider locale="fr-FR" messages={{ required: 'Obligatoire' }}>
        <DatePicker label="Date" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Date Select a date' }),
    ).toHaveAccessibleDescription('Obligatoire');
    expect(screen.getByText('Obligatoire')).toHaveAttribute('lang', 'fr-FR');
  });

  it('marks its default English placeholder with the fallback language', () => {
    renderBreeze(<DatePicker label="Date" />, 'fr-FR');

    expect(screen.getByText('Select a date')).toHaveAttribute('lang', 'en-GB');
  });

  it('uses a localized default placeholder without replacing a custom one', () => {
    renderBreeze(
      <BreezeProvider
        locale="fr-FR"
        messages={{ selectDate: 'Sélectionner une date' }}
      >
        <>
          <DatePicker label="Localized date" />
          <DatePicker label="Custom date" placeholder="Choose a day" />
        </>
      </BreezeProvider>,
    );

    expect(screen.getByText('Sélectionner une date')).toHaveAttribute(
      'lang',
      'fr-FR',
    );
    expect(screen.getByText('Choose a day')).not.toHaveAttribute('lang');
  });

  it('renders and associates its visible validation error', () => {
    renderBreeze(
      <DatePicker error="Choose a transaction date." label="Date" />,
    );

    const trigger = screen.getByRole('button', { name: 'Date Select a date' });
    const error = screen.getByText('Choose a transaction date.');

    expect(error).toBeVisible();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(
      error.id,
    );
    expect(trigger).toHaveAttribute('aria-errormessage', error.id);
  });

  it('opens from its visible label and focuses the calendar date on keyboard open', async () => {
    const user = userEvent.setup();

    renderBreeze(<DatePicker defaultValue="2026-09-03" label="Date" />);

    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });
    await user.click(screen.getByText('Date', { selector: 'label' }));

    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole('dialog', { name: 'Date' }),
    ).not.toBeInTheDocument();
    await user.keyboard('{Enter}');

    const selectedDate = screen.getByRole('button', {
      name: /Thursday, 3 September 2026 selected/,
    });

    await waitFor(() => expect(selectedDate).toHaveFocus());
  });

  it('closes an open calendar when disabled and leaves focus outside the panel', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <DatePicker defaultValue="2026-09-03" label="Date" />,
    );
    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Date' });

    rerender(
      <BreezeProvider locale="en-GB">
        <DatePicker defaultValue="2026-09-03" disabled label="Date" />
      </BreezeProvider>,
    );

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toBeDisabled();
    expect(dialog.contains(document.activeElement)).toBe(false);
  });

  it('renders a null controlled value as an empty optional form value', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form aria-label="Date form">
        <DatePicker
          label="Date"
          name="date"
          onChange={() => undefined}
          required={false}
          value={null}
        />
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Date Select a date' });
    const hiddenInput = document.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="date"]',
    );
    const form = document.querySelector<HTMLFormElement>(
      'form[aria-label="Date form"]',
    );

    expect(hiddenInput).toHaveValue('');
    expect(form).not.toBeNull();
    expect(new FormData(form!).get('date')).toBe('');
    await user.click(trigger);

    expect(
      within(screen.getByRole('dialog', { name: 'Date' })).queryByRole(
        'button',
        { name: /clear/i },
      ),
    ).not.toBeInTheDocument();
  });

  it('restores uncontrolled values after owning and externally associated form resets', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <form aria-label="Owning form">
          <DatePicker
            defaultValue="2026-09-03"
            label="Owning date"
            name="owningDate"
          />
        </form>
        <form id="external-date-form" />
        <DatePicker
          defaultValue="2026-09-04"
          form="external-date-form"
          label="External date"
          name="externalDate"
        />
      </>,
    );

    const owningTrigger = screen.getByRole('button', {
      name: 'Owning date 3 September 2026',
    });
    await user.click(owningTrigger);
    await user.click(
      within(screen.getByRole('dialog', { name: 'Owning date' })).getByRole(
        'button',
        { name: /10 September 2026/ },
      ),
    );
    const owningForm = document.querySelector<HTMLFormElement>(
      'form[aria-label="Owning form"]',
    );
    expect(owningForm).not.toBeNull();
    await act(async () => {
      owningForm!.reset();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(owningTrigger).toHaveAccessibleName(
        'Owning date 3 September 2026',
      ),
    );

    const externalTrigger = screen.getByRole('button', {
      name: 'External date 4 September 2026',
    });
    await user.click(externalTrigger);
    await user.click(
      within(screen.getByRole('dialog', { name: 'External date' })).getByRole(
        'button',
        { name: /11 September 2026/ },
      ),
    );
    const externalForm = document.querySelector<HTMLFormElement>(
      '#external-date-form',
    );
    expect(externalForm).not.toBeNull();
    await act(async () => {
      externalForm!.reset();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(externalTrigger).toHaveAccessibleName(
        'External date 4 September 2026',
      ),
    );
  });

  it('restores unnamed uncontrolled values after owning and external form resets', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <form aria-label="Unnamed owning form">
          <DatePicker defaultValue="2026-09-03" label="Unnamed owning date" />
        </form>
        <form id="external-unnamed-date-form" />
        <DatePicker
          defaultValue="2026-09-04"
          form="external-unnamed-date-form"
          label="External unnamed date"
        />
      </>,
    );

    const owningTrigger = screen.getByRole('button', {
      name: 'Unnamed owning date 3 September 2026',
    });
    const owningForm = document.querySelector<HTMLFormElement>(
      'form[aria-label="Unnamed owning form"]',
    );
    expect(owningForm).not.toBeNull();
    expect(owningTrigger).toHaveProperty('form', owningForm);
    await user.click(owningTrigger);
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Unnamed owning date' }),
      ).getByRole('button', { name: /10 September 2026/ }),
    );
    await act(async () => {
      owningForm!.reset();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(owningTrigger).toHaveAccessibleName(
        'Unnamed owning date 3 September 2026',
      ),
    );

    const externalTrigger = screen.getByRole('button', {
      name: 'External unnamed date 4 September 2026',
    });
    const externalForm = document.querySelector<HTMLFormElement>(
      '#external-unnamed-date-form',
    );
    expect(externalForm).not.toBeNull();
    expect(externalTrigger).toHaveProperty('form', externalForm);
    await user.click(externalTrigger);
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'External unnamed date' }),
      ).getByRole('button', { name: /11 September 2026/ }),
    );
    await act(async () => {
      externalForm!.reset();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(externalTrigger).toHaveAccessibleName(
        'External unnamed date 4 September 2026',
      ),
    );
  });

  it('resets through an external form replaced while the picker is mounted', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <form aria-label="Replaceable external form" id="live-date-form" />
        <DatePicker
          defaultValue="2026-09-03"
          form="live-date-form"
          label="External date"
          name="date"
        />
      </>,
    );

    const trigger = screen.getByRole<HTMLButtonElement>('button', {
      name: 'External date 3 September 2026',
    });
    const originalForm =
      document.querySelector<HTMLFormElement>('#live-date-form');
    expect(originalForm).not.toBeNull();

    await user.click(trigger);
    await user.click(
      within(screen.getByRole('dialog', { name: 'External date' })).getByRole(
        'button',
        { name: /10 September 2026/ },
      ),
    );
    expect(new FormData(originalForm!).get('date')).toBe('2026-09-10');

    const replacementForm = document.createElement('form');
    replacementForm.id = 'live-date-form';
    originalForm!.replaceWith(replacementForm);
    expect(trigger.form).toBe(replacementForm);
    expect(new FormData(replacementForm).get('date')).toBe('2026-09-10');

    await act(async () => {
      replacementForm.reset();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(trigger).toHaveAccessibleName('External date 3 September 2026'),
    );
    expect(new FormData(replacementForm).get('date')).toBe('2026-09-03');
  });

  it('keeps an uncontrolled value when its form reset is canceled', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form aria-label="Canceled reset form">
        <DatePicker defaultValue="2026-09-03" label="Date" />
      </form>,
    );

    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });
    const form = document.querySelector<HTMLFormElement>(
      'form[aria-label="Canceled reset form"]',
    );
    expect(form).not.toBeNull();
    await user.click(trigger);
    await user.click(
      within(screen.getByRole('dialog', { name: 'Date' })).getByRole('button', {
        name: /10 September 2026/,
      }),
    );
    const cancelReset = (event: Event) => event.preventDefault();
    form!.addEventListener('reset', cancelReset, { once: true });

    await act(async () => {
      form!.reset();
      await Promise.resolve();
    });

    expect(trigger).toHaveAccessibleName('Date 10 September 2026');
  });

  it('does not replace a controlled value on form reset', () => {
    renderBreeze(
      <form aria-label="Controlled date form">
        <DatePicker
          label="Date"
          name="date"
          onChange={() => undefined}
          value="2026-09-03"
        />
      </form>,
    );

    const trigger = screen.getByRole('button', {
      name: 'Date 3 September 2026',
    });
    const form = document.querySelector<HTMLFormElement>(
      'form[aria-label="Controlled date form"]',
    );
    expect(form).not.toBeNull();
    act(() => form!.reset());

    expect(trigger).toHaveAccessibleName('Date 3 September 2026');
  });

  it('does not throw when an ISO-typed trigger value cannot be parsed', async () => {
    const user = userEvent.setup();
    const value = '2026-9-3' as IsoCalendarDate;

    renderBreeze(
      <DatePicker label="Date" onChange={() => undefined} value={value} />,
    );
    const trigger = screen.getByRole('button', { name: 'Date 2026-9-3' });

    await user.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Date' })).toBeVisible();
    expect(screen.getByRole('application', { name: /^Date,/ })).toBeVisible();
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
