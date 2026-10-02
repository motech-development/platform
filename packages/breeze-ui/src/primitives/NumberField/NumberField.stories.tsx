import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberField } from './NumberField';

const meta = {
  args: {
    defaultValue: 2,
    label: 'Quantity',
    step: 1,
  },
  component: NumberField,
  title: 'Forms/NumberField',
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Locale-aware numeric entry; the arrow keys step the value. */
export const Default: Story = {};

/** Supporting guidance is announced with the spinbutton. */
export const Description: Story = {
  args: {
    description: 'Choose the number of seats for this workspace.',
  },
};

/** A visible error marks the field invalid and is announced with the input. */
export const Error: Story = {
  args: {
    error: 'Choose at least one seat.',
  },
};

/** Disabled fields cannot receive input or arrow-key stepping. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** Read-only values retain their form semantics without editing. */
export const ReadOnly: Story = {
  args: {
    defaultValue: 12,
    readOnly: true,
  },
};

/** Required state is exposed to assistive technology. */
export const Required: Story = {
  args: {
    required: true,
  },
};

/** Loading preserves the numeric control shape while preventing interaction. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

const moneyFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

/** The large size gives a form's primary amount 52px and 20px semibold figures. */
export const Large: Story = {
  render: () => (
    <div className="breeze-story-amount-pair">
      <NumberField
        defaultValue={120}
        formatOptions={moneyFormat}
        label="Amount, including VAT"
        size="lg"
        step={0.01}
      />
      <NumberField
        defaultValue={20}
        formatOptions={moneyFormat}
        label="VAT paid"
        size="lg"
        step={0.01}
      />
    </div>
  ),
};

/** Loading keeps the large control's height. */
export const LargeLoading: Story = {
  args: {
    loading: true,
    size: 'lg',
  },
};

function ControlledExample() {
  const [value, setValue] = useState(2);

  return (
    <div className="breeze-story-action">
      <NumberField label="Quantity" onChange={setValue} value={value} />
      <output>Current value: {value}</output>
    </div>
  );
}

/** The application owns the value and receives semantic number changes. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
