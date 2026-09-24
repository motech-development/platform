import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { BadgeProps } from '../Badge/Badge';
import type { ItemDescriptor } from '../Collection/item.types';
import { ComboBox, type ComboBoxProps } from './ComboBox';

const suppliers = [
  {
    badge: {
      children: 'Preferred',
      variant: 'positive',
    } satisfies Pick<BadgeProps, 'aria-label' | 'children' | 'variant'>,
    description: 'Preferred supplier',
    icon: 'building',
    id: 'acme',
    label: 'Acme Supplies',
  },
  {
    id: 'brass',
    label: 'Brass & Co',
  },
  {
    disabled: true,
    id: 'closed',
    label: 'Closed supplier',
  },
] satisfies ItemDescriptor[];

type Supplier = (typeof suppliers)[number];
type SupplierValue = Supplier | string | null;

const getItem = (item: Supplier) => item;

expectTypeOf<ComboBoxProps<Supplier>>().not.toHaveProperty('className');
expectTypeOf<ComboBoxProps<Supplier>>().not.toHaveProperty('style');
expectTypeOf<ComboBoxProps<Supplier>>().not.toHaveProperty('slot');
expectTypeOf<ItemDescriptor>().not.toHaveProperty('children');

describe('ComboBox', () => {
  it('renders an accessible input and trigger', () => {
    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        placeholder="Search suppliers"
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveAttribute(
      'placeholder',
      'Search suppliers',
    );
    expect(
      screen.getByRole('button', { name: /Show suggestions/ }),
    ).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('filters suggestions as the user types', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        placeholder="Search suppliers"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'brass');

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByRole('option', { name: /Brass & Co/ })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: /Acme Supplies/ }),
    ).not.toBeInTheDocument();
  });

  it('keeps surviving suggestions stable when items are reordered and removed', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <ComboBox getItem={getItem} items={suppliers} label="Supplier" />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={[suppliers[2], suppliers[0]]}
          label="Supplier"
        />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: /Closed supplier/ }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole('option', { name: /Acme Supplies/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /Brass & Co/ }),
    ).not.toBeInTheDocument();
  });

  it('renders descriptor content and disabled suggestions', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox getItem={getItem} items={suppliers} label="Supplier" />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    expect(
      screen.getByRole('option', { name: /Preferred supplier/ }),
    ).toHaveTextContent('Preferred');
    expect(
      screen.getByRole('option', { name: /Closed supplier/ }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('reports the selected item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));

    expect(onChange).toHaveBeenCalledWith(suppliers[1]);
    expect(screen.getByRole('combobox')).toHaveValue('Brass & Co');
  });

  it('supports a default item', () => {
    renderBreeze(
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
      'Acme Supplies',
    );
  });

  it('supports string items without treating them as custom values', async () => {
    const user = userEvent.setup();
    const items = ['Acme', 'Brass'];
    const onChange = vi.fn<(value: string | null) => void>();

    renderBreeze(
      <ComboBox
        defaultValue="Brass"
        getItem={(item) => ({ id: item.toLowerCase(), label: item })}
        items={items}
        label="Supplier"
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
      'Brass',
    );
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: 'Acme' }));

    expect(onChange).toHaveBeenCalledWith('Acme');
  });

  it('supports controlled item values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    function ControlledComboBox() {
      const [value, setValue] = useState<Supplier | null>(null);

      return (
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledComboBox />);
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(screen.getByRole('combobox')).toHaveValue('Acme Supplies');
  });

  it('accepts controlled custom text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: SupplierValue) => void>();

    function ControlledCustomComboBox() {
      const [value, setValue] = useState<SupplierValue>(null);

      return (
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledCustomComboBox />);
    await user.type(screen.getByRole('combobox', { name: 'Supplier' }), 'New');

    expect(onChange).toHaveBeenLastCalledWith('New');
    expect(screen.getByRole('combobox')).toHaveValue('New');
  });

  it('reports a selected item from a controlled custom combobox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: SupplierValue) => void>();

    function ControlledCustomComboBox() {
      const [value, setValue] = useState<SupplierValue>(null);

      return (
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          value={value}
        />
      );
    }

    renderBreeze(<ControlledCustomComboBox />);
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    expect(onChange).toHaveBeenLastCalledWith(suppliers[0]);
    expect(screen.getByRole('combobox')).toHaveValue('Acme Supplies');
  });

  it('keeps custom text as the final value after editing a suggestion', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: SupplierValue) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.type(input, 'New supplier');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith('New supplier');
    });
    expect(
      onChange.mock.calls.filter(([value]) => value === null),
    ).toHaveLength(1);
  });

  it('keeps edited custom text after changing a suggestion without clearing it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: SupplierValue) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, ' - updated');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith('Acme Supplies - updated');
    });
    expect(onChange).not.toHaveBeenCalledWith(null);
  });

  it('accepts an uncontrolled custom default and custom text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: SupplierValue) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        defaultValue="Existing supplier"
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Existing supplier');
    await user.clear(input);
    await user.type(input, 'New supplier');

    expect(onChange).toHaveBeenLastCalledWith('New supplier');
  });

  it('does not accept custom text when allowsCustomValue is false', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'Unknown');
    fireEvent.blur(input);

    await waitFor(() => expect(input).toHaveValue(''));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('submits its value in a form and resets with the form', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
        />
      </form>,
    );

    const form = screen.getByRole('form', { name: 'Supplier form' });
    expect(new FormData(form as HTMLFormElement).get('supplier')).toBe('acme');

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    expect(new FormData(form as HTMLFormElement).get('supplier')).toBe('brass');

    fireEvent.reset(form);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('Acme Supplies');
      expect(new FormData(form as HTMLFormElement).get('supplier')).toBe(
        'acme',
      );
    });
  });

  it('honours disabled, loading and read-only states', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <ComboBox
        disabled
        getItem={getItem}
        items={suppliers}
        label="Supplier"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Show suggestions/ }),
    ).toBeDisabled();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          loading
        />
      </BreezeProvider>,
    );
    expect(screen.getByRole('combobox', { name: 'Supplier' })).toBeDisabled();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          readOnly
        />
      </BreezeProvider>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('readonly');
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('announces descriptions and errors', () => {
    renderBreeze(
      <ComboBox
        description="Choose a saved supplier."
        error="Enter a supplier."
        getItem={getItem}
        items={suppliers}
        label="Supplier"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      'Choose a saved supplier. Enter a supplier.',
    );
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('preserves the Breeze overlay boundary', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox getItem={getItem} items={suppliers} label="Supplier" />,
    );

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    const listbox = screen.getByRole('listbox');
    const overlay = listbox.closest('[data-breeze-overlay]');
    expect(overlay).toHaveAttribute('data-breeze-overlay', 'popover');
    expect(overlay).toHaveAttribute('data-breeze-topmost', 'true');
    expect(overlay?.closest('[data-breeze-portal]')).toBeInTheDocument();
  });
});
