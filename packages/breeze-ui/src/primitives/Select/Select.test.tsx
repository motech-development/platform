import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { BadgeProps } from '../Badge/Badge';
import type { ItemDescriptor } from '../Collection/item.types';
import { Select, type SelectProps } from './Select';

const choices = [
  {
    badge: {
      children: 'Primary',
      variant: 'brand',
    } satisfies Pick<BadgeProps, 'aria-label' | 'children' | 'variant'>,
    description: 'Current account ending in 1234',
    icon: 'money',
    id: 'bank',
    label: 'Bank account',
  },
  {
    disabled: true,
    id: 'cash',
    label: 'Cash',
  },
] satisfies ItemDescriptor[];

const getItem = (item: (typeof choices)[number]) => item;

expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'className',
);
expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'style',
);
expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'slot',
);
expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'render',
);
expectTypeOf<ItemDescriptor>().not.toHaveProperty('children');

const controlledSelect = (
  <Select
    getItem={getItem}
    items={choices}
    label="Payment method"
    onChange={() => undefined}
    value={choices[0]}
  />
);
const uncontrolledSelect = (
  <Select
    defaultValue={choices[0]}
    getItem={getItem}
    items={choices}
    label="Payment method"
  />
);
const mixedSelect = (
  // @ts-expect-error Controlled and uncontrolled value props are exclusive.
  <Select
    defaultValue={choices[0]}
    getItem={getItem}
    items={choices}
    label="Payment method"
    onChange={() => undefined}
    value={choices[0]}
  />
);

expectTypeOf(controlledSelect).toBeObject();
expectTypeOf(mixedSelect).toBeObject();
expectTypeOf(uncontrolledSelect).toBeObject();

describe('Select', () => {
  it('uses one tabbable select trigger with listbox keyboard semantics', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select
        getItem={getItem}
        items={choices}
        label="Payment method"
        placeholder="Choose a method"
      />,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Choose a method Payment method',
    });

    expect(document.querySelector('select')).not.toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
    expect(trigger).toHaveAttribute('role', 'combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Bank account/ })).toBeVisible();
  });

  it('associates the visible label with the trigger for pointer activation', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select
        getItem={getItem}
        items={choices}
        label="Payment method"
        placeholder="Choose a method"
      />,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Choose a method Payment method',
    });
    const label = screen.getByText('Payment method');

    expect(label).toHaveAttribute('for', trigger.id);
    await user.click(label);

    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('uses a popover listbox and reports the selected item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <Select
        description="Choose the account used for this payment."
        error=""
        defaultValue={null}
        getItem={getItem}
        items={choices}
        label="Payment method"
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });

    expect(document.querySelector('select')).not.toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription(
      'Choose the account used for this payment.',
    );

    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Bank account/ }),
    ).toHaveTextContent('Current account ending in 1234');
    const bankOption = screen.getByRole('option', { name: /Bank account/ });
    const cashOption = screen.getByRole('option', { name: /Cash/ });
    expect(cashOption).toHaveAttribute('aria-disabled', 'true');
    expect(bankOption).toHaveAttribute('data-focused', 'true');
    expect(bankOption).toHaveAttribute('data-focus-visible', 'true');

    await user.hover(bankOption);
    expect(bankOption).toHaveAttribute('data-hovered', 'true');
    await user.unhover(bankOption);
    expect(bankOption).not.toHaveAttribute('data-hovered');

    await user.click(screen.getByRole('option', { name: /Bank account/ }));

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(trigger).toHaveTextContent('Bank account');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders non-loading errors as an accessible description', () => {
    renderBreeze(
      <Select
        description="Choose an account."
        error="Choose an active payment method."
        getItem={getItem}
        items={choices}
        label="Payment method"
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });

    expect(screen.getByText('Choose an active payment method.')).toBeVisible();
    expect(trigger).toHaveAccessibleDescription(
      'Choose an account. Choose an active payment method.',
    );

    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(
      describedBy?.split(' ').every((id) => document.getElementById(id)),
    ).toBe(true);
  });

  it('does not open a blank listbox when there are no choices', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select getItem={getItem} items={[]} label="Payment method" />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });

    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes an open listbox when choices are removed', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <Select getItem={getItem} items={choices} label="Payment method" />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <Select getItem={getItem} items={[]} label="Payment method" />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('reconciles a removed uncontrolled selection with its form value', async () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={choices[0]}
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
          placeholder="Choose a method"
        />
      </form>,
    );

    const form = document.forms[0];
    expect(new FormData(form).get('payment')).toBe('bank');

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={choices[0]}
            getItem={getItem}
            items={[choices[1]]}
            label="Payment method"
            name="payment"
            onChange={onChange}
            placeholder="Choose a method"
          />
        </form>
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(null);
      expect(new FormData(document.forms[0]).get('payment')).toBe('');
    });
  });

  it.each(['disabled', 'loading', 'readOnly'] as const)(
    'closes an open listbox when rerendered %s',
    async (state) => {
      const user = userEvent.setup();
      const { rerender } = renderBreeze(
        <Select getItem={getItem} items={choices} label="Payment method" />,
      );

      const trigger = screen.getByRole('combobox', {
        name: 'Payment method',
      });
      await user.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      rerender(
        <BreezeProvider locale="en-GB">
          <Select
            disabled={state === 'disabled'}
            getItem={getItem}
            items={choices}
            label="Payment method"
            loading={state === 'loading'}
            readOnly={state === 'readOnly'}
          />
        </BreezeProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    },
  );

  it('derives invalid semantics and preserves its shape while loading', () => {
    renderBreeze(
      <Select
        error="Choose an active payment method."
        getItem={getItem}
        items={choices}
        label="Payment method"
        loading
        required
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });
    expect(document.querySelector('select')).not.toBeInTheDocument();
    expect(trigger).toBeDisabled();
    expect(trigger).not.toBeInvalid();
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(
      screen.queryByText('Choose an active payment method.'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
  });

  it.each(['disabled', 'loading'] as const)(
    'excludes named %s controls from form data',
    (state) => {
      renderBreeze(
        <form aria-label="Payment form">
          <Select
            disabled={state === 'disabled'}
            getItem={getItem}
            items={choices}
            label="Payment method"
            loading={state === 'loading'}
            name="payment"
          />
        </form>,
      );

      expect(new FormData(document.forms[0]).has('payment')).toBe(false);
    },
  );

  it('keeps an item selected by descriptor id across recreated values and allows changes', async () => {
    const user = userEvent.setup();
    const selectionChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange =
      vi.fn<(value: (typeof selectionChoices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <Select
        defaultValue={selectionChoices[0]}
        getItem={(item) => item}
        items={selectionChoices}
        label="Payment method"
        onChange={onChange}
      />,
    );

    const recreatedChoices = selectionChoices.map((choice) => ({ ...choice }));
    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          defaultValue={recreatedChoices[0]}
          getItem={(item) => item}
          items={recreatedChoices}
          label="Payment method"
          onChange={onChange}
        />
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    expect(trigger).toHaveTextContent('Bank account');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));

    expect(onChange).toHaveBeenLastCalledWith(recreatedChoices[1]);
    expect(trigger).toHaveTextContent('Cash');
  });

  it('submits the live uncontrolled selection through its named form field', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
        />
      </form>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Payment method' }));
    await user.click(screen.getByRole('option', { name: /Bank account/ }));

    const form = document.forms[0];
    expect(new FormData(form).get('payment')).toBe('bank');
  });

  it('restores the uncontrolled default selection and submitted value on form reset', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={resetChoices[0]}
          getItem={(item) => item}
          items={resetChoices}
          label="Payment method"
          name="payment"
        />
      </form>,
    );

    const form = document.forms[0];
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    expect(new FormData(form).get('payment')).toBe('bank');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    expect(new FormData(form).get('payment')).toBe('cash');

    fireEvent.reset(form);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(form).get('payment')).toBe('bank');
    });
  });

  it('keeps read-only controls focusable and prevents opening or changing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={choices[0]}
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
          readOnly
        />
      </form>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    expect(trigger).toHaveAttribute('aria-readonly', 'true');
    expect(trigger).not.toBeDisabled();

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    await user.click(trigger);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveClass('breeze:bg-breeze-sunken');
    expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
  });

  it('supports string items and clears controlled values', () => {
    const onChange = vi.fn<(value: string | null) => void>();
    const { rerender } = renderBreeze(
      <Select
        getItem={(item: string) => ({ id: item, label: item })}
        items={['Bank account', 'Cash']}
        label="Payment method"
        onChange={onChange}
        value="Bank account"
      />,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    expect(trigger).toHaveTextContent('Bank account');

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          getItem={(item: string) => ({ id: item, label: item })}
          items={['Bank account', 'Cash']}
          label="Payment method"
          onChange={onChange}
          placeholder="Choose a method"
          value={null}
        />
      </BreezeProvider>,
    );

    expect(trigger).toHaveTextContent('Choose a method');
  });

  it('uses the provider overlay boundary for its listbox popover', async () => {
    renderBreeze(
      <Select getItem={getItem} items={choices} label="Payment method" />,
    );

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Payment method' }),
    );

    const listbox = screen.getByRole('listbox');
    const overlay = listbox.closest('[data-breeze-overlay]');

    expect(overlay).toHaveAttribute('data-breeze-overlay', 'popover');
    expect(overlay).toHaveAttribute('data-breeze-topmost', 'true');
    expect(overlay?.closest('[data-breeze-portal]')).toBeInTheDocument();
  });
});
