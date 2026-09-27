import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { ControlSize } from '../Button/Button';
import { Button } from '../Button/Button';
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
    getItem: (item) => item,
    items: options,
  },
  component: ToggleGroup,
  title: 'Actions/ToggleGroup',
} satisfies Meta<typeof ToggleGroup<ItemDescriptor>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A set of connected options with one current selection. */
export const Default: Story = {};

function LoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="breeze-story-action">
      <ToggleGroup
        aria-label="Transaction status"
        defaultSelected={options[0]}
        getItem={(item) => item}
        items={options}
        loading={loading}
      />
      <Button onAction={() => setLoading((current) => !current)}>
        {loading ? 'Finish saving selection' : 'Save selection again'}
      </Button>
    </div>
  );
}

/** The selected appearance and option sizes stay in place while saving. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Transaction status' });
    const optionButtons = within(group).getAllByRole('button');
    const loadingBounds = optionButtons.map((button) =>
      button.getBoundingClientRect(),
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Finish saving selection' }),
    );
    await expect(group).not.toHaveAttribute('aria-busy');

    const readyBounds = optionButtons.map((button) =>
      button.getBoundingClientRect(),
    );
    await expect(
      readyBounds.map(({ height, width }) => [width, height]),
    ).toEqual(loadingBounds.map(({ height, width }) => [width, height]));

    await userEvent.click(
      canvas.getByRole('button', { name: 'Save selection again' }),
    );
    await expect(group).toHaveAttribute('aria-busy', 'true');
  },
  render: () => <LoadingExample />,
};

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

/** Disabled options cannot be selected. */
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

/** The current selection appears below the group. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
