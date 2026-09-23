import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { startTransition, Suspense, useState } from 'react';
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
    expect(screen.getByText('Choose a method')).toHaveClass(
      'breeze:text-start',
    );

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
    expect(bankOption).toHaveClass(
      'breeze:any-pointer-coarse:min-block-breeze-tap',
    );
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

  it('forwards trigger interaction state to its visual states', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select
        error="Choose an active payment method."
        getItem={getItem}
        items={choices}
        label="Payment method"
      />,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Payment method',
    });

    expect(trigger).toHaveAttribute('data-invalid', 'true');

    await user.hover(trigger);
    expect(trigger).toHaveAttribute('data-hovered', 'true');

    await user.tab();
    expect(trigger).toHaveAttribute('data-focus-visible', 'true');
  });

  it('keeps its autofill surrogate synchronized with uncontrolled selection', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );
    const surrogateWrapper = surrogate?.closest(
      '[data-react-aria-prevent-focus]',
    );
    expect(surrogate).toHaveAttribute('autocomplete', 'organization');
    expect(surrogateWrapper).toHaveAttribute('aria-hidden', 'true');
    expect(surrogateWrapper).toHaveAttribute(
      'data-a11y-ignore',
      'aria-hidden-focus',
    );
    expect(surrogate).toHaveAttribute('type', 'text');
    expect(surrogate).toHaveAttribute('tabindex', '-1');

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'bank' },
    });

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(surrogate).toHaveValue('bank');
    expect(screen.getByRole('combobox')).toHaveTextContent('Bank account');
  });

  it('renders an autofill surrogate without a submitted name', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <Select
        autoComplete="organization"
        getItem={getItem}
        items={choices}
        label="Payment method"
        onChange={onChange}
      />,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[autocomplete="organization"]',
    );

    expect(surrogate).toBeInTheDocument();
    expect(surrogate).not.toHaveAttribute('name');

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'bank' },
    });

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(screen.getByRole('combobox')).toHaveTextContent('Bank account');
  });

  it('maps a unique descriptor label from browser autofill', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: choices[0].label },
    });

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(surrogate).toHaveValue(choices[0].id);
    expect(screen.getByRole('combobox')).toHaveTextContent(choices[0].label);
  });

  it('rejects ambiguous descriptor labels from browser autofill', () => {
    const ambiguousChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
      label: 'Shared payment method',
    }));
    const onChange =
      vi.fn<(value: (typeof ambiguousChoices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          defaultValue={ambiguousChoices[0]}
          getItem={(item) => item}
          items={ambiguousChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'Shared payment method' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(surrogate).toHaveValue(ambiguousChoices[0].id);
    expect(screen.getByRole('combobox')).toHaveTextContent(
      'Shared payment method',
    );
  });

  it('restores its semantic value for unmatched browser autofill values', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          defaultValue={choices[0]}
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'browser-only-value' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(surrogate).toHaveValue('bank');
    expect(screen.getByRole('combobox')).toHaveTextContent('Bank account');
    expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
  });

  it('does not select a disabled item from browser autofill', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          defaultValue={choices[0]}
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'cash' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(surrogate).toHaveValue('bank');
    expect(screen.getByRole('combobox')).toHaveTextContent('Bank account');
    expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
  });

  it('ignores disabled autofill matches when an enabled match is unique', () => {
    const autofillChoices = [
      choices[0],
      {
        id: 'active-account',
        label: 'shared-payment-method',
      },
      {
        disabled: true,
        id: 'shared-payment-method',
        label: 'Disabled payment method',
      },
    ] satisfies ItemDescriptor[];
    const onChange =
      vi.fn<(value: (typeof autofillChoices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
          defaultValue={autofillChoices[0]}
          getItem={(item) => item}
          items={autofillChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'shared-payment-method' },
    });

    expect(onChange).toHaveBeenCalledWith(autofillChoices[1]);
    expect(surrogate).toHaveValue(autofillChoices[1].id);
    expect(screen.getByRole('combobox')).toHaveTextContent(
      autofillChoices[1].label,
    );
  });

  it('synchronizes the autofill surrogate when controlled value changes', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <Select
        autoComplete="organization"
        getItem={getItem}
        items={choices}
        label="Payment method"
        name="payment"
        onChange={onChange}
        value={choices[0]}
      />,
    );

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );
    expect(surrogate).toHaveValue('bank');

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          autoComplete="organization"
          getItem={getItem}
          items={choices}
          label="Payment method"
          name="payment"
          onChange={onChange}
          value={choices[1]}
        />
      </BreezeProvider>,
    );

    expect(surrogate).toHaveValue('cash');
  });

  it('does not let a read-only autofill surrogate mutate selection', () => {
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          autoComplete="organization"
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

    const surrogate = document.querySelector<HTMLInputElement>(
      'input[name="payment"]',
    );
    expect(surrogate).toHaveValue('bank');
    expect(surrogate).toHaveAttribute('readonly');
    expect(
      surrogate?.closest('[data-react-aria-prevent-focus]'),
    ).toHaveAttribute('aria-hidden', 'true');

    fireEvent.input(surrogate as HTMLInputElement, {
      target: { value: 'cash' },
    });
    fireEvent.change(surrogate as HTMLInputElement, {
      target: { value: 'cash' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(surrogate).toHaveValue('bank');
    expect(screen.getByRole('combobox')).toHaveTextContent('Bank account');
    expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
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
    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(trigger).not.toBeInvalid();
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(
      screen.queryByText('Choose an active payment method.'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
  });

  it('selects an uncontrolled default when choices arrive after loading', async () => {
    const defaultChoice = {
      ...choices[0],
      disabled: false,
    };
    const onChange = vi.fn();
    const { rerender } = renderBreeze(
      <Select
        defaultValue={defaultChoice}
        getItem={(item) => item}
        items={[]}
        label="Payment method"
        loading
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Payment method' });
    expect(trigger).not.toHaveTextContent('Bank account');

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          defaultValue={defaultChoice}
          getItem={(item) => item}
          items={[defaultChoice]}
          label="Payment method"
          onChange={onChange}
        />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not restore a pending loading default over a later user selection', async () => {
    const user = userEvent.setup();
    const defaultChoice = { id: 'default', label: 'Default' };
    const selectedChoice = { id: 'selected', label: 'Selected' };
    const onChange =
      vi.fn<
        (value: typeof defaultChoice | typeof selectedChoice | null) => void
      >();
    const { rerender } = renderBreeze(
      <Select
        defaultValue={defaultChoice}
        getItem={(item) => item}
        items={[]}
        label="Payment method"
        loading
        onChange={onChange}
      />,
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          defaultValue={defaultChoice}
          getItem={(item) => item}
          items={[selectedChoice]}
          label="Payment method"
          onChange={onChange}
        />
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Selected' }));
    expect(onChange).toHaveBeenLastCalledWith(selectedChoice);
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          defaultValue={defaultChoice}
          getItem={(item) => item}
          items={[defaultChoice]}
          label="Payment method"
          onChange={onChange}
          placeholder="Choose a method"
        />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Choose a method');
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(trigger).not.toHaveTextContent('Default');
  });

  it('discards a pending loading default when it is absent after loading', async () => {
    const defaultChoice = { id: 'default', label: 'Default' };
    const availableChoice = { id: 'available', label: 'Available' };
    const onChange = vi.fn();
    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={defaultChoice}
          getItem={(item) => item}
          items={[]}
          label="Payment method"
          loading
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={defaultChoice}
            getItem={(item) => item}
            items={[availableChoice]}
            label="Payment method"
            name="payment"
            onChange={onChange}
            placeholder="Choose a method"
          />
        </form>
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Choose a method Payment method',
    });
    expect(trigger).toHaveTextContent('Choose a method');

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={defaultChoice}
            getItem={(item) => item}
            items={[defaultChoice]}
            label="Payment method"
            name="payment"
            onChange={onChange}
            placeholder="Choose a method"
          />
        </form>
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Choose a method');
    });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.reset(document.forms[0]);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Choose a method');
      expect(new FormData(document.forms[0]).get('payment')).toBe('');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('retains an uncontrolled selection while a loading collection is empty', async () => {
    const user = userEvent.setup();
    const selectionChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange =
      vi.fn<(value: (typeof selectionChoices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={selectionChoices[0]}
          getItem={(item) => item}
          items={selectionChoices}
          label="Payment method"
          loading={false}
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={[]}
            label="Payment method"
            loading
            name="payment"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={selectionChoices}
            label="Payment method"
            loading={false}
            name="payment"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Cash');
      expect(new FormData(document.forms[0]).get('payment')).toBe('cash');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('restores the initial default when a form resets during loading', async () => {
    const user = userEvent.setup();
    const selectionChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange =
      vi.fn<(value: (typeof selectionChoices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={selectionChoices[0]}
          getItem={(item) => item}
          items={selectionChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={[]}
            label="Payment method"
            loading
            name="payment"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    fireEvent.reset(document.forms[0]);

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={selectionChoices}
            label="Payment method"
            name="payment"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the reset target from the committed render after an abandoned render', async () => {
    const user = userEvent.setup();
    const selectionChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    let shouldSuspend = false;
    let didSuspend = false;
    const suspendedRender = Object.assign(new Error('Suspended render'), {
      then: () => undefined,
    });
    let startSuspendedRender = () => undefined;
    let restoreChoices = () => undefined;

    function Suspender() {
      if (shouldSuspend) {
        didSuspend = true;
        throw suspendedRender;
      }

      return null;
    }

    function SuspenseHarness() {
      const [items, setItems] = useState(selectionChoices);
      startSuspendedRender = () => {
        shouldSuspend = true;
        startTransition(() => setItems([]));
      };
      restoreChoices = () => {
        shouldSuspend = false;
        setItems(selectionChoices);
      };

      return (
        <form aria-label="Payment form">
          <Suspense fallback={<span>Loading payment methods</span>}>
            <Select
              defaultValue={selectionChoices[0]}
              getItem={(item) => item}
              items={items}
              label="Payment method"
              name="payment"
            />
            <Suspender />
          </Suspense>
        </form>
      );
    }

    renderBreeze(<SuspenseHarness />);

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));

    act(startSuspendedRender);
    act(restoreChoices);

    expect(didSuspend).toBe(true);
    expect(trigger).toHaveTextContent('Cash');

    fireEvent.reset(document.forms[0]);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(document.forms[0]).get('payment')).toBe('bank');
    });
  });

  it('reconciles an unavailable uncontrolled selection when loading completes', async () => {
    const user = userEvent.setup();
    const selectionChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange =
      vi.fn<(value: (typeof selectionChoices)[number] | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={selectionChoices[0]}
          getItem={(item) => item}
          items={selectionChoices}
          label="Payment method"
          loading={false}
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={[]}
            label="Payment method"
            loading
            name="payment"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={selectionChoices[0]}
            getItem={(item) => item}
            items={[selectionChoices[0]]}
            label="Payment method"
            loading={false}
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
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();
    const resetChoices: ItemDescriptor[] = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));

    function ResettableSelect() {
      const [, forceRender] = useState(0);

      return (
        <form
          aria-label="Payment form"
          onReset={() => forceRender((renderCount) => renderCount + 1)}
        >
          <Select
            defaultValue={resetChoices[0]}
            getItem={(item) => item}
            items={resetChoices}
            label="Payment method"
            name="payment"
            onChange={onChange}
          />
        </form>
      );
    }

    renderBreeze(<ResettableSelect />);

    const form = document.forms[0];
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    expect(new FormData(form).get('payment')).toBe('bank');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    expect(new FormData(form).get('payment')).toBe('cash');
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(form).get('payment')).toBe('bank');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies a form reset before returning and preserves a later selection', async () => {
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

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    form.reset();

    expect(trigger).toHaveTextContent('Bank account');
    expect(new FormData(form).get('payment')).toBe('bank');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));

    expect(trigger).toHaveTextContent('Cash');
    expect(new FormData(form).get('payment')).toBe('cash');
  });

  it('aborts a queued reset when the select unmounts during reset', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    function ResettableSelect() {
      const [isMounted, setIsMounted] = useState(true);

      return (
        <form aria-label="Payment form" onReset={() => setIsMounted(false)}>
          {isMounted && (
            <Select
              defaultValue={resetChoices[0]}
              getItem={(item) => item}
              items={resetChoices}
              label="Payment method"
              name="payment"
              onChange={onChange}
            />
          )}
        </form>
      );
    }

    renderBreeze(<ResettableSelect />);

    const form = document.forms[0];
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    fireEvent.reset(form);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('aborts a queued reset when reset switches the select to controlled', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    function ResettableSelect() {
      const [isControlled, setIsControlled] = useState(false);

      return (
        <form aria-label="Payment form" onReset={() => setIsControlled(true)}>
          {isControlled ? (
            <Select
              getItem={(item) => item}
              items={resetChoices}
              label="Payment method"
              name="payment"
              onChange={onChange}
              value={resetChoices[1]}
            />
          ) : (
            <Select
              defaultValue={resetChoices[0]}
              getItem={(item) => item}
              items={resetChoices}
              label="Payment method"
              name="payment"
              onChange={onChange}
            />
          )}
          <button type="button" onClick={() => setIsControlled(false)}>
            Use uncontrolled value
          </button>
        </form>
      );
    }

    renderBreeze(<ResettableSelect />);

    const form = document.forms[0];
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    fireEvent.reset(form);

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole('combobox', { name: 'Cash Payment method' }),
    ).toHaveTextContent('Cash');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: 'Use uncontrolled value' }),
    );

    expect(
      screen.getByRole('combobox', { name: 'Cash Payment method' }),
    ).toHaveTextContent('Cash');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not restore the uncontrolled default selection when form reset is canceled', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));

    renderBreeze(
      <form
        aria-label="Payment form"
        onReset={(event) => event.preventDefault()}
      >
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

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    expect(new FormData(form).get('payment')).toBe('cash');

    fireEvent.reset(form);

    await act(async () => {
      await Promise.resolve();
    });

    expect(trigger).toHaveTextContent('Cash');
    expect(new FormData(form).get('payment')).toBe('cash');
  });

  it('resets when form reset propagation is stopped', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    renderBreeze(
      <form
        aria-label="Payment form"
        onReset={(event) => event.stopPropagation()}
      >
        <Select
          defaultValue={resetChoices[0]}
          getItem={(item) => item}
          items={resetChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(form).get('payment')).toBe('bank');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('binds to an external form that mounts after the select', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    function ExternalFormHarness() {
      const [showForm, setShowForm] = useState(false);

      return (
        <>
          <Select
            defaultValue={resetChoices[0]}
            form="payment-form"
            getItem={(item) => item}
            items={resetChoices}
            label="Payment method"
            name="payment"
            onChange={onChange}
          />
          <button type="button" onClick={() => setShowForm(true)}>
            Mount form
          </button>
          {showForm && <form id="payment-form" aria-label="Payment form" />}
        </>
      );
    }

    renderBreeze(<ExternalFormHarness />);

    await user.click(screen.getByRole('button', { name: 'Mount form' }));
    const form = document.getElementById('payment-form') as HTMLFormElement;
    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();
    form.reset();

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not emit when reset clears a removed uncontrolled default', async () => {
    const user = userEvent.setup();
    const resetChoices = choices.map((choice) => ({
      ...choice,
      disabled: false,
    }));
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    const { rerender } = renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={resetChoices[0]}
          getItem={(item) => item}
          items={resetChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
          placeholder="Choose a method"
        />
      </form>,
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Bank account Payment method',
    });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Payment form">
          <Select
            defaultValue={resetChoices[0]}
            getItem={(item) => item}
            items={[resetChoices[1]]}
            label="Payment method"
            name="payment"
            onChange={onChange}
            placeholder="Choose a method"
          />
        </form>
      </BreezeProvider>,
    );

    fireEvent.reset(document.forms[0]);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Choose a method');
      expect(new FormData(document.forms[0]).get('payment')).toBe('');
    });
    expect(onChange).not.toHaveBeenCalled();
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
