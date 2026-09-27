import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
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
