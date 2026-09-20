import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ItemDescriptor } from '../Collection/item.types';
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
