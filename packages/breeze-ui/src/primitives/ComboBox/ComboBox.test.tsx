import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const getItem = (item: (typeof suppliers)[number]) => item;

expectTypeOf<ComboBoxProps<(typeof suppliers)[number]>>().not.toHaveProperty(
  'className',
);
expectTypeOf<ComboBoxProps<(typeof suppliers)[number]>>().not.toHaveProperty(
  'style',
);
expectTypeOf<ComboBoxProps<(typeof suppliers)[number]>>().not.toHaveProperty(
  'slot',
);
expectTypeOf<ComboBoxProps<(typeof suppliers)[number]>>().not.toHaveProperty(
  'render',
);
expectTypeOf<ItemDescriptor>().not.toHaveProperty('children');

const controlledComboBox = (
  <ComboBox
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    onChange={() => undefined}
    value={suppliers[0]}
  />
);
const uncontrolledComboBox = (
  <ComboBox
    defaultValue={suppliers[0]}
    getItem={getItem}
    items={suppliers}
    label="Supplier"
  />
);
const mixedComboBox = (
  // @ts-expect-error Controlled and uncontrolled value props are exclusive.
  <ComboBox
    defaultValue={suppliers[0]}
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    onChange={() => undefined}
    value={suppliers[0]}
  />
);

expectTypeOf(controlledComboBox).toBeObject();
expectTypeOf(uncontrolledComboBox).toBeObject();
expectTypeOf(mixedComboBox).toBeObject();

describe('ComboBox', () => {
  it('filters suggestions while typing and reports selected items', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <form id="supplier-form">
        <ComboBox
          autoComplete="organization"
          description="Choose a saved supplier or enter a new name."
          form="supplier-form"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });

    expect(input).toHaveAccessibleDescription(
      'Choose a saved supplier or enter a new name.',
    );
    expect(input).toHaveAttribute('autocomplete', 'organization');
    expect(input).toHaveAttribute('form', 'supplier-form');

    await user.type(input, 'Acme');

    const listbox = screen.getByRole('listbox');
    const overlay = listbox.closest('[data-breeze-overlay]');

    expect(overlay).toHaveAttribute('data-breeze-overlay', 'popover');
    expect(overlay).toHaveAttribute('data-breeze-topmost', 'true');
    expect(overlay?.closest('[data-breeze-portal]')).toBeInTheDocument();

    expect(
      within(listbox).getByRole('option', { name: /Acme Supplies/ }),
    ).toBeVisible();
    expect(
      within(listbox).queryByRole('option', { name: /Brass & Co/ }),
    ).not.toBeInTheDocument();

    await user.click(
      within(listbox).getByRole('option', { name: /Acme Supplies/ }),
    );

    expect(onChange).toHaveBeenLastCalledWith(suppliers[0]);
    expect(input).toHaveValue('Acme Supplies');
  });

  it('matches accents with locale-aware filtering and supports string items', async () => {
    const user = userEvent.setup();
    const items = ['Café', 'Tea'];
    const getStringItem = (item: string) => ({ id: item, label: item });

    renderBreeze(
      <ComboBox
        getItem={getStringItem}
        items={items}
        label="Drink"
        placeholder="Search drinks"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    await user.type(input, 'Cafe');

    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: 'Café',
      }),
    ).toBeVisible();
  });

  it('keeps free text distinct from string items', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string | null) => void>();
    const items = ['Café', 'Tea'];
    const getStringItem = (item: string) => ({ id: item, label: item });

    renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getStringItem}
        items={items}
        label="Drink"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    await user.type(input, 'Juice');

    expect(onChange).toHaveBeenLastCalledWith('Juice');
    expect(input).toHaveValue('Juice');
  });

  it('supports free text while keeping suggestions available', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        placeholder="Search or enter a name"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });

    await user.type(input, 'New supplier');

    expect(onChange).toHaveBeenLastCalledWith('New supplier');
    expect(input).toHaveValue('New supplier');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not report a selected label as trailing custom text', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'Acme');
    onChange.mockClear();

    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(onChange).not.toHaveBeenCalledWith('Acme Supplies');
  });

  it('exposes disabled descriptors and derives invalid semantics from error', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox
        error="Choose an active supplier."
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        required
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });

    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('Choose an active supplier.');

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    expect(
      screen.getByRole('option', { name: /Closed supplier/ }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps the input shape while loading and prevents interaction', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox
        description="Shown beneath the supplier."
        error="The supplier could not be loaded."
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        loading
        onChange={() => undefined}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });

    expect(input).toBeDisabled();
    expect(input).not.toBeInvalid();
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.queryByText('Shown beneath the supplier.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('The supplier could not be loaded.'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();

    await user.type(input, 'changed');
  });

  it('keeps selection identity by descriptor id and clears controlled values', () => {
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={suppliers[0]}
      />,
    );

    const recreatedSuppliers = suppliers.map((supplier) => ({ ...supplier }));
    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={(item) => item}
          items={recreatedSuppliers}
          label="Supplier"
          onChange={onChange}
          value={recreatedSuppliers[0]}
        />
      </BreezeProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Acme Supplies');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={(item) => item}
          items={recreatedSuppliers}
          label="Supplier"
          onChange={onChange}
          value={null}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('');
  });

  it('does not report controlled item synchronization as custom text', () => {
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={null}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={suppliers[0]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Acme Supplies');
    expect(onChange).not.toHaveBeenCalled();
  });
});
