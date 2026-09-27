import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ControlSize } from '../Button/Button';
import type { ItemDescriptor } from '../Collection/item.types';
import { ToggleGroup } from './ToggleGroup';

const options = [
  {
    id: 'confirmed',
    label: 'Confirmed',
  },
  {
    id: 'pending',
    label: 'Pending',
  },
  {
    disabled: true,
    id: 'archived',
    label: 'Archived',
  },
] satisfies ItemDescriptor[];

const sizes = ['sm', 'md', 'lg'] satisfies ControlSize[];

const meta = {
  args: {
    'aria-label': 'Transaction status',
    defaultSelected: options[0],
    getItem: (item: unknown) => item as ItemDescriptor,
    items: options,
  },
  component: ToggleGroup,
  title: 'Actions/ToggleGroup',
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single-choice set of connected segmented options. */
export const Default: Story = {};

/** All shared sizes use the same segmented treatment. */
export const Sizes: Story = {
  render: () => (
    <div className="breeze-story-stack">
      {sizes.map((size) => (
        <ToggleGroup
          aria-label={`Transaction status · ${size}`}
          defaultSelected={options[0]}
          getItem={(item) => item}
          items={options}
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
};

/** Descriptor-disabled options cannot be selected. */
export const DisabledOption: Story = {};

function ControlledExample() {
  const [selected, setSelected] = useState<(typeof options)[number] | null>(
    options[0],
  );

  return (
    <div className="breeze-story-action">
      <ToggleGroup
        aria-label="Transaction status"
        getItem={(item) => item}
        items={options}
        onChange={setSelected}
        selected={selected}
      />
      <p role="status">Current selection: {selected?.label ?? 'none'}</p>
    </div>
  );
}

/** Controlled use reports the selected item or `null` when cleared. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
