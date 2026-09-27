import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ControlSize } from '../Button/Button';
import { Toggle } from './Toggle';

const sizes = ['sm', 'md', 'lg'] satisfies ControlSize[];

const meta = {
  args: {
    children: 'Remember this device',
  },
  component: Toggle,
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A binary choice presented as a button with a pressed state. */
export const Default: Story = {};

/** Starts with the choice pressed. */
export const Pressed: Story = {
  args: {
    defaultPressed: true,
  },
};

/** Each supported size preserves an instant state change. */
export const Sizes: Story = {
  render: () => (
    <div className="breeze-story-stack">
      {sizes.map((size) => (
        <Toggle key={size} size={size}>
          {`Remember · ${size}`}
        </Toggle>
      ))}
    </div>
  ),
};

/** A disabled toggle cannot change its pressed state. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

function ControlledExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="breeze-story-action">
      <Toggle onChange={setPressed} pressed={pressed}>
        Remember this device
      </Toggle>
      <p role="status">{pressed ? 'Remembered' : 'Not remembered'}</p>
    </div>
  );
}

/** Controlled use reports a semantic boolean to the application. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
