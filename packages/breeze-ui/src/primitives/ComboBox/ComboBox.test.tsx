import { fireEvent, screen, within } from '@testing-library/react';
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

const getItem = (item: (typeof suppliers)[number]) => item;
type Supplier = (typeof suppliers)[number];
type SupplierValue = (typeof suppliers)[number] | string | null;

function EchoingCustomComboBox() {
  const [value, setValue] = useState<SupplierValue>(null);

  return (
    <ComboBox<(typeof suppliers)[number]>
      allowsCustomValue
      getItem={getItem}
      items={suppliers}
      label="Supplier"
      onChange={setValue}
      value={value}
    />
  );
}

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
const nonCustomCallbackComboBox = (
  <ComboBox<(typeof suppliers)[number]>
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    onChange={(value: Supplier | null) => value}
  />
);
const customComboBox = (
  <ComboBox<(typeof suppliers)[number]>
    allowsCustomValue
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    onChange={(value: Supplier | string | null) => value}
    value="New supplier"
  />
);
const customDefaultValueComboBox = (
  <ComboBox<(typeof suppliers)[number]>
    allowsCustomValue
    defaultValue="New supplier"
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    onChange={(value: Supplier | string | null) => value}
  />
);
const nonCustomStringValueComboBox = (
  // @ts-expect-error Custom strings require allowsCustomValue.
  <ComboBox<(typeof suppliers)[number]>
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    value="New supplier"
  />
);
const nonCustomStringDefaultValueComboBox = (
  // @ts-expect-error Custom strings require allowsCustomValue.
  <ComboBox<(typeof suppliers)[number]>
    defaultValue="New supplier"
    getItem={getItem}
    items={suppliers}
    label="Supplier"
  />
);
const stringOnlyOnChange = (value: string) => value;
const nonCustomStringCallbackComboBox = (
  <ComboBox<(typeof suppliers)[number]>
    getItem={getItem}
    items={suppliers}
    label="Supplier"
    // @ts-expect-error Non-custom callbacks receive the item or null.
    onChange={stringOnlyOnChange}
  />
);

expectTypeOf(controlledComboBox).toBeObject();
expectTypeOf(uncontrolledComboBox).toBeObject();
expectTypeOf(mixedComboBox).toBeObject();
expectTypeOf(nonCustomCallbackComboBox).toBeObject();
expectTypeOf(customComboBox).toBeObject();
expectTypeOf(customDefaultValueComboBox).toBeObject();
expectTypeOf(nonCustomStringValueComboBox).toBeObject();
expectTypeOf(nonCustomStringDefaultValueComboBox).toBeObject();
expectTypeOf(nonCustomStringCallbackComboBox).toBeObject();

type NonCustomComboBoxChange = Extract<
  ComboBoxProps<Supplier>,
  { allowsCustomValue?: false }
>['onChange'];
type CustomComboBoxChange = Extract<
  ComboBoxProps<Supplier>,
  { allowsCustomValue: true }
>['onChange'];

expectTypeOf<NonCustomComboBoxChange>().toMatchTypeOf<
  ((value: Supplier | null) => void) | undefined
>();
expectTypeOf<CustomComboBoxChange>().toMatchTypeOf<
  ((value: Supplier | string | null) => void) | undefined
>();

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

  it('treats restricted string values as descriptor-backed items', () => {
    const drinks = ['Tea', 'Coffee'];
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: `${item} drink`,
    });
    const onChange = vi.fn<(value: string | null) => void>();

    renderBreeze(
      <form>
        <ComboBox
          getItem={getDrinkItem}
          items={drinks}
          label="Drink"
          name="drink"
          onChange={onChange}
          value="Tea"
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    expect(input).toHaveValue('Tea drink');
    expect(
      new FormData(document.querySelector('form') as HTMLFormElement).get(
        'drink',
      ),
    ).toBe('tea');
  });

  it('uses descriptors for off-list restricted controlled strings', () => {
    const drinks = ['Tea', 'Coffee'];
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: item === 'Remote' ? 'Remote drink' : `${item} drink`,
    });

    renderBreeze(
      <form>
        <ComboBox
          getItem={getDrinkItem}
          items={drinks}
          label="Drink"
          name="drink"
          onChange={() => undefined}
          value="Remote"
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    expect(input).toHaveValue('Remote drink');
    expect(
      new FormData(document.querySelector('form') as HTMLFormElement).get(
        'drink',
      ),
    ).toBe('remote');
  });

  it('uses descriptors for off-list restricted default strings', () => {
    const drinks = ['Tea', 'Coffee'];
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: item === 'Remote' ? 'Remote drink' : `${item} drink`,
    });

    renderBreeze(
      <form>
        <ComboBox
          defaultValue="Remote"
          getItem={getDrinkItem}
          items={drinks}
          label="Drink"
          name="drink"
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    expect(input).toHaveValue('Remote drink');
    expect(
      new FormData(document.querySelector('form') as HTMLFormElement).get(
        'drink',
      ),
    ).toBe('remote');
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

  it('keeps accepted custom text after editing a selected suggestion', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'New supplier');
    await user.tab();

    expect(input).toHaveValue('New supplier');
    expect(onChange).toHaveBeenLastCalledWith('New supplier');
    expect(onChange.mock.calls.at(-1)).not.toEqual([null]);
    expect(
      onChange.mock.calls.filter(([value]) => value === null),
    ).toHaveLength(1);
  });

  it('keeps accepted custom text after pressing Enter', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'New supplier');
    await user.keyboard('{Enter}');

    expect(input).toHaveValue('New supplier');
    expect(onChange).toHaveBeenLastCalledWith('New supplier');
    expect(
      onChange.mock.calls.filter(([value]) => value === null),
    ).toHaveLength(1);
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

  it.each([
    ['disabled', { disabled: true, loading: false, readOnly: false }],
    ['readOnly', { disabled: false, loading: false, readOnly: true }],
    ['loading', { disabled: false, loading: true, readOnly: false }],
  ] as const)(
    'closes open suggestions when becoming %s',
    async (_, { disabled, loading, readOnly }) => {
      const user = userEvent.setup();
      const { rerender } = renderBreeze(
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={() => undefined}
        />,
      );

      const input = screen.getByRole('combobox', { name: 'Supplier' });
      await user.type(input, 'Acme');
      expect(screen.getByRole('listbox')).toBeVisible();

      rerender(
        <BreezeProvider locale="en-GB">
          <ComboBox
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            onChange={() => undefined}
            disabled={disabled}
            loading={loading}
            readOnly={readOnly}
          />
        </BreezeProvider>,
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    },
  );

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

  it('keeps the visible value synchronized across controlled item transitions', () => {
    const { rerender } = renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={() => undefined}
        value={suppliers[0]}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Acme Supplies');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={() => undefined}
          value={suppliers[1]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Brass & Co');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={() => undefined}
          value={suppliers[0]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Acme Supplies');
  });

  it('allows multi-character filtering from a controlled selected item', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={suppliers[0]}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Brass');

    expect(input).toHaveValue('Brass');
    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: /Brass & Co/,
      }),
    ).toBeVisible();
    expect(
      within(screen.getByRole('listbox')).queryByRole('option', {
        name: /Acme Supplies/,
      }),
    ).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('keeps filtering while controlled custom text echoes through onChange', async () => {
    const user = userEvent.setup();

    renderBreeze(<EchoingCustomComboBox />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.type(input, 'Brass');

    expect(input).toHaveValue('Brass');
    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: /Brass & Co/,
      }),
    ).toBeVisible();
    expect(
      within(screen.getByRole('listbox')).queryByRole('option', {
        name: /Acme Supplies/,
      }),
    ).not.toBeInTheDocument();
  });

  it('replaces a controlled input draft when the selected item changes', async () => {
    const user = userEvent.setup();
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

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Br');
    expect(input).toHaveValue('Br');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={suppliers[1]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Brass & Co');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('does not report a selected label when reselecting the current item', async () => {
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
        value={suppliers[0]}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Acme');
    onChange.mockClear();

    await user.click(screen.getByRole('option', { name: /Acme Supplies/ }));

    expect(onChange).not.toHaveBeenCalledWith('Acme Supplies');
    expect(onChange.mock.calls.every(([value]) => value === suppliers[0])).toBe(
      true,
    );
    expect(input).toHaveValue('Acme Supplies');
  });

  it('allows custom text matching an old uncontrolled default label', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        allowsCustomValue
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    await user.clear(input);
    await user.type(input, 'Acme Supplies');

    expect(input).toHaveValue('Acme Supplies');
    expect(onChange).toHaveBeenLastCalledWith('Acme Supplies');
    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: /Acme Supplies/,
      }),
    ).toBeVisible();
    expect(
      within(screen.getByRole('listbox')).queryByRole('option', {
        name: /Brass & Co/,
      }),
    ).not.toBeInTheDocument();
  });

  it('resets filtering across successive controlled custom-text transitions', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <ComboBox
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={() => undefined}
        value="Alpha"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    fireEvent.input(input, { target: { value: 'Brass' } });

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={() => undefined}
          value="Beta"
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Beta');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Acme Supplies/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /Brass & Co/ })).toBeVisible();

    fireEvent.input(input, { target: { value: 'Closed' } });

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={() => undefined}
          value="Gamma"
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Gamma');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Acme Supplies/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /Brass & Co/ })).toBeVisible();
  });

  it('displays the descriptor label for a controlled object missing from items', () => {
    const missingSupplier = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={() => undefined}
        value={missingSupplier}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Remote supplier');
    expect(input).not.toHaveValue('[object Object]');
  });

  it('submits the descriptor id for a missing controlled object', () => {
    const missingSupplier = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };

    renderBreeze(
      <form>
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={() => undefined}
          value={missingSupplier}
        />
      </form>,
    );

    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    expect(new FormData(form as HTMLFormElement).get('supplier')).toBe(
      'remote',
    );
  });

  it('does not report synchronization for a missing controlled object', () => {
    const missingValue = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };
    const updatedValue = {
      ...missingValue,
      label: 'Updated remote supplier',
    };
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

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={missingValue}
        />
      </BreezeProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Remote supplier');
    fireEvent.input(input, { target: { value: 'Remote supplier' } });
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={updatedValue}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Updated remote supplier');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reports clearing an uncontrolled non-custom value as null', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('reports clearing a controlled non-custom value as null', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={suppliers[0]}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it.each([
    { disabled: true, state: 'disabled' },
    { loading: true, state: 'loading' },
  ])(
    'excludes a named $state ComboBox from FormData',
    ({ disabled, loading }) => {
      renderBreeze(
        <form>
          <ComboBox
            defaultValue={suppliers[0]}
            disabled={disabled}
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            loading={loading}
            name="supplier"
          />
        </form>,
      );

      const form = document.querySelector('form');
      expect(form).not.toBeNull();
      expect(new FormData(form as HTMLFormElement).has('supplier')).toBe(false);
    },
  );

  it('includes a named readOnly ComboBox in FormData', () => {
    renderBreeze(
      <form>
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          readOnly
        />
      </form>,
    );

    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    expect(new FormData(form as HTMLFormElement).get('supplier')).toBe('acme');
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
