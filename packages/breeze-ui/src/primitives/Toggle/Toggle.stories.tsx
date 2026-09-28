import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { ControlSize } from '../Button/Button';
import { Button } from '../Button/Button';
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

/** The control is available in three sizes. */
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

function LoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="breeze-story-action">
      <Toggle defaultPressed loading={loading}>
        Remember this device
      </Toggle>
      <Button onAction={() => setLoading((current) => !current)}>
        {loading ? 'Finish saving' : 'Save again'}
      </Button>
    </div>
  );
}

/** A choice keeps its size and selected appearance while saving. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    await document.fonts.ready;

    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', {
      name: 'Remember this device',
    });
    const loadingBounds = toggle.getBoundingClientRect();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Finish saving' }),
    );
    await expect(toggle).not.toHaveAttribute('aria-busy');

    const readyBounds = toggle.getBoundingClientRect();
    await expect(readyBounds.width).toBe(loadingBounds.width);
    await expect(readyBounds.height).toBe(loadingBounds.height);

    await userEvent.click(canvas.getByRole('button', { name: 'Save again' }));
    await expect(toggle).toHaveAttribute('aria-busy', 'true');
  },
  render: () => <LoadingExample />,
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

/** The current pressed state appears below the control. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
