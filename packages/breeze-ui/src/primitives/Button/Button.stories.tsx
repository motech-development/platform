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

/** The default action, with a visible label and medium target. */
export const Primary: Story = {};

/** A neutral action with an outlined surface. */
export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

/** A low-emphasis action with brand-coloured text. */
export const Quiet: Story = {
  args: {
    children: 'View details',
    variant: 'quiet',
  },
};

/** A destructive action; the label explains what is removed. */
export const Danger: Story = {
  args: {
    children: 'Delete item',
    variant: 'danger',
  },
};

/** All four treatments at 34, 38 and 52px, with the coarse-pointer floor applied automatically. */
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

/** Each loading skeleton occupies its own label's space, preserving the target. */
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

/** Disabled actions cannot be activated and leave the keyboard tab order. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** Long translated labels can wrap and grow beyond the minimum target size. */
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

/** The semantic callback updates application-owned state without exposing an event. */
export const Activation: Story = {
  render: () => <ActionExample />,
};
