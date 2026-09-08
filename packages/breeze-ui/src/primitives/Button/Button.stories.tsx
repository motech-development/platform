import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, type ButtonVariant, type ControlSize } from './Button';

const meta = {
  args: {
    children: 'Save changes',
  },
  component: Button,
  title: 'Actions/Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default variant and size. */
export const Primary: Story = {};

/** A neutral alternative to the primary action. */
export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

/** A low-emphasis action. */
export const Quiet: Story = {
  args: {
    children: 'View details',
    variant: 'quiet',
  },
};

/** A destructive action. */
export const Danger: Story = {
  args: {
    children: 'Delete item',
    variant: 'danger',
  },
};

/** Every variant at each size. */
export const TreatmentsAndSizes: Story = {
  render: () => (
    <div className="gap-breeze-6 flex flex-col">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map((size) => (
        <div className="gap-breeze-3 flex flex-wrap items-center" key={size}>
          {(
            [
              'primary',
              'secondary',
              'quiet',
              'danger',
            ] satisfies ButtonVariant[]
          ).map((variant) => (
            <Button key={variant} size={size} variant={variant}>
              {`${variant} · ${size}`}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Every variant and size while loading. */
export const Loading: Story = {
  render: () => (
    <div className="gap-breeze-6 flex flex-col">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map((size) => (
        <div className="gap-breeze-3 flex flex-wrap items-center" key={size}>
          {(
            [
              'primary',
              'secondary',
              'quiet',
              'danger',
            ] satisfies ButtonVariant[]
          ).map((variant) => (
            <Button key={variant} loading size={size} variant={variant}>
              {`${variant} · ${size}`}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** A button that cannot be activated. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** A label that wraps onto a second line. */
export const LongLabel: Story = {
  args: {
    children: 'Save all changes and return to the previous screen',
    variant: 'secondary',
  },
};

function ActionExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="gap-breeze-3 flex flex-col items-start">
      <Button onAction={() => setCount((value) => value + 1)}>
        Save changes
      </Button>
      <p role="status">{count} actions completed</p>
    </div>
  );
}

/** `onAction` updating application state. */
export const Activation: Story = {
  render: () => <ActionExample />,
};
