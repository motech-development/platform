import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import type { ItemDescriptor } from '../../collections/item.types';
import { ComboBox } from './ComboBox';

const suppliers = [
  {
    badge: {
      children: 'Preferred',
      variant: 'positive' as const,
    },
    description: 'Preferred supplier',
    icon: 'building' as const,
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

const meta = {
  args: {
    getItem: (item: unknown) => item as ItemDescriptor,
    items: suppliers,
    label: 'Supplier',
    placeholder: 'Search suppliers',
  },
  component: ComboBox,
  title: 'Forms/ComboBox',
} satisfies Meta<typeof ComboBox>;

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

/** A filterable suggestion field. */
export const Default: Story = {};

/** Supporting guidance is announced with the input. */
export const Description: Story = {
  args: {
    description: 'Choose a saved supplier or enter a new name.',
  },
};

/** A visible error marks the field invalid. */
export const Error: Story = {
  args: {
    error: 'Enter a supplier.',
  },
};

/** Free text is accepted while matching suggestions remain available. */
export const FreeText: Story = {
  args: {
    allowsCustomValue: true,
    placeholder: 'Search or enter a name',
  },
};

/** A read-only suggestion field keeps its value on a sunken ground. */
export const ReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyGroup = canvas
      .getByRole('combobox', { name: 'Recorded supplier' })
      .closest<HTMLElement>('[role="group"]');
    const editableGroup = canvas
      .getByRole('combobox', { name: 'Supplier' })
      .closest<HTMLElement>('[role="group"]');

    if (!readOnlyGroup || !editableGroup) {
      throw new globalThis.Error('Each combobox must render its field group.');
    }

    const readOnlyBackground = getComputedStyle(readOnlyGroup).backgroundColor;

    await expect(readOnlyBackground).not.toBe(
      getComputedStyle(editableGroup).backgroundColor,
    );
    await expect(readOnlyBackground).toBe(
      resolvedTokenColour(readOnlyGroup, '--breeze-color-breeze-sunken'),
    );
  },
  render: () => (
    <div className="breeze-story-stack">
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={(item) => item}
        items={suppliers}
        label="Recorded supplier"
        readOnly
      />
      <ComboBox
        defaultValue={suppliers[0]}
        getItem={(item) => item}
        items={suppliers}
        label="Supplier"
      />
    </div>
  ),
};

/** Loading keeps the input footprint while preventing interaction. */
export const Loading: Story = {
  args: {
    defaultValue: suppliers[0],
    loading: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState<
    (typeof suppliers)[number] | string | null
  >(null);

  return (
    <div className="breeze-story-action">
      <ComboBox
        allowsCustomValue
        getItem={(item) => item}
        items={suppliers}
        label="Supplier"
        onChange={setValue}
        placeholder="Search or enter a name"
        value={value}
      />
      <output>
        Current value:{' '}
        {typeof value === 'string' ? value : value?.label ?? 'none'}
      </output>
    </div>
  );
}

/** The application owns the selected item or free-text value. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
