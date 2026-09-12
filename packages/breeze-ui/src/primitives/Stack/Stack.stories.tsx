import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Stack } from './Stack';

const meta = {
  args: {
    children: (
      <>
        <Card>First item</Card>
        <Card>Second item</Card>
        <Card>Third item</Card>
      </>
    ),
  },
  component: Stack,
  title: 'Layout/Stack',
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A vertical stack using the default three-token gap. */
export const Default: Story = {};

/** Content centred along the horizontal axis. */
export const Centred: Story = {
  args: {
    horizontalAlign: 'center',
  },
};
