import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { ControlSize } from '../Button/Button';
import { Button } from '../Button/Button';
import type { ItemDescriptor } from '../Collection/item.types';
import { Toggle } from '../Toggle/Toggle';
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

const loadingOptions = [
  {
    ...options[0],
    badge: { children: 'Saved', variant: 'positive' },
    description: 'The confirmed transaction has been saved.',
    icon: 'check',
  },
  ...options.slice(1),
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
    <div className="breeze-story-stack">
      <div className="breeze-story-action">
        <Toggle defaultPressed loading={loading}>
          Remember this device
        </Toggle>
        <ToggleGroup
          aria-label="Transaction status"
          defaultSelected={loadingOptions[0]}
          getItem={(item) => item}
          items={loadingOptions}
          loading={loading}
        />
      </div>
      <Button onAction={() => setLoading((current) => !current)}>
        {loading ? 'Finish saving selection' : 'Save selection again'}
      </Button>
    </div>
  );
}

/** Toggle and ToggleGroup use the same loading bar and preserve their size. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', {
      name: 'Remember this device',
    });
    const group = canvas.getByRole('group', { name: 'Transaction status' });
    const optionButtons = within(group).getAllByRole('button');
    const loadingBounds = [toggle, ...optionButtons].map((button) => {
      const { height, width } = button.getBoundingClientRect();
      return [width, height];
    });
    const toggleLoadingBar = toggle.querySelector(
      '[data-breeze-skeleton] > progress',
    );
    const groupLoadingBars = Array.from(
      group.querySelectorAll('[data-breeze-skeleton] > progress'),
    );
    const toggleBarHeight = toggleLoadingBar?.getBoundingClientRect().height;

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(optionButtons[0]).toHaveAttribute('aria-pressed', 'true');
    await expect(toggleBarHeight).toBe(12);
    await expect(
      groupLoadingBars.map((bar) => bar.getBoundingClientRect().height),
    ).toEqual(groupLoadingBars.map(() => toggleBarHeight));

    await userEvent.click(
      canvas.getByRole('button', { name: 'Finish saving selection' }),
    );
    await expect(group).not.toHaveAttribute('aria-busy');
    await expect(toggle).not.toHaveAttribute('aria-busy');

    const readyBounds = [toggle, ...optionButtons].map((button) => {
      const { height, width } = button.getBoundingClientRect();
      return [width, height];
    });
    await expect(readyBounds).toEqual(loadingBounds);
    await expect(optionButtons[0]).toHaveAccessibleName(
      'Confirmed The confirmed transaction has been saved. Saved',
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Save selection again' }),
    );
    await expect(group).toHaveAttribute('aria-busy', 'true');
    await expect(toggle).toHaveAttribute('aria-busy', 'true');
    await expect(
      Array.from(group.querySelectorAll('[data-breeze-skeleton] > progress')),
    ).toHaveLength(optionButtons.length);
    await expect(
      Array.from(
        group.querySelectorAll('[data-breeze-skeleton] > progress'),
      ).map((bar) => bar.getBoundingClientRect().height),
    ).toEqual(groupLoadingBars.map(() => 12));
    await expect(
      [toggle, ...optionButtons].map((button) => {
        const { height, width } = button.getBoundingClientRect();
        return [width, height];
      }),
    ).toEqual(readyBounds);
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
