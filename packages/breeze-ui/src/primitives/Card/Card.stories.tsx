import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Card } from './Card';

const meta = {
  args: {
    children: (
      <Stack gap={1}>
        <Typography variant="title">Release notes</Typography>
        <Typography tone="secondary" variant="body">
          Updated guidance for three components
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
