import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import type { ControlSize } from '../Button/Button';
import {
  IconButton,
  type IconButtonShape,
  type IconButtonVariant,
} from './IconButton';

const treatments = [
  'secondary',
  'primary',
  'quiet',
  'danger',
] satisfies IconButtonVariant[];
const sizes = ['sm', 'md', 'lg'] satisfies ControlSize[];

const meta = {
  args: {
    label: 'Close',
    name: 'close',
  },
  component: IconButton,
  title: 'Actions/IconButton',
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default treatment and size. */
export const Default: Story = {};

/** Every treatment at each size. */
export const TreatmentsAndSizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const edges = sizes.map((size) => {
      const { height, width } = canvas
        .getByRole('button', { name: `More actions, secondary ${size}` })
        .getBoundingClientRect();

      return [height, width];
    });

    await expect(edges).toEqual([
      [32, 32],
      [36, 36],
      [52, 52],
    ]);
  },
  render: () => (
    <div className="breeze-story-stack">
      {sizes.map((size) => (
        <div className="breeze-story-row" key={size}>
          {treatments.map((variant) => (
            <IconButton
              key={variant}
              label={`More actions, ${variant} ${size}`}
              name="more"
              size={size}
              variant={variant}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** A rounded square, and a circle for a standalone primary action. */
export const Shapes: Story = {
  render: () => (
    <div className="breeze-story-row">
      {(['square', 'circle'] satisfies IconButtonShape[]).map((shape) => (
        <IconButton
          key={shape}
          label={`Create item, ${shape}`}
          name="add"
          shape={shape}
          size="lg"
          variant="primary"
        />
      ))}
    </div>
  ),
};

/** Every treatment and size while loading. */
export const Loading: Story = {
  render: () => (
    <div className="breeze-story-stack">
      {sizes.map((size) => (
        <div className="breeze-story-row" key={size}>
          {treatments.map((variant) => (
            <IconButton
              key={variant}
              label={`Download, ${variant} ${size}`}
              loading
              name="download"
              size={size}
              variant={variant}
            />
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
    label: 'Delete',
    name: 'delete',
  },
};

function ActionExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="breeze-story-action">
      <IconButton
        label="Add item"
        name="add"
        onAction={() => setCount((value) => value + 1)}
      />
      <p role="status">{count} items added</p>
    </div>
  );
}

/** `onAction` updating application state. */
export const Activation: Story = {
  render: () => <ActionExample />,
};
