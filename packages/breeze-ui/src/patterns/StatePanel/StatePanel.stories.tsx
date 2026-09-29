import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { StatePanel } from './StatePanel';

function EmptyActionExample() {
  const [created, setCreated] = useState(false);

  if (created) {
    return <p role="status">The first category was created.</p>;
  }

  return (
    <StatePanel
      action={{
        label: 'Create category',
        onAction: () => setCreated(true),
      }}
      description="Create a category to organize your records."
      title="No categories yet"
      variant="empty"
    />
  );
}

function ErrorRecoveryExample() {
  const [recovered, setRecovered] = useState(false);

  if (recovered) {
    return <p role="status">Records are available.</p>;
  }

  return (
    <StatePanel
      action={{
        label: 'Try again',
        onAction: () => setRecovered(true),
      }}
      description="Your records could not be loaded."
      title="Records are unavailable"
      variant="error"
    />
  );
}

const meta = {
  args: {
    description: 'Create a category to organize your records.',
    title: 'No categories yet',
    variant: 'empty',
  },
  component: StatePanel,
  title: 'States/StatePanel',
} satisfies Meta<typeof StatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An empty state with app-owned copy and no action control. */
export const Empty: Story = {};

/** An empty state with one working primary action. */
export const EmptyWithAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Create category' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'The first category was created.',
    );
  },
  render: () => <EmptyActionExample />,
};

/** A persistent error state with no recovery action available. */
export const Error: Story = {
  args: {
    description: 'Your records could not be loaded. Try again later.',
    title: 'Records are unavailable',
    variant: 'error',
  },
};

/** An error state whose recovery action updates the visible state. */
export const ErrorWithRecovery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Records are available.',
    );
  },
  render: () => <ErrorRecoveryExample />,
};

/** Override the default empty-state artwork with another curated icon. */
export const CustomIcon: Story = {
  args: {
    description: 'Add a first attachment to this record.',
    icon: 'upload',
    title: 'No attachments yet',
    variant: 'empty',
  },
};
