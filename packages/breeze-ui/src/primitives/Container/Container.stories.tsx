import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../Typography/Typography';
import { Container } from './Container';

const meta = {
  args: {
    children: (
      <Typography variant="body">
        Container centres content and gives page layouts their responsive inline
        padding.
      </Typography>
    ),
  },
  component: Container,
  title: 'Layout/Container',
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The 1500px page boundary with responsive page padding. */
export const Page: Story = {};

/** A narrower measure for sustained reading. */
export const Reading: Story = {
  args: {
    width: 'read',
  },
};
