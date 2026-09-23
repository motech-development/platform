import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { startTransition, Suspense, useState } from 'react';
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

  it('applies the public id to the native input', () => {
    renderBreeze(
      <ComboBox
        getItem={getItem}
        id="supplier-input"
        items={suppliers}
        label="Supplier"
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveAttribute(
      'id',
      'supplier-input',
    );
  });

  it('commits an exact non-custom item from browser autofill only', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'Acme Supplies');

    expect(onChange).not.toHaveBeenCalledWith(suppliers[0]);
    expect(new FormData(document.forms[0]).get('supplier')).toBe('');

    await user.clear(input);
    onChange.mockClear();

    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: 'Acme Supplies' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(input).toHaveValue('Acme Supplies');
    expect(new FormData(document.forms[0]).get('supplier')).toBe('acme');
  });

  it('commits a unique non-custom item from its browser autofill id', () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: suppliers[0].id },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(input).toHaveValue(suppliers[0].label);
    expect(new FormData(document.forms[0]).get('supplier')).toBe(
      suppliers[0].id,
    );
  });

  it('normalizes an autofilled id when the item is already selected', () => {
    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: suppliers[0].id },
    });

    expect(input).toHaveValue(suppliers[0].label);
    expect(new FormData(document.forms[0]).get('supplier')).toBe(
      suppliers[0].id,
    );
  });

  it('deduplicates input and change handling for one autofill event', () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Supplier',
    });
    input.value = 'Acme Supplies';
    act(() => {
      input.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType: 'insertReplacementText',
        }),
      );
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(new FormData(document.forms[0]).get('supplier')).toBe('acme');
  });

  it('does not autofill an unknown descriptor label', () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: 'Unknown supplier' },
    });

    expect(onChange).not.toHaveBeenCalledWith(suppliers[0]);
    expect(onChange).not.toHaveBeenCalledWith(suppliers[1]);
    expect(new FormData(document.forms[0]).get('supplier')).toBe('');
  });

  it('does not autofill a disabled descriptor label', () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: 'Closed supplier' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(new FormData(document.forms[0]).get('supplier')).toBe('');
  });

  it('does not autofill a duplicate descriptor label', () => {
    const duplicateSuppliers = [
      { id: 'first', label: 'Shared supplier' },
      { id: 'second', label: 'Shared supplier' },
    ];
    const onChange =
      vi.fn<(value: (typeof duplicateSuppliers)[number] | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={(item) => item}
          items={duplicateSuppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: 'Shared supplier' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(new FormData(document.forms[0]).get('supplier')).toBe('');
  });

  it('resolves autofill items that are outside the active filter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          autoComplete="organization"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    fireEvent.input(input, { target: { value: 'Brass' } });
    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: /Brass & Co/,
      }),
    ).toBeVisible();
    onChange.mockClear();

    fireEvent.input(input, {
      inputType: 'insertReplacementText',
      target: { value: 'Acme Supplies' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    expect(input).toHaveValue('Acme Supplies');
    expect(new FormData(document.forms[0]).get('supplier')).toBe('acme');
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

  it('keeps an empty non-custom collection closed but allows custom entry', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <ComboBox
        getItem={(item: string) => ({ id: item, label: item })}
        items={[]}
        label="Drink"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    await user.click(input);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          getItem={(item: string) => ({ id: item, label: item })}
          items={[]}
          label="Drink"
        />
      </BreezeProvider>,
    );

    await user.click(input);
    await user.type(input, 'Juice');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('reopens the original collection after a query has no matches', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox getItem={getItem} items={suppliers} label="Supplier" />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'No matching supplier');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    const listbox = screen.getByRole('listbox');
    expect(
      within(listbox).getByRole('option', { name: /Acme Supplies/ }),
    ).toBeVisible();
    expect(
      within(listbox).getByRole('option', { name: /Brass & Co/ }),
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

  it('does not expose an off-list default in the suggestion list', async () => {
    const user = userEvent.setup();
    const drinks = ['Tea', 'Coffee'];
    const onChange = vi.fn<(value: string | null) => void>();
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: item === 'Remote' ? 'Remote drink' : `${item} drink`,
    });

    renderBreeze(
      <ComboBox
        defaultValue="Remote"
        getItem={getDrinkItem}
        items={drinks}
        label="Drink"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    const listbox = screen.getByRole('listbox');
    expect(
      within(listbox).getByRole('option', { name: 'Tea drink' }),
    ).toBeVisible();
    expect(
      within(listbox).queryByRole('option', { name: 'Remote drink' }),
    ).not.toBeInTheDocument();
    expect(input).toHaveValue('Remote drink');

    input.focus();
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    const activeDescendant = input.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    const activeOption = document.getElementById(activeDescendant as string);
    expect(activeOption).toBeInTheDocument();
    expect(activeOption).toHaveAttribute('role', 'option');
    expect(activeOption).not.toHaveTextContent('Remote drink');

    await user.keyboard('{Enter}');

    expect(onChange).not.toHaveBeenCalledWith('Remote');
  });

  it('keeps an off-list default out of an empty suggestion collection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string | null) => void>();
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: `${item} drink`,
    });

    renderBreeze(
      <ComboBox
        defaultValue="Remote"
        getItem={getDrinkItem}
        items={[]}
        label="Drink"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    expect(input).toHaveValue('Remote drink');

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    input.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(onChange).not.toHaveBeenCalledWith('Remote');
  });

  it('preserves an off-list uncontrolled default through focus and blur', async () => {
    const user = userEvent.setup();
    const drinks = ['Tea', 'Coffee'];
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: item === 'Remote' ? 'Remote drink' : `${item} drink`,
    });

    renderBreeze(
      <>
        <ComboBox
          defaultValue="Remote"
          getItem={getDrinkItem}
          items={drinks}
          label="Drink"
        />
        <button type="button">Next</button>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    expect(input).toHaveValue('Remote drink');

    await user.click(input);
    await user.tab();

    expect(input).toHaveValue('Remote drink');
  });

  it('reports an off-list uncontrolled default on form reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string | null) => void>();
    const drinks = ['Tea', 'Coffee'];
    const getDrinkItem = (item: string) => ({
      id: item.toLowerCase(),
      label: item === 'Remote' ? 'Remote drink' : `${item} drink`,
    });

    renderBreeze(
      <form aria-label="Drink form">
        <ComboBox
          defaultValue="Remote"
          getItem={getDrinkItem}
          items={drinks}
          label="Drink"
          name="drink"
          onChange={onChange}
        />
        <button type="button">Next</button>
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Drink' });
    await user.clear(input);
    onChange.mockClear();

    fireEvent.reset(document.forms[0]);

    await waitFor(() => {
      expect(input).toHaveValue('Remote drink');
      expect(onChange).toHaveBeenLastCalledWith('Remote');
    });
  });

  it('does not emit when an unchanged uncontrolled value is reset', async () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.reset(document.forms[0]);

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Acme Supplies');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies a form reset before returning and preserves later input', async () => {
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

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    form.reset();

    expect(input).toHaveValue('Acme Supplies');
    expect(new FormData(form).get('supplier')).toBe('acme');

    fireEvent.input(input, { target: { value: 'Later query' } });

    expect(input).toHaveValue('Later query');
    await act(async () => {
      await Promise.resolve();
    });
    expect(input).toHaveValue('Later query');
    expect(new FormData(form).get('supplier')).toBe('acme');
  });

  it('applies an accepted stopped-propagation reset before form.reset returns', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form
        aria-label="Supplier form"
        onResetCapture={(event) => event.stopPropagation()}
      >
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    form.reset();

    expect(input).toHaveValue('Acme Supplies');
    expect(new FormData(form).get('supplier')).toBe('acme');

    fireEvent.input(input, { target: { value: 'Later query' } });

    expect(input).toHaveValue('Later query');

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Later query');
    expect(new FormData(form).get('supplier')).toBe('acme');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(suppliers[0]);

    form.reset();

    expect(input).toHaveValue('Acme Supplies');

    fireEvent.input(input, { target: { value: '' } });

    expect(input).toHaveValue('');

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('restores a canceled stopped-propagation reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form
        aria-label="Supplier form"
        onResetCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    form.reset();

    expect(input).toHaveValue('Acme Supplies');

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Brass & Co');
    expect(new FormData(form).get('supplier')).toBe('brass');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('preserves an open menu when a stopped-propagation reset is canceled', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form
        aria-label="Supplier form"
        onResetCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
        />
      </form>,
    );

    const form = document.forms[0];
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    form.reset();

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('preserves the filtered query when an open reset is canceled', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <form
        aria-label="Supplier form"
        onResetCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.type(input, 'Brass');
    expect(input).toHaveValue('Brass');
    expect(screen.getByRole('option', { name: /Brass & Co/ })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: /Acme Supplies/ }),
    ).not.toBeInTheDocument();

    form.reset();

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Brass');
    expect(screen.getByRole('option', { name: /Brass & Co/ })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: /Acme Supplies/ }),
    ).not.toBeInTheDocument();
  });

  it('does not expose reset defaults before cancellation is known', async () => {
    const user = userEvent.setup();
    let formValueDuringReset: FormDataEntryValue | null = null;

    renderBreeze(
      <form
        aria-label="Supplier form"
        onReset={(event) => {
          formValueDuringReset = new FormData(event.currentTarget).get(
            'supplier',
          );
          event.preventDefault();
        }}
      >
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));

    form.reset();

    expect(formValueDuringReset).toBe('brass');
    await act(async () => {
      await Promise.resolve();
    });
    expect(input).toHaveValue('Brass & Co');
    expect(new FormData(form).get('supplier')).toBe('brass');
  });

  it('keeps newer custom text after a stopped-propagation reset', async () => {
    const user = userEvent.setup();
    let latestValue: SupplierValue = 'Initial supplier';
    const onChange = vi.fn<(value: SupplierValue) => void>((value) => {
      latestValue = value;
    });

    renderBreeze(
      <form
        aria-label="Supplier form"
        onResetCapture={(event) => event.stopPropagation()}
      >
        <ComboBox
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.type(input, 'Before reset');
    onChange.mockClear();

    form.reset();

    expect(input).toHaveValue('Initial supplier');

    fireEvent.input(input, { target: { value: 'New supplier' } });

    expect(input).toHaveValue('New supplier');
    expect(latestValue).toBe('New supplier');

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('New supplier');
    expect(latestValue).toBe('New supplier');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('New supplier');
  });

  it('does not swallow an empty edit after a successful form reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | string | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.type(input, 'Changed supplier');
    onChange.mockClear();

    form.reset();
    expect(input).toHaveValue('Initial supplier');

    onChange.mockClear();
    await user.clear(input);

    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('keeps an empty uncontrolled reset target as null', async () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();
    const undefinedSupplier = {
      id: 'undefined',
      label: 'Undefined supplier',
    } satisfies Supplier;

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          getItem={getItem}
          items={[undefinedSupplier]}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.reset(document.forms[0]);

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not reset an uncontrolled value when form reset is canceled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form
        aria-label="Supplier form"
        onReset={(event) => event.preventDefault()}
      >
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    fireEvent.reset(document.forms[0]);

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Brass & Co');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('aborts a queued reset when the combobox unmounts during reset', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    function ResettableComboBox() {
      const [isMounted, setIsMounted] = useState(true);

      return (
        <form aria-label="Supplier form" onReset={() => setIsMounted(false)}>
          {isMounted && (
            <ComboBox
              defaultValue={suppliers[0]}
              getItem={getItem}
              items={suppliers}
              label="Supplier"
              name="supplier"
              onChange={onChange}
            />
          )}
        </form>
      );
    }

    renderBreeze(<ResettableComboBox />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    fireEvent.reset(document.forms[0]);

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('aborts a queued reset when reset switches the combobox to controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    function ResettableComboBox() {
      const [isControlled, setIsControlled] = useState(false);

      return (
        <form
          aria-label="Supplier form"
          onResetCapture={(event) => {
            event.stopPropagation();
            setIsControlled(true);
          }}
        >
          {/* @ts-expect-error The test intentionally transitions this component between modes. */}
          <ComboBox
            defaultValue={suppliers[0]}
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            name="supplier"
            onChange={onChange}
            value={isControlled ? suppliers[1] : undefined}
          />
          <button type="button" onClick={() => setIsControlled(false)}>
            Use uncontrolled value
          </button>
        </form>
      );
    }

    renderBreeze(<ResettableComboBox />);

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    onChange.mockClear();

    fireEvent.reset(form);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
      'Brass & Co',
    );
    expect(input).toHaveValue('Brass & Co');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: 'Use uncontrolled value' }),
    );

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
      'Brass & Co',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the latest committed reset handler after a same-mode rerender', async () => {
    const user = userEvent.setup();
    const staleOnChange = vi.fn<(value: Supplier | null) => void>();
    const latestOnChange = vi.fn<(value: Supplier | null) => void>();

    function ResettableComboBox() {
      const [useLatestHandler, setUseLatestHandler] = useState(false);

      return (
        <form
          aria-label="Supplier form"
          onResetCapture={(event) => {
            event.stopPropagation();
            setUseLatestHandler(true);
          }}
        >
          <ComboBox
            defaultValue={suppliers[0]}
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            name="supplier"
            onChange={useLatestHandler ? latestOnChange : staleOnChange}
          />
        </form>
      );
    }

    renderBreeze(<ResettableComboBox />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    staleOnChange.mockClear();

    fireEvent.reset(document.forms[0]);

    await waitFor(() => expect(input).toHaveValue('Acme Supplies'));
    expect(staleOnChange).not.toHaveBeenCalled();
    expect(latestOnChange).toHaveBeenCalledTimes(1);
    expect(latestOnChange).toHaveBeenCalledWith(suppliers[0]);
  });

  it('restores and reports a changed uncontrolled custom default on form reset', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.type(input, 'Changed supplier');
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(input).toHaveValue('Initial supplier');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('Initial supplier');
    });

    onChange.mockClear();
    fireEvent.reset(form);

    await act(async () => {
      await Promise.resolve();
    });

    expect(input).toHaveValue('Initial supplier');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('restores and reports the initial custom default after defaultValue changes', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Supplier form">
          <ComboBox
            allowsCustomValue
            defaultValue="Updated supplier"
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            name="supplier"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Initial supplier');
    await user.clear(input);
    await user.type(input, 'Changed supplier');
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(input).toHaveValue('Initial supplier');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('Initial supplier');
    });
  });

  it('restores and reports changed custom text for a selected default on form reset', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          allowsCustomValue
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.clear(input);
    await user.type(input, 'Changed supplier');
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(input).toHaveValue('Acme Supplies');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(suppliers[0]);
    });
  });

  it('restores and reports a changed off-list custom object default on form reset', async () => {
    const user = userEvent.setup();
    const defaultSupplier = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          allowsCustomValue
          defaultValue={defaultSupplier}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const form = document.forms[0];
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Remote supplier');
    await user.clear(input);
    await user.type(input, 'Changed supplier');
    onChange.mockClear();

    fireEvent.reset(form);

    await waitFor(() => {
      expect(input).toHaveValue('Remote supplier');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(defaultSupplier);
    });
  });

  it('preserves an in-list uncontrolled selection through filtering and blur', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
        />
        <button type="button">Next</button>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Acme Supplies');

    await user.click(input);
    fireEvent.input(input, { target: { value: 'Brass' } });

    const listbox = screen.getByRole('listbox');
    expect(
      within(listbox).getByRole('option', { name: /Brass & Co/ }),
    ).toBeVisible();
    expect(
      within(listbox).queryByRole('option', { name: /Acme Supplies/ }),
    ).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    const activeDescendant = input.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    expect(
      document.getElementById(activeDescendant as string),
    ).not.toHaveTextContent('Acme Supplies');

    await user.keyboard('{Escape}');
    await user.tab();

    expect(input).toHaveValue('Acme Supplies');
  });

  it('preserves the live uncontrolled selection through filtering and escape', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    expect(onChange).toHaveBeenLastCalledWith(suppliers[1]);
    expect(new FormData(document.forms[0]).get('supplier')).toBe('brass');

    fireEvent.input(input, { target: { value: 'Acme' } });
    expect(
      within(screen.getByRole('listbox')).queryByRole('option', {
        name: /Brass & Co/,
      }),
    ).not.toBeInTheDocument();
    expect(input).toHaveValue('Acme');

    await user.keyboard('{Escape}');
    await user.tab();

    expect(input).toHaveValue('Brass & Co');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(new FormData(document.forms[0]).get('supplier')).toBe('brass');
  });

  it('preserves a live uncontrolled selection after its item is removed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();
    const { rerender } = renderBreeze(
      <form aria-label="Supplier form">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          name="supplier"
          onChange={onChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    await user.click(screen.getByRole('option', { name: /Brass & Co/ }));
    expect(new FormData(document.forms[0]).get('supplier')).toBe('brass');

    rerender(
      <BreezeProvider locale="en-GB">
        <form aria-label="Supplier form">
          <ComboBox
            getItem={getItem}
            items={[suppliers[0], suppliers[2]]}
            label="Supplier"
            name="supplier"
            onChange={onChange}
          />
        </form>
      </BreezeProvider>,
    );

    await user.click(input);
    await user.tab();

    expect(input).toHaveValue('Brass & Co');
    expect(new FormData(document.forms[0]).get('supplier')).toBe('brass');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('announces the number of filtered suggestions', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ComboBox getItem={getItem} items={suppliers} label="Supplier" />,
    );

    await user.type(
      screen.getByRole('combobox', { name: 'Supplier' }),
      ' Brass ',
    );

    await waitFor(() => {
      const liveLog = document.querySelector(
        '[data-live-announcer="true"] [aria-live="assertive"]',
      );
      const latestAnnouncement = liveLog?.lastElementChild;

      expect(latestAnnouncement).toHaveTextContent('1 option available.');
    });
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

  it('keeps an echoed custom string distinct from a matching item', async () => {
    const user = userEvent.setup();
    const items = ['GB', 'US'];
    const getStringItem = (item: string) => ({
      id: item,
      label: item === 'GB' ? 'United Kingdom' : 'United States',
    });

    function EchoingStringComboBox() {
      const [value, setValue] = useState<string | null>(null);

      return (
        <form aria-label="Country form">
          <ComboBox
            allowsCustomValue
            getItem={getStringItem}
            items={items}
            label="Country"
            name="country"
            onChange={setValue}
            value={value}
          />
        </form>
      );
    }

    renderBreeze(<EchoingStringComboBox />);

    const input = screen.getByRole('combobox', { name: 'Country' });
    await user.type(input, 'GB');

    expect(input).toHaveValue('GB');
    expect(new FormData(document.forms[0]).get('country')).toBe('GB');
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

  it.each([
    {
      expectedFormValue: 'Initial supplier',
      label: 'readOnly',
      props: { disabled: false, loading: false, readOnly: true },
    },
    {
      expectedFormValue: null,
      label: 'disabled',
      props: { disabled: true, loading: false, readOnly: false },
    },
    {
      expectedFormValue: null,
      label: 'loading',
      props: { disabled: false, loading: true, readOnly: false },
    },
  ] as const)(
    'ignores replacement events while $label',
    ({ expectedFormValue, props }) => {
      const onChange =
        vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();

      renderBreeze(
        <form aria-label="Supplier form">
          <ComboBox<Supplier>
            allowsCustomValue
            autoComplete="organization"
            defaultValue="Initial supplier"
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            name="supplier"
            onChange={onChange}
            disabled={props.disabled}
            loading={props.loading}
            readOnly={props.readOnly}
          />
        </form>,
      );

      const input = screen.getByRole('combobox', { name: 'Supplier' });
      fireEvent.input(input, {
        inputType: 'insertReplacementText',
        target: { value: 'Changed supplier' },
      });
      fireEvent.change(input, {
        inputType: 'insertReplacementText',
        target: { value: 'Changed supplier' },
      });

      expect(input).toHaveValue('Initial supplier');
      expect(onChange).not.toHaveBeenCalled();
      expect(new FormData(document.forms[0]).get('supplier')).toBe(
        expectedFormValue,
      );
    },
  );

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

  it('uses the shared touch target and read-only surface styles', () => {
    renderBreeze(
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        readOnly
      />,
    );

    const group = screen
      .getByRole('combobox', { name: 'Supplier' })
      .closest('[role="group"]');
    const trigger = screen.getByRole('button', { name: /Show suggestions/ });

    expect(group).toHaveClass(
      'breeze:any-pointer-coarse:min-block-breeze-tap',
      'breeze:bg-breeze-sunken',
    );
    expect(trigger).toHaveClass('breeze:place-items-center');
    expect(trigger).not.toHaveClass('breeze:block-size-full');
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

  it('retains a controlled non-custom query after an automatic no-match close', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <>
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={suppliers[0]}
        />
        <button type="button">Next</button>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'No matching supplier');

    expect(input).toHaveValue('No matching supplier');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(input).toHaveValue('Acme Supplies');
  });

  it('retains a controlled no-result draft when the value is null', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={null}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'No matching supplier');

    expect(input).toHaveValue('No matching supplier');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(input).toHaveValue('');
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

  it('preserves controlled custom text that matches an item id after blur', async () => {
    const user = userEvent.setup();
    const items = ['acme', 'brass'];
    const getCustomItem = (item: string) => ({
      id: item,
      label: item === 'acme' ? 'Acme supplier' : 'Brass supplier',
    });
    function ControlledCustomComboBox() {
      const [value, setValue] = useState<string | null>(null);

      return (
        <>
          <ComboBox
            allowsCustomValue
            getItem={getCustomItem}
            items={items}
            label="Supplier"
            onChange={setValue}
            value={value}
          />
          <button type="button">Next</button>
        </>
      );
    }

    renderBreeze(<ControlledCustomComboBox />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.type(input, 'acme');
    expect(input).toHaveValue('acme');

    await user.tab();

    expect(input).toHaveValue('acme');
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

  it('does not retain selection bookkeeping from an abandoned render', async () => {
    const user = userEvent.setup();
    let shouldSuspend = false;
    let didSuspend = false;
    const suspendedRender = Object.assign(new Error('Suspended render'), {
      then: () => undefined,
    });
    let startSuspendedRender = () => undefined;
    let restoreSelection = () => undefined;

    function Suspender() {
      if (shouldSuspend) {
        didSuspend = true;
        throw suspendedRender;
      }

      return null;
    }

    function SuspenseHarness() {
      const [value, setValue] = useState<Supplier>(suppliers[0]);
      startSuspendedRender = () => {
        shouldSuspend = true;
        startTransition(() => setValue(suppliers[1]));
      };
      restoreSelection = () => {
        shouldSuspend = false;
        setValue(suppliers[0]);
      };

      return (
        <Suspense fallback={<span>Loading selection</span>}>
          <ComboBox
            getItem={getItem}
            items={suppliers}
            label="Supplier"
            onChange={() => undefined}
            value={value}
          />
          <Suspender />
        </Suspense>
      );
    }

    renderBreeze(<SuspenseHarness />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Br');
    expect(input).toHaveValue('Br');

    act(startSuspendedRender);
    act(restoreSelection);

    expect(didSuspend).toBe(true);
    expect(input).toHaveValue('Br');
    expect(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: /Brass & Co/,
      }),
    ).toBeVisible();
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

  it('preserves a controlled off-list value when focus leaves', async () => {
    const user = userEvent.setup();
    const missingSupplier = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };
    const onChange = vi.fn<(value: Supplier | null) => void>();

    renderBreeze(
      <>
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={missingSupplier}
        />
        <button type="button">Next</button>
      </>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(missingSupplier);
    expect(onChange).not.toHaveBeenCalledWith(null);
  });

  it('preserves the live controlled off-list value when focus leaves', async () => {
    const user = userEvent.setup();
    const initialSupplier = {
      ...suppliers[0],
      id: 'remote',
      label: 'Remote supplier',
    };
    const replacementSupplier = {
      ...initialSupplier,
      label: 'Updated remote supplier',
    };
    const onChange = vi.fn<(value: Supplier | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value={initialSupplier}
      />,
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={replacementSupplier}
        />
      </BreezeProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(replacementSupplier);
  });

  it('restores the initial controlled off-list value on form reset', async () => {
    const user = userEvent.setup();
    const initialSupplier = { id: 'remote', label: 'Remote supplier' };
    const currentSupplier = { id: 'current', label: 'Current supplier' };

    function ControlledResetComboBox() {
      const [value, setValue] = useState(initialSupplier);

      return (
        <form aria-label="Supplier form">
          <ComboBox
            getItem={(item) => item}
            items={[currentSupplier]}
            label="Supplier"
            name="supplier"
            onChange={(nextValue) => {
              if (nextValue !== null) setValue(nextValue);
            }}
            value={value}
          />
          <button type="button" onClick={() => setValue(currentSupplier)}>
            Use current supplier
          </button>
        </form>
      );
    }

    renderBreeze(<ControlledResetComboBox />);

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(
      screen.getByRole('button', { name: 'Use current supplier' }),
    );
    expect(input).toHaveValue('Current supplier');

    fireEvent.reset(document.forms[0]);

    await waitFor(() => {
      expect(input).toHaveValue('Remote supplier');
      expect(new FormData(document.forms[0]).get('supplier')).toBe('remote');
    });
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

  it('reverts an uncontrolled draft when becoming readOnly', () => {
    const { rerender } = renderBreeze(
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={getItem}
        items={suppliers}
        label="Supplier"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, { target: { value: 'Brass' } });
    expect(input).toHaveValue('Brass');

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

    expect(input).toHaveValue('Acme Supplies');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Acme Supplies');
  });

  it('reverts a controlled draft when becoming readOnly', () => {
    const onChange = vi.fn<(value: Supplier | null) => void>();
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
    fireEvent.input(input, { target: { value: 'Brass' } });
    expect(input).toHaveValue('Brass');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
          value={suppliers[0]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Acme Supplies');

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          value={suppliers[0]}
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Acme Supplies');
  });

  it('does not emit custom text while discarding a readOnly draft', () => {
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
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
    fireEvent.input(input, { target: { value: 'Brass' } });
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox
          allowsCustomValue
          defaultValue={suppliers[0]}
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
        />
      </BreezeProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Acme Supplies');
  });

  it('preserves an uncontrolled custom value when becoming readOnly', () => {
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox<Supplier>
        allowsCustomValue
        defaultValue="Initial supplier"
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, { target: { value: 'Draft supplier' } });
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox<Supplier>
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
        />
      </BreezeProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Initial supplier');
  });

  it('preserves a committed uncontrolled custom value when becoming readOnly', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox<Supplier>
        allowsCustomValue
        defaultValue="Initial supplier"
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Committed supplier');
    await user.tab();

    expect(input).toHaveValue('Committed supplier');
    expect(onChange).toHaveBeenLastCalledWith('Committed supplier');

    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Stale draft');
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox<Supplier>
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
        />
      </BreezeProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Committed supplier');
  });

  it('preserves a custom value committed with Enter when becoming readOnly', async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(value: (typeof suppliers)[number] | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox<Supplier>
        allowsCustomValue
        defaultValue="Initial supplier"
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Entered supplier');
    await user.keyboard('{Enter}');

    expect(input).toHaveValue('Entered supplier');

    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Stale draft');
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox<Supplier>
          allowsCustomValue
          defaultValue="Initial supplier"
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
        />
      </BreezeProvider>,
    );

    expect(input).toHaveValue('Entered supplier');
  });

  it('reverts a controlled custom draft when becoming readOnly', () => {
    const onChange = vi.fn<(value: Supplier | string | null) => void>();
    const { rerender } = renderBreeze(
      <ComboBox<Supplier>
        allowsCustomValue
        getItem={getItem}
        items={suppliers}
        label="Supplier"
        onChange={onChange}
        value="Initial supplier"
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Supplier' });
    fireEvent.input(input, { target: { value: 'Draft supplier' } });
    onChange.mockClear();

    rerender(
      <BreezeProvider locale="en-GB">
        <ComboBox<Supplier>
          allowsCustomValue
          getItem={getItem}
          items={suppliers}
          label="Supplier"
          onChange={onChange}
          readOnly
          value="Initial supplier"
        />
      </BreezeProvider>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Initial supplier');
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
