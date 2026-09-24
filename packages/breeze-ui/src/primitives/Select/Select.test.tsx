import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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
const enabledChoices: ItemDescriptor[] = choices.map((choice) => ({
  ...choice,
  disabled: false,
}));
const getEnabledItem = (item: ItemDescriptor) => item;

expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'className',
);
expectTypeOf<SelectProps<(typeof choices)[number]>>().not.toHaveProperty(
  'style',
);
expectTypeOf<ItemDescriptor>().not.toHaveProperty('children');

describe('Select', () => {
  it('renders an accessible popover trigger and hidden native form select', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select
        getItem={getItem}
        items={choices}
        label="Payment method"
        placeholder="Choose a method"
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'Choose a method Payment method',
    });
    const hiddenSelect = document.querySelector('select');

    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(hiddenSelect).toHaveAttribute('tabindex', '-1');
    expect(hiddenSelect).toHaveValue('');

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByRole('option', { name: /Bank account/ })).toBeVisible();
  });

  it('uses the descriptor contract and reports a selected item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    renderBreeze(
      <Select
        description="Choose the account used for this payment."
        error="Choose an active payment method."
        getItem={getItem}
        items={choices}
        label="Payment method"
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Payment method' });
    expect(trigger).toHaveAccessibleDescription(
      'Choose the account used for this payment. Choose an active payment method.',
    );
    expect(trigger).toHaveAttribute('aria-invalid', 'true');

    await user.click(trigger);
    const bankOption = screen.getByRole('option', { name: /Bank account/ });
    const cashOption = screen.getByRole('option', { name: /Cash/ });
    expect(cashOption).toHaveAttribute('aria-disabled', 'true');
    expect(bankOption).toHaveTextContent('Current account ending in 1234');

    await user.click(bankOption);

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(trigger).toHaveTextContent('Bank account');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('forwards hover and focus-visible states to the trigger', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select
        error="Choose an active payment method."
        getItem={getItem}
        items={choices}
        label="Payment method"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Payment method' });
    expect(trigger).toHaveAttribute('data-invalid', 'true');

    await user.hover(trigger);
    expect(trigger).toHaveAttribute('data-hovered', 'true');

    await user.tab();
    expect(trigger).toHaveAttribute('data-focus-visible', 'true');
  });

  it('focuses the trigger when the visible label is clicked', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select getItem={getItem} items={choices} label="Payment method" />,
    );

    const trigger = screen.getByRole('button', { name: 'Payment method' });
    await user.click(screen.getByText('Payment method', { selector: 'span' }));

    expect(trigger).toHaveFocus();
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: (typeof choices)[number] | null) => void>();

    function ControlledSelect() {
      const [value, setValue] = useState<(typeof choices)[number] | null>(null);

      return (
        <Select
          getItem={getItem}
          items={choices}
          label="Payment method"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledSelect />);
    const trigger = screen.getByRole('button', { name: 'Payment method' });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Bank account/ }));

    expect(onChange).toHaveBeenCalledWith(choices[0]);
    expect(trigger).toHaveTextContent('Bank account');
  });

  it('supports an uncontrolled default value', () => {
    renderBreeze(
      <Select
        defaultValue={choices[0]}
        getItem={getItem}
        items={choices}
        label="Payment method"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Bank account Payment method' }),
    ).toHaveTextContent('Bank account');
  });

  it('retains a default key while async items are loading', async () => {
    const pendingChoice = { id: 'pending', label: 'Pending' };
    const { rerender } = renderBreeze(
      <Select
        defaultValue={pendingChoice}
        getItem={(item) => item}
        items={[]}
        label="Payment method"
        loading
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Payment method' });
    expect(trigger).not.toHaveTextContent('Pending');

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          defaultValue={pendingChoice}
          getItem={(item) => item}
          items={[pendingChoice]}
          label="Payment method"
        />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Pending');
    });
    expect(document.querySelector('select')).toHaveValue('pending');
  });

  it('submits and resets its hidden native form control', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: ItemDescriptor | null) => void>();

    renderBreeze(
      <form aria-label="Payment form">
        <Select
          defaultValue={enabledChoices[0]}
          getItem={getEnabledItem}
          items={enabledChoices}
          label="Payment method"
          name="payment"
          onChange={onChange}
        />
      </form>,
    );

    const form = screen.getByRole('form');
    const trigger = screen.getByRole('button', {
      name: 'Bank account Payment method',
    });
    expect(new FormData(form as HTMLFormElement).get('payment')).toBe('bank');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    expect(new FormData(form as HTMLFormElement).get('payment')).toBe('cash');

    onChange.mockClear();
    fireEvent.reset(form);

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Bank account');
      expect(new FormData(form as HTMLFormElement).get('payment')).toBe('bank');
    });
    expect(onChange).toHaveBeenCalledWith(enabledChoices[0]);
  });

  it('keeps read-only controls focusable without opening or changing', async () => {
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

    const trigger = screen.getByRole('button', {
      name: 'Bank account Payment method',
    });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toHaveAttribute('aria-readonly');
    expect(trigger).not.toHaveAttribute('aria-required');
    expect(trigger).not.toBeDisabled();

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    await user.click(trigger);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(new FormData(screen.getByRole('form')).get('payment')).toBe('bank');
  });

  it('closes an open menu when read-only changes and stays closed', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <Select getItem={getItem} items={choices} label="Payment method" />,
    );

    const trigger = screen.getByRole('button', { name: 'Payment method' });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeVisible();

    rerender(
      <BreezeProvider locale="en-GB">
        <Select
          getItem={getItem}
          items={choices}
          label="Payment method"
          readOnly
        />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    rerender(
      <BreezeProvider locale="en-GB">
        <Select getItem={getItem} items={choices} label="Payment method" />
      </BreezeProvider>,
    );

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disables RAC hidden selection while preserving the live form value', async () => {
    const user = userEvent.setup();

    function ReadOnlySelectHarness() {
      const [readOnly, setReadOnly] = useState(false);

      return (
        <form aria-label="Payment form">
          <button type="button" onClick={() => setReadOnly(true)}>
            Set read-only
          </button>
          <Select
            defaultValue={enabledChoices[0]}
            getItem={getEnabledItem}
            items={enabledChoices}
            label="Payment method"
            name="payment"
            readOnly={readOnly}
          />
        </form>
      );
    }

    renderBreeze(<ReadOnlySelectHarness />);

    const form = screen.getByRole('form');
    const trigger = screen.getByRole('button', {
      name: 'Bank account Payment method',
    });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Cash/ }));
    expect(trigger).toHaveTextContent('Cash');

    await user.click(screen.getByRole('button', { name: 'Set read-only' }));

    const hiddenSelect = document.querySelector<HTMLSelectElement>(
      'select[name="payment"]',
    );
    expect(hiddenSelect).toBeDisabled();
    expect(trigger).toHaveTextContent('Cash');
    expect(new FormData(form as HTMLFormElement).get('payment')).toBe('cash');
  });

  it.each(['disabled', 'loading'] as const)(
    'omits the read-only form value when %s',
    (state) => {
      renderBreeze(
        <form aria-label="Payment form">
          <Select
            defaultValue={enabledChoices[0]}
            getItem={getEnabledItem}
            items={enabledChoices}
            label="Payment method"
            name="payment"
            readOnly
            disabled={state === 'disabled'}
            loading={state === 'loading'}
          />
        </form>,
      );

      expect(new FormData(screen.getByRole('form')).get('payment')).toBeNull();
    },
  );

  it('preserves the Breeze overlay boundary', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Select getItem={getItem} items={choices} label="Payment method" />,
    );

    await user.click(screen.getByRole('button', { name: 'Payment method' }));

    const listbox = screen.getByRole('listbox');
    const overlay = listbox.closest('[data-breeze-overlay]');
    expect(overlay).toHaveAttribute('data-breeze-overlay', 'popover');
    expect(overlay).toHaveAttribute('data-breeze-topmost', 'true');
    expect(overlay?.closest('[data-breeze-portal]')).toBeInTheDocument();
  });
});
