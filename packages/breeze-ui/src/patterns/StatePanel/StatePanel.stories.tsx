import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { InfoIcon, WarningIcon } from '../../icons';
import { Button } from '../../primitives/Button/Button';
import { StatePanel } from './StatePanel';

/**
 * Replaces a complete content region with contextual guidance and an optional
 * application-owned recovery or next-step action.
 *
 * @summary complete contextual state with guidance and optional recovery
 */
const meta = {
  component: StatePanel,
  title: 'Patterns/Feedback/StatePanel',
} satisfies Meta<typeof StatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Explains an empty content region with an informational marker, constructive
 * guidance, and a primary next step for creating the first item.
 *
 * @summary empty state with guidance and constructive next action
 */
export const Empty: Story = {
  args: {
    action: <Button>Create item</Button>,
    description: 'Create the first item to begin using this screen.',
    icon: <InfoIcon />,
    title: 'No items yet',
  },
  play: async ({ canvasElement }) => {
    const marker = within(canvasElement)
      .getByRole('region', { name: 'No items yet' })
      .querySelector<HTMLElement>('[data-size="lg"]');

    await expect(marker).not.toBeNull();
    await expect(marker?.getBoundingClientRect().width).toBe(
      marker?.getBoundingClientRect().height,
    );
    await expect(marker?.getBoundingClientRect().width).toBeGreaterThan(0);
  },
};

/**
 * Communicates a recoverable loading failure with danger emphasis, concise
 * connection guidance, and a retry action owned by the application.
 *
 * @summary recoverable error state with danger marker and retry action
 */
export const Error: Story = {
  args: {
    action: <Button>Try again</Button>,
    description: 'Check your connection, then try again.',
    icon: <WarningIcon />,
    title: 'We could not load the content',
    variant: 'danger',
  },
};
