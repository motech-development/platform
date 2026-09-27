import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Inline } from '../Inline/Inline';
import { Chip } from './Chip';

const meta = {
  args: {
    children: 'Needs receipt',
  },
  component: Chip,
  title: 'Actions/Chip',
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

function FilterExample() {
  const [filters, setFilters] = useState({
    overdue: false,
    receipt: true,
    scheduled: false,
  });

  return (
    <div className="breeze-story-action">
      <Inline gap={2} wrap>
        <Chip
          onChange={(pressed) =>
            setFilters((current) => ({ ...current, receipt: pressed }))
          }
          pressed={filters.receipt}
        >
          Needs receipt
        </Chip>
        <Chip
          onChange={(pressed) =>
            setFilters((current) => ({ ...current, overdue: pressed }))
          }
          pressed={filters.overdue}
        >
          Overdue
        </Chip>
        <Chip
          onChange={(pressed) =>
            setFilters((current) => ({ ...current, scheduled: pressed }))
          }
          pressed={filters.scheduled}
        >
          Scheduled
        </Chip>
      </Inline>
      <p role="status">
        Active filters: {Object.values(filters).filter(Boolean).length}
      </p>
    </div>
  );
}

/** An unselected pill-shaped filter. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByRole('button', {
      name: 'Needs receipt',
    });

    await expect(getComputedStyle(chip).minBlockSize).toBe('34px');
  },
};

/** A selected chip uses the selected-filter colours. */
export const Pressed: Story = {
  args: {
    defaultPressed: true,
  },
};

function LoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="breeze-story-action">
      <Chip defaultPressed loading={loading}>
        Needs receipt
      </Chip>
      <Button onAction={() => setLoading((current) => !current)}>
        {loading ? 'Finish saving filters' : 'Save filters again'}
      </Button>
    </div>
  );
}

/** A filter keeps its size and selected appearance while saving. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Needs receipt' });
    const loadingBounds = chip.getBoundingClientRect();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Finish saving filters' }),
    );
    await expect(chip).not.toHaveAttribute('aria-busy');

    const readyBounds = chip.getBoundingClientRect();
    await expect(readyBounds.width).toBe(loadingBounds.width);
    await expect(readyBounds.height).toBe(loadingBounds.height);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Save filters again' }),
    );
    await expect(chip).toHaveAttribute('aria-busy', 'true');
  },
  render: () => <LoadingExample />,
};

/** Independent chips can be combined to refine a filter. */
export const FilterRow: Story = {
  render: () => <FilterExample />,
};

/** A disabled chip cannot be activated. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
