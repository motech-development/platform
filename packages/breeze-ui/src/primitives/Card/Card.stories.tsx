import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Card } from './Card';

const meta = {
  args: {
    children: (
      <Stack gap={1}>
        <Typography variant="title">Recent activity</Typography>
        <Typography tone="secondary" variant="body">
          Three confirmed transactions
        </Typography>
      </Stack>
    ),
  },
  component: Card,
  title: 'Content/Card',
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default surface card with panel elevation. */
export const Surface: Story = {};

/** A raised neutral card for content nested within a surface. */
export const Raised: Story = {
  args: {
    variant: 'raised',
  },
};

/** Preserves the card surface while its content is loading. */
export const Loading: Story = {
  args: { loading: true },
};
