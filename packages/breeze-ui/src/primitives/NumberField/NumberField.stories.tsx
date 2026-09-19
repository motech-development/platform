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

/** Locale-aware numeric entry with increment and decrement controls. */
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

/** Disabled fields cannot receive input or stepper actions. */
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
