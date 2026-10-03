import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { ItemDescriptor } from '../../collections/item.types';
import { Select } from './Select';

const choices = [
  {
    badge: {
      children: 'Primary',
      variant: 'brand' as const,
    },
    description: 'Current account ending in 1234',
    icon: 'list' as const,
    id: 'bank',
    label: 'Bank account',
  },
  {
    id: 'cash',
    label: 'Cash',
  },
  {
    disabled: true,
    id: 'card',
    label: 'Card',
  },
] satisfies ItemDescriptor[];

const meta = {
  args: {
    getItem: (item: unknown) => item as ItemDescriptor,
    items: choices,
    label: 'Payment method',
    placeholder: 'Select a payment method',
  },
  component: Select,
  title: 'Forms/Select',
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function resolvedTokenColour(element: HTMLElement, token: string) {
  const probe = element.ownerDocument.createElement('span');

  probe.style.backgroundColor = `var(${token})`;
  element.after(probe);

  const colour = getComputedStyle(probe).backgroundColor;

  probe.remove();

  return colour;
}

/** A fixed-choice field backed by a popover listbox. */
export const Default: Story = {};

/** Descriptions and descriptor content are announced with the field. */
export const Description: Story = {
  args: {
    description: 'Choose the account used for this payment.',
  },
};

/** A visible error marks the field invalid. */
export const Error: Story = {
  args: {
    error: 'Choose a payment method.',
  },
};

/** Disabled fields cannot be opened or changed. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** A read-only choice stays focusable and submitted on a sunken ground. */
export const ReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyTrigger = canvas.getByRole('button', {
      name: 'Bank account Primary Recorded payment method',
    });
    const editableTrigger = canvas.getByRole('button', {
      name: 'Bank account Primary Payment method',
    });
    const readOnlyBackground =
      getComputedStyle(readOnlyTrigger).backgroundColor;

    await expect(readOnlyBackground).not.toBe(
      getComputedStyle(editableTrigger).backgroundColor,
    );
    await expect(readOnlyBackground).toBe(
      resolvedTokenColour(readOnlyTrigger, '--breeze-color-breeze-sunken'),
    );
    await expect(getComputedStyle(readOnlyTrigger).color).toBe(
      resolvedTokenColour(readOnlyTrigger, '--breeze-color-breeze-ink-2'),
    );
  },
  render: () => (
    <div className="breeze-story-stack">
      <Select
        defaultValue={choices[0]}
        getItem={(item) => item}
        items={choices}
        label="Recorded payment method"
        name="recordedPayment"
        readOnly
      />
      <Select
        defaultValue={choices[0]}
        getItem={(item) => item}
        items={choices}
        label="Payment method"
      />
    </div>
  ),
};

/** The open listbox marks the selected option in semibold brand text with a check. */
export const SelectedOption: Story = {
  args: {
    defaultValue: choices[1],
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Payment method/ }),
    );

    const listbox = within(
      await within(canvasElement.ownerDocument.body).findByRole('listbox'),
    );
    const measure = (option: HTMLElement) => {
      const style = getComputedStyle(option);

      return {
        background: style.backgroundColor,
        borderRadius: style.borderRadius,
        fontWeight: style.fontWeight,
        // The computed size ignores the popover's entry transform.
        height: style.height,
        paddingInline: style.paddingInlineStart,
      };
    };
    const selected = listbox.getByRole('option', { name: /Cash/ });

    await expect(measure(selected)).toEqual({
      background: resolvedTokenColour(
        selected,
        '--breeze-color-breeze-brand-soft',
      ),
      borderRadius: '6px',
      fontWeight: '600',
      height: '34.5625px',
      paddingInline: '10px',
    });
    await expect(
      measure(listbox.getByRole('option', { name: /Card/ })),
    ).toMatchObject({ fontWeight: '400', height: '34.5625px' });
  },
};

const categories = [
  { badge: { children: '20% VAT' }, id: 'vehicle', label: 'Vehicle' },
  { badge: { children: '0% VAT' }, id: 'travel', label: 'Travel' },
] satisfies ItemDescriptor[];

/** The selected item's badge stays at the end of the trigger, before the chevron. */
export const SelectedBadge: Story = {
  args: {
    defaultValue: categories[0],
    items: categories,
    label: 'Category',
    placeholder: 'Select a category',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Vehicle 20% VAT Category',
    });
    const badge = within(trigger).getByText('20% VAT').parentElement;

    if (!badge) {
      throw new globalThis.Error('The trigger must render the badge.');
    }

    const style = getComputedStyle(badge);

    await expect({
      fontWeight: style.fontWeight,
      paddingInline: style.paddingInlineStart,
    }).toEqual({ fontWeight: '700', paddingInline: '8px' });
  },
};

/** Loading keeps the control footprint while preventing interaction. */
export const Loading: Story = {
  args: {
    defaultValue: choices[0],
    loading: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState<(typeof choices)[number] | null>(null);

  return (
    <div className="breeze-story-action">
      <Select
        getItem={(item) => item}
        items={choices}
        label="Payment method"
        onChange={setValue}
        placeholder="Select a payment method"
        value={value}
      />
      <output>Current value: {value?.label ?? 'none'}</output>
    </div>
  );
}

/** The application owns the selected item and receives semantic changes. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
