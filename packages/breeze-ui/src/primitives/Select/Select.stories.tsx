import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ItemDescriptor } from '../Collection/item.types';
import { Select } from './Select';

const choices = [
  {
    badge: {
      children: 'Primary',
      variant: 'brand' as const,
    },
    description: 'Current account ending in 1234',
    icon: 'money' as const,
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

/** Disabled descriptors remain visible but cannot be selected. */
export const Disabled: Story = {};

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
