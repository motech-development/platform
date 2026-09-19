import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextField } from './TextField';

const meta = {
  args: {
    label: 'Display name',
  },
  component: TextField,
  title: 'Forms/TextField',
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single-line text input with a persistent accessible label. */
export const Default: Story = {};

/** Supporting guidance is announced with the input. */
export const Description: Story = {
  args: {
    description: 'Use the name shown to other members of your team.',
  },
};

/** A visible error marks the field invalid and is announced with the input. */
export const Error: Story = {
  args: {
    error: 'Enter a display name.',
  },
};

/** Disabled fields cannot receive input. */
export const Disabled: Story = {
  args: {
    defaultValue: 'Unavailable',
    disabled: true,
  },
};

/** Read-only fields retain focus and form participation without editing. */
export const ReadOnly: Story = {
  args: {
    defaultValue: 'Application-owned value',
    readOnly: true,
  },
};

/** Required state is exposed to assistive technology. */
export const Required: Story = {
  args: {
    required: true,
  },
};

/** Loading preserves the input shape while preventing interaction. */
export const Loading: Story = {
  args: {
    defaultValue: 'Loading value',
    loading: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState('Ada Lovelace');

  return (
    <div className="breeze-story-action">
      <TextField label="Display name" onChange={setValue} value={value} />
      <output>Current value: {value}</output>
    </div>
  );
}

/** The application owns the value and receives semantic string changes. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
